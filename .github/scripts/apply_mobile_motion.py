from pathlib import Path

path = Path('astro-site/src/pages/index.astro')
source = path.read_text()
marker = '// Cross-browser mobile motion fallback.'
if marker in source:
    raise SystemExit('Fallback already present; refusing duplicate insert.')

anchor = '  </script>\n</BaseLayout>'
pos = source.rfind(anchor)
if pos < 0:
    raise SystemExit('Could not find homepage script closing anchor.')

block = r"""

    // Cross-browser mobile motion fallback. The heavier CSS motion layer uses
    // view timelines, which are still inconsistent across mobile browsers.
    // On mobile (and any desktop browser without that API), this observer +
    // Web Animations implementation recreates the same assembly language:
    // panels construct, red rails shoot in, process nodes deploy in sequence,
    // and proof lines carry a short red signal. Nothing is pre-hidden, so a
    // JS failure still leaves a fully usable static page.
    (() => {
      if (!('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const hasViewTimeline = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: view()');
      if (!isMobile && hasViewTimeline) return;

      document.documentElement.classList.add('orl-motion-fallback');

      const motionReset = document.createElement('style');
      motionReset.textContent = `
        html.orl-motion-fallback #diagnosis *, html.orl-motion-fallback #diagnosis *::before, html.orl-motion-fallback #diagnosis *::after,
        html.orl-motion-fallback #services *, html.orl-motion-fallback #services *::before, html.orl-motion-fallback #services *::after,
        html.orl-motion-fallback #results *, html.orl-motion-fallback #results *::before, html.orl-motion-fallback #results *::after,
        html.orl-motion-fallback #process *, html.orl-motion-fallback #process *::before, html.orl-motion-fallback #process *::after,
        html.orl-motion-fallback #expertise *, html.orl-motion-fallback #expertise *::before, html.orl-motion-fallback #expertise *::after,
        html.orl-motion-fallback #testimonials *, html.orl-motion-fallback #testimonials *::before, html.orl-motion-fallback #testimonials *::after,
        html.orl-motion-fallback #ledger *, html.orl-motion-fallback #ledger *::before, html.orl-motion-fallback #ledger *::after,
        html.orl-motion-fallback #why-us *, html.orl-motion-fallback #why-us *::before, html.orl-motion-fallback #why-us *::after,
        html.orl-motion-fallback #calculator *, html.orl-motion-fallback #calculator *::before, html.orl-motion-fallback #calculator *::after,
        html.orl-motion-fallback #lead-magnet *, html.orl-motion-fallback #lead-magnet *::before, html.orl-motion-fallback #lead-magnet *::after,
        html.orl-motion-fallback #contact *, html.orl-motion-fallback #contact *::before, html.orl-motion-fallback #contact *::after {
          animation: none !important;
        }
      `;
      document.head.appendChild(motionReset);

      document.querySelectorAll<HTMLElement>('.reveal-wipe').forEach((el) => {
        el.classList.remove('reveal-wipe');
        el.style.clipPath = '';
      });

      const once = new WeakSet<Element>();
      const accent = '#E63946';
      const warm = '#F9F9F7';

      const temporary = (parent: HTMLElement, styles: Partial<CSSStyleDeclaration>) => {
        const node = document.createElement('span');
        Object.assign(node.style, {
          position: 'absolute',
          display: 'block',
          pointerEvents: 'none',
          zIndex: '8',
          ...styles,
        });
        if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
        parent.appendChild(node);
        return node;
      };

      const shootRail = (el: HTMLElement, vertical = false, delay = 100) => {
        const rail = temporary(el, vertical ? {
          top: '-1px', bottom: '-1px', left: '-1px', width: '3px', background: accent,
          transform: 'scaleY(0)', transformOrigin: 'center top', boxShadow: `0 0 14px ${accent}55`,
        } : {
          top: '-1px', left: '-1px', width: 'calc(100% + 2px)', height: '3px', background: accent,
          transform: 'scaleX(0)', transformOrigin: 'left center', boxShadow: `0 0 14px ${accent}55`,
        });
        const anim = rail.animate(
          vertical
            ? [{ transform: 'scaleY(0)', opacity: .8 }, { transform: 'scaleY(1)', opacity: 1 }]
            : [{ transform: 'scaleX(0)', opacity: .8 }, { transform: 'scaleX(1)', opacity: 1 }],
          { duration: 430, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
        );
        anim.finished.then(() => rail.remove()).catch(() => rail.remove());
      };

      const impactMetric = (el: HTMLElement, delay = 230) => {
        el.animate(
          [
            { transform: 'scale(.92)', opacity: .42 },
            { transform: 'scale(1.045)', opacity: 1, offset: .7 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          { duration: 520, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
      };

      const assemblePanel = (el: HTMLElement) => {
        if (once.has(el)) return;
        once.add(el);

        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const index = Math.max(0, siblings.indexOf(el));
        const delay = Math.min(index % 4, 3) * 55;

        const tracer = temporary(el, {
          inset: '-1px',
          border: `1px solid ${warm}B8`,
          clipPath: 'inset(0 100% 100% 0)',
          opacity: '0',
        });
        const frame = tracer.animate(
          [
            { clipPath: 'inset(0 100% 100% 0)', opacity: 0 },
            { clipPath: 'inset(0 100% 100% 0)', opacity: 1, offset: .12 },
            { clipPath: 'inset(0 0 0 0)', opacity: 1, offset: .78 },
            { clipPath: 'inset(0 0 0 0)', opacity: 0 },
          ],
          { duration: 720, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
        );
        frame.finished.then(() => tracer.remove()).catch(() => tracer.remove());

        el.animate(
          [
            { transform: 'translateY(18px) scale(.985)', filter: 'brightness(.82)', opacity: .48 },
            { transform: 'translateY(0) scale(1.008)', filter: 'brightness(1.04)', opacity: 1, offset: .76 },
            { transform: 'translateY(0) scale(1)', filter: 'brightness(1)', opacity: 1 },
          ],
          { duration: 680, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );

        if (el.matches('#diagnosis > div:last-child > div:last-child')) shootRail(el, true, delay + 120);
        if (el.matches('#services > div:last-child > div, #results > div:last-child > div, #ledger .ledger-slide, #lead-magnet > div, #calculator > div:nth-child(2) > div:last-child, #contact > div > div:last-child')) {
          shootRail(el, false, delay + 120);
        }

        const metric = el.querySelector<HTMLElement>('#calc-target-revenue, span.font-display-xl-mobile, .font-display-xl-mobile');
        if (metric) impactMetric(metric, delay + 240);
      };

      const panelSelector = [
        '#diagnosis > div:last-child > div',
        '#services > div:last-child > div',
        '#results > div:last-child > div',
        '#testimonials > div:last-child > div',
        '#ledger .ledger-slide',
        '#why-us > div:last-child > div',
        '#calculator > div:nth-child(2) > div',
        '#lead-magnet > div',
        '#lead-magnet + section .grid > a',
        '#contact > div > div:last-child',
      ].join(',');

      const panelObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          assemblePanel(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
      document.querySelectorAll<HTMLElement>(panelSelector).forEach((el) => panelObserver.observe(el));

      const process = document.querySelector<HTMLElement>('#process > div:last-child');
      if (process) {
        const processObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || once.has(process)) return;
            once.add(process);
            observer.unobserve(process);

            const vertical = window.matchMedia('(max-width: 767px)').matches;
            const rail = temporary(process, vertical ? {
              top: '4px', bottom: '0', left: '6px', width: '2px', background: accent,
              transform: 'scaleY(0)', transformOrigin: 'center top', zIndex: '3',
            } : {
              top: '6px', left: '0', right: '0', height: '2px', background: accent,
              transform: 'scaleX(0)', transformOrigin: 'left center', zIndex: '3',
            });
            rail.animate(
              vertical ? [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }] : [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
              { duration: 1150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
            );

            Array.from(process.children).forEach((child, index) => {
              const step = child as HTMLElement;
              const delay = 120 + index * 190;
              step.animate(
                [{ opacity: .22, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 520, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
              );
              const node = temporary(step, vertical ? {
                top: '2px', left: '0', width: '13px', height: '13px', background: accent,
                border: `2px solid ${accent}`, transform: 'scale(0)', transformOrigin: 'center',
              } : {
                top: '-27px', left: '0', width: '13px', height: '13px', background: accent,
                border: `2px solid ${accent}`, transform: 'scale(0)', transformOrigin: 'center',
              });
              const nodeAnim = node.animate(
                [{ transform: 'scale(0)' }, { transform: 'scale(1.35)', offset: .68 }, { transform: 'scale(1)' }],
                { duration: 400, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
              );
              nodeAnim.finished.then(() => node.remove()).catch(() => node.remove());
            });
          });
        }, { threshold: .14, rootMargin: '0px 0px -10% 0px' });
        processObserver.observe(process);
      }

      const lineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const line = entry.target as HTMLElement;
          observer.unobserve(line);
          line.style.position = 'relative';
          line.style.overflow = 'hidden';
          const packet = temporary(line, {
            top: '0', left: '-80px', width: '68px', height: '1px', background: accent,
            boxShadow: `0 0 10px ${accent}77`,
          });
          const distance = Math.max(line.clientWidth + 170, 360);
          const packetAnim = packet.animate(
            [
              { transform: 'translateX(0)', opacity: 0 },
              { transform: 'translateX(35px)', opacity: 1, offset: .12 },
              { transform: `translateX(${distance}px)`, opacity: 1, offset: .84 },
              { transform: `translateX(${distance + 35}px)`, opacity: 0 },
            ],
            { duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
          );
          packetAnim.finished.then(() => packet.remove()).catch(() => packet.remove());
        });
      }, { threshold: .2 });
      document.querySelectorAll<HTMLElement>('#results .rule-line, #testimonials .rule-line, #expertise .border-t').forEach((el) => lineObserver.observe(el));

      const editorialObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          (entry.target as HTMLElement).animate(
            [{ opacity: .35, transform: 'translateX(-12px)' }, { opacity: 1, transform: 'translateX(0)' }],
            { duration: 460, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );
        });
      }, { threshold: .18 });
      document.querySelectorAll<HTMLElement>('#expertise .border-b, #calculator + section details').forEach((el) => editorialObserver.observe(el));
    })();
"""

source = source[:pos] + block + source[pos:]
path.write_text(source)
