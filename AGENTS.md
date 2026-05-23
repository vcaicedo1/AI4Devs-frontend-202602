# AGENTS.md - Reglas para la Interfaz Kanban (LTI Frontend)

## Stack Tecnológico y Estilos
- React (Create React App) + TypeScript 7 (Tipado estricto obligatorio, sin 'any').
- Tailwind CSS para diseño adaptable e interactivo.
- Para el Drag and Drop, utiliza la API nativa de HTML5 (`onDragStart`, `onDragOver`, `onDrop`) para mantener el código ligero, nativo y libre de dependencias externas pesadas u obsoletas.

## Métricas de Calidad Senior (2026)
- Modularidad Atómica: Ningún componente visual debe superar las 150 líneas de código. Si crece más, debe fracturarse inmediatamente. Divide la vista en: `PositionHeader`, `KanbanBoard`, `KanbanColumn` y `CandidateCard`.
- Accesibilidad Nativa (WCAG 2.2 AA): Usa HTML semántico estricto. Las columnas deben ser elementos `<section>`, las tarjetas de candidatos `<article>`, y las acciones `<button>`. Queda prohibido inventar atributos ARIA si existe un elemento nativo equivalente.
- Responsividad Móvil: El Kanban en pantallas móviles debe apilar las columnas en vertical ocupando el 100% del ancho del viewport de forma fluida.