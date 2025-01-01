import { handleCreateProductAction } from "@/utils/actions";
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
import { useEffect, useState } from "react";

interface IProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

interface SizeStock {
  size: string;
  quantity: number;
}

const ProductCreate = (props: IProps) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = props;

  const [form] = Form.useForm();
  const [listColl, setlistColl] = useState([]);
  const [listType, setlistType] = useState([]);
  const [sizeStocks, setSizeStocks] = useState<SizeStock[]>([]);
    const [images, setImages] = useState<string[]>([]);

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
    setSizeStocks([]);
      setImages([]);
  };

  const onFinish = async (values: any) => {
    const res = await handleCreateProductAction({
      ...values,
        images: images,
      sizeStock: sizeStocks,
    });
    if (res) {
      handleCloseCreateModal();
      message.success("Create succeed!");
    } else {
      notification.error({
        message: "Create error",
        description: res?.message,
      });
    }
  };

    const handleAddImage = () => {
        setImages([...images, ""]); // Add an empty string to the images array
    };


    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };
    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
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
    setSizeStocks([...sizeStocks, { size: "", quantity: 0 }]); // Add an empty size stock entry
  };

  const handleSizeStockChange = (
    index: number,
    field: "size" | "quantity",
    value: string | number
  ) => {
    const newSizeStocks = [...sizeStocks];

    // Assert types to ensure that the assignment is safe
    if (field === "size") {
      // When field is 'size', value should be a string
      newSizeStocks[index].size = value as string; // Type assertion to indicate it's a string
    } else if (field === "quantity") {
      // When field is 'quantity', value should be a number
      newSizeStocks[index].quantity = value as number; // Type assertion to indicate it's a number
    }

    setSizeStocks(newSizeStocks);
  };

  return (
    <Modal
      title="Add New Product"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
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
          <Col span={8}>
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Please input your color!" }]}
            >
              <Input />
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
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select a type!" }]}
            >
              <Select options={listType} />
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
                    {images.map((image, index) => (
                        <Row key={index} gutter={[8, 8]} style={{ marginBottom: 10 }}>
                            <Col span={20}>
                                <Input
                                    placeholder="Image URL"
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                            </Col>
                            <Col span={4}>
                                <Button
                                    type="dashed"
                                    danger
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button type="dashed" onClick={handleAddImage}>
                        Add Image
                    </Button>
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
                  min: 0,
                  message: "Number must be > 0!",
                },
              ]}
            >
              <InputNumber />
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

export default ProductCreate;