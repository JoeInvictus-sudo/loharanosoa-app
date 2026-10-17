// Données fictives pour l'instant
const lateStudents = [
  { id: 1, initiales: "RK", nom: "Rakoto Koto", classe: "CM2", retard: "2 mois", montant: "120 000 Ar" },
  { id: 2, initiales: "SD", nom: "Soa Diana", classe: "CE1", retard: "1 mois", montant: "60 000 Ar" },
  { id: 3, initiales: "MJ", nom: "Miora Jenny", classe: "CP", retard: "3 mois", montant: "180 000 Ar" },
  { id: 4, initiales: "TN", nom: "Tiana Nomena", classe: "CM1", retard: "1 mois", montant: "60 000 Ar" },
];

export default function LateStudents() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "26px",
        border: "1px solid #F1F5F9",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
            Élèves en retard
          </h3>
          <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "3px" }}>
            {lateStudents.length} élèves concernés
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            padding: "5px 11px",
            background: "#FEF3C7",
            color: "#92400E",
            borderRadius: "999px",
            fontWeight: "600",
          }}
        >
          À relancer
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {lateStudents.map((eleve, index) => (
          <div
            key={eleve.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 0",
              borderBottom: index < lateStudents.length - 1 ? "1px solid #F1F5F9" : "none",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                background: "#F1F5F9",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "12px",
                color: "#475569",
              }}
            >
              {eleve.initiales}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>
                {eleve.nom}
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "1px" }}>
                {eleve.classe} — {eleve.retard} de retard
              </div>
            </div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#EF4444" }}>
              {eleve.montant}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}