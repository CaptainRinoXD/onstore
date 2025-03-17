// onstore/src/app/components/admin/productType/productType.create.tsx
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
import { handleCreateProductTypeAction, handleUploadProductTypeImageAction } from "@/utils/actions"; // Import new action

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
  const [productTypeId, setProductTypeId] = useState<string | null>(null); // Store product type ID

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
    setProductTypeId(null); // Reset product type ID
  };

  const onFinish = async (values: any) => {
    try {
      // 1. Create the product type (without image)
      const createResult = await handleCreateProductTypeAction(values);

      if (!createResult.success) {
        notification.error({
          message: "Create error",
          description: createResult.message,
        });
        return;
      }

      const newProductTypeId = createResult.data._id; // Get the ID of the created product type
      setProductTypeId(newProductTypeId);

      // 2. Upload the image (if an image was selected)
      if (fileList && fileList.length > 0) {
        const formData = new FormData();
        formData.append('productTypeId', newProductTypeId); // Send product type ID
        formData.append('image', fileList[0]);

        const uploadResult = await handleUploadProductTypeImageAction(formData); // Call new action

        if (!uploadResult.success) {
          notification.error({
            message: "Image upload error",
            description: uploadResult.message,
          });
          return;
        }
        console.log('uploadResult',uploadResult)
      }

      handleCloseCreateModal();
      message.success("Create succeed!");
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "An unexpected error occurred",
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
              <Upload {...uploadProps}>
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