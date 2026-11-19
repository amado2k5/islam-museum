---
id: invention/mahani-successive-quotient-ratios
lang: es
source_lang: en
translators: ['Claude (claude-fable-5-2), draft translation']
status: { review: published }
provenance: {generated_by: 'Claude Code subagent (spanish lane, records the document services could not return intact)', model: claude-fable-5-2, run: claude-es-2026-11-19, source: content/en/invention/mahani-successive-quotient-ratios.md}
---
## Resumen

Yvonne Dold-Samplonius describe a [[person/al-mahani|al-Mahani]] definiendo la razón mediante el comportamiento mutuo de las magnitudes en un proceso de máxima medida común: dos razones son proporcionales cuando sus secuencias de cocientes sucesivos coinciden. Esta fue una contribución explícita a la teoría de la razón, no la invención de la división ni del algoritmo euclidiano. Su relación conserva precedentes mucho más antiguos {cite:dold-samplonius-mahani-dsb ratio}.

El tema pertenece a su [[work/mahani-risala-fi-nisba|Tratado sobre la razón]] y a la tradición en torno al quinto libro de Euclides, no a su [[invention/mahani-sphere-division-cubic|cúbica de la división de la esfera]], registrada aparte. Dold-Samplonius dice que él no estableció la conexión con la definición de Euclides; ella asigna ese logro posterior a Ibn al-Haytham. Nuestros ejemplos modernos no suplen en silencio una demostración histórica ausente {cite:tdv-mahani-fazlioglu work1-and-ratio} {cite:dold-samplonius-mahani-dsb ratio}.

## Qué es

Una razón no es una sola longitud aislada. Dos longitudes mayores pueden tener la misma relación que dos menores aunque sus medidas comunes difieran. Aquí preguntamos repetidamente cuántas veces cabe la menor en la mayor, y luego comparamos la menor con el resto. La relación histórica presenta esto como una manera de describir la relación, no como un rechazo de la corrección de fondo de Euclides {cite:dold-samplonius-mahani-dsb ratio}.

La enseñanza moderna puede expresar los cocientes resultantes como una fracción continua simple. Ese nombre impreso y esa notación no son letras copiadas del manuscrito de al-Mahani. MathWorld advierte también que los autores usan distintas convenciones de corchetes. Debemos especificar nuestra convención antes de preguntar si dos secuencias escritas coinciden {cite:weisstein-simple-continued-fraction definition-and-notation}.

## El mundo antes de ello

Dold-Samplonius identifica una concepción preeudoxiana, la definición de Euclides por equimúltiplos y el proceso de comparación heredado. Un titular que dijera que al-Mahani inventó los máximos comunes divisores o toda idea de fracción continua borraría ese trasfondo. Su lugar aquí es el de una particular exposición explícita de la proporcionalidad, no la creación de cada herramienta aritmética usada en nuestra explicación {cite:dold-samplonius-mahani-dsb ratio}.

En su relación, la presentación sintética del Libro V no revelaba cómo había surgido la teoría de la razón. Los matemáticos aceptaban su corrección mientras buscaban una explicación del comportamiento mutuo de las magnitudes. La insatisfacción con la presentación de una explicación es distinta de descubrir un error aritmético. Tampoco significa que los autores medievales compartieran toda nuestra terminología moderna {cite:dold-samplonius-mahani-dsb Euclid-V}.

## La historia

La TDV enumera el tratado sobre la razón, los testimonios y dos formas adicionales del título. Dold-Samplonius pone en duda que tres tratados sobre la razón de los que se informa fueran distintos. Representamos la obra nombrada sin fabricar tres libros para aumentar el recuento, ni fundir como idénticas las descripciones de manuscritos sin compararlas {cite:tdv-mahani-fazlioglu work1} {cite:dold-samplonius-mahani-dsb works}.

La biografía de al-Nayrizi en MacTutor dice que este adoptó conceptos propuestos por al-Mahani, quien probablemente trabajó en Bagdad antes de su llegada. Eso refiere una recepción intelectual, no una sesión de enseñanza personal documentada. El siglo IX es un horizonte de vida, no un autógrafo fechado con seguridad: una observación astronómica no se convierte en la fecha de la formulación de la razón {cite:nayrizi-mactutor ratio} {cite:tdv-mahani-fazlioglu biography}.

## El autor o los autores

MacTutor documenta individualmente a al-Mahani como un matemático islámico. El marco suní por defecto del museo se declara aparte, no se infiere de su ciudad ni de su aritmética. Sus fechas biográficas aproximadas siguen siendo aproximadas; una explicación matemática no requiere inventar una fecha exacta de nacimiento o de muerte {cite:mahani-mactutor summary-and-dates}.

Dold-Samplonius señala una referencia a Thabit ibn Qurra y un desarrollo similar posterior por al-Nayrizi. Thabit sigue formando parte de la historia aunque este navegador aplique una regla más estrecha de inclusión de autores. Tampoco se reasigna a los tres predecesores el posterior resultado de equivalencia de Ibn al-Haytham. La relación contiene etapas distintas, no un inventor responsable de cada paso {cite:dold-samplonius-mahani-dsb ratio}.

## Cómo funciona

He aquí un ejemplo moderno independiente que usa cantidades positivas conmensurables. En la misma unidad, tomemos 17 y 7. Entonces 17=2×7+3;7=2×3+1;3=3×1+0. Los cocientes ordenados son 2,2,3, y el último resto no nulo es 1. MathWorld explica la iteración de cociente y resto y la preservación de los divisores comunes; estos números concretos no se atribuyen a al-Mahani {cite:weisstein-euclidean-algorithm eqs1-3}.

Dupliquemos ambas longitudes a 34 y 14. Los restos pasan a ser 6,2,0, mientras que los cocientes siguen siendo 2,2,3. La medida común cambia de 1 a 2, pero 34/14=17/7. La igualdad de razones no puede, por tanto, significar meramente la igualdad de los máximos comunes divisores. Tampoco basta con tener tres pasos: son los valores ordenados de los cocientes lo que nuestro ejemplo compara.

Usando la notación moderna, escribamos [2;2,3], que significa 2+1/(2+1/3)=17/7. Las entradas que siguen al punto y coma no son dígitos decimales ni longitudes separadas. Describen operaciones anidadas. Si la primera cantidad positiva es menor, es posible un primer cociente de 0; invertir en silencio la razón cambiaría la comparación {cite:weisstein-simple-continued-fraction eqs1-3}.

Sin embargo, 5/2=[2;2] no es 17/7=[2;2,3], a pesar de un comienzo compartido. La multiplicación cruzada da 5×7=35 pero 2×17=34. Un prefijo finito coincidente no basta. Fijamos también la convención euclidiana de terminación en el resto 0: una expresión alternativa que termina en 1 tras dividir la última entrada no debe confundirse con el registro canónico de terminación del algoritmo.

Por ejemplo, [2;2,2,1] representa el mismo número porque su 2+1/1 anidado final es igual a 3. Es otra escritura, no otra razón medida. Especificamos por tanto el registro de terminación producido por la división, y no cualquier lista simbólica elegida. Invertir las longitudes da 7/17=[0;2,2,3], no 17/7. El primer cociente cambiado refleja una pregunta cambiada. Estos son detalles didácticos modernos para ejemplos positivos, no evidencia sobre la notación del tratado original ni sobre la independencia de las formas de su título de las que se informa {cite:weisstein-simple-continued-fraction eqs1-3}.

## La difusión

La relación de MacTutor sobre al-Nayrizi aporta un vínculo de recepción específico, y no dos nombres similares en un catálogo. No prueba que cada frase o cada detalle de la teoría fuera transmitido. Dold-Samplonius describe un desarrollo similar posterior; ninguna de las dos descripciones establece un encuentro fechado entre maestro y discípulo {cite:nayrizi-mactutor ratio} {cite:dold-samplonius-mahani-dsb ratio}.

Las ubicaciones actuales de los manuscritos no proporcionan una ruta de circulación ya hecha. Los testimonios de la TDV son evidencia referida de la pervivencia textual, no un diario de viaje. Una biblioteca moderna puede conservar un texto sin decirnos dónde lo encontraron los lectores del siglo IX ni exactamente qué lector posterior usó esa copia {cite:tdv-mahani-fazlioglu work1}.

## Sobre qué se construyó

El proceso euclidiano es heredado. En el lenguaje moderno de los enteros, si A=qB+r, todo divisor común de A y B divide a r; a la inversa, todo divisor común de B y r divide a A. Esto explica el paso aritmético de nuestro ejemplo. No es una línea traducida del manuscrito de al-Mahani ni evidencia de que él descubriera primero esa propiedad {cite:weisstein-euclidean-algorithm eqs1-2}.

Escalar ambas longitudes a la vez preserva los cocientes del ejemplo racional mientras cambia los tamaños de los restos. Cambiar solo una unidad no preserva la razón: los metros y los centímetros necesitan una conversión coherente. Esta es una salvaguarda moderna para entender el ejemplo, no una afirmación sobre una regla o un instrumento de medida conservados que usara el autor.

## Qué se construyó sobre ello

Dold-Samplonius dice que al-Mahani y al-Nayrizi no establecieron la conexión entre su definición y la de Euclides; Ibn al-Haytham lo hizo más tarde. La facilidad de comprobar 17/7 frente a 34/14 no borra ese límite. Dos ejemplos con enteros no son una demostración que abarque toda magnitud de la que se ocupa la teoría de la razón {cite:dold-samplonius-mahani-dsb ratio}.

La notación de fracciones continuas ofrece una herramienta explicativa moderna, no un certificado de que al-Mahani anticipara cada teorema de convergencia o cada aplicación informática. Comparar procedimientos no demuestra un linaje directo. Este registro no aporta ninguna cadena de transmisión inventada desde su tratado hasta cada uso criptográfico de los máximos comunes divisores {cite:weisstein-simple-continued-fraction definition-and-notation}.

## Impacto en la vida cotidiana

Las fuentes describen una cuestión matemática y su recepción, no a mercaderes que atribuyeran sus balanzas a este tratado ni a escuelas que midieran las horas ahorradas por él. No inventamos una anécdota comercial para llenar la sección. La contribución respaldada concierne al lenguaje y a la explicación de las magnitudes proporcionales, con el límite de la demostración a la vista {cite:dold-samplonius-mahani-dsb ratio} {cite:nayrizi-mactutor ratio}.

Un lector de hoy puede aprender que agrandar los objetos no cambia toda relación entre ellos. Duplicar ambas longitudes preserva su razón pero cambia su longitud común de medida. Esa es una lección de nuestro ejemplo moderno, no una estimación económica histórica. Distinguir una relación de una medida absoluta impide que enunciados superficialmente similares sean tratados como equivalentes.

## Cómo cambió la historia

La formulación hace que una relación pueda rastrearse a través de operaciones repetidas, en lugar de afirmar meramente que una razón existe. Esto no deja sin valor la exposición sintética más antigua: la historiadora dice explícitamente que su corrección era aceptada. Una nueva pregunta explicativa puede importar sin requerir un relato de ruptura total con el pasado {cite:dold-samplonius-mahani-dsb ratio}.

Esta contribución difiere del intento inacabado de al-Mahani con la cúbica. Una concierne al significado y a la comparación de la proporción; el otro traduce una división prescrita del volumen de la esfera a una ecuación. Un autor compartido no funde los temas ni establece que uno causara directamente el otro. Cada registro tiene su propia obra y sus límites, no un título repetido para un total mayor {cite:tdv-mahani-fazlioglu work1-and-work5}.

## ¿Quién lo inventó?

**Marco suní, declarado explícitamente:** la identificación individual de al-Mahani como musulmán y el marco suní del museo son independientes de la prioridad matemática. **Relación académica:** Dold-Samplonius conserva orígenes más antiguos, describe su formulación explícita, un desarrollo posterior por al-Nayrizi y una demostración subsiguiente por Ibn al-Haytham. No adjudicamos la historia entera a una sola persona {cite:mahani-mactutor summary} {cite:dold-samplonius-mahani-dsb ratio}.

“Mejora” identifica aquí un desarrollo respaldado, no al primer ser humano que dividió longitudes. Preserva las ideas heredadas y el hecho de que los textos originales no fueron inspeccionados en esta sesión. La erudición de la historiadora es nuestra evidencia citada, no un sustituto no anunciado de la pretensión de haber cotejado nosotros mismos cada testimonio conservado {cite:dold-samplonius-mahani-dsb bibliography}.

## Hoy

Los restos enteros positivos decrecen hasta la terminación, mientras que una comparación de magnitudes irracionales no tiene por qué terminar de ese modo. Cantidades distintas pueden compartir los primeros pasos. Por tanto, no ofrecemos un procedimiento que lea cinco cocientes y declare iguales dos magnitudes cualesquiera: el alcance de nuestra ilustración numérica conmensurable debe seguir siendo explícito {cite:weisstein-euclidean-algorithm termination}.

La imagen pertenece a un ejemplo moderno de 1071 y 462, no a números leídos en el tratado. Un rectángulo negro contiene dos grandes bloques naranjas, tres bloques superiores violetas y regiones verdes y rojas más pequeñas. No hay rótulos numéricos visibles. Nuestra descripción no inventa ni rótulos ni un diagrama original dibujado por al-Mahani {cite:commons-euclid-tiling-proteins current-image}.

## Ejemplos conservados

Leímos la biografía reproducida de Dold-Samplonius, la lista de obras de la TDV, la biografía de al-Nayrizi en MacTutor y definiciones y fórmulas modernas seleccionadas de MathWorld. No inspeccionamos manuscritos sobre la razón ni los estudios de Plooij y Becker nombrados en la bibliografía. La TDV informa de testimonios y formas del título; ese informe no zanja la independencia textual mediante conjeturas {cite:tdv-mahani-fazlioglu work1} {cite:dold-samplonius-mahani-dsb bibliography}.

La imagen es de Proteins, fechada el 17 de abril de 2009 y con licencia CC BY-SA 3.0. Su imagen estática y sus derechos fueron inspeccionados, incluida una copia de inspección con fondo blanco guardada fuera de git. El recurso publicado sigue siendo el SVG original sin modificar, no esa copia de inspección ni una animación de la serie. Una serie moderna no es un testimonio manuscrito antiguo {cite:commons-euclid-tiling-proteins description-rights}.

## En la cultura

Esta historia distingue entre preguntar qué significa una relación y pedir solo el resultado de una división. Un comentarista se convierte en investigador al examinar una definición y sus razones, no meramente al cambiar un símbolo impreso. Esa es una interpretación de la obra descrita, no una cita inventada atribuida a al-Mahani {cite:dold-samplonius-mahani-dsb ratio}.

La historia no necesita ninguna escena imaginaria de competición en Bagdad. Basta un tratado del que se informa, con límites para nuestro conocimiento. Los lectores deberían reconocer la diferencia entre el siglo del autor y una imagen fechada en 2009. Yuxtaponer esos tiempos es un recurso didáctico declarado abiertamente, no un intento de envejecer una ilustración moderna.

## Para los lectores jóvenes

Escribe 17 y 7 en un papel, anotando el cociente y el resto en cada paso. Repite con 34 y 14. Busca qué cambia y qué permanece igual, no solo cuántas líneas escribiste. No necesitas un instrumento antiguo para probar la aritmética, y no deberías llamar a estos los ejemplos del propio al-Mahani.

Luego compara 5/2 y 17/7: sus comienzos se parecen, pero las razones difieren. No te detengas en la primera semejanza. Pregunta qué afirma el titular: ¿la invención de toda división, o una manera particular de entender las razones? Nuestro ejemplo ayuda a formular la pregunta sin resolver toda la teoría de las magnitudes {cite:weisstein-euclidean-algorithm eq3} {cite:dold-samplonius-mahani-dsb ratio}.

## Referencias

- Dold-Samplonius: teoría de la razón y límite de la demostración {cite:dold-samplonius-mahani-dsb ratio}.
- TDV: obra nombrada y testimonios {cite:tdv-mahani-fazlioglu work1}.
- MacTutor: recepción de al-Nayrizi {cite:nayrizi-mactutor ratio}.
- MathWorld: aritmética y notación modernas {cite:weisstein-euclidean-algorithm eqs1-3} {cite:weisstein-simple-continued-fraction eqs1-3}.
- Commons: imagen estática moderna y derechos {cite:commons-euclid-tiling-proteins description-rights}.
