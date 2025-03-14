// onstore/src/app/components/admin/productType/productType.create.tsx
import { handleCreateProductTypeAction } from "@/utils/actions";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  notification,
  Upload,
  UploadProps,
  Button,
} from "antd";
import { useState } from "react";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

interface SizeStock {
  size: string;
  quantity: number;
}

const ProductTypeCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent default upload
    },
    fileList: fileList,
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
    setFileList([]);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    if (fileList && fileList.length > 0) {
      formData.append('image', fileList[0]); // Correctly append the file
    }

    const res = await handleCreateProductTypeAction(formData);

    if (res.success) { // Check for success property
      handleCloseCreateModal();
      message.success("Create succeed!");
    } else {
      notification.error({
        message: "Create error",
        description: res.message, // Display the error message
      });
    }
  };

  return (
    <Modal
      title="Add New Product Type"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
      width={800}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input your description!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <Form.Item label="Image">
              <Upload {...uploadProps} >
                <Button>Select Image</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductTypeCreate;