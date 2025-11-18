import { useNavigate } from "react-router-dom";
import "./PurchasesSuccess.css";

const PurchasesSuccess = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    const handleViewOrder = () => {
        navigate("/user/purchases");
    };

    return (
        <div className="ps-container">
            <div className="ps-card">
                <div className="ps-icon">🎉</div>
                <h2>Đặt Hàng Thành Công!</h2>
                <p>Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p>

                <div className="ps-actions">
                    <button className="ps-btn primary" onClick={handleViewOrder}>
                        Xem đơn hàng
                    </button>
                    <button className="ps-btn" onClick={handleGoHome}>
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchasesSuccess;
