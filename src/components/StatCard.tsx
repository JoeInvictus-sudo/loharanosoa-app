interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({
  label,
  value,
  trend,
  trendUp,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "20px",
        border: "1px solid #F1F5F9",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          marginBottom: "16px",
          background: iconBg,
          color: iconColor,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "#94A3B8",
          fontWeight: "500",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          letterSpacing: "-1px",
          color: "#0F172A",
          lineHeight: "1.1",
        }}
      >
        {value}
      </div>
      {trend && (
        <div
          style={{
            fontSize: "12px",
            marginTop: "10px",
            fontWeight: "500",
            color: trendUp ? "#10B981" : "#EF4444",
          }}
        >
          {trend}
        </div>
      )}
    </div>
  );
}