import { useState } from "react";
import { NoteCard } from "@/components/NoteCard";
import { NoteDetailModal } from "@/components/NoteDetailModal";
import { Note, Comment } from "@/types/note";
import { useToast } from "@/hooks/use-toast";

interface FeedProps {
  notes: Note[];
  savedNotes: Set<string>;
  onSaveToggle: (noteId: string) => void;
  onAddComment: (noteId: string, content: string) => void;
  onRate: (noteId: string, rating: number) => void;
  comments: { [noteId: string]: Comment[] };
  userRatings: { [noteId: string]: number };
  currentUserId: string;
  onDeleteNote: (noteId: string) => void;
}

export const Feed = ({
  notes,
  savedNotes,
  onSaveToggle,
  onAddComment,
  onRate,
  comments,
  userRatings,
  currentUserId,
  onDeleteNote,
}: FeedProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { toast } = useToast();

  const handleDeleteNote = () => {
    if (selectedNote) {
      onDeleteNote(selectedNote.id);
      setSelectedNote(null);
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              Discover Notes
            </h1>
            <p className="text-muted-foreground">
              Explore and learn from notes shared by students worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onCardClick={setSelectedNote}
                onSaveToggle={onSaveToggle}
                isSaved={savedNotes.has(note.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <NoteDetailModal
        note={selectedNote}
        open={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        comments={selectedNote ? comments[selectedNote.id] || [] : []}
        onAddComment={(content) => selectedNote && onAddComment(selectedNote.id, content)}
        onRate={(rating) => selectedNote && onRate(selectedNote.id, rating)}
        userRating={selectedNote ? userRatings[selectedNote.id] || 0 : 0}
        currentUserId={currentUserId}
        onDeleteNote={
          selectedNote?.authorId === currentUserId ? handleDeleteNote : undefined
        }
      />
    </>
  );
};
