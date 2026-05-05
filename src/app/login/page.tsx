"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { signIn } from "./actions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const loading = pending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("email", email);
    fd.set("password", password);
    startTransition(async () => {
      const res = await signIn(fd);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, var(--white) 0%, var(--cream) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "var(--coral)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            M·D
          </Link>
          <div
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-light)",
              marginTop: "0.3rem",
              fontWeight: 600,
            }}
          >
            Painel Administrativo
          </div>
        </div>

        <div
          style={{
            background: "var(--white)",
            borderRadius: 20,
            padding: "2.5rem",
            boxShadow: "0 20px 60px rgba(44,24,16,0.07)",
            border: "1px solid rgba(240,123,110,0.1)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              marginBottom: "0.4rem",
              color: "var(--text-dark)",
            }}
          >
            Entrar
          </h1>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-light)",
              marginBottom: "2rem",
              fontFamily: "var(--font-lora), 'Lora', serif",
            }}
          >
            Acesse o painel para gerenciar conteúdo.
          </p>

          {error && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "0.85rem 1.1rem",
                background: "rgba(229,62,62,0.06)",
                border: "1px solid rgba(229,62,62,0.2)",
                borderRadius: 10,
                color: "#c53030",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-mid)",
                  marginBottom: "0.4rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  border: "1.5px solid var(--divider)",
                  borderRadius: 10,
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: "0.92rem",
                  color: "var(--text-dark)",
                  outline: "none",
                  background: "var(--white)",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.8rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-mid)",
                  marginBottom: "0.4rem",
                }}
              >
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  border: "1.5px solid var(--divider)",
                  borderRadius: 10,
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: "0.92rem",
                  color: "var(--text-dark)",
                  outline: "none",
                  background: "var(--white)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: loading ? "var(--text-light)" : "var(--coral)",
                color: "var(--white)",
                border: "none",
                borderRadius: 60,
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/" style={{ fontSize: "0.8rem", color: "var(--text-light)", textDecoration: "none" }}>
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
