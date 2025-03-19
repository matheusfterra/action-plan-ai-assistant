
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Edit, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ApprovalSectionProps {
  onApprove: () => void;
  onEdit: () => void;
  isActive: boolean;
  feedbackCount: number;
  maxFeedbackCount: number;
}

const ApprovalSection: React.FC<ApprovalSectionProps> = ({ 
  onApprove, 
  onEdit, 
  isActive,
  feedbackCount,
  maxFeedbackCount
}) => {
  if (!isActive) return null;

  const isLastFeedback = feedbackCount >= maxFeedbackCount;

  return (
    <div className="w-full mb-10 animate-slide-in">
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {!isLastFeedback ? (
          <>
            <Button 
              onClick={onApprove} 
              variant="default" 
              className="h-11 min-w-[160px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="h-5 w-5 mr-2" />
              Approve Suggestion
            </Button>
            <Button 
              onClick={onEdit} 
              variant="outline" 
              className="h-11 min-w-[160px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Suggestion
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={onApprove} 
              variant="default" 
              className="h-11 min-w-[160px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              Approve
            </Button>
            <Button 
              onClick={onEdit} 
              variant="outline" 
              className="h-11 min-w-[160px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-destructive text-destructive hover:bg-destructive/10"
            >
              <ThumbsDown className="h-5 w-5 mr-2" />
              Reject
            </Button>
          </>
        )}
      </div>
      {feedbackCount > 0 && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {feedbackCount === maxFeedbackCount 
              ? "Final decision required" 
              : `Feedback round ${feedbackCount} of ${maxFeedbackCount}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApprovalSection;
