import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/auth";
import "./Login.css";
import Input from "../../../components/common/input/Input";
import PasswordInput from "../../../components/common/passwordInput/PasswordInput";
import Button from "../../../components/common/button/Button";
import Loading from "../../../components/common/loading/Loading";

export default function Login() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [pw, setPw] = useState("");
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        setPw(e.currentTarget.value);
    };

    const handleLogin = () => {
        setLoading(true);
        login({ usernameOrEmail: usernameOrEmail, password: pw })

            .then((response) => {
                setLoading(false);
                const token = response.data?.token;
                const username = response.data?.username;
                const role = response.data?.role;
                const firstName = response.data?.firstName;
                const lastName = response.data?.lastName;

                if (token) {
                    localStorage.setItem("tokenWeb", token);
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", role);
                    localStorage.setItem("firstName", firstName);
                    localStorage.setItem("lastName", lastName);
                    navigate("/home");
                } else {
                    alert("Không nhận được token từ server!");
                }
                navigate("/admin/brands");
            })
            .catch(() => {
                setLoading(false);
                alert(t("login_failed"));
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
                <div className="login-logo">

                </div>
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

                        <Button width="100%" variant="login-often" onClick={handleLogin}>
                            {t("login")}
                        </Button>

                        <div className="login-forgot-password" onClick={handleForgotPassword}>{t("forgot_password")}</div>

                        <div className="divider">
                            <span>{t("or")}</span>
                        </div>

                        <div className="login-register">
                            <div>{t("new_to_quickbuy")}</div>
                            <div className="register-link" onClick={handleClick}>{t("register")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
