type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "username"
  | "password"
  | "confirmPassword";

const fieldKeys: Record<
  FieldKey,
  Partial<{
    required: string;
    tooLong: string;
    tooShort: string;
    invalid: string;
    mismatch: string;
  }>
> = {
  firstName: {
    required: "validation.firstNameRequired",
    tooLong: "validation.firstNameTooLong",
  },
  lastName: {
    required: "validation.lastNameRequired",
    tooLong: "validation.lastNameTooLong",
  },
  email: {
    required: "validation.emailRequired",
    invalid: "validation.emailInvalid",
    tooLong: "validation.emailTooLong",
  },
  username: {
    required: "validation.userNameRequired",
    invalid: "validation.userNameInvalid",
    tooLong: "validation.userNameTooLong",
    tooShort: "validation.userNameTooShort",
  },
  password: {
    required: "validation.passwordRequired",
    invalid: "validation.passwordInvalid",
    tooShort: "validation.passwordTooShort",
    tooLong: "validation.passwordTooLong",
  },
  confirmPassword: {
    required: "validation.confirmPasswordRequired",
    mismatch: "validation.confirmPasswordMismatch",
    tooLong: "validation.confirmPasswordTooLong",
  },
};

interface ValidationRule {
  field: FieldKey;
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  customError?: string;
  matchField?: string;
  noSpaces?: boolean;
}

type Errors = Partial<Record<FieldKey, string>>;

export const validateFields = (
  rules: ValidationRule[],
  t: (key: string, options?: Record<string, unknown>) => string
): Errors => {
  const errors: Errors = {};

  rules.forEach((rule) => {
    const {
      field,
      value = "",
      required,
      minLength,
      maxLength,
      regex,
      customError,
      matchField,
      noSpaces,
    } = rule;

    if (required && !value.trim()) {
      errors[field] = t(fieldKeys[field]?.required || "validation.required");
      return;
    }

    if (value && value.trim().length === 0) {
      errors[field] = t(fieldKeys[field]?.invalid || "validation.invalid");
      return;
    }

    if (noSpaces && /\s/.test(value)) {
      errors[field] =
        customError || t(fieldKeys[field]?.invalid || "validation.noSpaces");
      return;
    }

    if (maxLength && value.length > maxLength) {
      errors[field] = t(fieldKeys[field]?.tooLong || "validation.maxLength", {
        max: maxLength,
      });
      return;
    }

    if (minLength && value.length < minLength) {
      errors[field] = t(fieldKeys[field]?.tooShort || "validation.tooShort", {
        min: minLength,
      });
      return;
    }

    if (field === "password" && value) {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
        errors[field] =
          t(fieldKeys[field]?.invalid || "validation.passwordInvalid");
        return;
      }
    }

    if (regex && value && !regex.test(value)) {
      errors[field] =
        (customError && t(customError)) ||
        t(fieldKeys[field]?.invalid || "validation.invalid");
      return;
    }

    if (matchField && value !== matchField) {
      errors[field] =
        (customError && t(customError)) ||
        t(fieldKeys[field]?.mismatch || "validation.mismatch");
      return;
    }
  });

  return errors;
};
