import { useState } from 'react';
import { AuthRepository } from '../../infrastructure/persistence/auth.repository';
import { SendResetCodeUseCase } from '../../application/use-cases/send-reset-code.use-case';
 
const authRepository = new AuthRepository();
const sendResetCodeUseCase = new SendResetCodeUseCase(authRepository);
 
type ForgotPasswordErrors = { email?: string };
 
export function useForgotPasswordViewModel(
  onSuccess: (email: string) => void,
) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
 
  const validate = (currentEmail: string): ForgotPasswordErrors => {
    const newErrors: ForgotPasswordErrors = {};
    const clean = currentEmail.trim();
    if (!clean) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    return newErrors;
  };
 
  const handleEmailChange = (value: string) => {
    const clean = value.replace(/\s/g, '').toLowerCase();
    setEmail(clean);
    if (hasSubmitted) setErrors(validate(clean));
  };
 
  const handleSendCode = async () => {
    setHasSubmitted(true);
    const validationErrors = validate(email);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
 
    try {
      setIsLoading(true);
      setApiError(null);
      await sendResetCodeUseCase.execute(email.trim());
      onSuccess(email.trim());
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ?? error.message ?? 'Error al enviar el código',
      );
    } finally {
      setIsLoading(false);
    }
  };
 
  return { email, errors, isLoading, apiError, handleEmailChange, handleSendCode };
}