package com.ecommerce.project.service;

import com.ecommerce.project.config.VNPayConfig;
import com.ecommerce.project.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {

    public String createPaymentUrl(Long orderId, double amount, String orderInfo, HttpServletRequest request) {
        try {
            // Convert USD to VND (1 USD = 25,000 VND)
            // Then convert to smallest unit (multiply by 100 for VNPay)
            long amountInVND = (long) (amount * 25000 * 100); // USD -> VND -> smallest unit

            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Version", VNPayConfig.VNP_VERSION);
            vnpParams.put("vnp_Command", VNPayConfig.VNP_COMMAND);
            vnpParams.put("vnp_TmnCode", VNPayConfig.VNP_TMN_CODE);
            vnpParams.put("vnp_Amount", String.valueOf(amountInVND));
            vnpParams.put("vnp_CurrCode", VNPayConfig.VNP_CURRENCY_CODE);
            vnpParams.put("vnp_TxnRef", String.valueOf(orderId));
            vnpParams.put("vnp_OrderInfo", orderInfo);
            vnpParams.put("vnp_OrderType", VNPayConfig.VNP_ORDER_TYPE);
            vnpParams.put("vnp_Locale", VNPayConfig.VNP_LOCALE);
            vnpParams.put("vnp_ReturnUrl", VNPayConfig.VNP_RETURN_URL);
            vnpParams.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

            // Create timestamp
            Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnpCreateDate = formatter.format(calendar.getTime());
            vnpParams.put("vnp_CreateDate", vnpCreateDate);

            // Expire time: 15 minutes
            calendar.add(Calendar.MINUTE, 15);
            String vnpExpireDate = formatter.format(calendar.getTime());
            vnpParams.put("vnp_ExpireDate", vnpExpireDate);

            // Build hash data
            String queryString = VNPayUtil.buildQueryString(vnpParams);
            String secureHash = VNPayUtil.hmacSHA512(VNPayConfig.VNP_HASH_SECRET, queryString);
            
            // Build final payment URL
            String paymentUrl = VNPayConfig.VNP_PAY_URL + "?" + queryString + "&vnp_SecureHash=" + secureHash;

            return paymentUrl;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, String> processCallback(Map<String, String> params) {
        Map<String, String> result = new HashMap<>();
        
        try {
            // Get secure hash from params
            String vnpSecureHash = params.get("vnp_SecureHash");
            
            // Remove hash params for validation
            params.remove("vnp_SecureHash");
            params.remove("vnp_SecureHashType");
            
            // Build hash data from callback params
            String signValue = VNPayUtil.hmacSHA512(VNPayConfig.VNP_HASH_SECRET, VNPayUtil.buildQueryString(params));
            
            if (signValue.equals(vnpSecureHash)) {
                String responseCode = params.get("vnp_ResponseCode");
                if ("00".equals(responseCode)) {
                    result.put("status", "success");
                    result.put("message", "Payment successful");
                } else {
                    result.put("status", "failed");
                    result.put("message", "Payment failed");
                }
                result.put("orderId", params.get("vnp_TxnRef"));
                result.put("amount", params.get("vnp_Amount"));
                result.put("transactionNo", params.get("vnp_TransactionNo"));
                result.put("responseCode", responseCode);
            } else {
                result.put("status", "invalid");
                result.put("message", "Invalid signature");
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
        }
        
        return result;
    }
}
