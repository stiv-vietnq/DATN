package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.entity.District;
import com.coverstar.entity.Province;
import com.coverstar.entity.Ward;
import com.coverstar.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/provinces")
    public ResponseEntity<?> getAllProvinces() {
        try {
            List<Province> provinces = locationService.getAllProvinces();
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/districts/{provinceId}")
    public ResponseEntity<?> getDistrictsByProvinceId(@PathVariable Integer provinceId) {
        try {
            List<District> districts = locationService.getDistrictsByProvinceId(provinceId);
            return ResponseEntity.ok(districts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/wards/{districtId}")
    public ResponseEntity<?> getWardsByDistrictId(@PathVariable Integer districtId) {
        try {
            List<Ward> wards = locationService.getWardsByDistrictId(districtId);
            return ResponseEntity.ok(wards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/district/{districtId}")
    public ResponseEntity<?> getDistrictById(@PathVariable Integer districtId) {
        try {
            District district = locationService.getDistrictById(districtId);
            return ResponseEntity.ok(district);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/ward/{wardId}")
    public ResponseEntity<?> getWardById(@PathVariable Integer wardId) {
        try {
            Ward ward = locationService.getWardById(wardId);
            return ResponseEntity.ok(ward);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/province/{provinceId}")
    public ResponseEntity<?> getProvinceById(@PathVariable Integer provinceId) {
        try {
            Province province = locationService.getProvinceById(provinceId);
            return ResponseEntity.ok(province);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}