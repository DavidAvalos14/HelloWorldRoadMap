# HelloWorldRoadMap

Pagina estatica para llevar seguimiento del roadmap de estudio entre amigos:

- Tema a exponer
- Expositor asignado
- Fecha acordada
- Estado y nota breve

## Como usar (modo compartido)

1. Editar `sessions.json` para definir tema, expositor, fecha, estado y nota.
2. Subir cambios al repositorio (`git add`, `git commit`, `git push`).
3. Abrir GitHub Pages y recargar: todos veran los mismos datos.

La pagina carga `sessions.json` por `fetch`, por lo que no usa base de datos y el estado compartido depende del archivo versionado.

## Estructura de `sessions.json`

Cada elemento debe tener esta forma:

```json
{
	"topic": "Trees",
	"presenter": "Sergio",
	"date": "2026-04-24",
	"status": "Programado",
	"notes": "Repaso DFS/BFS"
}
```

Estados permitidos: `Pendiente`, `Programado`, `Completado`.

## Opciones de evolucion

1. Hoja de calculo como backend ligero:
   - Google Sheets + Apps Script para editar desde UI sin commits.
2. Backend minimo:
   - API simple (Node/Express o Supabase) para sincronizacion multiusuario en tiempo real.
