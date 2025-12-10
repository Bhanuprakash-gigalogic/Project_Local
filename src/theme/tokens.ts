// Enterprise Design System Tokens
// Primary Brand: Indigo
// Theme: Light Mode (Default)

export const colors = {
    // Brand
    primary: {
        DEFAULT: '#4F46E5', // Indigo 600
        hover: '#4338CA',   // Indigo 700
        light: '#EEF2FF',   // Indigo 50
        border: '#C7D2FE',  // Indigo 200
    },

    // Base UI
    background: '#F9FAFB', // Gray 50
    foreground: '#111827', // Gray 900
    card: '#FFFFFF',
    cardForeground: '#111827',

    // Neutrals / Inputs
    input: {
        background: '#F3F4F6', // Gray 100
        border: '#D1D5DB',     // Gray 300
        placeholder: '#9CA3AF', // Gray 400
        focusRing: 'rgba(79,70,229,0.3)',
    },

    // Status
    status: {
        active: {
            bg: '#ECFDF5',     // Emerald 50
            border: '#A7F3D0', // Emerald 200
            text: '#059669',   // Emerald 600
        },
        pending: {
            bg: '#FFFBEB',     // Amber 50
            border: '#FCD34D', // Amber 300
            text: '#D97706',   // Amber 600
        },
        error: {
            bg: '#FEF2F2',     // Red 50
            border: '#FECACA', // Red 200
            text: '#DC2626',   // Red 600
        },
        draft: {
            bg: '#F3F4F6',     // Gray 100
            text: '#6B7280',   // Gray 500
        },
    },

    // Sidebar
    sidebar: {
        background: '#1F2937', // Gray 800
        hover: '#374151',      // Gray 700
        active: '#4F46E5',     // Indigo 600
        iconInactive: '#9CA3AF',
        iconActive: '#FFFFFF',
    },

    // Analytics
    metric: {
        trendUp: '#16A34A',   // Green 600
        trendDown: '#DC2626', // Red 600
        info: '#2563EB',      // Blue 600
        infoLight: '#DBEAFE', // Blue 100
    }
} as const;

export const spacing = {
    sidebarWidth: '16rem', // 64
    sidebarCollapsed: '4rem', // 16
    topbarHeight: '4rem', // 16
} as const;

export const tokens = {
    colors,
    spacing,
};

export default tokens;
