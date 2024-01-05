import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';


const Register = () => {
    // Registration form state
    const [registerFormData, setRegisterFormData] = useState({
        username: '',
        email: '',
        password: '',
        profileImage: null,
    });

    // Login form state
    const [loginFormData, setLoginFormData] = useState({
        username: '',
        password: '',
    });

    // Handle change for registration form
    const handleRegisterChange = (e) => {
        const { name, value, files } = e.target;
        setRegisterFormData({
            ...registerFormData,
            [name]: files ? files[0] : value,
        });
    };

    // Handle change for login form
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({
            ...loginFormData,
            [name]: value,
        });
    };

    // Handle submit for registration form
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('username', registerFormData.username);
        data.append('email', registerFormData.email);
        data.append('password', registerFormData.password);
        if (registerFormData.profileImage) {
            data.append('profile_image', registerFormData.profileImage);
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/customer-api/register/', {
                method: 'POST',
                body: data,
            });
    
            const jsonResponse = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', jsonResponse.access); // Use the correct key

                // Dispatch the authChange event to update the Header
                window.dispatchEvent(new Event('authChange'));
                
                route('/myaccount');
            } else {
                throw new Error('Failed to register');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };
    

    // Handle submit for login form
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/customer-api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginFormData),
            });
    
            if (!response.ok) {
                throw new Error(`Login failed with status: ${response.status}`);
            }
    
            const jsonResponse = await response.json();
            localStorage.setItem('accessToken', jsonResponse.access);
            localStorage.setItem('refreshToken', jsonResponse.refresh);

            // Dispatch the authChange event to update the Header
            window.dispatchEvent(new Event('authChange'));
    
            // Navigate to the My Account page
            route('/myaccount');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    
    return (
        <div className="container mx-auto p-8 flex justify-around">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden p-5">
                <div className="mb-4">
                    <h2 className="text-gray-900 font-bold text-xl text-center">Already Customer?</h2>
                </div>
                <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Username"
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleLoginChange}
                                required
                            />
                        </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>

            <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden p-5">
                <div className="mb-4">
                    <h2 className="text-gray-900 font-bold text-xl text-center">Register now</h2>
                </div>
                <form onSubmit={handleRegisterSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Username"
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleRegisterChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">
                                Profile Image (optional)
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="profileImage"
                                type="file"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleRegisterChange}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Register
                            </button>
                        </div>
                    </form>
            </div>
        </div>
    );
};

export default Register;