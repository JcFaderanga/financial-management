import React from 'react';
interface inputProps {
  value:string | number;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}

const StringInput = ({ value, type, placeholder,disabled, onChange }: inputProps) => {

  return (
    <input
      className={`${disabled ?'border text-gray-300 border-gray-100' :'border-gray-400' }
       px-3 py-2 w-full my-2 rounded-xl focus:bg-blue-50 focus:border-blue-400 outline-0
       dark:focus:bg-light-dark
       `}
      disabled={disabled}
      type={type}
      value={value}
      onChange={(val) => onChange(val.target.value)}
      placeholder={placeholder}
    />
  );
};

export default React.memo(StringInput);
