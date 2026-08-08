"use server";

import "dotenv/config";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createAdminToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  getAdminSession,
} from "@/lib/auth-admin";
import { redirect } from "next/navigation";

export async function loginAdminAction(formData: FormData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Por favor ingresa correo y contraseña." };
  }

  const admin = await prisma.admin_user.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false, error: "Credenciales de acceso incorrectas." };
  }

  const isValidPassword = await bcrypt.compare(password, admin.password_hash);
  if (!isValidPassword) {
    return { success: false, error: "Credenciales de acceso incorrectas." };
  }

  const token = await createAdminToken(admin.id, admin.email);
  await setAdminSessionCookie(token);

  redirect("/admin/dashboard");
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function getAdminEmployeesByTenant(tenantId?: string) {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("No autorizado");
  }

  const whereCondition = tenantId && tenantId !== "ALL" ? { tenant_id: tenantId } : {};

  const employees = await prisma.employee.findMany({
    where: whereCondition,
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
  });

  return employees;
}

export async function getAdminTenantsList() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("No autorizado");
  }

  return await prisma.tenant.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createTenantAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "No estás autorizado para realizar esta acción." };
  }

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim().toLowerCase();
  const description = formData.get("description")?.toString().trim();

  if (!name || !slug) {
    return { success: false, error: "El nombre y la URL slug de la empresa son requeridos." };
  }

  const existing = await prisma.tenant.findUnique({
    where: { slug },
  });

  if (existing) {
    return { success: false, error: `Ya existe una empresa/tenant con el slug '${slug}'.` };
  }

  try {
    const newTenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    return { success: true, tenant: newTenant };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error al crear la empresa/tenant.";
    return { success: false, error: msg };
  }
}

