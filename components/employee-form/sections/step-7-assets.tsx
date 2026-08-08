"use client";

import React from "react";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { FormInput, FormSelect } from "@/components/ui/form-controls";

interface Step7AssetsProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step7Assets({ form }: Step7AssetsProps) {
  const watchHasAssets = form.watch("assets.has_assets");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assets.assets",
  });

  const addAssetItem = () => {
    append({
      asset_type: "Laptop",
      description: "",
      brand: "",
      model: "",
      serial_number: "",
      internal_code: "",
      status: "BUENO",
      delivery_date: new Date().toISOString().split("T")[0],
      observations: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 7: Equipos y Activos Asignados</CardTitle>
        <CardDescription>
          Registra los equipos tecnológicos, celulares o herramientas de trabajo asignadas al empleado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
            <Controller
              name="assets.has_assets"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-semibold text-base">¿Tiene equipos o activos asignados? *</FieldLabel>
                  <RadioGroup
                    onValueChange={(val) => {
                      const hasIt = val === "true";
                      field.onChange(hasIt);
                      if (hasIt && fields.length === 0) {
                        addAssetItem();
                      }
                    }}
                    value={field.value ? "true" : "false"}
                    className="flex flex-col sm:flex-row gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 bg-card w-full">
                      <RadioGroupItem value="true" id="asset-yes" />
                      <label htmlFor="asset-yes" className="cursor-pointer font-medium text-sm">
                        Sí, tiene activos a su cargo
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 bg-card w-full">
                      <RadioGroupItem value="false" id="asset-no" />
                      <label htmlFor="asset-no" className="cursor-pointer font-medium text-sm">
                        No tiene activos asignados
                      </label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {watchHasAssets && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Lista de Activos / Equipos ({fields.length})</span>
                <Button type="button" variant="outline" size="sm" onClick={addAssetItem}>
                  <HugeiconsIcon icon={Add01Icon} />
                  Agregar equipo
                </Button>
              </div>

              {fields.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <Badge variant="outline">
                      Equipo #{index + 1}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormSelect
                        control={form.control}
                        name={`assets.assets.${index}.asset_type`}
                        label="Tipo de Activo *"
                        placeholder="Seleccionar tipo..."
                        options={[
                          { label: "Laptop / Portátil", value: "Laptop" },
                          { label: "PC de Escritorio", value: "PC" },
                          { label: "Monitor / Pantalla", value: "Monitor" },
                          { label: "Celular / Teléfono", value: "Celular" },
                          { label: "Tablet", value: "Tablet" },
                          { label: "Equipo de Oficina", value: "Equipo de oficina" },
                          { label: "Otro Activo", value: "Otro" },
                        ]}
                      />

                      <div className="md:col-span-2">
                        <FormInput
                          control={form.control}
                          name={`assets.assets.${index}.description`}
                          label="Descripción del Activo *"
                          placeholder="Ej. Laptop Core i7 16GB RAM + Cargador"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormInput
                        control={form.control}
                        name={`assets.assets.${index}.brand`}
                        label="Marca"
                        placeholder="Ej. Lenovo"
                      />
                      <FormInput
                        control={form.control}
                        name={`assets.assets.${index}.model`}
                        label="Modelo"
                        placeholder="Ej. ThinkPad L14"
                      />
                      <FormInput
                        control={form.control}
                        name={`assets.assets.${index}.serial_number`}
                        label="Número de Serie"
                        placeholder="Ej. SN-98402910"
                      />
                      <FormInput
                        control={form.control}
                        name={`assets.assets.${index}.internal_code`}
                        label="Código Interno"
                        placeholder="Ej. ACT-2026-089"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <FormSelect
                        control={form.control}
                        name={`assets.assets.${index}.status`}
                        label="Estado del Activo *"
                        placeholder="Seleccionar estado..."
                        options={[
                          { label: "Nuevo (10/10)", value: "NUEVO" },
                          { label: "Bueno (En óptimas condiciones)", value: "BUENO" },
                          { label: "Regular (Uso normal)", value: "REGULAR" },
                          { label: "Malo (Requiere mantenimiento)", value: "MALO" },
                        ]}
                      />

                      <FormInput
                        control={form.control}
                        name={`assets.assets.${index}.delivery_date`}
                        label="Fecha de Entrega *"
                        type="date"
                      />
                    </div>
                  </FieldGroup>
                </div>
              ))}
            </div>
          )}
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
