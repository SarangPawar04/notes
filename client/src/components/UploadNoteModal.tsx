import { useState } from "react";
import { Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface UploadNoteModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (note: unknown) => void; // kept but not used directly now
}

export const UploadNoteModal = ({ open, onClose, onUpload }: UploadNoteModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"local" | "link">("local");
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [preview, setPreview] = useState("");
  const categories = [
    "Science",
    "Maths",
    "History",
    "Geography",
    "Literature",
    "Art",
    "Music",
    "Technology",
    "Other",
  ];
  const [category, setCategory] = useState<string>(categories[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (mode === "local") {
        if (!file) return;
        
        // First upload the file to get the URL
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        
        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.message || 'File upload failed');
        }
        
        const { fileUrl } = await uploadRes.json();
        
        // Then create the note with the file URL
        const res = await fetch("/api/notes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            title, 
            description, 
            category, 
            fileUrl 
          }),
        });
        
        const data = await res.json();
        if (res.ok && data?.success) {
          onUpload?.(data.note || null);
          handleClose();
        } else {
          throw new Error(data.message || 'Failed to create note');
        }
      } else {
        // Handle link mode (unchanged)
        if (!linkUrl) return;
        const res = await fetch("/api/notes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, category, fileUrl: linkUrl }),
        });
        const data = await res.json();
        if (res.ok && data?.success) {
          onUpload?.(data.note || null);
          handleClose();
        } else {
          throw new Error(data.message || 'Failed to create note');
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // You might want to show an error message to the user here
      alert(error.message || 'An error occurred while uploading the file');
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setMode("local");
    setFile(null);
    setLinkUrl("");
    setPreview("");
    setCategory(categories[0]);
    onClose();
  };

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f && f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload Note</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-2">
          <div className="space-y-2">
            <Label>Source</Label>
            <div className="flex gap-3">
              <Button type="button" variant={mode === "local" ? "default" : "outline"} onClick={() => setMode("local")}>Local file</Button>
              <Button type="button" variant={mode === "link" ? "default" : "outline"} onClick={() => setMode("link")}>Link</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Note File/Link</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreview("");
                      setFile(null);
                      setLinkUrl("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div className="space-y-2">
                    {mode === "local" ? (
                      <Input id="file" type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} required />
                    ) : (
                      <Input id="link" placeholder="https://drive.google.com/... or https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Calculus Chapter 5 Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what's covered in these notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" className="w-full border rounded-md h-10 px-3 bg-background" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end sticky bottom-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50 py-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
              Upload Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
