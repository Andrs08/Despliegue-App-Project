import { useState } from "react";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { AuthRepository } from "../../infrastructure/persistence/auth.repository";

const authRepository = new AuthRepository();
const registerUseCase = new RegisterUseCase(authRepository);
const loginUseCase = new LoginUseCase(authRepository);

type RegisterErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function useRegisterViewModel(onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (
    currentFullName: string,
    currentEmail: string,
    currentPassword: string,
    currentConfirmPassword: string,
  ): RegisterErrors => {
    const newErrors: RegisterErrors = {};

    const cleanFullName = currentFullName.trim();
    const cleanEmail = currentEmail.trim();

    if (!cleanFullName) {
      newErrors.fullName = "El nombre completo es obligatorio";
    }

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
    } else if (currentPassword.length < 6) {
      newErrors.password = "La contraseña debe tener mínimo 6 caracteres";
    }

    if (!currentConfirmPassword.trim()) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (currentConfirmPassword !== currentPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    return newErrors;
  };

  const handleFullNameChange = (value: string) => {
    const cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setFullName(cleanValue);

    if (hasSubmitted) {
      setErrors(validateForm(cleanValue, email, password, confirmPassword));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (hasSubmitted) {
      const cleanValue = value.replace(/\s/g, "").toLowerCase();
      setErrors(validateForm(fullName, cleanValue, password, confirmPassword));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(fullName, email, value, confirmPassword));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (hasSubmitted) {
      setErrors(validateForm(fullName, email, password, value));
    }
  };

  const handleRegister = async () => {
    setHasSubmitted(true);

    const validationErrors = validateForm(
      fullName,
      email,
      password,
      confirmPassword,
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      await registerUseCase.execute(fullName, email, password);
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
    fullName,
    email,
    password,
    confirmPassword,
    errors,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleRegister,
  };
}
