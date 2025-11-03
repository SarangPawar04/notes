import { Feed } from "@/pages/Feed";
import { Note, Comment } from "@/types/note";

interface IndexProps {
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

const Index = ({
  notes,
  savedNotes,
  onSaveToggle,
  onAddComment,
  onRate,
  comments,
  userRatings,
  currentUserId,
  onDeleteNote,
}: IndexProps) => {
  return (
    <Feed
      notes={notes}
      savedNotes={savedNotes}
      onSaveToggle={onSaveToggle}
      onAddComment={onAddComment}
      onRate={onRate}
      comments={comments}
      userRatings={userRatings}
      currentUserId={currentUserId}
      onDeleteNote={onDeleteNote}
    />
  );
};

export default Index;
