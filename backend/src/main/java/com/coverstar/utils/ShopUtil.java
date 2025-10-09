package com.coverstar.utils;

import com.coverstar.component.mail.Mail;
import com.coverstar.component.mail.MailService;
import com.coverstar.entity.Account;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class ShopUtil {

    private static String imageDirectory = "C://Images//";

    public static String handleFileUpload(MultipartFile file, String type, Long id) throws Exception {
        String filePath = imageDirectory + type + File.separator + id;
        File directory = new File(filePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String fullPath = filePath + File.separator + file.getOriginalFilename();
        file.transferTo(new File(fullPath));
        return fullPath;
    }

    public static void sendMailPurchaseOrDiscount(Account account, String orderTitle,
                                        String subject, MailService mailService, Integer type
    ) throws MessagingException {
        try {
            if (account != null) {
                if (account.isNotificationPurchase() && type == 1) {
                    Map<String, Object> maps = new HashMap<>();
                    maps.put("fullName", account.getFirstName() + " " + account.getLastName());
                    maps.put("orderTitle", orderTitle);
                    maps.put("mainMail", "Cảm ơn quý khách đã ghé thăm VietShop");

                    Mail mail = new Mail();
                    mail.setFrom("postmaster@mg.iteacode.com");
                    mail.setSubject(subject);
                    mail.setTo(account.getEmail());
                    mail.setModel(maps);
                    mailService.sendEmailPurchase(mail);
                }

                if (account.isNotificationDiscount() && type == 2) {
                    Map<String, Object> maps = new HashMap<>();
                    maps.put("fullName", account.getFirstName() + " " + account.getLastName());
                    maps.put("orderTitle", orderTitle);
                    maps.put("mainMail", "Cảm ơn quý khách của cửa hàng VietShop");

                    Mail mail = new Mail();
                    mail.setFrom("postmaster@mg.iteacode.com");
                    mail.setSubject(subject);
                    mail.setTo(account.getEmail());
                    mail.setModel(maps);
                    mailService.sendEmailPurchase(mail);
                }
            }
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

}
