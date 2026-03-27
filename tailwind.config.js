/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Primaire vert menthe doux ── */
        mint: {
          50:  '#f0faf5', 100: '#d6f2e4', 200: '#a8d8b8', 300: '#78c497',
          400: '#4aaf76', 500: '#2d9a5e', 600: '#227a4a', 700: '#185c38',
          800: '#0f3f26', 900: '#082515',
        },
        /* ── Lavande douce ── */
        lavande: {
          50:  '#f4f2ff', 100: '#ebe6ff', 200: '#d4ccff', 300: '#b8b0ff',
          400: '#9a8fff', 500: '#7b6ef5', 600: '#5f4fd8', 700: '#4639b0',
          800: '#2e2480', 900: '#1a1554',
        },
        /* ── Pêche/rose doux ── */
        peche: {
          50:  '#fff5f2', 100: '#ffe8e0', 200: '#ffc8b4', 300: '#ffaa8c',
          400: '#ff8c66', 500: '#f46b42', 600: '#cc4f28', 700: '#a33720',
        },
        /* ── Jaune soleil doux ── */
        soleil: {
          50:  '#fffbf0', 100: '#fff4d1', 200: '#ffe89e', 300: '#ffd86b',
          400: '#ffc636', 500: '#f5b014', 600: '#c78a07', 700: '#9a6705',
        },
        /* ── Neutres chauds ── */
        ink: {
          50:  '#f8f8f8', 100: '#f0f0f0', 200: '#e0e0e0', 300: '#c0bfbf',
          400: '#9a9898', 500: '#6e6c6b', 600: '#4a4846', 700: '#322f2e',
          800: '#1e1c1b', 900: '#111010',
        },
        /* ── Fond blanc/cassé ── */
        surface: {
          50:  '#ffffff', 100: '#fafafa', 200: '#f5f4f2', 300: '#edecea',
        },
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '4xl': ['2.25rem',  { lineHeight: '1.1', letterSpacing: '-0.04em' }],
      },
      spacing: {
        'tap':    '44px',
        'safe-b': 'env(safe-area-inset-bottom)',
        'safe-t': 'env(safe-area-inset-top)',
        '4.5':    '1.125rem',
        '13':     '3.25rem',
        '18':     '4.5rem',
        '22':     '5.5rem',
      },
      padding: {
        /* Safe-area padding combinée pour les headers */
        'safe-header-sm': 'calc(1.25rem + env(safe-area-inset-top))',
        'safe-header-md': 'calc(2rem + env(safe-area-inset-top))',
        'safe-header-lg': 'calc(2.5rem + env(safe-area-inset-top))',
        'safe-header-xl': 'calc(3rem + env(safe-area-inset-top))',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'xs':        '0 1px 2px rgba(0,0,0,0.05)',
        'sm':        '0 2px 8px rgba(0,0,0,0.06)',
        'card':      '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-lift': '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'pill':      '0 4px 20px rgba(45,154,94,0.20)',
        'tab':       '0 -1px 0 rgba(0,0,0,0.03), 0 8px 40px rgba(0,0,0,0.12)',
        'inner-sm':  'inset 0 2px 4px rgba(0,0,0,0.04)',
        'hero':      '0 4px 24px rgba(0,0,0,0.07)',
        'btn-mint':  '0 4px 16px rgba(45,154,94,0.25)',
        'btn-lavande':'0 4px 16px rgba(123,110,245,0.30)',
        'suggestion':'0 4px 20px rgba(0,0,0,0.07)',
        'overlay':   '0 8px 24px rgba(0,0,0,0.10)',
        'dialog':    '0 24px 64px rgba(0,0,0,0.18)',
        'cat':       '0 2px 12px rgba(0,0,0,0.05)',
      },
      backgroundImage: {
        /* Fond hero Home */
        'hero-mint': 'linear-gradient(160deg, #e8f5ee 0%, #f0f7f4 55%, #f7f8f5 100%)',
        /* Fond citation */
        'citation':  'linear-gradient(135deg, #ecfdf5 0%, #ebe6ff 100%)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'expo':      'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'in':         'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'in-fast':    'fadeUp 0.22s cubic-bezier(0.16,1,0.3,1) both',
        'in-scale':   'scaleUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'float':      'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from:{opacity:'0',transform:'translateY(16px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        scaleUp:   { from:{opacity:'0',transform:'scale(0.92)'},      to:{opacity:'1',transform:'scale(1)'}     },
        float:     { '0%,100%':{transform:'translateY(0)'},           '50%':{transform:'translateY(-10px)'}     },
        pulseSoft: { '0%,100%':{opacity:'1'},                         '50%':{opacity:'0.6'}                    },
      },
    },
  },
  plugins: [],
}
