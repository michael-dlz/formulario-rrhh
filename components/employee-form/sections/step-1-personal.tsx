"use client";

import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormInput, FormSelect } from "@/components/ui/form-controls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload01Icon, Image01Icon } from "@hugeicons/core-free-icons";

interface Step1PersonalProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step1Personal({ form }: Step1PersonalProps) {
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          fieldChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 1: Datos Personales</CardTitle>
        <CardDescription>
          Completa la información personal y de contacto del trabajador.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="personal.first_name"
              label="Nombres completos *"
              placeholder="Ej. Juan Carlos"
            />
            <FormInput
              control={form.control}
              name="personal.last_name"
              label="Apellidos completos *"
              placeholder="Ej. Pérez Quispe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              control={form.control}
              name="personal.document_type"
              label="Tipo de Documento *"
              placeholder="Seleccionar..."
              options={[
                { label: "DNI (Documento Nacional de Identidad)", value: "DNI" },
                { label: "CE (Carné de Extranjería)", value: "CE" },
                { label: "Pasaporte", value: "PASAPORTE" },
              ]}
            />
            <FormInput
              control={form.control}
              name="personal.document_number"
              label="Número de Documento *"
              placeholder="Ej. 73849201"
            />
            <FormInput
              control={form.control}
              name="personal.birth_date"
              label="Fecha de Nacimiento *"
              type="date"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="personal.address"
              label="Dirección de Residencia *"
              placeholder="Ej. Av. Los Olivos 456, Int. 302"
            />
            <FormInput
              control={form.control}
              name="personal.district"
              label="Distrito / Ciudad *"
              placeholder="Ej. Miraflores"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={form.control}
              name="personal.phone"
              label="Teléfono Celular *"
              placeholder="Ej. 987654321"
            />
            <FormInput
              control={form.control}
              name="personal.personal_email"
              label="Correo Personal *"
              type="email"
              placeholder="juan.perez@email.com"
            />
            <FormInput
              control={form.control}
              name="personal.corporate_email"
              label="Correo Corporativo (Opcional)"
              type="email"
              placeholder="jperez@empresa.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="personal.marital_status"
              label="Estado Civil *"
              placeholder="Seleccionar..."
              options={[
                { label: "Soltero(a)", value: "SOLTERO" },
                { label: "Casado(a)", value: "CASADO" },
                { label: "Conviviente", value: "CONVIVIENTE" },
                { label: "Divorciado(a)", value: "DIVORCIADO" },
                { label: "Viudo(a)", value: "VIUDO" },
              ]}
            />
            <FormInput
              control={form.control}
              name="personal.nationality"
              label="Nacionalidad *"
              placeholder="Ej. Peruana"
            />
          </div>

          {/* Carga de Fotografía y Copia de Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <Controller
              name="personal.photo_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="photo-upload">Fotografía del Trabajador</FieldLabel>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors relative">
                    {field.value ? (
                      <div className="relative w-28 h-28 mx-auto mb-2">
                        <img
                          src={field.value}
                          alt="Vista previa foto"
                          className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-md mx-auto"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-0 right-0 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                          onClick={() => field.onChange("")}
                          title="Eliminar foto"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <HugeiconsIcon icon={Image01Icon} className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    )}

                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      onChange={(e) => handleFileUpload(e, field.onChange)}
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer block text-sm text-primary font-medium">
                      {field.value ? "Cambiar foto cargada" : "Haz clic para subir foto del trabajador"}
                    </label>
                    <FieldDescription className="text-center">Formato JPG, PNG (Máx 5MB)</FieldDescription>
                    {field.value && <Badge variant="outline" className="mt-1">✓ Foto lista para envío</Badge>}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="personal.document_copy_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="doc-upload">Copia de DNI / CE</FieldLabel>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors relative">
                    {field.value ? (
                      field.value.startsWith("data:image/") || field.value.match(/\.(jpeg|jpg|png|webp)/i) ? (
                        <div className="relative max-w-xs mx-auto mb-2">
                          <img
                            src={field.value}
                            alt="Vista previa DNI"
                            className="max-h-28 rounded-lg object-contain border shadow-sm mx-auto"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                            onClick={() => field.onChange("")}
                            title="Eliminar archivo"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 p-2 bg-emerald-500/10 text-emerald-600 rounded-md mb-2 max-w-xs mx-auto">
                          <HugeiconsIcon icon={Upload01Icon} className="w-5 h-5" />
                          <span className="text-xs font-semibold">Documento PDF Carga Lista</span>
                        </div>
                      )
                    ) : (
                      <HugeiconsIcon icon={Upload01Icon} className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    )}

                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      id="doc-upload"
                      onChange={(e) => handleFileUpload(e, field.onChange)}
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer block text-sm text-primary font-medium">
                      {field.value ? "Cambiar archivo cargado" : "Haz clic para subir copia de DNI/CE"}
                    </label>
                    <FieldDescription className="text-center">Formato PDF o Imagen (Máx 5MB)</FieldDescription>
                    {field.value && <Badge variant="outline" className="mt-1">✓ Documento listo para envío</Badge>}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
