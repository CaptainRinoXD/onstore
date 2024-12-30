// Layout.tsx
"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { checkUserAuthStatus, logoutUser, fetchProductTypes } from "@/utils/services"; 
import StoreProvider from '@/redux/StoreProvider';

interface LayoutProps {
  children: ReactNode;
}

 interface ProductType {
     _id: string;
     name: string;
     image: string;
     description?: string;
     createdAt?: Date;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    const authCheck = async () => {
      try {
          const data = await checkUserAuthStatus();
          if (data.isLoggedIn) {
            setUserLoggedIn(true);
            setUsername(data.username);
            setShowUserModal(true);
          } else if (data.isGuested) {
            return;
          }
      } catch (error) {
        setUserLoggedIn(false);
        //window.location.href = '/login';
      }
    };
    authCheck();
  }, []);

  const handleLogout = async () => {
    try {
        await logoutUser();
      setUserLoggedIn(false);
      setUsername("");
      setShowUserModal(false);
    } catch (error) {
        console.error("Error during logout:", error);
    }
  };

  const toggleUserModal = async () => {
    if (!isUserLoggedIn) {
        try {
          const data = await checkUserAuthStatus();
          if (data.isLoggedIn) {
            setUserLoggedIn(true);
            setUsername(data.username);
            setShowUserModal(true);
          } else {
            setUserLoggedIn(false);
            window.location.href = '/login';
          }
        } catch (error) {
          window.location.href = '/login';
        }
    } else {
        setShowUserModal(!showUserModal);
    }
  };

  const fetchProductTypesData = async () => {
    if (productTypes.length > 0) return; // Avoid fetching again if already loaded
    try {
      const data = await fetchProductTypes();
      setProductTypes(data);
    } catch (error) {
      console.error("Error during fetching product types:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-4 w-full ">
      <StoreProvider>
      <Header
        isUserLoggedIn={isUserLoggedIn}
        username={username}
        showUserModal={showUserModal}
        toggleUserModal={toggleUserModal}
        handleLogout={handleLogout}
        productTypes={productTypes}
        fetchProductTypes={fetchProductTypesData}
        isSearchVisible={isSearchVisible}
        setSearchVisible={setSearchVisible}
      />
      <main className="flex-grow mt-16">{children}</main>
      <Footer />
      </StoreProvider>
    </div>
  );
};

export default Layout;