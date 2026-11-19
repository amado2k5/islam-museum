---
id: invention/ibn-yunus-solar-time-tables
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/ibn-yunus-solar-time-tables.md}
---

## Resumen

La altitud solar por sí sola no puede decirnos cuánta luz del día ha pasado: la respuesta cambia según la ubicación y la estación. [[person/ali-ibn-yunus-al-munajjim|Ibn Yunus al-Sadafi]] contribuyó a un corpus de tablas esféricas en El Cairo que derivan el tiempo y el azimut de la altitud solar y la posición anual. David King describe esto como una contribución importante, advirtiendo que la colección superviviente incluye adiciones posteriores que no todas pueden atribuirse a Ibn Yunus {cite:ibn-yunus-king-bea timekeeping corpus}.

Registramos una herramienta computacional, no la invención del tiempo, el primer reloj de sol ni un reloj de péndulo. Tampoco se cuentan como tres inventos los tres conjuntos principales de tablas: forman un programa conectado para problemas astronómicos relacionados. En la historia deben haber capas de autoría, no por debajo de una afirmación engañosa de que todas las tablas eran suyas.

## Qué es

La herramienta tiene dos argumentos: altitud solar y longitud solar, que arrojan cantidades como el tiempo desde el amanecer, tiempo restante hasta el mediodía o azimut. La longitud solar es una posición en la eclíptica, no la longitud geográfica del usuario. King describe tres conjuntos principales, cada uno superando las 10.000 entradas en el corpus superviviente; estas no son 10.000 observaciones documentadas individualmente por Ibn Yunus {cite:ibn-yunus-king-bea main tables}.

"Esférico" significa que el cálculo se refiere a la geometría del cielo vista desde una ubicación terrestre. El triángulo plano que lo acompaña no puede representar todas las variables. Tabular resultados modifica el trabajo computacional del usuario, pero no elimina la necesidad de identificar argumentos, unidades y convenciones.

## El mundo que tenía delante

La computación temporal, los relojes de sol y las observaciones precedieron a Ibn Yunus. King relaciona su obra con Mumtahan Zij de Yahya ibn Abi Mansur, preparado en Bagdad casi dos siglos antes. TDV describe su estudio de Habash, al-Battani, al-Nayrizi y otros. Estos forman una red de predecesores, no un único origen famoso {cite:ibn-yunus-king-bea Mumtahan discussion} {cite:tdv-ibn-yunus-dizer predecessors}.

Las listas observacionales y el cálculo planetario no son automáticamente lo mismo que las tablas de medición del tiempo. La distinción aquí es preparar una herramienta de dos argumentos para un problema de tiempo solar en un entorno de El Cairo, no simplemente escribir números o notar el movimiento aparente del Sol. No añadimos dependencia específica de un registro anterior de tabla de sombras simplemente porque ambos se refieren a la luz solar.

## La historia

King y Dizer consideran desconocida la fecha de nacimiento, a pesar de que el encabezado de MacTutor muestra 950. Vivió en Fustat, fue testigo de la conquista fatimí y de la fundación de El Cairo siendo joven en 969, y recibió apoyo de al-Aziz y más tarde de al-Hakim. Las observaciones registradas continuaron hasta 1003; murió en 1009 {cite:ibn-yunus-king-bea biography} {cite:tdv-ibn-yunus-dizer biography} {cite:ibn-yunus-mactutor biography}.

El punto final abierto de la vida del registro data únicamente su contribución individual, no el conjunto del corpus superviviente con adiciones de los siglos XIII y XIV. El registro de defunción anterior del creador permanece sin cambios. Ni una copia posterior ni el año de una edición moderna se convierten en la fecha de composición de las tablas originales.

## El(los) creador(es)

O'Connor y Robertson identifican individualmente a Ibn Yunus como un matemático islámico. Esto proporciona una base musulmana registrada. Sunni es por separado el marco del museo, no se infiere de la familia, el nombre árabe ni la afiliación personal de los mecenas fatimís. El patrocinio político no certifica la secta {cite:ibn-yunus-mactutor summary} {cite:tdv-ibn-yunus-dizer biography} de un erudito individual.

Su papel es el de mejorador y contribuyente. TDV asigna algunas tablas posteriores a al-Maqsi, mientras que King señala explícitamente la dificultad de determinar cuántos calculó Ibn Yunus. No se puede integrar todos los copistas y colaboradores posteriores en él. Una sugerencia de que calculadoras profesionales asistieron tampoco produce una plantilla verificada del equipo {cite:tdv-ibn-yunus-dizer work1} {cite:ibn-yunus-king-bea timekeeping corpus} {cite:ibn-yunus-mactutor support discussion}.

## Cómo funciona

Nuestra explicación es moderna, no una afirmación de que el autor haya derivado esta ecuación simbólica. Sea phi latitud, delta declinación solar, h altitud solar y H distancia angular al meridiano. En nuestro modelo esférico, `sin(h)=sin(phi)sin(delta)+cos(phi)cos(delta)cos(H)`. La latitud geográfica, la declinación solar y la altura sobre el horizonte son cantidades diferentes.

Elige latitud de 30 grados, que coincida con un parámetro histórico de corpus reportado por King, y elige declinación cero para la enseñanza. En este caso equinoccial simplificado, `cos(H)=sin(h)/cos(30°)`. Asumimos un horizonte ideal y excluimos la refracción atmosférica y el tamaño del disco del Sol. Esto no es ni un procedimiento de observación ni un horario diario {cite:ibn-yunus-king-bea corpus parameters} utilizable.

En la rama matutina, la altitud de 30 grados da `cos(H)=1/sqrt(3)`, por lo que H es aproximadamente 54,736 grados. A 15 grados por hora solar igual, quedan unas 3,649 horas hasta el mediodía. Nuestra media jornada equinoccial es de seis horas, dejando unas 2,351 horas desde el amanecer. Estos son valores modernos comprobados de forma independiente, no celdas leídas de un manuscrito.

A una altitud de 45 grados, `cos(H)=sqrt(2/3)`: quedan unas 2.351 horas y han pasado 3.649 horas. Al mediodía H es cero y la altitud 60 grados, no 90. Esto muestra el papel de la latitud. La altitud no es simplemente las horas transcurridas, y el Sol no está sobre la cabeza para todos los observadores al mediodía.

La misma altitud puede ocurrir antes y después del mediodía, por lo que debe seleccionarse una rama. Una declinación solar cambiante cambia la duración de la luz diurna y los límites de altitud en el mismo lugar. La conversión a reloj civil introduce convenciones adicionales, incluyendo la zona horaria y la hora solar aparente frente a la media. Nuestro modelo no realiza esas conversiones en silencio.

MacTutor informa que la precisión de las tablas llevó a King a sugerir una interpolación no lineal. Esa es una inferencia de un estudioso, no una prueba de que hemos recuperado el algoritmo de Ibn Yunus. Ni el artículo original de King de 1973 ni la cuadrícula manuscrita fueron leídos aquí; elegir una regla de interpolación moderna no la establecería como suya {cite:ibn-yunus-mactutor solar-time-table discussion}.

## La propagación

King informa del uso del corpus de El Cairo hasta el siglo XIX y la inspiración para las tablas de Taiz de Abu al-Uqul y las tablas de Damasco de al-Khalili. Este es un relato de historiador especializado, no nuestro censo independiente de cada copia o usuario. La práctica continuada no significa que cada celda numérica permaneciera sin cambios {cite:ibn-yunus-king-bea corpus reception}.

Los manuscritos difieren en orden y selección. Un orden diferente no convierte cada copia en una composición nueva, y el parecido no asigna todas las partes al primer colaborador. Por tanto, el relato por expansión sigue siendo descriptivo en lugar de fabricar ciertas aristas causales para cada ciudad mencionada en la investigación.

## Sobre qué se construyó

El cálculo requiere cantidades esféricas, convenciones de tiempo y posición, tablas y parámetros. King informa de latitud de El Cairo 30 grados y oblicuidad de 23 grados 35 minutos para el corpus. Estos son parámetros históricos, no se recomendan coordenadas modernas para cada vecindario {cite:ibn-yunus-king-bea corpus parameters}.

La oblicuidad no es declinación solar cada día: ayuda a definir el rango anual de esa cantidad cambiante. Elegir delta cero no borra la oblicuidad histórica; selecciona un ejemplo escolar. Hacer explícitas las suposiciones importa más que mostrar muchos dígitos sin explicar.

## Lo que se construyó sobre ello

King describe tablas esféricas subsidiarias, algunas relacionadas con las cinco oraciones diarias. TDV explica que Ghayat al-intifa fue un título posterior para una compilación que incorporaba las tablas de Ibn Yunus y otras. Por tanto, el [[work/cairo-solar-time-corpus|corpus se registra como superpuesto]], sin un solo libro completamente en su mano {cite:ibn-yunus-king-bea subsidiary tables} {cite:tdv-ibn-yunus-dizer work1}.

El Hakimi Zij es más amplio, abarcando observaciones, planetas y calendarios. Las tablas lunares discutidas por separado por MacTutor, con más de 34.000 entradas y atribuciones inciertas, son otro tema. Su recuento no debe migrar a las tablas de tiempos. Aplicaciones diferentes tampoco justifican dividir un ejemplo en totales inflados de invenciones {cite:ibn-yunus-mactutor lunar-table discussion}.

## Impacto en la vida diaria

La investigación vincula la medición astronómica del tiempo con los requisitos cotidianos y religiosos. Explicar esto no es emitir horarios de oración ni una resolución legal. Presentamos un instrumento de cálculo y sus supuestos, no un sustituto de un horario aprobado. Las fuentes no proporcionan ni conteos de usuarios para cada conjunto ni ahorros cuantificados de tiempo {cite:ibn-yunus-king-bea timekeeping corpus} {cite:tdv-ibn-yunus-dizer timekeeping discussion}.

Su valor educativo es ver un problema pasar de la geometría celeste a dos entradas y una respuesta numérica. Muchos números aún necesitan interpretación: ¿se mide el tiempo desde el amanecer o hasta el mediodía, y en qué rama? Un encabezado de columna equivocado puede estropear el uso de una tabla correctamente calculada.

## Cómo cambió la historia

El corpus representa un esfuerzo por convertir problemas esféricos complejos en una ayuda computacional reutilizable. King describe aproximadamente cientos de páginas y grandes conjuntos numéricos calificando la atribución. La escala no es evidencia de un ordenador perdido ni de un método algebraico que la fuente nunca describió {cite:ibn-yunus-king-bea corpus scale and authorship}.

Este logro difiere de la afirmación de que Ibn Yunus inventó la medición del tiempo por péndulo. MacTutor rechaza la evidencia de su uso del péndulo y reporta la traza del mito por parte de King hasta un relato europeo posterior. La contribución a la tabla merece atención sin añadir un instrumento no acreditado {cite:ibn-yunus-mactutor pendulum discussion}.

## ¿Quién lo inventó?

"La contribución de Ibn Yunus al corpus de El Cairo" es más precisa que "todas las tablas de El Cairo fueron su invención." La asociación es fuerte en la lectura académica, pero la atribución de tablas individuales es incierta y se conocen añadidos posteriores. Afirmar esto no disminuye su contribución; impide asignar generaciones de trabajo a una sola persona {cite:ibn-yunus-king-bea timekeeping authorship} {cite:tdv-ibn-yunus-dizer work1}.

Tampoco reivindicamos prioridad global en cada cálculo temporal. Este registro identifica un problema concreto, un entorno computacional y una evidencia declarada, no el primer uso de la luz solar o del tiempo. "Herramienta" aquí significa organización numérica, no un mecanismo superviviente en una vitrina de exhibición.

## Hoy

Los programas modernos devolven el tiempo y el azimut rápidamente, pero esto no demuestra ni descendencia directa del corpus ni definiciones idénticas de tiempo. Un ejemplo moderno ayuda a los lectores a entender las entradas antes de mirar la salida. No calculamos la refracción, un horizonte real o una zona horaria ni ocultamos esas diferencias.

La imagen es el triángulo rectángulo plano moderno de TheOtherJesse, publicado en dominio público en 2007. Recuerda lados y ángulos, pero no representa un triángulo esférico completo, ni la página de la tabla de Ibn Yunus ni un observatorio equipado {cite:commons-trigonometry-triangle Description and licensing}.

## Ejemplos supervivientes

King señala importantes manuscritos de corpus de Dublín y El Cairo junto a numerosos testigos con diferentes selecciones y disposiciones. Estos son distintos de los fragmentos de Hakimi Zij en Leiden, Oxford y París. Nombrar los repositorios no significa que abriéramos sus manuscritos o comparáramos los valores de las filas {cite:ibn-yunus-king-bea corpus manuscripts and Hakimi fragments}.

Los manuscritos de cronología y el estudio original de 1973 no se leyeron aquí. Nuestras fuentes definidas son la biografía académica de King, la entrada de Dizer y MacTutor, cada una leída íntegramente. Afirmamos no haber tenido ninguna inspección directa que no se haya realizado y no fechamos cada capa de una copia tardía.

## En la cultura

Las fuentes relatan distracción, astrología y una predicción de su muerte. Estas siguen siendo historias atribuidas, no un diagnóstico de personalidad ni una validación de la astrología. El patrocinio tampoco juzga las creencias personales del erudito ni garantiza todos sus resultados {cite:ibn-yunus-king-bea biographical anecdotes} {cite:tdv-ibn-yunus-dizer biography}.

King y Dizer advierten contra la conocida imagen del "observatorio bien equipado": las descripciones de instrumentos y sitios de observación no la establecen. Contamos la historia del cálculo sin inventar un observatorio ni dibujar hardware desconocido simplemente porque las mediciones teóricamente requerían equipo {cite:ibn-yunus-king-bea observatory caution} {cite:tdv-ibn-yunus-dizer instruments}.

## Para lectores jóvenes

Imagina tarjetas que hacen dos preguntas diferentes: «¿Cuánto falta desde el amanecer?» y «¿Cuánto falta para el mediodía?» En nuestro ejemplo de jornada de 12 horas, las respuestas de la mañana suman seis horas. No restes una de 24 ni la compares directamente con el reloj de un teléfono: los significados y puntos de referencia varían.

Lee el título de cada columna antes de su número. Pregunta si el modelo es para un lugar y día elegidos o para cualquier lugar. Querer saber la hora nunca es permiso para mirar al Sol o poner a prueba la vista. El papel es suficiente. Las fuentes respaldan la historia; una caligrafía pulcra no convierte nuestros números escolares en evidencia antigua.

## Referencias

- {cite:ibn-yunus-king-bea complete biography and selected references}
- {cite:tdv-ibn-yunus-dizer main entry and bibliography}
- {cite:ibn-yunus-mactutor complete biography}
- {cite:commons-trigonometry-triangle Description and licensing}
