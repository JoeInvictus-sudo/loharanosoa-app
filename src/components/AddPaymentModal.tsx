"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface AddPaymentModalProps {
  onClose: () => void;
}

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  classe_id: string | null;
  classes: { nom: string; frais_mensuels: number } | null;
}

const MOIS_SCOLAIRES = [
  "Septembre", "Octobre", "Novembre", "Décembre",
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
];

export default function AddPaymentModal({ onClose }: AddPaymentModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eleves, setEleves] = useState<Eleve[]>([]);

  // Champs du formulaire
  const [eleveId, setEleveId] = useState("");
  const [searchEleve, setSearchEleve] = useState("");
  const [showListe, setShowListe] = useState(false);
  
  // Gestion des mois (Maintenant un tableau pour le multi-sélection)
  const [moisSelectionnes, setMoisSelectionnes] = useState<string[]>([]);
  const [moisDejaPayes, setMoisDejaPayes] = useState<string[]>([]);
  const [loadingMois, setLoadingMois] = useState(false);

  const [methode, setMethode] = useState("especes");

  // Charger les élèves avec leur classe
  useEffect(() => {
    async function fetchEleves() {
      const { data } = await supabase
        .from("eleves")
        .select(`
          id, nom, prenom, matricule, classe_id,
          classes ( nom, frais_mensuels )
        `)
        .eq("statut", "actif")
        .order("nom", { ascending: true });
      
      if (data) setEleves(data as unknown as Eleve[]);
    }
    fetchEleves();
  }, [supabase]);

  // CORRECTION 1 : Filtrer les élèves
  const filteredEleves = useMemo(() => {
    if (!searchEleve) return eleves.slice(0, 50);
    const lowerSearch = searchEleve.toLowerCase();
    return eleves.filter(
      (e) =>
        e.nom.toLowerCase().includes(lowerSearch) ||
        e.prenom.toLowerCase().includes(lowerSearch) ||
        e.matricule.toLowerCase().includes(lowerSearch)
    );
  }, [eleves, searchEleve]);

  // CORRECTION 2 : Charger les mois déjà payés dès qu'on sélectionne un élève
  useEffect(() => {
    if (!eleveId) {
      setMoisDejaPayes([]);
      setMoisSelectionnes([]);
      return;
    }

    async function fetchPaiementsEleve() {
      setLoadingMois(true);
      const { data } = await supabase
        .from("paiements")
        .select("mois")
        .eq("eleve_id", eleveId)
        .eq("statut", "paye");

      if (data) {
        const payes = data.map((p) => p.mois);
        setMoisDejaPayes(payes);
        
        // On pré-sélectionne le mois en cours s'il n'est pas déjà payé
        const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });
        const currentMonthCapitalized = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
        if (!payes.includes(currentMonthCapitalized) && MOIS_SCOLAIRES.includes(currentMonthCapitalized)) {
          setMoisSelectionnes([currentMonthCapitalized]);
        } else {
          setMoisSelectionnes([]);
        }
      }
      setLoadingMois(false);
    }
    fetchPaiementsEleve();
  }, [eleveId, supabase]);

  // Calculer le montant total (Prix de la classe * Nombre de mois sélectionnés)
  const selectedEleve = eleves.find((e) => e.id === eleveId);
  const fraisMensuels = selectedEleve?.classes?.frais_mensuels ?? 0;
  const montantTotal = fraisMensuels * moisSelectionnes.length;

  function toggleMois(mois: string) {
    if (moisDejaPayes.includes(mois)) return; // Impossible de cocher un mois déjà payé
    setMoisSelectionnes((prev) =>
      prev.includes(mois) ? prev.filter((m) => m !== mois) : [...prev, mois]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eleveId || moisSelectionnes.length === 0) {
      setError("Veuillez sélectionner un élève et au moins un mois.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data: annee } = await supabase
      .from("annees_scolaires")
      .select("id")
      .eq("active", true)
      .single();

    if (!annee) {
      setError("Aucune année scolaire active trouvée.");
      setLoading(false);
      return;
    }

    const userId = (await supabase.auth.getUser()).data.user?.id;

    // Créer un tableau d'insertions (1 ligne par mois sélectionné)
    const insertions = moisSelectionnes.map((m) => ({
      eleve_id: eleveId,
      annee_scolaire_id: annee.id,
      mois: m,
      montant: fraisMensuels,
      methode,
      statut: "paye",
      encaisse_par: userId,
    }));

    const { error: insertError } = await supabase.from("paiements").insert(insertions);

    if (insertError) {
      setError("Erreur lors de l'enregistrement. Vérifiez que ces mois ne sont pas déjà payés.");
      setLoading(false);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "480px",
          boxShadow: "0 24px 64px rgba(15,23,42,0.25)", maxHeight: "90vh", overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
            Enregistrer un paiement
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94A3B8" }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Recherche Élève */}
          <div style={{ position: "relative" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Rechercher l'élève (Nom ou Matricule) *
            </label>
            <input
              type="text"
              placeholder="Ex: Rakoto ou 4889F"
              value={searchEleve}
              onChange={(e) => {
                setSearchEleve(e.target.value);
                setShowListe(true);
                if (e.target.value === "") setEleveId("");
              }}
              onFocus={() => setShowListe(true)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
            />

            {showListe && searchEleve && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, background: "white", 
                border: "1px solid #E2E8F0", borderRadius: "10px", marginTop: "4px",
                maxHeight: "200px", overflowY: "auto", zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
              }}>
                {filteredEleves.length === 0 ? (
                  <div style={{ padding: "10px 14px", fontSize: "13px", color: "#94A3B8" }}>Aucun élève trouvé</div>
                ) : (
                  filteredEleves.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => {
                        setEleveId(e.id);
                        setSearchEleve(`${e.nom} ${e.prenom}`);
                        setShowListe(false);
                      }}
                      style={{ padding: "10px 14px", fontSize: "13px", cursor: "pointer", borderBottom: "1px solid #F1F5F9", color: "#0F172A" }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.background = "#F8FAFC")}
                      onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                    >
                      <strong>{e.nom} {e.prenom}</strong> ({e.matricule})
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Info élève sélectionné */}
          {selectedEleve && (
            <div style={{ padding: "12px", background: "#EEF2FF", borderRadius: "10px", fontSize: "13px", color: "#4338CA" }}>
              Classe : <strong>{selectedEleve.classes?.nom}</strong> — Frais mensuels : <strong>{new Intl.NumberFormat("fr-FR").format(fraisMensuels)} Ar</strong>
            </div>
          )}

          {/* Sélection des mois (Multi-choix) */}
          {eleveId && !loadingMois && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Mois à payer (Cochez un ou plusieurs mois) *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {MOIS_SCOLAIRES.map((m) => {
                  const isPaid = moisDejaPayes.includes(m);
                  const isSelected = moisSelectionnes.includes(m);
                  
                  return (
                    <div
                      key={m}
                      onClick={() => !isPaid && toggleMois(m)}
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "center",
                        cursor: isPaid ? "not-allowed" : "pointer",
                        border: `1.5px solid ${isSelected ? "#4F46E5" : isPaid ? "#F1F5F9" : "#E2E8F0"}`,
                        background: isSelected ? "#EEF2FF" : isPaid ? "#F8FAFC" : "white",
                        color: isPaid ? "#94A3B8" : isSelected ? "#4338CA" : "#475569",
                        opacity: isPaid ? 0.6 : 1,
                        position: "relative"
                      }}
                    >
                      {m} {isPaid && "(Payé)"}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Méthode de paiement */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Méthode
            </label>
            <select
              value={methode}
              onChange={(e) => setMethode(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
            >
              <option value="especes">Espèces</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="virement">Virement</option>
              <option value="cheque">Chèque</option>
            </select>
          </div>

          {/* Total à payer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
              Total à payer ({moisSelectionnes.length} mois)
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#10B981" }}>
              {new Intl.NumberFormat("fr-FR").format(montantTotal)} Ar
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "10px", color: "#991B1B", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 20px", background: "#F1F5F9", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
              Annuler
            </button>
            <button type="submit" disabled={loading || moisSelectionnes.length === 0} style={{ padding: "10px 20px", background: (loading || moisSelectionnes.length === 0) ? "#94A3B8" : "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: (loading || moisSelectionnes.length === 0) ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {loading ? "Enregistrement..." : "Valider le paiement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}