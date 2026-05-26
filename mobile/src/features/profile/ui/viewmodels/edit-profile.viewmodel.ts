import { useState } from 'react';
import { Alert } from 'react-native';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case';
import { ProfileRepository } from '../../infrastructure/persistence/profile.repository';

const profileRepository = new ProfileRepository();
const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);

type EditProfileErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function useEditProfileViewModel(
  userId: string,
  initialName: string,
  initialEmail: string,
  initialFotoUrl: string | null,
  onSuccess: () => void,
) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(initialFotoUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (
    fn: string, em: string, pw: string, cpw: string,
  ): EditProfileErrors => {
    const newErrors: EditProfileErrors = {};
    const cleanName = fn.trim();
    const cleanEmail = em.trim();

    if (!cleanName) newErrors.fullName = 'El nombre completo es obligatorio';
    else if (cleanName.length < 3) newErrors.fullName = 'Mínimo 3 caracteres';

    if (!cleanEmail) newErrors.email = 'El correo electrónico es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      newErrors.email = 'Ingresa un correo electrónico válido';

    if (pw.length > 0 && pw.length < 6)
      newErrors.password = 'La contraseña debe tener mínimo 6 caracteres';

    if (pw.length > 0 && !cpw)
      newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (pw.length > 0 && pw !== cpw)
      newErrors.confirmPassword = 'Las contraseñas no coinciden';

    return newErrors;
  };

  const handleFullNameChange = (value: string) => {
    const clean = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setFullName(clean);
    if (hasSubmitted) setErrors(validate(clean, email, password, confirmPassword));
  };

  const handleEmailChange = (value: string) => {
    const clean = value.replace(/\s/g, '').toLowerCase();
    setEmail(clean);
    if (hasSubmitted) setErrors(validate(fullName, clean, password, confirmPassword));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (hasSubmitted) setErrors(validate(fullName, email, value, confirmPassword));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (hasSubmitted) setErrors(validate(fullName, email, password, value));
  };

  const handleSave = async () => {
    setHasSubmitted(true);
    const validationErrors = validate(fullName, email, password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);
      setApiError(null);

      await updateProfileUseCase.execute(
        userId,
        {
          name: fullName.trim(),
          email: email.trim(),
          ...(password ? { password } : {}),
        },
        imageUri !== initialFotoUrl ? imageUri : null,
      );

      Alert.alert('Perfil actualizado', 'La información se guardó correctamente.');
      onSuccess();
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ?? error.message ?? 'Error al guardar el perfil',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,
    email,
    password,
    confirmPassword,
    imageUri,
    showPassword,
    showConfirmPassword,
    errors,
    isLoading,
    apiError,
    setImageUri,
    setShowPassword,
    setShowConfirmPassword,
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSave,
  };
}