"use client";

import { useState, useMemo } from "react";

interface Eleve {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  statut: string;
  classe_id: string | null;
}

interface Classe {
  id: string;
  nom: string;
}

interface StudentListProps {
  eleves: Eleve[];
  classes: Classe[];
}

export default function StudentList({ eleves, classes }: StudentListProps) {
  const [search, setSearch] = useState("");
  const [classeFilter, setClasseFilter] = useState("");
  const [statutFilter, setStatutFilter] = useState("");

  // Filtrer les élèves
  const filteredEleves = useMemo(() => {
    return eleves.filter((eleve) => {
      // Recherche par nom/prénom/matricule
      const searchLower = search.toLowerCase();
      const matchSearch =
        search === "" ||
        eleve.nom.toLowerCase().includes(searchLower) ||
        eleve.prenom.toLowerCase().includes(searchLower) ||
        eleve.matricule.toLowerCase().includes(searchLower);

      // Filtre par classe
      const matchClasse = classeFilter === "" || eleve.classe_id === classeFilter;

      // Filtre par statut
      const matchStatut = statutFilter === "" || eleve.statut === statutFilter;

      return matchSearch && matchClasse && matchStatut;
    });
  }, [eleves, search, classeFilter, statutFilter]);

  function getClasseName(classeId: string | null) {
    if (!classeId) return "—";
    return classes.find((c) => c.id === classeId)?.nom ?? "—";
  }

  return (
    <div>
      {/* Barre de recherche et filtres */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Recherche */}
        <input
          type="text"
          placeholder="🔍 Rechercher un élève par nom ou matricule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "240px",
            padding: "12px 18px",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            fontSize: "13.5px",
            fontFamily: "inherit",
            background: "white",
            outline: "none",
          }}
        />

        {/* Filtre classe */}
        <select
          value={classeFilter}
          onChange={(e) => setClasseFilter(e.target.value)}
          style={{
            padding: "12px 16px",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            fontSize: "13.5px",
            fontFamily: "inherit",
            background: "white",
            cursor: "pointer",
            fontWeight: "500",
            color: "#475569",
          }}
        >
          <option value="">Toutes les classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>

        {/* Filtre statut */}
        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
          style={{
            padding: "12px 16px",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            fontSize: "13.5px",
            fontFamily: "inherit",
            background: "white",
            cursor: "pointer",
            fontWeight: "500",
            color: "#475569",
          }}
        >
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      {/* Compteur */}
      <p
        style={{
          fontSize: "13px",
          color: "#94A3B8",
          marginBottom: "12px",
          fontWeight: "500",
        }}
      >
        {filteredEleves.length} élève{filteredEleves.length > 1 ? "s" : ""} trouvé
        {filteredEleves.length > 1 ? "s" : ""} sur {eleves.length}
      </p>

      {/* Liste */}
      {filteredEleves.length === 0 ? (
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
            Aucun élève ne correspond à votre recherche
          </p>
          <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px" }}>
            Essayez de modifier les filtres ou la recherche
          </p>
        </div>
      ) : (
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
                  Classe
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
              {filteredEleves.map((eleve) => (
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
                        {eleve.nom[0]}
                        {eleve.prenom[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "13.5px", color: "#0F172A" }}>
                          {eleve.prenom} {eleve.nom}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 22px", fontSize: "13.5px", color: "#475569" }}>
                    {getClasseName(eleve.classe_id)}
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
  );
}