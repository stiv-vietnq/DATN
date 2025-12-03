package com.coverstar.service.Impl;

import com.coverstar.constant.Constants;
import com.coverstar.dto.AddressDto;
import com.coverstar.entity.Address;
import com.coverstar.repository.AddressRepository;
import com.coverstar.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Address createOrUpdateAddress(AddressDto addressDto) throws Exception {
        try {
            Address address = new Address();
            if (addressDto.getId() != null) {
                address = addressRepository.getById(addressDto.getId());
                if (address != null) {
                    address.setUpdatedDate(new Date());
                } else {
                    throw new Exception(Constants.ADDRESS_NOT_FOUND);
                }
            } else {
                address.setCreatedDate(new Date());
                address.setUpdatedDate(new Date());
            }
            address.setAddress(addressDto.getAddress());
            address.setFullName(addressDto.getFullName());
            address.setPhoneNumber(addressDto.getPhoneNumber());
            address.setUserId(addressDto.getUserId());
            address.setDefaultValue(addressDto.getDefaultValue());
            address.setProvinceId(addressDto.getProvinceId());
            address.setDistrictId(addressDto.getDistrictId());
            address.setWardId(addressDto.getWardId());
            address.setType(addressDto.getType());
            return addressRepository.save(address);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteAddress(Long id) {
        try {
            addressRepository.deleteById(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Address getAddressById(Long id) {
        try {
            return addressRepository.findById(id).orElse(null);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public List<Address> getAddressByUserId(Long userId) {
        try {
            return addressRepository.findByUserId(userId);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public Address updateDefaultAddress(Long id, Integer isDefault) {
        try {
            Address address = addressRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            if (isDefault == 1) {
                List<Address> otherAddresses = addressRepository
                        .findByUserIdAndIdNot(address.getUserId(), id);

                otherAddresses.forEach(a -> a.setDefaultValue(0));
                addressRepository.saveAll(otherAddresses);
            }

            address.setDefaultValue(isDefault);
            return addressRepository.save(address);

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }


    @Override
    public Address getAddressByUserIdAndIsDefault(Long userId) {
        try {
            return addressRepository.findByUserIdAndDefault(userId, 1);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}
