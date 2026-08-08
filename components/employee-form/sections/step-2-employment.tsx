"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { FieldGroup } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  FormInput,
  FormSelect,
  FormRadioGroup,
  FormSwitch,
  FormTextarea,
} from "@/components/ui/form-controls";

interface Step2EmploymentProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step2Employment({ form }: Step2EmploymentProps) {
  const watchPensionSystem = form.watch("employment.pension_system");
  const watchStatus = form.watch("employment.status");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 2: Información Laboral</CardTitle>
        <CardDescription>
          Detalla el puesto, contrato, remuneración y afiliación previsional del trabajador.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="employment.position"
              label="Puesto / Cargo *"
              placeholder="Seleccionar puesto..."
              options={[
                { label: "Conserje", value: "CONSERJE" },
                { label: "Conserje de Limpieza", value: "CONSERJE_DE_LIMPIEZA" },
                { label: "Otro Puesto", value: "OTRO" },
              ]}
            />
            <FormInput
              control={form.control}
              name="employment.area"
              label="Área *"
              placeholder="Ej. Operaciones / Mantenimiento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={form.control}
              name="employment.hire_date"
              label="Fecha de Ingreso *"
              type="date"
            />
            <FormSelect
              control={form.control}
              name="employment.contract_type"
              label="Tipo de Contrato *"
              placeholder="Seleccionar contrato..."
              options={[
                { label: "Plazo Indeterminado", value: "INDETERMINADO" },
                { label: "Plazo Fijo / Sujeto a Modalidad", value: "PLAZO_FIJO" },
                { label: "Prácticas Pre-Profesionales", value: "PRAC_PRE" },
                { label: "Prácticas Profesionales", value: "PRAC_PRO" },
                { label: "Locación de Servicios", value: "LOCACION" },
              ]}
            />
            <FormInput
              control={form.control}
              name="employment.salary"
              label="Sueldo Bruto Mensual (S/.) *"
              type="number"
              step="0.01"
              placeholder="Ej. 1300.00"
            />
          </div>

          {/* Estado Laboral y Fecha de Cese Condicional */}
          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
            <FormRadioGroup
              control={form.control}
              name="employment.status"
              label="Estado del Trabajador *"
              options={[
                { label: "Activo", value: "ACTIVO", colorClass: "text-emerald-600" },
                { label: "Cesado", value: "CESADO", colorClass: "text-rose-600" },
              ]}
            />

            {watchStatus === "CESADO" && (
              <FormInput
                control={form.control}
                name="employment.end_date"
                label="Fecha de Cese *"
                type="date"
                description="Ingresa la fecha efectiva de término del vínculo laboral."
              />
            )}
          </div>

          {/* Sistema de Pensiones y Campos Condicionales de AFP */}
          <div className="p-4 border rounded-lg space-y-4">
            <FormRadioGroup
              control={form.control}
              name="employment.pension_system"
              label="Sistema de Pensiones *"
              options={[
                { label: "AFP (Privado)", value: "AFP" },
                { label: "ONP (Público - 19990)", value: "ONP" },
              ]}
            />

            {watchPensionSystem === "AFP" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <FormSelect
                  control={form.control}
                  name="employment.afp_name"
                  label="Nombre de la AFP *"
                  placeholder="Seleccionar AFP..."
                  options={[
                    { label: "AFP Integra", value: "Integra" },
                    { label: "AFP Prima", value: "Prima" },
                    { label: "AFP Profuturo", value: "Profuturo" },
                    { label: "AFP Habitat", value: "Habitat" },
                  ]}
                />
                <FormInput
                  control={form.control}
                  name="employment.afp_code"
                  label="Número de Afiliación (CUSPP) *"
                  placeholder="Ej. 593849102931"
                />
              </div>
            )}
          </div>

          {/* Asignación Familiar */}
          <FormSwitch
            control={form.control}
            name="employment.has_family_allowance"
            label="¿Aplica Asignación Familiar?"
            description="Marcar si el trabajador tiene hijos menores o que cursen estudios superiores."
          />

          {/* Observaciones */}
          <FormTextarea
            control={form.control}
            name="employment.observations"
            label="Observaciones Laborales"
            placeholder="Añade cualquier nota relevante sobre la contratación, horario o puesto..."
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
