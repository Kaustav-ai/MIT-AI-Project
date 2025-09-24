import { ReactNode } from "react";
import Navigation from "./Navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showChatButton?: boolean;
}

const Layout = ({ children, showChatButton = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Floating Chat Button */}
      {showChatButton && (
        <Link to="/chat">
          <Button 
            size="icon" 
            variant="chat"
            className="floating-chat h-14 w-14 pulse-animation hover:scale-110"
            aria-label="Open AI Chat"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </Link>
      )}
      
      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 HealthAI Platform. Empowering healthcare through AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;