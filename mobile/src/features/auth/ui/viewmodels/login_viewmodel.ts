import { useState } from "react";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { AuthRepository } from "../../infrastructure/persistence/auth.repository";

const authRepository = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

export function useLoginViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const executeLogin = async (
    email: string,
    password: string,
    onSuccess: () => void,
  ) => {
    setIsLoading(true);
    setApiError(null);

    try {
      await loginUseCase.execute(email, password);
      setIsLoading(false);
      onSuccess();
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al iniciar sesión";
      setApiError(errorMessage);
    }
  };

  return {
    isLoading,
    apiError,
    executeLogin,
  };
}
