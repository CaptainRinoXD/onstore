"use client";

import {
    Box,
    Button,
    ButtonGroup,
    Drawer,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Image from "next/image";
import { formatPrice, handleCaculateTotalPrice } from "@/utils/functionShare";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

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

const MainDrawerList = (props: any) => {
    const { toggleDrawer, open } = props;
    const router = useRouter();
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


    const handleDeteleItem = async (itemId: string) => {
        try {
          const response = await fetch(`http://localhost:3002/api/carts/cartId/items/${itemId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
          })
           if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
          getCart();
        } catch (error) {
          console.log("error detele item cart:" + error);
        }

    };

    useEffect(() => {
        getCart();
    }, [getCart]);
    

    return (
        <Drawer
            open={open}
            anchor="right"
            key={"DrawerKey"}
            onClose={toggleDrawer(false)}
            sx={{
                "& .MuiPaper-root": {
                    display: "flex",
                    justifyContent: "space-between",
                },
            }}
        >
            <Box sx={{ width: 400 }} role="presentation" key={"DrawerBoxKey"}>
                {cart?.items?.map((item) => {
                    return (
                        <ListItem
                            key={item._id}
                            secondaryAction={
                                <Button
                                    onClick={() => handleDeteleItem(item._id)}
                                    sx={{ color: "#de8ebe" }}
                                >
                                    <DeleteOutlineIcon></DeleteOutlineIcon>
                                </Button>
                            }
                        >
                            <ListItemAvatar>
                                <Image
                                    alt="image"
                                    src={item.product?.images?.[0]}
                                    width={80}
                                    height={80}
                                    style={{
                                        objectFit: "contain",
                                    }}
                                />
                            </ListItemAvatar>
                            <Box sx={{ marginLeft: "20px" }} key={item._id + "1"}>
                                <ListItemText primary={item.product?.name} />
                                <ListItemText
                                    primary={`${item.quantity} x ${formatPrice(
                                        item.product?.price
                                    )}₫`}
                                    sx={{ color: "#de8ebe" }}
                                />
                            </Box>
                        </ListItem>
                    );
                })}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyItems: "flex-end",
                    position: "sticky",
                    "& > *": {
                        m: 1,
                    },
                    "& .MuiButtonGroup-root": {
                        width: "100%",
                    },
                    "& .MuiButtonBase-root": {
                        border: "none",
                        "&:hover": {
                            backgroundColor: "#de8ebe",
                            border: "none",
                        },
                    },
                }}
            >
                <ButtonGroup orientation="vertical" aria-label="Vertical button group">
                    <Button
                        key="one"
                        sx={{
                            color: "#333",
                            display: "flex",
                            justifyContent: "space-between",

                            "&:hover": {
                                "& .MuiTypography-root": {
                                    color: "#fff",
                                },
                            },
                        }}
                    >
                        <Typography>Tổng Cộng:</Typography>
                        <Typography
                            sx={{
                                color: "#de8ebe",
                            }}
                        >
                           {cart ? formatPrice(cart.total) : formatPrice(0)} ₫
                        </Typography>
                    </Button>
                    <Button
                        key="two"
                        sx={{ color: "#fff", backgroundColor: "#666" }}
                        onClick={() => {
                            toggleDrawer(false);
                            router.push("/cart");
                        }}
                    >
                        Xem giỏ hàng
                    </Button>
                    <Button
                        key="three"
                        sx={{ color: "#fff", backgroundColor: "#333" }}
                        onClick={() => {
                            toggleDrawer(false);
                            router.push("/pay");
                        }}
                    >
                        Thanh toán
                    </Button>
                </ButtonGroup>
            </Box>
        </Drawer>
    );
};

export default MainDrawerList;