
import { Card, CardContent } from "@/components/ui/card";

const Reviews = () => {
  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment: "Excellent quality materials and prompt delivery. M.R. Store has been our go-to supplier for the past 3 years.",
      project: "Residential Complex"
    },
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Very professional service and competitive prices. The TMT bars quality is outstanding.",
      project: "Commercial Building"
    },
    {
      name: "Amit Patel",
      rating: 5,
      comment: "Reliable supplier with genuine products. Their customer support is exceptional.",
      project: "Industrial Warehouse"
    },
    {
      name: "Sunita Reddy",
      rating: 5,
      comment: "Best cement prices in the area and always available when needed. Highly recommended!",
      project: "Villa Construction"
    }
  ];

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-slate-600">
            Trusted by contractors, builders, and homeowners across the region
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl text-yellow-400">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded">
                    Google Review
                  </div>
                </div>
                <p className="text-slate-600 mb-4 italic">
                  "{review.comment}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-slate-900">{review.name}</div>
                  <div className="text-sm text-slate-500">{review.project}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-lg">
            <span className="text-2xl">⭐</span>
            <span className="font-semibold">4.9/5 Rating on Google</span>
            <span className="text-sm">(150+ Reviews)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
