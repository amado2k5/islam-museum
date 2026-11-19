---
id: invention/al-kashi-pi-calculation
lang: es
source_lang: en
translators: ['Claude (claude-fable-5-2), draft translation']
status: { review: published }
provenance: {generated_by: 'Claude Code subagent (spanish lane, records the document services could not return intact)', model: claude-fable-5-2, run: claude-es-2026-11-19, source: content/en/invention/al-kashi-pi-calculation.md}
---

## Resumen

Un dibujo pequeño no puede establecer dieciséis cifras decimales. El logro de [[person/al-kashi|Ghiyath al-Din al-Kashi]] en el [[work/risala-muhitiyya-kashi|Treatise on the Circumference]] fue un cálculo cuidadoso, no medir un círculo con un compás más grande. MacTutor fecha la obra en 1424 y describe la expresión del doble de la razón entre circunferencia y diámetro en formas sexagesimal y decimal con gran precisión. Esto mejoró un cálculo heredado; no descubrió pi {cite:kashi-mactutor Circumference treatise}.

Nuestro registro concierne a un método numérico dentro de la geometría y la astronomía. Los círculos y polígonos anteriores no desaparecen tras el nombre del autor, ni su resultado establece la invención de las fracciones decimales. Explicamos las cotas mediante un pequeño ejemplo moderno, separándolo del resultado históricamente referido. No hemos leído el manuscrito original ni transcrito su cálculo línea por línea {cite:kashi-mactutor decimal predecessors} {cite:iranica-kashi polygon computation}.

## Qué es

Pi es la circunferencia dividida por el diámetro en la geometría plana ordinaria. El doble de pi es la circunferencia de un círculo de radio unidad: confundirlos duplica incorrectamente la respuesta. Okten refiere el valor decimal de al-Kashi 6.2831853071795865, una aproximación al doble de la razón, no a pi mismo, junto con una representación sexagesimal {cite:tdv-kashi-okten mathematics}.

Esta no es una expresión finita igual a una expansión infinita. Es una aproximación cuya precisión depende de controlar los errores en las raíces, la multiplicación y la división. Iranica describe polígonos dentro y alrededor de un círculo, mientras que MacTutor destaca el resultado en dos sistemas de numeración. La geometría de las figuras y la destreza de cálculo se encuentran aquí; mostrar un número largo sin explicar su significado es insuficiente {cite:iranica-kashi polygon computation} {cite:kashi-mactutor Circumference treatise}.

## El mundo anterior

Los problemas del círculo y las aproximaciones precedieron a al-Kashi. Iranica conecta su tratado con la mejora de las aproximaciones usadas en astronomía y reconoce tradiciones más antiguas. La geometría no empezó de nuevo en 1424, ni el mero dibujar un polígono dentro de un círculo es su invención personal. La contribución acotada es el trabajo de cálculo y la precisión alcanzada {cite:iranica-kashi As Mathematician and Astronomer}.

MacTutor también sitúa los decimales y la extracción de raíces dentro de trabajos anteriores, incluidos la escuela de al-Karaji y al-Samawal. “Usó las fracciones con destreza” no debe convertirse en “inventó todas las fracciones decimales”. Tampoco la comparación cronológica con resultados europeos posteriores prueba que sus autores lo leyeran. La aparición anterior y la transmisión textual documentada son afirmaciones diferentes {cite:kashi-mactutor decimals and root methods}.

## La historia

Las fuentes describen una carrera desde el entorno de Kashan hasta Samarcanda, pero los detalles biográficos tienen una certeza desigual. MacTutor estima el nacimiento hacia 1380; Iranica trata de alrededor de 1386, inferido suponiendo una edad en la observación de 1406. Ni los combinamos en una fecha de nacimiento inventada ni ocultamos el carácter de una estimación tras una fecha familiar {cite:kashi-mactutor biography} {cite:iranica-kashi Life}.

El entorno erudito de Ulugh Beg ofrecía apoyo a la astronomía y al cálculo. MacTutor fecha la Muhitiyya en julio de 1424 y el Key to Arithmetic en 1427: obras diferentes. Los estudios también difieren sobre las etapas de la construcción del observatorio. La fecha de un edificio no puede fechar cada libro ni la llegada de cada estudioso. Nuestro registro usa solo el año del tratado, sin un día conjeturado ni una conversión a la Hégira {cite:kashi-mactutor Samarkand and works} {cite:iranica-kashi Life}.

## El autor o los autores

MacTutor identifica individualmente a al-Kashi como matemático islámico. Esta es la base musulmana registrada, no su nombre ni su origen familiar. El marco suní es, aparte, el marco por defecto del museo en el medio timúrida documentado, no un certificado de escuela personal ni una inferencia a partir de la religión de Ulugh Beg. Las biografías académicas leídas aquí no dan ninguna atestación contraria de secta personal; el silencio no es una biografía detallada de credo {cite:kashi-mactutor summary} {cite:tdv-kashi-okten biography}.

Es un mejorador del cálculo. Qadi Zada, Ulugh Beg y otros estudiosos compartieron el entorno intelectual, pero eso no establece la coautoría de cada cálculo de la Muhitiyya. Las cartas a su padre clasifican las capacidades de los colegas; esas son sus valoraciones, no una tabla clasificatoria objetiva anunciada por el museo {cite:iranica-kashi letters and scientific environment}.

## Cómo funciona

Imagina un círculo de radio unidad. Un polígono regular con vértices en su circunferencia toma una ruta más corta; un polígono tangente que lo rodea toma una ruta más larga. Dividir por dos sus perímetros da cotas inferior y superior para pi. Esta explicación moderna ilustra la descripción que Iranica hace de las cotas poligonales; no reproduce los símbolos de al-Kashi ni el orden de su demostración {cite:iranica-kashi polygon computation}.

Llamemos n al número de lados y s a la longitud del lado inscrito. Nuestra cota inferior es `L=n*s/2`; la superior es `U=L/sqrt(1-s*s/4)`. Para un hexágono s=1, lo que da L=3 y U aproximadamente 3.464102. No necesitamos primero la larga expansión decimal de pi: los lados y los radios producen relaciones geométricas expresables mediante raíces cuadradas.

Bisecar el ángulo central duplica el número de lados. Nuestra recurrencia explicativa es `s_new=s/sqrt(2+sqrt(4-s*s))`. Doce lados dan una cota inferior de unos 3.105829 y una superior de unos 3.215390. El intervalo sigue siendo amplio, pero es más estrecho que el del hexágono. Estos son números modernos recién comprobados, no celdas leídas de la Muhitiyya.

Continuar hasta 96 lados da aproximadamente `3.141032 < pi < 3.142715`. Esto no puede establecer la larga precisión históricamente referida. Enseña a estrechar un intervalo en lugar de anunciar una respuesta exacta. Todo polígono finito sigue siendo un polígono; la imagen de dos hexágonos que acompaña no reproduce ni la secuencia completa del cálculo histórico ni su escala.

La expresión equivalente `sqrt(2-sqrt(4-s*s))` resta cantidades casi iguales cuando el lado se vuelve pequeño. Elegimos la primera forma para nuestro ejemplo moderno a fin de reducir la cancelación numérica. Esta es una explicación de cálculo contemporánea, no un lenguaje ni una arquitectura de ordenador atribuidos a un estudioso del siglo quince. Una demostración de máquina de precisión finita no certifica de forma independiente cada dígito histórico.

La notación sexagesimal y la decimal expresan cantidades fraccionarias usando valores posicionales diferentes. Okten imprime `6;16,59,28,1,34,51,46,15,50` y `6.2831853071795865`: después del separador sexagesimal, las posiciones tienen denominadores 60 y sus potencias. Convertir una cantidad redondeada entre bases o dividirla por dos no crea información ausente del cálculo original {cite:tdv-kashi-okten mathematics}.

Sin embargo, comprobar la secuencia impresa literal revela una discrepancia: se convierte en aproximadamente `6.2831853071795924`, no en el decimal que la acompaña. Señalamos el desajuste sin conjeturar una corrección de un dígito histórico. Sin leer el original, no podemos localizar el error en la transmisión, en la tipografía o en otro lugar. La gran precisión referida y la verificación de que estas dos líneas impresas concuerdan son asuntos diferentes {cite:tdv-kashi-okten mathematics}.

## La difusión

MacTutor describe que la obra de al-Kashi permaneció mucho tiempo desconocida en Europa y recibió más tarde un estudio histórico en los siglos diecinueve y veinte. Okten enumera el estudio y la traducción alemanes de Paul Luckey del Circumference, publicados en 1953. Esto documenta erudición y publicación, no una transferencia directa de cada técnica numérica a cada europeo comparado con él {cite:kashi-mactutor conclusion} {cite:tdv-kashi-okten work6}.

El Circumference también debe distinguirse del uso del Key como texto de enseñanza. Okten describe la recepción del manual más extenso y las traducciones de partes, no una circulación idéntica para este tratado más breve. No podemos tomar prestada cada señal de la popularidad del Key como prueba para cada página de la Muhitiyya ni trazar un mapa seguro a partir de solo un relato general de recepción {cite:tdv-kashi-okten work7}.

## Sobre qué se construyó

El método necesita relaciones del círculo y del triángulo, raíces y aritmética de posiciones fraccionarias. Las biografías destacan la combinación de geometría y cálculo de al-Kashi a la vez que distinguen el trabajo anterior sobre decimales y raíces. Esto no identifica un libro concreto del museo detrás de cada paso; el precursor sigue siendo una descripción general con fuente y no una arista causal inventada {cite:kashi-mactutor mathematical contributions}.

La astronomía ayuda a explicar la preocupación por la precisión, pero el tratado no es meramente una tabla de observaciones. Una figura ideal calculada difiere de un instrumento físico afectado por los materiales y el movimiento. Iranica describe la preocupación por la deformación de los instrumentos grandes: la exactitud geométrica, la numérica y la material están relacionadas sin ser idénticas {cite:iranica-kashi instruments and practical precision}.

## Qué se construyó sobre ello

Las obras de al-Kashi abordan varios problemas: el Khaqani Zij actualiza la astronomía anterior; el Key enseña aritmética; el Chord and Sine trata otro cálculo; los instrumentos realizan otras tareas. Estos no son títulos intercambiables para la Muhitiyya. La precisión del seno de un grado no pertenece a una tabla de la circunferencia, ni los numerosos títulos justifican automáticamente multiplicar una contribución en muchos registros {cite:tdv-kashi-okten works} {cite:kashi-mactutor sine treatise}.

Documentamos un logro acotado para el estudio y la comparación posteriores. No todo programa moderno que calcula pi se convierte en su descendiente. Compartir un objetivo matemático no prueba la herencia de un algoritmo concreto. Del mismo modo, un antiguo procedimiento geométrico no se convierte en una serie infinita o en un método moderno meramente porque produzca una cantidad que ahora conocemos con mayor precisión.

## Impacto en la vida cotidiana

MacTutor describe las aplicaciones previstas del Key en astronomía, agrimensura, arquitectura, contabilidad y comercio. Eso sitúa el cálculo en un entorno intelectual práctico, pero no mide los efectos de la Muhitiyya. No tenemos ningún registro que muestre cuántos edificios o transacciones cambiaron a causa de su decimosexta cifra decimal específicamente {cite:kashi-mactutor Key to Arithmetic}.

El efecto respaldado es una capacidad de cálculo mejorada y la expresión de un resultado preciso en dos sistemas. Más dígitos no significan que toda tarea cotidiana los necesite ni que todo instrumento contemporáneo mida el mundo con esa precisión. La enseñanza puede distinguir “calculable” de “medible” sin inventar ahorros ni recuentos de beneficiarios que las fuentes no aportan {cite:tdv-kashi-okten mathematics}.

## Cómo cambió la historia

Las biografías describen un notable logro de cálculo medieval; MacTutor compara su precisión con resultados anteriores y posteriores. Conservamos esto como un relato histórico, no como nuestro certificado independiente de que se ha buscado en toda civilización y en todo texto perdido. El logro no requiere suprimir los cálculos griegos, chinos o islámicos anteriores {cite:kashi-mactutor Circumference treatise}.

Registrar el resultado sexagesimal y el decimal muestra también el movimiento entre herramientas aritméticas dentro de una sola obra. MacTutor destaca el uso de fracciones decimales para cantidades como pi, no solo para aproximaciones de raíces algebraicas. Este es un desarrollo en la práctica numérica, distinto de inventar la coma decimal moderna, todo concepto de número real o una ruta directa hacia un europeo nombrado {cite:kashi-mactutor decimal contributions}.

## ¿Quién lo inventó?

Al-Kashi fue autor del cálculo asociado con este tratado, no del círculo ni de toda aproximación a su razón. La atribución es, por tanto, de mejora, no de origen absoluto. MacTutor matiza explícitamente las afirmaciones de prioridad sobre decimales y raíces considerando a los predecesores. No importamos afirmaciones más fuertes meramente para hacer más emocionante el titular {cite:kashi-mactutor priority qualifications}.

La unidad numérica es igualmente importante: `6.2831853071795865` aproxima el doble de pi. Las cifras decimales no son posiciones sexagesimales. Dividir por dos un resultado redondeado puede mostrar un dígito extra sin nueva exactitud. Aproximación, truncamiento y redondeo son operaciones diferentes; repetir “dieciséis cifras” o mostrar un diagrama vistoso no establece ninguna de ellas de forma independiente {cite:tdv-kashi-okten mathematics}.

## Hoy

El pequeño ejemplo enseña las cotas, el error acumulado y una expresión más estable. Estas son herramientas explicativas modernas, no una reconstrucción documentada a partir del primer manuscrito. Un algoritmo histórico exacto requiere leer un testimonio o una edición especificados e identificar su notación, no llenar vacíos con conocimientos de programación actuales.

La imagen de Urutseg de 2009 muestra dos círculos con un hexágono inscrito y otro circunscrito. Commons la identifica como geometría moderna simple en el dominio público, no como una pintura de Samarcanda. No contiene ni millones de lados ni los dígitos de al-Kashi. Separar la ilustración de la prueba permite a los lectores usar lo que la imagen realmente explica sin imaginar lo que no muestra {cite:commons-archimedes-pi-urutseg Description and history}.

## Ejemplos conservados

Okten nombra la edición y la traducción alemana de Luckey y describe varias otras obras conservadas en manuscritos. No hemos leído la Muhitiyya original ni la edición alemana y no presentamos el resultado como una transcripción de una página vista. Nuestras referencias son las obras realmente consultadas; el resultado numérico se refiere a través de ellas con los sistemas de numeración distinguidos {cite:tdv-kashi-okten works6–8}.

Las cartas a su padre ofrecen una ventana diferente a la vida científica. Iranica trata su valor, la autoalabanza y la competencia; no son ni un inventario imparcial de las capacidades de los colegas ni sustitutos de la lectura de la obra aritmética. La fecha de copia de un libro diferente no puede fechar la Muhitiyya, y un título conservado por sí solo no puede establecer un testimonio compartido {cite:iranica-kashi letters and works}.

## En la cultura

Los números largos atraen la atención, pero la historia de al-Kashi no es un concurso de memorizar dígitos. Las fuentes retratan a un estudioso que escribe a su padre, busca apoyo y trabaja entre colegas y en la corte. El elogio de Ulugh Beg sigue siendo el juicio de quien lo pronuncia, no un veredicto del museo de que cada una de las opiniones de al-Kashi superara a todos los rivales {cite:kashi-mactutor biography and patronage} {cite:iranica-kashi Life}.

Iranica distingue la destreza de cálculo y de instrumentos de los límites de las contribuciones conocidas a la teoría planetaria cosmológica. Esto no menosprecia la aritmética: la astronomía tiene varios campos, y la distinción en uno no prueba automáticamente todo logro en todos. Un estudioso histórico es más que un número famoso y menos que un héroe al que se le atribuye todo {cite:iranica-kashi concluding assessment}.

## Para los lectores jóvenes

Mira los círculos y los hexágonos. ¿Cuál tiene las esquinas en la circunferencia y cuál tiene los lados tocando el círculo desde fuera? Dibuja un camino de papel más corto y otro más largo y escribe “la respuesta está aquí” entre ellos. Esta es una actividad de cotas, no medir dieciséis cifras decimales a partir de un dibujo pequeño ni recrear exactamente el trabajo de al-Kashi.

¿Escribir más dígitos hace correcta una respuesta? Escribe una estimación corta y explica sus límites en lugar de añadir números sin respaldo. No se requiere construir instrumentos ni observar el cielo. Bastan papel y una pregunta. Un dibujo ligeramente imperfecto también demuestra por qué una imagen que explica difiere de una relación matemática que prueba.

## Referencias

- {cite:kashi-mactutor complete biography}
- {cite:tdv-kashi-okten complete entry}
- {cite:iranica-kashi complete article body}
- {cite:commons-archimedes-pi-urutseg Description licence and history}
