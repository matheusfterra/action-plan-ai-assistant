
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OutputItem {
  title: string;
  content: string;
}

interface OutputSectionProps {
  outputs: {
    suggestedText: string;
    hypothesis: string;
    strategy: string;
  } | null;
  isActive: boolean;
}

const OutputSection: React.FC<OutputSectionProps> = ({ outputs, isActive }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  if (!isActive || !outputs) return null;

  const outputItems: OutputItem[] = [
    { title: 'Suggested Text', content: outputs.suggestedText },
    { title: 'Hypothesis', content: outputs.hypothesis },
    { title: 'Strategy', content: outputs.strategy }
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [field]: true });
      toast({
        description: `${field} copied to clipboard!`,
        duration: 3000,
      });
      
      setTimeout(() => {
        setCopied({ ...copied, [field]: false });
      }, 2000);
    });
  };

  return (
    <div className="w-full mb-10 animate-slide-in">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-6">AI-Generated Suggestions</h2>
        
        <div className="space-y-6 animate-in-sequence">
          {outputItems.map((item, index) => (
            <div key={index} className="space-y-2 animate-fade-in">
              <div className="flex justify-between items-center">
                <Label htmlFor={`output-${index}`} className="text-sm font-medium">
                  {item.title}
                </Label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.content, item.title)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors p-1 rounded focus-ring"
                  aria-label={`Copy ${item.title}`}
                >
                  {copied[item.title] ? (
                    <CheckCheck className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied[item.title] ? 'Copied' : 'Copy'}
                </button>
              </div>
              <Textarea
                id={`output-${index}`}
                value={item.content}
                readOnly
                className="min-h-[120px] resize-none bg-secondary focus-ring font-mono text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutputSection;
