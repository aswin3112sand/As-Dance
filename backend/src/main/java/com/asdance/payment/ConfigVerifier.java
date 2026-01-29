package com.asdance.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class ConfigVerifier implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ConfigVerifier.class);

    @Value("${app.razorpay.keyId:NOT_SET}")
    private String razorpayKeyId;

    @Value("${spring.datasource.url:NOT_SET}")
    private String datasourceUrl;

    private final Environment env;

    public ConfigVerifier(Environment env) {
        this.env = env;
    }

    @Override
    public void run(String... args) {
        logger.info("================ CONFIGURATION CHECK ================");
        logger.info("Active Profiles: {}", Arrays.toString(env.getActiveProfiles()));
        logger.info("Razorpay Key ID: {}", maskKey(razorpayKeyId));
        logger.info("Database URL:    {}", datasourceUrl);
        logger.info("=====================================================");
    }

    private String maskKey(String value) {
        if (value == null || value.isBlank() || "NOT_SET".equals(value)) {
            return "NOT_SET";
        }
        int len = value.length();
        if (len <= 8) {
            return "****";
        }
        return value.substring(0, 4) + "..." + value.substring(len - 4);
    }
}
