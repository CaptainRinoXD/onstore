// d:\-----.Projects\2024-OnlineStore_NodeJS\NEW\onstore\onstore\src\app\components\admin\productType\productType.update.tsx
import {
  handleUpdateProductTypeAction,
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

interface SizeStock {
  size: string;
  quantity: number;
}

const UserTypeUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const [listColl, setlistColl] = useState([]);
  const [sizeStocks, setSizeStocks] = useState<SizeStock[]>([]);
    const [fileList, setFileList] = useState<any[]>([]);

      const uploadProps: UploadProps = {
        beforeUpload: (file) => {
          setFileList([file]);
          return false; // Prevent default upload
        },
          fileList: fileList,
          onRemove: () => {
              setFileList([]);
          }
    };

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                description: dataUpdate.description,
            });
            if (dataUpdate.image) {
                setFileList([{
                    uid: '-1',
                    name: dataUpdate.image,
                    status: 'done',
                    url: dataUpdate.image,
                }]);
            }
        }
    }, [dataUpdate]);

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
      setFileList([]);
  };

  const onFinish = async (values: any) => {
      if (dataUpdate) {
          const formData = new FormData();
          formData.append('name', values.name);
          formData.append('description', values.description);

          if (fileList && fileList.length > 0) {
              if (fileList[0].originFileObj) {
                formData.append('image', fileList[0].originFileObj);
              }
           }

        const res = await handleUpdateProductTypeAction({
          ...formData,
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