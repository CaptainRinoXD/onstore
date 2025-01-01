"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import type { MenuProps } from "antd";
import Link from "next/link";
import Icon from "@ant-design/icons/lib/components/Icon";


type MenuItem = Required<MenuProps>["items"][number];
const AdminSideBar = () => {
  const { Sider } = Layout;

  const items: MenuItem[] = [
    {
      key: "grp",
      type: "group",
      children: [
        {
          key: "dashboard",
          label: <Link href={"/dashboard"}>Dashboard</Link>,
          icon: <AppstoreOutlined />,
        },
        // {
        //   key: "users",
        //   label: <Link href={"/dashboard/user"}>Manage Users</Link>,
        // },
        {
          key: "products",
          label: <Link href={"/dashboard/product"}>Manage Product</Link>,
        },
        {
          key: "ProductType",
          label: <Link href={"/dashboard/productType"}>Manage Product Type</Link>,
        },
        {
          key: "Collection",
          label: <Link href={"/dashboard/coll"}>Manage Collection</Link>,
        },
        {
          key: "order",
          label: <Link href={"/dashboard/order"}>Manage Order</Link>,
        },
      ],
    },
  ];

  return (
    <Sider >
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={items}
        style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default AdminSideBar;
