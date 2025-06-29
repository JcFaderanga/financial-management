import { useState, useEffect } from 'react';


function usePagination({ items, itemsPerPage }:any) {
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  // Reset to page 1 when items change
  useEffect(() => {
    setPage(1);
  }, [items]);

  return {
    page,
    currentItems,
    totalPages,
    handlePrev,
    handleNext,
    setPage,
  };
}

export default usePagination;
