// Header.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface ProductType {
  _id: string;
  name: string;
  image: string;
}

interface HeaderProps {
    isUserLoggedIn: boolean;
    username: string;
    showUserModal: boolean;
    toggleUserModal: () => void;
    handleLogout: () => void;
    productTypes: ProductType[];
    fetchProductTypes: () => void;
    isSearchVisible: boolean;
    setSearchVisible: (visible: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    isUserLoggedIn, 
    username, 
    showUserModal, 
    toggleUserModal, 
    handleLogout,
    productTypes,
    fetchProductTypes,
    isSearchVisible,
    setSearchVisible
    }) => {
    return (
    <header className="flex justify-between items-center shadow-md">
        <nav className="flex-grow flex items-center justify-center ">
            <ul className="flex space-x-6 ml-50percentage">
                <li><Link href="/"><strong>Homepage</strong></Link></li>
                <li 
                    onMouseEnter={() => {
                        fetchProductTypes(); // Fetch product types when hovering
                    }}
                    className="relative group transition-all mb-4 hover-to-show-link"
                >
                    <strong>Shop</strong>
                    <div className="absolute transform -translate-x-1/3 hover-to-show bg-white shadow-inner w-auto transition-all rounded-md z-10 group-hover:flex p-2" style={{}}>
                    <div className="flex space-x-4">
                        {productTypes.map((type) => (
                        <div key={type._id} className="flex flex-col items-center p-2 w-40">
                            <Link href={`/shop/${type._id}`} className="flex flex-col items-center">
                                <img src={type.image} alt={type.name} className="w-32 h-32 object-cover  mb-2" />
                                <span className="font-semibold text-center">{type.name}</span>
                            </Link>
                        </div>
                        ))}
                    </div>
                    </div>
                </li>
                <li><Link href="/new-arrivals"><strong>New Arrivals</strong></Link></li>
                <li><Link href="/contact"><strong>Contact</strong></Link></li>
                <li><Link href="/sale-deals"><strong>Sale Deals</strong></Link></li>
            </ul>
        </nav>
        <nav className="flex items-center ml-4 mr-4 mb-4">
            {/* Search icon */}
            <div className="flex items-center relative mr-4">
            <button
                onClick={() => setSearchVisible(!isSearchVisible)} // Toggle search box visibility
                className="bg-transparent border-none focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            </div>

            {/* Cart Icon */}
            <div className="relative cursor-pointer mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="absolute top-[-10px] right-[-10px] bg-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">1</span>
            </div>

            {/* Sign In Account */}
            <div className="relative cursor-pointer" onClick={toggleUserModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </div>
        </nav>
            
        {/* User modal */}
        {showUserModal && (
            <div className="absolute top-16 right-5 bg-white shadow-md p-6 rounded-lg z-10 w-72 border border-gray-200">
            <div className="flex flex-col items-center space-y-4">
                {/* Greeting */}
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <p className="font-semibold text-lg">Hi {username}</p>
                </div>
                <hr className="w-full border-gray-300" />

                {/* Your information */}
                <button className="flex items-center space-x-2 w-full text-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <p>Your information</p>
                </button>

                {/* Your orders */}
                <button className="flex items-center space-x-2 w-full text-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                <p>Your orders</p>  
                </button>
                {/* Divider */}
                <hr className="w-full border-gray-300" />

                {/* Quote */}
                <p className="text-sm italic text-gray-500 text-center">
                Clothes aren't going to change the world.
                <br />
                The women who wear them will.
                </p>

                {/* Action buttons */}
                <div className="flex space-x-2 w-full">
                    <button
                        onClick={() => toggleUserModal()}
                        className="flex-grow py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
                    >
                    Close
                    </button>
                    <button
                    onClick={handleLogout}
                    className="flex-grow py-2 rounded border border-gray-400 bg-red-500 text-white hover:bg-red-600"
                    >
                    Logout
                    </button>
                </div>
            </div>
            </div>
        )}
    
        {/* Search modal box */}
        {isSearchVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-bold mb-4">Search</h2>
                <input 
                type="text" 
                placeholder="Search..."
                className="border border-gray-300 rounded px-2 py-1 w-full" 
                />
                <button 
                onClick={() => setSearchVisible(false)} 
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                Close
                </button>
            </div>
            </div>
        )}
    </header>
  );
};

export default Header;