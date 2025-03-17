// onstore/src/app/components/admin/productType/productType.update.tsx
import { handleUpdateProductTypeAction, handleUploadProductTypeImageAction } from "@/utils/actions";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  message,
  notification,
  Button,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";

interface IProps {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: any;
  setDataUpdate: any;
}

const UserTypeUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent default upload
    },
    fileList: fileList,
    onChange: (info) => {
      if (info.fileList.length > 1) {
        // Keep only the last uploaded file
        const newFileList = [info.fileList.pop()];
        setFileList(newFileList);
      } else {
        setFileList(info.fileList);
      }
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        description: dataUpdate.description,
      });
      // if (dataUpdate.image) {
      //   setFileList([{
      //     uid: '-1',
      //     name: dataUpdate.image,
      //     status: 'done',
      //     url: dataUpdate.image,
      //   }]);
      // }
    }
  }, [dataUpdate, form]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
    setFileList([]);
  };

  const onFinish = async (values: any) => {
    try {
      if (dataUpdate) {
        const res = await handleUpdateProductTypeAction({
          ...values,
          id: dataUpdate._id
        });

        if (res.success) {
          handleCloseUpdateModal();
          message.success("Update succeed");

          if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('productTypeId', dataUpdate._id);
            formData.append('image', fileList[0].originFileObj);

            const uploadResult = await handleUploadProductTypeImageAction(formData);

            if (!uploadResult.success) {
              notification.error({
                message: "Image upload error",
                description: uploadResult.message,
              });
              return;
            }
            console.log('uploadResult', uploadResult);
          }
        } else {
          notification.error({
            message: "Update error",
            description: res.message,
          });
        }
      }
    } catch (error: any) {
      notification.error({
        message: "Update error",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <Modal
      title="Update Product Type"
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

export default UserTypeUpdate;