import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NoteCard } from "@/components/NoteCard";
import { NoteDetailModal } from "@/components/NoteDetailModal";
import { Note, Comment } from "@/types/note";
import { useToast } from "@/hooks/use-toast";

interface ProfileProps {
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  uploadedNotes: Note[];
  savedNotes: Note[];
  savedNoteIds: Set<string>;
  onSaveToggle: (noteId: string) => void;
  onAddComment: (noteId: string, content: string) => void;
  onRate: (noteId: string, rating: number) => void;
  comments: { [noteId: string]: Comment[] };
  userRatings: { [noteId: string]: number };
  onDeleteNote: (noteId: string) => void;
}

export const Profile = ({
  currentUser,
  uploadedNotes,
  savedNotes,
  savedNoteIds,
  onSaveToggle,
  onAddComment,
  onRate,
  comments,
  userRatings,
  onDeleteNote,
}: ProfileProps) => {
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
          <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
            <div className="bg-card rounded-2xl p-8 mb-8 shadow-[var(--shadow-card)]">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-2xl">{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {currentUser.name}
                  </h1>
                  <p className="text-muted-foreground mb-4">{currentUser.bio}</p>
                  <div className="flex gap-6 justify-center md:justify-start">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {uploadedNotes.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Notes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {savedNotes.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="uploaded" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="uploaded">My Notes</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>

              <TabsContent value="uploaded">
                {uploadedNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      You haven't uploaded any notes yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploadedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onCardClick={setSelectedNote}
                        onSaveToggle={onSaveToggle}
                        isSaved={savedNoteIds.has(note.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved">
                {savedNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      You haven't saved any notes yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onCardClick={setSelectedNote}
                        onSaveToggle={onSaveToggle}
                        isSaved={savedNoteIds.has(note.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
        currentUserId={currentUser.id}
        onDeleteNote={
          selectedNote?.authorId === currentUser.id ? handleDeleteNote : undefined
        }
      />
    </>
  );
};
