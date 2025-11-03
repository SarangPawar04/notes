import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Profile } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Auth } from "./pages/Auth";
import Reset from "./pages/Reset";
import { Navigation } from "./components/Navigation";
import { UploadNoteModal } from "./components/UploadNoteModal";
import { SearchResults } from "./pages/SearchResults";
// import { mockNotes } from "./data/mockData";
import { Note, Comment, UserProfile } from "./types/note";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [savedNoteIds, setSavedNoteIds] = useState<Set<string>>(new Set());
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [comments, setComments] = useState<{ [noteId: string]: Comment[] }>({});
  const [userRatings, setUserRatings] = useState<{ [noteId: string]: number }>({});
  const { toast } = useToast();

  const isAuthenticated = currentUser !== null || isGuest;

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsGuest(false);
    sessionStorage.setItem('fromAuth', 'true');
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setCurrentUser(null);
    sessionStorage.setItem('fromAuth', 'true');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsGuest(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem('fromAuth');
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  const handleSaveToggle = async (noteId: string) => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please login to save notes.",
        variant: "destructive",
      });
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
    const isSaved = savedNoteIds.has(noteId);
    const res = await fetch(`/api/saved/${noteId}`, {
      method: isSaved ? "DELETE" : "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSavedNoteIds((prev) => {
        const next = new Set(prev);
        if (isSaved) {
          next.delete(noteId);
          toast({ title: "Note removed", description: "Removed from saved." });
        } else {
          next.add(noteId);
          toast({ title: "Note saved", description: "Added to saved." });
        }
        return next;
      });
    }
  };

  const handleUpload = () => {
    // After modal reports success, refresh notes from backend
    void fetchNotes();
    toast({ title: "Note uploaded", description: "Your note has been shared!" });
  };

  const handleAddComment = (noteId: string, content: string) => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please login to comment.",
        variant: "destructive",
      });
      return;
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      noteId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date(),
    };
    setComments((prev) => ({
      ...prev,
      [noteId]: [...(prev[noteId] || []), newComment],
    }));
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, commentsCount: note.commentsCount + 1 } : note
      )
    );
  };

  const handleRate = (noteId: string, rating: number) => {
    if (!currentUser) {
      toast({
        title: "Login required",
        description: "Please login to rate notes.",
        variant: "destructive",
      });
      return;
    }
    
    setUserRatings((prev) => ({ ...prev, [noteId]: rating }));
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          const newRatingsCount = note.ratingsCount + 1;
          const newRating =
            (note.rating * note.ratingsCount + rating) / newRatingsCount;
          return {
            ...note,
            rating: newRating,
            ratingsCount: newRatingsCount,
          };
        }
        return note;
      })
    );
    toast({
      title: "Rating submitted",
      description: `You rated this note ${rating} stars.`,
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setSavedNoteIds((prev) => {
        const ns = new Set(prev);
        ns.delete(noteId);
        return ns;
      });
    }
  };

  const mapApiNote = (n: any): Note => ({
    id: n._id,
    title: n.title,
    description: n.description || "",
    imageUrl: n.fileUrl,
    authorId: n.uploaderID?._id || n.uploaderID,
    authorName: n.uploaderID?.userName || "",
    authorAvatar: n.uploaderID?.email ? `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(n.uploaderID.email)}` : "",
    rating: typeof n.ratings === "number" ? n.ratings : 0,
    ratingsCount: Array.isArray(n.ratings) ? n.ratings.length : 0,
    commentsCount: Array.isArray(n.comments) ? n.comments.length : 0,
    createdAt: new Date(n.createdAt),
    tags: n.category ? [n.category] : [],
  });

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    if (res.ok && data?.success) {
      setNotes(data.notes.map(mapApiNote));
    }
  };

  const fetchSaved = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("/api/saved", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (res.ok && data?.success) {
      const ids = new Set<string>(data.notes.map((n: any) => n._id));
      setSavedNoteIds(ids);
    }
  };

  useEffect(() => {
    // Only auto-login if explicitly coming from a successful auth flow
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    const fromAuth = sessionStorage.getItem('fromAuth') === 'true';
    
    if (fromAuth && rawUser) {
      try {
        const u: UserProfile = JSON.parse(rawUser);
        setCurrentUser(u);
        sessionStorage.removeItem('fromAuth');
      } catch {}
    }
    
    void fetchNotes();
    if (token) void fetchSaved();
  }, []);

  const uploadedNotes = currentUser 
    ? notes.filter((note) => note.authorId === currentUser.id)
    : [];
  const savedNotes = notes.filter((note) => savedNoteIds.has(note.id));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isAuthenticated ? (
            <Routes>
              <Route path="/reset" element={<Reset />} />
              <Route
                path="/auth"
                element={
                  <Auth
                    onLogin={handleLogin}
                    onContinueAsGuest={handleContinueAsGuest}
                  />
                }
              />
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          ) : (
            <>
              <Navigation
                onUploadClick={() => currentUser && setUploadModalOpen(true)}
                onLogout={handleLogout}
                isGuest={isGuest}
              />
              <Routes>
                <Route
                  path="/"
                  element={
                    <Index
                      notes={notes}
                      savedNotes={savedNoteIds}
                      onSaveToggle={handleSaveToggle}
                      onAddComment={handleAddComment}
                      onRate={handleRate}
                      comments={comments}
                      userRatings={userRatings}
                      currentUserId={currentUser?.id || ""}
                      onDeleteNote={handleDeleteNote}
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    currentUser ? (
                      <Profile
                        currentUser={currentUser}
                        uploadedNotes={uploadedNotes}
                        savedNotes={savedNotes}
                        savedNoteIds={savedNoteIds}
                        onSaveToggle={handleSaveToggle}
                        onAddComment={handleAddComment}
                        onRate={handleRate}
                        comments={comments}
                        userRatings={userRatings}
                        onDeleteNote={handleDeleteNote}
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
                <Route path="/auth" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/reset" element={<Reset />} />
                <Route 
                  path="/search" 
                  element={
                    <SearchResults 
                      notes={notes}
                      savedNoteIds={savedNoteIds}
                      onSaveToggle={handleSaveToggle}
                      onAddComment={handleAddComment}
                      onRate={handleRate}
                      comments={comments}
                      userRatings={userRatings}
                      currentUserId={currentUser?.id || ""}
                      onDeleteNote={handleDeleteNote}
                    />
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {currentUser && (
                <UploadNoteModal
                  open={uploadModalOpen}
                  onClose={() => setUploadModalOpen(false)}
                  onUpload={handleUpload}
                />
              )}
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
