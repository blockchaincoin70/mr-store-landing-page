
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Edit, Plus } from 'lucide-react';

interface ContentManagerProps {
  userId: string;
}

const ContentManager = ({ userId }: ContentManagerProps) => {
  const [contents, setContents] = useState<any[]>([]);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive",
      });
    }
  };

  const handleSaveContent = async () => {
    if (!editingContent) return;
    
    setLoading(true);
    try {
      const contentData = {
        section: editingContent.section,
        content: editingContent.content,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      };

      if (editingContent.id) {
        // Update existing content
        const { error } = await supabase
          .from('site_content')
          .update(contentData)
          .eq('id', editingContent.id);

        if (error) throw error;
      } else {
        // Create new content
        const { error } = await supabase
          .from('site_content')
          .insert(contentData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Content saved successfully",
      });

      setEditingContent(null);
      fetchContents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (content: any) => {
    setEditingContent({
      ...content,
      content: typeof content.content === 'string' 
        ? content.content 
        : JSON.stringify(content.content, null, 2)
    });
  };

  const startNew = () => {
    setEditingContent({
      section: '',
      content: '{}',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Content Management</h2>
        <Button onClick={startNew} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add New Section</span>
        </Button>
      </div>

      {editingContent && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">
              {editingContent.id ? 'Edit Content' : 'New Content Section'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="section">Section Name</Label>
              <Input
                id="section"
                value={editingContent.section}
                onChange={(e) => setEditingContent({
                  ...editingContent,
                  section: e.target.value
                })}
                placeholder="e.g., hero, contact, about"
              />
            </div>
            <div>
              <Label htmlFor="content">Content (JSON Format)</Label>
              <Textarea
                id="content"
                value={editingContent.content}
                onChange={(e) => setEditingContent({
                  ...editingContent,
                  content: e.target.value
                })}
                rows={10}
                placeholder='{"title": "Your Title", "description": "Your description"}'
                className="font-mono text-sm"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSaveContent}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Content'}</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingContent(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="capitalize">{content.section}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(content)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(content.content, null, 2)}
              </pre>
              <p className="text-xs text-slate-500 mt-2">
                Last updated: {new Date(content.updated_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;
