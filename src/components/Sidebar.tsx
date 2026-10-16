"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "◈" },
  { href: "/dashboard/eleves", label: "Élèves", icon: "◉" },
  { href: "/dashboard/professeurs", label: "Professeurs", icon: "◐" },
  { href: "/dashboard/finances", label: "Finances", icon: "◍" },
  { href: "/dashboard/documents", label: "Documents", icon: "▣" },
];

const adminItems = [
  { href: "/dashboard/parametres", label: "Paramètres", icon: "◇" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "252px",
        background: "#1E293B",
        padding: "22px 14px",
        flexShrink: 0,
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 12px 22px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            background: "linear-gradient(135deg, #4F46E5 0%, #F59E0B 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "800",
            fontSize: "18px",
            boxShadow: "0 8px 20px rgba(79,70,229,0.4)",
          }}
        >
          L
        </div>
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "white",
              lineHeight: "1.2",
            }}
          >
            Loharanosoa
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#64748B",
              marginTop: "2px",
            }}
          >
            Gestion scolaire
          </div>
        </div>
      </div>

      {/* Menu principal */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          color: "#64748B",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          padding: "8px 14px 6px",
          marginTop: "6px",
        }}
      >
        Principal
      </div>

      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              color: isActive ? "white" : "#CBD5E1",
              fontSize: "13.5px",
              fontWeight: isActive ? "600" : "500",
              marginBottom: "2px",
              textDecoration: "none",
              background: isActive ? "#334155" : "transparent",
              position: "relative",
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "3px",
                  height: "18px",
                  background: "#F59E0B",
                  borderRadius: "0 3px 3px 0",
                }}
              />
            )}
            <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}

      {/* Menu administration */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          color: "#64748B",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          padding: "8px 14px 6px",
          marginTop: "18px",
        }}
      >
        Administration
      </div>

      {adminItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              color: isActive ? "white" : "#CBD5E1",
              fontSize: "13.5px",
              fontWeight: isActive ? "600" : "500",
              marginBottom: "2px",
              textDecoration: "none",
              background: isActive ? "#334155" : "transparent",
            }}
          >
            <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}