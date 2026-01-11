import { Outlet } from "react-router-dom";
import { Warehouse } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4 shadow-lg">
            <Warehouse className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Controle de Estoque
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seu inventário com facilidade
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
