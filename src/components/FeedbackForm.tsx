
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';

interface FeedbackFormProps {
  onSubmit: (feedback: string) => void;
  isSubmitting: boolean;
  isActive: boolean;
  feedbackCount: number;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  isActive,
  feedbackCount
}) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  if (!isActive) return null;

  const validateForm = () => {
    if (!feedback.trim()) {
      setError('Please provide your feedback');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(feedback);
      setFeedback('');
    }
  };

  return (
    <div className="w-full mb-10 animate-slide-in">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-4">Provide Feedback</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm font-medium">
              Revision Request (Round {feedbackCount})
            </Label>
            <Textarea
              id="feedback"
              placeholder="Please explain what changes you'd like to see in the suggestions..."
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                if (error) setError('');
              }}
              className={`min-h-[150px] resize-y focus-ring ${error ? 'border-destructive' : ''}`}
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
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
