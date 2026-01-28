import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dashboard Design System
        dashboard: {
          primary: '#F4A024',
          'primary-dark': '#C97F16',
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
          info: '#0EA5E9',
          background: '#F9FAFB',
          surface: '#FFFFFF',
          'surface-muted': '#F3F4F6',
          'text-primary': '#111827',
          'text-secondary': '#6B7280',
          'text-muted': '#9CA3AF',
          border: '#E5E7EB',
          divider: '#E5E7EB',
          'chart-primary': '#F4A024',
          'chart-primary-light': 'rgba(244, 160, 36, 0.25)',
          'chart-gray': '#9CA3AF',
        },
        // Site Public Design System
        site: {
          primary: '#F4A024',
          'primary-dark': '#C97F16',
          'olive-accent': '#4B4F1E',
          'text-primary': '#1E1E1E',
          'text-secondary': '#555555',
          background: '#FFFFFF',
          'background-muted': '#F7F7F7',
          'overlay-dark': 'rgba(0,0,0,0.65)',
          'border-light': '#E5E5E5',
          success: '#2E7D32',
          error: '#C62828',
          whatsapp: '#25D366',
        },
      },
      fontFamily: {
        // Dashboard
        inter: ['Inter', 'system-ui', 'sans-serif'],
        // Site Public
        poppins: ['Poppins', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Dashboard
        'dashboard-page-title': '24px',
        'dashboard-section-title': '18px',
        'dashboard-card-title': '16px',
        'dashboard-body': '14px',
        'dashboard-small': '12px',
        // Site Public
        'site-h1': '56px',
        'site-h2': '40px',
        'site-h3': '28px',
        'site-section-title': '22px',
        'site-body': '16px',
        'site-small': '14px',
      },
      spacing: {
        'sidebar-width': '260px',
        'header-height': '64px',
        'site-header-height': '80px',
      },
      maxWidth: {
        'dashboard-content': '1440px',
        'site-container': '1200px',
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
        'badge': '999px',
      },
    },
  },
  plugins: [],
}

export default config
