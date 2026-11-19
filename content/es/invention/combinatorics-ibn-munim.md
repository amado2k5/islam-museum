---
id: invention/combinatorics-ibn-munim
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/combinatorics-ibn-munim.md}
---

## Resumen

¿Cuántas selecciones puede producir un conjunto fijo de colores? ¿Cómo cambia la respuesta si importa el orden o se permite la repetición? [[person/ibn-munim-al-abdari|Ibn Munim al-Abdari]] convirtió estas preguntas en herramientas para contar letras y palabras en la sección XI del [[work/fiqh-hisab-ibn-munim|Fiqh al-hisab]]. Ahmed Djebbar describe el movimiento desde modelos concretos hacia reglas, tablas y razonamiento, no simplemente escribir una larga lista y contar sus líneas {cite:djebbar-ibn-munim-combinatoire pp9–13}.

Nuestro registro se refiere al desarrollo combinatorio sistemático, no a la invención del conteo ni a la primera tabla triangular del mundo. Djebbar reconoce el trabajo predecesor lingüístico de al-Khalil ibn Ahmad y la construcción algebraica de al-Karaji. La contribución se refiere a interpretar entradas mediante selecciones y permutaciones y a ampliar los problemas de repetición, con límites a la abstracción que el historiador discute explícitamente {cite:djebbar-ibn-munim-combinatoire pp10–12}.

## Qué es

Una combinación selecciona elementos sin tener en cuenta el orden; una permutación trata las posiciones cambiadas como resultados diferentes. Permitir que un elemento se repita cambia nuevamente las posibilidades. Estas definiciones modernas explican el problema, no una afirmación de que cada palabra histórica coincide con un término actual de libro de texto. Djebbar distingue estos tipos dentro de un proyecto lingüístico, utilizando los colores como modelo de conteo {cite:djebbar-ibn-munim-combinatoire pp10–12}.

"Contar palabras" puede significar contar construcciones bajo supuestos sobre letras y signos, no enumerar vocabulario significativo en uso real. Arrabita describe un alfabeto elegido, la longitud máxima del ejemplo y las condiciones de marcado. Estas son suposiciones de modelo, no el descubrimiento de todo lo que los humanos han dicho. La posibilidad formal, un diccionario, el número de lenguas y el número de hablantes son cantidades diferentes {cite:arrabita-fiqh-hisab combinatorial section}.

## El mundo que tenía delante

La obra de los lingüistas, en particular la conteo de al-Khalil, aparece en el relato de Ibn Munim sobre su tarea tal como lo relata Djebbar. Las relaciones entre las letras y los posibles arreglos ya daban lugar a cuestiones aritméticas. El autor amplía el conteo sin letras repetidas en lugar de reclamar un vacío desorganizado ante sí mismo. Las tradiciones matemáticas y lingüísticas deben estar juntas en esta historia {cite:djebbar-ibn-munim-combinatoire pp9–11} {cite:arrabita-fiqh-hisab combinatorial section}.

El álgebra anterior de Al-Karaji proporcionó un triángulo aritmético. Esto es distinto de su [[invention/karaji-polynomial-arithmetic|registro aritmético polinómico]] y de la interpretación combinatoria aquí. No contamos la misma forma dos veces bajo "primer inventor del triángulo de Pascal". Identificamos el razonamiento y usamos: números idénticos no establecen que los autores entendieran cada misma relación o leyeran el mismo ejemplar {cite:djebbar-ibn-munim-combinatoire pp10–11}.

## La historia

La biografía de Abd al-Aziz al-Naqr describe a un hombre de Denia en al-Ándalus asentándose y enseñando en la Mansuriyya de [[place/marrakesh|Marrakech]]. La llegada no tiene fecha; una invitación califal es una sugerencia académica reportada. El informe anterior de Djebbar no pudo establecer el lugar de composición. Distinguimos el conocimiento de ese informe del uso de evidencia biográfica antigua {cite:arrabita-ibn-munim-naqr section3} {cite:djebbar-ibn-munim-combinatoire p8} en una biografía actualizada.

Djebbar fecha provisionalmente el libro entre 1207 y 1212 a partir de la dedicación y elogio de al-Nasir, no de un colofón fechado. Nuestro registro utiliza una amplia ubicación del siglo XIII y atribuye la sugerencia más estrecha. Su análisis también informa de tablas de aplicación añadidas tras la circulación de copias entre los estudiantes. Esto fue enseñanza y desarrollo de exposición, no un solo momento de inspiración perfectamente fechado {cite:djebbar-ibn-munim-combinatoire pp7–8,12}.

## El(los) creador(es)

El autor es Abu Jafar Ahmad ibn Ibrahim ibn Ali ibn Munim al-Abdari, no el siciliano Muhammad ibn Isa ibn Abd al-Munim. La biografía advierte sobre la confusión; nombres similares y ocupaciones matemáticas no establecen identidad. El artículo de Arrabita lo nombra explícitamente entre los eruditos musulmanes. Eso proporciona una base musulmana individual, no su nombre ni lugar de nacimiento {cite:arrabita-ibn-munim-naqr sections1,3} {cite:arrabita-fiqh-hisab introduction}.

El marco suní separado es el predeterminado declarado del museo, no la declaración personal de Maliki. Djebbar informa de elogios prefaciales a Ibn Tumart y al gobernante almohade; esto sigue siendo retórica atribuida, ni avalada por el museo ni suficiente por sí sola para una biografía completa y personal de la secta. En la biografía aparecen enseñanzas paternas, medicina y estudiantes, pero la información sigue siendo escasa {cite:djebbar-ibn-munim-combinatoire pp5–8} {cite:arrabita-ibn-munim-naqr sections3–5}.

## Cómo funciona

Djebbar presenta diez colores de seda hechos en mechones de un color, dos y así sucesivamente hasta diez, contando selecciones de cada tamaño. La primera línea tiene diez estuches de un solo color. Para formar pares, fija un color posterior y únelo a cada uno anterior, evitando un segundo recuento cuando su orden se invierte. Revisamos visualmente los impresos 19–20: un relato analítico moderno, no el manuscrito del autor {cite:djebbar-ibn-munim-combinatoire pp19–20}.

En nuestra notación, diez colores dan `1+2+...+9=45` pares y `C(10,3)=120` triples. Aquí `C(n,k)` selecciona `k` diferentes objetos de `n`, ignorando el orden. Agrupar casos por su elemento seleccionado más grande convierte un problema grande en sumas más pequeñas. No contar una selección dos veces es una condición de corrección, no solo un atajo.

Nuestro ejemplo moderno más pequeño elige dos cartas diferentes de cinco de diez maneras. Distingue la primera posición de la segunda y hay veinte: dos posiciones para cada par. Permite cartas repetidas en dos posiciones ordenadas y hay veinticinco cartas y cinco. Ignora el orden pero permite la repetición y hay quince. Respuestas diferentes no tienen por qué significar aritmética errónea; la pregunta cambió.

Una explicación moderna divide las selecciones según si se incluye la carta final. Esto da `C(n,k)=C(n-1,k)+C(n-1,k-1)`, con `C(n,0)=1` y `C(n,n)=1`. Nuestra convención cuenta una selección vacía, aunque el problema del tuft comienza con un solo color. No atribuimos esa afirmación de límite a una línea original no leída.

La recurrencia construye la fila `1,5,10,10,5,1` para cinco y `1,10,45,120,210,252,210,120,45,10,1` para diez. Esta última suma 1024, dando 1023 selecciones no vacías. Las comprobamos de forma independiente mediante enumeración y recurrencia. No son una fotografía de la tabla original ni una prueba de que el autor identificó cada entrada con un coeficiente binomial.

La repetición necesita otra distinción. Las letras A, A, B dan tres cadenas distintas, no seis; intercambiar copias idénticas A no crea escritura nueva. El proyecto lingüístico añade signos y restricciones de pronunciación. Multiplicar todo por cuatro por letra falla si el modelo excluye algunos estados. Djebbar describe repetición, razonamiento recursivo y tablas, no software que conoce el significado léxico {cite:djebbar-ibn-munim-combinatoire pp11–13}.

## La propagación

Al-Naqr informa del uso de Ibn al-Banna, Ibn Haydur e Ibn Zakariyya al-Gharnati, y cita a Ibn Khaldun sobre las fuentes de Raf al-Hijab. Estos son informes de recepción a partir de artículos leídos, no nuestra lectura de cada texto o copia posterior de censos. Djebbar distingue la enseñanza que preserva resultados a partir de la evidencia que reconoce explícitamente el razonamiento combinatorio como una herramienta independiente {cite:arrabita-ibn-munim-naqr section2} {cite:djebbar-ibn-munim-combinatoire pp12–13}.

El parecido no traza una ruta directa hacia Pascal o Mersenne. Djebbar compara los procedimientos con trabajos posteriores; la comparación no es un registro particular de transmisión. Nuestra imagen moderna utiliza un nombre triangular familiar. Su título no convierte al ilustrador en una autoridad sobre Ibn Munim ni resuelve prioridad universal ni robo intelectual. Cada ruta histórica necesita su propia evidencia.

## Sobre qué se construyó

La visión general del libro identifica los Elementos de Euclides y parte del Istikmal de al-Mutaman como lectura preparatoria, junto con el análisis y la síntesis en demostraciones. Esto no convierte a todos los argumentos combinatorios en una copia de la geometría. Djebbar identifica el razonamiento inductivo y combinatorio junto con las herramientas expositivas declaradas: un análisis de historiador, claramente atribuido {cite:arrabita-fiqh-hisab book introduction} {cite:djebbar-ibn-munim-combinatoire pp12–13}.

Los colores y las letras son modelos diferentes que comparten reglas de conteo seleccionadas. La transferencia funciona cuando sobreviven las condiciones de distinción, orden y repetición, no porque un color y una letra sean cosas idénticas. Djebbar ve una vía hacia una abstracción más amplia sin un modelo explícitamente único que reduzca todos los problemas de conteo a una estructura general en esta etapa {cite:djebbar-ibn-munim-combinatoire pp11–12}.

## Lo que se construyó sobre ello

Se informa de una recepción posterior del Maghrib, pero no ningún programa informático o de lenguaje es descendiente directo de este libro. La comparación educativa no requiere genealogía inventada. Una lista vacía de dependientes directos significa que aquí no se establecen enlaces particulares de invenciones, no es que la obra careciera de influencia o que los estudiantes no aprendieran nada {cite:arrabita-ibn-munim-naqr sections2,5}.

Djebbar subraya que poseer el triángulo no establece el reconocimiento de su interpretación de coeficientes binomiales. De hecho, cuestiona la ausencia de ese vínculo en la sección de extracción de raíces. No podemos completar un resultado histórico no expresado porque ahora parece fácil. Lo que sigue matemáticamente y lo que una persona ha declarado demostrablemente son preguntas separadas {cite:djebbar-ibn-munim-combinatoire pp10–11}.

## Impacto en la vida diaria

Los colores de la seda hacen visible la selección, no es evidencia de que una fábrica utilizara una sola mesa o de que Ibn Munim inventara el tejido. Los mechones sirven para un modelo excluyendo la posición de la selección. Las tarjetas de papel explican el problema sin manipular hilos históricos ni fabricar un producto. No disponemos de un volumen comercial medido ni de un ahorro de tiempo atribuible a estas reglas {cite:djebbar-ibn-munim-combinatoire pp19–23}.

La historia docente es más clara que una afirmación económica sin fundamento: se añadieron tablas y ejemplos después de que los alumnos recibieran ejemplares. Djebbar lee una exposición que responde a las necesidades educativas. Esto no establece ni los planes de estudio modernos, ni los exámenes estandarizados ni un tamaño de clase determinado, pero mantiene presentes a los alumnos en lugar de reducir el conocimiento a un héroe solitario {cite:djebbar-ibn-munim-combinatoire p12}.

## Cómo cambió la historia

La importancia reside en organizar y explicar problemas más allá de un solo ejemplo, no en un enorme supuesto recuento de todas las lenguas humanas. Djebbar muestra cuestiones lingüísticas que abren resultados más amplios, con los límites de la abstracción contemporánea. Esto es un desarrollo metodológico limitado, no que el museo adopte amplias afirmaciones celebratorias de que una civilización superó universalmente a otras {cite:djebbar-ibn-munim-combinatoire pp9–13}.

La historia de la investigación también muestra cambios en el conocimiento: un informe anterior extrajo pistas de la dedicación; una biografía posterior añadió información de una fuente más antigua. La nueva evidencia amplía el panorama en lugar de hacer que el conocimiento limitado anterior sea deshonesto. Autor, copista, editor e historiador son roles distintos. Descubrir un manuscrito en tiempos modernos no fecha la invención de sus reglas.

## ¿Quién lo inventó?

La atribución se basa en la sección descrita de Fiqh al-hisab. Al-Khalil la precede en el conteo lingüístico y al-Karaji en la construcción de triángulos algebraicos. La evaluación combinatoria más antigua conocida de Djebbar está matizada por su conocimiento y el tipo de construcción, no por una afirmación del primer triángulo aritmético de la historia. La "mejora" no debe convertirse en origen absoluto para un titular más estruendoso {cite:djebbar-ibn-munim-combinatoire pp10–11}.

El matemático permanece separado de su homónimo siciliano y de personas del museo con nombres similares. El cuidado de la identidad impide transferir libros, fechas o religiones entre individuos. Se sugiere la composición de 1207–1212; 1551 una copia reportada; 2005 una edición moderna. Sustituir una por otra cambia la afirmación, incluso cuando todas aparecen en la historia del mismo libro {cite:arrabita-ibn-munim-naqr sections1–4} {cite:arrabita-fiqh-hisab manuscript and edition}.

## Hoy

Los programas actuales pueden comprobar casos pequeños mediante enumeración y recurrencia. Esa es nuestra verificación moderna, no el programa de Ibn Munim. Cuenta independientemente pares ordenados y luego divide por dos para dos objetos diferentes: cinco da diez. Pero A,A no es un par de objetos diferentes; transferir la misma división a otro caso sin cambiar las hipótesis rompe el razonamiento.

La imagen CC0 de Rohieb de 2016 tiene ocho filas indexadas del cero al siete. Los dígitos modernos y la disposición triangular no representan Fiqh al-hisab ni mechones de seda. La última fila es 1,7,21,35,35,21,7,1. Las relaciones también se explican en texto: los lectores no necesitan extraerlas únicamente de una imagen {cite:commons-pascal-small-rohieb Description and licence}.

## Ejemplos supervivientes

Arrabita describe una copia de la colección 416, páginas 214–419, copiada en Túnez por Hasan al-Rabai en 958 H/1551, encontrada por Idriss Lamrabet en 1981 y editada en 2005. Estos detalles se encuentran a través del artículo, no mediante una inspección directa. Su única declaración de copia conocida en el contexto de la edición no es un censo mundial de bibliotecas {cite:arrabita-fiqh-hisab manuscript and edition} actual.

Leímos partes seleccionadas del estudio de Djebbar e inspeccionamos 19–20 páginas impresas, no las 131 páginas en total ni su reproducción en árabe. Los símbolos editoriales modernos no son necesariamente cartas manuscritas. Separar capas permite a los lectores evaluar qué establece una imagen, un análisis secundario o un texto desconocido. Un archivo descargable no es permiso para incluir el libro fuente en Git.

## En la cultura

El idioma, la enseñanza y la aritmética se encuentran con la biografía de un médico-profesor. Al-Naqr relata un relato antiguo de Ibn Munim revisando mentalmente a Euclides hacia atrás antes de dormir. Se trata de una anécdota atribuída, no de una rutina observada ni de una prueba de inteligencia. El elogio médico en esa biografía no es ni una receta de tratamiento ni evidencia moderna de eficacia {cite:arrabita-ibn-munim-naqr sections3–4}.

Fiqh al-hisab se refiere aquí al conocimiento del cálculo, no a convertir cada resultado en una sentencia religiosa. El elogio político de la dedicación es retórica histórica con un propósito. La conservamos sin repetir juicios sobre los opositores en voz del museo ni hacer que el patrocinio establezca la verdad de una demostración matemática {cite:djebbar-ibn-munim-combinatoire pp5–9}.

## Para lectores jóvenes

Usa cinco cartas con símbolos diferentes, no solo color, por lo que la discriminación de color no es necesaria. Enumera cada par una vez. Si la izquierda y la derecha se intercambian, ¿debería contar de nuevo? Escribe la regla antes de contar. Esto explora la selección versus el orden sin hilos, herramientas ni artefactos originales.

Luego permite el mismo símbolo dos veces y pregunta por qué cambia la respuesta. Un adulto puede comparar la lista con un pequeño triángulo mientras explica que es moderna, no la caligrafía de Ibn Munim. La cuestión central es qué cuenta como idéntico o diferente. Un número correcto responde a supuestos explícitos; no es un adorno largo para memorizar sin entender.

## Referencias

- {cite:djebbar-ibn-munim-combinatoire selected pp5–13,19–23}
- {cite:arrabita-ibn-munim-naqr sections1–5}
- {cite:arrabita-fiqh-hisab book manuscript and methods}
- {cite:commons-pascal-small-rohieb Description licence and image}
