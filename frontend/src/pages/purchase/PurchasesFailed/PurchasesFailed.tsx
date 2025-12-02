import { useNavigate } from "react-router-dom";
import "./PurchasesFailed.css";

const PurchasesFailed = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    const handleRetryPayment = () => {
        navigate("/cart");
    };

    return (
        <div className="pf-container">
            <div className="pf-card">
                <div className="pf-icon">❌</div>
                <h2>Đặt hàng không thành công!</h2>
                <p>Đã xảy ra lỗi khi xử lý khi đặt hàng. Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>

                <div className="pf-actions">
                    <button className="pf-btn primary" onClick={handleRetryPayment}>
                        Thử lại đặt hàng
                    </button>
                    <button className="pf-btn" onClick={handleGoHome}>
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchasesFailed;
