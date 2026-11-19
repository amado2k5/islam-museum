---
id: invention/abu-wafa-fixed-opening-constructions
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/abu-wafa-fixed-opening-constructions.md}
---
## Resumen

¿Qué cambia en un problema geométrico cuando se permiten la recta y la brújula, pero está prohibido cambiar la apertura de la brújula entre pasos? En la colección atribuida a [[person/abu-al-wafa-al-buzjani|Abu al-Wafa al-Buzjani]], la restricción no es un rompecabezas aislado: conecta varias construcciones en un aparato organizado, como explica Woepcke {cite:abu-wafa-woepcke-constructions-1855 pp.224–227}. Presentamos la organización y el desarrollo de estos métodos, no la invención de la brújula ni de todas las construcciones antiguas, y distinguimos la evidencia textual de la hipótesis de la transmisión europea debatida en la investigación moderna {cite:raynaud-abu-wafa-latinus-2012 secs.2,11}.

## Qué es

Una brújula especifica un círculo por un centro y una distancia fija entre sus puntos. En este tipo de problema, esa distancia permanece inalterada durante la construcción, aunque el centro puede moverse y se pueden trazar diferentes arcos {cite:abu-wafa-woepcke-constructions-1855 pp.224–227,321}. La recta suministra una línea a través de dos puntos; no se utiliza secretamente como regla graduada para leer una nueva longitud. El reto no es prohibir el movimiento, sino lograr el resultado con menos libertad que cambiar el radio cuando sea conveniente.

On227 Woepcke distingue elegir una apertura de una longitud que ya está entre los datos del problema de la restricción más estricta de una apertura dada de forma independiente previamente {cite:abu-wafa-woepcke-constructions-1855 p.227}. Una etiqueta atractiva no debería borrar esa diferencia. La colección proporciona soluciones restringidas conectadas, pero una afirmación general de equivalencia en la discusión del editor no se convierte automáticamente en el teorema de Abu al-Wafa para cada construcción posible {cite:abu-wafa-woepcke-constructions-1855 pp.226–227}.

## El mundo que tenía delante

La construcción de línea y círculo tenía una historia anterior, y la biografía científica conserva precedentes griegos e indios para algunos materiales del libro de Abu al-Wafa. Esto no establece que todo método restringido aquí sea una copia idéntica de un texto anterior {cite:abu-wafa-youschkevitch-dsb geometry}. Un precedente puede ser un problema, una figura o una solución particular: son cosas distintas. La geometría anterior no tiene por qué desaparecer para que podamos apreciar de nuevo la recopilación, la organización y la resolución de problemas bajo una restricción de herramienta.

Por el contrario, no adoptamos la redacción del editor del siglo XIX como un juicio de prioridad universal {cite:abu-wafa-woepcke-constructions-1855 pp.218–219}. Él analiza los textos a su disposición; un conocimiento más amplio del manuscrito o testigos diferentes pueden modificar la afirmación. No todo uso repetido de un radio es una teoría completa de apertura fija, y esa teoría más estricta no es idéntica a todo procedimiento parcial exitoso.

## La historia

Abu al-Wafa pertenece al entorno académico de [[place/baghdad|Bagdad]], pero ubicar la ciudad no implica un taller o una lección para cada construcción {cite:britannica-abu-al-wafa biography}. Woepcke describe su base como una traducción persa de un texto árabe que aparentemente recoge las lecciones del erudito a través de un alumno, quizá también abreviada. Estas son capas de redacción y traducción, no un cuaderno de autógrafos sin mediacións {cite:abu-wafa-woepcke-constructions-1855 pp.218–219}. La historia incluye a quienes preservaron el conocimiento y los límites de lo que sabemos sobre ellos.

Raynaud discute una posible ventana de compilación de 993–1008 a partir de los títulos del mecenas, con una posible ventana autoral de 993–998 y una lectura alternativa póstuma {cite:raynaud-abu-wafa-latinus-2012 sec.1 note2}. Utilizamos el intervalo como una discusión de compilación, no la fecha de invención de cada construcción; no se proporciona un equivalente conveniente de un solo año o un equivalente hijri fabricado. El número de capítulos también depende de la versión: doce en el extracto persa, trece anunciados y once sobrevivientes en el relato de Raynaud {cite:abu-wafa-woepcke-constructions-1855 pp.319–321} {cite:raynaud-abu-wafa-latinus-2012 sec.1 note3}.

## El(los) creador(es)

Britannica llama explícitamente al propio Abu al-Wafa matemático y astrónomo musulmán: evidencia de identidad individual, no inferencia a partir de un nombre o de las creencias de un mecenas {cite:britannica-abu-al-wafa biography}. Suní es el marco declarado del museo, no un testimonio de su escuela jurídica personal. La contribución aquí es el repertorio de construcción restringida, distinto de sus [[invention/abu-wafa-spherical-triangle-methods|métodos de solución en triángulo esférico]]. No contamos dos veces el mismo cálculo de arco porque el autor sea el mismo.

**Marco declarado suní:** la atribución permanece dentro del testigo, con el marco general separado del testimonio escolar personal no disponible en la biografía {cite:britannica-abu-al-wafa biography}. **Relato académico:** Woepcke describe el alumno, la traducción y el resumen; Raynaud habla de testigos árabes y de diferentes copias. Ninguno de los dos convierte cada frase superviviente en dictado literal del erudito {cite:abu-wafa-woepcke-constructions-1855 pp.218–219} {cite:raynaud-abu-wafa-latinus-2012 sec.1}. Tanto el autor como los conservadores de la lección permanecen en la historia.

## Cómo funciona

En la primera construcción de la introducción, toma los extremos de un segmento como centros de dos círculos con la misma abertura y luego únese sus intersecciones. La línea resultante es perpendicular al segmento. El primer problema del capítulo 1 la reutiliza para bisectar un segmento o un arco adecuado {cite:abu-wafa-woepcke-constructions-1855 pp.321–322}. El segundo círculo no es un retraso del primero: su centro cambia mientras su radio permanece fijo. La nueva información proviene de figuras que se intersectan, no de medir un ángulo recto ya establecido con un transportador.

Explícalo usando coordenadas modernas, no los símbolos del autor: `A=(0,0)`, `B=(L,0)`, radio `r`. Las intersecciones satisfacen `x²+y²=r²` y `(x−L)²+y²=r²`; restando se obtiene `x=L/2`. Por tanto, su línea de unión pasa por el punto medio del segmento, y sus coordenadas verticales son `y=±√(r²−L²/4)`. Esto es una reescritura didáctica de la construcción traducida, no una afirmación de que el texto utilizó álgebra de coordenadas {cite:abu-wafa-woepcke-constructions-1855 pp.321–322}.

Dos intersecciones distintas requieren `0<L<2r`. Al doble del radio los círculos se tocan en un punto; más allá de él no se encuentran; a longitud cero coinciden y este paso determina que no hay perpendicular. En nuestro ejemplo moderno `L=2`, `r=2`, las intersecciones son`(1,√3)` y`(1,−√3)`, con punto medio`(1,0)`. El éxito no demuestra que una apertura elegida arbitrariamente pequeña funcione inmediatamente para cada segmento—de ahí la importancia de la restricción declarada de Woepcke {cite:abu-wafa-woepcke-constructions-1855 p.227}.

Page322 da una perpendicular en el extremo de un segmento sin extender el segmento más allá de ese extremo: elige un punto del segmento, dibuja dos círculos con un radio igual a su distancia desde el extremo, luego usa una intersección y una línea extendida apropiada {cite:abu-wafa-woepcke-constructions-1855 p.322}. Nuestro ejemplo moderno toma `A=(0,0)`, `C=(1,0)`, apertura1. Elige intersección `D=(1/2,√3/2)` y extienda`CD` más allá de `D` por la misma longitud `DC` hasta `E=2D−C=(0,√3)`. Entonces`AE` es perpendicular a la línea original; la misma distancia puede mantenerse a lo largo del paso sin medir una nueva longitud de regla.

Este segundo ejemplo elige su apertura de`AC`, por lo que no es una prueba del caso más estricto donde el radio es independiente de cada datum {cite:abu-wafa-woepcke-constructions-1855 p.227}. Una perpendicular o bisector tampoco establece una trisección exacta de ningún ángulo con estas herramientas. El libro incluye problemas más amplios y procedimientos diferentes; no debe extenderse una explicación correcta de una construcción a cada polígono o sección {cite:abu-wafa-mactutor geometry}.

La primera construcción también puede entenderse sin coordenadas. Cada intersección está igualmente distante de los extremos porque ambos círculos tienen el mismo radio. La simetría de los triángulos sobre el segmento común hace que la línea de unión de las intersecciones sea su eje, combinando perpendicularidad y bisección {cite:abu-wafa-woepcke-constructions-1855 pp.321–322}. Las coordenadas son una herramienta independiente de enseñanza/comprobación, no un requisito adicional impuesto al artesano ni a la demostración geométrica.

## La propagación

Woepcke pensó que la restricción inicial de algunos geómetras renacentistas podría indicar tradiciones orientales más antiguas. Planteó esto como una probabilidad, no como evidencia de una traducción específica, y no los redujo a simples copistas {cite:abu-wafa-woepcke-constructions-1855 pp.225–226}. No podemos convertir la inclinación de un editor en un itinerario manuscrito verificado entre ciudades no presenciadas. Un título similar de problema no establece por sí solo que su solución viajara con un ejemplar o un maestro en particular.

Raynaud presenta el argumento del redescubrimiento independiente y luego prueba soluciones, rotulación de diagramas e índices de probabilidad en obras concretas, incluyendo Tartaglia, Marolois y Schwenter {cite:raynaud-abu-wafa-latinus-2012 secs.2,11}. Su conclusión se refiere a un corpus acotado, no a toda la influencia árabe en las matemáticas europeas; tampoco inferimos que un manuscrito nunca existiera simplemente porque su traducción no se encontró aquí {cite:raynaud-abu-wafa-latinus-2012 sec.11}.

## Sobre qué se construyó

Antes de los problemas, la introducción traducida trata de comprobar la recta, la brújula y el cuadrado—la herramienta de ángulo recto {cite:abu-wafa-woepcke-constructions-1855 p.321}. Esto conecta la geometría de la figura con la comprobación de herramientas, no una promesa de que alguna herramienta defectuosa siga produciendo una figura correcta. Los problemas posteriores se refieren a construcciones anteriores; Woepcke identifica un repertorio organizado a partir de estas conexiones, no simplemente a partir de un círculo en una página {cite:abu-wafa-woepcke-constructions-1855 p.226}. La geometría anterior sigue siendo visible sin una cadena inventada de maestros personales.

## Lo que se construyó sobre ello

**Frontera de contribución suní:** establecemos una colección atribuida a un erudito musulmán, no a la descendencia automática de toda la geometría posterior {cite:britannica-abu-al-wafa biography} {cite:abu-wafa-woepcke-constructions-1855 pp.226–227}. **Relato académico:** La tímida transmisión oriental de Woepcke contrasta con el análisis de Raynaud que favorece la reconstrucción independiente en las obras analizadas. Ambos se atribuyen, sin un veredicto final del museo {cite:abu-wafa-woepcke-constructions-1855 pp.225–226} {cite:raynaud-abu-wafa-latinus-2012 sec.11}. Por tanto, nuestro diagrama genérico no convierte este en un ancestro directo de un programa de diseño moderno.

## Impacto en la vida diaria

El título del libro y la conexión artesanal establecen la geometría práctica como un entorno documentado, no como el uso del mismo procedimiento en cada taller o edificio {cite:raynaud-abu-wafa-latinus-2012 sec.1}. Raynaud cita la discusión sobre defectos durante la apertura/cierre y herramientas para planos más grandes. Leemos esto como una razón para preocuparnos por el control, no como una medición moderna del porcentaje de mejora o una garantía universal de ingeniería {cite:raynaud-abu-wafa-latinus-2012 sec.2.2}. Menos cambios en la apertura son un objetivo inteligible; la precisión real requeriría un experimento que no hemos realizado.

## Cómo cambió la historia

La colección muestra cómo una restricción puede organizar la investigación en lugar de limitarse a obstruirla: los problemas tempranos alimentan soluciones posteriores, permitiendo examinar la relación entre teoría y procedimiento de trabajo {cite:abu-wafa-woepcke-constructions-1855 pp.226–227,321–324}. También ilustra la dificultad del historial de transmisiones. Dos dibujos similares pueden reflejar una fuente común o recursos similares aplicados al mismo problema. Raynaud pide pruebas más allá de la semejanza visual, sin extrapolar sus resultados a cada lugar y periodo {cite:raynaud-abu-wafa-latinus-2012 sec.11}.

## ¿Quién lo inventó?

La contribución establecida es la organización/desarrollo de soluciones restringidas, no la invención de toda brújula, perpendicular o bisector. Algunos materiales tienen precedentes, y el texto tiene capas de transmisión {cite:abu-wafa-youschkevitch-dsb geometry} {cite:abu-wafa-woepcke-constructions-1855 pp.218–219,226–227}. **Suní—marco declarado:** La identidad musulmana documentada del académico es independiente de la prioridad para cada solución {cite:britannica-abu-al-wafa biography}. **Relato académico:** atribución de la lección, fecha de redacción y rutas posteriores tienen evidencias diferentes. Una interpretación de la transmisión no borra la existencia de la colección {cite:raynaud-abu-wafa-latinus-2012 secs.1,11}.

## Hoy

La fotografía muestra una brújula moderna de dibujo y accesorios, fotografiada por Radomil en 2005 bajo una licencia de igualdad. No es la herramienta de Abu al-Wafa ni la prueba de que su mecanismo impide cambios de apertura {cite:commons-compass-radomil history and licensing}. Ilustra los dos puntos y la distancia entre ellos. Compárese eso con la restricción del problema del papel distinguiendo un instrumento ajustable de la decisión de mantener su apertura durante una solución. No se necesita ninguna reivindicación arqueológica ni de reconstrucción.

## Ejemplos supervivientes

Se comprobó la imagen de la 321 impresa en la publicación de 1855 y se especificó que se leyeran pasajes de análisis/extracto; no se afirma ninguna compilación independiente en árabe, lectura completa del artículo ni inspección original de manuscritos persas {cite:abu-wafa-woepcke-constructions-1855 pp.218–219,321–324}. Raynaud enumera copias árabes y diferencias en los capítulos supervivientes; leemos esos informes en su artículo, no todos los manuscritos listados {cite:raynaud-abu-wafa-latinus-2012 sec.1 notes1–3}. Una imagen de publicación da testimonio de un texto publicado, no la antigüedad de la hoja en la que se registró por primera vez la lección.

## En la cultura

El libro conecta matemáticas y oficio sin que cada ornamento posterior sea la firma {cite:raynaud-abu-wafa-latinus-2012 secs.1,11} de su autor. Las diferencias de encabezados, capítulos y redacción muestran el conocimiento preservado también mediante copia, traducción y abreviación, no solo la biografía de un autor {cite:abu-wafa-woepcke-constructions-1855 pp.218–219,319–321}. El museo no afirma que todos los diseños islámicos utilizaran esta restricción, ni convierte el título de artesano en una ocupación personal para un fabricante no identificado.

## Para lectores jóvenes

Imagina mantener la brújula abierta mientras dibujas círculos desde dos centros: una intersección puede decirte algo que nunca dibujaste directamente. Eso es lo que ilustra el ejemplo de ángulo recto de la colección {cite:abu-wafa-woepcke-constructions-1855 p.321}. Pregúntate siempre si el radio permite una intersección y si un ejemplo prueba un problema o todos los problemas. Descubrir quién preservó y tradujo una solución es tan interesante como alcanzar la forma. No todos los dibujos similares fueron tomados prestados, y ningún dibujo antiguo es el comienzo de toda la ciencia.

## Referencias

- Woepcke1855, selecciones 218–220,224–227,319–324; 321 imágenes comprobadas. Francés basado en persa, lectura no completa del artículo {cite:abu-wafa-woepcke-constructions-1855 selected passages}.
- Raynaud2012, resumen,1/notas,2.1–2.2 y 11; no todos los apéndices leídos ni todas las pruebas reproducidas de forma independiente {cite:raynaud-abu-wafa-latinus-2012 secs.1,2,11}.
- Biografía individual, geometría contexto y fotografía licenciada {cite:britannica-abu-al-wafa biography} {cite:abu-wafa-youschkevitch-dsb geometry} {cite:abu-wafa-mactutor geometry} {cite:commons-compass-radomil licensing}.
