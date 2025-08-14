import React from 'react';

interface InputProps {
  value: string | number | undefined;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange: (val: string) => void;
}

const CustomInputV2 = ({ value, type, placeholder, disabled, className, onChange }: InputProps) => {
  return (
    <input
      className={`px-3 py-2 w-full my-2 rounded-xl outline-none transition-all
        ${disabled 
          ? 'text-gray-300 !p-0 -mt-1 !rounded-md   font-semibold' 
          : ' bg-gray-100 dark:bg-dark'
        }
        ${className}
        focus:bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
        dark:focus:border-blue-400 dark:focus:ring-blue-500 dark:focus:bg-light-dark
      `}
      disabled={disabled}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default React.memo(CustomInputV2);
