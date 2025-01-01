'use client';
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import Layout from '@/app/components/Layout'; // Import Layout

// Định nghĩa kiểu cho ProductDetailProps
interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    color: string;
    images: string[];
    details: {
      shirt: string;
      dupatta: string;
      trouser: string;
    };
  };
}

const ProductDetailContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 80px 1fr 400px;
  gap: 30px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  img {
    width: 100%;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }
`;

const MainImage = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const ProductInfo = styled.div`
  padding: 20px;

  h1 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .price-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 15px 0;

    .current-price {
      color: #e53e3e;
      font-size: 24px;
      font-weight: bold;
    }

    .original-price {
      text-decoration: line-through;
      color: #718096;
    }

    .discount {
      background: #fed7d7;
      color: #e53e3e;
      padding: 2px 8px;
      border-radius: 4px;
    }
  }
`;

const ColorSelector = styled.div`
  margin: 20px 0;
  
  .color-status {
    font-size: 16px;
    color: #38a169; /* Màu xanh lá cây */
    font-weight: bold;
    margin-bottom: 10px;
  }

  .color-options {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  .color-option {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s;
    border: 2px solid transparent;

    &:hover {
      transform: scale(1.1);
    }

    &.selected {
      border-color: #4299e1;
    }
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #2d3748;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4a5568;
    transform: translateY(-2px);
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;

  button {
    padding: 5px 12px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: black;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgb(240 240 240);
      color: black;
    }
  }

  span {
    min-width: 40px;
    text-align: center;
  }
`;

const ProductDetails = styled.div`
  margin-top: 30px;

  .details-header {
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .details-content {
    padding: 15px 0;
    line-height: 1.6;
  }
`;

// Related Products Section
const RelatedProductsSection = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
`;

const RelatedProductsHeader = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #e53e3e;
  }
`;

const ProductsContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const ProductsWrapper = styled(motion.div)`
  display: flex;
  width: 1050px;
  margin-left: 55px;
  gap: 20px;
`;

const ProductCard = styled(motion.div)`
  flex: 0 0 calc(25% - 15px);
  position: relative;
  
  .image-container {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    
    img {
      width: 100%;
      height: auto;
      transition: transform 0.3s ease;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
    }
    
    .action-button {
      background: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transform: translateY(20px);
      transition: all 0.3s ease;
      
      &:hover {
        background: #e53e3e;
        color: white;
      }
    }
  }

  &:hover {
    .image-container {
      img {
        transform: scale(1.05);
      }
      
      .overlay {
        opacity: 1;
      }
      
      .action-button {
        transform: translateY(0);
      }
    }
  }
`;

const ProductInfoCard = styled.div`
  padding: 15px 0;
  text-align: center;
  
  h3 {
    margin: 0;
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .price {
    display: flex;
    justify-content: center;
    gap: 10px;
    
    .current {
      color: #e53e3e;
      font-weight: bold;
    }
    
    .original {
      text-decoration: line-through;
      color: #718096;
    }
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: gray;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e53e3e;
    color: black;
  }
  
  &.prev {
  padding-bottom: 3px;
    left: 0px;
  }
  
  &.next {
    padding-bottom: 3px;

    right: 0px;
  }
`;

// Related Products Component
const RelatedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const relatedProducts = [
    {
      id: 1,
      name: "BENNY FIDORE - 3 PC",
      price: 26,
      originalPrice: 32,
      image: "/path-to-image-1.jpg"
    },
    // Add more products...
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === relatedProducts.length - 4 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? relatedProducts.length - 4 : prev - 1
    );
  };

  return (
    <RelatedProductsSection>
      <RelatedProductsHeader>RELATED PRODUCTS</RelatedProductsHeader>
      <ProductsContainer>
        <NavigationButton className="prev" onClick={handlePrev}>
          ←
        </NavigationButton>
        <NavigationButton className="next" onClick={handleNext}>
          →
        </NavigationButton>
        
        <ProductsWrapper
          animate={{ x: -currentIndex * (100 / 4 + 20) + '%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {relatedProducts.map((product) => (
            <ProductCard key={product.id}>
              <div className="image-container">
                <img src={product.image} alt={product.name} />
                <div className="overlay">
                  <motion.div 
                    className="action-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaHeart />
                  </motion.div>
                  <motion.div 
                    className="action-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShareAlt />
                  </motion.div>
                </div>
              </div>
              <ProductInfo>
                <h3>{product.name}</h3>
                <div className="price">
                  <span className="current">${product.price}</span>
                  <span className="original">${product.originalPrice}</span>
                </div>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsWrapper>
      </ProductsContainer>
    </RelatedProductsSection>
  );
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Layout>
      <ProductDetailContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ThumbnailContainer>
          {product.images.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt={`Product ${index + 1}`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </ThumbnailContainer>
        
        <MainImage>
          <img src={selectedImage} alt={product.name} />
        </MainImage>

        <ProductInfo>
          <h1>{product.name}</h1>
          
          <div className="price-section">
            <span className="current-price">${product.price}</span>
            <span className="original-price">${product.originalPrice}</span>
            <span className="discount">{product.discount}% OFF</span>
          </div>

          <ColorSelector>
            <div className="color-status">In Stock</div>
            <div>COLOR: {product.color}</div>
            <div className="color-options">
              <div 
                className={`color-option ${product.color === 'L-GREEN' ? 'selected' : ''}`}
                style={{ backgroundColor: '#90EE90' }}
              />
            </div>
          </ColorSelector>

          <QuantitySelector>
            <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} style={{backgroundColor: "#fff"}}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} style={{backgroundColor: "#fff"}}>+</button>
          </QuantitySelector>

          <AddToCartButton>ADD TO CART</AddToCartButton>

          <ProductDetails>
            <div 
              className="details-header"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>PRODUCT DETAILS</span>
              <span>{showDetails ? '−' : '+'}</span>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  className="details-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}  /* Thêm hiệu ứng khi ẩn */
                  transition={{ duration: 0.5 }}
                >
                  <p><strong>Shirt:</strong> {product.details.shirt}</p>
                  <p><strong>Dupatta:</strong> {product.details.dupatta}</p>
                  <p><strong>Trouser:</strong> {product.details.trouser}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </ProductDetails>
        </ProductInfo>
      </ProductDetailContainer>

      {/* Thêm phần Related Products */}
      <RelatedProducts />
    </Layout>
  );
};

export default ProductDetail;
