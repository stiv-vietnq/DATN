import { useState } from "react";
import { useTranslation } from "react-i18next";
import PasswordInput from "../../../components/common/passwordInput/PasswordInput";
import { validateFields } from "../../../utils/Validation";
import "./ChangePassword.css";
import { changePassword } from "../../../api/user";
import Loading from "../../../components/common/loading/Loading";

interface FormErrors extends Partial<Record<string, string>> {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [errors, setErrors] = useState<FormErrors>({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const rules = [
      {
        field: "password" as const,
        value: oldPassword,
        required: true,
        maxLength: 255,
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        customError: "validation.passwordTooShort",
      },
      {
        field: "password" as const,
        value: newPassword,
        required: true,
        maxLength: 255,
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        customError: "validation.passwordTooShort",
      },
      {
        field: "password" as const,
        value: confirmNewPassword,
        required: true,
        maxLength: 255,
        matchField: newPassword,
        customError: "validation.confirmPasswordMismatch",
      },
    ];

    const errors = validateFields(rules, t);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      changePassword({
        usernameOrEmail: localStorage.getItem("username") || "",
        oldPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      })
        .then(() => {
          alert(t("change_password_success"));
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        })
        .finally(() => setLoading(false));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="main-container" style={{ padding: "25px" }}>
      <div className="profile-header">
        <div className="profile-title">{t("change_password")}</div>
        <div className="profile-note">{t("placeholder_change_password")}</div>
      </div>
      <div className="change-password-content">
        <div
          className="change-password-information"
          style={{ marginBottom: "25px" }}
        >
          <div className="change-password-row-title">{t("old_password")}:</div>
          <div className="change-password-row-content">
            <PasswordInput
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t("enter_old_password")}
              width="100%"
              error={errors.password}
            />
          </div>
        </div>
        <div
          className="change-password-information"
          style={{ marginBottom: "25px" }}
        >
          <div className="change-password-row-title">{t("new_password")}:</div>
          <div className="change-password-row-content">
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("enter_new_password")}
              width="100%"
              error={errors.password}
            />
          </div>
        </div>

        <div
          className="change-password-information"
          style={{ marginBottom: "25px" }}
        >
          <div className="change-password-row-title">
            {t("confirm_new_password")}:
          </div>
          <div className="change-password-row-content">
            <PasswordInput
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder={t("enter_confirm_new_password")}
              width="100%"
              error={errors.password}
            />
          </div>
        </div>

        <div className="change-password-information">
          <div className="change-password-row-title"></div>
          <div className="change-password-row-content">
            <button className="profile-save-button" onClick={handleSubmit}>
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
