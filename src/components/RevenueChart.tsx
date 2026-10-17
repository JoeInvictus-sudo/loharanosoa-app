"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Données fictives pour l'instant (on les remplacera par les vraies données plus tard)
const data = [
  { mois: "Sept", revenus: 8500000, depenses: 6200000 },
  { mois: "Oct", revenus: 12450000, depenses: 8320000 },
  { mois: "Nov", revenus: 9800000, depenses: 7100000 },
  { mois: "Déc", revenus: 11500000, depenses: 8900000 },
  { mois: "Jan", revenus: 10200000, depenses: 7500000 },
  { mois: "Fév", revenus: 11800000, depenses: 8100000 },
  { mois: "Mars", revenus: 13100000, depenses: 9200000 },
  { mois: "Avr", revenus: 10900000, depenses: 7800000 },
  { mois: "Mai", revenus: 12500000, depenses: 8500000 },
  { mois: "Juin", revenus: 14200000, depenses: 9100000 },
];

// Formatage des montants en Ariary
function formatAriary(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  return `${(value / 1000).toFixed(0)}k`;
}

function formatTooltip(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " Ar";
}

export default function RevenueChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="mois"
            stroke="#94A3B8"
            style={{ fontSize: "11px", fontWeight: "500" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            style={{ fontSize: "11px", fontWeight: "500" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatAriary}
          />
          <Tooltip
            formatter={(value) => formatTooltip(Number(value))}
            contentStyle={{
              background: "white",
              border: "1px solid #F1F5F9",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
              fontSize: "12px",
              fontWeight: "500",
            }}
            labelStyle={{ color: "#0F172A", fontWeight: "700", marginBottom: "4px" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px", fontWeight: "500" }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="revenus"
            name="Revenus"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", r: 4, strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "white" }}
          />
          <Line
            type="monotone"
            dataKey="depenses"
            name="Dépenses"
            stroke="#1E40AF"
            strokeWidth={3}
            dot={{ fill: "#1E40AF", r: 4, strokeWidth: 2, stroke: "white" }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "white" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}