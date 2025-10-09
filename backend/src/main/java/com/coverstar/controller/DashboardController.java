package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
                                              @RequestParam(required = false) Integer month) {
        try {
            Map<String, Object> statistics = dashboardService.getChartPurchase(type, year, month);
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
