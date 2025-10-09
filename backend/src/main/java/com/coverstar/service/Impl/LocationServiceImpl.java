package com.coverstar.service.Impl;

import com.coverstar.entity.District;
import com.coverstar.entity.Province;
import com.coverstar.entity.Ward;
import com.coverstar.repository.DistrictRepository;
import com.coverstar.repository.ProvinceRepository;
import com.coverstar.repository.WardRepository;
import com.coverstar.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private WardRepository wardRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    @Override
    public List<Province> getAllProvinces() {
        try {
            return provinceRepository.findAll();
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<District> getDistrictsByProvinceId(Integer provinceId) {
        try {
            return districtRepository.findByProvinceId(provinceId);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Ward> getWardsByDistrictId(Integer districtId) {
        try {
            return wardRepository.findByDistrictId(districtId);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Province getProvinceById(Integer provinceId) {
        try {
            return provinceRepository.findById(provinceId).orElse(null);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public District getDistrictById(Integer districtId) {
        try {
            return districtRepository.findById(districtId).orElse(null);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Ward getWardById(Integer wardId) {
        try {
            return wardRepository.findById(wardId).orElse(null);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}