import "dotenv/config";
import prisma from "@/lib/prisma";

export async function getTenantBySlug(slug: string) {
  if (!slug) return null;

  try {
    let tenant = await prisma.tenant.findUnique({
      where: { slug: slug.toLowerCase() },
    });

    if (!tenant) {
      // Autocreate default tenant if it's one of the known initial tenants (legado, nova, hola)
      const validInitialSlugs = ["legado", "nova", "hola"];
      if (validInitialSlugs.includes(slug.toLowerCase())) {
        tenant = await prisma.tenant.create({
          data: {
            slug: slug.toLowerCase(),
            name: `Tenant ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
            description: `Formulario de Registro de Trabajadores para Tenant ${slug.toUpperCase()}`,
            primary_color: "#0f172a",
          },
        });
      }
    }

    return tenant;
  } catch (error) {
    console.error("Error al obtener tenant por slug:", error);
    return null;
  }
}
