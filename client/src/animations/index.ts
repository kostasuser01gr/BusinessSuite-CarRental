import { animate, createTimeline, stagger } from 'animejs'

type MotionTarget = string | HTMLElement | Element | NodeList | Element[] | null | undefined

export const motionTokens: {
  duration: Record<'fast' | 'normal' | 'slow' | 'hero', number>
  distance: Record<'xs' | 'sm' | 'md' | 'lg', number>
  delay: Record<'xs' | 'sm' | 'md', number>
  easing: Record<'standard' | 'emphasized' | 'entrance' | 'exit' | 'spring', string>
} = {
  duration: {
    fast: 180,
    normal: 320,
    slow: 560,
    hero: 820,
  },
  distance: {
    xs: 8,
    sm: 14,
    md: 22,
    lg: 32,
  },
  delay: {
    xs: 40,
    sm: 80,
    md: 140,
  },
  easing: {
    standard: 'easeOutCubic',
    emphasized: 'easeOutQuart',
    entrance: 'easeOutExpo',
    exit: 'easeInCubic',
    spring: 'spring(1, 80, 10, 0)',
  },
}

const canAnimate = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const toElements = (targets: MotionTarget): HTMLElement[] => {
  if (!targets) return []
  if (typeof targets === 'string') {
    return Array.from(document.querySelectorAll<HTMLElement>(targets))
  }
  if (targets instanceof HTMLElement) {
    return [targets]
  }
  if (targets instanceof Element) {
    return Array.from([targets]).filter((node): node is HTMLElement => node instanceof HTMLElement)
  }
  if (targets instanceof NodeList) {
    return Array.from(targets).filter((node): node is HTMLElement => node instanceof HTMLElement)
  }
  return targets.filter((node): node is HTMLElement => node instanceof HTMLElement)
}

const revealImmediately = (targets: MotionTarget) => {
  toElements(targets).forEach((element) => {
    element.style.opacity = '1'
    element.style.transform = 'none'
  })
}

export const animatePageEnter = (targets: MotionTarget, delayOffset = 0) => {
  if (!canAnimate()) {
    revealImmediately(targets)
    return null
  }

  return animate(targets as Exclude<MotionTarget, null | undefined>, {
    translateY: [motionTokens.distance.md, 0],
    opacity: [0, 1],
    duration: motionTokens.duration.hero,
    ease: motionTokens.easing.entrance,
    delay: delayOffset,
  })
}

export const animateSurfaceEnter = (targets: MotionTarget, delayOffset = 0) => {
  if (!canAnimate()) {
    revealImmediately(targets)
    return null
  }

  return animate(targets as Exclude<MotionTarget, null | undefined>, {
    translateY: [motionTokens.distance.sm, 0],
    opacity: [0, 1],
    duration: motionTokens.duration.normal,
    ease: motionTokens.easing.standard,
    delay: delayOffset,
  })
}

export const animateStaggeredReveal = (targets: MotionTarget, step = motionTokens.delay.sm) => {
  if (!canAnimate()) {
    revealImmediately(targets)
    return null
  }

  return animate(targets as Exclude<MotionTarget, null | undefined>, {
    translateY: [motionTokens.distance.sm, 0],
    opacity: [0, 1],
    duration: motionTokens.duration.slow,
    ease: motionTokens.easing.emphasized,
    delay: stagger(step),
  })
}

export const animatePress = (targets: MotionTarget) => {
  if (!canAnimate()) return null

  return animate(targets as Exclude<MotionTarget, null | undefined>, {
    scale: [1, 0.96, 1],
    duration: motionTokens.duration.fast,
    ease: motionTokens.easing.standard,
  })
}

export const animateHoverLift = (targets: MotionTarget, active: boolean) => {
  if (!canAnimate()) return null

  return animate(targets as Exclude<MotionTarget, null | undefined>, {
    translateY: active ? -3 : 0,
    scale: active ? 1.01 : 1,
    duration: motionTokens.duration.fast,
    ease: motionTokens.easing.standard,
  })
}

export const animateBannerIn = (target: MotionTarget) => {
  if (!canAnimate()) {
    revealImmediately(target)
    return null
  }

  return animate(target as Exclude<MotionTarget, null | undefined>, {
    translateY: [-motionTokens.distance.md, 0],
    opacity: [0, 1],
    duration: motionTokens.duration.normal,
    ease: motionTokens.easing.entrance,
  })
}

export const animateModalEnter = (targets: MotionTarget) => {
  if (!canAnimate()) {
    revealImmediately(targets)
    return null
  }

  return animate(targets as Exclude<MotionTarget, null | undefined>, {
    scale: [0.96, 1],
    opacity: [0, 1],
    duration: motionTokens.duration.normal,
    ease: motionTokens.easing.spring,
  })
}

export const animateSidebarLabel = (target: MotionTarget) => {
  if (!canAnimate()) {
    revealImmediately(target)
    return null
  }

  return animate(target as Exclude<MotionTarget, null | undefined>, {
    opacity: [0, 1],
    translateX: [-motionTokens.distance.xs, 0],
    duration: motionTokens.duration.normal,
    ease: motionTokens.easing.standard,
  })
}

export const animateHeroSequence = ({
  eyebrow,
  heading,
  actions,
  panels,
}: {
  eyebrow?: MotionTarget
  heading?: MotionTarget
  actions?: MotionTarget
  panels?: MotionTarget
}) => {
  if (!canAnimate()) {
    revealImmediately(eyebrow)
    revealImmediately(heading)
    revealImmediately(actions)
    revealImmediately(panels)
    return null
  }

  const timeline = createTimeline({ autoplay: true })

  if (eyebrow) {
    timeline.add(eyebrow as Exclude<MotionTarget, null | undefined>, {
      opacity: [0, 1],
      translateY: [motionTokens.distance.sm, 0],
      duration: motionTokens.duration.normal,
      ease: motionTokens.easing.entrance,
    })
  }

  if (heading) {
    timeline.add(
      heading as Exclude<MotionTarget, null | undefined>,
      {
        opacity: [0, 1],
        translateY: [motionTokens.distance.md, 0],
        duration: motionTokens.duration.hero,
        ease: motionTokens.easing.entrance,
      },
      '-=180',
    )
  }

  if (actions) {
    timeline.add(
      actions as Exclude<MotionTarget, null | undefined>,
      {
        opacity: [0, 1],
        translateY: [motionTokens.distance.sm, 0],
        duration: motionTokens.duration.normal,
        ease: motionTokens.easing.standard,
      },
      '-=440',
    )
  }

  if (panels) {
    timeline.add(
      panels as Exclude<MotionTarget, null | undefined>,
      {
        opacity: [0, 1],
        translateY: [motionTokens.distance.lg, 0],
        delay: stagger(motionTokens.delay.md),
        duration: motionTokens.duration.hero,
        ease: motionTokens.easing.emphasized,
      },
      '-=360',
    )
  }

  return timeline
}

export const animateFadeInUp = animateSurfaceEnter
export const animatePulse = animatePress
