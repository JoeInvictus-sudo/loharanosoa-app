import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "#FAFAFA",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Décorations de fond */}
      <div
        style={{
          position: "absolute",
          top: "-160px",
          left: "-160px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-160px",
          right: "-160px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Carte de connexion */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          background: "white",
          borderRadius: "28px",
          boxShadow: "0 24px 64px rgba(15,23,42,0.12)",
          border: "1px solid #F1F5F9",
          padding: "56px 48px",
          textAlign: "center",
        }}
      >
        {/* Liseré dégradé en haut */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #4F46E5, #F59E0B)",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
          }}
        />

        {/* Logo + Titre — CENTRÉS */}
        <div style={{ marginBottom: "40px" }}>
          {/* Logo 3D — L + Étoile */}
          <div
            style={{
              position: "relative",
              width: "76px",
              height: "76px",
              margin: "0 auto 24px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: "700",
                color: "white",
                fontSize: "40px",
                paddingBottom: "6px",
                background: "#0F172A",
                border: "4px solid #F59E0B",
                boxShadow: "0 16px 32px rgba(15,23,42,0.25)",
              }}
            >
              L
            </div>
            {/* Étoile ambre */}
            <svg
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "20px",
                height: "20px",
                color: "#F59E0B",
              }}
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2 L14.4 8.4 L21 9 L16 13.5 L17.5 20 L12 16.5 L6.5 20 L8 13.5 L3 9 L9.6 8.4 Z" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#0F172A",
              letterSpacing: "-0.4px",
              marginBottom: "6px",
              margin: 0,
            }}
          >
            École Privée Loharanosoa
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#94A3B8",
              marginTop: "6px",
              margin: 0,
            }}
          >
            Connectez-vous à votre espace de gestion
          </p>
        </div>

        {/* Formulaire */}
        <form style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
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
              placeholder="exemple@loharanosoa.mg"
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
              required
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
              placeholder="••••••••••"
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
              required
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(79,70,229,0.28)",
              fontFamily: "inherit",
              marginTop: "8px",
            }}
          >
            Se connecter
          </button>
        </form>

        {/* Lien mot de passe oublié */}
        <p
          style={{
            fontSize: "13px",
            color: "#94A3B8",
            marginTop: "24px",
            margin: "24px 0 0 0",
          }}
        >
          Mot de passe oublié ?{" "}
          <Link
            href="#"
            style={{
              color: "#4F46E5",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Réinitialiser
          </Link>
        </p>
      </div>
    </div>
  );
}