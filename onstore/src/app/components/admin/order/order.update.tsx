import { handleUpdateOrderAction, handleUpdateProductAction } from "@/utils/actions";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  notification,
  Select,
  Button,
  InputNumber,
} from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}


const OrderUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        shippingStatus: dataUpdate.shippingStatus,
        paymentStatus: dataUpdate.paymentStatus,
      });
    }
  }, [dataUpdate]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };

  const onFinish = async (values: any) => {
    if (dataUpdate) {
      const res = await handleUpdateOrderAction({
        ...values,
        id: dataUpdate._id,
      });
      if (res) {
        handleCloseUpdateModal();
        message.success("Update succeed");
      } else {
        notification.error({
          message: "Update error",
          description: res?.message,
        });
      }
    }
  };


  return (
    <Modal
      title="Update Order"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
      width={800}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={12}>
            <Form.Item
              label="Payment Status"
              name="paymentStatus"
              rules={[
                { required: true, message: "Please input your Payment Status!" },
              ]}
            >
              <Select
                options={['Successful','Pending','Failed'].map((size) => ({
                  value: size,
                  label: size,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Shipping Status"
              name="shippingStatus"
              rules={[
                { required: true, message: "Please input your Shipping Status!" },
              ]}
            >
              <Select
                options={['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((size) => ({
                  value: size,
                  label: size,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default OrderUpdate;
