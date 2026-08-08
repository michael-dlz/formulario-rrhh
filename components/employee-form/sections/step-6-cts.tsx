"use client";

import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormInput, FormSelect, FormRadioGroup } from "@/components/ui/form-controls";

interface Step6CtsProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step6Cts({ form }: Step6CtsProps) {
  const watchHasCts = form.watch("cts.has_cts_account");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 6: Cuenta CTS (Compensación por Tiempo de Servicios)</CardTitle>
        <CardDescription>
          La información de la cuenta CTS es opcional. Indica si el trabajador ya dispone de una cuenta aperturada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
            <Controller
              name="cts.has_cts_account"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-semibold text-base">¿Ya cuenta con una cuenta CTS abierta? *</FieldLabel>
                  <RadioGroup
                    onValueChange={(val) => field.onChange(val === "true")}
                    value={field.value ? "true" : "false"}
                    className="flex flex-col sm:flex-row gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 bg-card w-full">
                      <RadioGroupItem value="true" id="cts-yes" />
                      <label htmlFor="cts-yes" className="cursor-pointer font-medium text-sm">
                        Sí, ya tengo una cuenta CTS activa
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 bg-card w-full">
                      <RadioGroupItem value="false" id="cts-no" />
                      <label htmlFor="cts-no" className="cursor-pointer font-medium text-sm">
                        Todavía no tengo (Aperturar por la empresa)
                      </label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {watchHasCts ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  name="cts.bank"
                  label="Banco / Financiera CTS *"
                  placeholder="Seleccionar Banco CTS..."
                  options={[
                    { label: "BCP - Banco de Crédito del Perú", value: "BCP" },
                    { label: "BBVA Perú", value: "BBVA" },
                    { label: "Interbank", value: "Interbank" },
                    { label: "Scotiabank", value: "Scotiabank" },
                    { label: "BanBif", value: "BanBif" },
                    { label: "Caja Arequipa", value: "Caja Arequipa" },
                    { label: "Caja Huancayo", value: "Caja Huancayo" },
                    { label: "Caja Piura", value: "Caja Piura" },
                    { label: "Otro Banco / Caja", value: "Otro" },
                  ]}
                />

                <FormInput
                  control={form.control}
                  name="cts.account_number"
                  label="Número de Cuenta CTS *"
                  placeholder="Ej. 191-00987654-0-99"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="cts.cci"
                  label="Código Interbancario CTS (CCI)"
                  placeholder="Ej. 002-191-0000987654099-10"
                />

                <FormRadioGroup
                  control={form.control}
                  name="cts.currency"
                  label="Moneda de la Cuenta CTS"
                  options={[
                    { label: "Soles (PEN S/.)", value: "PEN" },
                    { label: "Dólares (USD $)", value: "USD" },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-lg bg-muted/20 text-sm">
              <p className="font-medium">Información de Apertura CTS:</p>
              <FieldDescription className="text-xs mt-1">
                Al seleccionar &quot;Todavía no tengo&quot;, Recursos Humanos gestionará la apertura de la cuenta CTS corporativa según la normativa laboral vigente.
              </FieldDescription>
            </div>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
