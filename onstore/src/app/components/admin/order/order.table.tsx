"use client";

import { formatPrice } from "@/utils/functionShare";
import { Table } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { useState } from "react";
import OrderUpdate from "./order.update";


interface IProps {
  orders: any;
}
const OrderTable = (props: IProps) => {
  const { orders } = props;
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

  const columns = [
    {
      title: "STT",
      render: (_: any, record: any, index: any) => {
        return <>{index + 1}</>;
      },
    },
    // {
    //   title: "_id",
    //   dataIndex: "_id",
    // },
    {
      title: "User",
      dataIndex: "user",
      render: (user: any) => {
        return <>{user.username}</>;

      },
    },
    {
      title: "Total Price",
      dataIndex: "total",
      render: (price: number) => {
        return <>{formatPrice(price)}</>;
      },
    },
    {
      title: "Shipping Status",
      dataIndex: "shippingStatus",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
    },
    {
      title: "Actions",
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer", margin: "0 20px" }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setDataUpdate(record);
              }}
            />
          </>
        );
      },
    },
  ];


  const expandedRowRender = (record: any) => {
    const columns = [
      { title: "Name", dataIndex: "name", key: "0" },
      { title: "Quantity", dataIndex: "quantity", key: "1" },
      { title: "Price", dataIndex: "price", key: "2" },
    ];

    var data = [];
    data = record?.items.map((item: any) => {
      return {
        key: item?._id,
        name: item?.product?.name,
        quantity: item?.quantity,
        price: formatPrice(item?.price),
      };
    });

    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        key={`${record._id}_1`}
      />
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span>Manager Order</span>
      </div>
      <Table
        bordered
        dataSource={orders}
        columns={columns}
        rowKey={"_id"}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
      />
      <OrderUpdate
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default OrderTable;
