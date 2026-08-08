"use client";

import React, { useState } from "react";
import { loginAdminAction } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAdminAction(formData);
      if (res && !res.success) {
        setError(res.error || "Error al iniciar sesión.");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setError("Ocurrió un error al intentar iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Acceso Administrativo
        </CardTitle>
        <CardDescription>
          Ingresa tus credenciales seguras para acceder al panel de gestión de RRHH.
        </CardDescription>
        <CardAction>
          <ThemeToggle />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} />
            <AlertTitle>Error de autenticación</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Usuario o Correo *</FieldLabel>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="4dm1n"
                required
                defaultValue="4dm1n"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Contraseña *</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="gv_4dm1n"
                required
                defaultValue="gv_4dm1n"
              />
            </Field>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verificando credenciales..." : "Iniciar Sesión Segura"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
