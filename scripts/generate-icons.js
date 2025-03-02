const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1976d2';
  ctx.fillRect(0, 0, size, size);

  // Simple earthquake wave design
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = size / 20;
  ctx.beginPath();
  ctx.moveTo(size * 0.2, size * 0.5);
  ctx.lineTo(size * 0.35, size * 0.3);
  ctx.lineTo(size * 0.65, size * 0.7);
  ctx.lineTo(size * 0.8, size * 0.5);
  ctx.stroke();

  return canvas.toBuffer();
}

const sizes = [192, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach(size => {
  const iconBuffer = generateIcon(size);
  fs.writeFileSync(
    path.join(iconsDir, `earthquake-icon-${size}.png`),
    iconBuffer
  );
});