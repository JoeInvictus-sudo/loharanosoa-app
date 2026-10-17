"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Données fictives pour l'instant (Octobre)
const data = [
  { name: "Revenus", value: 12450000, color: "#10B981" },
  { name: "Dépenses", value: 8320000, color: "#EF4444" },
];

function formatAriary(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

export default function RevenueDonut() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatAriary(Number(value))}
              contentStyle={{
                background: "white",
                border: "1px solid #F1F5F9",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                fontSize: "12px",
                fontWeight: "500",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <div style={{ width: "100%", marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: "#FAFAFA",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: item.color,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: "13px", fontWeight: "500", color: "#475569" }}>
                {item.name} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>
              {formatAriary(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}