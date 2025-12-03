import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/common/input/Input";
import "./Profile.css";
import { FaUser } from "react-icons/fa";
import { getUserProfile, updateUserProfile } from "../../../api/user";
import Loading from "../../../components/common/loading/Loading";
import { useToast } from "../../../components/toastProvider/ToastProvider";

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  username: string;
  sex: string;
  dateOfBirth: string;
  directoryPath: string;
}

export default function Profile() {
  const { t } = useTranslation();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [sex, setSex] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const userId = localStorage.getItem("userId") || "";
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    handleGetProfile();
  }, []);

  function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const visiblePart = name.slice(0, 2);
    const maskedPart = "*".repeat(Math.max(name.length - 2, 0));
    return `${visiblePart}${maskedPart}@${domain}`;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("Dung lượng file tối đa là 1 MB");
      setPreview(null);
      setSelectedFile(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("Chỉ hỗ trợ định dạng JPEG hoặc PNG");
      setPreview(null);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleGetProfile = () => {
    setLoading(true);
    getUserProfile(Number(userId))
      .then((res) => {
        const data = res?.data;
        setProfile(data);
        setLastName(data?.lastName);
        setFirstName(data?.firstName);
        setPhone(data?.phoneNumber);

        if (data?.sex) {
          setSex(String(data.sex));
        }

        if (data?.dateOfBirth) {
          const parts = data.dateOfBirth.split("/");
          if (parts.length === 3) {
            setDay(parts[2]);
            setMonth(parts[1]);
            setYear(parts[0]);
          }
        }

        if (data?.directoryPath) {
          setPreview(data?.directoryPath);
        }
      })
      .finally(() => setLoading(false));
  };

  const validateDateOfBirth = () => {
    if (!year || month === "00" || day === "00") return null;

    const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const selectedDate = new Date(dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      showToast("Ngày sinh không được lớn hơn ngày hiện tại!", "info");
      return "error";
    }

    return dateStr;
  };

  const handleSave = () => {
    setLoading(true);
    const dob = validateDateOfBirth();
    if (dob === "error") {
      setLoading(false);
      return;
    }
    const dateOfBirth = dob;
    updateUserProfile({
      id: Number(userId),
      firstName,
      lastName,
      dateOfBirth,
      sex: Number(sex),
      phoneNumber: phone,
      file: selectedFile || null,
    })
      .then(() => {
        showToast("Cập nhật thành công!!!", "success");
        handleGetProfile();
      }).catch(() => {
        showToast("Cập nhật thất bại, vui lòng thử lại sau!!!", "error");
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <Loading />;

  return (
    <div className="main-container" style={{ padding: "25px" }}>
      <div className="profile-header">
        <div className="profile-title">{t("profile_of_me")}</div>
        <div className="profile-note">{t("profile_note")}</div>
      </div>

      <div className="profile-content">
        <div className="profile-information">
          <div className="profile-row">
            <div className="profile-row-title">{t("username")}:</div>
            <div className="profile-row-content">{profile?.username}</div>
          </div>
          <div className="profile-row">
            <div className="profile-row-title">{t("last_name")}:</div>
            <div
              className="profile-row-content"
              style={{ marginBottom: "-28px" }}
            >
              <Input
                length={50}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t("enter_last_name")}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-row-title">{t("first_name")}:</div>
            <div
              className="profile-row-content"
              style={{ marginBottom: "-28px" }}
            >
              <Input
                length={50}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t("enter_first_name")}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-row-title">Email:</div>
            <div className="profile-row-content">
              {maskEmail(profile?.email || "")}
            </div>
          </div>

          <div className="profile-row">
            <div className="profile-row-title">{t("phone_placeholder")}:</div>
            <div
              className="profile-row-content"
              style={{ marginBottom: "-28px" }}
            >
              <Input
                type="number"
                value={phone}
                onChange={(e) => {
                  const v = e.target.value.slice(0, 14);
                  setPhone(v);
                }}
                placeholder={t("enter_phone_number")}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-row-title">{t("sex")}:</div>
            <div
              className="profile-row-content"
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <div className="profile-row-content-radio">
                <input
                  type="radio"
                  name="sex"
                  value="0"
                  checked={sex === "0"}
                  onChange={(e) => setSex(e.target.value)}
                />{" "}
                {t("male")}
              </div>
              <div className="profile-row-content-radio">
                <input
                  type="radio"
                  name="sex"
                  value="1"
                  checked={sex === "1"}
                  onChange={(e) => setSex(e.target.value)}
                  style={{ marginLeft: "20px" }}
                />{" "}
                {t("female")}
              </div>
              <div className="profile-row-content-radio">
                <input
                  type="radio"
                  name="sex"
                  value="2"
                  checked={sex === "2"}
                  onChange={(e) => setSex(e.target.value)}
                  style={{ marginLeft: "20px" }}
                />{" "}
                {t("other")}
              </div>
            </div>
          </div>

          <div className="profile-row">
            <div className="profile-row-title">{t("birth_date")}:</div>
            <div
              className="profile-row-content"
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginBottom: "-28px",
              }}
            >
              <Input
                type="number"
                value={day}
                onChange={(e) => {
                  const v = e.target.value.slice(0, 2);
                  setDay(v);
                }}
                placeholder={t("day")}
                style={{ width: "100%" }}
              />

              <Input
                type="number"
                value={month}
                onChange={(e) => {
                  const v = e.target.value.slice(0, 2);
                  setMonth(v);
                }}
                placeholder={t("month")}
                style={{ width: "100%" }}
              />

              <Input
                type="number"
                length={4}
                value={year}
                onChange={(e) => {
                  const v = e.target.value.slice(0, 4);
                  setYear(v);
                }}
                placeholder={t("year")}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-row-title"></div>
            <div className="profile-row-content">
              <button className="profile-save-button" onClick={handleSave}>
                {t("save")}
              </button>
            </div>
          </div>
        </div>

        <div className="profile-image">
          {" "}
          <div className="avatar-upload-container">
            <div className="avatar-preview">
              {preview ? (
                <img src={preview} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <FaUser size={40} color="#aaa" />
                </div>
              )}
            </div>

            <label className="avatar-button">
              Chọn Ảnh
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                hidden
              />
            </label>

            <div className="avatar-hint">
              {t("placeholder_1")}
              <br />
              {t("placeholder_2")}
            </div>

            {error && <div className="avatar-error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
