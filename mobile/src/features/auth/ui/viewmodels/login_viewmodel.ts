import { useState } from "react";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { AuthRepository } from "../../infrastructure/persistence/auth.repository";

const authRepository = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

type LoginErrors = {
  email?: string;
  password?: string;
};

export function useLoginViewModel(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validateForm = (
    currentEmail: string,
    currentPassword: string,
  ): LoginErrors => {
    const newErrors: LoginErrors = {};
    const cleanEmail = currentEmail.trim();

    if (!cleanEmail) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        newErrors.email = "Ingresa un correo electrónico válido";
      }
    }

    if (!currentPassword.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    }

    return newErrors;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (hasSubmitted) {
      const cleanValue = value.replace(/\s/g, "").toLowerCase();
      setErrors(validateForm(cleanValue, password));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(email, value));
    }
  };

  const handleLogin = async () => {
    setHasSubmitted(true);

    const validationErrors = validateForm(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      await loginUseCase.execute(email, password);
      onSuccess();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error al registrarse";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    apiError,
    email,
    password,
    showPassword,
    errors,
    setShowPassword,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
  };
}
