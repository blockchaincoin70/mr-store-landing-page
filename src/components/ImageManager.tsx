
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface ImageManagerProps {
  userId: string;
}

const ImageManager = ({ userId }: ImageManagerProps) => {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [section, setSection] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // For demo purposes, we'll simulate image upload
      // In production, you'd upload to Supabase Storage
      const imageUrl = URL.createObjectURL(selectedFile);
      
      const { error } = await supabase
        .from('site_images')
        .insert({
          name: selectedFile.name,
          url: imageUrl,
          alt_text: altText,
          section: section,
          uploaded_by: userId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      setSelectedFile(null);
      setAltText('');
      setSection('');
      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('site_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Image Management</h2>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Upload New Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file">Select Image</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
            />
          </div>
          <div>
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g., hero, products, gallery"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm truncate">{image.name}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-slate-400" />
                )}
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Alt:</strong> {image.alt_text || 'No alt text'}</p>
                <p><strong>Section:</strong> {image.section || 'No section'}</p>
                <p className="text-xs text-slate-500">
                  Uploaded: {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImageManager;
