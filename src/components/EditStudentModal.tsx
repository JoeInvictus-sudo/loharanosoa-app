"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface EditStudentModalProps {
  eleve: any;
  onClose: () => void;
}

interface Classe {
  id: string;
  nom: string;
}

export default function EditStudentModal({ eleve, onClose }: EditStudentModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Classe[]>([]);

  // Champs du formulaire (pré-remplis avec les données existantes)
  const [nom, setNom] = useState(eleve.nom || "");
  const [prenom, setPrenom] = useState(eleve.prenom || "");
  const [matricule, setMatricule] = useState(eleve.matricule || "");
  const [dateNaissance, setDateNaissance] = useState(eleve.date_naissance || "");
  const [lieuNaissance, setLieuNaissance] = useState(eleve.lieu_naissance || "");
  const [sexe, setSexe] = useState(eleve.sexe || "");
  const [classeId, setClasseId] = useState(eleve.classe_id || "");
  const [pereNom, setPereNom] = useState(eleve.pere_nom || "");
  const [mereNom, setMereNom] = useState(eleve.mere_nom || "");
  const [parentTelephone, setParentTelephone] = useState(eleve.parent_telephone || "");
  const [adresse, setAdresse] = useState(eleve.adresse || "");

  useEffect(() => {
    async function fetchClasses() {
      const { data } = await supabase.from("classes").select("id, nom").order("nom");
      if (data) setClasses(data);
    }
    fetchClasses();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("eleves")
      .update({
        nom,
        prenom,
        matricule,
        date_naissance: dateNaissance || null,
        lieu_naissance: lieuNaissance || null,
        sexe: sexe || null,
        classe_id: classeId || null,
        pere_nom: pereNom || null,
        mere_nom: mereNom || null,
        parent_telephone: parentTelephone || null,
        adresse: adresse || null,
      })
      .eq("id", eleve.id);

    if (updateError) {
      setError(updateError.message);
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
          background: "white", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "600px",
          maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(15,23,42,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
            Fiche de l'élève
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94A3B8" }}>
            ×
          </button>
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
                <input type="text" value={matricule} onChange={(e) => setMatricule(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box", background: "#F1F5F9" }} />
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
                  <option value="">-- Aucune --</option>
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

          {error && <div style={{ padding: "12px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "10px", color: "#991B1B", fontSize: "13px" }}>{error}</div>}

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 20px", background: "#F1F5F9", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
              Annuler
            </button>
            <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: loading ? "#94A3B8" : "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}