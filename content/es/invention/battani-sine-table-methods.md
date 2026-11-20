---
id: invention/battani-sine-table-methods
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/battani-sine-table-methods.md}
---
## Resumen

En el capítulo tres de [[work/al-zij-al-sabi|su Zij]], [[person/al-battani|Muhammad ibn Jabir al-Battani]] explica cómo construir una tabla de semicuerdas de arcos dobles y utilizarla en ambas direcciones: de un arco a una longitud, y de una longitud a un arco {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17; Latin pp. 9–11}. Hoy a estas cantidades llamamos senos; esto es un refinamiento computacional dentro de tradiciones más antiguas, no una invención del seno ni de toda trigonometría {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. El capítulo combina geometría, tabulación y aproximación en lugar de presentar números sin instrucciones para su uso {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## Qué es

La tabla conecta un arco con una longitud calculada en un círculo de escala especificada: al-Battani elige diámetro 120 y radio 60 {cite:nallino-albatenii-opus-astronomicum Arabic p. 13; Latin p. 9}. Una "media cuerda del arco doblado" significa duplicar el ángulo del arco y tomar la mitad de la cuerda correspondiente, no reducir a la mitad el ángulo original {cite:nallino-albatenii-opus-astronomicum Arabic pp. 15–16; Latin p. 10}. Esto hace que el seno tabulado corresponda directamente al arco de entrada del usuario, evitando duplicaciones repetidas durante el cálculo {cite:nallino-albatenii-opus-astronomicum Latin p. 10}.

## El mundo que tenía delante

El autor sigue explícitamente a Ptolomeo al elegir el diámetro 120 para un cálculo conveniente; la escala es heredada, no una invención privada {cite:nallino-albatenii-opus-astronomicum Arabic p. 13; Latin p. 9}. Comienza con la geometría de acordes y las relaciones de triángulo rectángulo, luego construye cuerdas de arcos posteriores mediante la mitad de la dos, la suma y la resta {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15; Latin pp. 9–10}. Esto no establece que todas las operaciones aparecieran por primera vez en este libro: el registro trata sobre su disposición práctica y el uso de la tabla dentro del Zij {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## La historia

El trabajo de observación de Al-Battani estuvo asociado con [[place/raqqa|Raqqa]], y su Zij constaba de cincuenta y siete capítulos, no una lámina aislada de senos {cite:tdv-battani-muftuoglu biography and Kitab al-Zij} {cite:battani-mactutor chapter outline}. Los fundamentos computacionales preceden a capítulos posteriores sobre el uso de tablas, haciendo del capítulo tres una introducción a una herramienta de trabajo más amplia {cite:tdv-battani-muftuoglu Kitab al-Zij}.

Las páginas inspeccionadas no proporcionan un año de composición independiente para este capítulo; ni una época de catálogo estelar ni el inicio de las observaciones se convierten en una fecha de invención {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17} {cite:tdv-battani-muftuoglu biography}. La fecha abierta del registro termina en su muerte en 317 H/929: una encuadernación de por vida más reciente, no una afirmación de que lo compuso específicamente en 929 {cite:tdv-battani-muftuoglu biography}.

## El(los) creador(es)

El papel registrado de al-Battani es el de "mejorador": el texto documenta una elección computacional y procedimientos de trabajo sobre geometría anterior {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. Su identidad musulmana aquí se basa en la apertura religiosa del autor, leída en árabe, y en el argumento explícito de Nalino a partir de ella—no su nombre ni afiliación familiar {cite:nallino-albatenii-opus-astronomicum Arabic p. 6, scan1146; Latin preface XVI, scan25}. El marco suní del museo está declarado por separado para el escenario abasí de Raqqa, no presentado como una declaración personal de la escuela jurídica; su biografía conserva opiniones históricas con nombre sin inferir religión únicamente a partir de "al-Sabi" {cite:tdv-battani-muftuoglu biography} {cite:nallino-albatenii-opus-astronomicum Latin preface XVI, scan25}.

## Cómo funciona
La relación del triángulo rectángulo mostrada es plana; los problemas esféricos en el zij son una aplicación astronómica separada, no el mismo triángulo dibujado {cite:battani-mactutor trigonometry} {cite:tdv-battani-muftuoglu §§el-Zîc}.

El ejemplo numérico inventado también muestra por qué importa el intervalo de la tabla:6/30 no es 6/60, por lo que usar un grado completo en lugar de medio grado cambia el incremento numérico. A la inversa, 20,4 por sí solo es insuficiente sin sus filas vecinas y su diferencia2; un exceso se convierte en minutos a través de la división y multiplicación descritas por el capítulo, no simplemente en una nueva etiqueta {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}. Estas son explicaciones adicionales del ejemplo en clase, no de valores manuscritos.

El extremo ilustra la escala geométrica: a 90 grados, la mitad de la cuerda del arco doblado de 180 grados es la mitad del diámetro, o 60. A 30 grados, la mitad de la cuerda de 60 grados es 30, porque esa cuerda es igual al radio {cite:nallino-albatenii-opus-astronomicum Arabic pp.13–16; Latin pp.9–10}. Los valores geométricos exactos en estos puntos difieren de la interpolación entre filas vecinas; una tabla puede combinar resultados geométricos con estimaciones intermedias.

MacTutor proporciona una relación de triángulo rectángulo atribuida a al-Battani: `b sin(A) = a sin(90 - A)` {cite:battani-mactutor trigonometric formulae}. Su notación es la presentación de la referencia moderna, no símbolos manuscritos árabes copiados. Combina un seno, el seno de un ángulo complementario y dos longitudes de lado, mientras que la tabla de semiacordes proporciona números para tales cálculos: la relación teórica y la tabla numérica desempeñan funciones diferentes {cite:battani-mactutor trigonometric formulae} {cite:nallino-albatenii-opus-astronomicum Arabic pp.13–17}.

Una demostración moderna, no un problema de manuscrito, toma 45 grados: su seno es igual a su seno complementario, por lo que los lados comparados son iguales. Para 30 grados, el complemento es 60 y esos senos difieren; estar en ángulo recto por sí solo no hace que los dos lados sean iguales. Escribir ambos lados con los senos escalados a radio 60 introduce el mismo factor en cada lado, que se cancela, dejando sin cambios la proporción de lados {cite:battani-mactutor trigonometric formulae} {cite:nallino-albatenii-opus-astronomicum Arabic p.16; Latin p.10}. Estos cálculos explican la relación reportada sin afirmar que el autor utilizó estos ejemplos concretos.

La interpolación también puede demostrarse con una tabla de aula explícitamente inventada, no con valores de Zij: supongamos que filas vecinas separadas por 30 minutos tienen valores 20 y 22. Una posición 6 minutos por encima de la fila inferior es una quinta parte del intervalo, por lo que se suma una quinta parte del aumento numérico2 a 20, dando 20,4. A la inversa, el exceso 0,4 dividido por la diferencia de filas2devuelve una quinta parte del intervalo angular, o 6 minutos {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}. Tener éxito en invertir la aritmética no demuestra que la curva real sea recta: explica el paso proporcional entre puntos, no la exactitud de la aproximación {cite:nallino-albatenii-opus-astronomicum Latin pp.10–11}.

TDV identifica otras funciones dentro del Zij: los capítulos 33–48 se refieren al uso de la mesa, el capítulo 32 a la conversión de calendario y el capítulo 28 a las longitudes de las cuatro estaciones basadas en la observación {cite:tdv-battani-muftuoglu Kitab al-Zij}. No todo valor tabular es, por tanto, un seno, ni toda diferencia entre fechas y ángulo: la tabla de funciones forma parte del trabajo que une la medición del tiempo, la observación y la geometría {cite:tdv-battani-muftuoglu Kitab al-Zij}.

La enciclopedia también atribuye ideas basadas en la proyección ortográfica y el teorema del cosseno esférico a las discusiones en los capítulos 5–26 {cite:tdv-battani-muftuoglu Kitab al-Zij}. Este relato secundario se distingue del capítulo de semicuerda examinado directamente: un triángulo esférico y una proyección no son el mismo objeto que un triángulo rectángulo plano, y las funciones compartidas no implican que todas las demostraciones se leyeran en el capítulo 3 {cite:tdv-battani-muftuoglu Kitab al-Zij} {cite:nallino-albatenii-opus-astronomicum Arabic pp.13–17}.


El capítulo primero construye acordes conocidos, incluyendo el acorde de 60 grados igual al radio, utilizando relaciones de lado cuadrado en triángulos rectángulos y cuerdas cuyos arcos completan un semicírculo {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15; Latin pp. 9–10}. Luego se convierte en semicordones de arcos duplicados, tabulados cada medio grado hasta 90 grados {cite:nallino-albatenii-opus-astronomicum Arabic pp. 15–16; Latin p. 10}. La construcción incluye una aproximación para el acorde de un grado, por lo que no toda etapa debe describirse como exacta sin aproximación {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–10}.

En la notación explicativa moderna—no símbolos manuscritos copiados—`S(theta) = 60 sin(theta)`; las entradas para 30 y 90 grados son, por tanto, 30 y 60, no 0,5 y 1 hasta que se dividen por 60 {cite:nallino-albatenii-opus-astronomicum Arabic p. 16; Latin p. 10}. Un acorde completo se recupera duplicando el seno de la mitad de su ángulo, no duplicando el seno de ese mismo ángulo completo {cite:nallino-albatenii-opus-astronomicum Arabic p. 17; Latin p. 11}.

Para un ángulo entre filas, toma la diferencia entre los valores de las tablas adyacentes, multiplica por los minutos de arco extra por encima de la fila inferior, divide por 30 minutos de arco y suma el resultado al valor inferior {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17; Latin pp. 10–11}. Esto es interpolación lineal: un ejemplo didáctico derivado de ella sitúa 30 grados 15 minutos a mitad de camino entre 30 grados y 30 grados 30 minutos, tomando la mitad del aumento tabular sin inventar cifras históricas para las dos entradas {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

El procedimiento inverso localiza el valor inferior de la tabla, convierte la longitud excedente en minutos de arco proporcionalmente a la diferencia de fila adyacente y los añade al arco inicial {cite:nallino-albatenii-opus-astronomicum Arabic p. 17; Latin p. 11}. Nallino llama a esto "arco"; su nota a pie de página explica la elección de terminología latina sine/coseno para representar las expresiones de medio acorde. Las palabras latinas del traductor no deben confundirse con frases literales árabes {cite:nallino-albatenii-opus-astronomicum Latin p. 11 and note}.

## La propagación

El Zij llegó a lectores latinos y castellanos, y las biografías abordan la recepción del libro en astronomía posterior {cite:tdv-battani-muftuoglu Kitab al-Zij} {cite:battani-mactutor reception}. La transmisión de una obra que contiene cálculo y tablas no demuestra por sí sola que cada capítulo o tres pasos llegara a todos los lectores sin cambios; por tanto, este registro no traza un itinerario mundial precisamente fechado solo para el procedimiento {cite:battani-mactutor reception}.

## Sobre qué se construyó

La base inmediata de la explicación es la geometría de cuerdas, la convención de diámetro 120 y los procedimientos que construyen arcos y sus longitudes correspondientes; El nombre de Ptolomeo se mantiene cuando el autor reconoce explícitamente su convención {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15}. Pasar a semicuerdas de arcos duplicados modifica la entrada utilizada en el trabajo de mesa, pero no borra la geometría anterior ni convierte al círculo en una nueva invención {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–10}.

## Lo que se construyó sobre ello

En el capítulo cuatro siguiente, el cálculo de seno e arco inverso plantea un problema de declinación en el mismo radio: una aplicación identificable dentro de la obra, en lugar de una mera semejanza moderna {cite:nallino-albatenii-opus-astronomicum Latin p. 12}. La ley del seno esférico no se agrupa silenciosamente en este resultado; una tabla y su uso no son todos los teoremas atribuidos al autor de Zij ni requieren su propia investigación {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–12}.

## Impacto en la vida diaria

El beneficio inmediato se refiere al trabajo de la calculadora: tratar un ángulo no listado y resolver el problema inverso sin reconstruir la geometría desde cero {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17}. Las páginas inspeccionadas no proporcionan un censo de usuarios de mercado o navegación, por lo que un beneficio computacional no se convierte en una historia no documentada sobre cada hogar o barco {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

## Cómo cambió la historia

MacTutor describe los métodos trigonométricos de al-Battani como un avance en el cálculo astronómico; el capítulo examinado expone parte del trabajo detrás de esa amplia afirmación {cite:battani-mactutor trigonometric methods} {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. Su valor reside en la construcción de longitud conectada, valores organizados e instrucciones para encontrar una cantidad sin su propia fila impresa—sin declarar un único padre de toda computación digital moderna {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## ¿Quién lo inventó?

La pregunta más limitada y respondible es quién explica este sistema en este Zij: al-Battani, con una deuda explícita a la geometría antigua {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}. El primer seno, la primera tabla y la primera interpolación en cada civilización son preguntas distintas, no se resuelven con estas páginas ni por el nombre de un erudito en un libro {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}.

## Hoy

Los lectores pueden comparar la escala histórica de radio 60 con la normalización moderna de unidades y entender la interpolación como una estimación entre entradas, no como un reemplazo exacto de la función subyacente en cada entrada {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}. La imagen es un diagrama de enseñanza moderno en triángulo rectángulo publicado por TheOtherJesse al dominio público en 2007, no la tabla de al-Battani; sus nombres laterales son relativos a un ángulo particular {cite:commons-trigonometry-triangle Description and Licensing}.

## Ejemplos supervivientes

El testigo textual inspeccionado es la edición de Nallino: el árabe impreso 13–17 corresponde a los escaneos 1139–115, y el latín impreso 9–11 a los escaneos 98–100; la parte árabe está en orden inverso en este archivo encuadernado {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17; Latin pp. 9–11}. Esto consiste en leer páginas específicas de una edición publicada, no examinar físicamente el manuscrito ni afirmar haber leído todas las tablas del libro {cite:nallino-albatenii-opus-astronomicum edition}.

## En la cultura

La biografía de "al-Battani" o "Albaten(i)us" pertenece a la transmisión de una obra árabe a otros idiomas, pero los nombres variados entre los lectores no justifican reconocerle el mérito de cada método posterior {cite:battani-mactutor reception}. El museo distingue el texto antiguo, la terminología latina de un traductor y una imagen moderna de enseñanza que lo acompaña {cite:nallino-albatenii-opus-astronomicum Latin p. 11 note} {cite:commons-trigonometry-triangle Description}.

## Para lectores jóvenes

Imagina una tabla que no puede imprimir todos los ángulos posibles: ¿qué ocurre cuando el tuyo cae entre dos filas? Al-Battani explica estimar una parte de la diferencia y luego invertir de longitud a ángulo; la lección es una forma de leer, no solo memorizar una larga cadena de números {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17}. Empieza con la idea de la mitad de camino, recordando que es una aproximación, no un dibujo a tamaño real del cielo {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

## Referencias

- Edición/traducción de Nallino: capítulo tres árabe13–17/scans1139–1135, Latin9–11/scans98–100; comienzo del capítulo cuatro Latin12; apertura árabe6/escaneo 1146 y argumento de identidad latina XVI/escaneo 25 {cite:nallino-albatenii-opus-astronomicum edition}.
- Ferruh Müftüoğlu, "BETTÂNÎ," TDV,6 (1992), 9–10 {cite:tdv-battani-muftuoglu article}.
- O'Connor y Robertson, MacTutor, noviembre de 1999; fechas de traducción contradictorias y inferencia religiosa solo de nombre no adoptada {cite:battani-mactutor biography}.
- Los metadatos originales archivados de triángulo de 2007 de TheOtherJesse y de la liberación del autor, no la versión revisada de 2024 {cite:commons-trigonometry-triangle Description, Licensing and file history}.
