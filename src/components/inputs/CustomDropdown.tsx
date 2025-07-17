import { useEffect, useState } from "react";

interface DropDownProps {
  value?: string;
  type?: string;
  placeholder?: string;
  isActive: any;
  onChange: (val: string) => void;
}

const CustomDropdown = ({ onChange, isActive }: DropDownProps) => {
  const [selected, setSelected] = useState("Select Category");

  const category = [
    'Food', 'Load', 'Education', 'Games', 'Social',
    'Transportation', 'Bills', 'Gifts', 'Lottery',
    'Shopping', 'Phone', 'Wants', 'Hotel', 'Others',
    'Staycation', 'Payments'
  ];

  useEffect(() => {
    if (!isActive) {
      setSelected("Select Category");
      onChange("Select Category");
    }
  }, [isActive]);

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange(val);
  };

  return (
    <div>
      <select
        value={selected}
        onChange={(e) => handleSelect(e.target.value)}
        className="border px-3 py-2 w-full my-2 rounded-xl border-gray-400"
      >
        <option disabled>Select Category</option>
        {category.sort().map((word) => (
          <option key={word} value={word}>
            {word}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomDropdown;
