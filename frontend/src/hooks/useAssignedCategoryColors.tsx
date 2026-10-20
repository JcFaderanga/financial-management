// src/hooks/useAssignedCategoryColors.ts
import { useCategoryColors } from '@/store/useCatogoryColors';
const useAssignedCategoryColors = (categories: string[]) => {
  const { setColor, getColor } = useCategoryColors();

  const generateColor = (index: number, total: number): string => {
    const hue = Math.floor((360 / total) * index);
    return `hsl(${hue}, 70%, 75%)`;
  };

  categories.forEach((category, index) => {
    const exists = getColor(category);
    if (!exists) {
      const newColor = generateColor(index, categories.length);
      setColor(category, newColor);
    }
  });

  // Now return: [{ category, color }, ...]
  return categories.map(category => ({
    category,
    color: getColor(category)!,
  }));
};

export default useAssignedCategoryColors;
