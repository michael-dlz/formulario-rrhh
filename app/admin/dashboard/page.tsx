import "dotenv/config";
import prisma from "@/lib/prisma";
import React from "react";
import { getAdminSession } from "@/lib/auth-admin";
import { redirect } from "next/navigation";
import { AdminEmployeeTable } from "@/components/admin/admin-employee-table";

export const metadata = {
  title: "Dashboard de Administración | Formulario RRHH",
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [employees, tenants] = await Promise.all([
    prisma.employee.findMany({
      include: {
        tenant: true,
        family_members: true,
        emergency_contacts: true,
        bank_accounts: true,
        cts_account: true,
        assets: true,
        uniforms: true,
        documents: true,
      },
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.tenant.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <AdminEmployeeTable
          initialEmployees={employees as any}
          tenants={tenants}
          adminEmail={session.email}
        />
      </div>
    </div>
  );
}
