import * as XLSX from "xlsx";

interface EmployeeRecord {
  id: string;
  first_name: string;
  last_name: string;
  document_type: string;
  document_number: string;
  birth_date: Date | string;
  address: string;
  district: string;
  phone: string;
  personal_email: string;
  corporate_email?: string | null;
  marital_status: string;
  nationality: string;
  photo_url?: string | null;
  document_copy_url?: string | null;
  position: string;
  area: string;
  work_location: string;
  hire_date: Date | string;
  contract_type: string;
  status: string;
  end_date?: Date | string | null;
  salary: number;
  pension_system: string;
  afp_name?: string | null;
  afp_code?: string | null;
  has_family_allowance: boolean;
  observations?: string | null;
  created_at: Date | string;
  tenant: {
    name: string;
    slug: string;
  };
  family_members?: any[];
  emergency_contacts?: any[];
  bank_accounts?: any[];
  cts_account?: any;
  assets?: any[];
  uniforms?: any[];
  documents?: any[];
}

export function exportEmployeesToExcel(
  employees: EmployeeRecord[],
  filename: string = "Reporte_General_Trabajadores_RRHH.xlsx"
) {
  const wb = XLSX.utils.book_new();

  // --------------------------------------------------------------------------
  // Hoja 1: Trabajadores (Datos Generales y Laborales)
  // --------------------------------------------------------------------------
  const mainData = employees.map((emp, index) => ({
    "N°": index + 1,
    "Empresa / Tenant": emp.tenant.name,
    "Slug Tenant": emp.tenant.slug,
    "Nombres": emp.first_name,
    "Apellidos": emp.last_name,
    "Tipo Documento": emp.document_type,
    "Número Documento": emp.document_number,
    "Fecha Nacimiento": new Date(emp.birth_date).toLocaleDateString("es-PE"),
    "Teléfono / Celular": emp.phone,
    "Correo Personal": emp.personal_email,
    "Correo Corporativo": emp.corporate_email || "N/A",
    "Dirección": emp.address,
    "Distrito": emp.district,
    "Estado Civil": emp.marital_status,
    "Nacionalidad": emp.nationality,
    "Puesto / Cargo": emp.position,
    "Área": emp.area,
    "Sede / Edificio": emp.work_location,
    "Fecha de Ingreso": new Date(emp.hire_date).toLocaleDateString("es-PE"),
    "Tipo de Contrato": emp.contract_type,
    "Sueldo Base (S/.)": emp.salary,
    "Estado Laboral": emp.status,
    "Fecha de Cese": emp.end_date ? new Date(emp.end_date).toLocaleDateString("es-PE") : "N/A",
    "Sistema Pensiones": emp.pension_system,
    "Nombre AFP": emp.afp_name || "N/A",
    "CUSPP AFP": emp.afp_code || "N/A",
    "Asignación Familiar": emp.has_family_allowance ? "SÍ" : "NO",
    "Fotografía URL": emp.photo_url || "Sin Foto",
    "DNI Escaneado URL": emp.document_copy_url || "Sin DNI Adjunto",
    "Observaciones": emp.observations || "",
    "Fecha Registro": new Date(emp.created_at).toLocaleDateString("es-PE"),
  }));

  const wsMain = XLSX.utils.json_to_sheet(mainData);
  XLSX.utils.book_append_sheet(wb, wsMain, "Trabajadores");

  // --------------------------------------------------------------------------
  // Hoja 2: Derechohabientes y Familiares
  // --------------------------------------------------------------------------
  const familyData: any[] = [];
  employees.forEach((emp) => {
    if (emp.family_members && emp.family_members.length > 0) {
      emp.family_members.forEach((fam) => {
        familyData.push({
          "DNI Trabajador": emp.document_number,
          "Trabajador": `${emp.first_name} ${emp.last_name}`,
          "Empresa": emp.tenant.name,
          "Nombres y Apellidos Familiar": fam.full_name,
          "Parentesco": fam.relationship,
          "Tipo Documento": fam.document_type,
          "Número Documento": fam.document_number,
          "Fecha Nacimiento": new Date(fam.birth_date).toLocaleDateString("es-PE"),
          "Dependiente Económico": fam.is_dependent ? "SÍ" : "NO",
          "Teléfono": fam.phone || "N/A",
          "Observaciones": fam.observations || "",
        });
      });
    }
  });
  const wsFamily = XLSX.utils.json_to_sheet(familyData.length > 0 ? familyData : [{ "Mensaje": "Sin familiares registrados" }]);
  XLSX.utils.book_append_sheet(wb, wsFamily, "Familiares");

  // --------------------------------------------------------------------------
  // Hoja 3: Contactos de Emergencia
  // --------------------------------------------------------------------------
  const emergencyData: any[] = [];
  employees.forEach((emp) => {
    if (emp.emergency_contacts && emp.emergency_contacts.length > 0) {
      emp.emergency_contacts.forEach((emg) => {
        emergencyData.push({
          "DNI Trabajador": emp.document_number,
          "Trabajador": `${emp.first_name} ${emp.last_name}`,
          "Empresa": emp.tenant.name,
          "Nombres Contacto": emg.full_name,
          "Parentesco": emg.relationship,
          "Teléfono Principal": emg.phone,
          "Teléfono Alternativo": emg.alt_phone || "N/A",
          "Dirección": emg.address || "N/A",
          "Observaciones": emg.observations || "",
        });
      });
    }
  });
  const wsEmergency = XLSX.utils.json_to_sheet(emergencyData.length > 0 ? emergencyData : [{ "Mensaje": "Sin contactos registrados" }]);
  XLSX.utils.book_append_sheet(wb, wsEmergency, "Contactos Emergencia");

  // --------------------------------------------------------------------------
  // Hoja 4: Cuentas Bancarias y CTS
  // --------------------------------------------------------------------------
  const bankData: any[] = [];
  employees.forEach((emp) => {
    const bankAcc = emp.bank_accounts && emp.bank_accounts[0];
    const ctsAcc = emp.cts_account;
    bankData.push({
      "DNI Trabajador": emp.document_number,
      "Trabajador": `${emp.first_name} ${emp.last_name}`,
      "Empresa": emp.tenant.name,
      "Banco Sueldo": bankAcc?.bank || "N/A",
      "Tipo Cuenta Sueldo": bankAcc?.account_type || "N/A",
      "N° Cuenta Sueldo": bankAcc?.account_number || "N/A",
      "CCI Sueldo": bankAcc?.cci || "N/A",
      "Moneda Sueldo": bankAcc?.currency || "N/A",
      "Titular Sueldo": bankAcc?.account_holder || "N/A",
      "Tiene Cuenta CTS": ctsAcc?.has_cts_account ? "SÍ" : "NO (Apertura Empresa)",
      "Banco CTS": ctsAcc?.bank || "N/A",
      "N° Cuenta CTS": ctsAcc?.account_number || "N/A",
      "CCI CTS": ctsAcc?.cci || "N/A",
    });
  });
  const wsBank = XLSX.utils.json_to_sheet(bankData);
  XLSX.utils.book_append_sheet(wb, wsBank, "Bancos y CTS");

  // --------------------------------------------------------------------------
  // Hoja 5: Equipos Asignados
  // --------------------------------------------------------------------------
  const assetsData: any[] = [];
  employees.forEach((emp) => {
    if (emp.assets && emp.assets.length > 0) {
      emp.assets.forEach((ast) => {
        assetsData.push({
          "DNI Trabajador": emp.document_number,
          "Trabajador": `${emp.first_name} ${emp.last_name}`,
          "Empresa": emp.tenant.name,
          "Tipo de Equipo": ast.asset_type,
          "Descripción": ast.description,
          "Marca": ast.brand || "N/A",
          "Modelo": ast.model || "N/A",
          "Número de Serie": ast.serial_number || "N/A",
          "Código Interno": ast.internal_code || "N/A",
          "Estado Físico": ast.status,
          "Fecha de Entrega": ast.delivery_date ? new Date(ast.delivery_date).toLocaleDateString("es-PE") : "N/A",
          "Observaciones": ast.observations || "",
        });
      });
    }
  });
  const wsAssets = XLSX.utils.json_to_sheet(assetsData.length > 0 ? assetsData : [{ "Mensaje": "Sin equipos asignados" }]);
  XLSX.utils.book_append_sheet(wb, wsAssets, "Equipos y Activos");

  // --------------------------------------------------------------------------
  // Hoja 6: Uniformes y Prendas
  // --------------------------------------------------------------------------
  const uniformsData: any[] = [];
  employees.forEach((emp) => {
    if (emp.uniforms && emp.uniforms.length > 0) {
      emp.uniforms.forEach((uni) => {
        uniformsData.push({
          "DNI Trabajador": emp.document_number,
          "Trabajador": `${emp.first_name} ${emp.last_name}`,
          "Empresa": emp.tenant.name,
          "Prenda / Uniforme": uni.uniform_type === "OTRO" ? uni.custom_type : uni.uniform_type,
          "Talla": uni.size,
          "Cantidad (ud)": uni.quantity,
          "Puesto": uni.position,
          "Estado Entrega": uni.is_delivered ? "ENTREGADO" : "PENDIENTE",
          "Fecha de Entrega": uni.is_delivered && uni.delivery_date ? new Date(uni.delivery_date).toLocaleDateString("es-PE") : "N/A",
          "Observaciones": uni.observations || "",
        });
      });
    }
  });
  const wsUniforms = XLSX.utils.json_to_sheet(uniformsData.length > 0 ? uniformsData : [{ "Mensaje": "Sin prendas registradas" }]);
  XLSX.utils.book_append_sheet(wb, wsUniforms, "Uniformes y Prendas");

  // --------------------------------------------------------------------------
  // Hoja 7: Documentos Adjuntos (Cloudinary Links)
  // --------------------------------------------------------------------------
  const docsData: any[] = [];
  employees.forEach((emp) => {
    if (emp.documents && emp.documents.length > 0) {
      emp.documents.forEach((doc) => {
        docsData.push({
          "DNI Trabajador": emp.document_number,
          "Trabajador": `${emp.first_name} ${emp.last_name}`,
          "Empresa": emp.tenant.name,
          "Tipo de Documento": doc.document_type,
          "Nombre de Archivo": doc.file_name,
          "Enlace Cloudinary URL": doc.file_url || "N/A",
        });
      });
    }
  });
  const wsDocs = XLSX.utils.json_to_sheet(docsData.length > 0 ? docsData : [{ "Mensaje": "Sin documentos adjuntos" }]);
  XLSX.utils.book_append_sheet(wb, wsDocs, "Documentos Cloudinary");

  // Guardar archivo Excel
  XLSX.writeFile(wb, filename);
}

export function exportSingleEmployeeToExcel(employee: EmployeeRecord) {
  const sanitizeName = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_");

  const filename = `Ficha_RRHH_${employee.document_number}_${sanitizeName(employee.first_name)}_${sanitizeName(employee.last_name)}.xlsx`;
  exportEmployeesToExcel([employee], filename);
}
