export function useReveal() {
  let observer: IntersectionObserver | null = null

  function init() {
    if (typeof window === 'undefined') return
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            observer?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer!.observe(el))
  }

  function refresh() { destroy(); nextTick(() => init()) }
  function destroy() { observer?.disconnect(); observer = null }
  return { init, refresh, destroy }
}
