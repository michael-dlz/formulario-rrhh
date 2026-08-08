import "dotenv/config";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Inicializando registros en la base de datos...");

  // 1. Crear Administrador 4dm1n / gv_4dm1n
  const adminUser = "4dm1n";
  const adminPass = "gv_4dm1n";
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
  console.log(`✅ Administrador asegurado en BD: ID=${admin.id}, User=${admin.email}`);

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
  console.log(`✅ Tenant asegurado en BD: ID=${tenant.id}, Name=${tenant.name}, Slug=${tenant.slug}`);
}

main()
  .catch((e) => {
    console.error("Error al inicializar la BD:", e);
    process.exit(1);
  });
