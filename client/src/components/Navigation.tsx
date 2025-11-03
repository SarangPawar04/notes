import { Home, User, Plus, LogOut, Moon, Sun, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  onUploadClick: () => void;
  onLogout: () => void;
  isGuest: boolean;
}

export const Navigation = ({ onUploadClick, onLogout, isGuest }: NavigationProps) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    // Set dark mode as default
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme ? savedTheme === 'dark' : true; // Default to dark mode
    setDarkMode(isDarkMode);
    
    // Apply dark mode class to the document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">N</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NoteGram
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="icon"
              className="rounded-full"
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>

          {!isGuest && (
            <Button
              onClick={onUploadClick}
              size="icon"
              className="rounded-full bg-gradient-to-r from-primary to-secondary"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}

          {!isGuest && (
            <Link to="/profile">
              <Button
                variant={location.pathname === "/profile" ? "default" : "ghost"}
                size="icon"
                className="rounded-full"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-muted-foreground hover:text-foreground"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <div className="relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className={cn(
                  "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
                  isSearchFocused && "text-foreground"
                )} />
                <Input
                  type="search"
                  placeholder="Search notes..."
                  className={cn(
                    "w-full rounded-full bg-background pl-8 pr-4 py-2 h-9 transition-all duration-200",
                    isSearchFocused ? "w-64" : "w-48"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </form>
            </div>
            
            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
