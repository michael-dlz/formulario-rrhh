import { z } from "zod";

export const documentTypeEnum = z.enum(["DNI", "CE", "PASAPORTE"]);
export const maritalStatusEnum = z.enum(["SOLTERO", "CASADO", "CONVIVIENTE", "DIVORCIADO", "VIUDO"]);
export const employmentStatusEnum = z.enum(["ACTIVO", "CESADO"]);
export const contractTypeEnum = z.enum(["INDETERMINADO", "PLAZO_FIJO", "PRAC_PRE", "PRAC_PRO", "LOCACION"]);
export const pensionSystemEnum = z.enum(["AFP", "ONP"]);
export const currencyEnum = z.enum(["PEN", "USD"]);
export const assetStatusEnum = z.enum(["NUEVO", "BUENO", "REGULAR", "MALO"]);
export const uniformTypeEnum = z.enum(["CASACA", "PULLOVER", "PANTALON", "POLO", "OTRO"]);
export const employeePositionEnum = z.enum(["CONSERJE", "CONSERJE_DE_LIMPIEZA", "OTRO"]);

export const personalInfoSchema = z.object({
  first_name: z.string().min(2, "Ingresa un nombre válido."),
  last_name: z.string().min(2, "Ingresa apellidos válidos."),
  document_type: documentTypeEnum,
  document_number: z.string().min(8, "Ingresa un número de documento válido.").max(12, "El documento no debe exceder 12 caracteres."),
  birth_date: z.string().min(1, "La fecha de nacimiento es obligatoria."),
  address: z.string().min(3, "La dirección es obligatoria."),
  district: z.string().min(2, "El distrito es obligatorio."),
  phone: z.string().min(6, "Ingresa un número de teléfono válido."),
  personal_email: z.string().email("Ingresa un correo personal válido."),
  corporate_email: z.string().email("Ingresa un correo corporativo válido.").or(z.literal("")).optional(),
  marital_status: maritalStatusEnum,
  nationality: z.string().min(2, "La nacionalidad es obligatoria.").default("Peruana"),
  photo_url: z.string().optional(),
  document_copy_url: z.string().optional(),
});

export const employmentInfoSchema = z
  .object({
    position: employeePositionEnum,
    area: z.string().min(2, "El área laboral es obligatoria."),
    work_location: z.string().optional().default(""),
    hire_date: z.string().min(1, "La fecha de ingreso es obligatoria."),
    contract_type: contractTypeEnum,
    status: employmentStatusEnum,
    end_date: z.string().optional(),
    salary: z.coerce.number().positive("El sueldo debe ser un monto positivo mayor a 0."),
    pension_system: pensionSystemEnum,
    afp_name: z.string().optional(),
    afp_code: z.string().optional(),
    has_family_allowance: z.boolean().default(false),
    observations: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "CESADO" && (!data.end_date || data.end_date.trim() === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Si el estado es Cesado, debe ingresar la fecha de cese.",
      path: ["end_date"],
    }
  )
  .refine(
    (data) => {
      if (data.pension_system === "AFP") {
        return !!data.afp_name && data.afp_name.trim().length > 0;
      }
      return true;
    },
    {
      message: "Si selecciona AFP, debe ingresar el nombre de la AFP.",
      path: ["afp_name"],
    }
  )
  .refine(
    (data) => {
      if (data.pension_system === "AFP") {
        return !!data.afp_code && data.afp_code.trim().length > 0;
      }
      return true;
    },
    {
      message: "Si selecciona AFP, debe ingresar el número de afiliación.",
      path: ["afp_code"],
    }
  );

export const familyMemberSchema = z.object({
  full_name: z.string().min(2, "Ingresa nombres y apellidos válidos."),
  relationship: z.string().min(2, "Especifica el parentesco."),
  document_type: documentTypeEnum.default("DNI"),
  document_number: z.string().min(8, "Número de documento inválido."),
  birth_date: z.string().min(1, "Fecha de nacimiento obligatoria."),
  is_dependent: z.boolean().default(true),
  phone: z.string().optional(),
  observations: z.string().optional(),
});

export const familyMembersSchema = z.object({
  family_members: z.array(familyMemberSchema),
});

export const emergencyContactSchema = z.object({
  full_name: z.string().min(2, "Ingresa nombres y apellidos válidos."),
  relationship: z.string().min(2, "Especifica el parentesco."),
  phone: z.string().min(6, "Teléfono de contacto inválido."),
  alt_phone: z.string().optional(),
  address: z.string().optional(),
  observations: z.string().optional(),
});

export const emergencyContactsSchema = z.object({
  emergency_contacts: z.array(emergencyContactSchema).min(1, "Debe registrar al menos un contacto de emergencia."),
});

export const bankAccountSchema = z.object({
  bank: z.string().min(2, "El banco es obligatorio."),
  account_type: z.string().min(2, "El tipo de cuenta es obligatorio."),
  account_number: z.string().min(5, "Ingresa un número de cuenta válido."),
  cci: z.string().min(10, "Ingresa un CCI válido."),
  currency: currencyEnum.default("PEN"),
  account_holder: z.string().min(2, "El titular de la cuenta es obligatorio."),
});

export const ctsAccountSchema = z
  .object({
    has_cts_account: z.boolean().default(false),
    bank: z.string().optional(),
    account_number: z.string().optional(),
    cci: z.string().optional(),
    currency: currencyEnum.optional(),
  })
  .refine(
    (data) => {
      if (data.has_cts_account) {
        return !!data.bank && data.bank.trim().length > 0;
      }
      return true;
    },
    {
      message: "Ingresa el banco para la cuenta CTS.",
      path: ["bank"],
    }
  )
  .refine(
    (data) => {
      if (data.has_cts_account) {
        return !!data.account_number && data.account_number.trim().length > 0;
      }
      return true;
    },
    {
      message: "Ingresa el número de cuenta CTS.",
      path: ["account_number"],
    }
  );

export const assetItemSchema = z.object({
  asset_type: z.string().min(2, "Tipo de activo obligatorio."),
  description: z.string().min(2, "Descripción obligatoria."),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  internal_code: z.string().optional(),
  status: assetStatusEnum.default("BUENO"),
  delivery_date: z.string().min(1, "Fecha de entrega obligatoria."),
  observations: z.string().optional(),
});

export const assetsSchema = z.object({
  has_assets: z.boolean().default(false),
  assets: z.array(assetItemSchema),
});

export const uniformItemSchema = z.object({
  uniform_type: uniformTypeEnum,
  custom_type: z.string().optional(),
  size: z.string().min(1, "Especifica la talla para esta prenda."),
  is_delivered: z.boolean().default(true),
  delivery_date: z.string().optional(),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1.").default(1),
  position: employeePositionEnum,
  observations: z.string().optional(),
});

export const uniformsSchema = z.object({
  uniforms: z.array(uniformItemSchema),
});

export const documentItemSchema = z.object({
  document_type: z.string().min(2, "Tipo de documento obligatorio."),
  file_name: z.string().min(1, "Nombre del archivo obligatorio."),
  file_url: z.string().min(1, "Debe cargar el archivo."),
});

export const documentsSchema = z.object({
  documents: z.array(documentItemSchema),
});

export const employeeFormSchema = z.object({
  tenant_slug: z.string().min(1, "Tenant inválido."),
  personal: personalInfoSchema,
  employment: employmentInfoSchema,
  family: familyMembersSchema,
  emergency: emergencyContactsSchema,
  bank: bankAccountSchema,
  cts: ctsAccountSchema,
  assets: assetsSchema,
  uniforms: uniformsSchema,
  documents: documentsSchema,
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type EmploymentInfoValues = z.infer<typeof employmentInfoSchema>;
export type FamilyMemberValues = z.infer<typeof familyMemberSchema>;
export type EmergencyContactValues = z.infer<typeof emergencyContactSchema>;
export type BankAccountValues = z.infer<typeof bankAccountSchema>;
export type CtsAccountValues = z.infer<typeof ctsAccountSchema>;
export type AssetItemValues = z.infer<typeof assetItemSchema>;
export type UniformItemValues = z.infer<typeof uniformItemSchema>;
export type DocumentItemValues = z.infer<typeof documentItemSchema>;
