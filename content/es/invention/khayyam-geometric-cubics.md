---
id: invention/khayyam-geometric-cubics
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/khayyam-geometric-cubics.md}
---
## Resumen

[[person/umar-khayyam|Umar Khayyam]] no inició álgebra desde la nada ni proporcionó la fórmula radical general ahora asociada a las ecuaciones cúbicas: su aportación aquí es un tratamiento geométrico sistemático de catorce formas cúbicas irreducibles bajo convenciones de coeficientes positivos {cite:sep-umar-khayyam sec.4.1}. Un problema se convierte en elegir dos curvas, construir su intersección y demostrar que una longitud obtenida de ella cumple el requisito {cite:khayyam-woepcke-1851 pp.32–34}. Presentamos una mejora metodológica con predecesores y límites, no una competición que haga desaparecer a todos los que están antes y después de él.

## Qué es

Un problema cúbico contiene el cubo de una incógnita, quizá junto a su cuadrado, un término lineal o un número conocido; Khayyam distingue las formas según los términos presentes y el lado en el que aparecen, trabajando con magnitudes positivas {cite:sep-umar-khayyam sec.4.1}. Catorce formas no significan catorce sujetos no relacionados: la clasificación encaja en el lenguaje y las convenciones del álgebra geométrica, en lugar de en una lista moderna de todas las posibles combinaciones de signos {cite:sep-umar-khayyam sec.4.1}.

Las curvas relevantes incluyen círculos, parábolas e hipérboles, siendo la intersección de dos determinando la longitud requerida; el círculo no es una decoración junto a una ecuación resuelta de forma independiente {cite:sep-umar-khayyam sec.4.1}. Una solución geométrica es una construcción con demostración, mientras que una solución radical proporciona una expresión algebraica que implica operaciones como raíces cuadradas y cúbicas. Compartir una respuesta numérica no convierte estas en el mismo tipo de solución.

## El mundo que tenía delante

Los tratamientos geométricos de la cuadrática pertenecían a tradiciones más antiguas; Stanford sitúa a Khayyam según obras griegas y babilónicas y según al-Khwarizmi y Thabit ibn Qurra, por lo que conectar una magnitud desconocida con una figura geométrica no fue su invención solitaria {cite:sep-umar-khayyam sec.4.1}. Thabit pertenece a la historia predecesora: ni lo reclasificamos como un creador musulmán para cumplir los criterios del lector ni lo borramos de la historia.

Para los cúbicos, la entrada menciona la reducción de un problema arquimediano a una ecuación por parte de al-Mahani, la solución cónica de un caso particular por al-Khazin y el tratamiento no exhaustivo de al-Layth; informa que el propio Khayyam conocía soluciones anteriores de cuatro casos {cite:sep-umar-khayyam sec.4.1}. La diferencia entre un caso particular y una clasificación más amplia identifica la contribución, más que la afirmación de que nadie se había encontrado previamente con un cúbico. Estos nombres no establecen una cadena personal profesor-alumno.

## La historia

MacTutor asocia el traslado de Khayyam a [[place/samarqand|Samarcanda]] en 1070 con el apoyo de Abu Tahir y el tratado de álgebra; utilizamos esto como contexto aproximado de composición, no como un día de primer descubrimiento o construcción {cite:khayyam-mactutor Samarkand and algebra}. La organización por tipo de ecuación permitió una pregunta más allá de un único ejemplo: ¿qué ocurre cuando cambia la combinación de términos y puede una intersección proporcionar la magnitud requerida? Su tratamiento sistemático hace visible esa cuestión más amplia {cite:sep-umar-khayyam sec.4.1}.

Stanford también describe un problema geométrico temprano que implicaba la división de un cuadrante, conduciendo en notación moderna a una cúbica tratada con un círculo y una hipérbola; ese problema no debe confundirse con el caso círculo/parábola explicado más abajo {cite:sep-umar-khayyam sec.4.1}. Diferentes pares de curvas forman parte del método, no una inconsistencia que oculte tras un diagrama atractivo. Un marcador de ciudad no establece la sala exacta ni la superficie de escritura utilizada.

## El(los) creador(es)

Khayyam fue matemático, astrónomo y filósofo también asociado a la imagen del poeta; Stanford distingue su voz filosófica de la imagen poética y describe explícitamente la primera como la de un filósofo musulmán {cite:sep-umar-khayyam sec.2.7}. Esto proporciona la base de identidad individual, más que su nombre o la corte del mecenas. Se declara que el marco suní del museo no es prueba documental de su escuela jurídica personal.

**Suní — marco declarado:** Presentamos la obra en su entorno selyúcida documentado, distinguiendo la regla de encuadre del museo de una declaración personal que la referencia no proporciona {cite:khayyam-mactutor life}. **Interpretación académica:** Stanford analiza la tensión aparente entre obras filosóficas e imagen poética sin equipararlas automáticamente {cite:sep-umar-khayyam sec.2.7}. **Crítica reportada:** Unat recoge la clasificación hostil de Najm al-Din Daya junto con relatos favorables; atribuimos ese juicio a través de la referencia realmente leída, sin veredicto del museo {cite:tdv-omer-hayyam-unat pp.66–68}.

## Cómo funciona

Tomemos un caso de la traducción francesa, en el que un cubo y términos lineales son igual a un número, y explícalo en notación moderna, no en letras que se afirman que son propias {cite:khayyam-woepcke-1851 pp.32–34}. Sea `x³ + a²x = b`, con positivo `a` y `b`. Elige la parábola `x² = ay` y un círculo con diámetro horizontal `b/a²`, escrito `y² = x(b/a² − x)`. Esto es una reescritura didáctica de un caso de intersección, no una receta para las catorce formas {cite:khayyam-woepcke-1851 pp.32–34} {cite:commons-khayyam-cubic-kuiper description}.

Sustituir por `y` da `x⁴/a² = xb/a² − x²`, por tanto `x(x³ + a²x − b) = 0`. El cuidado es esencial: el origen se encuentra en ambas curvas pero no resuelve la cúbica original cuando `b` es positivo. Elegimos la intersección positiva, no nula; al dividir `x` entonces se muestra que su coordenada horizontal cumple el requisito. Esta es una condición matemática, no un detalle visual opcional.

Para un ejemplo moderno elegido aquí para la enseñanza, no números reclamados del texto de Khayyam, conjunto `a=2`, `b=16`: el cúbico es `x³+4x=16`, la parábola `y=x²/2`, y el círculo tiene centro `(2,0)` y radio2. Ambos pasan por `(2,2)`, dando la longitud horizontal `x=2`; la verificación es directa: `8+8=16`. El texto traducido demuestra en cambio el resultado con longitudes y proporciones: la página 33 nombra las proyecciones parábola, semicírculo y perpendicular, no este ejemplo numérico moderno {cite:khayyam-woepcke-1851 pp.32–34}.

Este ejemplo no demuestra que el tratamiento de Khayyam abarcaba todo lo que ahora se sabe sobre las raíces: MacTutor y Stanford explican límites en su manejo de múltiples soluciones positivas, y las longitudes geométricas positivas no son una teoría de números complejos {cite:khayyam-mactutor algebra} {cite:sep-umar-khayyam sec.4.1}. Preservamos tanto el logro de la construcción como sus límites en lugar de sacrificar cualquiera de ellos a favor de una historia más sencilla.

## La propagación

La edición de Woepcke de 1851 ofrece texto árabe y una traducción francesa, y referencias modernas nombran otras ediciones y estudios; la lectura principal para este registro es específicamente francés32–34, no la inspección de cada manuscrito y edición de una bibliografía {cite:khayyam-woepcke-1851 edition and pp.32–34} {cite:tdv-omer-hayyam-unat bibliography}. Saber que existe una ruta hacia el texto no es lo mismo que afirmar haber seguido todas las rutas.

Stanford contrasta las soluciones geométricas con métodos radicales asociados con del Ferro, Tartaglia y Cardano en el siglo XVI; esta página no infiere una cadena de transmisión personal desde Khayyam a cada uno de ellos {cite:sep-umar-khayyam sec.4.1}. La precedencia cronológica difiere de la evidencia de que una copia llegó, fue leída o informó directamente una técnica, por lo que no se inventan inventos dependientes confirmados para llenar un gráfico.

## Sobre qué se construyó

La obra se basa en la construcción cónica, el razonamiento proporcional y una historia de convertir magnitudes algebraicas en problemas geométricos; Stanford nombra predecesores que no pueden ser eliminados para que el autor parezca solo {cite:sep-umar-khayyam sec.4.1} {cite:khayyam-woepcke-1851 pp.32–34}. La página 33 no se limita a observar que dos curvas parecen correctas: conecta una longitud al cuadrado con un producto de longitudes y sigue una secuencia de proporciones {cite:khayyam-woepcke-1851 p.33}.

Por tanto, nuestra cadena de enseñanza genérica va desde problemas heredados hasta el tratamiento sistemático. Su flecha no es un juicio sobre la fe de un predecesor, ni una prueba de instrucción personal, ni una afirmación de que cada trabajo matemático anterior causó directamente este.

## Lo que se construyó sobre ello

El tratamiento proporciona un claro ejemplo histórico de soluciones cúbicas geométricas antes de una fórmula radical general; las referencias lo sitúan en la historia de las relaciones entre álgebra y geometría {cite:sep-umar-khayyam sec.4.1}. Eso no convierte toda la geometría analítica moderna en invención de Khayyam ni sitúa las coordenadas usadas en nuestra explicación en su manuscrito.

La comparación segura aquí plantea cómo la construcción de dos curvas y una demostración sobre longitudes se diferencian de una expresión algebraica para una solución. Atribuir un método europeo particular a su trabajo requeriría evidencia de transmisión no proporcionada por los pasajes leídos, por lo que no se registra ninguna dependencia técnica automática.

## Impacto en la vida diaria

El impacto demostrado en estas referencias es matemático y educativo: una familia de problemas cúbicos se convierte en un tema organizado de construcción, demostración y comparación más que en éxito con un solo ejemplo aislado {cite:sep-umar-khayyam sec.4.1}. Los pasajes leídos no proporcionan recuento alguno de comerciantes o constructores que usaron estos casos, ni ahorro monetario ni base para hacer de esta construcción la causa de la reforma calendaria de Khayyam.

Para el lector de hoy, el ejemplo distingue un dibujo que sugiere una respuesta de una demostración que la establece. Podemos notar una intersección, comprobarla mediante sustitución y descubrir que el origen engaña si se olvida la ecuación original. Ese es un uso educativo ofrecido aquí, no un censo histórico del impacto cotidiano.

## Cómo cambió la historia

Las referencias describen un avance más allá de casos dispersos hacia la clasificación y solución, reconociendo tanto el trabajo previo como el análisis incompleto de la multiplicidad de raíces {cite:sep-umar-khayyam sec.4.1} {cite:khayyam-mactutor algebra}. La historia muestra por qué la historia del álgebra no es simplemente un camino único en el que los símbolos sustituyen abruptamente a las formas: la geometría puede ser un método de investigación y demostración, no un preludio inmaduro a unas matemáticas válidas.

Las ediciones y estudios modernos sitúan esta obra al lado de los cuartetos más conocidos sin determinar la autenticidad de cada poema o anécdota biográfica; diferentes cuestiones requieren distintas pruebas {cite:tdv-omer-hayyam-unat pp.66–68} {cite:sep-umar-khayyam secs.2.7,4.1}. No resolvemos desacuerdos literarios con una demostración matemática ni validamos una construcción simplemente porque su autor sea famoso.

## ¿Quién lo inventó?

La atribución del registro es "mejora" y el papel de Khayyam "mejorador": las referencias atribuyen el tratamiento geométrico sistemático de catorce formas al nombrar los casos resueltos antes que él {cite:sep-umar-khayyam sec.4.1}. "Resolver ecuaciones cúbicas" por sí solo es demasiado impreciso: puede significar una aproximación numérica, una construcción geométrica, una fórmula radical o una explicación de todas las raíces.

Identificamos el tipo de trabajo y sus límites antes de responder a la pregunta prioritaria. La contribución sustentada es un tratamiento sistemático en un libro, no el primer encuentro con ninguna cúbica ni con la invención de álgebra, círculos o parábolas. Las fórmulas radicales europeas posteriores siguen siendo un tema distinto, no un nombre nuevo para exactamente la misma solución {cite:sep-umar-khayyam sec.4.1}.

## Hoy

Los lectores pueden comparar el caso traducido con la imagen moderna y comprobar el ejemplo mediante aritmética sencilla; el diagrama publicado es de Pieter Kuiper, con corrección de color de Ruud Koot, bajo una dedicatoria de dominio público {cite:commons-khayyam-cubic-kuiper description and upload history}. Tiene una parábola azul, un círculo púrpura y un segmento rojo, no una página con la letra de Khayyam ni un instrumento arqueológico imaginario {cite:commons-khayyam-cubic-kuiper image}.

La notación moderna sirve para explicar mientras que la fecha y la ubicación del texto permanecen explícitas, por lo que la legibilidad no borra las diferencias en el lenguaje matemático. El valor educativo continuado también es distinto de afirmar que la construcción es el método práctico preferido para todo cálculo contemporáneo.

## Ejemplos supervivientes

El testigo específico leído es la traducción de Woepcke de 1851, en particular 32–34 y la construcción asociada a la figura 17; la imagen de la página 33 fue revisada en el lector público por su parábola y la redacción en semicírculo {cite:khayyam-woepcke-1851 pp.32–34}. Se trata de una inspección de un testigo traducido impreso, no de la identificación de un autógrafo ni de una recopilación independiente de todo el árabe.

El diagrama a color es testigo de la enseñanza moderna, fechada en 2011 en su historial de carga, no de la primera construcción del siglo XI {cite:commons-khayyam-cubic-kuiper upload history}. Mantener esa diferencia evita que la fecha de una imagen se confunda con la de una idea, o que todas las ilustraciones de museo se tomen como objeto de la época de su sujeto.

## En la cultura

La imagen poética de Khayyam se sitúa junto a su trabajo matemático y filosófico; Stanford analiza la relación entre voces atribuidas en lugar de reducir todas las obras a una sola imagen {cite:sep-umar-khayyam sec.2.7}. No reproducimos cuartetos traducidos y no utilizamos un poema disputado como testimonio concluyente de las creencias de su autor.

Una leyenda biográfica convierte a Khayyam, Nizam al-Mulk y Hasan-i Sabbah en compañeros de infancia en el colegio; MacTutor analiza las diferencias de edad que socavan su forma familiar {cite:khayyam-mactutor childhood legend}. El patronazgo político puede pertenecer a una biografía sin demostrar esa clase imaginada, razón por la cual se ha corregido la anterior abreviatura de mezclar amistad con reforma del calendario.

## Para lectores jóvenes

Imagina una pregunta sobre un número desconocido y luego dos formas encontrándose. Khayyam utilizó curvas para problemas cúbicos y las organizó después de investigadores anteriores {cite:sep-umar-khayyam sec.4.1}. Un dibujo hermoso no basta: debemos explicar por qué su intersección da la respuesta.

En nuestro ejemplo moderno2 se encuentra con `2³+4×2=16`. Cero no, aunque ambas curvas pasen por él. Esto enseña la diferencia entre ver y demostrar: volver a la pregunta original en lugar de elegir el primer punto observado. Aprender la historia de una idea no requiere atribuir a un solo erudito todo lo que se sabe antes y después de él.

## Referencias

- Woepcke1851, traducción de álgebra francesa 32–34, figura 17 construcción; página 33 revisada visualmente, sin colación árabe independiente. {cite:khayyam-woepcke-1851 pp.32–34}
- Stanford Encyclopedia, revisada en 2023, 2.7 y 4.1: identidad filosófica, clasificación, predecesores y límites. {cite:sep-umar-khayyam secs.2.7,4.1}
- Unat, TDV34(2007),66–68: sección científica, no la contribución literaria separada. {cite:tdv-omer-hayyam-unat pp.66–68}
- O'Connor y Robertson, MacTutor, actualización de julio de 1999: biografía, Samarcanda, límites algebraicos y leyenda de compañeros de escuela. {cite:khayyam-mactutor}
- Commons, diagrama de Kuiper/edición de color de Koot: historial de subidas y dedicación al PD. {cite:commons-khayyam-cubic-kuiper description and upload history}
