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
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white dark:from-dark to-transparent" />
    </div>
  )
}

export default SkeletonAnimationWrapper
