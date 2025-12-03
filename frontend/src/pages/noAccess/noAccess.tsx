import { useNavigate } from "react-router-dom";
import Button from "../../components/common/button/Button";
import "./noAccess.css";

const NoAccess = () => {

    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate("/login");
    }

    return (
        <div className="no-access-container">
            <div className="no-access-card">
                <h1>Bạn không có quyền truy cập</h1>
                <p>Vui lòng liên hệ quản trị viên hoặc đăng nhập bằng tài khoản khác.</p>
                <Button onClick={handleGoToLogin}>Quay về trang đăng nhập</Button>
            </div>
        </div>
    );
};

export default NoAccess;
