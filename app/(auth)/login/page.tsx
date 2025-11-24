// app/(auth)/iniciar-sesion/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validations/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contex";

export default function LoginPage() {
  const { login, isLoading, error: authError } = useAuth();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof loginSchema>) => {
    try {
      await login({ 
        email: formData.email, 
        password: formData.password 
      });
      // No necesitas redirigir manualmente
      // El middleware redirige automáticamente a /dashboard
    } catch (error) {
      // El error ya se maneja en el AuthContext
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-50">
      {/* Fondo de la imagen */}
      <div
        className="absolute inset-0 z-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/assets/UCAB-Guayana.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.8) blur(0px)",
        }}
      />
      {/* Contenido */}
      <div className="relative z-20 flex items-center justify-center w-full min-h-screen">
        <Card className="md:w-96 w-2/3 shadow-xl">
          <CardHeader>
            <div className="flex flex-1 justify-center items-center gap-2 pb-1">
              <img src="/assets/gema-icono2.png" width="64" />
              <h1 className="text-3xl font-bold mr-4 text-neutral-700">GEMA</h1>
            </div>
            <hr className="pb-2"></hr>
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                className="space-y-4"
                onSubmit={loginForm.handleSubmit(onSubmit)}
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo institucional</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese su correo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Ingrese su contraseña"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {authError && (
                  <p className="text-red-600 text-sm mt-2">
                    Credenciales incorrectas. Por favor, intente de nuevo.
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gema-green hover:bg-green-600 text-black font-semibold mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}