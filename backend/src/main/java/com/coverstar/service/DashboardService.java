package com.coverstar.service;

import java.util.List;
import java.util.Map;

public interface DashboardService {
    Map<String, Object> getChartPurchase(String type, Integer year, Integer month);

    List<Object> getChartWidgets(Integer type);
}
