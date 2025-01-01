const axios = require('axios');
const crypto = require('crypto');
const Order = require('../Model/order');
const mongoose = require('mongoose');

exports.paymentController = async(req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    let orderTotal;
    const { orderID } = req.body;
    console.log(orderID);
    if (!mongoose.Types.ObjectId.isValid(orderID)) {
      console.log('Invalid Order ID');
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }
    try {
      const order = await Order.findById(orderID);
      if(!order) {
        console.log('Order not found');
        return;
      }
      if (orderTotal <1000) {
        console.log("Order total is less than 1000 or not an integer");
        return res.status(400).json({ message: "Order total must be at least 1000"});
      } else if ( !Number.isInteger(orderTotal)) {
        orderTotal= Math.round(orderTotal);
      }
      orderTotal = order.total;
      console.log(orderTotal);
    }catch(error) {
      console.log(error);
    }

  
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    //var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var redirectUrl = 'http://localhost:3000/';
    var ipnUrl = 'https://a1d7-2402-800-61ce-def-a571-2d31-d1f-69d1.ngrok-free.app/api/paymemtCallBack';
    var requestType = "payWithMethod";
    var amount = orderTotal;   //get from order
    var orderId = orderID;     //get from req.body
    var requestId = orderId;
    var extraData ='';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });
    
    //axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }

    let result;
    try {
        result = await axios(options);
        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json(error.response.data);
    }

}

exports.callbackController = async(req, res) => {
     /**
    resultCode = 0: giao dịch thành công.
    resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
    resultCode <> 0: giao dịch thất bại.
   */
    console.log('callback: ');
    console.log(req.body);

    const { orderId, resultCode } = req.body;

    
    try {
      if (resultCode === 0) {
          // Update payment status if the transaction was successful
         const updatedOrder =  await Order.findOneAndUpdate(
              { _id: orderId },
              { paymentStatus: 'Successful' },
              { new: true }
          );
         if(!updatedOrder) {
          return res.status(404).json({message: "Order not found!"})
         }
      }
          return res.status(200).json({ message: 'Callback received', body: req.body});
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ message: 'Error processing callback' , error: error.message });
    }

      /**
   * Dựa vào kết quả này để update trạng thái đơn hàng
   * Kết quả log:
   * {
        partnerCode: 'MOMO',
        orderId: 'MOMO1712108682648',
        requestId: 'MOMO1712108682648',
        amount: 10000,
        orderInfo: 'pay with MoMo',
        orderType: 'momo_wallet',
        transId: 4014083433,
        resultCode: 0,
        message: 'Thành công.',
        payType: 'qr',
        responseTime: 1712108811069,
        extraData: '',
        signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
      }
   */
}

exports.checkPaymentStatus = async(req,res) => {
    const { orderId } = req.body;

    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var accessKey = 'F8BBA842ECF85';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    });
  
    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };
    
    
    try {
      const result = await axios(options);
      const { resultCode } = result.data;
      console.log(resultCode);
      if (resultCode === 0) {
        // Update payment status if the transaction was successful
        const updatedOrder =  await Order.findOneAndUpdate(
            { _id: orderId },
            { paymentStatus: 'Successful' },
            { new: true }
        );
        console.log("Thanh toan thanh cong!");
        if(!updatedOrder) {
          return res.status(404).json({message: "Order not found!"})
        }
      }else {
        console.log("Thanh toan khong thanh cong");
      }
        
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
    }
}