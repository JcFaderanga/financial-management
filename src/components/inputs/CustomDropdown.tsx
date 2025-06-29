
interface dropDownProps {
  value?:string;
  type?: string;
  placeholder?: string;
  onChange: (val: string) => void;
}
const CustomDropdown = ({onChange}: dropDownProps) => {

const category= ['Food', 'Load', 'Education', 'Games', 'Social', 'Transportation', 'Bills','Gifts','Lottery','Shopping','Phone','Wants','Hotel','Others']

  return (
    <div>
        <select
            
            onChange={(e)=>onChange(e.target.value)}
            className='border px-3 py-2 w-full my-2 rounded-xl border-gray-400'>
                <option>Select Category</option>
                {category.sort().map((word) => (
                <option key={word} value={word}>
                    {word}
                </option>
                ))}
      </select>
    </div>
  )
}

export default CustomDropdown