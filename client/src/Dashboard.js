import { useEffect, useState } from "react";

function Dashboard({ token }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  // Fetch existing notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setNotes(data.notes);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new note
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/notes/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        setNotes([...notes, data.note]); // Add new note to the list
        setForm({ title: "", description: "" }); // Clear form
      }
    } catch (err) {
      console.error("Error uploading note:", err);
      setMessage("Error uploading note");
    }
  };

  return (
    <div>
      <h2>Your Notes</h2>

      {/* Upload form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: "10px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ display: "block", marginBottom: "10px" }}
        ></textarea>
        <button type="submit">Add Note</button>
      </form>

      <p>{message}</p>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note._id}>
              <strong>{note.title}</strong> - {note.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
