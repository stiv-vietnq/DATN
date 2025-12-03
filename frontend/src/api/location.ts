import api from "./index";

export const getAllProvinces = () => {
    return api.get(`/locations/provinces`);
};

export const getDistrictsByProvinceId = (provinceId: number) => {
    return api.get(`/locations/districts/${provinceId}`);
};

export const getWardsByDistrictId = (districtId: number) => {
    return api.get(`/locations/wards/${districtId}`);
};

export const getProvinceById = (provinceId: number) => {
    return api.get(`/locations/province/${provinceId}`);
};

export const getDistrictById = (districtId: number) => {
    return api.get(`/locations/district/${districtId}`);
};

export const getWardById = (wardId: number) => {
    return api.get(`/locations/ward/${wardId}`);
};