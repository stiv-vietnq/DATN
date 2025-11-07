import api from "./index";

export const createOrUpdateAddress = (addressData: {
    fullName: string;
    phoneNumber: string;
    address: string;
    defaultValue: number;
    provinceId: number;
    districtId: number;
    wardId: number;
    userId: number;
    type: number;
    map?: string;
}) => {
    return api.post("/address/createOrUpdateAddress", addressData);
};

export const getAddressesByUserId = (userId: number) => {
    return api.get(`/address/getAddressByUserId/${userId}`);
}

export const deleteAddressById = (addressId: number) => {
    return api.post(`/address/deleteAddress/${addressId}`);
}

export const updateDefaultAddress = (addressId: number, isDefault: number) => {
    return api.post(`/address/updateDefaultAddress/${addressId}`, null, {
        params: { isDefault },
    });
};


