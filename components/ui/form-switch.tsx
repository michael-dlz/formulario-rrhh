"use client";

import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { FieldLabel, FieldDescription } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export interface FormSwitchProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function FormSwitch<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: FormSwitchProps<TFieldValues>) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
      {(label || description) && (
        <div className="space-y-0.5">
          {label && <FieldLabel className="text-base font-semibold">{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
        </div>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
