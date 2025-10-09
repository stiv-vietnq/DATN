package com.coverstar.service;

import com.coverstar.dto.AddressDto;
import com.coverstar.entity.Address;

import java.util.List;

public interface AddressService {
    Address createOrUpdateAddress(AddressDto addressDto) throws Exception;

    void deleteAddress(Long id);

    Address getAddressById(Long id);

    List<Address> getAddressByUserId(Long userId);

    Address updateDefaultAddress(Long id, Integer isDefault);

    Address getAddressByUserIdAndIsDefault(Long userId);
}
