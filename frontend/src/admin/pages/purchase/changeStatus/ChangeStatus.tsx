import React, { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import Loading from "../../../../components/common/loading/Loading";
import StringDropdown from "../../../../components/common/dropdown/StringDropdown";
import { updateStatus } from "../../../../api/purchases";

interface StatusModalProps {
  purchaseId: number;
  currentStatus?: number | null;
  onClose: (shouldReload?: boolean) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  purchaseId,
  currentStatus,
  onClose,
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { label: "Chờ duyệt", value: "1" },
    { label: "Đã duyệt", value: "2" },
    { label: "Đang xử lý", value: "3" },
    { label: "Hoàn thành", value: "4" },
    { label: "Đã hủy", value: "5" },
  ];

  useEffect(() => {
    if (currentStatus !== undefined && currentStatus !== null) {
      setStatus(currentStatus.toString());
    }
  }, [currentStatus]);

  const handleSubmit = () => {
    if (!status) {
      alert("Vui lòng chọn trạng thái!");
      return;
    }
    setLoading(true);
    updateStatus(purchaseId, Number(status))
      .then(() => {
        onClose(true);
      })
      .catch(() => {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng");
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
