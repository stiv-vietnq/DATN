import { useEffect, useState } from "react";
import {
  getDistrictById,
  getProvinceById,
  getWardById,
} from "../../../api/location";

export default function AddressItem({ addr }: { addr: any }) {
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  useEffect(() => {
    if (addr?.provinceId) {
      getProvinceById(addr?.provinceId).then((res) =>
        setProvinceName(res.data.name)
      );
    }
    if (addr?.districtId) {
      getDistrictById(addr?.districtId).then((res) =>
        setDistrictName(res.data.name)
      );
    }
    if (addr?.wardId) {
      getWardById(addr?.wardId).then((res) => setWardName(res.data.name));
    }
  }, [addr?.provinceId, addr?.districtId, addr?.wardId]);

  return (
    <>
      {addr?.address}, {wardName}, {districtName}, {provinceName}
    </>
  );
}
