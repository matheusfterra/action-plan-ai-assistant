
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const feedbackSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackRatingForm = () => {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: "",
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      console.log("Feedback submitted:", data);
      toast({
        title: "Thank you for your feedback!",
        description: "Your response has been recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-6 bg-card rounded-lg border animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Help Us Improve</h3>
        <p className="text-sm text-muted-foreground">
          Please rate your experience and share your thoughts
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      className={`text-2xl transition-colors ${
                        star <= field.value ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= field.value ? 'fill-yellow-400' : 'fill-none'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your experience with us..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackRatingForm;
