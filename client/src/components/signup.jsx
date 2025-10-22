import { useState } from "react";
import axios from "axios";

export default function Signup() {
    const [formData, setFormData] = useState({
        userName : "",
        email : "",
        password : ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, formData);
            alert(res.data.message);
        }
        catch (error){
            alert(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="userName" placeholder="Username" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}