
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  project: string | null;
  review_date: string | null;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-slate-600">
            Trusted by contractors, builders, and homeowners across the region
          </p>
        </div>
        
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Reviews Available</h3>
            <p className="text-slate-500">Customer reviews will appear here once they are added by the admin.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reviews.map((review, index) => (
                <Card 
                  key={review.id} 
                  className="h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-scale-in group"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors duration-300">
                        Google Review
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4 italic group-hover:text-slate-700 transition-colors duration-300">
                      "{review.comment}"
                    </p>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors duration-300">
                        {review.customer_name}
                      </div>
                      {review.project && (
                        <div className="text-sm text-slate-500">{review.project}</div>
                      )}
                      {review.review_date && (
                        <div className="text-xs text-slate-400 mt-1">{review.review_date}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 px-8 py-4 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105">
                <span className="text-3xl animate-pulse">⭐</span>
                <span className="font-bold text-lg">4.9/5 Rating on Google</span>
                <span className="text-sm bg-blue-200 px-2 py-1 rounded-full">({reviews.length}+ Reviews)</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Reviews;
