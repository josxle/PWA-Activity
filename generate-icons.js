#!/usr/bin/env node

/**
 * Script para generar iconos PWA automáticamente
 * Uso: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Colores de la aplicación
const GRADIENT_START = '#667eea';
const GRADIENT_END = '#764ba2';

// Crear directorio si no existe
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log(`✅ Directorio creado: ${iconsDir}`);
}

// SVG simple que podemos convertir a PNG
const svgTemplate = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${GRADIENT_START};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${GRADIENT_END};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fondo degradado -->
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  
  <!-- Checkbox grande -->
  <g transform="translate(${size * 0.2}, ${size * 0.2}) scale(${(size * 0.6) / 100})">
    <!-- Caja del checkbox -->
    <rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="4" rx="8"/>
    
    <!-- Checkmark -->
    <polyline points="30,50 45,65 70,35" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  
  <!-- Texto: Task -->
  <text x="${size / 2}" y="${size * 0.85}" 
        font-size="${size * 0.18}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        font-family="Arial, sans-serif">
    TASKS
  </text>
</svg>`;

// Generar archivos usando Node.js puro (sin dependencias externas)
function generateIconsWithDataURL() {
  const sizes = [192, 512];
  const purposes = ['', '-maskable'];
  
  console.log('\n📦 Generando íconos PWA...\n');
  
  sizes.forEach(size => {
    purposes.forEach(purpose => {
      const filename = `icon-${size}x${size}${purpose}.png`;
      const filepath = path.join(iconsDir, filename);
      
      // Crear un PNG simple con gradiente y emoji
      // Para esto usamos una representación canvas que podemos renderizar
      const svg = svgTemplate(size);
      
      // Guardar como SVG primero (para referencia)
      const svgPath = filepath.replace('.png', '.svg');
      fs.writeFileSync(svgPath, svg, 'utf-8');
      
      console.log(`✅ ${filename} (SVG generado)`);
      console.log(`   Ruta: ${svgPath}`);
      console.log(`   Tamaño: ${size}x${size}px`);
      console.log('');
    });
  });
  
  // Generar PNG placeholder usando canvas si está disponible
  try {
    const canvas = require('canvas');
    generatePNGsWithCanvas(canvas, sizes, purposes);
  } catch (e) {
    console.warn('⚠️  canvas no instalado. SVGs generados como respaldo.\n');
    console.log('Para generar PNGs reales, ejecuta:');
    console.log('  npm install canvas\n');
    console.log('O convierte los SVGs:');
    console.log('  npm install -g svgexport');
    console.log('  svgexport public/icons/icon-192x192.svg public/icons/icon-192x192.png');
    console.log('  svgexport public/icons/icon-512x512.svg public/icons/icon-512x512.png\n');
  }
}

function generatePNGsWithCanvas(canvas, sizes, purposes) {
  console.log('🎨 Usando canvas para generar PNGs...\n');
  
  sizes.forEach(size => {
    purposes.forEach(purpose => {
      const filename = `icon-${size}x${size}${purpose}.png`;
      const filepath = path.join(iconsDir, filename);
      
      // Crear canvas
      const c = canvas.createCanvas(size, size);
      const ctx = c.getContext('2d');
      
      // Gradiente
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, GRADIENT_START);
      gradient.addColorStop(1, GRADIENT_END);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      
      // Dibujar checkbox
      const checkboxSize = size * 0.4;
      const x = (size - checkboxSize) / 2;
      const y = (size - checkboxSize) / 3;
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = size * 0.03;
      ctx.roundRect(x, y, checkboxSize, checkboxSize, size * 0.05);
      ctx.stroke();
      
      // Checkmark
      ctx.beginPath();
      ctx.moveTo(x + checkboxSize * 0.3, y + checkboxSize * 0.5);
      ctx.lineTo(x + checkboxSize * 0.45, y + checkboxSize * 0.65);
      ctx.lineTo(x + checkboxSize * 0.7, y + checkboxSize * 0.35);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = size * 0.04;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Texto
      ctx.fillStyle = 'white';
      ctx.font = `bold ${size * 0.15}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('TASKS', size / 2, size * 0.92);
      
      // Guardar PNG
      const buffer = c.toBuffer('image/png');
      fs.writeFileSync(filepath, buffer);
      
      console.log(`✅ ${filename}`);
      console.log(`   Ruta: ${filepath}`);
      console.log(`   Tamaño: ${size}x${size}px`);
      console.log('');
    });
  });
  
  console.log('✨ Todos los PNGs han sido generados exitosamente!\n');
}

// Verificar icons
function verifyIcons() {
  console.log('\n🔍 Verificando íconos...\n');
  
  const requiredFiles = [
    'icon-192x192.png',
    'icon-512x512.png',
    'icon-maskable-192x192.png',
    'icon-maskable-512x512.png'
  ];
  
  let allPresent = true;
  requiredFiles.forEach(file => {
    const filepath = path.join(iconsDir, file);
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      console.log(`✅ ${file} (${stats.size} bytes)`);
    } else {
      console.log(`❌ ${file} (FALTANTE)`);
      allPresent = false;
    }
  });
  
  if (allPresent) {
    console.log('\n✨ Todos los íconos están presentes y listos!\n');
  } else {
    console.log('\n⚠️  Algunos íconos falta. Revisa los pasos anteriores.\n');
  }
  
  return allPresent;
}

// Ejecutar
generateIconsWithDataURL();
verifyIcons();

console.log('📖 Para más información sobre generación de íconos, ver: ICONS-GENERATION.md\n');
