from pathlib import Path

index_path = Path('astro-site/src/pages/index.astro')
css_path = Path('astro-site/src/styles/global.css')

source = index_path.read_text()
marker = '    // Cross-browser mobile motion fallback.'
if marker not in source:
    raise SystemExit('Mobile motion fallback marker not found')

start = source.index(marker)
end_marker = '    })();\n  </script>'
end = source.index(end_marker, start) + len('    })();\n')

new_block = r'''    // Cross-browser motion fallback for mobile and browsers without view timelines.
    // Motion v2 deliberately avoids flashes, overshoot, and snap-back states:
    // panels move only a few pixels, text settles gently, temporary rails finish
    // at the exact dimensions of the permanent design, and nothing is hidden by
    // default if the enhancement cannot initialize.
    (() => {
      if (!('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const hasViewTimeline = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: view()');
      if (!isMobile && hasViewTimeline) return;

      document.documentElement.classList.add('orl-motion-fallback');

      // The original reveal system and the newer assembly system must never run
      // at the same time on fallback browsers. Two independent transforms were
      // the main source of the previous flash / corrupted-page feeling.
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
        html.orl-motion-fallback .reveal-wipe,
        html.orl-motion-fallback .reveal-left,
        html.orl-motion-fallback .rule-line {
          transition: none !important;
        }
      `;
      document.head.appendChild(motionReset);

      document.querySelectorAll<HTMLElement>('.reveal-wipe, .reveal-left, #results .rule-line, #testimonials .rule-line').forEach((el) => {
        el.classList.remove('reveal-wipe', 'reveal-left');
        el.style.clipPath = '';
        el.style.opacity = '';
        el.style.transform = '';
      });

      const once = new WeakSet<Element>();
      const accent = '#E63946';
      const warm = '#F9F9F7';
      const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

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

      const textChildren = (root: HTMLElement) => Array.from(root.children).filter((child) => {
        const tag = child.tagName;
        return ['SPAN', 'H2', 'H3', 'P', 'A', 'UL', 'DIV'].includes(tag) && !child.matches('form, input, select, textarea, button');
      }) as HTMLElement[];

      const settleText = (root: HTMLElement, baseDelay = 180) => {
        textChildren(root).slice(0, 6).forEach((child, index) => {
          child.animate(
            [
              { opacity: .52, transform: 'translateY(9px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 920, delay: baseDelay + index * 95, easing: ease, fill: 'both' }
          );
        });
      };

      const finalRailWidth = (el: HTMLElement) => {
        if (el.matches('#services > div:last-child > div')) return 56;
        if (el.matches('#results > div:last-child > div')) return 40;
        if (el.matches('#ledger .ledger-slide, #lead-magnet > div')) return 72;
        return null;
      };

      // Short red rails now fade in at full panel width and smoothly contract
      // to their real final width. The temporary element is removed only after
      // it exactly matches the permanent rail underneath, so there is no snap.
      const settleRail = (el: HTMLElement, vertical = false, delay = 260) => {
        const targetWidth = finalRailWidth(el);
        if (vertical) {
          const rail = temporary(el, {
            top: '-1px', bottom: '-1px', left: '-1px', width: '3px', background: accent,
            transform: 'scaleY(.12)', transformOrigin: 'center top', opacity: '.35',
          });
          const anim = rail.animate(
            [
              { transform: 'scaleY(.12)', opacity: .35 },
              { transform: 'scaleY(1)', opacity: 1 },
            ],
            { duration: 1050, delay, easing: ease, fill: 'both' }
          );
          anim.finished.then(() => rail.remove()).catch(() => rail.remove());
          return;
        }

        const panelWidth = Math.max(1, Math.round(el.getBoundingClientRect().width + 2));
        const isShort = targetWidth !== null;
        const rail = temporary(el, {
          top: '-1px', left: '-1px', width: `${isShort ? panelWidth : panelWidth}px`, height: el.matches('#calculator > div:nth-child(2) > div:last-child, #contact > div > div:last-child') ? '3px' : '2px',
          background: accent, opacity: '0', transformOrigin: 'left center',
        });

        const frames = isShort
          ? [
              { width: `${panelWidth}px`, opacity: 0 },
              { width: `${panelWidth}px`, opacity: .78, offset: .18 },
              { width: `${targetWidth}px`, opacity: 1 },
            ]
          : [
              { transform: 'scaleX(.15)', opacity: .35 },
              { transform: 'scaleX(1)', opacity: 1 },
            ];

        const anim = rail.animate(frames, { duration: isShort ? 1150 : 1050, delay, easing: ease, fill: 'both' });
        anim.finished.then(() => rail.remove()).catch(() => rail.remove());
      };

      const impactMetric = (el: HTMLElement, delay = 420) => {
        el.animate(
          [
            { transform: 'translateY(6px) scale(.98)', opacity: .58 },
            { transform: 'translateY(0) scale(1)', opacity: 1 },
          ],
          { duration: 900, delay, easing: ease, fill: 'both' }
        );
      };

      const assemblePanel = (el: HTMLElement) => {
        if (once.has(el)) return;
        once.add(el);

        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const index = Math.max(0, siblings.indexOf(el));
        const delay = Math.min(index % 4, 3) * 110;

        // The frame tracer is intentionally low contrast and slow. It suggests
        // construction without ever turning the entire card into a white flash.
        const tracer = temporary(el, {
          inset: '-1px',
          border: `1px solid ${warm}66`,
          clipPath: 'inset(0 100% 100% 0)',
          opacity: '0',
        });
        const frame = tracer.animate(
          [
            { clipPath: 'inset(0 100% 100% 0)', opacity: 0 },
            { clipPath: 'inset(0 100% 100% 0)', opacity: .28, offset: .18 },
            { clipPath: 'inset(0 0 0 0)', opacity: .42, offset: .78 },
            { clipPath: 'inset(0 0 0 0)', opacity: 0 },
          ],
          { duration: 1250, delay, easing: ease, fill: 'both' }
        );
        frame.finished.then(() => tracer.remove()).catch(() => tracer.remove());

        el.animate(
          [
            { transform: 'translateY(10px)', opacity: .82 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          { duration: 1050, delay, easing: ease, fill: 'both' }
        );

        settleText(el, delay + 220);

        if (el.matches('#diagnosis > div:last-child > div:last-child')) settleRail(el, true, delay + 280);
        if (el.matches('#services > div:last-child > div, #results > div:last-child > div, #ledger .ledger-slide, #lead-magnet > div, #calculator > div:nth-child(2) > div:last-child, #contact > div > div:last-child')) {
          settleRail(el, false, delay + 280);
        }

        const metric = el.querySelector<HTMLElement>('#calc-target-revenue, span.font-display-xl-mobile, .font-display-xl-mobile');
        if (metric) impactMetric(metric, delay + 460);
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
      }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
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
              transform: 'scaleY(0)', transformOrigin: 'center top', zIndex: '3', opacity: '.8',
            } : {
              top: '6px', left: '0', right: '0', height: '2px', background: accent,
              transform: 'scaleX(0)', transformOrigin: 'left center', zIndex: '3', opacity: '.8',
            });
            rail.animate(
              vertical ? [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }] : [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
              { duration: 1750, easing: ease, fill: 'both' }
            );

            Array.from(process.children).forEach((child, index) => {
              const step = child as HTMLElement;
              const delay = 260 + index * 310;
              step.animate(
                [{ opacity: .5, transform: 'translateY(9px)' }, { opacity: 1, transform: 'translateY(0)' }],
                { duration: 900, delay, easing: ease, fill: 'both' }
              );
              settleText(step, delay + 80);

              const node = temporary(step, vertical ? {
                top: '2px', left: '0', width: '13px', height: '13px', background: '#0D0D0D',
                border: `2px solid ${accent}`, transform: 'scale(.7)', opacity: '.45', transformOrigin: 'center',
              } : {
                top: '-27px', left: '0', width: '13px', height: '13px', background: '#0D0D0D',
                border: `2px solid ${accent}`, transform: 'scale(.7)', opacity: '.45', transformOrigin: 'center',
              });
              const nodeAnim = node.animate(
                [{ transform: 'scale(.7)', opacity: .45 }, { transform: 'scale(1)', opacity: 1 }],
                { duration: 680, delay, easing: ease, fill: 'both' }
              );
              nodeAnim.finished.then(() => node.remove()).catch(() => node.remove());
            });
          });
        }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
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
            top: '0', left: '-80px', width: '64px', height: '1px', background: accent, opacity: '0',
          });
          const distance = Math.max(line.clientWidth + 170, 360);
          const packetAnim = packet.animate(
            [
              { transform: 'translateX(0)', opacity: 0 },
              { transform: 'translateX(30px)', opacity: .55, offset: .16 },
              { transform: `translateX(${distance}px)`, opacity: .55, offset: .82 },
              { transform: `translateX(${distance + 30}px)`, opacity: 0 },
            ],
            { duration: 1450, easing: ease, fill: 'both' }
          );
          packetAnim.finished.then(() => packet.remove()).catch(() => packet.remove());
        });
      }, { threshold: .14 });
      document.querySelectorAll<HTMLElement>('#results .rule-line, #testimonials .rule-line, #expertise .border-t').forEach((el) => lineObserver.observe(el));

      const editorialTargets = document.querySelectorAll<HTMLElement>(
        '#expertise .border-b, #calculator + section details, #diagnosis > div:first-child, #services > div:first-child, #process > div:first-child, #why-us > div:first-child, #calculator > div:first-child, #lead-magnet + section > div > div:first-child, #contact > div > div:first-child'
      );
      const editorialObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          el.animate(
            [{ opacity: .55, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 980, easing: ease, fill: 'both' }
          );
          settleText(el, 120);
        });
      }, { threshold: .12 });
      editorialTargets.forEach((el) => editorialObserver.observe(el));
    })();
'''

source = source[:start] + new_block + source[end:]
index_path.write_text(source)

css = css_path.read_text()
css_marker = '/* Homepage motion v2 — calm, continuous, no snap-back. */'
if css_marker in css:
    raise SystemExit('Motion v2 CSS already exists')

css += r'''

/* Homepage motion v2 — calm, continuous, no snap-back.
   This intentionally overrides the first motion pass rather than changing the
   static design. Scroll progress remains the driver on capable desktop
   browsers; fallback browsers use the matching JS choreography in index.astro. */
@keyframes orl-frame-assemble {
  0% { clip-path: inset(0 100% 100% 0); opacity: 0; }
  18% { opacity: .24; }
  78% { clip-path: inset(0 0 0 0); opacity: .38; }
  100% { clip-path: inset(0 0 0 0); opacity: 0; }
}

@keyframes orl-panel-enter {
  from { transform: translateY(12px); opacity: .82; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes orl-text-settle {
  from { opacity: .52; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes orl-process-node {
  from { transform: scale(.72); opacity: .45; background: #0D0D0D; }
  to { transform: scale(1); opacity: 1; background: #0D0D0D; }
}

@keyframes orl-process-content {
  from { opacity: .5; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes orl-metric-impact {
  from { transform: translateY(6px) scale(.98); opacity: .58; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

@keyframes orl-signal-travel {
  0% { left: -88px; opacity: 0; }
  16% { opacity: .55; }
  82% { opacity: .55; }
  100% { left: calc(100% + 88px); opacity: 0; }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    /* One motion system only. The older JS reveals are neutralized on browsers
       where the view-timeline choreography owns the page. */
    .reveal-wipe,
    .reveal-left,
    .rule-line {
      clip-path: none !important;
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }

    #diagnosis > div:last-child > div,
    #services > div:last-child > div,
    #results > div:last-child > div,
    #testimonials > div:last-child > div,
    #ledger .ledger-slide,
    #why-us > div:last-child > div,
    #calculator > div:nth-child(2) > div,
    #lead-magnet > div,
    #lead-magnet + section .grid > a,
    #contact > div > div:last-child {
      animation-range: entry 4% cover 46%;
    }

    #diagnosis > div:last-child > div::after,
    #services > div:last-child > div::after,
    #results > div:last-child > div::after,
    #testimonials > div:last-child > div::after,
    #ledger .ledger-slide::after,
    #why-us > div:last-child > div::after,
    #calculator > div:nth-child(2) > div::after,
    #lead-magnet > div::after,
    #lead-magnet + section .grid > a::after,
    #contact > div > div:last-child::after {
      border-color: rgba(249, 249, 247, .40);
      animation-range: entry 2% cover 50%;
    }

    #services > div:last-child > div::before,
    #results > div:last-child > div::before,
    #ledger .ledger-slide::before,
    #lead-magnet > div::before,
    #calculator > div:nth-child(2) > div:last-child::before,
    #contact > div > div:last-child::before,
    #diagnosis > div:last-child > div:last-child::before {
      animation-range: entry 12% cover 50%;
    }

    #process > div:last-child::before {
      animation-range: entry 5% cover 68%;
    }

    #process > div:last-child > div:nth-child(1),
    #process > div:last-child > div:nth-child(1)::before { animation-range: entry 10% cover 31%; }
    #process > div:last-child > div:nth-child(2),
    #process > div:last-child > div:nth-child(2)::before { animation-range: entry 24% cover 45%; }
    #process > div:last-child > div:nth-child(3),
    #process > div:last-child > div:nth-child(3)::before { animation-range: entry 38% cover 59%; }
    #process > div:last-child > div:nth-child(4),
    #process > div:last-child > div:nth-child(4)::before { animation-range: entry 52% cover 73%; }

    #results span.font-display-xl-mobile,
    #ledger .ledger-slide .font-display-xl-mobile,
    #calculator #calc-target-revenue {
      animation-range: entry 18% cover 50%;
    }

    #results .rule-line::after,
    #testimonials .rule-line::after,
    #expertise .border-t::after {
      box-shadow: none;
      animation-range: entry 8% cover 54%;
    }

    /* Text motion is deliberately subtle and slower than the frame. This gives
       the page a composed editorial reveal instead of content flashing in. */
    #diagnosis h2,
    #services h2,
    #process h2,
    #expertise h2,
    #testimonials h2,
    #ledger h2,
    #why-us h2,
    #calculator h2,
    #lead-magnet h2,
    #lead-magnet + section h2,
    #contact h2,
    #diagnosis > div:first-child > span,
    #process > div:first-child > span,
    #why-us > div:first-child > span,
    #calculator > div:first-child > span,
    #lead-magnet > div span,
    #contact > div > div:first-child > span {
      animation-name: orl-text-settle;
      animation-duration: 1ms;
      animation-fill-mode: both;
      animation-timing-function: linear;
      animation-timeline: view(block);
      animation-range: entry 8% cover 38%;
    }

    #diagnosis > div:last-child p,
    #diagnosis > div:last-child li,
    #services > div:last-child h3,
    #services > div:last-child p,
    #process > div:last-child h3,
    #process > div:last-child p,
    #why-us > div:last-child h3,
    #why-us > div:last-child p,
    #testimonials > div:last-child p,
    #ledger .ledger-slide p,
    #lead-magnet p,
    #contact > div > div:first-child p {
      animation-name: orl-text-settle;
      animation-duration: 1ms;
      animation-fill-mode: both;
      animation-timing-function: linear;
      animation-timeline: view(block);
      animation-range: entry 12% cover 44%;
    }

    @media (max-width: 767px) {
      #process > div:last-child::before {
        animation-range: entry 4% cover 78%;
      }
    }
  }
}
'''

css_path.write_text(css)
