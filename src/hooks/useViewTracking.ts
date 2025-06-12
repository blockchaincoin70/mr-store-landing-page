
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useViewTracking = (pagePath: string) => {
  useEffect(() => {
    // Don't track admin pages or login pages
    if (pagePath.includes('/admin') || pagePath.includes('/login')) {
      return;
    }

    const trackView = async () => {
      try {
        const { error } = await supabase
          .from('page_views')
          .insert({
            page_path: pagePath,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          });

        if (error) {
          console.error('Error tracking page view:', error);
        }
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackView();
  }, [pagePath]);
};
