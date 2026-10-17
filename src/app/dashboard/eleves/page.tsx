import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";
import AddStudentButton from "@/components/AddStudentButton";
import StudentList from "@/components/StudentList";

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

  // Récupérer les élèves
  const { data: eleves } = await supabase
    .from("eleves")
    .select("id, matricule, nom, prenom, statut, classe_id")
    .order("nom", { ascending: true });

  // Récupérer les classes
  const { data: classes } = await supabase
    .from("classes")
    .select("id, nom")
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
        {/* En-tête avec bouton */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
            Liste des élèves
          </h2>
          <AddStudentButton />
        </div>

        {/* Liste avec recherche et filtres */}
        <StudentList eleves={eleves ?? []} classes={classes ?? []} />
      </div>
    </>
  );
}