import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      setMessage(res.data.message || "Signup successful!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="userName" placeholder="Name" onChange={handleChange} required /> <br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /> <br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /> <br />
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
