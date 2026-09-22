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


## Importante para actualizar el URL actual
Este paquete usa `name = "landing-valleoriente"` para sobrescribir el Worker existente `https://landing-valleoriente.ovrealestate.workers.dev/`. Ejecutar `npx wrangler deploy` desde esta carpeta.


## Ajuste V2.1
- Se agregó separación correcta entre la franja de métricas y “A pocos minutos de Valle Oriente”.
- Se corrigió el bloque de conectividad para desktop y mobile.
- Se eliminaron los prefijos 01/02/03/04 y se convirtieron las categorías en chips limpios: Negocios, Gastronomía, Compras y Educación.


## Ajustes v2.2
- Se agregó slider automático de 4 imágenes en la sección de resumen del proyecto.
- La primera imagen muestra el conjunto desde una vista más abierta/elevada.
- Se incrementó el espacio superior en la franja “A pocos minutos de Valle Oriente”.
- Se mantuvieron las correcciones previas del texto de categorías y del comportamiento mobile.
