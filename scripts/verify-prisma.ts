import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  try {
    const tenantCount = await prisma.tenant.count();
    const employeeCount = await prisma.employee.count();

    console.log(`Conexión a la BD verificada: ${tenantCount} tenants y ${employeeCount} empleados registrados.`);
    console.log("✅ Conexión Prisma OK");
  } catch (error) {
    console.error("❌ Falló la verificación de base de datos:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
