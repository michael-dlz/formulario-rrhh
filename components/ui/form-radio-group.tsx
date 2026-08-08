"use client";

import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface RadioOption {
  label: string;
  value: string;
  colorClass?: string;
}

export interface FormRadioGroupProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  options: RadioOption[];
  disabled?: boolean;
}

export function FormRadioGroup<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  disabled,
}: FormRadioGroupProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel className="font-semibold text-base">{label}</FieldLabel>}
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
            disabled={disabled}
            className="flex space-x-6 pt-2"
          >
            {options.map((opt) => {
              const itemId = `${name}-${opt.value}`;
              return (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} id={itemId} />
                  <label htmlFor={itemId} className={`cursor-pointer font-medium ${opt.colorClass || ""}`}>
                    {opt.label}
                  </label>
                </div>
              );
            })}
          </RadioGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
