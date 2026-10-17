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
}

export default function AddStudentModal({ onClose }: AddStudentModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Classe[]>([]);

  // Champs du formulaire
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [sexe, setSexe] = useState("");
  const [classeId, setClasseId] = useState("");
  const [parentNom, setParentNom] = useState("");
  const [parentTelephone, setParentTelephone] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  // Charger les classes disponibles
  useEffect(() => {
    async function fetchClasses() {
      const { data } = await supabase.from("classes").select("id, nom").order("nom");
      if (data) setClasses(data);
    }
    fetchClasses();
  }, [supabase]);

  // Générer un matricule automatique (LOH-2026-XXX)
  useEffect(() => {
    async function generateMatricule() {
      const { count } = await supabase
        .from("eleves")
        .select("*", { count: "exact", head: true });
      const numero = ((count ?? 0) + 1).toString().padStart(3, "0");
      setMatricule(`LOH-2026-${numero}`);
    }
    generateMatricule();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("eleves").insert({
      nom,
      prenom,
      matricule,
      date_naissance: dateNaissance || null,
      sexe: sexe || null,
      classe_id: classeId || null,
      parent_nom: parentNom || null,
      parent_telephone: parentTelephone || null,
      parent_email: parentEmail || null,
      statut: "actif",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "32px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(15,23,42,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
            Nouvel élève
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94A3B8" }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Nom + Prénom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Nom *
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Prénom *
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Matricule + Date naissance */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Matricule
              </label>
              <input
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box", background: "#F1F5F9" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Date de naissance
              </label>
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Sexe + Classe */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Sexe
              </label>
              <select
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
              >
                <option value="">-- Choisir --</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Classe
              </label>
              <select
                value={classeId}
                onChange={(e) => setClasseId(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
              >
                <option value="">-- Aucune --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Parent */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Nom du parent/tuteur
            </label>
            <input
              type="text"
              value={parentNom}
              onChange={(e) => setParentNom(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Téléphone parent
              </label>
              <input
                type="tel"
                value={parentTelephone}
                onChange={(e) => setParentTelephone(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Email parent
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "13px", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px", background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "10px", color: "#991B1B", fontSize: "13px" }}>
              {error}
            </div>
          )}

          {/* Boutons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "10px 20px", background: "#F1F5F9", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "10px 20px", background: loading ? "#94A3B8" : "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}