// iOS AppIcon size manifest. Filenames use '-Nx' instead of '@Nx' to keep
// shell-friendly names; Xcode reads them via Contents.json regardless.

export const IOS_ICONS = [
  { size: '20',   scale: 2, px: 40,   idiom: 'iphone',        file: 'Icon-iphone-20-2x.png' },
  { size: '20',   scale: 3, px: 60,   idiom: 'iphone',        file: 'Icon-iphone-20-3x.png' },
  { size: '29',   scale: 2, px: 58,   idiom: 'iphone',        file: 'Icon-iphone-29-2x.png' },
  { size: '29',   scale: 3, px: 87,   idiom: 'iphone',        file: 'Icon-iphone-29-3x.png' },
  { size: '40',   scale: 2, px: 80,   idiom: 'iphone',        file: 'Icon-iphone-40-2x.png' },
  { size: '40',   scale: 3, px: 120,  idiom: 'iphone',        file: 'Icon-iphone-40-3x.png' },
  { size: '60',   scale: 2, px: 120,  idiom: 'iphone',        file: 'Icon-iphone-60-2x.png' },
  { size: '60',   scale: 3, px: 180,  idiom: 'iphone',        file: 'Icon-iphone-60-3x.png' },
  { size: '20',   scale: 1, px: 20,   idiom: 'ipad',          file: 'Icon-ipad-20-1x.png' },
  { size: '20',   scale: 2, px: 40,   idiom: 'ipad',          file: 'Icon-ipad-20-2x.png' },
  { size: '29',   scale: 1, px: 29,   idiom: 'ipad',          file: 'Icon-ipad-29-1x.png' },
  { size: '29',   scale: 2, px: 58,   idiom: 'ipad',          file: 'Icon-ipad-29-2x.png' },
  { size: '40',   scale: 1, px: 40,   idiom: 'ipad',          file: 'Icon-ipad-40-1x.png' },
  { size: '40',   scale: 2, px: 80,   idiom: 'ipad',          file: 'Icon-ipad-40-2x.png' },
  { size: '76',   scale: 2, px: 152,  idiom: 'ipad',          file: 'Icon-ipad-76-2x.png' },
  { size: '83.5', scale: 2, px: 167,  idiom: 'ipad',          file: 'Icon-ipad-83.5-2x.png' },
  { size: '1024', scale: 1, px: 1024, idiom: 'ios-marketing', file: 'Icon-marketing-1024.png' },
];

// macOS .iconset sizes. iconutil expects exactly these filenames (with @2x).
export const MAC_ICONS = [
  { px: 16,   name: 'icon_16x16.png' },
  { px: 32,   name: 'icon_16x16@2x.png' },
  { px: 32,   name: 'icon_32x32.png' },
  { px: 64,   name: 'icon_32x32@2x.png' },
  { px: 128,  name: 'icon_128x128.png' },
  { px: 256,  name: 'icon_128x128@2x.png' },
  { px: 256,  name: 'icon_256x256.png' },
  { px: 512,  name: 'icon_256x256@2x.png' },
  { px: 512,  name: 'icon_512x512.png' },
  { px: 1024, name: 'icon_512x512@2x.png' },
];

export const PREVIEW_SIZES = [180, 512, 1024];
