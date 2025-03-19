
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdditionalInstructionsProps {
  onSubmit: (instructions: string) => void;
  isSubmitting: boolean;
  isActive: boolean;
}

const AdditionalInstructions: React.FC<AdditionalInstructionsProps> = ({ 
  onSubmit, 
  isSubmitting,
  isActive
}) => {
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!instructions.trim()) {
      setError('Please provide additional instructions');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(instructions);
    }
  };

  if (!isActive) return null;

  return (
    <div className="w-full mb-10 animate-slide-in">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <p className="font-medium mb-1">API Analysis Guidance</p>
            <p className="text-sm">
              Based on our analysis of your KPI goals, we recommend focusing on the following aspects in your optimization strategy:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
              <li>Consider adjusting your keyword strategy to target more specific user intents</li>
              <li>Highlight unique features that differentiate your app from competitors</li>
              <li>Address user pain points mentioned in recent reviews</li>
              <li>Optimize for regional preferences in your target markets</li>
            </ul>
            <p className="text-sm mt-2">
              Please incorporate these suggestions in your additional instructions below.
            </p>
          </AlertDescription>
        </Alert>
        
        <div className="mb-5 flex gap-2 items-start">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            You can provide additional instructions to refine the AI's suggestions. This is optional but recommended for more accurate results.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="additionalInstructions" className="text-sm font-medium">
              Additional Instructions
            </Label>
            <Textarea
              id="additionalInstructions"
              placeholder="Provide any clarifications or additional details that could help refine the suggestions..."
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                if (error) setError('');
              }}
              className={`min-h-[120px] resize-y focus-ring ${error ? 'border-destructive' : ''}`}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="px-6 h-11 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdditionalInstructions;
