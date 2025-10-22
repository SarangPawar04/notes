import { useState } from "react";
import axios from "axios";

export default function Login() {
    const [formData, setFormData] = useState({
        email : "",
        password : "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, formData);
            localStorage.setItem("token", res.data.token);
            alert("Login successful");
        }
        catch (error){
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}