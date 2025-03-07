// onstore/src/app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import Layout from "./components/Layout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainDrawerList from "@/app/components/main/main.drawerlist";
import React from "react";


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

interface Collection {
  _id: string;
  name: string;
  images: string;
  description: string;
  createdAt?: Date;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const visibleCount = 4; // Number of products visible at once

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/products");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCollections = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/collections");
        const data: Collection[] = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchProducts();
    fetchCollections();
  }, []);

  const handleNextBanner = () => {
    setFade(true);  // Start fade animation
    setTimeout(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % collections.length);
      setFade(false);  // Reset fade after the image changes
    }, 180);  // Adjust timeout to match the CSS transition duration
  };

  const handlePreviousBanner = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentBannerIndex(
        (prevIndex) => (prevIndex - 1 + collections.length) % collections.length
      );
      setFade(false);
    }, 180);
  };

  const handleNext = () => {
    // Move to the next product but keep within bounds
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % products.length
    );
  };

  const handlePrevious = () => {
    // Move to the previous product but keep within bounds
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + products.length) % products.length
    );
  };
  
  const maxIndex = products.length - visibleCount; // Total number of allowed presses

  const router = useRouter();
  const hanldeReToDetail = (id: string, type: string) => {
    router.push(`/products/${id}`);
  }
  const handleAddToCart = async (productId: string, price: number) => {
    try {
      const response = await fetch(`http://localhost:3002/api/carts/cartId/items`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId, quantity: 1, price: price }), // Assuming 1 is the quantity
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }
      toggleDrawer(true)();

      //message.success(`${product.name} added to cart!`); // Show success message
    } catch (error) {
      //message.error(error.message || 'An error occurred while adding to cart');
        console.error("Error adding to cart:", error);
    }
  };
  return (
    <Layout>
      <MainDrawerList toggleDrawer={toggleDrawer} open={open} />
      <div
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col `}
      >
        <main className="flex-grow flex flex-col items-center text-center">
          {collections.length > 0 && (
            <div className="relative w-full">
              <div
                className={`transition-opacity duration-500 ease-in-out ${
                  fade ? "opacity-0" : "opacity-100"
                }`}
              >
                {/* Đặt div bao quanh ảnh với chiều cao cố định */}
                <div className="image-container relative w-full h-[500px]">
                  <Image
                    src={
                      collections[currentBannerIndex].images ||
                      "/placeholder.png"
                    }
                    alt={collections[currentBannerIndex].name}
                    layout="fill" // Sử dụng layout "fill" để ảnh phủ đầy div
                    objectFit="cover" // Đảm bảo ảnh không bị méo
                    className="w-full h-full"
                  />
                </div>
                <h1 className="flex justify-center mt-4 bottom-10 left-10 text-4xl font-bold">
                  {collections[currentBannerIndex].name}
                </h1>
                <p className="flex justify-center bottom-4 left-10 text-lg">
                  {collections[currentBannerIndex].description}
                </p>
                <button
                  onClick={handlePreviousBanner}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-opacity-75 hover:scale-110"
                >
                  ◀
                </button>
                <button
                  onClick={handleNextBanner}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-opacity-75 hover:scale-110"
                >
                  ▶
                </button>
              </div>
            </div>
          )}
        </main>
        <style jsx>{`
          .image-container {
            position: relative;
            width: 100%;
            height: 500px; /* Chiều cao cố định cho ảnh */
          }

          .image-container img {
            object-fit: cover; /* Đảm bảo ảnh sẽ không bị méo và lấp đầy không gian */
            width: 100%;
            height: 100%;
          }
        `}</style>

        <section className="categories-section mt-8">
          <div className="categories-grid">
            <div className="category-item large">
              <div className="category-image-container">
                <img
                  src="https://global.bonanzasatrangi.com/cdn/shop/files/Tile-Banner-1800-x1800_a20b3f6d-ce63-4e9c-ac3b-d51cb8f754a3_1000x.jpg?v=1730972167"
                  alt="Winter Unstitched"
                />
                <div className="category-overlay">
                  <h3>WINTER UNSTITCHED</h3>
                  <Link href="/producttypes?collection=6773f359dff9956088b6a892">
                    <button className="shop-now-btn">SHOP NOW</button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="category-item">
              <div className="category-image-container">
                <img
                  src="https://global.bonanzasatrangi.com/cdn/shop/files/Tile-Banner-WomensToReady-600-x600_400x.jpg?v=1729627405"
                  alt="Ready to Wear"
                />
                <div className="category-overlay">
                  <h3>READY TO WEAR</h3>
                  <Link href="http://localhost:3000/producttypes?collection=67619aeff042177ed710cbef">
                    <button className="shop-now-btn">SHOP NOW</button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="category-item">
              <div className="category-image-container">
                <img
                  src="https://global.bonanzasatrangi.com/cdn/shop/files/Sweaters_tile_400x.jpg?v=1729627570"
                  alt="Men's Unstitched"
                />
                <div className="category-overlay">
                  <h3>MEN'S UNSTITCHED</h3>
                  <button className="shop-now-btn">SHOP NOW</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          .categories-section {
            padding: 2rem;
          }

          .categories-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          .category-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .category-item.large {
            grid-column: span 2;
            grid-row: span 2;
          }

          .category-image-container {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .category-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .category-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .category-item:hover .category-overlay {
            opacity: 1;
          }

          .category-item:hover .category-image-container img {
            transform: scale(1.1);
          }

          .category-overlay h3 {
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            transform: translateY(20px);
            transition: transform 0.3s ease;
          }

          .shop-now-btn {
            padding: 0.8rem 2rem;
            background: white;
            color: black;
            border: none;
            border-radius: 4px;
            font-weight: 500;
            transform: translateY(20px);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .category-item:hover .category-overlay h3,
          .category-item:hover .shop-now-btn {
            transform: translateY(0);
          }

          .shop-now-btn:hover {
            background: black;
            color: white;
            transform: translateY(0) scale(1.05);
          }

          @media (max-width: 768px) {
            .categories-grid {
              grid-template-columns: 1fr;
            }

            .category-item.large {
              grid-column: auto;
              grid-row: auto;
            }
          }
        `}</style>
        {/* New Arrivals Section */}
        <section className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">New Arrivals</h3>
          {products.length > 0 && (
            <div className="relative w-4/5 overflow-hidden">
              {/* Product Slide Container */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentIndex * (100 / visibleCount)
                  }%)`,
                  width: `products.length`,
                }}
              >
                {/* Individual Product Cards */}
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex justify-center items-center"
                    style={{ width: `${100 / visibleCount}%` }}
                    onClick={() => hanldeReToDetail(product._id, product.type)}
                  >
                    <div className="relative p-4 box-border w-80 category-item">
                      <div className="category-image-container">
                        <Image
                          src={product.images[0] || "/placeholder.png"}
                          alt={product.name}
                          width={300}
                          height={400}
                          className="object-cover w-80 h-auto"
                        />
                        {/* Overlay */}
                        <div className="category-overlay">
                          <h3>{product.name}</h3>
                          <button className="shop-now-btn">SHOP NOW</button>
                          <button
                            className="add-to-cart-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product._id, product.price);
                              toggleDrawer(true);
                            }}
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-lg font-bold">${product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-opacity-75 hover:scale-110 disabled:bg-opacity-30 disabled:cursor-not-allowed"
              >
                ◀
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-opacity-75 hover:scale-110 disabled:bg-opacity-30 disabled:cursor-not-allowed"
              >
                ▶
              </button>
            </div>
          )}
        </section>

        <style jsx>{`
          /* Product Card Container */
          .category-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          /* Hover Effects - Overlay and Image */
          .category-image-container {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .category-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .category-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .category-item:hover .category-overlay {
            opacity: 1;
          }

          .category-item:hover .category-image-container img {
            transform: scale(1.1);
          }

          /* Overlay Text */
          .category-overlay h3 {
            color: #e0e0e0; /* Lighter color for the title */
            font-size: 1.2rem; /* Smaller font size */
            font-weight: 300; /* Lighter weight */
            margin-bottom: 1rem;
            transform: translateY(20px);
            transition: transform 0.3s ease;
          }

          .category-overlay button {
            font-size: 0.8rem; /* Smaller button text */
            font-weight: 400; /* Lighter button text */
            margin-top: 10px;
          }

          /* Shop Now Button */
          .shop-now-btn {
            padding: 0.8rem 2rem;
            background: white;
            color: black;
            border: none;
            border-radius: 4px;
            font-weight: 400;
            transform: translateY(20px);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .add-to-cart-btn {
            padding: 0.8rem 2rem;
            background: white;
            color: black;
            border: none;
            border-radius: 4px;
            font-weight: 400;
            transform: translateY(20px);
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .category-item:hover .category-overlay h3,
          .category-item:hover .shop-now-btn,
          .category-item:hover .add-to-cart-btn {
            transform: translateY(0);
          }

          .shop-now-btn:hover,
          .add-to-cart-btn:hover {
            background: black;
            color: white;
            transform: translateY(0) scale(1.05);
          }

          @media (max-width: 768px) {
            .categories-grid {
              grid-template-columns: 1fr;
            }

            .category-item.large {
              grid-column: auto;
              grid-row: auto;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}