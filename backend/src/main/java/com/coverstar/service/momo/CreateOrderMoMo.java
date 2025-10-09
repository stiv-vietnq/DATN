package com.coverstar.service.momo;

import com.coverstar.config.momo.ConfigEnvironment;
import com.coverstar.constant.Constants;
import com.coverstar.constant.enums.Language;
import com.coverstar.constant.enums.RequestType;
import com.coverstar.dto.momos.HttpResponse;
import com.coverstar.dto.momos.PaymentRequest;
import com.coverstar.dto.momos.PaymentResponse;
import com.coverstar.exception.MoMoException;
import com.coverstar.utils.Encoder;
import com.coverstar.utils.LogUtils;
import org.springframework.stereotype.Service;

@Service
public class CreateOrderMoMo extends AbstractProcess<PaymentRequest, PaymentResponse> {

    public CreateOrderMoMo(ConfigEnvironment configEnvironment) {
        super(configEnvironment);
    }

    public static PaymentResponse process(ConfigEnvironment env, String orderId, String requestId,
                                          String amount, String orderInfo, String returnURL, String notifyURL,
                                          String extraData, RequestType requestType, Boolean autoCapture) {
        try {
            CreateOrderMoMo m2Processor = new CreateOrderMoMo(env);

            PaymentRequest request = m2Processor.createPaymentCreationRequest(orderId, requestId,
                    amount, orderInfo, returnURL, notifyURL, extraData, requestType, autoCapture);
            PaymentResponse captureMoMoResponse = m2Processor.execute(request);

            return captureMoMoResponse;
        } catch (Exception exception) {
            LogUtils.error("[CreateOrderMoMoProcess] "+ exception);
        }
        return null;
    }

    @Override
    public PaymentResponse execute(PaymentRequest request) {
        try {

            String payload = getGson().toJson(request, PaymentRequest.class);

            HttpResponse response = execute.sendToMoMo(configEnvironment.getMomoEndpoint().getCreateUrl(), payload);

            if (response.getStatus() != 200) {
                throw new MoMoException("[PaymentResponse] [" + request.getOrderId() + "] -> Error API");
            }

            PaymentResponse captureMoMoResponse = getGson().fromJson(response.getData(), PaymentResponse.class);
            String responseRawData = Constants.Parameter.REQUEST_ID + "=" + captureMoMoResponse.getRequestId() +
                    "&" + Constants.Parameter.ORDER_ID + "=" + captureMoMoResponse.getOrderId() +
                    "&" + Constants.Parameter.MESSAGE + "=" + captureMoMoResponse.getMessage() +
                    "&" + Constants.Parameter.PAY_URL + "=" + captureMoMoResponse.getPayUrl() +
                    "&" + Constants.Parameter.RESULT_CODE + "=" + captureMoMoResponse.getResultCode();

            LogUtils.info("[PaymentMoMoResponse] rawData: " + responseRawData);
            return captureMoMoResponse;

        } catch (Exception exception) {
            LogUtils.error("[PaymentMoMoResponse] "+ exception);
            throw new IllegalArgumentException("Invalid params capture MoMo Request");
        }
    }

    public PaymentRequest createPaymentCreationRequest(String orderId, String requestId, String amount, String orderInfo,
                                                       String returnUrl, String notifyUrl, String extraData,
                                                       RequestType requestType, Boolean autoCapture) {

        try {
            String requestRawData = new StringBuilder()
                    .append(Constants.Parameter.ACCESS_KEY).append("=").append(partnerInfo.getAccessKey()).append("&")
                    .append(Constants.Parameter.AMOUNT).append("=").append(amount).append("&")
                    .append(Constants.Parameter.EXTRA_DATA).append("=").append(extraData).append("&")
                    .append(Constants.Parameter.IPN_URL).append("=").append(notifyUrl).append("&")
                    .append(Constants.Parameter.ORDER_ID).append("=").append(orderId).append("&")
                    .append(Constants.Parameter.ORDER_INFO).append("=").append(orderInfo).append("&")
                    .append(Constants.Parameter.PARTNER_CODE).append("=").append(partnerInfo.getPartnerCode()).append("&")
                    .append(Constants.Parameter.REDIRECT_URL).append("=").append(returnUrl).append("&")
                    .append(Constants.Parameter.REQUEST_ID).append("=").append(requestId).append("&")
                    .append(Constants.Parameter.REQUEST_TYPE).append("=").append(requestType.getRequestType())
                    .toString();

            String signRequest = Encoder.signHmacSHA256(requestRawData, partnerInfo.getSecretKey());
            LogUtils.debug("[PaymentRequest] rawData: " + requestRawData + ", [Signature] -> " + signRequest);

            return new PaymentRequest(partnerInfo.getPartnerCode(), orderId, requestId, Language.EN, orderInfo,
                    Long.valueOf(amount), "test MoMo", null, requestType, returnUrl,
                    notifyUrl, "test store ID", extraData, null, autoCapture, null,
                    signRequest);
        } catch (Exception e) {
            LogUtils.error("[PaymentRequest] "+ e);
        }
        return null;
    }
}
