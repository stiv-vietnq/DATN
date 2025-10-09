import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/button/Button";
import Input from "../../../components/common/input/Input";
import PasswordInput from "../../../components/common/passwordInput/PasswordInput";
import { validateFields } from "../../../utils/Validation";
import Loading from "../../../components/common/loading/Loading";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const rules = [
      {
        field: "firstName" as const,
        value: firstName,
        required: true,
        maxLength: 50,
        customError: "validation.firstNameInvalid",
      },
      {
        field: "lastName" as const,
        value: lastName,
        required: true,
        maxLength: 50,
        customError: "validation.lastNameInvalid",
      },
      {
        field: "email" as const,
        value: email,
        required: true,
        maxLength: 255,
        regex: /^\S+@\S+\.\S+$/,
        customError: "validation.emailInvalid",
      },
      {
        field: "userName" as const,
        value: userName,
        required: true,
        minLength: 6,
        maxLength: 255,
        regex: /^\S+$/,
        customError: "validation.userNameInvalid",
      },
      {
        field: "password" as const,
        value: password,
        required: true,
        maxLength: 255,
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        customError: "validation.passwordTooShort",
      },
      {
        field: "confirmPassword" as const,
        value: confirmPassword,
        required: true,
        maxLength: 255,
        matchField: password,
        customError: "validation.confirmPasswordMismatch",
      },
    ];

    const errors = validateFields(rules, t);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      navigate("/verify", {
        state: { from: location.pathname },
      });
    }
  };

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 200);
  };

  const handleForgotPassword = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/forgot-password", {
        state: { from: location.pathname },
      });
    }, 200);
  };

  if (loading) return <Loading />;

  return (
    <div className="page-content">
      <div className="register-container">
        <div className="register-logo">
        </div>
        <div className="register-form">
          <div className="register-title">{t("register")}</div>
          <div className="form-container">
            <div className="register-fullName">
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("enter_first_name")}
                style={{ width: "100%" }}
                error={errors.firstName}
              />
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("enter_last_name")}
                style={{ width: "100%" }}
                error={errors.lastName}
              />
            </div>

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("enter_email")}
              style={{ width: "100%" }}
              error={errors.email}
            />

            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t("enter_username")}
              style={{ width: "100%" }}
              error={errors.userName}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("enter_password")}
              width="100%"
              error={errors.password}
            />

            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("enter_confirm_password")}
              width="100%"
              error={errors.confirmPassword}
            />

            <Button width="100%" variant="login-often" onClick={handleSubmit}>
              {t("register")}
            </Button>

            <div className="social-register">
              <div className="register">
                <div>{t("renavigate_login")}</div>
                <div className="login-link" onClick={handleClick}>{t("login")}</div>
              </div>
              <div className="forgot-password-register">
                <div onClick={handleForgotPassword}>{t("forgot_password")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
