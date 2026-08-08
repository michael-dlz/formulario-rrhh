"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { FieldGroup } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormInput, FormSelect, FormRadioGroup } from "@/components/ui/form-controls";

interface Step5BankProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step5Bank({ form }: Step5BankProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 5: Datos para Abono de Sueldo</CardTitle>
        <CardDescription>
          Ingresa la cuenta bancaria donde se depositarán los haberes y remuneraciones del trabajador.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="bank.bank"
              label="Entidad Bancaria *"
              placeholder="Seleccionar Banco..."
              options={[
                { label: "BCP - Banco de Crédito del Perú", value: "BCP" },
                { label: "BBVA Perú", value: "BBVA" },
                { label: "Interbank", value: "Interbank" },
                { label: "Scotiabank", value: "Scotiabank" },
                { label: "BanBif", value: "BanBif" },
                { label: "Banco de la Nación", value: "Banco de la Nacion" },
                { label: "Banco Pichincha", value: "Pichincha" },
                { label: "Otro Banco / Caja", value: "Otro" },
              ]}
            />

            <FormSelect
              control={form.control}
              name="bank.account_type"
              label="Tipo de Cuenta *"
              placeholder="Seleccionar Tipo..."
              options={[
                { label: "Cuenta Sueldo", value: "Cuenta Sueldo" },
                { label: "Cuenta de Ahorros", value: "Cuenta Ahorros" },
                { label: "Cuenta Corriente", value: "Cuenta Corriente" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="bank.account_number"
              label="Número de Cuenta Bancaria *"
              placeholder="Ej. 193-98765432-0-12"
            />
            <FormInput
              control={form.control}
              name="bank.cci"
              label="Código Interbancario (CCI) *"
              placeholder="Ej. 002-193-0098765432012-14"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <FormRadioGroup
              control={form.control}
              name="bank.currency"
              label="Moneda de la Cuenta *"
              options={[
                { label: "Soles (PEN S/.)", value: "PEN" },
                { label: "Dólares (USD $)", value: "USD" },
              ]}
            />

            <FormInput
              control={form.control}
              name="bank.account_holder"
              label="Titular de la Cuenta *"
              placeholder="Nombre completo del titular"
              description="Debe coincidir con el nombre del trabajador registrado."
            />
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
