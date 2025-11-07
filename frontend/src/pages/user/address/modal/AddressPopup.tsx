import React, { useEffect, useState } from "react";
import "./AddressPopup.css";
import { useTranslation } from "react-i18next";
import Input from "../../../../components/common/input/Input";
import StringDropdown from "../../../../components/common/dropdown/StringDropdown";
import {
    getAllProvinces,
    getDistrictsByProvinceId,
    getWardsByDistrictId
} from "../../../../api/location";
import Textarea from "../../../../components/common/textarea/Textarea";
import { createOrUpdateAddress } from "../../../../api/address";

interface AddressPopupProps {
    onClose: () => void;
    onSuccess?: () => void;
}

interface Option {
    label: string;
    value: string;
}

const AddressPopup: React.FC<AddressPopupProps> = ({ onClose, onSuccess }) => {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [provinceOptions, setProvinceOptions] = useState<Option[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
    const [wardOptions, setWardOptions] = useState<Option[]>([]);
    const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [isDefault, setIsDefault] = useState("0");
    const userId = localStorage.getItem("userId") || "";
    const [type, setType] = useState<number>(1);

    useEffect(() => {
        getAllProvinces().then((response) => {
            const options = response.data.map((province: any) => ({
                label: province.name,
                value: String(province.provinceId),
            }));
            setProvinceOptions(options);
        });
    }, []);

    useEffect(() => {
        if (selectedProvinceId) {
            getDistrictsByProvinceId(Number(selectedProvinceId)).then((response) => {
                const options = response.data.map((district: any) => ({
                    label: district.name,
                    value: String(district.districtId),
                }));
                setDistrictOptions(options);

                // reset các dropdown phụ
                setSelectedDistrictId(null);
                setSelectedWardId(null);
                setWardOptions([]);
            });
        } else {
            setDistrictOptions([]);
            setSelectedDistrictId(null);
            setWardOptions([]);
            setSelectedWardId(null);
        }
    }, [selectedProvinceId]);

    useEffect(() => {
        if (selectedDistrictId) {
            getWardsByDistrictId(Number(selectedDistrictId)).then((response) => {
                const options = response.data.map((ward: any) => ({
                    label: ward.name,
                    value: String(ward.wardId),
                }));
                setWardOptions(options);
                setSelectedWardId(null);
            });
        } else {
            setWardOptions([]);
            setSelectedWardId(null);
        }
    }, [selectedDistrictId]);

    const handleSave = () => {
        const payload = {
            fullName: name,
            phoneNumber,
            address,
            defaultValue: Number(isDefault),
            provinceId: selectedProvinceId ? Number(selectedProvinceId) : 0,
            districtId: selectedDistrictId ? Number(selectedDistrictId) : 0,
            wardId: selectedWardId ? Number(selectedWardId) : 0,
            userId: userId ? Number(userId) : 1,
            type,
            map: "",
        };
        createOrUpdateAddress(payload)
            .then(() => {
                onClose();
                if (onSuccess) onSuccess();
            })
            .catch((error) => {
            });
    };

    return (
        <div className="address-popup-overlay">
            <div className="address-popup">
                <div className="address-popup-title">{t("add_new_address")}</div>

                <div className="address-popup-content">
                    <div style={{ width: "100%" }}>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên địa chỉ..."
                            style={{ width: "100%" }}
                        />
                    </div>
                    <div style={{ width: "100%" }}>
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Nhập số điện thoại..."
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>

                <div className="address-popup-content">
                    <div style={{ width: "100%" }}>
                        <StringDropdown
                            value={selectedProvinceId}
                            onChange={setSelectedProvinceId}
                            options={provinceOptions}
                            placeholder="--Chọn tỉnh/thành phố--"
                            error={undefined}
                        />
                    </div>
                    <div style={{ width: "100%" }}>
                        <StringDropdown
                            value={selectedDistrictId}
                            onChange={setSelectedDistrictId}
                            options={districtOptions}
                            placeholder="--Chọn quận/huyện--"
                            error={undefined}
                            disabled={!selectedProvinceId}
                        />
                    </div>
                    <div style={{ width: "100%" }}>
                        <StringDropdown
                            value={selectedWardId}
                            onChange={setSelectedWardId}
                            options={wardOptions}
                            placeholder="--Chọn phường/xã--"
                            error={undefined}
                            disabled={!selectedDistrictId}
                        />
                    </div>
                </div>
                <div className="address-popup-content">
                    <Textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nhập địa chỉ cụ thể..."
                        style={{ marginBottom: '28px' }}
                    />
                </div>
                <div className="address-popup-content">
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                            type="checkbox"
                            checked={isDefault === "1"}
                            onChange={(e) => setIsDefault(e.target.checked ? "1" : "0")}
                        />
                        <span>Đặt làm địa chỉ mặc định</span>
                    </label>
                </div>
                <div className="popup-buttons">
                    <button className="popup-save" onClick={handleSave}>
                        Thêm mới
                    </button>
                    <button className="popup-cancel" onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressPopup;
