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

  // Récupérer le profil pour la Topbar
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName = `${profile?.prenom ?? ""} ${profile?.nom ?? ""}`.trim() || "Utilisateur";
  const userRole = profile?.role ?? "utilisateur";

  // ============ VRAIES DONNÉES ============

  // 1. Total élèves (uniquement les actifs)
  const { count: totalEleves } = await supabase
    .from("eleves")
    .select("*", { count: "exact", head: true })
    .eq("statut", "actif");

  // 2. Mois en cours pour les paiements
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("fr-FR", { month: "long" });
  const currentMonthCapitalized = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  const currentYear = currentDate.getFullYear();

  // 3. Revenus du mois
  const { data: paiementsMois } = await supabase
    .from("paiements")
    .select("montant")
    .eq("mois", currentMonthCapitalized)
    .eq("statut", "paye");

  const revenusMois = paiementsMois?.reduce((sum, p) => sum + p.montant, 0) ?? 0;

  // 4. Dépenses (pas encore de table, donc 0)
  const depensesMois = 0;

  // 5. Solde total (somme de tous les paiements)
  const { data: tousPaiements } = await supabase
    .from("paiements")
    .select("montant")
    .eq("statut", "paye");

  const totalRevenus = tousPaiements?.reduce((sum, p) => sum + p.montant, 0) ?? 0;
  const soldeActuel = totalRevenus - depensesMois;

  // Formatage en Ariary
  function formatAriary(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
  }

  return (
    <>
      <Topbar
        title="Tableau de bord"
        subtitle={`Vue d'ensemble — ${currentMonthCapitalized} ${currentYear}`}
        userName={userName}
        userRole={userRole}
      />

      <div style={{ padding: "32px 36px" }}>
        {/* KPI Cards avec vraies données */}
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
            value={String(totalEleves ?? 0)}
            trend={`${totalEleves ?? 0} élève${(totalEleves ?? 0) > 1 ? "s" : ""} actif${(totalEleves ?? 0) > 1 ? "s" : ""}`}
            trendUp={true}
            icon="◉"
            iconBg="#EEF2FF"
            iconColor="#4F46E5"
          />
          <StatCard
            label="Revenus du mois"
            value={formatAriary(revenusMois)}
            trend={`${currentMonthCapitalized} ${currentYear}`}
            trendUp={revenusMois > 0}
            icon="↗"
            iconBg="#D1FAE5"
            iconColor="#10B981"
          />
          <StatCard
            label="Dépenses du mois"
            value={formatAriary(depensesMois)}
            trend="Bientôt disponible"
            trendUp={false}
            icon="↘"
            iconBg="#FEE2E2"
            iconColor="#EF4444"
          />
          <StatCard
            label="Solde actuel"
            value={formatAriary(soldeActuel)}
            trend={soldeActuel >= 0 ? "↑ Positif" : "↓ Négatif"}
            trendUp={soldeActuel >= 0}
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
                {currentMonthCapitalized} {currentYear}
              </p>
            </div>
            <RevenueDonut />
          </div>
        </div>

        {/* Impayés + Activité */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" }}>
          <LateStudents />
          <RecentActivity />
        </div>
      </div>
    </>
  );
}