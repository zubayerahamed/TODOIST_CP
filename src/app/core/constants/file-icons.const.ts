export const FILE_ICON_MAPPING: { [key: string]: string } = {
  // Image formats
  'jpg': 'JPG',
  'jpeg': 'JPG',
  'png': 'PNG',
  'gif': 'GIF',
  'svg': 'SVG',
  'webp': 'WEBP',
  'bmp': 'BMP',
  'image': 'IMG', // fallback for any image type

  // Document formats
  'pdf': 'PDF',
  'doc': 'DOC',
  'docx': 'DOC',
  'txt': 'TXT',
  'rtf': 'TXT',

  // Spreadsheet formats
  'xls': 'XLS',
  'xlsx': 'XLS',
  'csv': 'CSV',

  // Presentation formats
  'ppt': 'PPT',
  'pptx': 'PPT',

  // Archive formats
  'zip': 'ZIP',
  'rar': 'ZIP',
  '7z': 'ZIP',
  'tar': 'ZIP',
  'gz': 'ZIP',

  // Code formats
  'js': 'CODE',
  'ts': 'CODE',
  'html': 'CODE',
  'css': 'CODE',
  'json': 'CODE',

  // Default fallbacks
  'audio': 'AUDIO',
  'video': 'VIDEO',
  'text': 'TXT',
  'application': 'FILE'
};