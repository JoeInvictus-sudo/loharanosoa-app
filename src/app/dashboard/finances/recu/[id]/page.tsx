import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect, notFound } from "next/navigation";

export default async function RecuPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const resolvedParams = await params;

  // 1. Récupérer le paiement cliqué (pour avoir les infos de l'élève et la date exacte)
  const { data: paiementInitial } = await supabase
    .from("paiements")
    .select(`
      id, created_at,
      eleves ( id, nom, prenom, matricule, classes ( nom ) ),
      annees_scolaires ( libelle )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (!paiementInitial) {
    notFound();
  }

  // On force le type pour l'élève
  const eleveInfo = (Array.isArray(paiementInitial.eleves) ? paiementInitial.eleves[0] : paiementInitial.eleves) as any;
  const eleveId = eleveInfo?.id;

  // 2. Récupérer TOUS les paiements de cet élève faits à la même seconde (pour le reçu groupé)
  // On compare la date de création (qui est un timestamp)
  const { data: paiementsGroupe } = await supabase
    .from("paiements")
    .select("id, mois, montant, methode, date_paiement")
    .eq("eleve_id", eleveId)
    .eq("created_at", paiementInitial.created_at); 

  // 3. Préparer les infos d'affichage
  const eleve = eleveInfo;
  const classe = eleve && Array.isArray(eleve.classes) ? eleve.classes[0] : eleve?.classes;
  const annee = Array.isArray(paiementInitial.annees_scolaires) ? paiementInitial.annees_scolaires[0] : paiementInitial.annees_scolaires;
  
  // Calcul du total du reçu
  const totalRecu = paiementsGroupe?.reduce((sum, p) => sum + p.montant, 0) ?? 0;
  const dateFormat = new Date(paiementInitial.created_at).toLocaleDateString("fr-FR");
  const heureFormat = new Date(paiementInitial.created_at).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
  
  // Numéro de reçu basé sur l'ID du premier paiement
  const numRecu = paiementInitial.id.slice(0, 8).toUpperCase();
  
  function formatAriary(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif", background: "#FAFAFA", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ background: "white", width: "100%", maxWidth: "600px", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        
        {/* En-tête */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #E2E8F0", paddingBottom: "20px", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: 0 }}>École Privée Loharanosoa</h1>
            <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>Reçu de paiement</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase", fontWeight: "600" }}>N° Reçu</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>{numRecu}</div>
          </div>
        </div>

        {/* Infos élève */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ fontSize: "12px", color: "#64748B", textTransform: "uppercase", fontWeight: "600", marginBottom: "8px" }}>Informations de l'élève</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>{eleve?.nom} {eleve?.prenom}</div>
          <div style={{ fontSize: "14px", color: "#475569", marginTop: "4px" }}>Matricule : {eleve?.matricule}</div>
          <div style={{ fontSize: "14px", color: "#475569" }}>Classe : {classe?.nom || "—"}</div>
          <div style={{ fontSize: "14px", color: "#475569" }}>Année scolaire : {annee?.libelle || "—"}</div>
        </div>

        {/* Détails paiements (Tableau multi-lignes) */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ textAlign: "left", padding: "12px", fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>Désignation</th>
              <th style={{ textAlign: "right", padding: "12px", fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {/* On boucle sur les paiements du groupe pour afficher chaque ligne */}
            {paiementsGroupe?.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: "16px 12px", fontSize: "14px", color: "#0F172A", borderBottom: "1px solid #E2E8F0" }}>
                  {p.mois === "Inscription" 
                    ? "Frais d'inscription (Généraux, Carnet, FRAM)" 
                    : `Frais de scolarité — Mois de ${p.mois}`}
                </td>
                <td style={{ padding: "16px 12px", fontSize: "14px", fontWeight: "600", color: "#0F172A", textAlign: "right", borderBottom: "1px solid #E2E8F0" }}>
                  {formatAriary(p.montant)}
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: "16px 12px", fontSize: "14px", fontWeight: "700", color: "#0F172A", textAlign: "right" }}>TOTAL PAYÉ</td>
              <td style={{ padding: "16px 12px", fontSize: "16px", fontWeight: "800", color: "#10B981", textAlign: "right" }}>
                {formatAriary(totalRecu)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pied de page */}
        <div style={{ borderTop: "2px solid #E2E8F0", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#64748B" }}>Méthode : <strong style={{ textTransform: "capitalize" }}>{paiementsGroupe?.[0]?.methode}</strong></div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Date : <strong>{dateFormat} à {heureFormat}</strong></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>Signature et cachet</div>
            <div style={{ width: "150px", height: "50px", borderBottom: "1px dashed #CBD5E1" }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}