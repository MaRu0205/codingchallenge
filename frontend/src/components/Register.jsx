import { h } from 'preact';
import { useState } from 'preact/hooks';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profileImage: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (formData.profileImage) {
            data.append('profile_image', formData.profileImage);
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/customer-api/register/', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const result = await response.json();
            console.log('Registration successful:', result);
            // Handle successful registration (e.g., redirect to login or homepage)
        } catch (error) {
            console.error('Registration failed:', error);
            // Handle registration error (e.g., show error message to the user)
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="py-4 px-8">
                    <div className="text-gray-900 font-bold text-3xl text-center mb-4">Sign Up</div>
                    <form onSubmit={handleSubmit}>
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
        </div>
    );
};

export default Register;
