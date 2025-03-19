
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 mb-6">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-2 animate-fade-in">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            AI Suggestion Assistant
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
