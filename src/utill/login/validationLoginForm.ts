import { validateId } from "./validationId";
import { validatePassword } from "./validationPassword";

// 로그인 유효성 검사
export const validateLoginForm = (values: { id: string; password: string }) => {
  const errors: { id?: string; password?: string } = {};

  const idError = validateId(values.id);
  if (idError) errors.id = idError;

  const pwError = validatePassword(values.password);
  if (pwError) errors.password = pwError;

  return errors;
};
