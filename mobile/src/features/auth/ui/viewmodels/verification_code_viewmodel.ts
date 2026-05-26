import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { AuthRepository } from '../../infrastructure/persistence/auth.repository';
import {
    VerifyResetCodeUseCase,
    SendResetCodeUseCase,
} from '../../application/use-cases/send-reset-code.use-case';

const authRepository = new AuthRepository();
const verifyResetCodeUseCase = new VerifyResetCodeUseCase(authRepository);
const resendUseCase = new SendResetCodeUseCase(authRepository);

export function useVerificationCodeViewModel(
    email: string,
    onSuccess: () => void,
) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [codeError, setCodeError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [resendSuccess, setResendSuccess] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleCodeChange = (value: string, index: number) => {
        const clean = value.replace(/[^0-9]/g, '').slice(0, 1);
        const newCode = [...code];
        newCode[index] = clean;
        setCode(newCode);
        if (codeError) setCodeError('');
        if (clean && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyCode = async () => {
        const finalCode = code.join('');
        if (finalCode.length < 6) {
            setCodeError('Ingresa el código de 6 dígitos');
            return;
        }
        try {
            setIsLoading(true);
            setApiError(null);
            await verifyResetCodeUseCase.execute(email, finalCode);
            onSuccess();
        } catch (error: any) {
            setApiError(
                error.response?.data?.message ?? error.message ?? 'Código incorrecto',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setIsLoading(true);
            setApiError(null);
            await resendUseCase.execute(email);
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 3000);
        } catch (error: any) {
            setApiError(error.response?.data?.message ?? 'Error al reenviar el código');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        code,
        codeError,
        isLoading,
        apiError,
        resendSuccess,
        inputRefs,
        handleCodeChange,
        handleKeyPress,
        handleVerifyCode,
        handleResendCode,
    };
}