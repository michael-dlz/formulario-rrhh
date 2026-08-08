"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Briefcase01Icon,
  UserGroupIcon,
  CallingIcon,
  BankIcon,
  AccountSetting01Icon,
  ComputerIcon,
  TShirtIcon,
  File01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  isDebug?: boolean;
}

export const STEP_TITLES: { [key: number]: { title: string; icon: any } } = {
  1: { title: "Datos Personales", icon: UserIcon },
  2: { title: "Información Laboral", icon: Briefcase01Icon },
  3: { title: "Datos de Familia", icon: UserGroupIcon },
  4: { title: "Contacto de Emergencia", icon: CallingIcon },
  5: { title: "Abono de Sueldo", icon: BankIcon },
  6: { title: "Cuenta CTS", icon: AccountSetting01Icon },
  7: { title: "Equipos y Activos", icon: ComputerIcon },
  8: { title: "Uniformes y Prendas", icon: TShirtIcon },
  9: { title: "Documentos", icon: File01Icon },
  10: { title: "Resumen y Envío", icon: Tick02Icon },
};

export function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
  isDebug = false,
}: StepIndicatorProps) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);
  const currentStepData = STEP_TITLES[currentStep] || { title: "", icon: UserIcon };
  const iconData = currentStepData.icon;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Paso {currentStep} de {totalSteps}
          </Badge>
          {isDebug && (
            <Badge variant="destructive">
              Modo Debug (Navegación Libre)
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-medium">{progressPercent}% completado</span>
      </div>

      <Progress value={progressPercent} className="h-2" />
    </div>
  );
}
