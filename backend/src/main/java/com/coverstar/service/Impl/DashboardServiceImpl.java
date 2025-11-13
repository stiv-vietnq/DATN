package com.coverstar.service.Impl;

import com.coverstar.repository.PurchaseRepository;
import com.coverstar.repository.UserVisitRepository;
import com.coverstar.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserVisitRepository userVisitsRepository;

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    public Map<String, Object> getChartPurchase(String type, Integer year, Integer month, Date startDate, Date endDate) throws Exception {
        try {
            Map<String, Object> result = new HashMap<>();
            if ("year".equalsIgnoreCase(type) && year != null) {
                List<Object[]> canceledOrders = purchaseRepository.getOrderCountByMonthAndYear(year, 5);
                List<Object[]> deliveredOrders = purchaseRepository.getOrderCountByMonthAndYear(year, 4);
                List<Integer> canceledCounts = new ArrayList<>(Collections.nCopies(12, 0));
                List<Integer> deliveredCounts = new ArrayList<>(Collections.nCopies(12, 0));

                List<String> labels = new ArrayList<>();
                for (int i = 1; i <= 12; i++) {
                    labels.add(String.valueOf(i));
                }

                for (Object[] record : canceledOrders) {
                    int monthIndex = (int) record[0] - 1;
                    canceledCounts.set(monthIndex, ((Number) record[1]).intValue());
                }
                for (Object[] record : deliveredOrders) {
                    int monthIndex = (int) record[0] - 1;
                    deliveredCounts.set(monthIndex, ((Number) record[1]).intValue());
                }

                result.put("canceled", canceledCounts);
                result.put("delivered", deliveredCounts);
                result.put("labels", labels);
            } else if ("month".equalsIgnoreCase(type) && year != null && month != null) {
                int daysInMonth = YearMonth.of(year, month).lengthOfMonth();
                List<Object[]> canceledOrders = purchaseRepository.getOrderCountByDayAndMonth(year, month, 5);
                List<Object[]> deliveredOrders = purchaseRepository.getOrderCountByDayAndMonth(year, month, 4);
                List<Integer> canceledCounts = new ArrayList<>(Collections.nCopies(daysInMonth, 0));
                List<Integer> deliveredCounts = new ArrayList<>(Collections.nCopies(daysInMonth, 0));

                List<String> labels = new ArrayList<>();
                for (int i = 1; i <= daysInMonth; i++) {
                    labels.add(String.valueOf(i));
                }

                for (Object[] record : canceledOrders) {
                    int dayIndex = (int) record[0] - 1;
                    canceledCounts.set(dayIndex, ((Number) record[1]).intValue());
                }
                for (Object[] record : deliveredOrders) {
                    int dayIndex = (int) record[0] - 1;
                    deliveredCounts.set(dayIndex, ((Number) record[1]).intValue());
                }

                result.put("canceled", canceledCounts);
                result.put("delivered", deliveredCounts);
                result.put("labels", labels);
            } else if ("range".equalsIgnoreCase(type) && startDate != null && endDate != null) {
                Calendar calStart = Calendar.getInstance();
                calStart.setTime(startDate);
                Calendar calEnd = Calendar.getInstance();
                calEnd.setTime(endDate);

                long days = 0;
                Calendar temp = (Calendar) calStart.clone();
                List<String> labels = new ArrayList<>();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                while (!temp.after(calEnd)) {
                    days++;
                    labels.add(sdf.format(temp.getTime()));
                    temp.add(Calendar.DAY_OF_MONTH, 1);
                }

                List<Integer> canceledCounts = new ArrayList<>(Collections.nCopies((int) days, 0));
                List<Integer> deliveredCounts = new ArrayList<>(Collections.nCopies((int) days, 0));

                List<Object[]> canceledOrders = purchaseRepository.getOrderCountByDateRange(startDate, endDate, 5);
                List<Object[]> deliveredOrders = purchaseRepository.getOrderCountByDateRange(startDate, endDate, 4);

                for (Object[] record : canceledOrders) {
                    Date date = (Date) record[0];
                    int count = ((Number) record[1]).intValue();
                    int index = (int) ((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                    canceledCounts.set(index, count);
                }
                for (Object[] record : deliveredOrders) {
                    Date date = (Date) record[0];
                    int count = ((Number) record[1]).intValue();
                    int index = (int) ((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                    deliveredCounts.set(index, count);
                }

                result.put("canceled", canceledCounts);
                result.put("delivered", deliveredCounts);
                result.put("labels", labels);
            }

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public List<Object> getChartWidgets(Integer type) {
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_YEAR, -6);
            Date sevenDaysAgo = calendar.getTime();
            Date today = new Date();
            calendar.add(Calendar.DAY_OF_YEAR, -7);
            Date fourteenDaysAgo = calendar.getTime();
            List<Object[]> recentResults = userVisitsRepository.findVisitCountsByDateRange(sevenDaysAgo, today, type);
            List<Object[]> pastResults = userVisitsRepository.findVisitCountsByDateRange(fourteenDaysAgo, sevenDaysAgo, type);
            List<Long> dataCount = new ArrayList<>();
            List<String> date = new ArrayList<>();
            List<Date> allDates = new ArrayList<>();
            calendar.setTime(today);
            for (int i = 0; i < 7; i++) {
                allDates.add(calendar.getTime());
                calendar.add(Calendar.DAY_OF_YEAR, -1);
            }
            for (int i = 0; i < 7; i++) {
                dataCount.add(0L);
                date.add(dateFormat.format(allDates.get(6 - i)));
            }
            for (Object[] row : recentResults) {
                Date visitDate = (Date) row[0];
                Long visitCount = (Long) row[1];

                for (int i = 0; i < allDates.size(); i++) {
                    if (isSameDay(allDates.get(i), visitDate)) {
                        dataCount.set(6 - i, visitCount);
                        break;
                    }
                }
            }
            long totalRecentVisits = dataCount.stream().mapToLong(Long::longValue).sum();
            long totalPastVisits = 0;
            for (Object[] row : pastResults) {
                totalPastVisits += (Long) row[1];
            }
            List<Object> response = new ArrayList<>();
            response.add(dataCount);
            response.add(date);
            response.add(totalRecentVisits);
            response.add(totalPastVisits);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    private boolean isSameDay(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);
        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(date2);

        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
    }
}
