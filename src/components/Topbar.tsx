"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  userName: string;
  userRole: string;
}

export default function Topbar({ title, subtitle, userName, userRole }: TopbarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  // Initiales (ex: "Joe RATOVOSON" → "JR")
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E2E8F0",
        padding: "18px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            color: "#0F172A",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: "13px",
              color: "#94A3B8",
              marginTop: "2px",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Chip utilisateur */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#FAFAFA",
            padding: "6px 16px 6px 6px",
            borderRadius: "999px",
            border: "1px solid #F1F5F9",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, #4F46E5, #F59E0B)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "700",
              fontSize: "12px",
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>
              {userName}
            </div>
            <div style={{ fontSize: "11px", color: "#94A3B8", textTransform: "capitalize" }}>
              {userRole}
            </div>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            padding: "10px 16px",
            background: "#FEE2E2",
            color: "#991B1B",
            border: "none",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: loggingOut ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {loggingOut ? "..." : "Déconnexion"}
        </button>
      </div>
    </div>
  );
}