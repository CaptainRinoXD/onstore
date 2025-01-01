// d:\-----.Projects\2024-OnlineStore_NodeJS\NEW\onstore\onstore\src\app\components\admin\order\order.table.tsx
"use client";

import { formatPrice } from "@/utils/functionShare";
import { Table, Button, message } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { useState } from "react";
import OrderUpdate from "./order.update";
import { useRouter } from "next/navigation";

interface IProps {
    orders: any;
}

const OrderTable = (props: IProps) => {
    const { orders } = props;
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const router = useRouter();


    const handleCheckPaymentStatus = async (orderId: string) => {
      try {
            const response = await fetch(`http://localhost:3002/api/paymentStatus`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                 body: JSON.stringify({ orderId: orderId }),
              });
              if (!response.ok) {
                   message.error(`Failed to check payment status for order ${orderId}`)
                  return;
                }
            message.success(`Payment status checked for order ${orderId}`)
           router.refresh()

      } catch (error) {
         console.error("Error checking payment status:", error);
          message.error(`Failed to check payment status for order ${orderId}`)
      }
    };

    const columns = [
        {
            title: "STT",
            render: (_: any, record: any, index: any) => {
                return <>{index + 1}</>;
            },
        },
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
                        <Button
                           type="primary"
                           danger
                            onClick={() => handleCheckPaymentStatus(record._id)}
                            style={{ marginLeft: 8 }}
                        >
                            Check
                        </Button>
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