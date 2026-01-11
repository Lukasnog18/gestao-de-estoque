import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

const Login = () => {
  return (
    <Card className="border-border/50 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Entrar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <Button className="w-full h-11 gap-2" size="lg">
          <LogIn className="h-4 w-4" />
          Entrar
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
