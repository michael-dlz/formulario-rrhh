"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, RefreshIcon } from "@hugeicons/core-free-icons";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
  tenantName?: string;
}

export function ConfirmationDialog({ open, onClose, employeeId, tenantName }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center space-y-4">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
            <HugeiconsIcon icon={Tick02Icon} className="w-10 h-10" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
            ¡Registro Exitoso!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground max-w-xs mx-auto">
            La información del trabajador ha sido guardada y asociada correctamente al tenant <strong className="text-foreground">{tenantName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Código de Registro:</span>
              <Badge variant="outline" className="font-mono text-xs">{employeeId?.slice(-8).toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estado del Registro:</span>
              <span className="font-semibold text-emerald-600">Completo</span>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose}>
            <HugeiconsIcon icon={RefreshIcon}/>
            <span>Registrar otro trabajador</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
