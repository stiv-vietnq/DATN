import { useEffect, useState } from "react";
import { FaSearch, FaUnlock } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { lockAccount, searchUsers } from "../../../api/user";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import DateRangePicker from "../../../components/common/dateRangePicker/DateRangePicker";
import StringDropdown from "../../../components/common/dropdown/StringDropdown";
import Input from "../../../components/common/input/Input";
import Loading from "../../../components/common/loading/Loading";
import Pagination from "../../../components/pagination/Pagination";
import BaseTable, {
  BaseColumn,
} from "../../../components/table/BaseTableLayout";
import "./UserPage.css";
import { useToast } from "../../../components/toastProvider/ToastProvider";

export interface UserTable {
  id: number;
  username: string;
  email: string;
  active: boolean;
  locked: boolean;
  createdDate: string;
  lastName: string;
  firstName: string;
  countLock: number;
}

interface Option {
  label: string;
  value: string;
}

const UserPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedLock, setSelectedLock] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"unlock" | "lock" | null>(
    null
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [users, setUsers] = useState<UserTable[]>([]);
  const [totalItems, setTotalItems] = useState(users?.length);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSearch = () => {
    setLoading(true);
    const params = {
      username: name || "",
      fromDate: fromDate || "",
      toDate: toDate || "",
      isActive: selected || "",
      isLocked: selectedLock || "",
    };
    searchUsers(params)
      .then((response) => {
        setUsers(response.data);
        setTotalItems(response.data.length);
      })
      .catch(() => {
        showToast("Lỗi lấy dữ liệu người dùng", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = users.slice(start, end);

  const columns: BaseColumn<UserTable>[] = [
    { key: "id", label: "ID", width: "5%" },
    { key: "username", label: "Tên người dùng", width: "15%" },
    { key: "email", label: "Email", width: "20%" },
    {
      key: "active",
      label: "Trạng thái kích hoạt",
      width: "15%",
      render: (item: UserTable) => (
        <span className={item.active ? "status-active" : "status-inactive"}>
          {item.active ? "Đã được kích hoạt" : "Chưa được kích hoạt"}
        </span>
      ),
    },
    {
      key: "createdDate",
      label: "Ngày tạo",
      width: "15%",
      render: (item: UserTable) =>
        item?.createdDate
          ? new Date(item.createdDate).toLocaleString("vi-VN", {
              hour12: false,
            })
          : "",
    },
    {
      key: "locked",
      label: "Trạng thái khóa",
      width: "15%",
      render: (item: UserTable) => (
        <span className={item.locked ? "locked" : "unlocked"}>
          {item.locked ? "Tài khoản đang bị khóa" : "Tài khoản hoạt động"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      width: "10%",
      render: (item: UserTable) => {
        const isInactive = !item.active;

        return (
          <div className="action-buttons-category">
            {!item.locked && (
              <FaLock
                className="action-buttons-icon-category"
                color={isInactive ? "gray" : "red"}
                onClick={() => {
                  if (!isInactive) {
                    setLocked("true");
                    openConfirm("lock", item.email);
                  }
                }}
                style={{
                  cursor: isInactive ? "not-allowed" : "pointer",
                }}
              />
            )}

            {item.locked && (
              <FaUnlock
                className="action-buttons-icon-category"
                color={isInactive ? "gray" : "green"}
                onClick={() => {
                  if (!isInactive) {
                    setLocked("false");
                    openConfirm("unlock", item.email);
                  }
                }}
                style={{
                  cursor: isInactive ? "not-allowed" : "pointer",
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const openConfirm = (action: "unlock" | "lock", email: string) => {
    setSelectedId(email);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const handleLockAccount = (email: any, locked: any) => {
    const params = { isLocked: locked };
    lockAccount(email, params)
      .then(() => {
        handleSearch();
        showToast("Cập nhật trạng thái khóa tài khoản thành công!", "success");
      })
      .catch(() => {
        showToast("Lỗi cập nhật trạng thái khóa tài khoản!", "error");
      })
      .finally(() => {
        setShowConfirm(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4-category">
      <Pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={setPage}
        onItemsPerPageChange={setItemsPerPage}
        showPageSizeSelector
        headerContent={
          <div className="header-content-user">
            <div className="header-info-user" style={{ marginBottom: "-28px" }}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tìm kiếm theo tên người dùng..."
                style={{ width: "100%" }}
              />
              <StringDropdown
                value={selected}
                onChange={setSelected}
                options={[
                  { label: "Đã được kích hoạt", value: "true" },
                  { label: "Chưa được kích hoạt", value: "false" },
                ]}
                placeholder="--Chọn trạng thái tài khoản--"
                error={undefined}
                style={{ width: "100%" }}
              />
              <StringDropdown
                value={selectedLock}
                onChange={setSelectedLock}
                options={[
                  { label: "Tài khoản đang bị khóa", value: "true" },
                  { label: "Tài khoản hoạt động", value: "false" },
                ]}
                placeholder="--Chọn trạng thái khóa--"
                error={undefined}
                style={{ width: "100%" }}
              />
              <DateRangePicker
                fromDate={fromDate}
                toDate={toDate}
                onChangeFrom={setFromDate}
                onChangeTo={setToDate}
                error={
                  fromDate && toDate && new Date(fromDate) > new Date(toDate)
                    ? "Ngày bắt đầu phải nhỏ hơn ngày kết thúc"
                    : undefined
                }
              />
            </div>
            <div className="header-actions-user">
              <div className="button-export-user">
                <button onClick={handleSearch}>
                  <FaSearch /> Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        }
      >
        <BaseTable
          columns={columns}
          data={currentItems}
          showCheckbox
          onSelect={(ids: any) => console.log("Chọn:", ids)}
        />
      </Pagination>

      {showConfirm && (
        <ConfirmModal
          title={
            confirmAction !== "lock"
              ? "Xác nhận mở khóa tài khoản"
              : "Xác nhận khóa tài khoản"
          }
          message={
            confirmAction !== "lock"
              ? "Bạn có chắc chắn muốn mở khóa tài khoản này?"
              : "Bạn có chắc chắn muốn khóa tài khoản này?"
          }
          onConfirm={() => handleLockAccount(selectedId, locked)}
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      )}
    </div>
  );
};

export default UserPage;
