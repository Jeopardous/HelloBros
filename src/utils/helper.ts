export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s']+$/;
  return nameRegex.test(name);
};
export const validatePassword = (value: string): boolean => {
  const passwordRegex =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-=_+{}|;':",.<>?/\\])(?!.*\s).{6,}$/;
  return passwordRegex.test(value);
};
