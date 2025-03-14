"use client";

import { formatPrice } from "@/utils/functionShare";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import MainRowCart from "./main.rowcart";
import { useRouter } from "next/navigation";


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


const MainTableCart = () => {
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


  useEffect(() => {
      getCart()
  }, [getCart])


  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell align="center">Ảnh</TableCell>
              <TableCell align="right">Sản Phẩm</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Tạm tính</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart?.items?.map((row, index) => (
              <MainRowCart
                detailCart={row}
                index={index}
                 key={row._id}
                getCart={getCart}
              ></MainRowCart>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}
      >
        <Button
          color="secondary"
          sx={{ padding: "10px 20px" }}
          variant="outlined"
          onClick={() => router.push("/pay")}
        >
          Tiến hành thanh toán
        </Button>
      </Box>
    </>
  );
};

export default MainTableCart;