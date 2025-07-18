import React, { useEffect, useState, useCallback } from "react";

interface DropDownProps {
  value?: string;
  isActive: any;
  onChange: (val: string) => void;
}

const CustomDropdown: React.FC<DropDownProps> = ({ value, isActive, onChange }) => {
  const [selected, setSelected] = useState<string>(value || "");

  const category = [
    "Bills", "Education", "Food", "Games", "Gifts", "Hotel", "Load", "Lottery",
    "Others", "Payments", "Phone", "Shopping", "Social", "Staycation",
    "Transportation", "Wants"
  ];

  useEffect(() => {
    if (!isActive) {
      setSelected("");
      onChange("");
    }
  }, [isActive, onChange]);

  const handleSelect = useCallback((val: string) => {
    setSelected(val);
    onChange(val);
  }, [onChange]);

  return (
    <div>
      <select
        value={selected}
        onChange={(e) => handleSelect(e.target.value)}
        className="border px-3 py-2 w-full my-2 rounded-xl border-gray-400"
      >
        <option value="" disabled>
          Select Category
        </option>
        {category.sort().map((word) => (
          <option key={word} value={word}>
            {word}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(CustomDropdown);
