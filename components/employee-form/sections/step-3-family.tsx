"use client";

import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { FormInput, FormSelect, FormSwitch } from "@/components/ui/form-controls";
import EmptyForm from "../empty-form";

interface Step3FamilyProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step3Family({ form }: Step3FamilyProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "family.family_members",
  });

  const addFamilyMember = () => {
    append({
      full_name: "",
      relationship: "HIJO(A)",
      document_type: "DNI",
      document_number: "",
      birth_date: "",
      is_dependent: true,
      phone: "",
      observations: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 3: Datos de Familia</CardTitle>
        <CardDescription>
          Registra cónyuge, hijos o derechohabientes del trabajador.
        </CardDescription>
        <CardAction>
          <Button type="button" variant="outline" size="sm" onClick={addFamilyMember}>
            <HugeiconsIcon icon={Add01Icon} />
            Agregar familiar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <EmptyForm
            title="No has registrado ningún familiar aún."
            description="Si el trabajador no posee derechohabientes, puedes continuar al siguiente paso."
            buttonText="Agregar primer familiar"
            icon={UserGroupIcon}
            buttonAction={addFamilyMember}
          />
        ) : (
          fields.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
              <div className="flex items-center justify-between border-b pb-2">
                <Badge variant="outline">
                  Familiar #{index + 1}
                </Badge>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                  Eliminar
                </Button>
              </div>

              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name={`family.family_members.${index}.full_name`}
                    label="Nombres y Apellidos *"
                    placeholder="Ej. Maria De La Cruz"
                  />
                  <FormSelect
                    control={form.control}
                    name={`family.family_members.${index}.relationship`}
                    label="Parentesco *"
                    placeholder="Seleccionar parentesco..."
                    options={[
                      { label: "Esposo(a) / Cónyuge", value: "CÓNYUGE" },
                      { label: "Hijo(a)", value: "HIJO(A)" },
                      { label: "Padre", value: "PADRE" },
                      { label: "Madre", value: "MADRE" },
                      { label: "Hermano(a)", value: "HERMANO(A)" },
                      { label: "Conviviente", value: "CONVIVIENTE" },
                      { label: "Abuelo(a)", value: "ABUELO(A)" },
                      { label: "Tío(a)", value: "TÍO(A)" },
                      { label: "Otro Parentesco", value: "OTRO" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormSelect
                    control={form.control}
                    name={`family.family_members.${index}.document_type`}
                    label="Tipo Documento *"
                    placeholder="Seleccionar..."
                    options={[
                      { label: "DNI", value: "DNI" },
                      { label: "CE", value: "CE" },
                      { label: "Pasaporte", value: "PASAPORTE" },
                    ]}
                  />
                  <FormInput
                    control={form.control}
                    name={`family.family_members.${index}.document_number`}
                    label="Número Documento *"
                    placeholder="Ej. 72819203"
                  />
                  <FormInput
                    control={form.control}
                    name={`family.family_members.${index}.birth_date`}
                    label="Fecha de Nacimiento *"
                    type="date"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <FormInput
                    control={form.control}
                    name={`family.family_members.${index}.phone`}
                    label="Teléfono de Contacto (Opcional)"
                    placeholder="Ej. 912345678"
                  />
                  <FormSwitch
                    control={form.control}
                    name={`family.family_members.${index}.is_dependent`}
                    label="¿Es dependiente económico?"
                    description="Depende directamente del sueldo del trabajador"
                  />
                </div>
              </FieldGroup>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
