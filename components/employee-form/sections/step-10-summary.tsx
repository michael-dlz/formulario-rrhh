"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";

interface Step10SummaryProps {
  form: UseFormReturn<EmployeeFormValues>;
  onGoToStep: (step: number) => void;
}

export function Step10Summary({ form, onGoToStep }: Step10SummaryProps) {
  const values = form.getValues();
  const { personal, employment, family, emergency, bank, cts, assets, uniforms, documents } = values;

  const maskAccount = (num?: string) => {
    if (!num || num.length < 4) return num || "N/A";
    return "****" + num.slice(-4);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 10: Resumen y Confirmación Final</CardTitle>
        <CardDescription>
          Revisa minuciosamente toda la información antes de guardar definitivamente en el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Datos Personales */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wide">1. Datos Personales</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(1)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
              Modificar
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Nombres y Apellidos:</span>
              <span className="font-semibold">{personal.first_name} {personal.last_name}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Documento:</span>
              <span className="font-medium">{personal.document_type}: {personal.document_number}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Fecha de Nacimiento:</span>
              <span className="font-medium">{personal.birth_date}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Teléfono / Celular:</span>
              <span className="font-medium">{personal.phone}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Correo Personal:</span>
              <span className="font-medium">{personal.personal_email}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Dirección / Distrito:</span>
              <span className="font-medium">{personal.address}, {personal.district}</span>
            </div>
          </div>
        </div>

        {/* Información Laboral */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wide">2. Información Laboral</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(2)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
              Modificar
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Puesto / Cargo:</span>
              <Badge variant="outline">{employment.position}</Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Área y Sede:</span>
              <span className="font-medium">{employment.area} - {employment.work_location}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Fecha de Ingreso:</span>
              <span className="font-medium">{employment.hire_date}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Tipo de Contrato:</span>
              <span className="font-medium">{employment.contract_type}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Estado Laboral:</span>
              <Badge variant={employment.status === "ACTIVO" ? "default" : "destructive"}>
                {employment.status} {employment.status === "CESADO" && `(${employment.end_date})`}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Sistema de Pensiones:</span>
              <span className="font-medium">
                {employment.pension_system} {employment.pension_system === "AFP" && `(${employment.afp_name} - ${employment.afp_code})`}
              </span>
            </div>
          </div>
        </div>

        {/* Datos de Familia */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wide">3. Datos de Familia ({family.family_members.length})</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(3)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
              Modificar
            </Button>
          </div>
          <Separator />
          {family.family_members.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Sin familiares registrados.</p>
          ) : (
            <div className="space-y-2">
              {family.family_members.map((fam, idx) => (
                <div key={idx} className="text-xs flex items-center justify-between border-b pb-1">
                  <span className="font-medium">{fam.full_name} ({fam.relationship})</span>
                  <span className="text-muted-foreground">{fam.document_type}: {fam.document_number} | Dependiente: {fam.is_dependent ? "Sí" : "No"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contactos de Emergencia */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wide">4. Contacto de Emergencia ({emergency.emergency_contacts.length})</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(4)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
              Modificar
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            {emergency.emergency_contacts.map((emg, idx) => (
              <div key={idx} className="text-xs flex items-center justify-between border-b pb-1">
                <span className="font-medium">{emg.full_name} ({emg.relationship})</span>
                <span className="text-muted-foreground">Teléfono: {emg.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Abono de Sueldo y CTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">5. Abono de Sueldo</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onGoToStep(5)}
              >
                <HugeiconsIcon icon={PencilEdit02Icon} />
                Modificar
              </Button>
            </div>
            <Separator />
            <div className="text-xs space-y-1">
              <p><span className="text-muted-foreground">Banco:</span> <span className="font-semibold">{bank.bank}</span> ({bank.account_type})</p>
              <p><span className="text-muted-foreground">Número de Cuenta:</span> <span className="font-mono font-medium">{maskAccount(bank.account_number)}</span></p>
              <p><span className="text-muted-foreground">CCI:</span> <span className="font-mono font-medium">{maskAccount(bank.cci)}</span></p>
              <p><span className="text-muted-foreground">Moneda / Titular:</span> {bank.currency} - {bank.account_holder}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">6. Cuenta CTS</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onGoToStep(6)}
              >
                <HugeiconsIcon icon={PencilEdit02Icon} />
                Modificar
              </Button>
            </div>
            <Separator />
            <div className="text-xs space-y-1">
              {cts.has_cts_account ? (
                <>
                  <p><span className="text-muted-foreground">Banco CTS:</span> <span className="font-semibold">{cts.bank}</span></p>
                  <p><span className="text-muted-foreground">Cuenta:</span> <span className="font-mono font-medium">{maskAccount(cts.account_number)}</span></p>
                </>
              ) : (
                <p className="text-muted-foreground italic">Todavía no tiene cuenta CTS (Empresa gestionará apertura).</p>
              )}
            </div>
          </div>
        </div>

        {/* Equipos y Uniformes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">7. Equipos ({assets.assets.length})</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onGoToStep(7)}
              >
                <HugeiconsIcon icon={PencilEdit02Icon} />
                Modificar
              </Button>
            </div>
            <Separator />
            {assets.assets.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Sin equipos asignados.</p>
            ) : (
              <div className="space-y-2">
                {assets.assets.map((ast, idx) => (
                  <div key={idx} className="text-xs p-2 rounded border bg-muted/20 space-y-0.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{ast.asset_type}: {ast.description}</span>
                      <Badge variant="outline">{ast.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {ast.brand && `Marca: ${ast.brand} | `}
                      {ast.model && `Modelo: ${ast.model} | `}
                      {ast.serial_number && `N/S: ${ast.serial_number}`}
                    </p>
                    {ast.delivery_date && (
                      <p className="text-emerald-600 font-medium">Fecha Entrega: {ast.delivery_date}</p>
                    )}
                    {ast.observations && (
                      <p className="italic text-muted-foreground">Nota: {ast.observations}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">8. Uniformes ({uniforms.uniforms.length})</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onGoToStep(8)}
              >
                <HugeiconsIcon icon={PencilEdit02Icon} />
                Modificar
              </Button>
            </div>
            <Separator />
            {uniforms.uniforms.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Sin prendas registradas.</p>
            ) : (
              <div className="space-y-2">
                {uniforms.uniforms.map((uni, idx) => (
                  <div key={idx} className="text-xs p-2 rounded border bg-muted/20 space-y-0.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span>{uni.uniform_type === "OTRO" ? uni.custom_type : uni.uniform_type} ({uni.quantity} ud)</span>
                      <Badge variant={uni.is_delivered ? "default" : "secondary"}>
                        {uni.is_delivered ? "Entregado" : "Pendiente"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">Talla: <strong className="text-foreground">{uni.size}</strong> | Puesto: {uni.position}</p>
                    {uni.is_delivered && uni.delivery_date && (
                      <p className="text-emerald-600 font-medium">Fecha Entrega: {uni.delivery_date}</p>
                    )}
                    {uni.observations && (
                      <p className="italic text-muted-foreground">Nota: {uni.observations}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documentos */}
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wide">9. Documentos ({documents.documents.length})</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(9)}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
              Modificar
            </Button>
          </div>
          <Separator />
          {documents.documents.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Sin documentos adjuntados.</p>
          ) : (
            <div className="space-y-1">
              {documents.documents.map((doc, idx) => (
                <div key={idx} className="text-xs flex items-center justify-between">
                  <span className="font-medium">{doc.document_type}</span>
                  <span className="text-muted-foreground">{doc.file_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
