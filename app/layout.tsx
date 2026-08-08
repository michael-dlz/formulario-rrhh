import type { Metadata } from "next";
import { Geist_Mono, Outfit, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const spaceGroteskHeading = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Formulario de Registro RRHH - GV",
    template: "%s | Formulario RRHH",
  },
  description: "Sistema completo de registro de información del trabajador, derechohabientes, cuentas bancarias, activos y documentos para Recursos Humanos.",
  keywords: ["RRHH", "Recursos Humanos", "Formulario Trabajadores", "Registro Empleados", "Multitenant"],
  authors: [{ name: "RRHH Platform" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable, spaceGroteskHeading.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
