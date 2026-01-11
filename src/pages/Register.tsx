import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const Register = () => {
  return (
    <Card className="border-border/50 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="h-11"
          />
        </div>
        <Button className="w-full h-11 gap-2" size="lg">
          <UserPlus className="h-4 w-4" />
          Cadastrar
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entre aqui
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Register;
