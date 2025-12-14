/**
 * AppTheme.js
 * * Purpose: Centralized theme and style configuration to ensure a consistent, 
 * accessible, and "super duper easy to use" UI across the entire application.
 */

// --- Color Palette ---
const COLORS = {
    // Primary Brand Colors (Deep Blue/White)
    primary: '#1A237E',      // Deep Indigo Blue (Used for headers, buttons, accents)
    secondary: '#B3E5FC',    // Light Sky Blue (Used for secondary buttons/highlights)
    background: '#F7F9FC',   // Very Light Grey/Off-White (Main screen background)
    card: '#FFFFFF',         // Pure White (Used for cards, inputs, containers)
    textPrimary: '#1A237E',  // Same as primary, for bold text
    textSecondary: '#6A7398',// Muted Grey-Blue (Used for labels, descriptions)

    // Functional/Status Colors
    success: '#00C853',      // Bright Green (For confirmations, received funds)
    error: '#D32F2F',        // Strong Red (For failures, errors)
    warning: '#FFA000',      // Amber/Orange (For pending status, backups)
    
    // Crypto-Specific Colors (Used for asset icons)
    eth: '#627EEA',
    btc: '#F7931A',
    sol: '#00FFAA',
    bnb: '#F3BA2F',
};

// --- Typography ---
const FONT_FAMILY = {
    // Note: In React Native, these map to the system's default sans-serif font
    bold: 'System-Bold', 
    semiBold: 'System-SemiBold',
    medium: 'System-Medium',
    regular: 'System-Regular',
};

const TYPOGRAPHY = {
    h1: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.textPrimary,
        fontFamily: FONT_FAMILY.bold,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
        fontFamily: FONT_FAMILY.bold,
    },
    bodyLarge: {
        fontSize: 18,
        color: COLORS.textPrimary,
        fontFamily: FONT_FAMILY.regular,
    },
    bodyMedium: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontFamily: FONT_FAMILY.regular,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        fontFamily: FONT_FAMILY.semiBold,
    },
    small: {
        fontSize: 12,
        color: COLORS.textSecondary,
    }
};

// --- Component Styles (Reusable UI Elements) ---
const COMPONENTS = {
    // Card/Container Styles
    cardShadow: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
        padding: 20,
    },
    // Primary Action Button
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: COLORS.card,
        fontSize: 18,
        fontWeight: '700',
        fontFamily: FONT_FAMILY.bold,
    },
    // Input Fields
    textInput: {
        backgroundColor: COLORS.card,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
};

export const AppTheme = {
    COLORS,
    TYPOGRAPHY,
    COMPONENTS,
};
