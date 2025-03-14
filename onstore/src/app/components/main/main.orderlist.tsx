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
import moment from 'moment';

const OrderList = () => {
  const [listOrder, setListOrder] = React.useState<IOrder[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // State for error message

  const fetchData = async () => {
    try {
      const respon = await fetch('http://localhost:3002/api/orders/currentUser', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (respon.status === 404) {
        setErrorMessage("Không tìm thấy đơn hàng.");
        setListOrder([]); // Reset order list on error
        return;
      }

      if (!respon.ok) {
        throw new Error(`HTTP error! Status: ${respon.status}`);
      }

      const res = await respon.json();
      console.log("res", res);
      setListOrder(res);
      setErrorMessage(null); // Clear any previous error messages
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage("Có lỗi xảy ra khi lấy danh sách đơn hàng."); // Generic error message
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid>
      {/* Display error message for not found orders */}
      {errorMessage && (
        <Box sx={{ textAlign: "center", margin: "20px 0" }}>
          <Typography variant="h5" color="red">
            {errorMessage}
          </Typography>
        </Box>
      )}
      
      {listOrder &&
        listOrder.map((order) => {
          return (
            <Box
              key={order._id}
              sx={{ backgroundColor: "#efefef61", margin: "20px 0" }}
            >
              <div style={{ padding: "10px " }}>
                Payment Method: {order.paymentMethod}
              </div>
              <div style={{ padding: "10px " }}>
                Ngày đặt hàng: {moment(order.createdAt).format('(HH:mm) DD/MM/yyyy')}
              </div>
              <div style={{ padding: "10px " }}>
                Shipping Status: {order.shippingStatus}
              </div>
              <div style={{ padding: "10px ", display: 'flex', alignItems: 'center' }}>
                Payment Status:
                <Typography
                  component="span"
                  sx={{
                    marginLeft: '5px',
                    color:
                      order.paymentStatus === "Successful"
                        ? "green"
                        : order.paymentStatus === "Pending"
                        ? "#de8ebe"
                        : "red",
                  }}
                >
                  {order.paymentStatus}
                </Typography>
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
                      <ListItemText primary={orderDe.name} />
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