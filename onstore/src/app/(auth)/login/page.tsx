"use client"; 
import { MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/Layout";

export default function LoginPage() { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login, setLoginStatus] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3002/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Include cookies in the request
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log('Login successful:', data.accessToken);
            setLoginStatus("Login successful");

            // Store the access token in localStorage
            localStorage.setItem('id', data.id);
            localStorage.setItem('accessToken', data.accessToken);
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    useEffect(() => {
        const cookies = document.cookie.split('; ');
        const refreshToken = cookies.find(cookie => cookie.startsWith('refreshToken='));
    
        if (refreshToken) {
          alert('You are already logged in.');
        }
    }, []);

    const handleCreateAccount: MouseEventHandler<HTMLButtonElement> = (event) => {
        router.push('/register');
    };
    
    return ( 
        <Layout>
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col w-full max-w-2xl p-6 border rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-4">My Account</h1>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {login && <p className="text-green-500 text-center">{login}</p>}

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">LOGIN</h2>
                        <p>If you have an account with us, please log in.</p>
                        <form className="mt-4" onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                            >
                                SIGN IN
                            </button>
                        </form>
                        <p className="mt-4 text-sm text-center">
                            <a href="#" className="text-blue-500 hover:underline">Forgot your password?</a>
                        </p>
                    </div>

                    <div className="border-t my-6"></div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">NEW CUSTOMER?</h2>
                        <p>Registering for this site allows you to access your order status and history. We'll get a new account set up for you in no time.</p>
                        <button 
                            className="mt-4 w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                            onClick={handleCreateAccount}
                        >
                            CREATE AN ACCOUNT
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    ); 
}