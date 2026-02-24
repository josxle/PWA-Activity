📁 CARPETA PARA ICONOS PWA

Se necesitan aquí 4 archivos PNG:

1. icon-192x192.png          (192x192 píxeles)
2. icon-512x512.png          (512x512 píxeles)
3. icon-maskable-192x192.png (192x192 píxeles, versión maskable)
4. icon-maskable-512x512.png (512x512 píxeles, versión maskable)

═══════════════════════════════════════════════════════════════════

¿Cómo generar los iconos?

OPCIÓN 1: Automático (Recomendado)
  npm run generate:icons
  
OPCIÓN 2: Online (PWABuilder)
  https://www.pwabuilder.com
  
OPCIÓN 3: ImageMagick (CLI)
  convert input.png -resize 192x192 icon-192x192.png
  convert input.png -resize 512x512 icon-512x512.png
  
OPCIÓN 4: Online (favicon.io)
  https://favicon.io

Ver documento: ../ICONS-GENERATION.md para más detalles

═══════════════════════════════════════════════════════════════════

¿Diferencia entre "regular" y "maskable"?

Regular (icon-192x192.png):
  - Icono estándar con fondo de color
  - Se muestra como aparece

Maskable (icon-maskable-192x192.png):
  - Se adapta a la forma del SO (Android 12+)
  - Logo centrado con padding de 20-30px

Ambos son necesarios para máxima compatibilidad.

═══════════════════════════════════════════════════════════════════

Una vez generados, ejecuta:
  npm run dev
  
Verifica en DevTools:
  F12 → Application → Manifest → Iconos
  
Deben mostrarse los 4 sin errores.

═══════════════════════════════════════════════════════════════════

Última actualización: Febrero 2024
