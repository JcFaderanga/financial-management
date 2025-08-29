import React from 'react';

interface InputProps {
  value: string | number | undefined;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  focus?: boolean;
  onChange: (val: string) => void;
}

const StringInput = ({ value, type, placeholder, disabled, className, focus = true, onChange }: InputProps) => {
  return (
    <input
      className={`px-3 py-2 w-full my-2 rounded-xl transition-all outline-none
        ${disabled 
          ? 'dark:text-gray-300 !p-0 -mt-1 !rounded-md font-semibold' 
          : '!bg-slate-100 dark:!bg-light-dark'
        }
        ${className}
        ${ focus &&
          ` focus:bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
        dark:focus:border-blue-400 dark:focus:ring-blue-500 dark:focus:bg-light-dark`
        }
        
      `}
      disabled={disabled}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default React.memo(StringInput);
