import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";

export default async function ElevesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Récupérer le profil pour la Topbar
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName = `${profile?.prenom ?? ""} ${profile?.nom ?? ""}`.trim() || "Utilisateur";
  const userRole = profile?.role ?? "utilisateur";

  // Récupérer les élèves depuis Supabase
  const { data: eleves } = await supabase
    .from("eleves")
    .select("*")
    .order("nom", { ascending: true });

  return (
    <>
      <Topbar
        title="Élèves"
        subtitle={`${eleves?.length ?? 0} élèves inscrits`}
        userName={userName}
        userRole={userRole}
      />

      <div style={{ padding: "32px 36px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
            Liste des élèves
          </h2>
        </div>

        {/* Message si pas encore d'élèves */}
        {(!eleves || eleves.length === 0) && (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "60px 40px",
              textAlign: "center",
              border: "1px solid #F1F5F9",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A" }}>
              Aucun élève pour le moment
            </p>
            <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px" }}>
              Cliquez sur "Nouvel élève" pour commencer
            </p>
          </div>
        )}

        {/* Liste des élèves */}
        {eleves && eleves.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              border: "1px solid #F1F5F9",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAFA" }}>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Élève
                  </th>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Matricule
                  </th>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {eleves.map((eleve) => (
                  <tr key={eleve.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "16px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            background: "linear-gradient(135deg, #4F46E5, #8B5CF6)",
                            color: "white",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "12px",
                          }}
                        >
                          {eleve.nom[0]}{eleve.prenom[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "13.5px", color: "#0F172A" }}>
                            {eleve.prenom} {eleve.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px", fontSize: "13.5px", color: "#475569" }}>
                      {eleve.matricule}
                    </td>
                    <td style={{ padding: "16px 22px" }}>
                      <span
                        style={{
                          padding: "5px 11px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: "600",
                          background: eleve.statut === "actif" ? "#D1FAE5" : "#FEE2E2",
                          color: eleve.statut === "actif" ? "#065F46" : "#991B1B",
                        }}
                      >
                        {eleve.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}