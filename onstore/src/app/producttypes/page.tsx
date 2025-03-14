"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, message } from "antd";
import Layout from "@/app/components/Layout";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProductTypes, fetchCollections } from "@/utils/services";
import MainDrawerList from "@/app/components/main/main.drawerlist";
import path from "path";
import Image from 'next/image';
import bannerJPG from "./banner.jpg";

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
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const productTypeId = searchParams.get("type");
  const collectionId = searchParams.get("collection");
  const [priceFilter, setPriceFilter] = useState<
    "lowToHigh" | "highToLow" | null
  >(null);
  const [alphabetFilter, setAlphabetFilter] = useState<"aToZ" | "zToA" | null>(
    null
  );

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    // Initialize selectedType and selectedCollection from URL
    if (productTypeId) {
      setSelectedType(productTypeId);
    } else {
      setSelectedType(null);
    }

    if (collectionId) {
      setSelectedCollection(collectionId);
    } else {
      setSelectedCollection(null);
    }

    const fetchProducts = async () => {
      const response = await fetch(`http://localhost:3002/api/products`);
      const data: Product[] = await response.json();
      setProducts(data);
    };

    const fetchProductType = async () => {
      let data: ProductType | null = null;
      if (productTypeId) {
        const response = await fetch(
          `http://localhost:3002/api/product-types/${productTypeId}`
        );
        data = await response.json();
      } else {
        data = {
          name: "All Products",
          image: "default",
          _id: "all",
        };
      }
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
        setAllCollections(collection);
      } catch (error) {
        console.error("Failed to load collection:", error);
      }
    };

    fetchProducts();
    fetchProductType();
    loadProductTypes();
    loadCollection();
  }, [productTypeId, collectionId]);

  const fetchProductType = async (typeId: string | null) => {
    let data: ProductType | null = null;
    if (typeId) {
      const response = await fetch(
        `http://localhost:3002/api/product-types/${typeId}`
      );
      data = await response.json();
    } else {
      data = {
        name: "All Products",
        image: "default",
        _id: "all",
      };
    }
    setProductType(data);
  };

  useEffect(() => {
    fetchProductType(selectedType);
  }, [selectedType]);

  useEffect(() => {
    // Filter products when products, selectedType, or selectedCollection changes
    if (products) {
      let filtered = [...products];

      if (selectedType) {
        filtered = filtered.filter(
          (product) => product.type.toString() === selectedType
        );
      }

      if (selectedCollection) {
        filtered = filtered.filter(
          (product) => product.coll.toString() === selectedCollection
        );
      }

      // Sort by price
      if (priceFilter === "lowToHigh") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (priceFilter === "highToLow") {
        filtered.sort((a, b) => b.price - a.price);
      }

      // Sort by alphabet
      if (alphabetFilter === "aToZ") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (alphabetFilter === "zToA") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }

      setFilteredProducts(filtered);
    }
  }, [products, selectedType, selectedCollection, priceFilter, alphabetFilter]);

  const handleTypeChange = (typeId: string | null) => {
    setSelectedType(typeId);
    filterProducts(typeId, selectedCollection);

    const selectedTypeObj =
      allProductTypes.find((type) => type._id === typeId) || null;
    setProductType(
      selectedTypeObj || {
        name: "All Products",
        image:
          "default",
        _id: "all",
      }
    );

    // Gọi API để đảm bảo dữ liệu chính xác
    fetchProductType(typeId);
  };

  const handleCollectionChange = (collId: string | null) => {
    setSelectedCollection(collId);
    filterProducts(selectedType, collId);
  };

  const filterProducts = (typeId: string | null, collId: string | null) => {
    let filtered = [...products];

    if (typeId) {
      filtered = filtered.filter(
        (product) => product.type.toString() === typeId
      );
    }

    if (collId) {
      filtered = filtered.filter(
        (product) => product.coll.toString() === collId
      );
    }

    // Sort by price
    if (priceFilter === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceFilter === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (alphabetFilter === "aToZ") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (alphabetFilter === "zToA") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (filter: "lowToHigh" | "highToLow" | null) => {
    setPriceFilter(filter);
    filterProducts(selectedType, selectedCollection);
  };

  const handleAlphabetChange = (filter: "aToZ" | "zToA" | null) => {
    setAlphabetFilter(filter);
    filterProducts(selectedType, selectedCollection);
  };

  if (!productType) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <Layout>
      <div style={{ backgroundColor: "var(--background)" }}>
        <h3 className="mb-4 mt-4" style={{ marginLeft: "355px" }}>
          Home | <strong>{productType?.name || "All Products"}</strong>
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

            <h3
              style={{
                fontSize: "18px",
                color: "var(--color)",
                marginBottom: "25px",
                textDecoration: "underline",
                textDecorationThickness: "2px", // Độ dày của đường gạch chân
                textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
              }}
            >
              PRICE
            </h3>
            <div className="filter-container">
              <div>
                <input
                  type="checkbox"
                  id="lh"
                  checked={priceFilter === "lowToHigh"}
                  onChange={(e) =>
                    handlePriceChange(e.target.checked ? "lowToHigh" : null)
                  }
                />
                <label htmlFor="lh">LOW TO HIGH</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="hl"
                  checked={priceFilter === "highToLow"}
                  onChange={(e) =>
                    handlePriceChange(e.target.checked ? "highToLow" : null)
                  }
                />
                <label htmlFor="hl">HIGH TO LOW</label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "18px",
                color: "var(--color)",
                marginBottom: "25px",
                textDecoration: "underline",
                textDecorationThickness: "2px", // Độ dày của đường gạch chân
                textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
              }}
            >
              ALPHABET
            </h3>
            <div className="filter-container">
              <div>
                <input
                  type="checkbox"
                  id="az"
                  checked={alphabetFilter === "aToZ"}
                  onChange={(e) =>
                    handleAlphabetChange(e.target.checked ? "aToZ" : null)
                  }
                />
                <label htmlFor="az">A-Z</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="za"
                  checked={alphabetFilter === "zToA"}
                  onChange={(e) =>
                    handleAlphabetChange(e.target.checked ? "zToA" : null)
                  }
                />
                <label htmlFor="za">Z-A</label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "18px",
                color: "var(--color)",
                marginBottom: "25px",
                textDecoration: "underline",
                textDecorationThickness: "2px", // Độ dày của đường gạch chân
                textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
              }}
            >
              GENDER
            </h3>
            <div className="filter-container">
              <div>
                <input type="checkbox" id="gender-women" />
                <label htmlFor="gender-women">Women</label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "18px",
                color: "var(--color)",
                marginBottom: "25px",
                textDecoration: "underline",
                textDecorationThickness: "2px", // Độ dày của đường gạch chân
                textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
              }}
            >
              Collections
            </h3>
            <div className="filter-container">
              {allCollections.map((coll) => (
                <div key={coll._id}>
                  <input
                    type="checkbox"
                    id={`coll-${coll.name}`}
                    checked={selectedCollection === coll._id}
                    onChange={(e) =>
                      handleCollectionChange(e.target.checked ? coll._id : null)
                    }
                  />
                  <label htmlFor={`coll-${coll.name}`}>{coll.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "18px",
                color: "var(--color)",
                marginBottom: "25px",
                textDecoration: "underline",
                textDecorationThickness: "2px", // Độ dày của đường gạch chân
                textUnderlineOffset: "15px", // Khoảng cách giữa chữ và gạch chân
              }}
            >
              Type Of Clothing
            </h3>
            <div className="filter-container">
              {allProductTypes.map((type) => (
                <div key={type._id}>
                  <input
                    type="checkbox"
                    id={`type-${type.name}`}
                    checked={selectedType === type._id}
                    onChange={(e) => {
                      handleTypeChange(e.target.checked ? type._id : null);
                    }}
                  />
                  <label htmlFor={`type-${type.name}`}>{type.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div>
            <div style={{
                height: "auto",
                width: "100%",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              {productType && (
                productType.image === "default" ? (
                  <Image
                    src={bannerJPG}
                    alt={productType.name}
                    className="rounded-md"
                    width={1200}  // Example width, adjust as needed
                    height={300} // Example height, adjust as needed
                    
                  />
                ) : (
                  <img
                    src={productType.image}
                    alt={productType.name}
                    className="rounded-md"
                  />
                )
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <Row gutter={[16, 16]}>
              {filteredProducts?.map((product) => (
                <Col span={6} key={product._id}>
                  <ProductCard
                    product={product}
                    onClick={() => {
                      router.push(`/products/${product._id}`, { scroll: true });
                    }}
                    toggleDrawer={toggleDrawer}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>

      <MainDrawerList toggleDrawer={toggleDrawer} open={open} />
    </Layout>
  );
};

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  toggleDrawer: (open: boolean) => () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  toggleDrawer,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const addToCart = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop event bubbling
    try {
      const response = await fetch(
        `http://localhost:3002/api/carts/cartId/items`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: 1,
            price: product.price,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      //message.success(`${product.name} added to cart!`);
      toggleDrawer(true)();
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle error when it's an instance of Error
        message.error(
          error.message || "An error occurred while adding to cart"
        );
      } else {
        // Handle case when error is not an instance of Error
        message.error("An unknown error occurred");
      }
    }
  };

  const getImageURL = (imageName: string) => {
    const baseName = path.parse(imageName).name;
    const url = `http://localhost:3002/api/images/${baseName}`;
    return url;
  };

  return (
    <motion.div // Now correctly used as a JSX component
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Card
        hoverable
        style={{
          borderRadius: "12px",
          transition: "transform 0.3s ease",
          boxShadow: isHovered
            ? "0 10px 25px rgba(0, 0, 0, 0.1)"
            : "0 6px 15px rgba(0, 0, 0, 0.1)",
        }}
        cover={
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              alt={product.name}
              src={getImageURL(product.images[0])}
              style={{
                transition: "transform 0.3s ease",
                transform: isHovered ? "scale(1.1)" : "scale(1)",
              }}
            />
            <motion.div
              className="absolute bottom-0 transform -translate-x-1/2 p-2 cursor-pointer"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: isHovered ? "auto" : "none" }}
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
