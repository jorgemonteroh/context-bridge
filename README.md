# Context Bridge

Herramienta personal para no perder contexto de un proyecto al cambiar entre distintas IAs de chat (Claude, ChatGPT, etc.) cuando se agotan los límites del tier gratuito de alguna de ellas.

En vez de re-explicar desde cero el estado del proyecto cada vez que cambias de IA, guardas decisiones, convenciones, snippets y estado de tareas como "context entries", y la app las compila en un bloque de texto listo para copiar y pegar como primer mensaje en el chat que uses ese día.

## Stack

- Node.js + Express + TypeScript
- PostgreSQL 16 (vía Docker)
- Prisma 7 (ORM)
- Zod (validación de inputs)
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

- CRUD de `Project` (crear, listar) vía API y UI
- CRUD de `ContextEntry` (crear, listar, editar, desactivar, reactivar) vía API y UI
- Compilador de contexto: agrupa entries activas por tipo (`DECISION`, `CONVENTION`, `SNIPPET`, `TASK_STATUS`) y genera un prompt formateado
- Frontend mínimo: creación de proyectos, selector de proyecto, formulario de creación/edición de entries, lista con toggle activar/desactivar, botón de copiar contexto compilado
- Manejo de errores centralizado: middleware global en Express que traduce `AppError`/`NotFoundError` y `ZodError` a respuestas HTTP consistentes, en vez de try/catch repetido por controller
- Validación de inputs con Zod en la creación/edición de proyectos y context entries, devolviendo 400 con detalle del campo que falló

### Pendiente / ideas para seguir

- Tests automatizados (aún no hay ninguno)
- Manejar el caso de crear una context entry con un `projectId` que no existe de forma más explícita en el frontend (ahora mismo el backend ya lo cubre con 404, falta reflejarlo bien en la UI)
- Posible mejora de UX: confirmación antes de desactivar una entry, para evitar clics accidentales

### Descartado conscientemente

- Llamar directamente a las APIs de pago de Claude/OpenAI desde el backend (adapter de IA). Se descartó porque el uso real es con tiers gratuitos de chat, no con API de pago — así que no resolvía el problema real. Puede reconsiderarse si en algún momento se paga una API de forma habitual.

## Estructura

```
src/
  main.ts                  → punto de entrada, monta rutas, middleware de errores, sirve /public
  errors.ts                → clases AppError, NotFoundError, ValidationError
  projects/                → CRUD de proyectos (service, controller, schemas de validación)
  context-entries/         → CRUD de context entries (anidado bajo /projects/:projectId)
  compiler/                → compila las entries activas de un proyecto en un prompt
  generated/prisma/        → cliente de Prisma generado (no se sube al repo)
public/
  index.html, app.js       → frontend mínimo
prisma/
  schema.prisma            → modelos Project y ContextEntry
  migrations/              → historial de migraciones
