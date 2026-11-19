---
id: invention/haytham-factorial-remainders
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/haytham-factorial-remainders.md}
---
## Resumen

MacTutor presenta [[person/ibn-al-haytham|a Ibn al-Haytham]] considerando un número que deja resto1 al dividirse por 2,3,4,5 y 6, pero es divisible por 7. Explica una construcción que multiplica los enteros consecutivos y suma uno:6!+1=721. Esta es una contribución particular de la teoría numérica, no la invención de cada problema de resto ni de cada conjunto de condiciones simultáneas {cite:haytham-mactutor number-theory}.

El relato invoca lo que ahora se denomina el teorema de Wilson y reporta un segundo método que ofrece todas las soluciones, sin reproducir sus detalles. Distinguimos ese informe de la familia moderna independiente del museo 301+420j. Tampoco 721 es la respuesta menos positiva: 301 es más pequeño y cumple exactamente las mismas condiciones {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem eq1}.

## Qué es

Un resto es lo que queda tras eliminar un número entero de múltiplos del divisor. Decir que 721 deja 1 al dividir por 6 significa 721=6×120+1, no que su cociente sea 1. El problema requiere varias condiciones a la vez. Cumplir una condición por sí solo no es una solución completamente verificada {cite:haytham-mactutor number-theory}.

Factorial es nuestra abreviatura moderna para multiplicar sucesivos enteros positivos:6!=1×2×3×4×5×6=720. El signo de exclamación es notación matemática, no una puntuación copiada del original de Ibn al-Haytham. Explicamos la relación en un lenguaje accesible hoy en día, manteniendo la construcción histórica reportada separada de nuestra forma de comprobarla {cite:weisstein-wilson-theorem definition}.

## El mundo que tenía delante

MacTutor denomina al problema un caso especial del teorema del resto chino. Por tanto, sería erróneo atribuir a Ibn al-Haytham toda la idea de combinar condiciones de división. Este registro identifica una construcción factorial específica dentro de una tradición problemática más amplia. Los fundamentos anteriores no borran una contribución posterior, pero impiden una historia de una persona que parte de la nada {cite:haytham-mactutor number-theory}.

Esta cuestión también difiere de su [[invention/ibn-al-haytham-fourth-power-volumes|método de volumen de cuarta potencia]] y [[invention/ibn-al-haytham-circular-reflection|del problema del punto de reflexión circular]]. No contamos una contribución repetidamente bajo nombres diferentes. Aquí las restricciones se refieren a enteros, no a una superficie óptica ni a un volumen. Trabajar entre sujetos no establece por sí mismo una transferencia directa de un método particular entre ellos {cite:haytham-mactutor number-theory}.

## La historia

MacTutor se refiere a Opuscula y utiliza una traducción en el estudio de Rashed antes de describir dos métodos. Explica la primera construcción y dice que la segunda proporciona todas las soluciones de este tipo. Leemos ese relato, no el original árabe ni la edición completa de Rashed. No inventamos ni un título de tratado árabe ni una identidad de libro antiguo a partir de una etiqueta de colección moderna {cite:haytham-mactutor Opuscula}.

El pasaje no ofrece una sesión de enseñanza ni un espacio de escritura con fecha sólida. La vida del autor a finales del siglo X y principios del XI sigue siendo un horizonte amplio; Cairo es un contexto biográfico, no un lugar confirmado para esta cuestión de composición. Una fecha asociada al Libro de la Óptica no es automáticamente una fecha para todas las demás ideas numéricas {cite:haytham-mactutor biography-and-number-theory} {cite:tdv-ibnul-heysem biography}.

## El(los) creador(es)

La base de identidad individual existente del autor, extraída de la apertura de Óptica y TDV, se mantiene junto al marco suní declarado por separado. No deducimos ninguna nueva denominación de su empleo egipcio ni de un cálculo exitoso. Esta sesión no es una nueva investigación crítica de cada texto biográfico {cite:manazir-sabra-1983 p.60} {cite:tdv-ibnul-heysem biography}.

Wilson es el nombre moderno asociado al resultado aritmético. MathWorld analiza el conocimiento previo de Wilson, Waring, Leibniz y la demostración de Lagrange; MacTutor describe un uso anterior realizado por Ibn al-Haytham. Ambos relatos históricos siguen siendo visibles sin inventar una ruta directa de manuscrito a manuscrito ni asignar toda la historia a una sola persona {cite:weisstein-wilson-theorem history} {cite:haytham-mactutor number-theory}.

## Cómo funciona

Cada entero de 2 a 6 es un factor de 720. La división de 720 por cualquiera de ellos deja 0, así que la división de 721 deja la 1. Eso por sí solo no establece la divisibilidad por 7. El resultado ahora llamado teorema de Wilson proporciona la condición prima: para primep, el número(p−1)!+1 es byp divisible. Here721=7×103 {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory}.

Esto no convierte 721 en primo: sus factores7 y 103 muestran lo contrario. La condición prima se refiere a la respuesta construida. Tampoco puede sustituirse silenciosamente por un compuesto arbitrario: para 4, la construcción3!+1 da 7, que no es divisible por 4. No puede utilizarse una fórmula válida bajo una hipótesis después de descartar esa hipótesis {cite:weisstein-wilson-theorem definition-and-composite-exception}.

Aquí hay una derivación moderna independiente de todas las respuestas positivas, no una recuperación del segundo método histórico. El múltiplo mínimo común de 2 a 6 es 60, soN=60k+1. Dado que 60 deja resto4 al dividir por 7, necesitamos 4k+1 divisible por 7. Esto requiere k=5+7j, dando N=301+420j.

Takej como un entero no negativo para respuestas positivas. Las primeras son 301,721 y 1141. Por ejemplo, 301=5×60+1=7×43, mientras que 721=12×60+1=7×103. Enumerar unas pocas respuestas no demuestra por sí solo la completitud. Aquí la completitud proviene de reducir las condiciones a N=60k+1 y resolver la condición restante módulo 7, en lugar de detener una búsqueda en un número atractivo.

El incremento 420 explica la repetición: es divisible por 60 y 7, preservando cada resto requerido. Sumar solo 7 a 721 da 728, aún divisible por 7 pero dejando 2 en lugar de 1 al dividir por 6. Sumar 60 preserva las condiciones anteriores, no automáticamente la condición para 7. Por tanto, un incremento arbitrario no produce otra respuesta. Esto verifica el periodo común en nuestra solución moderna, no una lista encontrada en un manuscrito o una demostración de que nuestra formulación reproduce el segundo método histórico. Preservar una restricción difiere de preservar todo el sistema.

## La propagación

Las fuentes leídas aquí no proporcionan ninguna ruta manuscrita que conecte directamente al autor con Wilson. Un nombre moderno y un resultado más antiguo no establecen la copia, traducción ni cita. Los informes permanecen atribuidos a sus fuentes, y un enlace de transmisión no documentado no se convierte en una flecha segura en un diagrama {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

Informar de un segundo método tampoco establece su adopción en todas las escuelas o mercados. Una posible aplicación no es una estadística histórica de circulación. Las explicaciones modernas son evidencia de la enseñanza actual; relacionarlas con un currículo antiguo en particular requeriría evidencia ausente en los pasajes aquí consultados.

## Sobre qué se construyó

Los ingredientes inmediatos son multiplicar los enteros y sumar uno, junto con una condición particular para el divisor final. Sin esa condición final, quedan respuestas de forma 60k+1, en lugar de un número único. Los factores repetidos hacen de 720 un múltiplo común adecuado, pero no el mínimo común. Multiplicar todo no siempre es la construcción más corta {cite:haytham-mactutor number-theory}.

Usamos 60 en la explicación moderna porque combina las condiciones para los divisores 2 a 6. Esos divisores no son coprimos por par:2,4 y 6 tienen factores comunes. No debemos aplicar silenciosamente una fórmula restringida a módulos coprimos por pares. Identificar la estructura real importa más que invocar el nombre del teorema amplio.

## Lo que se construyó sobre ello

MathWorld enuncia el teorema moderno como condición de primalidad necesaria y suficiente para >1. Esa explicación moderna no es un anuncio que hayamos encontrado ambas direcciones plenamente demostradas en el original de Ibn al-Haytham. Usar un resultado, demostrarlo y diseñar una prueba práctica rápida a partir de él son afirmaciones separadas {cite:weisstein-wilson-theorem definition} {cite:haytham-mactutor number-theory}.

Para la enseñanza, se puede multiplicar paso a paso conservando solo el resto actual, evitando enormes enteros escritos. Esta es una forma moderna de comprobar ejemplos, no un algoritmo informático asignado al autor medieval. Una aritmética similar no establece un linaje directo con cada software o aplicación criptográfica actual.

## Impacto en la vida diaria

Los pasajes consultados no registran ningún ahorro de tiempo ni contratos de los comerciantes aplicando este ejemplo. La contribución respaldada pertenece a la investigación sobre condiciones numéricas simultáneas y soluciones múltiples. No inventamos ninguna anécdota comercial para convertir la aritmética en un antiguo recurso cotidiano; una pregunta no necesita un retorno financiero medido para merecer explicación {cite:haytham-mactutor number-theory}.

El lector de hoy obtiene una lección clara: una respuesta correcta no tiene por qué ser la más pequeña, y una respuesta no es toda. Un método constructivo puede producir un número grande y fácilmente comprobable, mientras que reformular las condiciones ofrece una descripción más corta de toda la familia. Esa es una lección de los puntos 301 y 721, no evidencia del motivo económico personal del autor.

## Cómo cambió la historia

El problema hace visible la matemática no óptica del autor: enteros bajo restricciones simultáneas, no solo espejos y ojos. Sin embargo, la fama de la óptica no demuestra prioridad en todos los demás temas. La atribución aquí permanece limitada a una construcción particular descrita en el relato histórico {cite:haytham-mactutor number-theory}.

También separa construcción, verificación y integridad. Se puede construir 721, comprobar cada condición y luego pedir respuestas más pequeñas y toda la familia. Son tareas diferentes. Reportar un segundo método muestra que el relato histórico no se detiene en producir el primer número. No rellenamos sus detalles faltantes con una prueba moderna ni ocultamos la sustitución {cite:haytham-mactutor Opuscula}.

## ¿Quién lo inventó?

**Marco suní declarado:** Se conserva la base existente de identidad individual de Ibn al-Haytham, no se deduce de la aritmética. **Relato académico:** MacTutor describe la construcción y uso anteriores; MathWorld describe el nombre del teorema y la historia europea posterior. Ninguno de los dos establece nuestra propia ruta directa de transmisión ni convierte un nombre moderno en el límite de la historia de la idea {cite:tdv-ibnul-heysem biography} {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

"Mejora" protege el límite de la atribución: no el primer teorema chino del resto, ni el primer cálculo factorial ni todos los cálculos de congruencia. No reclamamos ni lectura del texto original ni una resolución final sobre cada cuestión prioritaria. Lo que podemos mostrar es una construcción particular, sus límites y una afirmación moderna que ayuda a los lectores a comprobarla.

## Hoy

La imagen tiene dos relojes grises etiquetados 0,3,6,9, con +4h entre ellos. La aguja pasa de 9 a 1:9+4=13, lo que deja 1 módulo 12. Esta es una analogía moderna para la aritmética cíclica, no el reloj de Ibn al-Haytham ni una ilustración manuscrita. Tampoco es el problema de prime7 en sí: 12 es compuesto {cite:commons-clock-group-spindled current-image}.

La congruencia no significa 13=1 como enteros ordinarios. Significa que dejan el mismo resto en división por 12. La aritmética de resto no borra la diferencia entre números. La imagen ayuda a explicar el vocabulario, no a demostrar todas las propiedades de números primos necesarias por la construcción factorial {cite:commons-clock-group-spindled description}.

## Ejemplos supervivientes

Leemos los pasajes especificados de MacTutor y la definición, la primera fórmula y el párrafo histórico de MathWorld. No leímos el Opuscula original ni la edición completa de Rashed, y no deducimos un ID de manuscrito árabe de esa etiqueta. No crear aquí un nuevo registro de trabajo preserva ese límite; no afirma que el autor no haya escrito nada sobre el problema {cite:haytham-mactutor Opuscula}.

Se inspeccionó la imagen real de Commons y los derechos. Spindled realizó la carga original el 19 de octubre de 2006; la versión actual incluye una corrección de alineación de texto a2008 y lleva CC BY-SA3.0. El SVG original actual se publica sin modificaciones. Las fechas de subida no fechan la matemática antigua ni prueban la existencia de un reloj histórico superviviente de esta aparición {cite:commons-clock-group-spindled description-rights}.

## En la cultura

Una historia de invención puede favorecer un solo nombre, una escena triunfante y un número final. Esta cuestión se enriquece cuando una respuesta concreta permanece distinta de una descripción general y el nombre de un teorema de sus usos anteriores. Eso no es un juicio contra matemáticos nombrados; es cómo el museo muestra lo que la evidencia establece y lo que no establece {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

La explicación no necesita ni un retrato imaginario ni una reunión didática ficticia. Lee las condiciones, revísalas de nuevo y reconoce que la imagen de los dos relojes pertenece a otro periodo. Una comparación explícitamente declarada enseña sin hacer que un recurso educativo moderno pretenda documentar una escena antigua.

## Para lectores jóvenes

Escribe 721 y divide entre 2,3,4,5,6, luego 7. Registra los restos, no solo los cocientes. Repite con 301. El número más pequeño también cumple las condiciones. No te detengas en la primera respuesta correcta ni la consideres la más pequeña sin una búsqueda o demostración.

Ahora try7, obtenido de 3!+1: ¿es divisible por 4? No. Pregúntese qué hipótesis difiere del ejemplo original de prime7. El reloj moderno no estaba necesariamente en manos del autor; es solo una analogía del resto. La evidencia histórica y la aritmética actual coinciden sin convertirse en lo mismo {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory}.

## Referencias

- MacTutor: problema de restos reportado y construcción {cite:haytham-mactutor number-theory}.
- MathWorld: fórmula, historia y condición de primalidad {cite:weisstein-wilson-theorem eq1-and-history}.
- TDV: entorno del autor, no un sitio de composiciones verificado {cite:tdv-ibnul-heysem biography}.
- Bienes comunes: imagen moderna y derechos {cite:commons-clock-group-spindled description-rights}.
