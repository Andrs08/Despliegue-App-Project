import { useState } from 'react';
import { AuthRepository } from '../../infrastructure/persistence/auth.repository';
import { ResetPasswordUseCase } from '../../application/use-cases/send-reset-code.use-case';

const authRepository = new AuthRepository();
const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);

type ResetPasswordErrors = { password?: string; confirmPassword?: string };

export function useResetPasswordViewModel(
    email: string,
    code: string,
    onSuccess: () => void,
) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<ResetPasswordErrors>({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const validate = (pw: string, cpw: string): ResetPasswordErrors => {
        const newErrors: ResetPasswordErrors = {};
        if (!pw) newErrors.password = 'La nueva contraseña es obligatoria';
        else if (pw.length < 6) newErrors.password = 'Mínimo 6 caracteres';
        if (!cpw) newErrors.confirmPassword = 'Debes confirmar la contraseña';
        else if (pw !== cpw) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        return newErrors;
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (hasSubmitted) setErrors(validate(value, confirmPassword));
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (hasSubmitted) setErrors(validate(password, value));
    };

    const handleResetPassword = async () => {
        setHasSubmitted(true);
        const validationErrors = validate(password, confirmPassword);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            setIsLoading(true);
            setApiError(null);
            await resetPasswordUseCase.execute(email, code, password);
            onSuccess();
        } catch (error: any) {
            setApiError(
                error.response?.data?.message ?? error.message ?? 'Error al actualizar la contraseña',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        errors,
        isLoading,
        apiError,
        setShowPassword,
        setShowConfirmPassword,
        handlePasswordChange,
        handleConfirmPasswordChange,
        handleResetPassword,
    };
}