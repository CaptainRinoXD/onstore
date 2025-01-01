"use client"
import React, { useEffect, useState } from "react";
import { Row, Col, Card, message } from "antd";
import Layout from "@/app/components/Layout";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { fetchProductTypes, fetchCollections } from "@/utils/services";


interface Product {
  _id: string;
  name: string;
  description: string;
  coll: string;
  price: number;
  category: string;
  type: string;
  size: string;
  color: string;
  brand: string;
  material?: string;
  stock: number;
  createdAt: Date;
  images: string[];
  discountPrice?: number;
  averageRating?: number;
  reviews: {
    username: string;
    rating: number;
    text: string;
  }[];
  careInstructions?: string;
  releaseDate?: Date;
}

interface ProductType {
  _id: string;
  name: string;
  image: string;
  description?: string;
  createdAt?: Date;
}

interface Collection {
  _id: string;
  name: string;
  images: string;
  description: string;
  createdAt?: Date;
}

const ProductsTypePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [allProductTypes, setAllProductTypes] = useState<ProductType[]>([]);
  const [allCollection, setAllCollection] = useState<Collection[]>([]);
  const { productTypeId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productTypeId) return;
      const response = await fetch(
        `http://localhost:3002/api/product/${productTypeId}/products`
      );
      const data: Product[] = await response.json();
      setProducts(data);
    };

    const fetchProductType = async () => {
      if (!productTypeId) return;
      const response = await fetch(
        `http://localhost:3002/api/product-types/${productTypeId}`
      );
      const data: ProductType = await response.json();
      setProductType(data);
    };

    const loadProductTypes = async () => {
      try {
          const productTypes = await fetchProductTypes();
          setAllProductTypes(productTypes);
      } catch (error) {
          console.error("Failed to load product types:", error);
      }
    };

    const loadCollection = async () => {
      try {
          const collection = await fetchCollections();
          setAllCollection(collection);
      } catch (error) {
          console.error("Failed to load collection:", error);
      }
    };


    fetchProducts();
    fetchProductType();
    loadProductTypes();
    loadCollection();
  }, [productTypeId]);

  if (!productType) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <div style={{ backgroundColor: "var(--background)" }}>
      <h3 className="mb-4" style={{ marginLeft: "355px" }}>
  Home | <strong>{productType.name}</strong>
</h3>

      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "50px",
          marginRight: "50px",
        }}
      >
        <div
      style={{
        width: "20%",
        backgroundColor: "var(--background)",
        borderRadius: "8px",
        // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
  <style>
    {`
      .filter-container input[type="checkbox"] {
        display: none;
      }

      .filter-container label {
        position: relative;
        display: inline-block;
        padding-left: 35px;
        margin-bottom: 10px;
        cursor: pointer;
        font-size: 14px;
        color: var(--color);
      }

      .filter-container label:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        border: 2px solid #4caf50;
        border-radius: 4px;
        background-color: white;
        transition: background-color 0.3s, border-color 0.3s;
      }

      .filter-container input[type="checkbox"]:checked + label:before {
        background-color: #4caf50;
        border-color: #4caf50;
      }

      .filter-container input[type="checkbox"]:checked + label:after {
        content: "✔";
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        color: white;
      }

      .filter-container h3 {
        font-size: 18px;
        color: var(--color);
        margin-bottom: 25px;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 15px;
      }
    `}
  </style>

  <h3 style={{
    fontSize: "18px",
    color: "var(--color)",
    marginBottom: "25px",
    textDecoration: "underline",
    textDecorationThickness: "2px", // Độ dày của đường gạch chân
    textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
  }}>PRICE</h3>
  <div className="filter-container">
    <div>
      <input type="checkbox" id="lh" />
      <label htmlFor="lh">LOW TO HIGH</label>
    </div>
    <div>
      <input type="checkbox" id="hl" />
      <label htmlFor="hl">HIGH TO LOW</label>
    </div>
  </div>
</div>

<div style={{ marginBottom: "20px" }}>
  <h3 style={{
    fontSize: "18px",
    color: "var(--color)",
    marginBottom: "25px",
    textDecoration: "underline",
    textDecorationThickness: "2px", // Độ dày của đường gạch chân
    textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
  }}>ALPHABET</h3>
  <div className="filter-container">
    <div>
      <input type="checkbox" id="az" />
      <label htmlFor="az">A-Z</label>
    </div>
    <div>
      <input type="checkbox" id="za" />
      <label htmlFor="za">Z-A</label>
    </div>
  </div>
</div>

<div style={{ marginBottom: "20px" }}>
  <h3 style={{
    fontSize: "18px",
    color: "var(--color)",
    marginBottom: "25px",
    textDecoration: "underline",
    textDecorationThickness: "2px", // Độ dày của đường gạch chân
    textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
  }}>GENDER</h3>
  <div className="filter-container">
    <div>
      <input type="checkbox" id="gender-women" />
      <label htmlFor="gender-women">Women</label>
    </div>
  </div>
</div>

<div style={{ marginBottom: "20px" }}>
  <h3 style={{
    fontSize: "18px",
    color: "var(--color)",
    marginBottom: "25px",
    textDecoration: "underline",
    textDecorationThickness: "2px", // Độ dày của đường gạch chân
    textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
  }}>Collections</h3>
  <div className="filter-container">
    {allCollection.map((coll) => (
      <div key={coll._id}>
        <input type="checkbox" id={`coll-${coll.name}`} />
        <label htmlFor={`coll-${coll.name}`}>{coll.name}</label>
      </div>
    ))}
  </div>
</div>

<div style={{ marginBottom: "20px" }}>
  <h3 style={{
    fontSize: "18px",
    color: "var(--color)",
    marginBottom: "25px",
    textDecoration: "underline",
    textDecorationThickness: "2px", // Độ dày của đường gạch chân
    textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
  }}>Type Of Clothing</h3>
  <div className="filter-container">
      {allProductTypes.map((type) => (
            <div key={type._id}>
              <input type="checkbox" id={`type-${type.name}`} />
              <label htmlFor={`type-${type.name}`}>{type.name}</label>
            </div>
          ))}
  </div>
</div>

    </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div>
            <div
              style={{
                height: "auto",
                width: "100%",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              <img
                src={productType.image}
                alt={productType.name}
                className="rounded-md"
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col span={6} key={product._id}>
                  <ProductCard
                    product={product}
                    onClick={() => {
                      router.push(`/producttypes/${productTypeId}/products/${product._id}`, { scroll: true });
                    }}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const addToCart = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop event bubbling
    try {
      const response = await fetch(`http://localhost:3002/api/carts/cartId/items`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id, quantity: 1, price: product.price }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }
  
      message.success(`${product.name} added to cart!`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle error when it's an instance of Error
        message.error(error.message || 'An error occurred while adding to cart');
      } else {
        // Handle case when error is not an instance of Error
        message.error('An unknown error occurred');
      }
    }
  };
  

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }} // Scale up card and add a little upward movement
      transition={{ duration: 0.3 }} // Smooth transition
      style={{ 
        borderRadius: "12px", 
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", 
        overflow: "hidden",
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <Card
        hoverable
        style={{
          borderRadius: "12px",
          transition: "transform 0.3s ease",
          boxShadow: isHovered ? "0 10px 25px rgba(0, 0, 0, 0.1)" : "0 6px 15px rgba(0, 0, 0, 0.1)"
        }}
        cover={
          <div
            style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              alt={product.name}
              src={product.images[0]}
              style={{
                transition: "transform 0.3s ease",
                transform: isHovered ? "scale(1.1)" : "scale(1)", // Zoom in on image
              }}
            />
            <motion.div
              className="absolute bottom-0 transform -translate-x-1/2 p-2 cursor-pointer"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
            >
              <div
                className="bg-black rounded-md p-2 opacity-75 hover:opacity-80"
                onClick={addToCart}
              >
                <FiShoppingCart size={20} color="white" />
              </div>
            </motion.div>
          </div>
        }
      >
        <Card.Meta
          title={product.name}
          description={`Price: $${product.price}`}
          style={{ textAlign: "center", padding: "10px" }}
        />
      </Card>
    </motion.div>
  );
};

export default ProductsTypePage;