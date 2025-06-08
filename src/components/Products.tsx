
import { useState, useEffect } from "react";
import { Building, Construction, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  tag1: string | null;
  tag2: string | null;
  tag3: string | null;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 3, products.length));
      setIsLoadingMore(false);
    }, 800);
  };

  const displayedProducts = products.slice(0, visibleProducts);

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

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
        
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Building className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Products Available</h3>
            <p className="text-slate-500">Products will appear here once they are added by the admin.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image_url || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Construction className="h-5 w-5 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="group-hover:text-orange-600 transition-colors duration-300">{product.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{product.description}</p>
                    <div className="space-y-2">
                      {[product.tag1, product.tag2, product.tag3].map((tag, idx) => 
                        tag && (
                          <div key={idx} className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 0.1}s` }}>
                            <Tag className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-slate-700">{tag}</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {visibleProducts < products.length && (
              <div className="text-center mt-12 animate-fade-in">
                <Button 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    `Load More Products (${products.length - visibleProducts} remaining)`
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
