import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

export default function RootHomePage() {
  const tenants = [
    { slug: "legado", name: "Tenant Legado", desc: "Formulario de Registro de Trabajadores para Tenant Legado" },
    { slug: "nova", name: "Tenant Nova", desc: "Formulario de Registro de Trabajadores para Tenant Nova" },
    { slug: "hola", name: "Tenant Hola", desc: "Formulario de Registro de Trabajadores para Tenant Hola" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <div className="space-y-2">
          <Badge variant="outline" className="px-3 py-1 font-semibold text-xs">
            Sistema Multitenant RRHH - Gestión Vertical
          </Badge>
          <h1 className="text-3xl font-extrabold text-foreground">
            Formulario de Registro de Personal
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Selecciona la ruta de tenant correspondiente para ingresar directamente al formulario independiente de registro de trabajador.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {tenants.map((t) => (
            <Card key={t.slug} className="hover:border-primary/50 transition-all text-left flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="p-2.5 bg-primary/10 rounded-lg w-fit text-primary">
                  <HugeiconsIcon icon={Building01Icon} className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="w-fit text-[11px]">
                  /{t.slug}
                </Badge>
                <CardTitle className="text-lg font-bold">{t.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {t.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full font-semibold text-xs space-x-1" size="sm">
                  <Link href={`/${t.slug}`}>
                    <span>Ingresar a /{t.slug}</span>
                    <HugeiconsIcon icon={ArrowRight02Icon} className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
