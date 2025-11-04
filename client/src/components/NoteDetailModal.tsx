import { useState } from "react";
import { X, Star, Send, Trash2, ExternalLink } from "lucide-react";
import { Note, Comment } from "@/types/note";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RatingStars } from "./RatingStars";

interface NoteDetailModalProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onRate: (rating: number) => void;
  userRating: number;
  currentUserId: string;
  onDeleteNote?: () => void;
}

export const NoteDetailModal = ({
  note,
  open,
  onClose,
  comments,
  onAddComment,
  onRate,
  userRating,
  currentUserId,
  onDeleteNote,
}: NoteDetailModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [showPdfFullscreen] = useState(false);

  if (!note) return null;

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const isAuthor = note.authorId === currentUserId;
  const isPdf = note.imageUrl?.toLowerCase().includes('.pdf');
  const previewSrc = (() => {
    if (!isPdf) return note.imageUrl;
    const url = note.imageUrl;
    if (url.includes('cloudinary.com')) {
      if (url.includes('/raw/upload/')) {
        return url.replace('/raw/upload/', '/image/upload/pg_1,f_auto,q_auto/');
      }
      if (url.includes('/image/upload/')) {
        return url.replace('/image/upload/', '/image/upload/pg_1,f_auto,q_auto/');
      }
    }
    return url;
  })();
  
  // Get proper PDF URL for viewing - Cloudinary PDFs need special handling
  const getPdfViewerUrl = (url: string) => url;
  
  const directPdfUrl = getPdfViewerUrl(note.imageUrl);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[95vh] p-0 gap-0 overflow-y-hidden">
        <div className="grid md:grid-cols-2 h-full">
          {/* Preview Section */}
          <div className="relative bg-muted flex items-center justify-center">
            {
              <>
            <img src={previewSrc} alt={note.title} className="w-full h-full object-contain" />
              </>
            }
          </div>

          {/* Details Section */}
          <div className="flex flex-col h-full">
            <DialogHeader className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={note.authorAvatar} />
                    <AvatarFallback>{note.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{note.authorName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {(() => { try { return new Date((note as any).createdAt).toLocaleDateString(); } catch { return ""; } })()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPdf ? (
                    <a href={directPdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Open in new tab
                      </Button>
                    </a>
                  ) : (
                    <a href={note.imageUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">Open full page</Button>
                    </a>
                  )}
                  {isAuthor && onDeleteNote && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onDeleteNote}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 p-4 pb-24 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{note.title}</h2>
                  <p className="text-muted-foreground text-base">{note.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(note.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Rate this note</span>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={userRating} onRate={onRate} size="lg" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span>
                      {note.rating.toFixed(1)} average from {note.ratingsCount} ratings
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>💬 Comments</span>
                    <span className="text-base font-normal text-muted-foreground">
                      ({comments.length})
                    </span>
                  </h3>
                  
                  {comments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {comments.map((comment) => (
                        <div 
                          key={comment.id} 
                          className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="h-9 w-9 shrink-0 border border-border">
                            <AvatarImage src={comment.userAvatar} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {comment.userName[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
              <div className="relative">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault(); handleSubmitComment();  }}}

                  className="pr-12 h-12 text-base"
                />
                <Button 
                  onClick={handleSubmitComment} 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                  disabled={!commentText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
