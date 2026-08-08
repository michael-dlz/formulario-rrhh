"use server";

import "dotenv/config";
import prisma from "@/lib/prisma";
import { employeeFormSchema, EmployeeFormValues } from "@/lib/validations/employee-form.schema";

import { uploadFileToCloudinaryAction } from "@/app/actions/upload";

export type SubmitEmployeeResult =
  | { success: true; employee_id: string; message: string }
  | { success: false; error: string };

async function processCloudinaryUploadIfNeeded(
  urlOrBase64?: string | null,
  folder: string = "documentos",
  publicId?: string
): Promise<string | null> {
  if (!urlOrBase64) return null;
  if (urlOrBase64.startsWith("data:")) {
    const res = await uploadFileToCloudinaryAction(urlOrBase64, folder, publicId);
    if (res.success && res.url) {
      return res.url;
    }
  }
  return urlOrBase64;
}

export async function submitEmployeeRegistrationAction(
  data: EmployeeFormValues
): Promise<SubmitEmployeeResult> {
  try {
    // 1. Validar los datos de entrada con Zod
    const validatedData = employeeFormSchema.parse(data);

    // 2. Buscar el tenant por su slug
    const tenant = await prisma.tenant.findUnique({
      where: { slug: validatedData.tenant_slug.toLowerCase() },
    });

    if (!tenant) {
      return {
        success: false,
        error: `El tenant '${validatedData.tenant_slug}' no existe en el sistema.`,
      };
    }

    // 2.5 Estructurar carpetas y nombres de archivo limpios según datos del trabajador
    const docNum = validatedData.personal.document_number.trim();
    const sanitizeName = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_");

    const empFolder = `${validatedData.tenant_slug}/${docNum}_${sanitizeName(validatedData.personal.first_name)}_${sanitizeName(validatedData.personal.last_name)}`;

    // Subir Foto de Perfil
    const finalPhotoUrl = await processCloudinaryUploadIfNeeded(
      validatedData.personal.photo_url,
      `${empFolder}/fotos`,
      `foto_${docNum}`
    );

    // Subir Copia de DNI/CE
    const finalDocCopyUrl = await processCloudinaryUploadIfNeeded(
      validatedData.personal.document_copy_url,
      `${empFolder}/documentos`,
      `copia_documento_${docNum}`
    );

    // Subir Documentos Adjuntos
    const processedDocuments = await Promise.all(
      validatedData.documents.documents.map(async (doc, idx) => {
        const docSlug = sanitizeName(doc.document_type || "documento");
        const finalUrl = await processCloudinaryUploadIfNeeded(
          doc.file_url,
          `${empFolder}/documentos`,
          `${docSlug}_${idx + 1}`
        );
        return {
          ...doc,
          file_url: finalUrl || doc.file_url,
        };
      })
    );

    // 3. Ejecutar la transacción en Prisma
    const newEmployee = await prisma.$transaction(async (tx) => {
      // Crear el registro de empleado principal
      const emp = await tx.employee.create({
        data: {
          tenant_id: tenant.id,
          first_name: validatedData.personal.first_name,
          last_name: validatedData.personal.last_name,
          document_type: validatedData.personal.document_type,
          document_number: validatedData.personal.document_number,
          birth_date: new Date(validatedData.personal.birth_date),
          address: validatedData.personal.address,
          district: validatedData.personal.district,
          phone: validatedData.personal.phone,
          personal_email: validatedData.personal.personal_email,
          corporate_email: validatedData.personal.corporate_email || null,
          marital_status: validatedData.personal.marital_status,
          nationality: validatedData.personal.nationality,
          photo_url: finalPhotoUrl,
          document_copy_url: finalDocCopyUrl,
          position: validatedData.employment.position,
          area: validatedData.employment.area,
          work_location: tenant.name,
          hire_date: new Date(validatedData.employment.hire_date),
          contract_type: validatedData.employment.contract_type,
          status: validatedData.employment.status,
          end_date: validatedData.employment.end_date ? new Date(validatedData.employment.end_date) : null,
          salary: validatedData.employment.salary,
          pension_system: validatedData.employment.pension_system,
          afp_name: validatedData.employment.pension_system === "AFP" ? validatedData.employment.afp_name : null,
          afp_code: validatedData.employment.pension_system === "AFP" ? validatedData.employment.afp_code : null,
          has_family_allowance: validatedData.employment.has_family_allowance,
          observations: validatedData.employment.observations || null,
        },
      });

      // Crear familiares si existen
      if (validatedData.family.family_members.length > 0) {
        await tx.employee_family_member.createMany({
          data: validatedData.family.family_members.map((fam) => ({
            employee_id: emp.id,
            full_name: fam.full_name,
            relationship: fam.relationship,
            document_type: fam.document_type,
            document_number: fam.document_number,
            birth_date: new Date(fam.birth_date),
            is_dependent: fam.is_dependent,
            phone: fam.phone || null,
            observations: fam.observations || null,
          })),
        });
      }

      // Crear contactos de emergencia
      if (validatedData.emergency.emergency_contacts.length > 0) {
        await tx.employee_emergency_contact.createMany({
          data: validatedData.emergency.emergency_contacts.map((emg) => ({
            employee_id: emp.id,
            full_name: emg.full_name,
            relationship: emg.relationship,
            phone: emg.phone,
            alt_phone: emg.alt_phone || null,
            address: emg.address || null,
            observations: emg.observations || null,
          })),
        });
      }

      // Crear cuenta bancaria de sueldo
      await tx.employee_bank_account.create({
        data: {
          employee_id: emp.id,
          bank: validatedData.bank.bank,
          account_type: validatedData.bank.account_type,
          account_number: validatedData.bank.account_number,
          cci: validatedData.bank.cci,
          currency: validatedData.bank.currency,
          account_holder: validatedData.bank.account_holder,
        },
      });

      // Crear registro CTS
      await tx.employee_cts_account.create({
        data: {
          employee_id: emp.id,
          has_cts_account: validatedData.cts.has_cts_account,
          bank: validatedData.cts.has_cts_account ? validatedData.cts.bank : null,
          account_number: validatedData.cts.has_cts_account ? validatedData.cts.account_number : null,
          cci: validatedData.cts.has_cts_account ? validatedData.cts.cci : null,
          currency: validatedData.cts.has_cts_account ? validatedData.cts.currency : null,
        },
      });

      // Crear activos asignados
      if (validatedData.assets.has_assets && validatedData.assets.assets.length > 0) {
        await tx.employee_asset.createMany({
          data: validatedData.assets.assets.map((asset) => ({
            employee_id: emp.id,
            asset_type: asset.asset_type,
            description: asset.description,
            brand: asset.brand || null,
            model: asset.model || null,
            serial_number: asset.serial_number || null,
            internal_code: asset.internal_code || null,
            status: asset.status,
            delivery_date: new Date(asset.delivery_date),
            observations: asset.observations || null,
          })),
        });
      }

      // Crear uniformes y prendas entregadas
      if (validatedData.uniforms.uniforms.length > 0) {
        await tx.employee_uniform.createMany({
          data: validatedData.uniforms.uniforms.map((u) => ({
            employee_id: emp.id,
            uniform_type: u.uniform_type,
            custom_type: u.custom_type || null,
            size: u.size,
            is_delivered: u.is_delivered,
            delivery_date: u.delivery_date ? new Date(u.delivery_date) : null,
            quantity: u.quantity,
            position: u.position,
            observations: u.observations || null,
          })),
        });
      }

      // Crear documentos adjuntos
      if (processedDocuments.length > 0) {
        await tx.employee_document.createMany({
          data: processedDocuments.map((doc) => ({
            employee_id: emp.id,
            document_type: doc.document_type,
            file_name: doc.file_name,
            file_url: doc.file_url,
          })),
        });
      }

      return emp;
    });

    return {
      success: true,
      employee_id: newEmployee.id,
      message: "Trabajador registrado exitosamente.",
    };
  } catch (error: unknown) {
    console.error("Error al registrar trabajador:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al procesar el formulario.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
