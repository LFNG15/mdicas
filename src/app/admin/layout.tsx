import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
