
import { Card, CardContent } from "@/components/ui/card";

const Reviews = () => {
  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Excellent quality materials and prompt delivery. M.R. Store has been our go-to supplier for the past 3 years.",
      project: "Residential Complex",
      date: "2 weeks ago"
    },
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Very professional service and competitive prices. The TMT bars quality is outstanding.",
      project: "Commercial Building",
      date: "1 month ago"
    },
    {
      name: "Amit Patel",
      rating: 5,
      comment: "Reliable supplier with genuine products. Their customer support is exceptional.",
      project: "Industrial Warehouse",
      date: "3 weeks ago"
    },
    {
      name: "Sunita Reddy",
      rating: 5,
      comment: "Best cement prices in the area and always available when needed. Highly recommended!",
      project: "Villa Construction",
      date: "1 week ago"
    },
    {
      name: "Mohammed Ali",
      rating: 5,
      comment: "Quality steel and timely delivery. Perfect for our large construction projects.",
      project: "Shopping Mall",
      date: "2 months ago"
    },
    {
      name: "Kavita Singh",
      rating: 5,
      comment: "Great variety of building materials under one roof. Staff is very knowledgeable.",
      project: "Home Renovation",
      date: "1 month ago"
    }
  ];

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, index) => (
            <Card 
              key={index} 
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
                    {review.name}
                  </div>
                  <div className="text-sm text-slate-500">{review.project}</div>
                  <div className="text-xs text-slate-400 mt-1">{review.date}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 px-8 py-4 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105">
            <span className="text-3xl animate-pulse">⭐</span>
            <span className="font-bold text-lg">4.9/5 Rating on Google</span>
            <span className="text-sm bg-blue-200 px-2 py-1 rounded-full">(200+ Reviews)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
