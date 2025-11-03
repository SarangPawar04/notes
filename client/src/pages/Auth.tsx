import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { UserProfile } from "@/types/note";

interface AuthProps {
  onLogin: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
}

export const Auth = ({ onLogin, onContinueAsGuest }: AuthProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Ensure dark theme is applied to the auth page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // Don't remove the dark class here as it's managed by the Navigation component
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Login failed");
      if (data.token) localStorage.setItem("token", data.token);
      const user: UserProfile = {
        id: data.user.id,
        name: data.user.userName,
        email: data.user.email,
        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=" + encodeURIComponent(data.user.email),
        bio: "",
        uploadedNotes: [],
        savedNotes: [],
      };
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      toast({ title: "Welcome back!", description: "You've successfully logged in." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Please try again.", });
    }
  };

  const handleForgotPassword = async () => {
    try {
      let emailToUse = loginEmail;
      if (!emailToUse) {
        // Prompt user for email if the form field is empty (better UX when user forgot to type)
        const prompted = window.prompt("Enter your email address to receive a reset link:");
        if (!prompted) {
          toast({ title: "Email required", description: "Password reset cancelled." });
          return;
        }
        emailToUse = prompted.trim();
        if (!emailToUse) {
          toast({ title: "Email required", description: "Password reset cancelled." });
          return;
        }
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Could not request password reset");
      // Server returns a resetUrl for development convenience; in production it should email the link.
      const message = data?.message || "If that email is registered, a reset link was sent.";
      toast({ title: "Password reset", description: message });
      if (data?.resetUrl) {
        try {
          await navigator.clipboard.writeText(data.resetUrl);
          toast({ title: "Reset link copied", description: "Reset URL copied to clipboard (for dev)." });
        } catch (err) {
          // ignore clipboard errors
        }
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Please try again." });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: signupName, email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || "Signup failed");
      const user: UserProfile = {
        id: data.user.id,
        name: data.user.userName,
        email: data.user.email,
        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=" + encodeURIComponent(data.user.email),
        bio: "",
        uploadedNotes: [],
        savedNotes: [],
      };
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      toast({ title: "Account created!", description: "Welcome to NoteGram!" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message || "Please try again.", });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4 dark:bg-gradient-to-br dark:from-background dark:via-background/95 dark:to-accent/10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NoteGram
          </h1>
          <p className="text-muted-foreground">Share and discover study notes</p>
        </div>

        <Card className="border-border/50 dark:border-border/70 bg-card/80 dark:bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Login or create an account to upload notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <div className="flex justify-end mt-2">
                    <Button type="button" variant="ghost" onClick={handleForgotPassword} className="text-sm">
                      Forgot password?
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={onContinueAsGuest}
                className="text-muted-foreground"
              >
                Continue as guest (view only)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
