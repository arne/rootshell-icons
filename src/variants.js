// 12 terminal-theme colorway variants of the RootShell v2 mark.
// Each entry: { id, name, bg, top, radical, prompt }
//   bg       — bottom-zone background fill (gradient end auto-derived)
//   top      — top-zone polygon fill (gradient end auto-derived)
//   radical  — color of the off-canvas radical polyline
//   prompt   — color of `>_` (chevron + underscore)

export const VARIANTS = [
  { id: '01-solarized-dark',  name: 'Solarized Dark',  bg: '#002b36', top: '#073642', radical: '#586e75', prompt: '#b58900' },
  { id: '02-solarized-light', name: 'Solarized Light', bg: '#fdf6e3', top: '#eee8d5', radical: '#93a1a1', prompt: '#cb4b16' },
  { id: '03-dracula',         name: 'Dracula',         bg: '#282a36', top: '#44475a', radical: '#6272a4', prompt: '#bd93f9' },
  { id: '04-nord',            name: 'Nord',            bg: '#2e3440', top: '#3b4252', radical: '#4c566a', prompt: '#88c0d0' },
  { id: '05-gruvbox-dark',    name: 'Gruvbox Dark',    bg: '#282828', top: '#3c3836', radical: '#7c6f64', prompt: '#fabd2f' },
  { id: '06-tokyo-night',     name: 'Tokyo Night',     bg: '#1a1b26', top: '#292e42', radical: '#414868', prompt: '#bb9af7' },
  { id: '07-catppuccin',      name: 'Catppuccin Mocha', bg: '#1e1e2e', top: '#313244', radical: '#45475a', prompt: '#fab387' },
  { id: '08-bases',           name: 'Bases',           bg: '#141210', top: '#201e1a', radical: '#3a3630', prompt: '#48a068' },
  { id: '09-mono-light',      name: 'Mono Light',      bg: '#f5f1ea', top: '#e6e1d4', radical: '#85807a', prompt: '#1a1a1a' },
  { id: '10-monokai',         name: 'Monokai',         bg: '#272822', top: '#3e3d32', radical: '#75715e', prompt: '#a6e22e' },
  { id: '11-mono-dark',       name: 'Mono Dark',       bg: '#0e0e0e', top: '#1f1f1f', radical: '#3a3a3a', prompt: '#e8e6e0' },
  { id: '12-rose-pine',       name: 'Rosé Pine',       bg: '#232136', top: '#2a283e', radical: '#393552', prompt: '#ea9a97' },
];
