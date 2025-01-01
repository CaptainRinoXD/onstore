"use client";
import React from "react";
import {
  Box,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { formatPrice } from "@/utils/functionShare";
import { Flex } from "antd";
import moment from 'moment';
import { handleGetOrderById } from "@/utils/actions";

const OrderList = () => {
  const [listOrder, setListOrder] = React.useState<IOrder[]>([]);

  const fetchData = async () => {
    const respon = await fetch('http://localhost:3002/api/orders/currentUser', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      });
      if (!respon) {
        return}
    
    const res = await respon.json();
    console.log("res",res)
    setListOrder(res);
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid>
      {listOrder &&
        listOrder.map((order) => {
          console.log(moment(order.createdAt))
          return (
            <Box
              key={order._id}
              sx={{ backgroundColor: "#efefef61", margin: "20px 0" }}
            >
              <div style={{ padding: "10px " }}>
                Ngày đặt hàng: {moment(order.createdAt).format('(HH:mm) DD/MM/yyyy')}
              </div>
              {order?.items.map((orderDe) => {
                return (
                  <ListItem key={orderDe._id}>
                    <ListItemAvatar>
                      <Image
                        alt="image"
                        src={orderDe.product.images[0]}
                        width={80}
                        height={80}
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </ListItemAvatar>
                    <Box sx={{ marginLeft: "40px" }}>
                      <ListItemText primary={orderDe.product.name} />
                      <ListItemText
                        primary={`${orderDe.quantity} x ${formatPrice(
                          orderDe.price || 0
                        )}₫`}
                        sx={{ color: "#de8ebe" }}
                      />
                    </Box>
                  </ListItem>
                );
              })}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "20px ",
                }}
              >
                Thành tiền: {formatPrice(order?.total)}₫
              </div>
            </Box>
          );
        })}
    </Grid>
  );
};

export default OrderList;
