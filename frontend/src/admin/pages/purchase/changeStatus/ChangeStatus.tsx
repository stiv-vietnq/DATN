import React, { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import Loading from "../../../../components/common/loading/Loading";
import StringDropdown from "../../../../components/common/dropdown/StringDropdown";
import { updateStatus } from "../../../../api/purchases";
import { useToast } from "../../../../components/toastProvider/ToastProvider";
import { sendNotification } from "../../../../api/notification";

interface StatusModalProps {
  purchaseId: number;
  currentStatus?: number | null;
  purchaseUserId: number | null;
  onClose: (shouldReload?: boolean) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  purchaseId,
  currentStatus,
  purchaseUserId,
  onClose,
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const statusOptions = [
    { label: "Chờ duyệt", value: "1" },
    { label: "Đã duyệt", value: "2" },
    { label: "Đang xử lý", value: "3" },
    { label: "Hoàn thành", value: "4" },
    { label: "Hủy", value: "5" },
  ];

  const cancelReasonOptions = [
    { label: "Khách hàng yêu cầu", value: "Khách hàng yêu cầu" },
    { label: "Hết hàng", value: "Hết hàng" },
    { label: "Thông tin thanh toán sai", value: "Thông tin thanh toán sai" },
    { label: "Khác", value: "Khác" },
  ];

  useEffect(() => {
    if (currentStatus !== undefined && currentStatus !== null) {
      setStatus(currentStatus.toString());
    }
  }, [currentStatus]);

  const handleSubmit = () => {
    if (!status) {
      showToast("Vui lòng chọn trạng thái!", "info");
      return;
    }

    if (status === "5" && !cancelReason) {
      showToast("Vui lòng chọn lý do hủy đơn!", "info");
      return;
    }

    setLoading(true);
    updateStatus(purchaseId, Number(status), cancelReason || "", true)
      .then(() => {
        onClose(true);
        if( status === "5"){
          sendNotification({
          userId: Number(purchaseUserId) || 0,
          type: "ORDER",
          title: "Thông báo đơn hàng bị hủy",
          message: `Đơn hàng của bạn đã bị hủy bởi quản trị viên. Lý do: ${cancelReason}`,
          failReason: "Đơn hàng bị hủy"
        });
        } else if( status === "4"){
          sendNotification({
          userId: Number(purchaseUserId) || 0,
          type: "ORDER_SUCCESS",
          title: "Thông báo đơn hàng hoàn thành",
          message: `Đơn hàng của bạn đã được giao thành công.`,
          failReason: "Đơn hàng hoàn thành"
        });
        } else if(status === "2"){
          sendNotification({
          userId: Number(purchaseUserId) || 0,
          type: "ORDER_SUCCESS",
          title: "Thông báo đơn hàng được xác nhận",
          message: `Đơn hàng của bạn đã được duyệt, bên cửa hàng sẽ chuẩn bị giao hàng.`,
          failReason: "Đơn hàng hoàn thành"
        });
        }
        
        showToast("Cập nhật trạng thái đơn hàng thành công", "success");
      })
      .catch(() => {
        showToast("Lỗi cập nhật trạng thái đơn hàng", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: "500px" }}>
        <div className="modal-header">
          <div className="modal-title">Chỉnh sửa trạng thái</div>
          <div className="button-close">
            <button onClick={() => onClose(false)}>
              <FaX />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <StringDropdown
              value={status}
              onChange={setStatus}
              options={statusOptions}
              placeholder={null}
            />
          </div>

          {status === "5" && (
            <div className="modal-field" style={{ marginTop: "10px" }}>
              <StringDropdown
                value={cancelReason}
                onChange={setCancelReason}
                options={cancelReasonOptions}
                placeholder="Chọn lý do hủy"
              />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-green" onClick={handleSubmit}>
            Lưu
          </button>
          <button onClick={() => onClose(false)} className="btn-secondary">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
