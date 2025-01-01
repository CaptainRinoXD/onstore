'use client';
import { useEffect, useState } from 'react';
import ProductDetail from '@/app/components/product/ProductDetail';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    console.log('Product ID:', id);  // Kiểm tra ID

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/products/${id}`);
        const data = await response.json();
        console.log("product: " + data);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return <ProductDetail product={product} />;
}