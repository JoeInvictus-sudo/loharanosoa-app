"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      if (data.user) {
        // Succès : redirection vers le dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "#475569",
            marginBottom: "8px",
          }}
        >
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemple@loharanosoa.mg"
          required
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "#FAFAFA",
            border: "1.5px solid #E2E8F0",
            borderRadius: "14px",
            fontSize: "14px",
            color: "#0F172A",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Mot de passe */}
      <div>
        <label
          htmlFor="password"
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "#475569",
            marginBottom: "8px",
          }}
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
          required
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 18px",
            background: "#FAFAFA",
            border: "1.5px solid #E2E8F0",
            borderRadius: "14px",
            fontSize: "14px",
            color: "#0F172A",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "#FEE2E2",
            border: "1px solid #FCA5A5",
            borderRadius: "10px",
            color: "#991B1B",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          {error}
        </div>
      )}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          background: loading
            ? "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)"
            : "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
          color: "white",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "14px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 8px 20px rgba(79,70,229,0.28)",
          fontFamily: "inherit",
          marginTop: "8px",
          transition: "all 0.2s",
        }}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}