import React, { useEffect, useState, useCallback, ReactNode } from "react";
interface DropDownProps {
  value?: string;
  isActive: any;
  options: string[];
  icon?: Record<string,ReactNode>,
  initial?: string;
  onChange: (val: string) => void;
}

const CustomDropdown: React.FC<DropDownProps> = ({ value, isActive, onChange, options, initial = 'Select Category' }) => {
  const [selected, setSelected] = useState<string>(value || "");

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
        className="w-full px-3 py-2 my-2 border border-gray-400 rounded-xl dark:bg-dark dark:text-white"
      >
        <option value="" disabled>
          {initial}
        </option>
        {options?.sort().map((word) => (
          <option key={word} value={word}>
            {word}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(CustomDropdown);
