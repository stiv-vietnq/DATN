import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/auth";
import Button from "../../../components/common/button/Button";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";
import PasswordInput from "../../../components/common/passwordInput/PasswordInput";
import "./Login.css";
import { useToast } from "../../../components/toastProvider/ToastProvider";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pw, setPw] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPw(e.currentTarget.value);
  };

  const handleLogin = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!usernameOrEmail) {
      showToast("Vui lòng nhập tên đăng nhập hoặc email!!!!", "info");
      return;
    }

    if (!pw) {
      showToast("Vui lòng nhập mật khẩu!!!!", "info");
      return;
    }

    setLoading(true);
    login({ usernameOrEmail: usernameOrEmail, password: pw })
      .then((response) => {
        setLoading(false);
        const token = response.data?.token;
        const username = response.data?.username;
        const role = response.data?.role;
        const firstName = response.data?.firstName;
        const lastName = response.data?.lastName;
        const userId = response.data?.id;

        localStorage.setItem("userId", userId);
        localStorage.setItem("tokenWeb", token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        if (role === "ROLE_ADMIN") {
          navigate("/admin/brands");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          showToast("Tên đăng nhập hoặc mật khẩu không đúng!", "error");
        }

        if (err.response && err.response.status === 403) {
          showToast("Bạn không có quyền truy cập!", "error");
        }

        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data === "ACCOUNT_NOTFOUND"
        ) {
          showToast("Tên đăng nhập hoặc mật khẩu không đúng!", "error");
        }

        if (err.response && err.response.status === 500) {
          showToast("Xảy ra lỗi máy chủ, vui long thử lại sau!", "error");
        }

        setLoading(false);
      });
  };

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/register");
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
      <div className="login-container">
        <div className="login-logo"></div>
        <div className="login-form">
          <div className="login-title">{t("login")}</div>
          <div className="form-container">
            <Input
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder={t("enter_username")}
              style={{ width: "100%" }}
            />

            <PasswordInput
              value={pw}
              onChange={handleChange}
              placeholder={t("enter_password")}
              width="100%"
            />

            <Button width="100%" variant="login-often" onClick={(e) => handleLogin(e)} type="button">
              {t("login")}
            </Button>

            <div
              className="login-forgot-password"
              onClick={handleForgotPassword}
            >
              {t("forgot_password")}
            </div>

            <div className="divider">
              <span>{t("or")}</span>
            </div>

            <div className="login-register">
              <div>{t("new_to_quickbuy")}</div>
              <div className="register-link" onClick={handleClick}>
                {t("register")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
