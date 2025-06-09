
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Trash2, Plus, Upload, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  tag1: string | null;
  tag2: string | null;
  tag3: string | null;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    tag1: '',
    tag2: '',
    tag3: ''
  });

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
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteOldImage = async (imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `products/${fileName}`;

      await supabase.storage
        .from('product-images')
        .remove([filePath]);
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          
          // Delete old image if updating a product
          if (editingProduct && editingProduct.image_url) {
            await deleteOldImage(editingProduct.image_url);
          }
        } else {
          throw new Error('Image upload failed');
        }
      }

      const productData = {
        ...formData,
        image_url: imageUrl
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      image_url: product.image_url || '',
      tag1: product.tag1 || '',
      tag2: product.tag2 || '',
      tag3: product.tag3 || ''
    });
    setPreviewUrl(product.image_url || '');
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      // Find the product to get its image URL
      const product = products.find(p => p.id === id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete the associated image
      if (product?.image_url) {
        await deleteOldImage(product.image_url);
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      tag1: '',
      tag2: '',
      tag3: ''
    });
    setEditingProduct(null);
    setIsFormOpen(false);
    setSelectedFile(null);
    setPreviewUrl('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    if (!editingProduct) {
      setFormData({ ...formData, image_url: '' });
    }
  };

  if (isLoading && products.length === 0) {
    return <div className="flex justify-center p-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="TMT Steel Bars"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="High-grade TMT bars for superior strength and durability in construction projects."
                  required
                />
              </div>

              <div>
                <Label>Product Image</Label>
                <div className="space-y-4">
                  {previewUrl && (
                    <div className="relative inline-block">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={clearImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    <Upload className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tag1">Tag 1</Label>
                  <Input
                    id="tag1"
                    value={formData.tag1}
                    onChange={(e) => setFormData({ ...formData, tag1: e.target.value })}
                    placeholder="Fe 500 Grade"
                  />
                </div>
                <div>
                  <Label htmlFor="tag2">Tag 2</Label>
                  <Input
                    id="tag2"
                    value={formData.tag2}
                    onChange={(e) => setFormData({ ...formData, tag2: e.target.value })}
                    placeholder="Corrosion Resistant"
                  />
                </div>
                <div>
                  <Label htmlFor="tag3">Tag 3</Label>
                  <Input
                    id="tag3"
                    value={formData.tag3}
                    onChange={(e) => setFormData({ ...formData, tag3: e.target.value })}
                    placeholder="Earthquake Safe"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading || isUploading}>
                  {isLoading || isUploading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No products found. Add your first product above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">
                          No Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.tag1 && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{product.tag1}</span>}
                        {product.tag2 && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{product.tag2}</span>}
                        {product.tag3 && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">{product.tag3}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManager;
