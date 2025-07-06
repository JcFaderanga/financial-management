
import NumberFlow from '@number-flow/react'
import { useMenuStore } from '@/store/useMenuToggle'
type NumberFlowProp = {
 value: number | string;
 currency?: string;
 style?: 'decimal' | 'currency' | 'percent' | 'unit';
}

const NumberFlowUI = ({value, currency, style}:NumberFlowProp) => {

    const {isMenuActive}= useMenuStore();

  return (
    <div
    className={`${isMenuActive ? 'hidden lg:block' : ''}`}
        >
        <NumberFlow 
            value={Number(value)} 
            locales="en-US" 
            format={{ style: style, currency: currency }} 
        />
    </div>
    
  )
}

export default NumberFlowUI