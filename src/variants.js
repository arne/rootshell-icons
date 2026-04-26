// 12 terminal-theme colorway variants of the RootShell mark.
// Each entry: { id, name, bg, bgEnd, stroke, tildeStroke? }
// bg → bgEnd is a subtle diagonal gradient (top-left → bottom-right)
// echoing the automatic-gradient that iOS 26 applies to Liquid Glass icons.

export const VARIANTS = [
  { id: '01-solarized-dark',  name: 'Solarized Dark',  bg: '#002b36', bgEnd: '#001f27', stroke: '#93a1a1', tildeStroke: '#b58900' },
  { id: '02-solarized-light', name: 'Solarized Light', bg: '#fdf6e3', bgEnd: '#eee8d5', stroke: '#586e75', tildeStroke: '#cb4b16' },
  { id: '03-dracula',         name: 'Dracula',         bg: '#282a36', bgEnd: '#1e1f29', stroke: '#f8f8f2', tildeStroke: '#bd93f9' },
  { id: '04-nord',            name: 'Nord',            bg: '#2e3440', bgEnd: '#242933', stroke: '#eceff4', tildeStroke: '#88c0d0' },
  { id: '05-gruvbox-dark',    name: 'Gruvbox Dark',    bg: '#282828', bgEnd: '#1d2021', stroke: '#ebdbb2', tildeStroke: '#fabd2f' },
  { id: '06-tokyo-night',     name: 'Tokyo Night',     bg: '#1a1b26', bgEnd: '#13141f', stroke: '#c0caf5', tildeStroke: '#bb9af7' },
  { id: '07-catppuccin',      name: 'Catppuccin',      bg: '#1e1e2e', bgEnd: '#181825', stroke: '#cdd6f4', tildeStroke: '#fab387' },
  { id: '08-bases',           name: 'Bases',           bg: '#141210', bgEnd: '#0c0a08', stroke: '#4a4640', tildeStroke: '#48a068' },
  { id: '09-mono-light',      name: 'Mono Light',      bg: '#f5f1ea', bgEnd: '#ece7dc', stroke: '#7a756c', tildeStroke: '#1a1a1a' },
  { id: '10-monokai',         name: 'Monokai',         bg: '#272822', bgEnd: '#1c1d18', stroke: '#f8f8f2', tildeStroke: '#f92672' },
  { id: '11-mono-dark',       name: 'Mono Dark',       bg: '#0e0e0e', bgEnd: '#050505', stroke: '#5a5a5a', tildeStroke: '#e8e6e0' },
  { id: '12-rose-pine',       name: 'Rosé Pine',       bg: '#191724', bgEnd: '#13111e', stroke: '#e0def4', tildeStroke: '#ebbcba' },
];
