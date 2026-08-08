"use client";

import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/validations/employee-form.schema";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { TShirtIcon, Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { FormInput, FormSelect, FormSwitch } from "@/components/ui/form-controls";
import EmptyForm from "../empty-form";

interface Step8UniformsProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function Step8Uniforms({ form }: Step8UniformsProps) {
  const currentPosition = form.watch("employment.position") || "CONSERJE";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "uniforms.uniforms",
  });

  const addGarment = () => {
    append({
      uniform_type: "POLO",
      custom_type: "",
      size: "M",
      is_delivered: true,
      delivery_date: new Date().toISOString().split("T")[0],
      quantity: 1,
      position: currentPosition,
      observations: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 8: Uniformes y Prendas Entregadas</CardTitle>
        <CardDescription>
          Registra cada prenda entregada con su respectiva talla independiente (Ej. Casaca L, Pantalón 32, Polo M).
        </CardDescription>
        <CardAction>
          <Button type="button" variant="outline" size="sm" onClick={addGarment}>
            <HugeiconsIcon icon={Add01Icon} />
            Agregar prenda
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {fields.length === 0 ? (
          <EmptyForm
            title="No has añadido prendas o uniformes aún."
            description="Las tallas se configuran de forma independiente por cada prenda agregada."
            buttonText="Agregar primera prenda"
            icon={TShirtIcon}
            buttonAction={addGarment}
          />
        ) : (
          fields.map((item, index) => {
            const watchType = form.watch(`uniforms.uniforms.${index}.uniform_type`);
            const watchIsDelivered = form.watch(`uniforms.uniforms.${index}.is_delivered`);

            return (
              <div key={item.id} className="p-4 border rounded-lg bg-card space-y-4 relative">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      Prenda #{index + 1}
                    </Badge>
                    {watchIsDelivered ? (
                      <Badge variant="default">
                        Entregado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Pendiente de entrega
                      </Badge>
                    )}
                  </div>
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
                      name={`uniforms.uniforms.${index}.uniform_type`}
                      label="Tipo de Prenda *"
                      placeholder="Seleccionar prenda..."
                      options={[
                        { label: "Casaca", value: "CASACA" },
                        { label: "Pullover / Chaleco", value: "PULLOVER" },
                        { label: "Pantalón", value: "PANTALON" },
                        { label: "Polo Corporativo", value: "POLO" },
                        { label: "Otra Prenda", value: "OTRO" },
                      ]}
                    />

                    {watchType === "OTRO" && (
                      <FormInput
                        control={form.control}
                        name={`uniforms.uniforms.${index}.custom_type`}
                        label="Nombre de la Prenda *"
                        placeholder="Ej. Mandil, Gorra, Zapatos de seguridad"
                      />
                    )}

                    <FormInput
                      control={form.control}
                      name={`uniforms.uniforms.${index}.size`}
                      label="Talla Específica *"
                      placeholder="Ej. L, M, S, 32, 34, 38..."
                      description="La talla se asigna únicamente a esta prenda."
                    />

                    <FormInput
                      control={form.control}
                      name={`uniforms.uniforms.${index}.quantity`}
                      label="Cantidad *"
                      type="number"
                      min={1}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <FormSwitch
                      control={form.control}
                      name={`uniforms.uniforms.${index}.is_delivered`}
                      label="¿Fue entregada?"
                      description="Marcar si ya fue dada al trabajador"
                    />

                    {watchIsDelivered && (
                      <FormInput
                        control={form.control}
                        name={`uniforms.uniforms.${index}.delivery_date`}
                        label="Fecha de Entrega"
                        type="date"
                      />
                    )}

                    <FormSelect
                      control={form.control}
                      name={`uniforms.uniforms.${index}.position`}
                      label="Puesto Asociado"
                      placeholder="Puesto..."
                      options={[
                        { label: "Conserje", value: "CONSERJE" },
                        { label: "Conserje de Limpieza", value: "CONSERJE_DE_LIMPIEZA" },
                        { label: "Otro Puesto", value: "OTRO" },
                      ]}
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
