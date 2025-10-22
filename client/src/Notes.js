import { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }

    axios.get("http://localhost:5000/api/notes", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setNotes(res.data.notes))
    .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Notes</h1>
      {notes.length > 0 ? (
        notes.map((n) => <p key={n._id}>{n.title}</p>)
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}

export default Notes;
