---
id: invention/mahani-sphere-division-cubic
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/mahani-sphere-division-cubic.md}
---
## Resumen

[[person/al-mahani|Al-Mahani]] intentó trasladar un problema arquimediano de la geometría sólida al álgebra: ¿dónde debería un plano cortar una esfera para que los dos volúmenes resultantes tengan una proporción prescrita? Llegó a una ecuación que involucraba un cubo, un cuadrado y un número, pero no la resolvió. MacTutor y Dold-Samplonius informan del relato de Khayyam y de la solución posterior de al-Khazin usando secciones cónicas {cite:mahani-mactutor cubic} {cite:dold-samplonius-mahani-dsb cubic}.

La contribución registrada es la formulación, no la solución que no pudo completar, la invención del corte de esferas o todas las ecuaciones cúbicas. Sigue siendo distinta de [[invention/khayyam-geometric-cubics|las soluciones geométricas sistemáticas de Khayyam]]. Cambiar el lenguaje de una pregunta puede alterar lo que investigadores posteriores pueden intentar, incluso cuando su proponente no puede terminar la solución {cite:mahani-mactutor historical-assessment} {cite:tdv-mahani-fazlioglu algebra}.

## Qué es

La proporción solicitada se refiere a volúmenes, no a alturas o superficies. Un plano cerca de un poste crea una pequeña tapa y un resto mayor; su posición debe coincidir con la proporción especificada. El problema heredado procede de Sobre la esfera y el cilindro, libro II, proposición4. El museo no atribuye la pregunta original a al-Mahani {cite:dold-samplonius-mahani-dsb cubic}.

TDV escribe la forma moderna x³+c=ax², mientras que Dold-Samplonius utiliza nombres de coeficientes diferentes. Letras diferentes no crean problemas históricos distintos. Elegimos nuestra propia notación docente a continuación, sin afirmar que el manuscrito contuviera estos signos impresos ni los números particulares de nuestros ejemplos {cite:tdv-mahani-fazlioglu algebra} {cite:dold-samplonius-mahani-dsb cubic}.

## El mundo que tenía delante

La esfera, el problema y su tratamiento geométrico anterior no fueron invenciones de al-Mahani. Lo que Khayyam destaca en el relato transmitido es un intento de abordar la cuestión de forma algebraica. La aparición de un cubo no establece la primera cúbica en ningún sitio, y la dificultad para completar este enfoque no significa que todos los métodos geométricos anteriores hayan fallado {cite:mahani-mactutor Archimedes-and-Khayyam}.

La obra conecta una cuestión arquimediana con el tratamiento algebraico en su nuevo contexto. TDV también describe los comentarios euclidianos de al-Mahani, la teoría de las ratios y las magnitudes irracionales. Su coexistencia no constituye una cadena causal plenamente documentada, ni evidencia de que cada página de un comentario de Euclides fuera un paso necesario hacia esta ecuación particular {cite:tdv-mahani-fazlioglu mathematics}.

## La historia

Se sabe poco sobre su vida. MacTutor da a luz alrededor del año 820; pruebas más firmemente fechadas se refieren a observaciones entre 853 y 866 reportadas por Ibn Yunus. TDV lo sitúa en Bagdad alrededor del 860. Una fecha de observación no es un día de invención documentado, y una ciudad en funcionamiento no establece una sala concreta en la que se formuló el problema de la esfera {cite:mahani-mactutor biography} {cite:tdv-mahani-fazlioglu biography}.

Las fuentes describen un [[work/mahani-sphere-cylinder-commentary|comentario de la Esfera y el Cilindro]] y fragmentos relacionados o testigos de comentario en Leiden. El informe más claro de la solución inconclusa proviene a través de Khayyam, tal como lo presentan los estudiosos modernos. Distinguimos el informe de un autor posterior, la descripción manuscrita de un erudito y una lectura original que no hemos realizado {cite:tdv-mahani-fazlioglu work5} {cite:dold-samplonius-mahani-dsb cubic}.

## El(los) creador(es)

MacTutor identifica explícitamente a Abu Abd Allah Muhammad ibn Isa al-Mahani como un matemático islámico; TDV lo sitúa entre los primeros matemáticos-astrónomos islámicos. Esto aporta evidencia individual, no una inferencia del nombre o lugar de nacimiento. El marco del museo suní declarado por separado no es un certificado denominacional personal proporcionado por las biografías consultadas {cite:mahani-mactutor summary} {cite:tdv-mahani-fazlioglu biography}.

La muerte permanece alrededor del 880, con TDV cuestionando explícitamente el emparejamiento 267/880. La incertidumbre no se vuelve a publicar como un día exacto. Tres roles permanecen distintos: Arquímedes proporcionó el problema heredado, al-Mahani su reducción algebraica y al-Khazin una solución cónica posterior. Al-Khazin no debe confundirse con al-Khazini del Equilibrio de la Sabiduría {cite:tdv-mahani-fazlioglu biography-and-algebra}.

## Cómo funciona

Esta es una explicación moderna de museo, no una reconstrucción de cada paso original. Sea R el radio de la esfera y h la altura de la tapa medida desde su polo hasta el plano de corte. El volumen de la tapa es V=πh²(3R−h)/3; toda la esfera tiene volumen 4πR³/3. El radio del círculo de corte satisface a²=h(2R−h). Estos son volúmenes tridimensionales, no áreas de superficie de disco o cúpula {cite:weisstein-spherical-cap eqs2-6}.

Establece t=h/R y sea q la cuota de la tapa en todo el volumen de la esfera. Al cancelar las unidades se obtiene q=t²(3−t)/4, de ahí t³+4q=3t². A partir de la geometría han aparecido un cubo, cuadrados y un número. El intervalo físico es 0≤t≤2: los extremos son una tapa vacía y una esfera entera, mientras que dos piezas positivas requieren 0<q<1. La normalización es nuestra, no una transcripción de al-Mahani {cite:weisstein-spherical-cap eq6}.

Nuestro ejemplo independiente t=1/2 da q=5/32. La proporción tope-resto es 5:27, no 5:32; este último compara el tope con el total. La sustitución da t³+4q=1/8+5/8=3/4, también 3t²=3/4. Estos números verifican la formulación, no la afirmación de que al-Mahani los haya usado o completado la solución histórica.

Para la mitad del volumen, q=1/2, la ecuación moderna pasa a ser t³−3t²+2=0, factorizado como(t−1)(t²−2t−2)=0. Sus raíces son 1,1+√3 y 1−√3. Solo1 se encuentra en el intervalo físico de capital. No todas las raíces algebraicas representan un corte posible, y elegir un ejemplo fácil de sección central no resuelve el problema original para cada cociente prescrito.

En el cheque moderno, la derivada de q respecto a t es 3t(2−t)/4, positiva entre 0 y 2. Por tanto, aumentar la altura de la tapa incrementa su cuota de volumen, con una altura interior para cada parte interior. Otras raíces polinómicas no multiplican los cortes físicos. Esto demuestra una propiedad de nuestro modelo moderno, no que al-Mahani haya usado cálculo diferencial ni que su razonamiento perdido haya sido recuperado {cite:weisstein-spherical-cap eq6}.

## La propagación

El informe de Khayyam muestra que el intento pasó a formar parte del desarrollo recordado del álgebra, y las fuentes describen la solución posterior de al-Khazin. Se trata de una secuencia de contribuciones, no de que todos los estudiosos nombrados se reunieran o pertenecieran a una misma cadena docente documentada personalmente. Los relatos leídos aquí no proporcionan un mapa geográfico de adopción {cite:mahani-mactutor cubic-history} fechado.

TDV enumera testigos de comentarios en varias bibliotecas. La ubicación actual de un manuscrito no es un sitio de invento ni una etapa de circulación medieval datada automáticamente. Los fragmentos y comentarios supervivientes no implican que se conozcan todas las etapas de su transmisión; una lista de catálogo no puede convertirse simplemente en una ruta histórica animada {cite:tdv-mahani-fazlioglu works}.

## Sobre qué se construyó

La condición dada es una relación entre dos piezas; la relación requerida conecta el volumen de la tapa con la posición del plano de corte. El modelo asume una esfera y plano ideales, no un fruto irregular ni un recipiente de espesor desconocido. El ejemplo moderno muestra por qué la reformulación requiere definir la cantidad, no simplemente escribir un cubo junto a algo redondo {cite:weisstein-spherical-cap definition-and-eq6}.

Para una proporción prescrita m:n, la cuota de capitalización es q=m/(m+n), no m/n. Encontrar la altura correspondiente devuelve el álgebra a la geometría. Esta es nuestra explicación de la condición de razón reportada, no una traducción literal de Arquímedes ni una afirmación de que su texto original fue examinado para este lote {cite:dold-samplonius-mahani-dsb prescribed-ratio}.

## Lo que se construyó sobre ello

Las fuentes afirman que al-Khazin resolvió la ecuación con cónicas y evalúan la importancia del intento para conectar álgebra con geometría. Resolver un caso particular anterior sigue siendo diferente de la organización posterior de Khayyam de múltiples formas cúbicas y de fórmulas radicales modernas. Estas etapas no se cuentan como nombres intercambiables para un registro {cite:mahani-mactutor cubic-history}.

La notación actual permite comparar volúmenes y seleccionar computacional la raíz adecuada. Esas herramientas no se atribuyen a al-Mahani simplemente porque una lección museística las utilice. La sustitución exitosa tampoco establece una ruta directa de transmisión desde su comentario a todos los programas informáticos modernos para ecuaciones cúbicas {cite:tdv-mahani-fazlioglu algebra} {cite:weisstein-spherical-cap eq6}.

## Impacto en la vida diaria

Las lecturas no proporcionan registro de taller sobre el corte de esferas basado en al-Mahani, los ahorros de material atribuidos al método, ni una industria creada por la ecuación. El impacto respaldado se refiere a la formulación matemática y a la historia. No llenamos ese vacío con un artesano ficticio, ni convertimos el modelo de geometría sólida en instrucciones para cortar objetos físicamente {cite:mahani-mactutor historical-assessment}.

No obstante, se puede aprender una distinción útil: las relaciones de longitud, área y volumen no son intercambiables. Duplicar tanto el radio como la altura de la tapa multiplica el volumen por ocho preservando al mismo tiempo q. Eso es consecuencia de la fórmula moderna, no una medición realizada con un instrumento antiguo ni un efecto económico {cite:weisstein-spherical-cap eq6} históricamente documentado.

## Cómo cambió la historia

Como lee MacTutor en Khayyam, la incapacidad de al-Mahani para terminar no hizo que la formulación careciera de valor. Expresar un problema en otro idioma puede exponer enfoques antes no evidentes. Eso no convierte toda ecuación sin resolver en una gran invención: este caso tiene una pregunta concreta reportada y una continuación posterior particular {cite:mahani-mactutor historical-assessment}.

El registro convierte el fracaso en parte de la historia en lugar de ser una nota a pie de página bajo un título triunfal. No dicemos que al-Mahani resolviera la división de esferas cuando las fuentes dicen que se detuvo en un cúbico. Distinguir el resultado alcanzado del resultado aún buscado protege esta historia de un crédito retrospectivo exagerado {cite:dold-samplonius-mahani-dsb cubic}.

## ¿Quién lo inventó?

**Suní — marco declarado:** la identidad islámica individual está documentada, separada de una afirmación de prioridad universal. **Relato académico:** las fuentes informan de la descripción que hizo Khayyam del intento de al-Mahani y de la solución posterior de al-Khazin. La atribución se refiere a una reducción algebraica particular, no a todas las cúbicas conocidas en cada civilización, ni a un veredicto de museo tras examinar todos los manuscritos {cite:mahani-mactutor summary-and-cubic} {cite:tdv-mahani-fazlioglu algebra}.

Las fuentes también mantienen distinta confianza sobre los testigos: TDV atribuye un comentario posterior a al-Quhi, mientras que Dold-Samplonius escribe «probablemente». Preservamos esa salvedad en lugar de fabricar certeza combinando relatos. No se omite un contribuyente no musulmán a la historia matemática heredada porque el criterio de creador de este navegador sea más estrecho {cite:tdv-mahani-fazlioglu work5} {cite:dold-samplonius-mahani-dsb cubic}.

## Hoy

Comparar t con 2−t se obtienen tapas complementarias cuyas partes volúmicas suma 1. Para t=3/2, q=27/32 y la relación tape-resto es de 27:5. Este ejemplo moderno, verificado de forma independiente, invierte el punto de vista en el mismo plano de corte; no es el descubrimiento de un segundo ejemplo histórico utilizado por al-Mahani.

En la ilustración, r es el radio de la esfera, la altura de la tapa h y el radio de un círculo de corte; nuestra explicación usa R para el radio de la esfera. La a de la imagen no es el coeficiente que lleva esa letra en la cúbica general de TDV. Una gorra violeta y una esfera azul son ilustraciones modernas, no evidencia sobre el aparato físico del autor {cite:commons-spherical-cap-pbroks current-image}.

## Ejemplos supervivientes

Las lecturas reales son la biografía completa de MacTutor, la lista de cuerpo y obra de la TDV de İhsan Fazlıoğlu, y la biografía reproducida de Dold-Samplonius con bibliografía en un PDF de una sola página. Ningún fragmento de Leiden, estudio original completo de al-Mahani o el estudio listado de Rashed fue inspeccionado únicamente porque apareció en referencias {cite:mahani-mactutor bibliography} {cite:tdv-mahani-fazlioglu work5} {cite:dold-samplonius-mahani-dsb bibliography}.

Las otras entradas de TDV incluyen revisiones perdidas y avisos de catálogo; no todos los títulos representan un libro completo que se conserva. La ilustración de Pbroks13 de 2008 fue puesta en dominio público, y sus derechos e imagen actual fueron inspeccionados. Se utiliza el original sin cambios; no es una página del comentario {cite:tdv-mahani-fazlioglu works} {cite:commons-spherical-cap-pbroks rights} de al-Mahani.

## En la cultura

Una historia del conocimiento puede mostrar una pregunta abriendo un camino sin crear un héroe que haya respondido todo. El informe ayuda a distinguir el lenguaje de un problema del lenguaje de su solución. No se necesita ningún máxima inventado ni una escena dramática no documentada de Bagdad para que la distinción resulte interesante {cite:mahani-mactutor historical-assessment}.

"Cúbico" aquí describe una potencia en una ecuación, no la forma de la pieza recortada de una esfera. "División" significa especificar un plano y dos volúmenes, no solo una división numérica en papel. Explicar estos términos ayuda al lector a interpretar la imagen sin convertir la terminología moderna en una supuesta cita del autor.

## Para lectores jóvenes

Dibuja un círculo que represente una sección transversal de una esfera y una línea cerca de su parte superior. La pequeña zona en el papel sugiere una tapa tridimensional, pero no es en sí misma el volumen de esa tapa. No se necesita una bola real ni una herramienta de corte afilada. Puedes dibujar diferentes posiciones de planos y preguntar cómo cambia el volumen en lugar de medir solo el área de color.

Elegir h=R/2 en nuestro ejemplo da 5/32 del volumen completo, no la mitad. Al-Mahani no eligió necesariamente estos números; los elegimos para enseñar la pregunta. La formulación era un paso, la solución otro. Al leer el título de una invención, pregúntese qué logró su creador y qué quedó para investigadores posteriores {cite:weisstein-spherical-cap eq6} {cite:mahani-mactutor cubic}.

## Referencias

- MacTutor: biografía y relato reportado de Khayyam {cite:mahani-mactutor biography-and-cubic}.
- Fazlıoğlu, TDV: ecuación y obras {cite:tdv-mahani-fazlioglu body}.
- Dold-Samplonius: biografía, testigos y matizaciones {cite:dold-samplonius-mahani-dsb body}.
- MathWorld: fórmulas modernas, no historia de la invención {cite:weisstein-spherical-cap eqs2-6}.
- Bienes comunes: ilustración moderna y derechos {cite:commons-spherical-cap-pbroks rights}.
