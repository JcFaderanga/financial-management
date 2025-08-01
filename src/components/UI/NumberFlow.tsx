
import NumberFlow from '@number-flow/react'
type NumberFlowProp = {
 value: number | string;
 currency?: string;
 style?: 'decimal' | 'currency' | 'percent' | 'unit';
}

const NumberFlowUI = ({value, currency, style}:NumberFlowProp) => {
  return (
      <NumberFlow 
          value={Number(value)} 
          locales="en-US" 
          format={{ style: style, currency: currency }} 
      />  
  )
}

export default NumberFlowUI