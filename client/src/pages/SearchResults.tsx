import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NoteCard } from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Note, Comment } from "@/types/note";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  notes: Note[];
  savedNoteIds: Set<string>;
  onSaveToggle: (noteId: string) => void;
  onAddComment: (noteId: string, content: string) => void;
  onRate: (noteId: string, rating: number) => void;
  comments: { [noteId: string]: Comment[] };
  userRatings: { [noteId: string]: number };
  currentUserId: string;
  onDeleteNote: (noteId: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  notes,
  savedNoteIds,
  onSaveToggle,
  onAddComment,
  onRate,
  comments,
  userRatings,
  currentUserId,
  onDeleteNote
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter notes based on search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      setIsLoading(true);
      // Simple client-side search - can be replaced with server-side search
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.description.toLowerCase().includes(query.toLowerCase()) ||
        (note.tags && note.tags.some(tag => 
          tag.toLowerCase().includes(query.toLowerCase())
        ))
      );
      
      // Simulate network delay
      const timer = setTimeout(() => {
        setSearchResults(filtered);
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [location.search, notes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-6 text-lg rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {searchQuery 
              ? (searchResults.length > 0 
                  ? `Found ${searchResults.length} results for "${searchQuery}"`
                  : `No results found for "${searchQuery}"`)
              : "Search for notes"}
          </h1>
          <p className="text-muted-foreground">
            {searchQuery 
              ? (searchResults.length > 0 
                  ? "Here are the notes that match your search"
                  : "Try searching for something else")
              : "Enter a search term to find notes"}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="mt-3 h-4 bg-muted rounded w-3/4"></div>
                <div className="mt-2 h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onCardClick={() => {}}
                onSaveToggle={() => onSaveToggle(note.id)}
                isSaved={savedNoteIds.has(note.id)}
                currentUserId={currentUserId}
                onDeleteNote={onDeleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
