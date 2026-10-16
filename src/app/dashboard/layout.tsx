import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAFAFA" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowX: "auto" }}>
        {children}
      </main>
    </div>
  );
}