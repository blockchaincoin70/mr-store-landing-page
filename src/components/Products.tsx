
import { useState } from "react";
import { Building, Construction, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Products = () => {
  const allProducts = [
    {
      title: "TMT Steel Bars",
      description: "High-grade TMT bars for superior strength and durability in construction projects.",
      image: "/lovable-uploads/54a7d21e-ad77-4ae4-88b4-29a94c2a7be7.png",
      features: ["Fe 500 Grade", "Corrosion Resistant", "Earthquake Safe"]
    },
    {
      title: "MS Angles & Plates",
      description: "Structural steel components for framework and reinforcement applications.",
      image: "/lovable-uploads/f57dcc97-b11a-47d1-b40d-1b36c1df7a21.png",
      features: ["Various Sizes", "IS Standard", "Custom Cutting"]
    },
    {
      title: "Cement & Concrete",
      description: "Premium quality cement from leading brands for all construction applications.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
      features: ["OPC & PPC", "Fast Setting", "High Strength"]
    },
    {
      title: "Bricks & Blocks",
      description: "Traditional clay bricks and modern concrete blocks for all masonry work.",
      image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=400&h=300&fit=crop",
      features: ["Clay Bricks", "Concrete Blocks", "Fly Ash Bricks"]
    },
    {
      title: "Roofing Materials",
      description: "Complete roofing solutions including sheets, tiles, and accessories.",
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=300&fit=crop",
      features: ["Metal Sheets", "Clay Tiles", "Accessories"]
    },
    {
      title: "Hardware & Tools",
      description: "Complete range of construction hardware, tools, and fasteners.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      features: ["Hand Tools", "Power Tools", "Fasteners"]
    },
    {
      title: "Structural Steel",
      description: "High-quality structural steel beams and columns for heavy construction.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      features: ["I-Beams", "H-Beams", "Custom Fabrication"]
    },
    {
      title: "Aggregates & Sand",
      description: "Premium quality aggregates and sand for concrete and construction work.",
      image: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=400&h=300&fit=crop",
      features: ["River Sand", "M-Sand", "Stone Chips"]
    },
    {
      title: "Electrical Materials",
      description: "Complete range of electrical wiring and installation materials.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
      features: ["Cables", "Switches", "Conduits"]
    }
  ];

  const [visibleProducts, setVisibleProducts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 3, allProducts.length));
      setIsLoading(false);
    }, 800);
  };

  const displayedProducts = allProducts.slice(0, visibleProducts);

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Our Product Range
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive selection of high-quality building materials from trusted manufacturers, 
            ensuring your construction projects meet the highest standards.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map((product, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Construction className="h-5 w-5 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="group-hover:text-orange-600 transition-colors duration-300">{product.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{product.description}</p>
                <div className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 0.1}s` }}>
                      <Tag className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleProducts < allProducts.length && (
          <div className="text-center mt-12 animate-fade-in">
            <Button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                `Load More Products (${allProducts.length - visibleProducts} remaining)`
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
