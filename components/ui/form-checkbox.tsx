"use client";

import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

export interface FormCheckboxProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: FormCheckboxProps<TFieldValues>) {
  const checkboxId = name;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={checkboxId}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            {label && (
              <label htmlFor={checkboxId} className="text-sm font-medium leading-none cursor-pointer">
                {label}
              </label>
            )}
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </div>
      )}
    />
  );
}
