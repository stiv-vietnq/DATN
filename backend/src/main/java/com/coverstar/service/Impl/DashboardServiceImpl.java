package com.coverstar.service.Impl;

import com.coverstar.repository.ProductDetailRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.repository.PurchaseRepository;
import com.coverstar.repository.UserVisitRepository;
import com.coverstar.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserVisitRepository userVisitsRepository;

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public Map<String, Object> getChartPurchase(String type, Integer year, Integer month, Date startDate, Date endDate) throws Exception {
        try {
            Map<String, Object> result = new HashMap<>();
            if ("year".equalsIgnoreCase(type) && year != null) {
                List<Object[]> canceledOrders = purchaseRepository.getOrderCountByMonthAndYear(year, 5);
                List<Object[]> deliveredOrders = purchaseRepository.getOrderCountByMonthAndYear(year, 4);
                List<Object[]> newOrders = purchaseRepository.getOrderCountByMonthAndYear(year, 1);
                List<Integer> canceledCounts = new ArrayList<>(Collections.nCopies(12, 0));
                List<Integer> deliveredCounts = new ArrayList<>(Collections.nCopies(12, 0));

                List<String> labels = new ArrayList<>();
                for (int i = 1; i <= 12; i++) {
                    labels.add("tháng" + i);
                }

                for (Object[] record : canceledOrders) {
                    int monthIndex = (int) record[0] - 1;
                    canceledCounts.set(monthIndex, ((Number) record[1]).intValue());
                }
                for (Object[] record : deliveredOrders) {
                    int monthIndex = (int) record[0] - 1;
                    deliveredCounts.set(monthIndex, ((Number) record[1]).intValue());
                }

                List<Integer> newCounts = new ArrayList<>(Collections.nCopies(12, 0));
                for (Object[] record : newOrders) {
                    int monthIndex = ((Number) record[0]).intValue() - 1; // tháng bắt đầu từ 1
                    int count = ((Number) record[1]).intValue();
                    newCounts.set(monthIndex, count);
                }

                result.put("canceled", canceledCounts);
                result.put("delivered", deliveredCounts);
                result.put("new", newCounts);
                result.put("labels", labels);
            } else if ("month".equalsIgnoreCase(type) && year != null && month != null) {
                int daysInMonth = YearMonth.of(year, month).lengthOfMonth();
                List<Object[]> canceledOrders = purchaseRepository.getOrderCountByDayAndMonth(year, month, 5);
                List<Object[]> deliveredOrders = purchaseRepository.getOrderCountByDayAndMonth(year, month, 4);
                List<Object[]> newOrders = purchaseRepository.getOrderCountByDayAndMonth(year, month, 1);
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

                List<Integer> newCounts = new ArrayList<>(Collections.nCopies(daysInMonth, 0));

                for (Object[] record : newOrders) {
                    int dayIndex = ((Number) record[0]).intValue() - 1; // ngày bắt đầu từ 1
                    int count = ((Number) record[1]).intValue();
                    newCounts.set(dayIndex, count);
                }

                result.put("canceled", canceledCounts);
                result.put("delivered", deliveredCounts);
                result.put("new", newCounts);
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
                List<Object[]> newOrders = purchaseRepository.getOrderCountByDateRange(startDate, endDate, 1);

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

                List<Integer> newCounts = new ArrayList<>(Collections.nCopies((int) days, 0));
                for (Object[] record : newOrders) {
                    Date date = (Date) record[0];
                    int count = ((Number) record[1]).intValue();
                    int index = (int) ((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                    newCounts.set(index, count);
                }

                result.put("new", newCounts);
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

    @Override
    public Map<String, Object> getRevenue(Integer type, Integer year, Integer month, Date fromDate, Date toDate) {
        try {
            Map<String, Object> result = new HashMap<>();
            List<String> labels = new ArrayList<>();
            List<BigDecimal> revenues = new ArrayList<>();
            List<BigDecimal> growthPercent = new ArrayList<>();

            // CASE 1: RANGE DATE
            if (type == 1) {
                List<Date> allDates = getDatesBetween(fromDate, toDate);
                for (Date d : allDates) {
                    labels.add(dateFormat.format(d));
                    revenues.add(BigDecimal.ZERO);
                    growthPercent.add(BigDecimal.ZERO);
                }

                List<Object[]> dbResult = purchaseRepository.getRevenueByDateRange(fromDate, toDate);

                for (Object[] row : dbResult) {
                    Date d = (Date) row[0];
                    BigDecimal amount = (BigDecimal) row[1];
                    for (int i = 0; i < allDates.size(); i++) {
                        if (isSameDay(allDates.get(i), d)) {
                            revenues.set(i, amount);
                            break;
                        }
                    }
                }

                // Tính growthPercent
                for (int i = 1; i < revenues.size(); i++) {
                    BigDecimal prev = revenues.get(i - 1);
                    BigDecimal curr = revenues.get(i);
                    if (prev.compareTo(BigDecimal.ZERO) == 0) {
                        growthPercent.set(i, BigDecimal.ZERO);
                    } else {
                        growthPercent.set(i, curr.subtract(prev).divide(prev, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
                    }
                }

                result.put("labels", labels);
                result.put("revenues", revenues);
                result.put("growthPercent", growthPercent);
                return result;
            }

            // CASE 2: MONTH
            if (type == 2) {
                Calendar cal = Calendar.getInstance();
                cal.set(year, month - 1, 1);
                int daysInMonth = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

                for (int d = 1; d <= daysInMonth; d++) {
                    labels.add(String.valueOf(d));
                    revenues.add(BigDecimal.ZERO);
                    growthPercent.add(BigDecimal.ZERO);
                }

                Date start = getStartOfMonth(year, month);
                Date end = getEndOfMonth(year, month);
                List<Object[]> dbResult = purchaseRepository.getRevenueByDateRange(start, end);

                for (Object[] row : dbResult) {
                    Calendar c = Calendar.getInstance();
                    c.setTime((Date) row[0]);
                    int day = c.get(Calendar.DAY_OF_MONTH);
                    revenues.set(day - 1, (BigDecimal) row[1]);
                }

                for (int i = 1; i < revenues.size(); i++) {
                    BigDecimal prev = revenues.get(i - 1);
                    BigDecimal curr = revenues.get(i);
                    if (prev.compareTo(BigDecimal.ZERO) == 0) {
                        growthPercent.set(i, BigDecimal.ZERO);
                    } else {
                        growthPercent.set(i, curr.subtract(prev).divide(prev, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
                    }
                }

                result.put("labels", labels);
                result.put("revenues", revenues);
                result.put("growthPercent", growthPercent);
                return result;
            }

            // CASE 3: YEAR
            if (type == 3) {
                for (int m = 1; m <= 12; m++) {
                    labels.add("Tháng " + m);
                    revenues.add(BigDecimal.ZERO);
                    growthPercent.add(BigDecimal.ZERO);
                }

                List<Object[]> dbResult = purchaseRepository.getRevenueOfYear(year);

                for (Object[] row : dbResult) {
                    Integer m = (Integer) row[0];
                    BigDecimal amount = (BigDecimal) row[1];
                    revenues.set(m - 1, amount);
                }

                for (int i = 1; i < revenues.size(); i++) {
                    BigDecimal prev = revenues.get(i - 1);
                    BigDecimal curr = revenues.get(i);
                    if (prev.compareTo(BigDecimal.ZERO) == 0) {
                        growthPercent.set(i, BigDecimal.ZERO);
                    } else {
                        growthPercent.set(i, curr.subtract(prev).divide(prev, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
                    }
                }

                result.put("labels", labels);
                result.put("revenues", revenues);
                result.put("growthPercent", growthPercent);
                return result;
            }

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Map<String, Object> getProductStats(
            Integer type, Integer year, Integer month, Date startDate, Date endDate, List<String> productIds) {

        Map<String, Object> result = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Long> quantitySoldList = new ArrayList<>();
        List<Long> stockList = new ArrayList<>();

        List<Object[]> productResult;
        List<Object[]> detailResult;

        switch (type) {
            case 1: // RANGE DATE
                if (CollectionUtils.isEmpty(productIds)) {
                    productResult = productRepository.getProductStatsByDateRangeProductNoProductId(startDate, endDate);
                    detailResult = productDetailRepository.getProductStatsByDateRangeDetailNoProductId(startDate, endDate);
                } else {
                    productResult = productRepository.getProductStatsByDateRangeProduct(startDate, endDate, productIds);
                    detailResult = productDetailRepository.getProductStatsByDateRangeDetail(startDate, endDate, productIds);
                }
                break;
            case 2: // MONTH
                if (CollectionUtils.isEmpty(productIds)) {
                    productResult = productRepository.getProductStatsByMonthProductNoProductId(year, month);
                    detailResult = productDetailRepository.getProductStatsByMonthDetailNoProductId(year, month);
                } else {
                    productResult = productRepository.getProductStatsByMonthProduct(year, month, productIds);
                    detailResult = productDetailRepository.getProductStatsByMonthDetail(year, month, productIds);
                }
                break;
            case 3: // YEAR
                if (CollectionUtils.isEmpty(productIds)) {
                    productResult = productRepository.getProductStatsByYearNoProductId(year);
                    detailResult = productDetailRepository.getProductStatsByYearDetailNoProductId(year);
                } else {
                    productResult = productRepository.getProductStatsByYear(year, productIds);
                    detailResult = productDetailRepository.getProductStatsByYearDetail(year, productIds);
                }
                break;
            default:
                return result;
        }

        Map<String, Long> soldMap = productResult.stream()
                .collect(Collectors.toMap(
                        r -> (String) r[0],
                        r -> r[1] != null ? ((Number) r[1]).longValue() : 0L,
                        Long::sum
                ));

        Map<String, Long> stockMap = detailResult.stream()
                .collect(Collectors.toMap(
                        r -> (String) r[0],
                        r -> r[1] != null ? ((Number) r[1]).longValue() : 0L,
                        Long::sum
                ));

        Set<String> allProductNames = new LinkedHashSet<>();
        allProductNames.addAll(soldMap.keySet());
        allProductNames.addAll(stockMap.keySet());

        for (String productName : allProductNames) {
            labels.add(productName);
            quantitySoldList.add(soldMap.getOrDefault(productName, 0L));
            stockList.add(stockMap.getOrDefault(productName, 0L));
        }
        result.put("labels", labels);
        result.put("quantitySold", quantitySoldList);
        result.put("stock", stockList);
        return result;
    }


    private List<Date> getDatesBetween(Date start, Date end) {
        List<Date> dates = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        cal.setTime(start);

        while (!cal.getTime().after(end)) {
            dates.add(cal.getTime());
            cal.add(Calendar.DAY_OF_YEAR, 1);
        }
        return dates;
    }

    private Date getStartOfMonth(int year, int month) {
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, 1, 0, 0, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    private Date getEndOfMonth(int year, int month) {
        Calendar cal = Calendar.getInstance();
        cal.set(year, month - 1, 1, 23, 59, 59);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        cal.set(Calendar.MILLISECOND, 999);
        return cal.getTime();
    }

    @Override
    public Map<String, Object> getProductDetailStats(Integer type, String productId,
                                               Integer year, Integer month,
                                               Date startDate, Date endDate) {
        Map<String, Object> result = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Long> quantitySoldList = new ArrayList<>();
        List<Long> stockList = new ArrayList<>();

        List<Object[]> rows;

        switch (type) {
            case 1: // RANGE DATE
                rows = productDetailRepository.getProductDetailByDate(productId, startDate, endDate);
                break;
            case 2: // MONTH
                if (year == null || month == null) return result;
                rows = productDetailRepository.getProductDetailByMonth(productId, year, month);
                break;
            case 3: // YEAR
                if (year == null) return result;
                rows = productDetailRepository.getProductDetailByYear(productId, year);
                break;
            default:
                return result;
        }

        for (Object[] row : rows) {
            String name = (String) row[0];
            Long sold = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            Long stock = row[2] != null ? ((Number) row[2]).longValue() : 0L;

            labels.add(name);
            quantitySoldList.add(sold);
            stockList.add(stock);
        }

        result.put("labels", labels);
        result.put("quantitySold", quantitySoldList);
        result.put("stock", stockList);

        return result;
    }
}
