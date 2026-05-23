# Bitácora de Prompts - Módulo Kanban Backend

## 1. Contexto y Restricciones (Harness Engineering)
Se definió un archivo `AGENTS.md` en la raíz para limitar el contexto del modelo de lenguaje, obligándolo a respetar las reglas para la UI del Kanban LTI.

## Prompt 1: Mapeo y Auditoría del Cliente
Analiza la estructura de este proyecto frontend. Identifica dónde están las páginas existentes, cómo funciona el sistema de enrutado (¿Next.js App Router o Pages Router?), dónde se guardan los componentes compartidos y cómo se están realizando las llamadas a la API (fetch, axios o algún hook personalizado). No generes código aún, descríbeme el territorio.

## Prompt 2: Definición de Tipos y Estado del Kanban
Basado en los endpoints proporcionados en el enunciado:

GET /positions/:id/interviewFlow

GET /positions/:id/candidates

PUT /candidates/:id/stage

Crea las interfaces de TypeScript estrictas para el flujo de entrevistas (InterviewStep) y los candidatos del Kanban (KanbanCandidate). Mapea adecuadamente los campos para que coincidan con la respuesta real de nuestro backend (por ejemplo, manejando que averageScore puede ser un number o null). Coloca estos tipos en el archivo de contratos o tipos del proyecto.

## Prompt 3: Creación de Componentes Atómicos (HTML5 Drag & Drop Nativo)
Vamos a implementar la interfaz del Kanban dividiéndola en componentes atómicos que cumplan la regla de oro de menos de 150 líneas:

PositionHeader.tsx: Muestra el título de la posición y una flecha semántica para regresar al listado de vacantes.

CandidateCard.tsx: Elemento <article> arrastrable (draggable) que muestra el nombre completo del candidato y una insignia con su puntuación media (si es null, muestra 'Sin evaluar').

KanbanColumn.tsx: Elemento <section> que actúa como zona de caída (onDragOver, onDrop) y lista las tarjetas pertenecientes a esa etapa. Usa Container Queries para su comportamiento visual.

KanbanBoard.tsx: Componente contenedor que orquesta el estado, realiza los fetches iniciales sincronizados por el :id de la posición, y maneja el evento de caída para disparar de forma optimista el PUT /candidates/:id/stage hacia la API, revirtiendo el estado si la petición falla.

## Prompt 4:
Actúa como un arquitecto frontend senior. Analiza la estructura de archivos dentro de la carpeta /frontend/src.

Identifica dónde se gestionan las páginas actuales y cómo funciona el sistema de rutas o navegación para la vista de posiciones (positions).

Dime si ya existe algún componente o archivo de configuración para centralizar las llamadas de red (fetch/axios) y la URL base de la API.

Explícame brevemente cómo está estructurado el punto de entrada para que podamos crear la nueva vista de detalle position (Kanban). No generes código de componentes todavía, solo descríbeme el territorio.

## Prompt 5:
Actúa como un ingeniero frontend senior experto en React 19 y TypeScript 7. Basado en nuestra auditoría del territorio, vamos a preparar la base de red y enrutado para la nueva vista detalle Kanban de posición sin generar componentes de UI todavía.

Por favor, realiza de forma autónoma las siguientes tareas mecánicas:
1. Crea el archivo `src/services/apiClient.ts` con una URL base centralizada (`http://localhost:3010`) que use `fetch` nativo para consumir la API.
2. Crea el archivo `src/services/positionService.ts` consumiendo el `apiClient` e implementando tres funciones estrictamente tipadas:
   - `getInterviewFlow(positionId: string): Promise<PositionFlowDTO>` (consumirá /positions/:id/interviewFlow)
   - `getKanbanCandidates(positionId: string): Promise<KanbanCandidateDTO[]>` (consumirá /positions/:id/candidates)
   - `updateCandidateStage(candidateId: string, newStageId: string): Promise<any>` (consumirá /candidates/:id/stage mediante PUT)
3. En `src/App.js`, registra la nueva ruta para el detalle Kanban: `<Route path="/positions/:id" element={<PositionDetail />} />`. Crea un archivo temporal vacío o con un "Loading..." para `PositionDetail` en `src/components/kanban/PositionDetail.tsx`.
4. En `src/components/Positions.tsx`, localiza el botón "Ver proceso" de las tarjetas de posición y cablealo usando el hook `useNavigate` de `react-router-dom` para redirigir dinámicamente a `/positions/${position.id}`.

Asegúrate de definir interfaces estrictas para los DTOs en un archivo `src/types/kanban.types.ts` que refleje con total fidelidad el payload de nuestro backend.

## Prompt 6:
Vamos a implementar el contenido visual del Kanban bajo una estructura de componentes atómicos estrictos en la carpeta `src/components/kanban/`. Cada archivo debe respetar la regla de oro de tener menos de 150 líneas de código para mantener limpio el contexto.

Utilizaremos la API nativa de HTML5 Drag and Drop para evitar librerías externas obsoletas. Implementa los siguientes componentes:

1. `PositionHeader.tsx`: Mostrará el título de la posición y un botón semántico `<button>` con una flecha hacia la izquierda para regresar a `/positions` usando `useNavigate`.
2. `CandidateCard.tsx`: Un elemento `<article>` con propiedad `draggable`. Manejará el evento `onDragStart` inyectando el ID del candidato en el objeto `dataTransfer`. Mostrará el nombre completo y su puntuación media (si es null, pintará "Sin evaluar").
3. `KanbanColumn.tsx`: Un elemento `<section>` que actuará como contenedor de fase. Manejará `onDragOver` (haciendo preventDefault) y `onDrop` para capturar el ID del candidato arrastrado y gatillar la actualización.
4. `PositionDetail.tsx` (Componente Raíz): Orquestará el estado usando `useParams` para leer el `:id` de la URL. Hará los fetches en paralelo del flujo y los candidatos, mapeará las columnas dinámicamente según el `interviewFlow`, y manejará la lógica del drop para actualizar el estado local de forma optimista mientras dispara el servicio `updateCandidateStage`.

Para los estilos del tablero, utiliza clases de Flexbox/Grid nativas o integradas en el proyecto para que se apile en vertical ocupando el 100% en dispositivos móviles de forma limpia y accesible.

## Prompt 7:
Actúa como un desarrollador frontend senior. El Kanban ya funciona, pero al hacer clic en posiciones con IDs simulados (como el ID 3) la API nos devuelve un 404 porque no existen en el seed de la base de datos. 

Para cerrar el círculo del ejercicio y que las páginas usen datos reales:
1. Revisa el archivo `src/components/Positions.tsx` (el listado principal de posiciones).
2. Modifica el componente para que, en lugar de renderizar la constante estática `mockPositions`, realice una llamada `fetch` al endpoint correspondiente del backend (ej. GET /positions o el path configurado en el backend) utilizando nuestro `apiClient` para obtener las vacantes reales creadas en el seed (ID 1 y ID 2).
3. Maneja un estado de carga (`isLoading`) y asegúrate de que al hacer clic en "Ver proceso", navegue usando los IDs legítimos de la base de datos.

## Prompt 8:
Actúa como un desarrollador frontend senior. El compilador de TypeScript está arrojando un error legítimo 'TS18047' en `src/components/kanban/CandidateCard.tsx` porque la propiedad `score` (o `averageScore`) puede ser `null` para candidatos que aún no han sido evaluados (lo cual es correcto bajo nuestras reglas de DDD).

Por favor, realiza de forma autónoma las siguientes correcciones:
1. Abre el archivo `src/components/kanban/CandidateCard.tsx`.
2. Localiza las funciones auxiliares que calculan el color de la insignia (badge) y el formateo del texto de la nota (donde se ejecuta el `.toFixed(1)`).
3. Añade una validación o guarda de tipo (`Type Guard`) al inicio de esas funciones para verificar si el valor es nulo o indefinido:
   if (score === null || score === undefined) {
     // Retornar el estilo por defecto o el texto "Sin evaluar" antes de hacer comparaciones matemáticas.
   }
4. Guarda el archivo, asegúrate de que Webpack compile con éxito sin errores de TypeScript y confírmame que la interfaz ya cargó correctamente en http://localhost:3000.