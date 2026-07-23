export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  MODERN: 'modern',
  MATERIAL: 'material',
  BOOTSTRAP: 'bootstrap',
};

export const themeConfigs = {
  [THEMES.LIGHT]: {
    name: 'Light',
    colors: {
      primary: '#00084D',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      border: '#dee2e6',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
    },
  },
  [THEMES.DARK]: {
    name: 'Dark',
    colors: {
      primary: '#4a6cf7',
      secondary: '#8a8a8a',
      background: '#1a1a2e',
      surface: '#16213e',
      text: '#f0f0f0',
      border: '#2a2a3e',
      success: '#4caf50',
      danger: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
    },
  },
  [THEMES.MODERN]: {
    name: 'Modern',
    colors: {
      primary: '#6C63FF',
      secondary: '#9B9B9B',
      background: '#f8f9fe',
      surface: '#ffffff',
      text: '#2d2d2d',
      border: '#e8e8f0',
      success: '#00c853',
      danger: '#ff1744',
      warning: '#ff9100',
      info: '#00bcd4',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
    },
  },
  [THEMES.MATERIAL]: {
    name: 'Material',
    colors: {
      primary: '#1976D2',
      secondary: '#757575',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#212121',
      border: '#e0e0e0',
      success: '#4caf50',
      danger: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px',
    },
  },
  [THEMES.BOOTSTRAP]: {
    name: 'Bootstrap',
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      border: '#dee2e6',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0',
    },
    typography: {
      fontFamily: 'System, -apple-system, sans-serif',
      fontSize: '16px',
    },
  },
};

export const getTheme = (themeName) => {
  return themeConfigs[themeName] || themeConfigs[THEMES.LIGHT];
};

export const getThemeNames = () => {
  return Object.keys(THEMES);
};