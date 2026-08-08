"use client";

import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface FormInputProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<typeof Input>, "name"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  id,
  type = "text",
  placeholder,
  ...props
}: FormInputProps<TFieldValues>) {
  const inputId = id || name;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
          <Input
            {...field}
            {...props}
            id={inputId}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            value={field.value ?? ""}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
