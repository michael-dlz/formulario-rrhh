import "dotenv/config";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Inicializando registros en la base de datos...");

  // 1. Crear Administrador desde variables de entorno
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminPass) {
    console.error("❌ ERROR: La variable de entorno ADMIN_PASSWORD no está definida.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPass, 12);

  const admin = await prisma.admin_user.upsert({
    where: { email: adminUser },
    update: {
      password_hash: hashedPassword,
    },
    create: {
      email: adminUser,
      password_hash: hashedPassword,
      name: "Administrador General",
    },
  });
  console.log(`✅ Administrador asegurado en BD: User=${admin.email}`);

  // 2. Crear Tenant LEGADO
  const tenantSlug = "legado";
  const tenantName = "LEGADO";

  const tenant = await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    update: {
      name: tenantName,
    },
    create: {
      slug: tenantSlug,
      name: tenantName,
      description: "Empresa Legado - Registro de Trabajadores",
    },
  });
  console.log(`✅ Tenant asegurado en BD: Name=${tenant.name}, Slug=${tenant.slug}`);
}

main().catch((e) => {
  console.error("Error al inicializar la BD:", e);
  process.exit(1);
});
