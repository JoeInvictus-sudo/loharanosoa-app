import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/RevenueChart";
import RevenueDonut from "@/components/RevenueDonut";
import LateStudents from "@/components/LateStudents";
import RecentActivity from "@/components/RecentActivity";

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

        {/* Graphiques */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1.8fr 1fr",
    gap: "22px",
    marginBottom: "22px",
  }}
>
  {/* Graphique courbes */}
    <div
    style={{
      background: "white",
      borderRadius: "20px",
      padding: "26px",
      border: "1px solid #F1F5F9",
    }}
    >
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
        Revenus vs Dépenses
      </h3>
      <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "3px" }}>
        Comparaison sur 10 mois — Année 2026-2027
      </p>
    </div>
    <RevenueChart />
  </div>

  {/* Donut */}
  <div
    style={{
      background: "white",
      borderRadius: "20px",
      padding: "26px",
      border: "1px solid #F1F5F9",
    }}
  >
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
        Répartition du mois
      </h3>
      <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "3px" }}>
        Octobre 2026
      </p>
    </div>
    <RevenueDonut />
  </div>
</div>

{/* Impayés + Activité */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "22px",
  }}
>
  <LateStudents />
  <RecentActivity />
</div>
      </div>
    </>
  );
}