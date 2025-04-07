import React, { useState } from 'react';
import Header from '@/components/Header';
import InitialForm, { InitialFormData } from '@/components/InitialForm';
import AdditionalInstructions from '@/components/AdditionalInstructions';
import OutputSection from '@/components/OutputSection';
import ApprovalSection from '@/components/ApprovalSection';
import FeedbackForm from '@/components/FeedbackForm';
import { toast } from "@/hooks/use-toast";
import { ChevronUp } from 'lucide-react';

// This would be replaced with actual API calls in a real application
const mockApiResponse = {
  suggestedText: "Experience our innovative app that transforms how you manage daily tasks. With intuitive design and smart features, you'll boost productivity while enjoying a seamless user experience.",
  hypothesis: "Users are looking for productivity tools that simplify their workflow without adding complexity. Our application addresses this need by focusing on intuitive design and core functionality.",
  strategy: "Target users who value efficiency and simplicity. Emphasize how our app reduces friction in daily task management and integrates seamlessly with existing workflows."
};

// Maximum number of feedback iterations before final decision
const MAX_FEEDBACK_COUNT = 3;

const Index = () => {
  // States for showing different sections
  const [initialSubmitted, setInitialSubmitted] = useState(false);
  const [additionalSubmitted, setAdditionalSubmitted] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  // Loading states
  const [isInitialSubmitting, setIsInitialSubmitting] = useState(false);
  const [isAdditionalSubmitting, setIsAdditionalSubmitting] = useState(false);
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  
  // Data states
  const [outputs, setOutputs] = useState<{
    suggestedText: string;
    hypothesis: string;
    strategy: string;
  } | null>(null);
  
  // Feedback iteration counter
  const [feedbackCount, setFeedbackCount] = useState(0);
  
  // Add state for suggestKeywords
  const [suggestKeywords, setSuggestKeywords] = useState(false);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle initial form submission
  const handleInitialSubmit = async (data: InitialFormData) => {
    setIsInitialSubmitting(true);
    try {
      // Log the form data to see new fields
      console.log("Form data submitted:", data);
      
      // Set suggestKeywords state based on form data
      setSuggestKeywords(data.suggestKeywords);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set outputs with mock data
      setOutputs(mockApiResponse);
      setInitialSubmitted(true);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Your initial data was processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInitialSubmitting(false);
    }
  };

  // Handle additional instructions submission
  const handleAdditionalSubmit = async (instructions: string) => {
    setIsAdditionalSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update outputs with slightly modified data for demonstration
      setOutputs({
        suggestedText: "Experience our revolutionary app that transforms daily task management. With smart features and an elegant design, you'll boost productivity while enjoying a truly seamless experience.",
        hypothesis: "Users seek productivity tools that simplify complex workflows without adding cognitive burden. Our application specifically addresses this need with intuitive design principles and focused functionality.",
        strategy: "Target productivity-focused users who value efficiency and minimal friction. Emphasize how our app streamlines task management and integrates perfectly with existing digital ecosystems."
      });
      
      setAdditionalSubmitted(true);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Your additional instructions were processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your additional instructions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdditionalSubmitting(false);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: string) => {
    setIsFeedbackSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Increment feedback count
      const newFeedbackCount = feedbackCount + 1;
      setFeedbackCount(newFeedbackCount);
      
      // Generate slightly different outputs each time for demonstration
      setOutputs({
        suggestedText: `Version ${newFeedbackCount + 1}: Experience our meticulously crafted app that fundamentally changes how you handle daily responsibilities. With thoughtful design and intelligent features, you'll accomplish more while enjoying a frictionless digital experience.`,
        hypothesis: `Version ${newFeedbackCount + 1}: Users are seeking tools that reduce cognitive load while maximizing output quality. Our application directly addresses this need through human-centered design and contextual intelligence.`,
        strategy: `Version ${newFeedbackCount + 1}: Target discerning professionals who value both aesthetics and functionality. Emphasize our app's ability to integrate into existing workflows while reducing mental overhead and improving output quality.`
      });
      
      // Hide feedback form after submission
      setShowFeedbackForm(false);
      
      // Show success toast
      toast({
        title: "Feedback Processed",
        description: `Your revision request (round ${newFeedbackCount}) was processed successfully.`,
      });
      
      // Scroll to top to see new outputs
      scrollToTop();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  // Handle approve action
  const handleApprove = () => {
    toast({
      title: "Conteúdo Aprovado!",
      description: "A sugestão foi aprovada com sucesso. Retornando ao início...",
    });
    
    // Reset app state for demonstration purposes
    setTimeout(() => {
      setInitialSubmitted(false);
      setAdditionalSubmitted(false);
      setShowFeedbackForm(false);
      setOutputs(null);
      setFeedbackCount(0);
      scrollToTop();
    }, 2000);
  };

  // Handle edit action
  const handleEdit = () => {
    // If at max feedback count, this is a rejection
    if (feedbackCount >= MAX_FEEDBACK_COUNT) {
      toast({
        title: "Rejeitado",
        description: "A sugestão foi rejeitada.",
        variant: "destructive",
      });
      
      // Reset app state for demonstration purposes
      setTimeout(() => {
        setInitialSubmitted(false);
        setAdditionalSubmitted(false);
        setShowFeedbackForm(false);
        setOutputs(null);
        setFeedbackCount(0);
        scrollToTop();
      }, 2000);
      return;
    }
    
    // Otherwise show feedback form
    setShowFeedbackForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        
        <div className="space-y-2">
          <InitialForm 
            onSubmit={handleInitialSubmit} 
            isSubmitting={isInitialSubmitting} 
          />
          
          <AdditionalInstructions 
            onSubmit={handleAdditionalSubmit} 
            isSubmitting={isAdditionalSubmitting}
            isActive={initialSubmitted && !additionalSubmitted}
          />
          
          <OutputSection 
            outputs={outputs} 
            isActive={initialSubmitted}
            showAfterAdditionalSubmit={additionalSubmitted}
            showKeywords={suggestKeywords} // Pass the state to control keyword tables visibility
          />
          
          {(initialSubmitted && additionalSubmitted && !showFeedbackForm) && (
            <ApprovalSection 
              onApprove={handleApprove} 
              onEdit={handleEdit} 
              isActive={true}
              feedbackCount={feedbackCount}
              maxFeedbackCount={MAX_FEEDBACK_COUNT}
            />
          )}
          
          <FeedbackForm 
            onSubmit={handleFeedbackSubmit} 
            isSubmitting={isFeedbackSubmitting}
            isActive={showFeedbackForm}
            feedbackCount={feedbackCount + 1}
          />
        </div>
        
        {/* Scroll to top button - appears when scrolled down */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity focus-ring"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Index;
