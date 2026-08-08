import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/lib/tenant/get-tenant";
import { EmployeeFormContainer } from "@/components/employee-form/employee-form-container";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building } from "@hugeicons/core-free-icons";

interface TenantPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export async function generateMetadata({ params }: TenantPageProps): Promise<Metadata> {
  const { tenant: tenantSlug } = await params;
  const tenant = await getTenantBySlug(tenantSlug);

  if (!tenant) {
    return {
      title: "Empresa No Encontrada",
      description: "La empresa solicitada no existe o el enlace es incorrecto.",
    };
  }

  return {
    title: `Ficha de Registro - ${tenant.name}`,
    description: tenant.description || `Formulario oficial de registro de información del trabajador para la empresa ${tenant.name}.`,
    openGraph: {
      title: `Registro de Trabajadores | ${tenant.name}`,
      description: tenant.description || `Formulario de Recursos Humanos de ${tenant.name}`,
    },
  };
}

export default async function TenantEmployeeFormPage({ params }: TenantPageProps) {
  const { tenant: tenantSlug } = await params;

  if (!tenantSlug) {
    notFound();
  }

  const tenant = await getTenantBySlug(tenantSlug);

  if (!tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Building} />
            </EmptyMedia>
            <EmptyTitle>Empresa no encontrada</EmptyTitle>
            <EmptyDescription>Lo sentimos, la empresa no existe o ha sido eliminada.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return <EmployeeFormContainer tenant={tenant} />;
}
