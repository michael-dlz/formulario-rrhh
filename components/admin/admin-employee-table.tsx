"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemLabel,
  ItemValue,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { exportEmployeesToExcel, exportSingleEmployeeToExcel } from "@/lib/export-excel";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAdminAction, createTenantAction } from "@/app/actions/admin";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Logout01Icon,
  EyeIcon,
  UserIcon,
  Briefcase01Icon,
  BankIcon,
  Add01Icon,
  AlertCircleIcon,
  LinkSquare02Icon,
  UserGroupIcon,
  CallingIcon,
  ComputerIcon,
  TShirtIcon,
  File01Icon,
  FileSpreadsheetIcon,
  Download01Icon,
} from "@hugeicons/core-free-icons";

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

interface TenantItem {
  id: string;
  slug: string;
  name: string;
}

interface AdminEmployeeTableProps {
  initialEmployees: EmployeeRecord[];
  tenants: TenantItem[];
  adminEmail: string;
}

export function AdminEmployeeTable({
  initialEmployees,
  tenants,
  adminEmail,
}: AdminEmployeeTableProps) {
  const [tenantsList, setTenantsList] = useState<TenantItem[]>(tenants);
  const [selectedTenant, setSelectedTenant] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);

  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState<boolean>(false);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [tenantLoading, setTenantLoading] = useState<boolean>(false);

  const filteredEmployees = initialEmployees.filter((emp) => {
    const matchesTenant =
      selectedTenant === "ALL" || emp.tenant.slug === selectedTenant;

    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const docNumber = emp.document_number.toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = fullName.includes(term) || docNumber.includes(term);

    return matchesTenant && matchesSearch;
  });

  const handleCreateTenant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTenantError(null);
    setTenantLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createTenantAction(formData);
      if (res.success && res.tenant) {
        setTenantsList((prev) => [...prev, res.tenant]);
        setIsCreateTenantOpen(false);
      } else {
        setTenantError(res.error || "Error al crear la empresa.");
      }
    } catch (err: unknown) {
      setTenantError("Error inesperado al intentar crear la empresa.");
    } finally {
      setTenantLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <Card>
        <CardHeader>
          <CardTitle>
            Panel Administrativo de Registros RRHH
          </CardTitle>
          <CardDescription>
            Conectado como: <span className="font-semibold">{adminEmail}</span> | Registros totales: {filteredEmployees.length}
          </CardDescription>
          <CardAction className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportEmployeesToExcel(filteredEmployees)}
              title="Descargar reporte completo en Excel (.xlsx)"
            >
              <HugeiconsIcon icon={FileSpreadsheetIcon} className="text-emerald-600 dark:text-emerald-400" />
              Exportar Excel ({filteredEmployees.length})
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setTenantError(null);
                setIsCreateTenantOpen(true);
              }}
            >
              <HugeiconsIcon icon={Add01Icon} />
              Nueva Empresa
            </Button>
            <ThemeToggle />
            <form action={logoutAdminAction}>
              <Button type="submit" variant="destructive" size="sm">
                <HugeiconsIcon icon={Logout01Icon} />
                Cerrar Sesión
              </Button>
            </form>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Filter and Search controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel>
                Filtrar por Tenant / Empresa:
              </FieldLabel>
              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tenants..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos ({initialEmployees.length})</SelectItem>
                  {tenantsList.map((t) => (
                    <SelectItem key={t.id} value={t.slug}>
                      {t.name} ({t.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel>
                Buscar por Nombre o DNI:
              </FieldLabel>
              <div className="flex gap-2">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Ej. Juan Pérez o 72910298..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="w-4 h-4 absolute left-3 top-3 text-muted-foreground"
                  />
                </div>

                {selectedTenant !== "ALL" && (
                  <Button asChild variant="default">
                    <a href={`/${selectedTenant}`} target="_blank" rel="noopener noreferrer">
                      <HugeiconsIcon icon={LinkSquare02Icon} />
                      Abrir /{selectedTenant}
                    </a>
                  </Button>
                )}
              </div>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Main Employee Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-2">
              <p className="font-semibold text-base">No se encontraron registros de empleados.</p>
              <p className="text-xs">Intenta cambiar el filtro por tenant o el término de búsqueda.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Trabajador</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Puesto / Área</TableHead>
                  <TableHead>Ingreso</TableHead>
                  <TableHead>Sueldo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Badge variant="default" className="font-bold">
                          {emp.tenant.slug}
                        </Badge>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          title={`Abrir formulario de ${emp.tenant.name} (/${emp.tenant.slug})`}
                        >
                          <a href={`/${emp.tenant.slug}`} target="_blank" rel="noopener noreferrer">
                            <HugeiconsIcon icon={LinkSquare02Icon} />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {emp.photo_url ? (
                          <img
                            src={emp.photo_url}
                            alt={emp.first_name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                            {emp.first_name[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs text-muted-foreground">{emp.personal_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {emp.document_type}: {emp.document_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-xs">{emp.position}</p>
                        <p className="text-[11px] text-muted-foreground">{emp.area} - {emp.work_location}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(emp.hire_date).toLocaleDateString("es-PE")}
                    </TableCell>
                    <TableCell className="font-medium text-xs">
                      S/ {emp.salary.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={emp.status === "ACTIVO" ? "default" : "destructive"}>
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportSingleEmployeeToExcel(emp)}
                        title="Descargar Ficha Completa en Excel (.xlsx)"
                      >
                        <HugeiconsIcon icon={Download01Icon} />
                        Excel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedEmployee(emp)}
                      >
                        <HugeiconsIcon icon={EyeIcon} />
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Tenant Modal Dialog */}
      <Dialog open={isCreateTenantOpen} onOpenChange={setIsCreateTenantOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Registrar Nueva Empresa (Tenant)
            </DialogTitle>
            <DialogDescription>
              Crea una nueva empresa para generar su formulario independiente.
            </DialogDescription>
          </DialogHeader>

          {tenantError && (
            <Alert variant="destructive">
              <HugeiconsIcon icon={AlertCircleIcon} />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{tenantError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCreateTenant} className="space-y-4 pt-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tenant-name">Nombre de la Empresa *</FieldLabel>
                <Input
                  id="tenant-name"
                  name="name"
                  placeholder="Ej. LEGADO"
                  required
                  onChange={(e) => {
                    const form = e.target.form;
                    if (form && form["slug"]) {
                      form["slug"].value = e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]/g, "-")
                        .replace(/-+/g, "-");
                    }
                  }}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tenant-slug">Slug de la URL (Identificador) *</FieldLabel>
                <Input
                  id="tenant-slug"
                  name="slug"
                  placeholder="ej. legado"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="tenant-desc">Descripción (Opcional)</FieldLabel>
                <Input
                  id="tenant-desc"
                  name="description"
                  placeholder="Ej. Registro de trabajadores corporativo"
                />
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsCreateTenantOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={tenantLoading}>
                  {tenantLoading ? "Guardando..." : "Crear Empresa"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>

      {/* Employee Full Detail Modal Dialog using Item UI Components */}
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-5xl!">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {selectedEmployee?.photo_url ? (
                  <img
                    src={selectedEmployee.photo_url}
                    alt={selectedEmployee.first_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center font-bold text-xl">
                    {selectedEmployee?.first_name[0]}
                    {selectedEmployee?.last_name[0]}
                  </div>
                )}
                <div>
                  <DialogTitle>
                    {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                  </DialogTitle>
                  <DialogDescription>
                    Empresa Tenant: <Badge variant="default">{selectedEmployee?.tenant.name}</Badge> | DNI: <span className="font-mono font-bold">{selectedEmployee?.document_number}</span>
                  </DialogDescription>
                </div>
              </div>

              {selectedEmployee && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportSingleEmployeeToExcel(selectedEmployee)}
                >
                  <HugeiconsIcon icon={FileSpreadsheetIcon} className="text-emerald-600 dark:text-emerald-400" />
                  Descargar Ficha Excel (.xlsx)
                </Button>
              )}
            </div>
          </DialogHeader>

          {selectedEmployee && (
            <ScrollArea className="max-h-[72vh] space-y-6">
              {/* Sección 1: Datos Personales Completos con ItemGroup */}
              <div className="space-y-3">
                <Badge variant="default">
                  <HugeiconsIcon icon={UserIcon} /> Datos Personales
                </Badge>
                <Separator />
                <ItemGroup variant="grid-3">
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Documento:</ItemLabel>
                      <ItemValue>{selectedEmployee.document_type}: {selectedEmployee.document_number}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Teléfono / Celular:</ItemLabel>
                      <ItemValue>{selectedEmployee.phone}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Correo Personal:</ItemLabel>
                      <ItemValue>{selectedEmployee.personal_email}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Correo Corporativo:</ItemLabel>
                      <ItemValue>{selectedEmployee.corporate_email || "N/A"}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Fecha de Nacimiento:</ItemLabel>
                      <ItemValue>{new Date(selectedEmployee.birth_date).toLocaleDateString("es-PE")}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Estado Civil / Nacionalidad:</ItemLabel>
                      <ItemValue>{selectedEmployee.marital_status} - {selectedEmployee.nationality}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted" className="md:col-span-2">
                    <ItemContent>
                      <ItemLabel>Dirección de Residencia y Distrito:</ItemLabel>
                      <ItemValue>{selectedEmployee.address}, {selectedEmployee.district}</ItemValue>
                    </ItemContent>
                  </Item>
                  {selectedEmployee.document_copy_url && (
                    <Item size="xs" variant="muted">
                      <ItemContent>
                        <ItemLabel>Copia DNI Escaneado:</ItemLabel>
                        <ItemActions className="pt-1">
                          <Button asChild variant="default" size="sm" className="h-7 text-xs">
                            <a href={selectedEmployee.document_copy_url} target="_blank" rel="noopener noreferrer">
                              <HugeiconsIcon icon={LinkSquare02Icon} />
                              Ver DNI
                            </a>
                          </Button>
                        </ItemActions>
                      </ItemContent>
                    </Item>
                  )}
                </ItemGroup>
              </div>

              {/* Sección 2: Información Laboral Completa con ItemGroup */}
              <div className="space-y-3 pt-4">
                <Badge variant="default">
                  <HugeiconsIcon icon={Briefcase01Icon} /> Datos Laborales
                </Badge>
                <Separator />
                <ItemGroup variant="grid-3">
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Puesto / Cargo:</ItemLabel>
                      <ItemActions className="pt-1">
                        <Badge variant="default">{selectedEmployee.position}</Badge>
                      </ItemActions>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Área y Sede:</ItemLabel>
                      <ItemValue>{selectedEmployee.area} - {selectedEmployee.work_location}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Sueldo Base Mensual:</ItemLabel>
                      <ItemValue className="text-primary font-bold">S/ {selectedEmployee.salary.toFixed(2)}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Fecha de Ingreso:</ItemLabel>
                      <ItemValue>{new Date(selectedEmployee.hire_date).toLocaleDateString("es-PE")}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Tipo de Contrato:</ItemLabel>
                      <ItemValue>{selectedEmployee.contract_type}</ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Estado Laboral:</ItemLabel>
                      <ItemActions className="pt-1">
                        <Badge variant={selectedEmployee.status === "ACTIVO" ? "default" : "destructive"}>
                          {selectedEmployee.status}
                        </Badge>
                      </ItemActions>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted" className="md:col-span-2">
                    <ItemContent>
                      <ItemLabel>Sistema de Pensiones:</ItemLabel>
                      <ItemValue>
                        {selectedEmployee.pension_system} {selectedEmployee.afp_name && `(${selectedEmployee.afp_name} - CUSPP: ${selectedEmployee.afp_code})`}
                      </ItemValue>
                    </ItemContent>
                  </Item>
                  <Item size="xs" variant="muted">
                    <ItemContent>
                      <ItemLabel>Asignación Familiar:</ItemLabel>
                      <ItemValue>{selectedEmployee.has_family_allowance ? "Sí aplica" : "No aplica"}</ItemValue>
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </div>

              {/* Sección 3: Datos de Familia con ItemGroup */}
              <div className="space-y-3 pt-4">
                <Badge variant="default">
                  <HugeiconsIcon icon={UserGroupIcon} /> Datos de Familia ({selectedEmployee.family_members?.length || 0})
                </Badge>
                <Separator />
                {!selectedEmployee.family_members || selectedEmployee.family_members.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Sin familiares o derechohabientes registrados.</p>
                ) : (
                  <ItemGroup variant="stack">
                    {selectedEmployee.family_members.map((fam, idx) => (
                      <Item key={idx} size="xs" variant="muted">
                        <ItemMedia variant="icon" size="sm">
                          <HugeiconsIcon icon={UserGroupIcon} className="w-4 h-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{fam.full_name} ({fam.relationship})</ItemTitle>
                          <ItemDescription>
                            {fam.document_type}: {fam.document_number} | F. Nacimiento: {new Date(fam.birth_date).toLocaleDateString("es-PE")}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Badge variant={fam.is_dependent ? "default" : "outline"}>
                            {fam.is_dependent ? "Dependiente Económico" : "No Dependiente"}
                          </Badge>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                )}
              </div>

              {/* Sección 4: Contactos de Emergencia con ItemGroup */}
              <div className="space-y-3 pt-4">
                <Badge variant="default">
                  <HugeiconsIcon icon={CallingIcon} /> Contactos de Emergencia ({selectedEmployee.emergency_contacts?.length || 0})
                </Badge>
                <Separator />
                {!selectedEmployee.emergency_contacts || selectedEmployee.emergency_contacts.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Sin contactos de emergencia registrados.</p>
                ) : (
                  <ItemGroup variant="stack">
                    {selectedEmployee.emergency_contacts.map((emg, idx) => (
                      <Item key={idx} size="xs" variant="muted">
                        <ItemMedia variant="icon" size="sm">
                          <HugeiconsIcon icon={CallingIcon} className="w-4 h-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{emg.full_name} ({emg.relationship})</ItemTitle>
                          <ItemDescription>
                            Teléfono Principal: {emg.phone} {emg.alt_phone && `| Alternativo: ${emg.alt_phone}`} {emg.address && `| ${emg.address}`}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                )}
              </div>

              {/* Sección 5: Bancos y CTS con ItemGroup */}
              <div className="space-y-3 pt-4">
                <Badge variant="default">
                  <HugeiconsIcon icon={BankIcon} /> Bancos y Cuenta CTS
                </Badge>
                <Separator />
                <ItemGroup variant="grid-2">
                  <Item size="sm" variant="muted">
                    <ItemContent>
                      <ItemLabel className="font-bold text-primary">Cuenta Sueldo</ItemLabel>
                      {selectedEmployee.bank_accounts && selectedEmployee.bank_accounts.length > 0 ? (
                        selectedEmployee.bank_accounts.map((b, i) => (
                          <div key={i} className="space-y-1 text-xs pt-1">
                            <p><span className="text-muted-foreground">Banco:</span> <strong className="font-semibold">{b.bank}</strong> ({b.account_type})</p>
                            <p><span className="text-muted-foreground">Número de Cuenta:</span> <span className="font-mono">{b.account_number}</span></p>
                            <p><span className="text-muted-foreground">CCI:</span> <span className="font-mono">{b.cci}</span></p>
                            <p><span className="text-muted-foreground">Titular / Moneda:</span> {b.account_holder} ({b.currency})</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic pt-1">Sin información de sueldo.</p>
                      )}
                    </ItemContent>
                  </Item>

                  <Item size="sm" variant="muted">
                    <ItemContent>
                      <ItemLabel className="font-bold text-primary">Cuenta CTS</ItemLabel>
                      {selectedEmployee.cts_account && selectedEmployee.cts_account.has_cts_account ? (
                        <div className="space-y-1 text-xs pt-1">
                          <p><span className="text-muted-foreground">Banco CTS:</span> <strong className="font-semibold">{selectedEmployee.cts_account.bank}</strong></p>
                          <p><span className="text-muted-foreground">Número CTS:</span> <span className="font-mono">{selectedEmployee.cts_account.account_number}</span></p>
                          <p><span className="text-muted-foreground">CCI CTS:</span> <span className="font-mono">{selectedEmployee.cts_account.cci || "N/A"}</span></p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic pt-1">Sin cuenta CTS previa (Apertura gestionada por la empresa).</p>
                      )}
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </div>

              {/* Sección 6: Equipos Asignados con ItemGroup */}
              <div className="space-y-3 pt-4">
                <Badge variant="default">
                  <HugeiconsIcon icon={ComputerIcon} /> Equipos Asignados ({selectedEmployee.assets?.length || 0})
                </Badge>
                <Separator />
                {!selectedEmployee.assets || selectedEmployee.assets.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Sin equipos o activos asignados.</p>
                ) : (
                  <ItemGroup variant="stack">
                    {selectedEmployee.assets.map((ast, idx) => (
                      <Item key={idx} size="xs" variant="muted">
                        <ItemMedia variant="icon" size="sm">
                          <HugeiconsIcon icon={ComputerIcon} className="w-4 h-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{ast.asset_type}: {ast.description}</ItemTitle>
                          <ItemDescription className="space-y-0.5 text-xs">
                            <span className="block">
                              {ast.brand && `Marca: ${ast.brand} | `}
                              {ast.model && `Modelo: ${ast.model} | `}
                              {ast.serial_number && `N/S: ${ast.serial_number} | `}
                              {ast.internal_code && `Código: ${ast.internal_code}`}
                            </span>
                            {ast.delivery_date && (
                              <span className="block font-medium text-foreground">
                                Fecha de Entrega: {new Date(ast.delivery_date).toLocaleDateString("es-PE")}
                              </span>
                            )}
                            {ast.observations && (
                              <span className="block italic text-muted-foreground">
                                Observaciones: {ast.observations}
                              </span>
                            )}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Badge variant="default">{ast.status}</Badge>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                )}
              </div>

              {/* Sección 7: Uniformes y Prendas con ItemGroup */}
              <div className="space-y-3 pt-4">
                <Badge variant="default">
                  <HugeiconsIcon icon={TShirtIcon} /> Uniformes y Prendas ({selectedEmployee.uniforms?.length || 0})
                </Badge>
                <Separator />
                {!selectedEmployee.uniforms || selectedEmployee.uniforms.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Sin prendas o uniformes asignados.</p>
                ) : (
                  <ItemGroup variant="stack">
                    {selectedEmployee.uniforms.map((uni, idx) => (
                      <Item key={idx} size="xs" variant="muted">
                        <ItemMedia variant="icon" size="sm">
                          <HugeiconsIcon icon={TShirtIcon} className="w-4 h-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>
                            {uni.uniform_type === "OTRO" ? uni.custom_type : uni.uniform_type} ({uni.quantity} ud)
                          </ItemTitle>
                          <ItemDescription className="space-y-0.5 text-xs">
                            <span className="block">Talla: <strong className="text-foreground">{uni.size}</strong> | Puesto: {uni.position}</span>
                            {uni.is_delivered && uni.delivery_date && (
                              <span>
                                Fecha de Entrega: {new Date(uni.delivery_date).toLocaleDateString("es-PE")}
                              </span>
                            )}
                            {uni.observations && (
                              <span className="block italic text-muted-foreground">
                                Observaciones: {uni.observations}
                              </span>
                            )}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Badge variant={uni.is_delivered ? "default" : "secondary"}>
                            {uni.is_delivered ? "Entregado" : "Pendiente de Entrega"}
                          </Badge>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                )}
              </div>

              {/* Sección 8: Documentos Adjuntos Cloudinary con ItemGroup */}
              <div className="space-y-3 pt-4 pb-4">
                <Badge variant="default">
                  <HugeiconsIcon icon={File01Icon} /> Documentos Adjuntos Cloudinary ({selectedEmployee.documents?.length || 0})
                </Badge>
                <Separator />
                {!selectedEmployee.documents || selectedEmployee.documents.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Sin documentos adicionales adjuntados.</p>
                ) : (
                  <ItemGroup variant="stack">
                    {selectedEmployee.documents.map((doc, idx) => (
                      <Item key={idx} size="xs" variant="muted">
                        <ItemMedia variant="icon" size="sm">
                          <HugeiconsIcon icon={File01Icon} className="w-4 h-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{doc.document_type}</ItemTitle>
                          <ItemDescription>{doc.file_name}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          {doc.file_url && (
                            <Button asChild variant="default" size="sm" className="h-7 text-xs">
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                <HugeiconsIcon icon={LinkSquare02Icon} />
                                Abrir Documento
                              </a>
                            </Button>
                          )}
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
