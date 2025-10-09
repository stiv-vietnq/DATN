package com.coverstar.service.Impl;

import com.coverstar.constant.Constants;
import com.coverstar.dto.ShippingMethodDto;
import com.coverstar.entity.Product;
import com.coverstar.entity.ShippingMethod;
import com.coverstar.repository.ShippingMethodRepository;
import com.coverstar.service.ShippingMethodService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ShippingMethodServiceImpl implements ShippingMethodService {

    @Autowired
    private ShippingMethodRepository shippingMethodRepository;

    @Override
    public List<ShippingMethod> getAllShippingMethod(String name) {
        try {
            String nameValue = name != null ? name : StringUtils.EMPTY;
            List<ShippingMethod> shippingMethods = shippingMethodRepository.findAllByConditions(nameValue);
            return shippingMethods;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public ShippingMethod createOrUpdate(ShippingMethodDto shippingMethodDto) throws Exception {
        try {
            ShippingMethod shippingMethod = new ShippingMethod();
            if (shippingMethodDto.getId() != null) {
                shippingMethod = shippingMethodRepository.findById(shippingMethodDto.getId()).orElse(null);
                if (shippingMethod == null) {
                    throw new Exception(Constants.DUPLICATE_SHIPPING);
                }
                shippingMethod.setUpdatedDate(new Date());
            } else {
                shippingMethod.setCreatedDate(new Date());
                shippingMethod.setUpdatedDate(new Date());
            }
            shippingMethod.setName(shippingMethodDto.getName());
            shippingMethod.setPrice(shippingMethodDto.getPrice());
            shippingMethod.setType(shippingMethodDto.getType());
            shippingMethodRepository.save(shippingMethod);
            return shippingMethod;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void delete(Long id) throws Exception {
        try {
            ShippingMethod shippingMethod = shippingMethodRepository.findById(id).orElse(null);
            if (shippingMethod == null) {
                throw new Exception(Constants.DUPLICATE_SHIPPING);
            }
            for (Product product : shippingMethod.getProducts()) {
                product.getShippingMethods().remove(shippingMethod);
            }
            shippingMethod.getProducts().clear();
            shippingMethodRepository.delete(shippingMethod);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public ShippingMethod getShippingMethodById(Long id) throws Exception {
        try {
            ShippingMethod shippingMethod = shippingMethodRepository.findById(id).orElse(null);
            if (shippingMethod == null) {
                throw new Exception(Constants.DUPLICATE_SHIPPING);
            }
            return shippingMethod;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}
