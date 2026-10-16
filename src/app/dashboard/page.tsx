import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";

export default async function DashboardPage() {
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

  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle="Vue d'ensemble — Octobre 2026"
        userName={userName}
        userRole={userRole}
      />

      <div style={{ padding: "32px 36px" }}>
        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "26px",
          }}
        >
          <StatCard
            label="Total élèves"
            value="487"
            trend="↑ +12 ce mois-ci"
            trendUp={true}
            icon="◉"
            iconBg="#EEF2FF"
            iconColor="#4F46E5"
          />
          <StatCard
            label="Revenus du mois"
            value="12 450 000 Ar"
            trend="↑ +8.2% vs Sept"
            trendUp={true}
            icon="↗"
            iconBg="#D1FAE5"
            iconColor="#10B981"
          />
          <StatCard
            label="Dépenses du mois"
            value="8 320 000 Ar"
            trend="↑ +3.1% vs Sept"
            trendUp={false}
            icon="↘"
            iconBg="#FEE2E2"
            iconColor="#EF4444"
          />
          <StatCard
            label="Solde actuel"
            value="24 780 000 Ar"
            trend="↑ Positif"
            trendUp={true}
            icon="◆"
            iconBg="#FEF3C7"
            iconColor="#F59E0B"
          />
        </div>

        {/* Placeholder pour les graphiques */}
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            border: "1px solid #F1F5F9",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#0F172A" }}>
            🚧 Graphiques et listes à venir
          </p>
          <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px" }}>
            Le graphique courbes, le donut, la liste des impayés et l'activité récente arrivent à la prochaine étape.
          </p>
        </div>
      </div>
    </>
  );
}