---
id: concept/istikmal-interpolation
lang: es
source_lang: en
translators: ['Google Translate (document translation on translate.google.com, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Google Translate document pilot, managed by Claude Code)', model: google-translate, run: gt-docs-es-2026-11-19, source: content/en/concept/istikmal-interpolation.md}
---
## Resumen
La interpolación (istikmal) es un método para hallar el valor de una función entre dos valores dados en una tabla; [[person/al-biruni-muhammad-ibn-ahmad|al-Biruni]] ideó su forma en el Libro 3 de [[work/al-qanun-al-masudi|al-Qanun al-Mas'udi]] para mejorar el uso de las tablas de senos. {cite:qanun-masudi-jundi-v1 p. 40} {cite:qanun-masudi-jundi-v1 p. 41}

## El problema
El editor explica que el método común asumía que, dentro de un intervalo, el aumento del seno era proporcional al aumento del ángulo; de hecho, intervalos iguales de ángulo no dan lugar a diferencias iguales de seno, por lo que el método común es inexacto. {cite:qanun-masudi-jundi-v1 p. 41}

## La solución de Al-Biruni
Al-Biruni siguió dos caminos. Primero, redujo los intervalos: calculó tablas de senos para cada cuarto de grado en lugar de para cada grado completo, lamentando no haber podido hacerlo para cada minuto de no ser por la extensión de la obra; el editor describe sus tablas como correctas hasta la séptima u octava cifra decimal. {cite:qanun-masudi-jundi-v1 p. 41} Segundo, mejoró el método de uso: al observar que un cambio en el ángulo produce un cambio gradual en las diferencias de los senos, en lugar de en los senos mismos, estableció la razón entre la parte del intervalo y el intervalo igual a la razón entre la diferencia apropiada y la diferencia de las diferencias, lo que produce un valor más exacto. {cite:qanun-masudi-jundi-v1 p. 41}

## Su lugar
El editor considera que al-Biruni llegó así a las leyes de interpolación en la forma simple que posteriormente se atribuyeron a Newton y Gregory seiscientos años después, y que su método para medir las diferencias de ángulos fue la piedra angular del método generador que ellos utilizaron. {cite:qanun-masudi-jundi-v1 p. 32} {cite:qanun-masudi-jundi-v1 p. 40} Añade que al-Biruni fue el primero en tomar la unidad como radio en las tablas de senos, de modo que las longitudes tabuladas se convirtieron en razones. {cite:qanun-masudi-jundi-v1 p. 42}
