"use client";
import { Layout } from "antd";
import "@ant-design/v5-patch-for-react-19";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        ©{new Date().getFullYear()} Created
      </Footer>
    </>
  );
};

export default AdminFooter;
