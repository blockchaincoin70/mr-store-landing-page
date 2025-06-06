
import { Building, Construction, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  const products = [
    {
      title: "TMT Steel Bars",
      description: "High-grade TMT bars for superior strength and durability in construction projects.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      features: ["Fe 500 Grade", "Corrosion Resistant", "Earthquake Safe"]
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
      title: "MS Angles & Plates",
      description: "Structural steel components for framework and reinforcement applications.",
      image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=300&fit=crop",
      features: ["Various Sizes", "IS Standard", "Custom Cutting"]
    },
    {
      title: "Hardware & Tools",
      description: "Complete range of construction hardware, tools, and fasteners.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      features: ["Hand Tools", "Power Tools", "Fasteners"]
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Our Product Range
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive selection of high-quality building materials from trusted manufacturers, 
            ensuring your construction projects meet the highest standards.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Construction className="h-5 w-5 text-orange-500" />
                  <span>{product.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{product.description}</p>
                <div className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
