import "dotenv/config";
import prisma from "../prisma";

export async function exportTenantEmployeesToFlatJson(tenantSlug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug.toLowerCase() },
  });

  if (!tenant) {
    throw new Error(`Tenant '${tenantSlug}' no encontrado.`);
  }

  const employees = await prisma.employee.findMany({
    where: { tenant_id: tenant.id },
    include: {
      family_members: true,
      emergency_contacts: true,
      bank_accounts: true,
      cts_account: true,
      assets: true,
      uniforms: true,
      documents: true,
    },
    orderBy: { created_at: "desc" },
  });

  return employees.map((emp) => {
    const bank = emp.bank_accounts[0];
    const cts = emp.cts_account;

    return {
      ID: emp.id,
      Tenant: tenant.name,
      Nombres: emp.first_name,
      Apellidos: emp.last_name,
      Tipo_Documento: emp.document_type,
      Numero_Documento: emp.document_number,
      Fecha_Nacimiento: emp.birth_date.toISOString().split("T")[0],
      Direccion: emp.address,
      Distrito: emp.district,
      Telefono: emp.phone,
      Correo_Personal: emp.personal_email,
      Correo_Corporativo: emp.corporate_email || "",
      Estado_Civil: emp.marital_status,
      Nacionalidad: emp.nationality,
      Cargo: emp.position,
      Area: emp.area,
      Sede: emp.work_location,
      Fecha_Ingreso: emp.hire_date.toISOString().split("T")[0],
      Tipo_Contrato: emp.contract_type,
      Estado: emp.status,
      Fecha_Cese: emp.end_date ? emp.end_date.toISOString().split("T")[0] : "",
      Sueldo: emp.salary,
      Sistema_Pensiones: emp.pension_system,
      AFP_Nombre: emp.afp_name || "",
      AFP_Codigo: emp.afp_code || "",
      Asignacion_Familiar: emp.has_family_allowance ? "SÍ" : "NO",
      Banco_Sueldo: bank ? bank.bank : "",
      Tipo_Cuenta: bank ? bank.account_type : "",
      Numero_Cuenta: bank ? bank.account_number : "",
      CCI: bank ? bank.cci : "",
      Moneda_Sueldo: bank ? bank.currency : "",
      Titular_Cuenta: bank ? bank.account_holder : "",
      Cuenta_CTS: cts?.has_cts_account ? "SÍ" : "NO",
      Banco_CTS: cts?.bank || "",
      Numero_Cuenta_CTS: cts?.account_number || "",
      Cantidad_Familiares: emp.family_members.length,
      Cantidad_Contactos_Emergencia: emp.emergency_contacts.length,
      Cantidad_Activos: emp.assets.length,
      Cantidad_Uniformes: emp.uniforms.length,
      Cantidad_Documentos: emp.documents.length,
      Fecha_Registro: emp.created_at.toISOString(),
    };
  });
}
