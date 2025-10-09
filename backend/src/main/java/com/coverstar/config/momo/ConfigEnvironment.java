package com.coverstar.config.momo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Configuration
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ConfigEnvironment {
    private PartnerInfo partnerInfo;
    private MoMoEndpoint endpoints;
    private String target;

    public ConfigEnvironment(MoMoEndpoint endpoints, PartnerInfo partnerInfo, EnvTarget target) {
        this(endpoints, partnerInfo, target.string());
    }

    public ConfigEnvironment(MoMoEndpoint momoEndpoint, PartnerInfo partnerInfo, String target) {
        this.endpoints = momoEndpoint;
        this.partnerInfo = partnerInfo;
        this.target = target;
    }

    public static ConfigEnvironment selectEnv(String target) throws IllegalArgumentException {
        switch (target) {
            case "dev":
                return selectEnv(EnvTarget.DEV);
            case "prod":
                return selectEnv(EnvTarget.PROD);
            default:
                throw new IllegalArgumentException("MoMo doesnt provide other application: dev and prod");
        }
    }

    public static ConfigEnvironment selectEnv(EnvTarget target) {
        try (InputStream input =
                     ConfigEnvironment.class.getClassLoader().getResourceAsStream("application.properties")) {
            Properties prop = new Properties();
            prop.load(input);

            switch (target) {
                case DEV:
                    MoMoEndpoint devEndpoint = new MoMoEndpoint(prop.getProperty("DEV_MOMO_ENDPOINT"),
                            prop.getProperty("CREATE_URL"),
                            prop.getProperty("REFUND_URL"),
                            prop.getProperty("QUERY_URL"),
                            prop.getProperty("CONFIRM_URL"),
                            prop.getProperty("TOKEN_PAY_URL"),
                            prop.getProperty("TOKEN_BIND_URL"),
                            prop.getProperty("TOKEN_INQUIRY_URL"),
                            prop.getProperty("TOKEN_DELETE_URL"));
                    PartnerInfo devInfo = new PartnerInfo(prop.getProperty("DEV_PARTNER_CODE"),
                            prop.getProperty("DEV_ACCESS_KEY"), prop.getProperty("DEV_SECRET_KEY"));
                    ConfigEnvironment dev = new ConfigEnvironment(devEndpoint, devInfo, target);
                    return dev;
                case PROD:
                    MoMoEndpoint prodEndpoint = new MoMoEndpoint(prop.getProperty("PROD_MOMO_ENDPOINT"),
                            prop.getProperty("CREATE_URL"),
                            prop.getProperty("REFUND_URL"),
                            prop.getProperty("QUERY_URL"),
                            prop.getProperty("CONFIRM_URL"),
                            prop.getProperty("TOKEN_PAY_URL"),
                            prop.getProperty("TOKEN_BIND_URL"),
                            prop.getProperty("TOKEN_INQUIRY_URL"),
                            prop.getProperty("TOKEN_DELETE_URL"));
                    PartnerInfo prodInfo = new PartnerInfo(prop.getProperty("PROD_PARTNER_CODE"),
                            prop.getProperty("PROD_ACCESS_KEY"), prop.getProperty("PROD_SECRET_KEY"));
                    ConfigEnvironment prod = new ConfigEnvironment(prodEndpoint, prodInfo, target);
                    return prod;
                default:
                    throw new IllegalArgumentException("MoMo doesnt provide other application: dev and prod");
            }

        } catch (FileNotFoundException e) {
            e.fillInStackTrace();
        } catch (IOException e) {
            e.fillInStackTrace();
        }
        return null;
    }

    public MoMoEndpoint getMomoEndpoint() {
        return endpoints;
    }

    public void setMomoEndpoint(MoMoEndpoint momoEndpoint) {
        this.endpoints = momoEndpoint;
    }

    public PartnerInfo getPartnerInfo() {
        return partnerInfo;
    }

    public void setPartnerInfo(PartnerInfo partnerInfo) {
        this.partnerInfo = partnerInfo;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public enum EnvTarget {
        DEV("development"), PROD("production");

        private String target;

        EnvTarget(String target) {
            this.target = target;
        }

        public String string() {
            return this.target;
        }
    }

    public enum ProcessType {
        PAY_GATE, APP_IN_APP, PAY_POS, PAY_QUERY_STATUS, PAY_REFUND, PAY_CONFIRM;

        public String getSubDir(Properties prop) {
            return prop.getProperty(this.toString());
        }
    }
}
