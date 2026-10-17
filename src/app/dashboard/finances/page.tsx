import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import AddPaymentButton from "@/components/AddPaymentButton";

export default async function FinancesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName = `${profile?.prenom ?? ""} ${profile?.nom ?? ""}`.trim() || "Utilisateur";
  const userRole = profile?.role ?? "utilisateur";

  const { data: paiements } = await supabase
    .from("paiements")
    .select(`
      id, mois, montant, methode, date_paiement,
      eleves ( nom, prenom, matricule, classes ( nom ) )
    `)
    .order("date_paiement", { ascending: false });

  function formatAriary(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
  }

  function formatDate(dateString: string) {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR");
  }

  return (
    <>
      <Topbar
        title="Finances"
        subtitle="Historique des paiements"
        userName={userName}
        userRole={userRole}
      />

      <div style={{ padding: "32px 36px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
              Historique des paiements
            </h2>
            <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>
              {paiements?.length ?? 0} paiement(s) enregistré(s)
            </p>
          </div>
          <AddPaymentButton />
        </div>

        {(!paiements || paiements.length === 0) ? (
          <div
            style={{
              background: "white", borderRadius: "20px", padding: "60px 40px",
              textAlign: "center", border: "1px solid #F1F5F9",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A" }}>
              Aucun paiement enregistré
            </p>
            <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px" }}>
              Les paiements que vous enregistrerez apparaîtront ici.
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "white", borderRadius: "20px", border: "1px solid #F1F5F9", overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAFA" }}>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Élève</th>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Classe</th>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Mois payé</th>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Montant</th>
                  <th style={{ textAlign: "left", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Date</th>
                  <th style={{ textAlign: "right", padding: "16px 22px", fontSize: "11px", fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((p) => {
                  // On force le type pour TypeScript
                  const eleve = (Array.isArray(p.eleves) ? p.eleves[0] : p.eleves) as any;
                  const classe = eleve && Array.isArray(eleve.classes) ? eleve.classes[0] : eleve?.classes;

                  return (
                    <tr key={p.id} style={{ borderTop: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "16px 22px" }}>
                        <div style={{ fontWeight: "600", fontSize: "13.5px", color: "#0F172A" }}>
                          {eleve?.prenom} {eleve?.nom}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                          {eleve?.matricule}
                        </div>
                      </td>
                      <td style={{ padding: "16px 22px", fontSize: "13.5px", color: "#475569" }}>
                        {classe?.nom || "—"}
                      </td>
                      <td style={{ padding: "16px 22px", fontSize: "13.5px", color: "#475569", fontWeight: "500" }}>
                        {p.mois}
                      </td>
                      <td style={{ padding: "16px 22px", fontSize: "13.5px", fontWeight: "600", color: "#10B981" }}>
                        {formatAriary(p.montant)}
                      </td>
                      <td style={{ padding: "16px 22px", fontSize: "13.5px", color: "#475569" }}>
                        {formatDate(p.date_paiement)}
                      </td>
                      <td style={{ padding: "16px 22px", textAlign: "right" }}>
                        <a
                          href={`/dashboard/finances/recu/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "6px 12px", background: "#EEF2FF", color: "#4F46E5",
                            textDecoration: "none", borderRadius: "8px", fontSize: "12px",
                            fontWeight: "600", display: "inline-block",
                          }}
                        >
                          Reçu
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}