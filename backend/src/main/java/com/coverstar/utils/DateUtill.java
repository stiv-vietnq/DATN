package com.coverstar.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;

public class DateUtill {
    private static final String DEFAULT_DATE_FORMAT = "dd/MM/yyyy";

    /**
     * Parses a date string in the specified format to a Date object.
     *
     * @param dateString the date string to parse (e.g., "15/12/2025").
     * @param format     the date format (e.g., "dd/MM/yyyy").
     * @return a Date object representing the parsed date, or null if parsing fails.
     */
    public static Date parseDate(String dateString, String format) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
            LocalDate localDate = LocalDate.parse(dateString, formatter);
            return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        } catch (DateTimeParseException e) {
            e.fillInStackTrace();
            return null;
        }
    }

    /**
     * Parses a date string in the default format ("dd/MM/yyyy") to a Date object.
     *
     * @param dateString the date string to parse (e.g., "15/12/2025").
     * @return a Date object representing the parsed date, or null if parsing fails.
     */
    public static Date parseDate(String dateString) {
        return parseDate(dateString, DEFAULT_DATE_FORMAT);
    }

    public static LocalDateTime toStartOfDay(String date) {
        return (date == null || date.isEmpty()) ? null :
                LocalDate.parse(date).atStartOfDay(); // 00:00:00.000
    }

    public static LocalDateTime toEndOfDay(String date) {
        return (date == null || date.isEmpty()) ? null :
                LocalDate.parse(date).atTime(LocalTime.MAX); // 23:59:59.999
    }
}
