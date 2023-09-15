module.exports = {
  important: '#EasyExtensionTemplate',
  darkMode: 'class',
  plugins: [],
  content: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        black: '#181818',
      },
      fontFamily: {
        sans: [
          'Roboto',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe Ui"',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe Ui Emoji"',
          '"Segoe Ui Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
}
