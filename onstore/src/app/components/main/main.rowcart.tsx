"use client";

import { formatPrice } from "@/utils/functionShare";
import { Input, TableCell, TableRow, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import path from "path";

interface IProps {
  detailCart: IcartItem;
  index: number;
  getCart: () => void;
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

const MainRowCart = (props: IProps) => {
  const { detailCart, index, getCart } = props;
  const [value, setValue] = useState(detailCart.quantity);
  const [totalPrice, setTotalPrice] = useState(
    detailCart.product.price * detailCart.quantity
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 1) {
      setValue(1);
    }
  };

  const updateQuantity = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/carts/cartId/items/${detailCart._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: value }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      getCart();
    } catch (error) {
      console.log("error update item cart:" + error);
    }
  }, [value, detailCart._id, getCart]);

  const getImageURL = (imageName: string | undefined) => {
    if (!imageName) return "/placeholder.png"; // Handle undefined or empty imageName
    const baseName = path.parse(imageName).name;
    const url = `http://localhost:3002/api/images/${baseName}`;
    return url;
  };

  useEffect(() => {
    setTotalPrice(value * detailCart.product.price);
    updateQuantity();
  }, [value, updateQuantity, detailCart.product.price]);

  return (
    <TableRow key={detailCart._id}>
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell align="center">
        <Image
          src={getImageURL(detailCart.product?.images?.[0])}
          alt=""
          width={50}
          height={50}
        />
      </TableCell>
      <TableCell align="right">{detailCart.product.name}</TableCell>
      <TableCell align="right">
        <Typography sx={{ color: "#de8ebe", fontSize: "18px" }}>
          {formatPrice(detailCart.product.price)}₫
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Input
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: 1,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
          sx={{ textDecoration: "none" }}
        />
      </TableCell>
      <TableCell align="right">{formatPrice(totalPrice)}₫</TableCell>
    </TableRow>
  );
};

export default MainRowCart;
