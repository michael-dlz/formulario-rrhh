"use client";

import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeFormSchema,
  EmployeeFormValues,
} from "@/lib/validations/employee-form.schema";
import { submitEmployeeRegistrationAction } from "@/app/actions/employee";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "./step-indicator";
import { ConfirmationDialog } from "./confirmation-dialog";
import { Step1Personal } from "./sections/step-1-personal";
import { Step2Employment } from "./sections/step-2-employment";
import { Step3Family } from "./sections/step-3-family";
import { Step4Emergency } from "./sections/step-4-emergency";
import { Step5Bank } from "./sections/step-5-bank";
import { Step6Cts } from "./sections/step-6-cts";
import { Step7Assets } from "./sections/step-7-assets";
import { Step8Uniforms } from "./sections/step-8-uniforms";
import { Step9Documents } from "./sections/step-9-documents";
import { Step10Summary } from "./sections/step-10-summary";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Tick02Icon,
  AlertCircleIcon,
  Building01Icon,
} from "@hugeicons/core-free-icons";

interface TenantData {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  primary_color?: string | null;
}

interface EmployeeFormContainerProps {
  tenant: TenantData;
}

/**
 * MODO DEBUG:
 * - true: Permite libre navegación entre cualquier sección y omite la validación obligatoria por paso.
 * - false: Modo producción con validación estricta requerida por paso.
 */
const DEBUG_MODE = false;

export function EmployeeFormContainer({ tenant }: EmployeeFormContainerProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ open: boolean; employeeId?: string }>({
    open: false,
  });

  const DRAFT_KEY = `employee_form_draft_${tenant.slug}`;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema) as any,
    mode: "onTouched",
    defaultValues: {
      tenant_slug: tenant.slug,
      personal: {
        first_name: "",
        last_name: "",
        document_type: "DNI",
        document_number: "",
        birth_date: "",
        address: "",
        district: "",
        phone: "",
        personal_email: "",
        corporate_email: "",
        marital_status: "SOLTERO",
        nationality: "Peruana",
        photo_url: "",
        document_copy_url: "",
      },
      employment: {
        position: "CONSERJE",
        area: "Operaciones",
        work_location: "Sede Principal",
        hire_date: new Date().toISOString().split("T")[0],
        contract_type: "INDETERMINADO",
        status: "ACTIVO",
        end_date: "",
        salary: 1300.0,
        pension_system: "AFP",
        afp_name: "Integra",
        afp_code: "",
        has_family_allowance: false,
        observations: "",
      },
      family: {
        family_members: [],
      },
      emergency: {
        emergency_contacts: [
          {
            full_name: "",
            relationship: "",
            phone: "",
            alt_phone: "",
            address: "",
            observations: "",
          },
        ],
      },
      bank: {
        bank: "BCP",
        account_type: "Cuenta Sueldo",
        account_number: "",
        cci: "",
        currency: "PEN",
        account_holder: "",
      },
      cts: {
        has_cts_account: false,
        bank: "BCP",
        account_number: "",
        cci: "",
        currency: "PEN",
      },
      assets: {
        has_assets: false,
        assets: [],
      },
      uniforms: {
        uniforms: [
          {
            uniform_type: "CASACA",
            custom_type: "",
            size: "L",
            is_delivered: true,
            delivery_date: new Date().toISOString().split("T")[0],
            quantity: 1,
            position: "CONSERJE",
            observations: "",
          },
          {
            uniform_type: "PANTALON",
            custom_type: "",
            size: "32",
            is_delivered: true,
            delivery_date: new Date().toISOString().split("T")[0],
            quantity: 1,
            position: "CONSERJE",
            observations: "",
          },
          {
            uniform_type: "POLO",
            custom_type: "",
            size: "M",
            is_delivered: true,
            delivery_date: new Date().toISOString().split("T")[0],
            quantity: 2,
            position: "CONSERJE",
            observations: "",
          },
        ],
      },
      documents: {
        documents: [],
      },
    },
  });

  // Actualizar el parámetro ?step=N en la URL
  const updateStepInUrl = (step: number) => {
    if (step >= 1 && step <= 10) {
      setCurrentStep(step);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("step", step.toString());
        window.history.replaceState(null, "", url.toString());
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Leer paso de la URL al cargar
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step");
      if (stepParam) {
        const parsed = parseInt(stepParam, 10);
        if (parsed >= 1 && parsed <= 10) {
          setCurrentStep(parsed);
        }
      }
    }
  }, []);

  // Cargar borrador guardado en localStorage al montar
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          form.reset(parsed);
        }
      } catch (err) {
        console.error("Error al restaurar borrador del formulario:", err);
      }
    }
  }, [DRAFT_KEY, form]);

  // Auto-guardar borrador en localStorage en cada cambio
  React.useEffect(() => {
    const subscription = form.watch((values) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
        } catch (err) {
          console.error("Error al auto-guardar borrador:", err);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, DRAFT_KEY]);

  const clearDraft = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (err) {
        console.error("Error al limpiar borrador:", err);
      }
    }
  };

  // Validar sección antes de avanzar de paso
  const validateCurrentStep = async (): Promise<boolean> => {
    if (DEBUG_MODE) return true;

    setSubmitError(null);
    let fieldKeys: (keyof EmployeeFormValues | string)[] = [];

    switch (currentStep) {
      case 1:
        fieldKeys = [
          "personal.first_name",
          "personal.last_name",
          "personal.document_type",
          "personal.document_number",
          "personal.birth_date",
          "personal.address",
          "personal.district",
          "personal.phone",
          "personal.personal_email",
          "personal.marital_status",
          "personal.nationality",
        ];
        break;
      case 2:
        fieldKeys = [
          "employment.position",
          "employment.area",
          "employment.work_location",
          "employment.hire_date",
          "employment.contract_type",
          "employment.status",
          "employment.salary",
          "employment.pension_system",
        ];
        if (form.getValues("employment.status") === "CESADO") {
          fieldKeys.push("employment.end_date");
        }
        if (form.getValues("employment.pension_system") === "AFP") {
          fieldKeys.push("employment.afp_name", "employment.afp_code");
        }
        break;
      case 3:
        fieldKeys = ["family.family_members"];
        break;
      case 4:
        fieldKeys = ["emergency.emergency_contacts"];
        break;
      case 5:
        fieldKeys = [
          "bank.bank",
          "bank.account_type",
          "bank.account_number",
          "bank.cci",
          "bank.currency",
          "bank.account_holder",
        ];
        break;
      case 6:
        if (form.getValues("cts.has_cts_account")) {
          fieldKeys = ["cts.bank", "cts.account_number"];
        }
        break;
      case 7:
        if (form.getValues("assets.has_assets")) {
          fieldKeys = ["assets.assets"];
        }
        break;
      case 8:
        fieldKeys = ["uniforms.uniforms"];
        break;
      case 9:
        fieldKeys = ["documents.documents"];
        break;
      default:
        break;
    }

    if (fieldKeys.length > 0) {
      const isValid = await form.trigger(fieldKeys as any);
      if (!isValid) {
        setSubmitError("Por favor completa los campos obligatorios del paso actual antes de continuar.");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < 10) {
      updateStepInUrl(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setSubmitError(null);
    if (currentStep > 1) {
      updateStepInUrl(currentStep - 1);
    }
  };

  const handleGoToStep = (step: number) => {
    if (step >= 1 && step <= 10) {
      setSubmitError(null);
      updateStepInUrl(step);
    }
  };

  const onSubmit = async (values: EmployeeFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await submitEmployeeRegistrationAction(values);

      if (result.success) {
        clearDraft();
        setSuccessData({ open: true, employeeId: result.employee_id });
      } else {
        setSubmitError(result.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al registrar el empleado.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    clearDraft();
    form.reset();
    updateStepInUrl(1);
    setSuccessData({ open: false });
  };

  const formProps = form as unknown as UseFormReturn<EmployeeFormValues>;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Tenant Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {tenant.name}
            </CardTitle>
            <CardDescription>
              {tenant.description || "Formulario de Registro de Información del Trabajador"}
            </CardDescription>
            <CardAction>
              <ThemeToggle />
            </CardAction>
          </CardHeader>
          <CardContent>
            <StepIndicator
              currentStep={currentStep}
              totalSteps={10}
              onStepClick={handleGoToStep}
              isDebug={DEBUG_MODE}
            />
          </CardContent>
        </Card>

        {/* Global Error Alert */}
        {submitError && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} />
            <AlertTitle>Atención</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Master Form */}
        <Form {...(formProps as any)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6"
          >
            {currentStep === 1 && <Step1Personal form={formProps} />}
            {currentStep === 2 && <Step2Employment form={formProps} />}
            {currentStep === 3 && <Step3Family form={formProps} />}
            {currentStep === 4 && <Step4Emergency form={formProps} />}
            {currentStep === 5 && <Step5Bank form={formProps} />}
            {currentStep === 6 && <Step6Cts form={formProps} />}
            {currentStep === 7 && <Step7Assets form={formProps} />}
            {currentStep === 8 && <Step8Uniforms form={formProps} />}
            {currentStep === 9 && <Step9Documents form={formProps} />}
            {currentStep === 10 && (
              <Step10Summary form={formProps} onGoToStep={handleGoToStep} />
            )}

            {/* Navigation Buttons Footer */}
            <div className="py-4 border-t fixed bottom-0 left-0 w-full bg-background z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto px-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || isSubmitting}
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} />
                  Anterior
                </Button>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  {currentStep < 10 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                    >
                      Continuar
                      <HugeiconsIcon icon={ArrowRight02Icon} />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        form.handleSubmit(onSubmit as any)();
                      }}
                      disabled={isSubmitting}
                    >
                      <HugeiconsIcon icon={Tick02Icon} />
                      {isSubmitting ? "Guardando..." : "Guardar y Finalizar"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Dialog de confirmación final */}
      <ConfirmationDialog
        open={successData.open}
        onClose={handleResetForm}
        employeeId={successData.employeeId}
        tenantName={tenant.name}
      />
    </div>
  );
}
