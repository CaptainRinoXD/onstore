// src/app/components/Header.tsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { MenuItem } from '@mui/material';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MainDrawerList from './main/main.drawerlist';
import { fetchNewestCollections } from "@/utils/services";
import { useRouter } from "next/navigation";
import path from 'path';

interface ProductType {
    _id: string;
    name: string;
    image: string;
}

interface CollectionType {
    _id: string;
    name: string;
    images: string;
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
    isEmmployee: boolean;
    isAdmin: boolean;
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
    setSearchVisible,
    isEmmployee,
    isAdmin
}) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [newestCollections, setNewestCollections] = useState<CollectionType[]>([]);
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isSearchVisible) {
            searchInputRef.current?.focus();
        }
    }, [isSearchVisible]);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        setIsDarkMode(storedTheme === 'dark' || (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches));
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleMenu = () => setMenuOpen(prev => !prev);

    const MenuItemH = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
        <li className="relative group transition-all hover-to-show-link">
            <Link href={href} className={`${className} cursor-pointer hover:text-blue-300 active:text-blue-500 transition-all duration-300`}>
                <strong>{children}</strong>
            </Link>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-300 transition-all duration-300 group-hover:w-full"></span>
        </li>
    );

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const ProductTypeLinks = () => (
        <div className={`absolute transform -translate-x-1/3 translate-y-5 group-hover:translate-y-0 hover-to-show w-auto transition duration-500 ease-in-out rounded-md z-10 group-hover:flex p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} style={{ marginTop: "20px" }}>
            <div className="flex space-x-4">
                {productTypes.map(type => (
                    <div key={type._id} className="flex flex-col items-center p-2 w-40">
                        <div className="relative overflow-hidden w-32 h-32 mb-2 transform transition-transform duration-300 hover:scale-110" onClick={() => router.push(`/producttypes?type=${type._id}`)}>
                            <img src={type.image} alt={type.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-center transition-all duration-300 hover:text-blue-500">
                            {type.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    

    const NewArrivalsLinks = () => (
        <div className={`absolute transform -translate-x-1/3 translate-y-5 group-hover:translate-y-0 hover-to-show w-auto transition duration-500 ease-in-out rounded-md z-10 group-hover:flex p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} style={{ marginTop: "20px" }}>
            <div className="flex space-x-4">
                {newestCollections.map(collection => (
                    <div key={collection._id} className="flex flex-col items-center p-2 w-40">
                        <Link href={`/producttypes?collection=${collection._id}`} className="flex flex-col items-center">
                            <div className="relative overflow-hidden w-32 h-32 mb-2 transform transition-transform duration-300 hover:scale-110">
                                <img src={getImageURL(collection.images)} alt={collection.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-center transition-all duration-300 hover:text-blue-500">
                                {collection.name}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );

    const handleSearchInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`http://localhost:3002/api/product_search/search?query=${encodeURIComponent(query)}`); // Use encodeURIComponent to ensure the query is URL-safe
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error during search:', error);
            setSearchResults([]);
        }
    }, []);

    const handleOutsideClick = (event: MouseEvent) => {
        if (isSearchVisible && searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
            setSearchVisible(false);
            setSearchResults([]);
            setSearchQuery("");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isSearchVisible]);

    const handleSearchResultClick = (product: any) => {
        setSearchVisible(false);
        setSearchResults([]);
        setSearchQuery("");
        router.push(`/products/${product._id}`);
    };
    const getImageURL = (imageName: string) => {
        const baseName = path.parse(imageName).name; // Get the filename without extension
        const url = `http://localhost:3002/api/images/${baseName}`;
        console.log("getImageURL called with:", imageName, "URL:", url); // Add this line
        return url;
      };

    return (
        <header className={`fixed top-0 w-full flex justify-between items-center shadow-md p-2 z-50 pt-4 pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ fontWeight: "lighter" }}>
            <button onClick={toggleMenu} className="md:hidden focus:outline-none" aria-label="Toggle menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            <nav className={`flex-grow items-center justify-center md:flex ml-50percentage ${isMenuOpen ? 'hidden' : 'hidden md:flex'}`}>
                <ul className="flex space-x-6">
                    <MenuItemH href="/" className="relative group transition-all hover-to-show-link">
                        Homepage
                    </MenuItemH>
                    <li className="relative group transition-all hover-to-show-link" onMouseEnter={fetchProductTypes}>
                        <a href="/producttypes" className="cursor-pointer hover:text-blue-300 active:text-blue-500 transition-all duration-300">
                            <strong>Shop</strong>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-300 transition-all group-hover:w-full active:w-full"></span>
                        </a>
                        <ProductTypeLinks />
                    </li>
                    <li className="relative group transition-all hover-to-show-link" onMouseEnter={async () => {
                            if (newestCollections.length === 0) {
                                const collections = await fetchNewestCollections();
                                setNewestCollections(collections);
                            }
                        }}>
                        <a href="/producttypes" className="cursor-pointer hover:text-blue-300 active:text-blue-500 transition-all duration-300">
                            <strong>New Arrivals</strong>
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-300 transition-all group-hover:w-full active:w-full"></span>
                        </a>
                        <NewArrivalsLinks />
                    </li>
                    <MenuItemH href="/contact" className="relative group transition-all hover-to-show-link">
                        Contact
                    </MenuItemH>
                    <MenuItemH href="/sale-deals" className="relative group transition-all hover-to-show-link">
                        Sale Deals
                    </MenuItemH>
                </ul>
            </nav>

            <div className={`fixed top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className="p-4">
                    <button onClick={toggleMenu} className="focus:outline-none mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <ul className="flex flex-col space-y-4">
                        <MenuItemH href="/" className="relative group transition-all hover-to-show-link">
                            Homepage
                        </MenuItemH>
                        <li className="relative group transition-all hover-to-show-link" onMouseEnter={fetchProductTypes}>
                            <a href="/producttypes" className="cursor-pointer hover:text-blue-300 active:text-blue-500 transition-all duration-300">
                                <strong>Shop</strong>
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-300 transition-all group-hover:w-full active:w-full"></span>
                            </a>
                            <ProductTypeLinks />
                        </li>
                        <li className="relative group transition-all hover-to-show-link" onMouseEnter={async () => {
                            if (newestCollections.length === 0) {
                                const collections = await fetchNewestCollections();
                                setNewestCollections(collections);
                            }
                        }}>
                            <a href="#" className="cursor-pointer hover:text-blue-300 active:text-blue-500 transition-all duration-300">
                                <strong>New Arrivals</strong>
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-300 transition-all group-hover:w-full active:w-full"></span>
                            </a>
                            <NewArrivalsLinks />
                        </li>
                        <MenuItemH href="/contact" className="relative group transition-all hover-to-show-link">
                            Contact
                        </MenuItemH>
                        <MenuItemH href="/sale-deals" className="relative group transition-all hover-to-show-link">
                            Sale Deals
                        </MenuItemH>
                    </ul>
                </div>
            </div>

            <div className="relative flex items-center mr-2">
                <div className="flex items-center relative mr-4">
                    <div className={`transition-all duration-500 ease-in-out ${isSearchVisible ? 'w-64' : 'w-0'} overflow-hidden`}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border-gray-300 rounded px-2 py-1 w-full text-black dark:text-white dark:bg-transparent focus:outline-none focus:ring-0"
                            autoFocus
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            ref={searchInputRef}
                        />
                    </div>
                    <div ref={searchResultsRef} className={`absolute z-10 mt-1 bg-white shadow-md max-h-60 overflow-y-auto w-full border rounded top-12 ${!isSearchVisible || searchResults.length === 0 ? 'hidden' : ''}`}>
                        {searchResults.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => handleSearchResultClick(product)}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2"
                            >
                                {product.images && product.images.length > 0 && <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />}
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-gray-600">${product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setSearchVisible(prev => !prev)} className="bg-transparent border-none focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>

                <div className="relative cursor-pointer mr-4">
                    <div onClick={toggleDrawer(true)}>
                        <ShoppingCartOutlinedIcon />
                    </div>
                    <span className="absolute top-[-10px right-[-10px] bg-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">1</span>
                </div>

                <div className="relative cursor-pointer" onClick={toggleUserModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
            </div>

            {showUserModal && (
                <UserModal username={username} handleLogout={handleLogout} toggleUserModal={toggleUserModal} isAdmin={isAdmin} isEmmployee={isEmmployee} />
            )}

            <MainDrawerList
                toggleDrawer={toggleDrawer}
                open={open}
            />
        </header>
    );
};

const UserModal: React.FC<{ username: string; handleLogout: () => void; toggleUserModal: () => void; isAdmin: boolean; isEmmployee: boolean; }> = ({ username, handleLogout, toggleUserModal, isAdmin, isEmmployee }) => {
    const router = useRouter();
    return (
        <div className="absolute top-16 right-5 bg-white shadow-md p-6 rounded-lg z-20 w-72 border border-gray-200">
            <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <p className="font-semibold text-lg">Hi {username}</p>
                </div>
                <hr className="w-full border-gray-300" />
                <button className="flex items-center space-x-2 w-full text-left">
                    <p>Your information</p>
                </button>
                <button className="flex items-center space-x-2 w-full text-left">
                    <Link href={'/order'}>
                        <p>Your orders</p>
                    </Link>
                </button>
                <hr className="w-full border-gray-300" />
                <p className="text-sm italic text-gray-500 text-center">
                    Clothes aren't going to change the world. <br /> The women who wear them will.
                </p>
                <div className="flex space-x-2 w-full">
                    <button onClick={toggleUserModal} className="flex-grow py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100">Close</button>
                    <button onClick={handleLogout} className="flex-grow py-2 rounded border border-gray-400 bg-red-500 text-white hover:bg-red-600">Logout</button>
                    {isAdmin || isEmmployee ? (
                        <button onClick={() => router.push(`/dashboard`)} className="flex-grow py-2 rounded border border-gray-400 bg-red-500 text-white hover:bg-red-600">Dashboard</button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Header;