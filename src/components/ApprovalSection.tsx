
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Edit, ThumbsUp, ThumbsDown, Copy, AlertCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  const handleCopyContent = () => {
    // Get all the suggestion content to copy
    const suggestedText = document.querySelector('[data-section="suggestedText"]')?.textContent || '';
    const hypothesis = document.querySelector('[data-section="hypothesis"]')?.textContent || '';
    const strategy = document.querySelector('[data-section="strategy"]')?.textContent || '';
    
    // Create a formatted string with all content
    const contentToCopy = `SUGESTÃO DE TEXTO:\n${suggestedText}\n\nHIPÓTESE:\n${hypothesis}\n\nESTRATÉGIA:\n${strategy}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        // You can use the toast here if needed
        console.log('Content copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy content: ', err);
      });
  };

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
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="default" 
                  className="h-11 min-w-[160px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Approve
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="grid gap-4 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Atenção
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Você já salvou ou copiou o conteúdo gerado? 
                      Ao aprovar, a página será reiniciada e o conteúdo atual será perdido.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="justify-start border-dashed"
                      onClick={handleCopyContent}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar conteúdo para a área de transferência
                    </Button>
                    <Button 
                      onClick={onApprove}
                      className="mt-2"
                    >
                      Sim, continuar e reiniciar
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {}}
                      className="mt-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
