# Context Bridge

Herramienta personal para no perder contexto de un proyecto al cambiar entre distintas IAs de chat (Claude, ChatGPT, etc.) cuando se agotan los límites del tier gratuito de alguna de ellas.

En vez de re-explicar desde cero el estado del proyecto cada vez que cambias de IA, guardas decisiones, convenciones, snippets y estado de tareas como "context entries", y la app las compila en un bloque de texto listo para copiar y pegar como primer mensaje en el chat que uses ese día.

## Stack

- Node.js + Express + TypeScript
- PostgreSQL 16 (vía Docker)
- Prisma 7 (ORM)
- Frontend: HTML/JS plano, servido como estático desde Express

## Cómo levantar el proyecto

```bash
npm install
docker compose up -d
npx prisma generate
npx prisma migrate dev
npm run dev
```

Abre `http://localhost:3000` para la UI.

## Estado actual

### Hecho

- CRUD de `Project` (crear, listar) vía API
- CRUD de `ContextEntry` (crear, listar, desactivar, reactivar) vía API y UI
- Compilador de contexto: agrupa entries activas por tipo (`DECISION`, `CONVENTION`, `SNIPPET`, `TASK_STATUS`) y genera un prompt formateado
- Frontend mínimo: selector de proyecto, formulario de creación de entries, lista con toggle activar/desactivar, botón de copiar contexto compilado

### Pendiente / ideas para seguir

- Crear proyectos desde la UI (ahora mismo solo por API) — en progreso
- Editar el contenido de una context entry existente, no solo activar/desactivar
- Manejo de errores centralizado (middleware global de Express, en vez de try/catch repetido por controller)
- Validación de inputs con una librería tipada (ej. `zod`) en vez de confiar en que el body llega bien formado

### Descartado conscientemente

- Llamar directamente a las APIs de pago de Claude/OpenAI desde el backend (adapter de IA). Se descartó porque el uso real es con tiers gratuitos de chat, no con API de pago — así que no resolvía el problema real. Puede reconsiderarse si en algún momento se paga una API de forma habitual.

## Estructura

```
src/
  main.ts                  → punto de entrada, monta rutas y sirve /public
  projects/                → CRUD de proyectos
  context-entries/         → CRUD de context entries (anidado bajo /projects/:projectId)
  compiler/                → compila las entries activas de un proyecto en un prompt
  generated/prisma/        → cliente de Prisma generado (no se sube al repo)
public/
  index.html, app.js       → frontend mínimo
prisma/
  schema.prisma            → modelos Project y ContextEntry
  migrations/              → historial de migraciones