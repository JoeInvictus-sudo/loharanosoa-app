"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface AddStudentModalProps {
  onClose: () => void;
}

interface Classe {
  id: string;
  nom: string;
  frais_mensuels: number;
}

const TOTAL_FRAIS_FIXES = 40000; // 28k + 7k + 5k

export default function AddStudentModal({ onClose }: AddStudentModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Classe[]>([]);

  // 1. Infos élève
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [sexe, setSexe] = useState("");
  const [classeId, setClasseId] = useState("");

  // 2. Infos parents
  const [pereNom, setPereNom] = useState("");
  const [mereNom, setMereNom] = useState("");
  const [parentTelephone, setParentTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  // 3. Paiements
  // Les frais fixes sont TOUJOURS pré-remplis (40 000 Ar par défaut)
  const [montantFraisFixesDonne, setMontantFraisFixesDonne] = useState<number>(TOTAL_FRAIS_FIXES);
  
  // Pour l'écolage : on ajoute une case à cocher. Par défaut à false (pas payé).
  const [inclureEcolage, setInclureEcolage] = useState(false);
  const [montantEcolageDonne, setMontantEcolageDonne] = useState<number>(0);
  
  const [methodePaiement, setMethodePaiement] = useState("especes");

  // Charger les classes
  useEffect(() => {
    async function fetchClasses() {
      const { data } = await supabase.from("classes").select("id, nom, frais_mensuels").order("nom");
      if (data) setClasses(data);
    }
    fetchClasses();
  }, [supabase]);

  // Générer un matricule automatique
  useEffect(() => {
    async function generateMatricule() {
      const { count } = await supabase.from("eleves").select("*", { count: "exact", head: true });
      const numero = ((count ?? 0) + 1).toString().padStart(3, "0");
      setMatricule(`LOH-2026-${numero}`);
    }
    generateMatricule();
  }, [supabase]);

  const selectedClasse = classes.find((c) => c.id === classeId);
  const fraisEcolage = selectedClasse?.frais_mensuels ?? 0;

  // Gérer le changement de classe pour pré-remplir le montant de l'écolage
  useEffect(() => {
    if (inclureEcolage && selectedClasse) {
      setMontantEcolageDonne(selectedClasse.frais_mensuels);
    }
  }, [classeId, selectedClasse, inclureEcolage]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Créer l'élève
    const { data: newEleve, error: insertError } = await supabase
      .from("eleves")
      .insert({
        nom, prenom, matricule, date_naissance: dateNaissance || null,
        lieu_naissance: lieuNaissance || null, sexe: sexe || null,
        classe_id: classeId || null, pere_nom: pereNom || null,
        mere_nom: mereNom || null, parent_telephone: parentTelephone || null,
        adresse: adresse || null, statut: "actif",
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // 2. Enregistrer les paiements
    if (newEleve) {
      const { data: annee } = await supabase.from("annees_scolaires").select("id").eq("active", true).single();
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const paiementsAInserer = [];

      // A. Frais fixes (toujours vérifiés)
      if (montantFraisFixesDonne > 0 && annee) {
        paiementsAInserer.push({
          eleve_id: newEleve.id, annee_scolaire_id: annee.id, mois: "Inscription",
          montant: montantFraisFixesDonne, methode: methodePaiement, statut: "paye", encaisse_par: userId,
        });
      }

      // B. Écolage (seulement si la case est cochée ET qu'un montant est saisi)
      if (inclureEcolage && montantEcolageDonne > 0 && annee) {
        const moisActuel = new Date().toLocaleString("fr-FR", { month: "long" });
        const moisActuelCapitalized = moisActuel.charAt(0).toUpperCase() + moisActuel.slice(1);
        paiementsAInserer.push({
          eleve_id: newEleve.id, annee_scolaire_id: annee.id, mois: moisActuelCapitalized,
          montant: montantEcolageDonne, methode: methodePaiement, statut: "paye", encaisse_par: userId,
        });
      }

      if (paiementsAInserer.length > 0) {
        await supabase.from("paiements").insert(paiementsAInserer);
      }
    }

    onClose();
    router.refresh();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(15,23,42,0.25)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Inscription d'un élève</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94A3B8" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* SECTION 1 : ÉLÈVE */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#4F46E5", marginBottom: "12px", borderBottom: "1px solid #F1F5F9", paddingBottom: "4px" }}>1. Informations de l'élève</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Nom *</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Prénom *</label>
                <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Matricule</label>
                <input type="text" value={matricule} readOnly style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box", background: "#F1F5F9" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Date naissance</label>
                <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Sexe</label>
                <select value={sexe} onChange={(e) => setSexe(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}>
                  <option value="">--</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Lieu de naissance</label>
                <input type="text" value={lieuNaissance} onChange={(e) => setLieuNaissance(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Classe</label>
                <select value={classeId} onChange={(e) => setClasseId(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}>
                  <option value="">-- Choisir --</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2 : PARENTS */}
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#4F46E5", marginBottom: "12px", borderBottom: "1px solid #F1F5F9", paddingBottom: "4px" }}>2. Informations des parents</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Nom du Père</label>
                <input type="text" value={pereNom} onChange={(e) => setPereNom(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Nom de la Mère</label>
                <input type="text" value={mereNom} onChange={(e) => setMereNom(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Téléphone</label>
                <input type="tel" value={parentTelephone} onChange={(e) => setParentTelephone(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Adresse</label>
                <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>

          {/* SECTION 3 : PAIEMENTS */}
          <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#4F46E5", marginBottom: "12px" }}>3. Encaissement à l'inscription</h3>
            
            {/* Frais Fixes (Toujours pré-remplis) */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#0F172A", fontWeight: "600", marginBottom: "4px" }}>
                <span>Frais fixes (Généraux, Carnet, FRAM) :</span>
                <span>40 000 Ar</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  type="number" 
                  value={montantFraisFixesDonne === 0 ? "" : montantFraisFixesDonne} 
                  onChange={(e) => setMontantFraisFixesDonne(Number(e.target.value))}
                  style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px" }} 
                />
                <span style={{ fontSize: "12px", color: "#EF4444", fontWeight: "600" }}>
                  Reste : {new Intl.NumberFormat("fr-FR").format(Math.max(0, TOTAL_FRAIS_FIXES - montantFraisFixesDonne))} Ar
                </span>
              </div>
            </div>

            {/* Écolage avec case à cocher */}
            <div style={{ marginBottom: "16px", borderTop: "1px dashed #E2E8F0", paddingTop: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px" }}>
                <input 
                  type="checkbox" 
                  checked={inclureEcolage} 
                  onChange={(e) => {
                    setInclureEcolage(e.target.checked);
                    if (!e.target.checked) setMontantEcolageDonne(0);
                  }} 
                  style={{ width: "16px", height: "16px" }} 
                />
                <span style={{ fontSize: "13px", color: "#0F172A", fontWeight: "600" }}>Inclure l'écolage du mois en cours</span>
              </label>

              {inclureEcolage && selectedClasse && (
                <div style={{ marginLeft: "24px" }}>
                  <label style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#0F172A", fontWeight: "600", marginBottom: "4px" }}>
                    <span>Montant payé :</span>
                    <span>Tarif classe : {new Intl.NumberFormat("fr-FR").format(fraisEcolage)} Ar</span>
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input 
                      type="number" 
                      value={montantEcolageDonne === 0 ? "" : montantEcolageDonne} 
                      onChange={(e) => setMontantEcolageDonne(Number(e.target.value))}
                      max={fraisEcolage}
                      style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px" }} 
                    />
                    <span style={{ fontSize: "12px", color: "#EF4444", fontWeight: "600" }}>
                      Reste : {new Intl.NumberFormat("fr-FR").format(Math.max(0, fraisEcolage - montantEcolageDonne))} Ar
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Méthode */}
            {(montantFraisFixesDonne > 0 || (inclureEcolage && montantEcolageDonne > 0)) && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Méthode de paiement</label>
                <select value={methodePaiement} onChange={(e) => setMethodePaiement(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}>
                  <option value="especes">Espèces</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="virement">Virement</option>
                  <option value="cheque">Chèque</option>
                </select>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "12px", marginTop: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>TOTAL ENCAISSÉ :</span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#10B981" }}>
                {new Intl.NumberFormat("fr-FR").format(montantFraisFixesDonne + (inclureEcolage ? montantEcolageDonne : 0))} Ar
              </span>
            </div>
          </div>

          {error && <div style={{ padding: "12px", background: "#FEE2E2", borderRadius: "10px", color: "#991B1B", fontSize: "13px" }}>{error}</div>}

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 20px", background: "#F1F5F9", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Annuler</button>
            <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: loading ? "#94A3B8" : "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Inscription..." : "Inscrire l'élève"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}