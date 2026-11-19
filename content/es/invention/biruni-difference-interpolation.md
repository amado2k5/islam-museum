---
id: invention/biruni-difference-interpolation
lang: es
source_lang: en
translators: ['Claude (claude-fable-5-2), draft translation']
status: { review: published }
provenance: {generated_by: 'Claude Code subagent (spanish lane, records the document services could not return intact)', model: claude-fable-5-2, run: claude-es-2026-11-19, source: content/en/invention/biruni-difference-interpolation.md}
---
## Resumen

¿Cómo puede un lector obtener un valor que una tabla no da en su propia fila? Dividir el incremento entre filas en partes iguales no siempre basta: los propios incrementos pueden cambiar. [[person/al-biruni-muhammad-ibn-ahmad|Al-Biruni]] trata este problema en el [[work/al-qanun-al-masudi|Qanun al-Mas'udi]] y luego explica una manera de ajustar el cálculo {cite:qanun-masudi-jundi-v1 scan pp.301–302,321–324}. Esta entrada concierne a una mejora específica en el uso de las tablas, no a la invención del seno, de toda interpolación ni de toda fórmula cuadrática posterior. Los métodos indios anteriores pertenecen al relato, no quedan fuera de él {cite:meijering-interpolation-2002 II.B–II.C}. La prueba aquí es texto y cálculo aproximado, no maquinaria arqueológica ni una demostración de que cada resultado sea más exacto.

## Qué es

La interpolación estima un valor entre entradas conocidas. El editor usa [[concept/istikmal-interpolation|istikmal]] al tratar de al-Biruni; el pasaje primario real distingue procedimientos habituales y refinados para hallar un seno o hallar un arco {cite:qanun-masudi-jundi-v1 scan pp.40–42,321–324}. La consulta directa busca un seno a partir de un arco; la consulta inversa busca un arco a partir de un valor. El autor también advierte contra llamar búsqueda del seno a toda operación tabular cuando su objeto es otra cosa {cite:qanun-masudi-jundi-v1 scan p.321}.

El refinamiento trae otra diferencia a consideración: no solo el cambio entre filas vecinas, sino cómo ese cambio difiere del precedente. Ese procedimiento es la unidad de esta entrada. Las columnas, la resta y cada multiplicación no se cuentan como inventos separados. Tampoco llamar no lineal a una expresión establece su igualdad con toda otra expresión no lineal.

## El mundo anterior

Meijering explica fórmulas de segundo orden asociadas con Brahmagupta y con el trabajo indio subsiguiente antes de al-Biruni, dentro de una historia mucho más larga de tablas astronómicas {cite:meijering-interpolation-2002 II.B–II.C}. El resumen de Rashed refiere cuatro métodos disponibles para al-Biruni, dos de ellos indios, a través de un pasaje examinado en al-Samaw'al {cite:rashed-interpolation-1991 abstract}. Leer ese resumen no es leer su manuscrito subyacente ni cada demostración matemática del artículo completo.

La [[invention/battani-sine-table-methods|entrada sobre el método de tablas de al-Battani]], que el museo tiene aparte, incluye la interpolación lineal directa e inversa {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}. Esta entrada no es un reetiquetado de aquel trabajo. La existencia de un precursor no hace idéntica a él toda regla posterior, pero una mejora posterior específica no puede borrar el trabajo anterior simplemente porque un resumen moderno llame pionero a su autor.

## La historia

La pregunta empieza antes de las instrucciones. Al tratar la elección del diámetro, al-Biruni prefiere un seno máximo de uno para reducir la multiplicación y la división repetidas, y luego argumenta geométricamente que las diferencias de los senos no varían en la misma proporción fija que los arcos {cite:qanun-masudi-jundi-v1 scan pp.301–302}. También reconoce el trabajo del cálculo a intervalos más finos y explica el espaciado de un cuarto de grado adoptado para su tabla de senos {cite:qanun-masudi-jundi-v1 scan p.302}.

Muchas posiciones numéricas no reemplazan un procedimiento adecuado para usarlas. La datación aquí es el amplio contexto documental del siglo once asignado al Qanun por Meijering, no un día exacto de invención ni la fecha de la edición moderna {cite:meijering-interpolation-2002 II.C}. No se inserta ninguna fecha de la Hégira calculada como si fuera un informe histórico original.

## El autor o los autores

La atribución descansa en la exposición escrita de al-Biruni, no en su fama general. Su papel aquí es el de mejorador de un procedimiento tabular concreto, con los predecesores conservados {cite:qanun-masudi-jundi-v1 scan pp.321–324,339–340} {cite:meijering-interpolation-2002 II.B–II.C}. El autor del texto, el editor de la edición, Rashed, Meijering y el ilustrador moderno son contribuyentes distintos. Reunir su trabajo en una página no los convierte en una sola mano histórica.

**Marco suní:** Britannica y Tümer aportan una base individual para la identidad musulmana, mientras que la clasificación confesional personal sigue debatida. La biografía presenta la interpretación de Tümer dentro del marco suní declarado {cite:britannica-al-biruni biography} {cite:tdv-biruni-tumer religious-affiliation}.

**Clasificaciones chií y zaydí referidas:** El registro de la persona preserva ambas a través de Tümer, no como un veredicto decisivo del museo {cite:tdv-biruni-tumer religious-affiliation}. Un nombre, la afiliación de un mecenas o un sitio web que aloja escaneos no pueden reemplazar las pruebas sobre el individuo.

## Cómo funciona

El lector toma la fila cuyo arco está por debajo del arco requerido, conserva su valor y la porción restante del arco, y luego distingue la corrección habitual de un refinamiento que usa la diferencia adyacente y su predecesora {cite:qanun-masudi-jundi-v1 scan pp.321–322}. El incremento usado en el cálculo, por tanto, no se mantiene fijo a lo largo del intervalo. El texto explica geométricamente su cambio gradual {cite:qanun-masudi-jundi-v1 scan p.323}. Llamar refinado al resultado no lo hace exacto ni libre de error.

Para valores crecientes, un desglose moderno usa el valor inicial `y0`, los incrementos precedente y siguiente `Dprev` y `Dnext`, y la fracción de un intervalo de la tabla `t`. La instrucción resultante dice `y0+t*((1-t)*Dprev+t*Dnext)` {cite:qanun-masudi-jundi-v1 scan pp.322–323,339–340}. Estos son nuestros símbolos didácticos, no la notación del autor ni la regla estándar de Newton que necesariamente se ajusta a las tres muestras. La multiplicación por el residuo ocurre dos veces, lo que hace no lineal la expresión.

Tómese una tabla didáctica inventada con valores1,2,2.5 en las posiciones−1,0,1. El incremento precedente es 1 y el incremento siguiente0.5. A la mitad del intervalo siguiente este procedimiento da 2.375, mientras que la interpolación lineal da 2.25. Nada en esas muestras por sí solas nos dice el valor intermedio real. Estos no son datos numéricos del Qanun ni prueba de una exactitud universalmente superior; muestra lo que cambió en las instrucciones.

Las unidades también importan. Los cuatro minutos de la instrucción primaria son el número sexagesimal 1/15, que representa la división por los quince minutos de arco de un intervalo de un cuarto de grado, no un nuevo ángulo de cuatro grados {cite:qanun-masudi-jundi-v1 scan p.323}. La consulta inversa recibe su propio procedimiento; la inversa de una aproximación no es automáticamente la verdadera función inversa {cite:qanun-masudi-jundi-v1 scan pp.322,324}.

Volver del seno al arco merece una atención aparte: el autor empieza con el seno menor más cercano, conserva su arco y usa el seno restante y las diferencias para obtener un incremento de arco {cite:qanun-masudi-jundi-v1 scan p.322}. Intercambiar simplemente los encabezados de las columnas preservando cada operación no es suficiente, porque la cantidad conocida y el residuo requerido han cambiado. Tampoco la diferencia precedente es cero meramente porque la ventana mostrada a un lector empiece en la fila actual. Se requiere un vecino concreto. Los límites de la visualización no son los límites históricos de la tabla; no se inventa ninguna regla para un extremo ausente ni un valor de reemplazo silencioso. Esto explica los requisitos de las instrucciones, no un software nuevo atribuido al autor.

## La difusión

El resumen de Rashed refiere que al-Samaw'al citó a al-Biruni, examinó procedimientos lineales y no lineales, comparó sus resultados e intentó mejorarlos {cite:rashed-interpolation-1991 abstract}. Este es un testimonio concreto de lectura y discusión subsiguientes, no un mapa completo de migración entre países. No hemos leído el artículo completo ni el manuscrito para esta entrada y no inventamos copistas ni fechas de escuelas desde detrás de su resumen.

Meijering describe la interpolación en fuentes árabes y persas y posibles influencias indias, sin establecer una identidad automática entre todas las fórmulas {cite:meijering-interpolation-2002 II.C}. La lista de difusión no contiene estaciones sin respaldo. Una influencia posible no es una arista de dependencia documentada; registrar esa distinción es más útil que llenar un mapa de flechas atractivas pero no verificadas.

## Sobre qué se construyó

El procedimiento usa el conocimiento de arcos y senos, la división circular, las tablas, la aritmética sexagesimal y las diferencias entre filas. El autor explica la elección del uno y lo compara con un radio de sesenta {cite:qanun-masudi-jundi-v1 scan pp.301,323–324}. Esta elección no lo hace inventor de las fracciones ni de todo uso de las razones.

El trabajo indio anterior es una parte sustancial de la historia, no un fondo decorativo. Sin embargo, las fuentes modernas no autorizan una ruta segura y con nombre de maestro a discípulo para cada instrucción concreta {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. Una tradición técnica anterior y una copia conocida que llega a un lector conocido son clases diferentes de prueba. La primera por sí sola no establece la segunda, y ninguna de las dos excusa ignorar el algoritmo real que se exhibe.

## Qué se construyó sobre ello

Tras tratar los senos y las sombras, el autor generaliza explícitamente el trabajo refinado a todas las tablas: conservar un valor, obtener los vecinos, ajustar la diferencia precedente según las diferencias cambiantes y luego calcular la contribución fraccionaria {cite:qanun-masudi-jundi-v1 scan pp.339–340}. Esto pasa de un ejemplo trigonométrico a un procedimiento más amplio dentro del propio libro, no es prueba de éxito para todo conjunto de datos imaginable.

La comparación subsiguiente de al-Samaw'al es referida por el resumen de Rashed y sigue atribuida a él {cite:rashed-interpolation-1991 abstract}. No se traza ninguna línea directa hacia todo programa de ordenador o satélite moderno. Unos símbolos modernos similares no pueden probar un camino histórico hasta Newton. La semejanza matemática y la prueba de que un texto pasó entre sus autores son preguntas separadas; una cadena didáctica no debe pretender otra cosa.

## Impacto en la vida cotidiana

El beneficio directamente respaldado concierne a los usuarios de tablas que buscan el valor de un ángulo no listado o que vuelven de un valor a un ángulo, con una explicación de por qué una sola proporción puede no bastar {cite:qanun-masudi-jundi-v1 scan pp.321–324,328–329}. Los pasajes inspeccionados no cuentan hogares, mezquitas ni viajes que usaran este refinamiento concreto. No se inventan números de dinero ahorrado, de tiempo de cálculo ni de reemplazo universal de tablas más antiguas.

La comparación expone una distinción importante: una tabla puede haber sido calculada cuidadosamente, mientras que la aproximación entra cuando alguien trabaja entre sus filas. Describir un libro como exacto no puede eximir a toda operación subsiguiente del examen de sus unidades y supuestos. La utilidad práctica aquí es un propósito de cálculo documentado, no un estudio moderno de adopción.

## Cómo cambió la historia

El testimonio importa porque un supuesto aritmético se convierte en objeto de crítica y explicación. Al-Biruni no se limita a dar instrucciones; explica las diferencias desiguales {cite:qanun-masudi-jundi-v1 scan pp.301–302,323}. No es necesario reemplazar la historia de las matemáticas por una historia de héroe solitario para reconocer ese logro.

El relato de Meijering sitúa las contribuciones indias y chinas junto a las fuentes árabes y persas antes de los desarrollos europeos posteriores {cite:meijering-interpolation-2002 II.B–II.C}. La sucesión cronológica por sí sola no prueba el contacto entre cada autor y su sucesor. Releer la redacción operativa también impide que una fórmula moderna familiar se proyecte sobre un procedimiento diferente meramente porque ambos usan diferencias. Ese es un valor histórico y educativo, sin una medida numérica inventada de sus consecuencias.

## ¿Quién lo inventó?

**Texto dentro del marco suní declarado:** Esta entrada atribuye a al-Biruni la exposición específica inspeccionada, conservando la afiliación individual debatida de su biografía en lugar de convertir la aritmética en prueba confesional {cite:qanun-masudi-jundi-v1 scan pp.321–324} {cite:tdv-biruni-tumer religious-affiliation}. No le otorga la primera interpolación de segundo orden del mundo.

**Lectura académica:** Meijering documenta métodos indios anteriores; el resumen de Rashed describe cuatro métodos disponibles para al-Biruni, contribuciones indias y las comparaciones de al-Samaw'al {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. La comparación con Newton y Gregory de la introducción de la edición sigue siendo una interpretación atribuida, no una constatación de fórmulas idénticas ni de transmisión directa hacia ellos {cite:qanun-masudi-jundi-v1 scan pp.40–42}. La prioridad, la pluralidad de métodos y los detalles de este procedimiento concreto deben permanecer distinguibles.

## Hoy

Los visitantes pueden comparar aproximaciones en papel sin telescopios ni software. En `t=0` el procedimiento desglosado conserva el valor inicial; en `t=1` alcanza el siguiente. Unos incrementos iguales lo reducen al cálculo lineal. Estas son consecuencias algebraicas de la expresión didáctica, no un experimento presenciado en el taller de al-Biruni {cite:qanun-masudi-jundi-v1 scan pp.339–340}.

La concordancia en los extremos no garantiza el conocimiento entre ellos ni la superioridad para toda función. Entender las instrucciones y aportar una garantía numérica no establecida por la investigación son logros diferentes. Un lector puede preguntar por el error, los límites del intervalo y los supuestos antes de admirar muchos dígitos. El relato histórico no es una recomendación para tareas de navegación o de medición del tiempo que requieran verificación independiente.

## Ejemplos conservados

Leímos pasajes árabes seleccionados e inspeccionamos los escaneos 301,322,323,340, que corresponden a las impresas 300,321,322,339. Las citas nuevas usan explícitamente páginas de escaneo; el número impreso es uno menos {cite:qanun-masudi-jundi-v1 scan pp.301,322–323,340}. Esto no es un cotejo de manuscritos ni una lectura de cada tabla, muchas de las cuales están distorsionadas en el texto extraído.

La imagen mostrada es la ilustración moderna de DaBler del7 de marzo de2010, cedida explícitamente al dominio público; se inspeccionó su renderizado de 960×720 {cite:commons-quadratic-interpolation description,rights,image}. Muestra una parábola por tres muestras, un máximo marcado y un panel inferior de diferencia/pendiente. Es una comparación conceptual, no los pesos exactos de esta regla ni una prueba de que al-Biruni dibujara una derivada moderna {cite:commons-quadratic-interpolation code}. Los escaneos, el texto extraído y los binarios originales quedan fuera del repositorio.

## En la cultura

El pasaje combina lenguaje geométrico e instrucciones para calculadores. El autor elige nombres concisos para los arcos y sus complementos a fin de evitar la confusión y trata el trabajo de una tabulación más fina {cite:qanun-masudi-jundi-v1 scan pp.302,321}. Esto muestra cómo se presenta el conocimiento práctico en un libro, no que todo lector histórico lo entendiera o lo usara de manera idéntica.

La ilustración moderna emplea azul, rojo y ejes trazados, un lenguaje didáctico muy posterior que no se atribuye al manuscrito {cite:commons-quadratic-interpolation image,code}. Colocar juntos los dos enfoques es útil solo cuando se explica su distancia. La elegancia del dibujo de hoy no debe convertirse en prueba de un original histórico no examinado ni de una notación que el autor nunca usó en el pasaje leído.

## Para los lectores jóvenes

Escribe las posiciones−1,0,1 en papel, con los valores1,2,2.5 debajo. El primer incremento es 1, el siguiente0.5. A medio camino entre la posición del medio y la última, la estimación lineal es 2.25. Mezcla los dos incrementos a partes iguales para obtener0.75, toma la mitad y súmala a 2: el resultado es 2.375. Estos números de juego inventados ilustran la secuencia de instrucciones, no mediciones históricas {cite:qanun-masudi-jundi-v1 scan pp.339–340}.

Mantén oculto el valor intermedio desconocido y no elijas un ganador: las tarjetas por sí solas no lo dan. Prueba con incrementos iguales y observa la concordancia. Bastan lápiz y papel; no observes el Sol ni apuntes un telescopio hacia él. No preguntes qué número parece más bonito, sino qué supuesto condujo a él.

## Referencias

- [[source/qanun-masudi-jundi-v1|Qanun al-Mas'udi, vol.1]], lectura seleccionada por páginas de escaneo e inspecciones de imagen especificadas; la numeración impresa es uno menos.
- [[source/meijering-interpolation-2002|Meijering, A Chronology of Interpolation]],II.B–II.C, artículo real alojado por el autor.
- [[source/rashed-interpolation-1991|Rashed, al-Samaw'al, al-Biruni and Brahmagupta]], solo el resumen del editor, no el artículo completo.
- [[source/britannica-al-biruni|Britannica]] y [[source/tdv-biruni-tumer|Tümer]], identidad individual y clasificaciones confesionales referidas.
- [[source/commons-quadratic-interpolation|Ilustración de DaBler y derechos]], comparación moderna de dominio público.
- [[source/nallino-albatenii-opus-astronomicum|Edición de al-Battani de Nallino]], frontera con la entrada anterior sobre el método lineal.
