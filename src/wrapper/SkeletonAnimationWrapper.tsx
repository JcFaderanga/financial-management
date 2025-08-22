import { useRef, useEffect, ReactNode } from 'react';

function useFadeAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    let opacity = 1
    let direction = -0.01

    const animate = () => {
      if (!ref.current) return
      opacity += direction
      if (opacity <= 0.4 || opacity >= 1) direction *= -1
      ref.current.style.opacity = opacity.toString()
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return ref
}

const SkeletonAnimationWrapper = ({children}:{children: ReactNode}) => {
  const fadeRef = useFadeAnimation()

  return (
    <div ref={fadeRef}>
      {children}
    </div>
  )
}

export default SkeletonAnimationWrapper
