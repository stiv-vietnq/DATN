package com.coverstar.service;

import com.coverstar.entity.District;
import com.coverstar.entity.Province;
import com.coverstar.entity.Ward;
import java.util.List;

public interface LocationService {
    List<Province> getAllProvinces();
    List<District> getDistrictsByProvinceId(Integer provinceId);
    List<Ward> getWardsByDistrictId(Integer districtId);

    Province getProvinceById(Integer provinceId);
    District getDistrictById(Integer districtId);
    Ward getWardById(Integer wardId);
}