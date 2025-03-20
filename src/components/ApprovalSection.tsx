
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Edit, ThumbsUp, ThumbsDown, Copy, AlertCircle } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
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
        toast({
          title: "Conteúdo copiado!",
          description: "O texto foi copiado para a área de transferência."
        });
      })
      .catch(err => {
        console.error('Failed to copy content: ', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o conteúdo. Tente selecionar manualmente.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="w-full mb-10 animate-slide-in">
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {!isLastFeedback ? (
          <>
            <Button 
              onClick={() => setIsConfirmOpen(true)} 
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
              onClick={() => setIsConfirmOpen(true)} 
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

        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-primary">
                <Check className="h-5 w-5" />
                Confirmar Aprovação
              </AlertDialogTitle>
              <AlertDialogDescription className="pt-2">
                <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    Antes de aprovar, certifique-se de que você salvou ou copiou todas as sugestões geradas.
                    Após a aprovação, a página será reiniciada e todo o trabalho não salvo será perdido.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mb-5">
              <Button 
                variant="outline" 
                className="w-full justify-start border-dashed"
                onClick={handleCopyContent}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar conteúdo para a área de transferência
              </Button>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="sm:mr-2">
                Fechar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={onApprove}
                className="bg-primary hover:bg-primary/90"
              >
                Já copiei tudo, continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
