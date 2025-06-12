
-- Create a table to track page views
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on created_at for better performance when counting views
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);

-- Create an index on page_path for filtering by specific pages
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);

-- Enable Row Level Security (make it public readable but restrict writes)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read page views (for analytics)
CREATE POLICY "Anyone can view page views" 
  ON public.page_views 
  FOR SELECT 
  USING (true);

-- Allow anyone to insert page views (for tracking)
CREATE POLICY "Anyone can insert page views" 
  ON public.page_views 
  FOR INSERT 
  WITH CHECK (true);

-- Enable realtime for the page_views table
ALTER TABLE public.page_views REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
