# Arquitectura Híbrida: Diario de Desarrollo

## Capítulo 2: Ejecución y Estilos

El sistema de diseño se basa en un archivo `_tokens.scss` que actúa como nuestra "Base de Datos de Variables Globales".

### Zonas del Mapa

Asignamos un color específico a cada "Zona" de la aplicación para guiar al usuario visualmente:
- **Teal (#2ecfa8)**: Estadísticas (About)
- **Amber (#f0a500)**: Misiones (Projects)
- **Coral (#e05c7a)**: Party (Contacto)
- **Sky Blue (#38bdf8)**: Data Logs (Crónicas)

```scss
// Ejemplo de Tokens
:root {
  --color-zone-blog: #38bdf8;
  --font-pixel: 'Press Start 2P', system-ui;
}
```

Al utilizar clases de utilidad como `.pixel-text` y `.mono-text`, logramos aplicar estos estilos de forma consistente en toda la aplicación sin duplicar código.

Fin de los registros del proyecto (por ahora).
