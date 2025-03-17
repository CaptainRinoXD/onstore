import {handleUploadCollectionImageAction, handleCreateCollAction, handleCreateProductAction, handleCreateProductTypeAction } from "@/utils/actions";
import { Button } from "@mui/material";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  notification,
  UploadProps,
  Upload,
} from "antd";
import { useEffect, useState } from "react";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}


const CollCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

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

  const onFinish = async (values: any) => {
    try{
        const res = await handleCreateCollAction(values);
        if (res) {
          handleCloseCreateModal();
          message.success("Create succeed!");
        } else {
          notification.error({
            message: "Create error",
            description: res?.message,
          });
        }

        const newCollectionId = res.data._id;
        if (fileList && fileList.length > 0) {
          const formData = new FormData();
          formData.append('collectionId', newCollectionId); // Send product type ID
          formData.append('image', fileList[0]);

          const uploadResult = await handleUploadCollectionImageAction(formData); // Call new action

          if (!uploadResult.success) {
            notification.error({
              message: "Image upload error",
              description: uploadResult.message,
            });
            return;
          }
          console.log('uploadResult',uploadResult)
        }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <Modal
      title="Add New Collection"
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

export default CollCreate;