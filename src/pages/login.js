// src/pages/login.js
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("❌ Email y contraseña son obligatorios");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("❌ Email o contraseña incorrectos");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error("Error de login:", err);
      setError("❌ Ocurrió un error, intente nuevamente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1589227365850-5ed9ed63fcb6?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(0.7)",
        padding: 20,
      }}
    >
      <h1
        style={{
          fontSize: 48,
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
          marginBottom: 40,
        }}
      >
        🐄 CowTag
      </h1>

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: 12,
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              backgroundColor: "#00838f",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {loading ? "⏳ Iniciando sesión…" : "Entrar"}
          </button>

          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: 8 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
