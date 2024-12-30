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
  Grid
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
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

  const [cart, setCart] = useState<Icart | null>(null);

    const getCart = useCallback(async () => {
      try {
        const response = await fetch('http://localhost:3002/api/carts/cartId', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("cart data: " + JSON.stringify(data));
        setCart(data);
      } catch (error) {
         console.log("Error fetching cart:", error);
      }
    },[]);

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
    if(!cart) return;
    const res = await handleAddOrderServices(); 
    console.log(res)
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

  useEffect(() => {
    getCart();
  },[getCart])


  useEffect(() => {
    if (value === "TM") {
      setHelperText("Trả tiền mặt khi giao hàng");
      setIsOpenStripe(false);
    } else if (value === "CK") {
      setIsOpenStripe(true);
      setHelperText(
        "Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi." +
          "Đơn hàng sẽ đươc giao sau khi tiền đã chuyển."
      );
    }
  }, [value]);

  return (
    <Grid container spacing={4}>
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
                  {item.product.name} x{item.quantity}{" "}
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
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
        </Box>
        {/* {isOpenStripe && (
          // <HomeStripe
          //   handleCheck={handleCheck}
          //   handleAddOrder={handleAddOrder}
          // ></HomeStripe>
        )} */}
        {!isOpenStripe && (
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
    </Grid>
  );
};

export default MainPay;