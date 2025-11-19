# CONTRIBUCIONES

Guía para contribuir al proyecto

## COMMITS

- Cada mensaje debe ser claro y descriptivo.
- Use conventional commits (estándar para commits)
  - feat: Agregar nueva funcionalidad
  - fix: Arreglar bug
  - chore: Actualizar dependencias
  - refactor: Reestructuración del código

## BRANCHES

- La rama `main` solo contiene versiones estables para producción
- La rama `develop` es la rama de desarrollo, para nuevas funcionalidades y correcciones de errores.
- Cada rama debe nombrarse según la funcionalidad o error que aborda, ej: `feat/add-new-feature`, `fix/fix-bug`, `chore/update-dependencies`, etc.

## PULL REQUEST

- Crea PR's desde ramas específicas (feat/, fix/, chore/, refactor/) hacia su rama madre.
- Nunca hacer push directamente hacia `main` o `develop`
- La rama base debe estar actualizada antes de abrir el PR.
- Proporciona una descripción clara del PR, que incluya:
  - Qué funcionalidad está siendo implementada o corregida.
  - A qué archivos o módulos está vinculado.
  - Cómo probar los cambios (si aplica).

** Orden de las ramas: **
`main` <- `develop` <- `feat/add-new-feature` | `fix/fix-bug` | `chore/update-dependencies`
