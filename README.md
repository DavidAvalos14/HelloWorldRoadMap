# HelloWorldRoadMap

Pagina estatica para llevar seguimiento del roadmap de estudio entre amigos:

- Tema a exponer
- Expositor asignado
- Fecha acordada
- Estado y nota breve

## Formulario vs JSON

En esta version no hay formulario para guardar cambios desde la pagina.

La pagina:

1. Lee datos de `sessions.json`.
2. Muestra esos datos en la tabla, resumen y timeline.
3. No persiste cambios desde UI.

Si quieres cambiar temas, fechas, expositores o estado, se hace editando `sessions.json` y subiendo commit.

## Como usar (modo compartido)

1. Editar `sessions.json` para definir tema, expositor, fecha, estado y nota.
2. Subir cambios al repositorio (`git add`, `git commit`, `git push`).
3. Abrir GitHub Pages y recargar: todos veran los mismos datos.

La pagina carga `sessions.json` por `fetch`, por lo que no usa base de datos y el estado compartido depende del archivo versionado.

## Guia rapida para editar sessions.json

1. Abre `sessions.json`.
2. Cada item del arreglo representa un tema.
3. Mantener siempre este formato de campos:
	- `topic`: texto del tema (obligatorio).
	- `presenter`: nombre del expositor o `Por asignar`.
	- `date`: fecha en formato `YYYY-MM-DD` o cadena vacia `""`.
	- `status`: solo `Pendiente`, `Programado` o `Completado`.
	- `notes`: nota breve (puede ir vacia).
4. Revisa comas y llaves para que siga siendo JSON valido.
5. Guarda, haz commit y push.
6. En la pagina, usa el boton `Recargar datos` o refresca el navegador.

## Estructura de `sessions.json`

Cada elemento debe tener esta forma:

```json
{
	"topic": "Trees",
	"presenter": "Samce",
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
