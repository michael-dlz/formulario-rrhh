"use client";

import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export interface FormTextareaProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<typeof Textarea>, "name"> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
}

export function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  id,
  placeholder,
  ...props
}: FormTextareaProps<TFieldValues>) {
  const textareaId = id || name;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={textareaId}>{label}</FieldLabel>}
          <Textarea
            {...field}
            {...props}
            id={textareaId}
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
