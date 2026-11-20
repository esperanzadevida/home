import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Shield } from "lucide-react";

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
            <label className="text-xs font-semibold text-foreground">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="email"
                placeholder="pastor@iglesia.org"
                className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Contraseña
              </label>
              <Link
                href="/recuperar"
                className="text-xs text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="password"
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
