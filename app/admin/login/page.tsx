import React from "react";
import { getAdminSession } from "@/lib/auth-admin";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = {
  title: "Acceso Administrativo | Formulario RRHH",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <AdminLoginForm />
    </div>
  );
}
