package com.coverstar.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface DashboardService {
    Map<String, Object> getChartPurchase(String type, Integer year, Integer month, Date startDate, Date endDate) throws Exception;

    List<Object> getChartWidgets(Integer type);

    Map<String, Object> getRevenue(Integer type, Integer year, Integer month, Date start, Date end);

    Map<String, Object> getProductStats(
            Integer type, Integer year, Integer month, Date startDate, Date endDate, List<String> productIds) throws Exception;

    Map<String, Object> getProductDetailStats(Integer type, String productId,
                                        Integer year, Integer month,
                                        Date startDate, Date endDate) throws Exception;
}
