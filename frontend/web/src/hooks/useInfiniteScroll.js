import { useState, useCallback, useRef, useEffect } from 'react';

const useInfiniteScroll = (fetchData, options = {}) => {
  const {
    initialPage = 1,
    pageSize = 10,
    threshold = 100,
    enabled = true
  } = options;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && enabled) {
        setPage(prev => prev + 1);
      }
    }, { 
      rootMargin: `${threshold}px`
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, threshold, enabled]);

  const loadMore = useCallback(async () => {
    if (!enabled || loading || !hasMore) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchData({ page, pageSize });
      
      const newItems = response.data || response;
      const total = response.total || response.length;
      
      setItems(prev => [...prev, ...newItems]);
      setHasMore(items.length + newItems.length < total);
    } catch (err) {
      setError(err);
      console.error('Error loading more items:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchData, page, pageSize, loading, hasMore, enabled, items.length]);

  useEffect(() => {
    loadMore();
  }, [page]);

  const refresh = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return {
    items,
    loading,
    error,
    hasMore,
    lastElementRef,
    refresh
  };
};

export default useInfiniteScroll;