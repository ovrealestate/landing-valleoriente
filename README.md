# Landing Valle Oriente V2

Landing basada en la arquitectura visual de `landing-turquoise`, adaptada para la campaña de Valle Oriente.

## Decisiones de esta versión
- **Sin formulario nativo**: el sitio no contiene `<form>`, `/api/lead`, página de gracias ni evento `Lead` del Pixel.
- La captación se deja al **Instant Form add-on de Meta**, configurado desde Ads Manager.
- Meta Pixel conserva únicamente `PageView` en la landing.
- No hay CTA de WhatsApp ni otro canal que compita con la prueba del add-on.
- Página única para mantener a la persona dentro de la misma experiencia: hero, proyecto, amenidades, distribuciones y ubicación.
- Parámetros UTM / `fbclid` se conservan al abrir el Aviso de Privacidad y regresar.

## Datos mostrados
- Valle Oriente
- Desde $5.8 MDP
- 1, 2 y 3 recámaras
- 52 a 110 m²
- Entrega inmediata

## Deploy
```bash
npx wrangler deploy
```
