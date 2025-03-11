import { handleUpdateProductAction } from "@/utils/actions";
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
  Upload,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  RcFile,
  UploadFile,
  UploadChangeParam,
} from "antd/es/upload/interface";

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

const UserUpdate = (props: IProps) => {
  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } =
    props;

  const [form] = Form.useForm();
  const [listColl, setlistColl] = useState([]);
  const [listType, setlistType] = useState([]);
  const [sizeStocks, setSizeStocks] = useState<SizeStock[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        category: dataUpdate.category,
        coll: dataUpdate.coll,
        color: dataUpdate.color,
        brand: dataUpdate.brand,
        type: dataUpdate.type,
        price: dataUpdate.price,
        description: dataUpdate.description,
      });
      setSizeStocks(dataUpdate.sizeStock);

      // Transform image URLs to UploadFile format
      const initialFileList: UploadFile[] = dataUpdate.images
        ? dataUpdate.images.map((imageUrl: string, index: number) => ({
            uid: `-${index}`, // Unique ID for each file
            name: `image-${index}`, // Filename
            status: "done", // Status of the file
            url: `http://localhost:3002/api/images/${imageUrl}`, // URL of the image
          }))
        : [];
      setFileList(initialFileList);
    }
  }, [dataUpdate, form]); // Add form to dependency array

  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
    setFileList([]);
  };

  const onFinish = async (values: any) => {
    try {
      const productId = dataUpdate._id;

      // 1. Upload new images
      let newImageNames: string[] = [];
      for (const file of fileList) {
        if (file.originFileObj) {
          const formData = new FormData();
          formData.append("image", file.originFileObj as any, file.name);
          formData.append("productId", productId);

          const uploadResponse = await fetch(
            "http://localhost:3002/api/images/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.log(errorData);
            throw new Error(errorData.message || "Image upload failed");
          }

          const uploadResult = await uploadResponse.json();
          newImageNames = newImageNames.concat(uploadResult.imageNames);
        }
      }

      // 2. Get existing image names
      const existingImages = dataUpdate.images || [];

      // 3. Combine existing and new image names
      const allImages = [...existingImages, ...newImageNames];

      // 4. Update Product
      const res = await handleUpdateProductAction({
        ...values,
        images: allImages,
        sizeStock: sizeStocks,
        id: productId,
      });

      // 5. Update state with returned data
      if (res) {
        setDataUpdate(res); // <-- VERY IMPORTANT: Update local state!
        handleCloseUpdateModal();
        message.success("Update succeed");
      } else {
        notification.error({
          message: "Update error",
          description: res?.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  const handleGetColl = async () => {
    const respon = await fetch(`http://localhost:3002/api/collections`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!respon.ok) {
      const error = await respon.json();
      throw new Error(`Failed to create product: ${error.message}`);
    }

    const res = await respon.json();
    return res;
  };

  const handleGetType = async () => {
    const respon = await fetch(`http://localhost:3002/api/product-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!respon.ok) {
      const error = await respon.json();
      throw new Error(`Failed to create product: ${error.message}`);
    }

    const res = await respon.json();
    return res;
  };

  const listAColl = async () => {
    let res = await handleGetColl();
    let a = res?.map((item: any) => {
      return { value: item?._id, label: item?.name };
    });
    setlistColl(a);
  };

  const listAType = async () => {
    let res = await handleGetType();
    let a = res?.map((item: any) => {
      return { value: item?._id, label: item?.name };
    });
    setlistType(a);
  };

  useEffect(() => {
    listAColl();
    listAType();
  }, []);

  const handleAddSizeStock = () => {
    setSizeStocks([...sizeStocks, { size: "", quantity: 0 }]);
  };

  const handleSizeStockChange = (
    index: number,
    field: "size" | "quantity",
    value: string | number
  ) => {
    const newSizeStocks = [...sizeStocks];

    if (field === "size") {
      newSizeStocks[index].size = value as string;
    } else if (field === "quantity") {
      newSizeStocks[index].quantity = value as number;
    }

    setSizeStocks(newSizeStocks);
  };

  const handleRemoveSizeStock = (index: number) => {
    const newSizeStocks = [...sizeStocks];
    newSizeStocks.splice(index, 1);
    setSizeStocks(newSizeStocks);
  };

  const handleUploadChange = ({
    fileList: newFileList,
  }: UploadChangeParam<UploadFile>) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    beforeUpload: (file: RcFile) => {
      console.log("beforeUpload file: ", file);
      return true; // Return true to allow the upload
    },
    onChange: handleUploadChange,
    multiple: true,
    fileList: fileList,
    onRemove: (file: UploadFile) => {
      setFileList((prevFileList) => {
        const index = prevFileList.indexOf(file);
        const newFileList = prevFileList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    // defaultFileList: fileList, // Remove defaultFileList
  };

  return (
    <Modal
      title="Update Product"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
      maskClosable={false}
      width={800}
    >
      <Form onFinish={onFinish} layout="vertical" form={form}>
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
              label="Category"
              name="category"
              rules={[
                { required: true, message: "Please input your category!" },
              ]}
            >
              <Select
                options={["Women"].map((size) => ({
                  value: size,
                  label: size,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[15, 15]}>
          <Col span={8}>
            <Form.Item
              label="Collection"
              name="coll"
              rules={[
                { required: true, message: "Please select a collection!" },
              ]}
            >
              <Select options={listColl} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Please input your color!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select options={listType} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[15, 15]}>
          <Col span={8}>
            <Form.Item
              label="Brand"
              name="brand"
              rules={[{ required: true, message: "Please input your brand!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Images">
              <Upload {...uploadProps}>
                <Button icon={null}>Select Files</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[15, 15]}>
          <Col span={8}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your price!" },
                {
                  type: "number",
                  min: 1,
                  message: "Number must be > 1!",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input your description!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* Size Stock Section */}
        <Row gutter={[15, 15]}>
          <Col span={24}>
            <h4>Size Stock</h4>
            {sizeStocks.map((sizeStock, index) => (
              <Row key={index} gutter={[15, 15]} style={{ marginBottom: 10 }}>
                <Col span={10}>
                  <Select
                    placeholder="Select Size"
                    value={sizeStock.size}
                    onChange={(value) =>
                      handleSizeStockChange(index, "size", value)
                    }
                    options={["XS", "S", "M", "L", "XL", "XXL"].map((size) => ({
                      value: size,
                      label: size,
                    }))}
                  />
                </Col>
                <Col span={10}>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={sizeStock.quantity}
                    onChange={(e) =>
                      handleSizeStockChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />
                </Col>
                <Col span={4}>
                  <Button
                    type="dashed"
                    danger
                    onClick={() => handleRemoveSizeStock(index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button type="dashed" onClick={handleAddSizeStock}>
              Add Size Stock
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserUpdate;
