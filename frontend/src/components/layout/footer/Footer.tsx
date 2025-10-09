import { useTranslation } from "react-i18next";
import { AiFillFacebook } from "react-icons/ai";
import { SiInstagram, SiZalo } from "react-icons/si";
import logo from "../../../assets/quickbuyshop.png";
import "./Footer.css";
import { FaMoneyBillWave, FaPaypal } from "react-icons/fa";
import VnpayLogo from "../../../assets/vnpay.svg";
import MomoLogo from "../../../assets/momo.svg";

export default function Footer() {

  const { t } = useTranslation();

  return (
    <>
      <div className="footer">
        <div className="footer-main">
          <div className="footer-payment-method">
            <div className="footer-payment-method-logo">
              <img src={logo} className="footer-logo-image" alt="logo" />
            </div>
            <div className="footer-payment-method-note">{t("footer_note")}</div>
            <div className="footer-title">{t("payment_method")}</div>
            <div className="payment-methods">
              <div className="payment-box">
                <FaMoneyBillWave className="payment-icon" style={{ color: "#4CAF50" }} />
                <span>{t("cash")}</span>
              </div>
              <div className="payment-box">
                <img src={MomoLogo} alt="MoMo" className="payment-icon" />
                <span>{t("momo")}</span>
              </div>
              <div className="payment-box">
                <FaPaypal className="payment-icon" style={{ color: "#003087" }} />
                <span>{t("paypal")}</span>
              </div>
              <div className="payment-box">
                <img src={VnpayLogo} alt="VNPay" className="payment-icon" />
                <span>{t("vnpay")}</span>
              </div>
            </div>
          </div>
          <div className="footer-policy">
            <div className="footer-title">{t("policy.policy")}</div>
            <div className="footer-title-detail">{t("policy.payment_policy")}</div>
            <div className="footer-title-detail">{t("policy.purchase_instructions")}</div>
            <div className="footer-title-detail">{t("policy.personal_information_security")}</div>
          </div>
        </div>
        <div className="footer-main">
          <div className="footer-general-information">
            <div className="footer-title">{t("general_information")}</div>
            <div className="footer-title-details">
              <div className="footer-title-detail-header">{t("address")}</div>
              <div className="footer-title-detail-general-information">0355422057</div>
            </div>

            <div className="footer-title-details">
              <div className="footer-title-detail-header">{t("phone")}</div>
              <div className="footer-title-detail-general-information">About Us</div>
            </div>

            <div className="footer-title-details">
              <div className="footer-title-detail-header">{t("email")}</div>
              <div className="footer-title-detail-general-information">vietnq@sojitz-ti.vn</div>
            </div>

            <div className="footer-title">{t("linking_system")}</div>
            <div className="footer-icon">
              <div className="icon-box zalo">
                <SiZalo size={14} />
              </div>

              <div className="icon-box facebook">
                <AiFillFacebook size={14} />
              </div>

              <div className="icon-box instagram">
                <SiInstagram size={14} />
              </div>
            </div>
          </div>

          <div className="footer-general-instagram">
            <div className="footer-title">instagram</div>
          </div>
        </div>
      </div>
      <div className="footer-by-me">
        {t("footer_by_me")}
      </div>
    </>
  );
}
