"use client";

import React from "react";
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon, Upload01Icon, Delete02Icon, Add01Icon } from "@hugeicons/core-free-icons";
import { FormSelect } from "@/components/ui/form-controls";
import { uploadFileToCloudinaryAction } from "@/app/actions/upload";
import EmptyForm from "../empty-form";

interface Step9DocumentsProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step9Documents({ form }: Step9DocumentsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documents.documents",
  });

  const addDocument = () => {
    append({
      document_type: "Contrato Laboral",
      file_name: "",
      file_url: "",
    });
  };

  const handleDocumentUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          form.setValue(`documents.documents.${index}.file_name`, file.name);
          form.setValue(`documents.documents.${index}.file_url`, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 9: Carga de Documentos</CardTitle>
        <CardDescription>
          Adjunta contratos, certificados, antecedentes o documentos bancarios escaneados.
        </CardDescription>
        <CardAction>
          <Button type="button" variant="outline" size="sm" onClick={addDocument}>
            <HugeiconsIcon icon={Add01Icon} />
            Adjuntar documento
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <EmptyForm
            title="No has adjuntado ningún documento aún."
            description="Puedes continuar sin documentos o adjuntar archivos en formato PDF o imagen."
            buttonText="Adjuntar primer documento"
            icon={File01Icon}
            buttonAction={addDocument}
          />
        ) : (
          fields.map((item, index) => {
            const watchFileName = form.watch(`documents.documents.${index}.file_name`);
            const watchFileUrl = form.watch(`documents.documents.${index}.file_url`);

            return (
              <div key={item.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
                <div className="flex items-center justify-between border-b pb-2">
                  <Badge variant="outline">
                    Documento #{index + 1}
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
                    <FormSelect
                      control={form.control}
                      name={`documents.documents.${index}.document_type`}
                      label="Tipo de Documento *"
                      placeholder="Seleccionar tipo..."
                      options={[
                        { label: "DNI / CE Escaneado", value: "DNI/CE Escaneado" },
                        { label: "Contrato Laboral", value: "Contrato Laboral" },
                        { label: "Documentos Laborales (CV, Certificados)", value: "Documentos Laborales" },
                        { label: "Documentos Bancarios (CCI, Vía BCP)", value: "Documentos Bancarios" },
                        { label: "Antecedentes Policiales / Penales", value: "Antecedentes Policiales/Penales" },
                        { label: "Otros Documentos", value: "Otros Documentos" },
                      ]}
                    />

                    <Controller
                      name={`documents.documents.${index}.file_url`}
                      control={form.control}
                      render={({ fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`file-input-${index}`}>Archivo PDF o Imagen *</FieldLabel>
                          <div className="border border-input rounded-md p-2 flex items-center justify-between bg-muted/20">
                            <Input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              id={`file-input-${index}`}
                              onChange={(e) => handleDocumentUpload(e, index)}
                            />
                            <label
                              htmlFor={`file-input-${index}`}
                              className="cursor-pointer inline-flex items-center text-xs font-medium text-primary hover:underline space-x-1"
                            >
                              <HugeiconsIcon icon={Upload01Icon} className="w-4 h-4" />
                              <span>{watchFileName ? "Cambiar archivo" : "Seleccionar archivo PDF / Imagen"}</span>
                            </label>

                            {watchFileName && (
                              <span className="text-xs font-medium text-muted-foreground truncate max-w-[180px]">
                                {watchFileName}
                              </span>
                            )}
                          </div>

                          {watchFileUrl && (
                            <div className="mt-2 space-y-1">
                              {watchFileUrl.startsWith("data:image/") || watchFileUrl.match(/\.(jpeg|jpg|png|webp)/i) ? (
                                <img
                                  src={watchFileUrl}
                                  alt="Vista previa documento"
                                  className="max-h-24 rounded border object-contain bg-background p-1"
                                />
                              ) : (
                                <Badge variant="outline">
                                  ✓ Documento PDF Cargado ({watchFileName})
                                </Badge>
                              )}
                            </div>
                          )}
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
