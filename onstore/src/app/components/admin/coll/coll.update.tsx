import {
  handleUpdateCollAction,
  handleUpdateProductTypeAction,
  handleUploadCollectionImageAction
} from "@/utils/actions";
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
  UploadProps,
  Upload,
} from "antd";
import { useEffect, useState } from "react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const CollUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        images: dataUpdate.images,
        description: dataUpdate.description,
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
      const res = await handleUpdateCollAction({
        ...values,
        id: dataUpdate._id
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

    if (fileList && fileList.length > 0) {
        const formData = new FormData();
        formData.append('collectionId', dataUpdate._id); // Send product type ID
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


  return (
    <Modal
      title="Update Collection"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
      width={800}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Row gutter={[15, 15]}>
          <Col span={8}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
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
          <Col span={8}>
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

export default CollUpdate;