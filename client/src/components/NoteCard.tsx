import { Star, MessageCircle, Bookmark } from "lucide-react";
import { Note } from "@/types/note";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NoteCardProps {
  note: Note;
  onCardClick: (note: Note) => void;
  onSaveToggle: (noteId: string) => void;
  isSaved: boolean;
  currentUserId?: string;
  onDeleteNote?: (noteId: string) => void;
}

export const NoteCard = ({ note, onCardClick, onSaveToggle, isSaved }: NoteCardProps) => {
  const isPdf = note.imageUrl?.toLowerCase().includes('.pdf');
  // For PDFs, use thumbnailUrl if available, otherwise use the placeholder
  // For images, use imageUrl directly
  const previewSrc = isPdf 
    ? (note.thumbnailUrl || '/pdf-placeholder.png')
    : note.imageUrl;
    
  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] cursor-pointer border-border bg-gradient-to-br from-card to-muted/20"
      onClick={() => onCardClick(note)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted flex items-center justify-center">
        {isPdf && !note.thumbnailUrl ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-muted p-4 text-center">
            <div className="text-4xl mb-2">📄</div>
            <span className="text-sm font-medium text-muted-foreground">PDF Document</span>
            <span className="text-xs text-muted-foreground/70 mt-1">Thumbnail not available</span>
          </div>
        ) : (
          <img
            src={previewSrc}
            alt={note.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              if (isPdf) {
                // For PDFs, show the fallback UI instead of an image
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'h-full w-full flex flex-col items-center justify-center bg-muted p-4 text-center';
                fallback.innerHTML = `
                  <div class="text-4xl mb-2">📄</div>
                  <span class="text-sm font-medium text-muted-foreground">PDF Document</span>
                  <span class="text-xs text-muted-foreground/70 mt-1">Preview not available</span>
                `;
                target.parentNode?.insertBefore(fallback, target);
              } else {
                // For images, use the placeholder image
                target.src = '/image-placeholder.png';
              }
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{note.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {note.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onSaveToggle(note.id);
            }}
          >
            <Bookmark
              className={`h-5 w-5 transition-colors ${
                isSaved ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={note.authorAvatar} />
            <AvatarFallback>{note.authorName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate">{note.authorName}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{note.rating.toFixed(1)}</span>
              <span className="text-xs">({note.ratingsCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{note.commentsCount}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

