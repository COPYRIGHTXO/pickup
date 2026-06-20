import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — adds '.in' to '.reveal' elements when they scroll into view.
 * Pass a dependency array to re-observe when content changes (e.g. tab switches).
 */
export function useScrollReveal(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe the element itself if it has .reveal
    if (el.classList.contains('reveal')) {
      observer.observe(el);
    }

    // Observe all .reveal children
    const children = el.querySelectorAll('.reveal');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // re-run when deps change (e.g. active tab)

  return ref;
}
