import { useState } from "react";
import axios from "axios";

function UploadNote() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    file: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("file", form.file);

      const res = await axios.post("http://localhost:5000/api/notes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Note uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error uploading note");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Note</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          rows="3"
          style={{ display: "block", marginBottom: "10px", width: "300px" }}
        ></textarea>

        {/* ✅ Added Category Field */}
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Math, Science)"
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <input
          type="file"
          name="file"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />

        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default UploadNote;
