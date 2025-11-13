package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.service.DashboardService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("dashboards")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;


    @GetMapping("/getChartPurchase")
    public ResponseEntity<?> getChartPurchase(@RequestParam String type,
                                              @RequestParam(required = false) Integer year,
                                              @RequestParam(required = false) Integer month,
                                              @RequestParam(required = false) String startDate,
                                              @RequestParam(required = false) String endDate) {
        try {
            Date start = null;
            Date end = null;
            if (StringUtils.isNotEmpty(startDate) && StringUtils.isNotEmpty(endDate)) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                start = dateFormat.parse(startDate);
                end = dateFormat.parse(endDate);
            }
            Map<String, Object> statistics = dashboardService.getChartPurchase(type, year, month, start, end);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @GetMapping("/getChartWidgets")
    public ResponseEntity<?> getChartWidgets(@RequestParam Integer type) {
        try {
            List<Object> statistics = dashboardService.getChartWidgets(type);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

}
