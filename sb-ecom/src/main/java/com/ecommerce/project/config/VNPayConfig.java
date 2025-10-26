package com.ecommerce.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VNPayConfig {
    
    public static final String VNP_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    
    @Value("${VNPAY_RETURN_URL:http://localhost:8080/api/payment/vnpay/callback}")
    private String vnpReturnUrl;
    
    @Value("${VNPAY_TMN_CODE:TSPYPMGW}")
    private String vnpTmnCode;
    
    @Value("${VNPAY_HASH_SECRET:9RNCXLEJ6D5GQFPY7AAPXNDBY8RHPL4U}")
    private String vnpHashSecret;
    
    public static final String VNP_VERSION = "2.1.0";
    public static final String VNP_COMMAND = "pay";
    public static final String VNP_ORDER_TYPE = "other";
    public static final String VNP_LOCALE = "vn";
    public static final String VNP_CURRENCY_CODE = "VND";
    
    // Getter methods (Spring không thể inject vào static fields trực tiếp)
    public String getVnpReturnUrl() {
        return vnpReturnUrl;
    }
    
    public String getVnpTmnCode() {
        return vnpTmnCode;
    }
    
    public String getVnpHashSecret() {
        return vnpHashSecret;
    }
    
    // Static accessors for backward compatibility
    public static String VNP_RETURN_URL;
    public static String VNP_TMN_CODE;
    public static String VNP_HASH_SECRET;
    
    @Value("${VNPAY_RETURN_URL:http://localhost:8080/api/payment/vnpay/callback}")
    public void setStaticVnpReturnUrl(String url) {
        VNP_RETURN_URL = url;
    }
    
    @Value("${VNPAY_TMN_CODE:TSPYPMGW}")
    public void setStaticVnpTmnCode(String code) {
        VNP_TMN_CODE = code;
    }
    
    @Value("${VNPAY_HASH_SECRET:9RNCXLEJ6D5GQFPY7AAPXNDBY8RHPL4U}")
    public void setStaticVnpHashSecret(String secret) {
        VNP_HASH_SECRET = secret;
    }
}
