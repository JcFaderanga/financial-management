
import {useRef, useEffect,useState} from 'react'
import NumberFlow from '@number-flow/react'
import { useMenuStore } from '@/store/useMenuToggle'
type NumberFlowProp = {
 value: number | string;
 currency?: string;
 style?: 'decimal' | 'currency' | 'percent' | 'unit';
}

const NumberFlowUI = ({value, currency, style}:NumberFlowProp) => {

    const {isMenuActive}= useMenuStore();
    const targetRef = useRef<HTMLDivElement | null>(null);
    const [isHidden, setIsHidden] = useState(false);

      useEffect(() => {
        const handleScroll = () => {
          if (targetRef.current) {
            const top = targetRef.current.getBoundingClientRect().top;

            // Hide when top position reaches 64px
            setIsHidden(top <= 64);
          }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const hideStyle = isHidden ? 'opacity-0' 
          : isMenuActive ? 'hidden lg:block' 
          : 'block';
      
  return (
    <div
      ref={targetRef}
      className={`${hideStyle}`}
    >
      <NumberFlow 
          value={Number(value)} 
          locales="en-US" 
          className=''
          format={{ style: style, currency: currency }} 
      />
    </div>
    
  )
}

export default NumberFlowUI