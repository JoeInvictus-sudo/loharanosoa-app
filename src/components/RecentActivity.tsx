// Données fictives pour l'instant
const activities = [
  { id: 1, type: "paiement", titre: "Paiement enregistré", detail: "Soa Diana — Octobre — il y a 12 min", icon: "✓", bg: "#D1FAE5", color: "#065F46" },
  { id: 2, type: "eleve", titre: "Nouvel élève inscrit", detail: "Andry Hery — CE2 — il y a 1 h", icon: "+", bg: "#EEF2FF", color: "#4338CA" },
  { id: 3, type: "rappel", titre: "Rappel envoyé", detail: "3 parents relancés — il y a 3 h", icon: "!", bg: "#FEF3C7", color: "#92400E" },
  { id: 4, type: "document", titre: "Document ajouté", detail: "Bilan financier Sept — hier", icon: "▣", bg: "#F1F5F9", color: "#475569" },
];

export default function RecentActivity() {
  return (
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
          Activité récente
        </h3>
        <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "3px" }}>
          Dernières actions
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 0",
              borderBottom: index < activities.length - 1 ? "1px solid #F1F5F9" : "none",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                background: activity.bg,
                color: activity.color,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              {activity.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>
                {activity.titre}
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>
                {activity.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}