import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso administrativo",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-background">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Panel Administrativo
          </h1>
          <p className="text-xs text-muted-foreground">
            Ingresa tus credenciales autorizadas de Asambleas de Dios
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-foreground">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail aria-hidden="true" className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="pastor@iglesia.org"
                className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold text-foreground">
                Contraseña
              </label>
              <Link href="/contacto" className="text-xs text-primary hover:underline">
                ¿Necesitas ayuda para acceder?
              </Link>
            </div>
            <div className="relative">
              <Lock aria-hidden="true" className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
          </div>

          <Button type="button" className="w-full font-semibold">
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}
