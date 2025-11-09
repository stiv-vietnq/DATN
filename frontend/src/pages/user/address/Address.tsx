import { useTranslation } from "react-i18next";
import { use, useEffect, useState } from "react";
import "./Address.css";
import AddressPopup from "./modal/AddressPopup";
import { deleteAddressById, getAddressesByUserId, updateDefaultAddress } from "../../../api/address";
import AddressItem from "./AddressItem";
import ConfirmModal from "../../../components/common/confirmModal/ConfirmModal";
import Loading from "../../../components/common/loading/Loading";


interface Address {
    id: number;
    fullName: string;
    phoneNumber: string;
    address: string;
    provinceId: string;
    districtId: string;
    wardId: string;
    defaultValue: number;
}

export default function Address() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const userId = localStorage.getItem("userId");
    const [showConfirm, setShowConfirm] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [confirmAction, setConfirmAction] = useState<
        "setDefault" | "delete" | null
    >(null);

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = () => {
        if (userId) {
            setLoading(true);
            getAddressesByUserId(Number(userId)).then((res) => {
                setAddresses(res.data);
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    const handleDeleteAddress = (addressId: number) => {
        deleteAddressById(addressId)
            .then(() => {
                setShowConfirm(false);
                handleSearch();
            })
            .catch((error) => {
                console.error("Lỗi khi xóa địa chỉ:", error);
                alert("Không thể xóa địa chỉ!");
            });
    };

    const handleSetDefaultAddress = (addressId: number) => {
        updateDefaultAddress(addressId, 1)
            .then(() => {
                setShowConfirm(false);
                handleSearch();
            })
            .catch((error) => {
                console.error("Lỗi khi thiết lập địa chỉ mặc định:", error);
            });
    };

    if (loading) return <Loading />;

    return (
        <div className="main-container">
            <div className="address-header">
                <div className="address-title">{t("my_address")}</div>
                <div className="address-actions">
                    <button
                        className="address-add-button"
                        onClick={() => setShowPopup(true)}
                    >
                        {t("add_new_address")}
                    </button>
                </div>
            </div>

            <div className="address-content">
                <div className="title">Địa chỉ</div>
                <div className="address-list">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="address-item">
                            <div className="address-header-item">
                                <div className="address-info-item">
                                    <div className="address-info-name">{addr.fullName}</div>
                                    <div className="address-info-phone">{addr.phoneNumber}</div>
                                </div>
                                <div className="address-body-item">
                                    <AddressItem addr={addr} />
                                </div>
                                {addr.defaultValue === 1 && <div className="address-default-item">Mặc định</div>}
                                {addr.defaultValue === 0 && <div className="address-normal-item">Địa chỉ thường</div>}
                            </div>
                            <div className="address-actions-item">
                                <div className="address-action-set-default">
                                    <button className="btn-set-default"
                                        onClick={() => {
                                            setSelectedAddressId(addr.id);
                                            setConfirmAction("setDefault");
                                            setShowConfirm(true);
                                        }}
                                        disabled={addr.defaultValue === 1}>
                                        Thiết lập mặc định
                                    </button>
                                </div>
                                <div className="address-action-delete">
                                    {addr.defaultValue === 0 && (
                                        <button className="btn-delete"
                                            onClick={() => {
                                                setSelectedAddressId(addr.id);
                                                setConfirmAction("delete");
                                                setShowConfirm(true);
                                            }}
                                        >Xóa</button>
                                    )}
                                    <button className="btn-update">Cập nhật</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && (
                <AddressPopup
                    onClose={() => setShowPopup(false)}
                    onSuccess={() => {
                        setShowPopup(false);
                        handleSearch();
                    }}
                />
            )}

            {showConfirm && (
                <ConfirmModal
                    title={
                        confirmAction === "delete"
                            ? "Xác nhận xóa địa chỉ"
                            : "Xác nhận thiết lập địa chỉ mặc định"
                    }
                    message={
                        confirmAction === "delete"
                            ? "Bạn có chắc chắn muốn xóa địa chỉ này?"
                            : "Bạn có chắc chắn muốn thiết lập địa chỉ này làm mặc định?"
                    }
                    onConfirm={() =>
                        confirmAction === "delete"
                            ? handleDeleteAddress(selectedAddressId!)
                            : handleSetDefaultAddress(selectedAddressId!)
                    }
                    onCancel={() => setShowConfirm(false)}
                    type="delete"
                />
            )}
        </div>
    );
}
