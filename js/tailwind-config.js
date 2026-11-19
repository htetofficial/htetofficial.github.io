/**
 * Htet Official — Editorial Design System Tailwind Configuration
 * Configures color tokens, typography scales, and responsive breakpoints.
 */
window.tailwind = {
  config: {
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
      extend: {
        screens: {
          'xs': '400px'
        },
        colors: {
          ivory: 'var(--bg-ivory)',
          cream: 'var(--bg-cream)',
          card: 'var(--bg-card)',
          taupe: 'var(--border-taupe)',
          charcoal: 'var(--text-charcoal)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
          vermilion: {
            DEFAULT: 'var(--accent-vermilion)',
            light: '#E25B52',
            dark: '#8A2B1D',
            soft: 'var(--accent-vermilion-soft)'
          }
        },
        fontFamily: {
          serif: ['Cormorant Garamond', 'Pyidaungsu', 'Georgia', 'serif'],
          sans: ['Pyidaungsu', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
          burmese: ['Pyidaungsu', 'sans-serif']
        }
      }
    }
  }
};
