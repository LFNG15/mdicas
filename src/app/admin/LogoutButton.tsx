"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.5rem 0.5rem",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "0.78rem",
        color: "rgba(255,255,255,0.3)",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        transition: "color 0.2s",
      }}
    >
      ← Sair
    </button>
  );
}
