"use client";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { formatPrice } from "@/utils/functionShare";
import { handleAddOrderAction } from "@/utils/actions";
import { handleAddOrderServices } from "@/utils/services";
import { useRouter } from "next/navigation";
import { message } from "antd";
import HomeStripe from "@/app/stripe/HomeStripe";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  boxShadow: "none",
  border: "1px solid #ccc",
  borderRadius: "0px",
  width: "100%",
  fontWeight: 700,
  fontSize: "16px",
}));

interface Icart {
  _id: string;
  items: IcartItem[];
  total: number;
}

interface IcartItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  size: string;
  _id: string;
}

const MainPay = () => {
  const router = useRouter();
  const [value, setValue] = React.useState("TM");
  const [helperText, setHelperText] = React.useState("");

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [isErrorName, setIsErrorName] = useState<boolean>(false);
  const [isErrorEmail, setIsErrorEmail] = useState<boolean>(false);
  const [isErrorPhone, setIsErrorPhone] = useState<boolean>(false);
  const [isErrorAddress, setIsErrorAddress] = useState<boolean>(false);

  const [errorName, setErrorName] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPhone, setErrorPhone] = useState<string>("");
  const [errorAddress, setErrorAddress] = useState<string>("");

  const [isOpenStripe, setIsOpenStripe] = useState<boolean>(false);
  const [isPaymentMOMO, setIsPaymentMOMO] = useState<boolean>(false);
  const [loadingMOMO, setLoadingMOMO] = useState<boolean>(false);

  const [cart, setCart] = useState<Icart | null>(null);
  const [order, setOrder] = useState<string | null>(null);

  const [paymentSuccess, setPaymentSuccess] = useState(false); // Track if payment is successful
  const pollingInterval = useRef<number | NodeJS.Timeout | null>(null);

  const getCart = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3002/api/carts/cartId", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem("totalPrice", data?.total);
      //console.log("cart data: " + JSON.stringify(data));
      setCart(data);
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  }, []);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleCheck = () => {
    setIsErrorName(false);
    setIsErrorEmail(false);
    setIsErrorPhone(false);
    setIsErrorAddress(false);

    setErrorName("");
    setErrorEmail("");
    setErrorPhone("");
    setErrorAddress("");

    if (!name) {
      setIsErrorName(true);
      setErrorName("Name is not empty.");
      return false;
    }

    if (!address) {
      setIsErrorAddress(true);
      setErrorAddress("Address is not empty.");
      return false;
    }

    if (!phone) {
      setIsErrorPhone(true);
      setErrorPhone("Phone is not empty.");
      return false;
    }
    return true;
  };

  const handleAddOrder = async () => {
    if (!cart) return;
    const res = await handleAddOrderServices();
    try {
      const data = await res.json();
      console.log("orderID đã được tạo: " + data);
      alert("Đặt hàng thành công");
      setOrder(data._id);
      router.push("/");
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    if (res) {
      //if (value == "TM") router.push("/");
    } else {
      message.error("Đặt hàng không thành công");
    }
  };

  const handleAddOrderMOMO = async () => {
    if (!cart) return;
    const res = await handleAddOrderServices();
    try {
      const data = await res.json();
      setOrder(data);
      console.log("orderID đã được tạo: " + data);
      await MOMOpayurl(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    if (res) {
      //if (value == "TM") router.push("/");
    } else {
      message.error("Đặt hàng không thành công");
    }
  };

  const handleSubmit = async () => {
    if ((await handleCheck()) == false) return;
    await handleAddOrder();
  };

  const handleSubmitMOMO = async () => {
    if ((await handleCheck()) == false) return;
    setLoadingMOMO(true);
    await handleAddOrderMOMO();
  };

  const MOMOpayurl = async (orderId: string) => {
    try {
      const response = await fetch("http://localhost:3002/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID: orderId }), // Wrap orderId in an object
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from /api/payment:", errorData);
        message.error("Lỗi thanh toán, vui lòng thử lại.");
        setLoadingMOMO(false);
        return;
      }

      const data = await response.json();
      //console.log('Payment response:', data);

      if (data && data.payUrl) {
        localStorage.setItem("momoPayUrl", data.payUrl);
        window.open(data.payUrl, "_blank");
        // Start polling for payment status
        startPollingPaymentStatus(orderId);
      } else {
        message.error("Không tìm thấy URL thanh toán");
        setLoadingMOMO(false);
      }
    } catch (error) {
      console.error("Error during payment request:", error);
      message.error("Lỗi thanh toán, vui lòng thử lại.");
      setLoadingMOMO(false);
    }
  };

  const startPollingPaymentStatus = (orderId: string) => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    pollingInterval.current = setInterval(async () => {
      await checkPaymentStatus(orderId);
    }, 3000) as unknown as number; // Poll every 3 seconds
  };

  const checkPaymentStatus = async (orderId: string) => {
    if (!orderId) {
      console.error("No orderId provided for payment status check.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/paymentStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: orderId }),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Error checking payment status:", response.statusText);
        // message.error("Lỗi kiểm tra trạng thái thanh toán.");
        return;
      }

      const data = await response.json();
      //console.log('Payment status data:', data);
      if (data && data.resultCode === 0) {
        setPaymentSuccess(true);
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current as number);
        }
        pollingInterval.current = null;
        setLoadingMOMO(false);
        console.log("Thanh toán thành công.");
        localStorage.removeItem("momoPayUrl");
      } else {
        console.log("Payment not yet success");
        // Stop polling if the payment failed or is canceled
        //message.error("Thanh toán không thành công.");
        //clearInterval(pollingInterval.current);
        // pollingInterval.current = null;
        // setLoadingMOMO(false);
      }
    } catch (error) {
      console.error("Error during payment status check:", error);
      // message.error("Lỗi kiểm tra trạng thái thanh toán, vui lòng thử lại.");
    }
  };

  const handleReopenMomoPayment = () => {
    const storedPayUrl = localStorage.getItem("momoPayUrl");
    if (storedPayUrl && order) {
      window.open(storedPayUrl, "_blank");
      startPollingPaymentStatus(order);
      setLoadingMOMO(true);
    } else {
      handleSubmitMOMO();
    }
  };
  useEffect(() => {
    if (paymentSuccess) {
      const timeoutId = setTimeout(() => {
        router.push("/");
      }, 50000000);
      return () => clearTimeout(timeoutId);
    }
  }, [paymentSuccess, router]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    if (value === "TM") {
      setHelperText("Trả tiền mặt khi giao hàng");
      setIsOpenStripe(false);
      setIsPaymentMOMO(false);
    } else if (value === "CK") {
      setIsOpenStripe(true);
      setIsPaymentMOMO(false);
      setHelperText(
        "Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi." +
          "Đơn hàng sẽ đươc giao sau khi tiền đã chuyển."
      );
    } else if (value === "MOMO") {
      setIsOpenStripe(false);
      setIsPaymentMOMO(true);
      setHelperText(
        "Thực hiện thanh toán bằng MoMo thuận tiện đơn giản." +
          " Đơn hàng sẽ được gửi ghi thanh toán thành công."
      );
    }
  }, [value]);

  return (
    <Grid container spacing={4}>
      {paymentSuccess ? (
        <Grid item xs={12}>
          <Typography variant="h6" color="green" sx={{ textAlign: "center" }}>
            Thanh toán thành công. Cảm ơn quý khách đã sử dụng dịch vụ của chúng
            tôi.
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid xs={5}>
            <form>
              <Stack m={2} spacing={3}>
                <TextField
                  label="Họ và Tên"
                  color="secondary"
                  size="small"
                  focused
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  error={isErrorName}
                  helperText={errorName}
                />
                <TextField
                  label="Địa chỉ"
                  color="secondary"
                  size="small"
                  focused
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  error={isErrorAddress}
                  helperText={errorAddress}
                />
                <TextField
                  label="Số điện thoại"
                  color="secondary"
                  size="small"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  focused
                  error={isErrorPhone}
                  helperText={errorPhone}
                />
              </Stack>
            </form>
          </Grid>

          <Grid xs={7}>
            <Box>
              <Typography sx={{ fontSize: "20px", marginBottom: "20px" }}>
                Đơn hàng của bạn{" "}
              </Typography>
            </Box>
            <Box>
              <Stack direction="row">
                <Item sx={{ borderRight: "0px" }}>Sản Phẩm </Item>
                <Item>Tạm Tính</Item>
              </Stack>
              {cart?.items?.map((item: IcartItem) => {
                return (
                  <Stack direction="row" key={item._id}>
                    <Item sx={{ borderRight: "0px", fontWeight: 500 }}>
                      {item.product.name} x{item.quantity}x{item.size}{" "}
                    </Item>
                    <Item sx={{ fontWeight: 500 }}>
                      {formatPrice(item.product.price * item.quantity)}₫
                    </Item>
                  </Stack>
                );
              })}

              <Stack direction="row">
                <Item sx={{ borderRight: "0px" }}>Giao hàng </Item>
                <Item>Free</Item>
              </Stack>
              <Stack direction="row">
                <Item sx={{ borderRight: "0px" }}>Tổng </Item>
                <Item>{cart ? formatPrice(cart.total) : formatPrice(0)}₫</Item>
              </Stack>
            </Box>
            <Box>
              <FormControl sx={{ m: 3 }} variant="standard">
                <RadioGroup
                  defaultValue="TM"
                  onChange={handleRadioChange}
                  value={value}
                >
                  <FormControlLabel
                    value="TM"
                    control={<Radio />}
                    label="Trả tiền mặt khi nhận hàng"
                  />
                  <FormControlLabel
                    value="CK"
                    control={<Radio />}
                    label="Chuyển khoản ngân hàng."
                  />
                  <FormControlLabel
                    value="MOMO"
                    control={<Radio />}
                    label="Thanh toán qua MOMO"
                  />
                </RadioGroup>
                <FormHelperText>{helperText}</FormHelperText>
              </FormControl>
            </Box>
            {isOpenStripe && !isPaymentMOMO && (
              <HomeStripe
                handleCheck={handleCheck}
                handleAddOrder={handleAddOrder}
              ></HomeStripe>
            )}

            {isPaymentMOMO && !isOpenStripe && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  color="secondary"
                  sx={{ padding: "10px 20px" }}
                  variant="outlined"
                  onClick={handleReopenMomoPayment}
                  disabled={loadingMOMO}
                >
                  Thanh toán qua trang Liên kết MOMO
                </Button>
                {loadingMOMO && (
                  <CircularProgress
                    size={30}
                    sx={{ marginLeft: "10px", color: "#e91e63" }}
                  />
                )}
              </Box>
            )}

            {!isOpenStripe && !isPaymentMOMO && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  color="secondary"
                  sx={{ padding: "10px 20px" }}
                  variant="outlined"
                  onClick={handleSubmit}
                >
                  Đặt hàng
                </Button>
              </Box>
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default MainPay;
