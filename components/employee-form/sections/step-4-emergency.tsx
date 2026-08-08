"use client";

import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { CallingIcon, Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { FormInput, FormSelect } from "@/components/ui/form-controls";
import EmptyForm from "../empty-form";

interface Step4EmergencyProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step4Emergency({ form }: Step4EmergencyProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emergency.emergency_contacts",
  });

  const addEmergencyContact = () => {
    append({
      full_name: "",
      relationship: "ESPOSO(A)",
      phone: "",
      alt_phone: "",
      address: "",
      observations: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 4: Contacto de Emergencia</CardTitle>
        <CardDescription>
          Registra a quién contactar en caso de cualquier eventualidad o emergencia médica.
        </CardDescription>
        <CardAction>
          <Button type="button" variant="outline" size="sm" onClick={addEmergencyContact}>
            <HugeiconsIcon icon={Add01Icon} />
            Agregar contacto
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <EmptyForm
            title="No has registrado ningún contacto de emergencia aún."
            description="Debes registrar al menos un contacto de emergencia."
            buttonText="Agregar contacto de emergencia"
            icon={CallingIcon}
            buttonAction={addEmergencyContact}
          />
        ) : (
          fields.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
              <div className="flex items-center justify-between border-b pb-2">
                <Badge variant="outline">
                  Contacto de Emergencia #{index + 1}
                </Badge>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} />
                    Eliminar
                  </Button>
                )}
              </div>

              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name={`emergency.emergency_contacts.${index}.full_name`}
                    label="Nombres y Apellidos *"
                    placeholder="Ej. Carlos De La Cruz"
                  />
                  <FormSelect
                    control={form.control}
                    name={`emergency.emergency_contacts.${index}.relationship`}
                    label="Parentesco / Relación *"
                    placeholder="Seleccionar parentesco..."
                    options={[
                      { label: "Esposo(a) / Cónyuge", value: "ESPOSO(A)" },
                      { label: "Hijo(a)", value: "HIJO(A)" },
                      { label: "Padre", value: "PADRE" },
                      { label: "Madre", value: "MADRE" },
                      { label: "Hermano(a)", value: "HERMANO(A)" },
                      { label: "Conviviente", value: "CONVIVIENTE" },
                      { label: "Amigo(a) / Amistad", value: "AMIGO(A)" },
                      { label: "Otro Parentesco / Familiar", value: "OTRO" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name={`emergency.emergency_contacts.${index}.phone`}
                    label="Teléfono Principal *"
                    placeholder="Ej. 987654321"
                  />
                  <FormInput
                    control={form.control}
                    name={`emergency.emergency_contacts.${index}.alt_phone`}
                    label="Teléfono Alternativo (Opcional)"
                    placeholder="Ej. 01 234 5678"
                  />
                </div>

                <FormInput
                  control={form.control}
                  name={`emergency.emergency_contacts.${index}.address`}
                  label="Dirección (Opcional)"
                  placeholder="Ej. Av. Primavera 123, Surco"
                />
              </FieldGroup>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
