---
id: invention/ibn-al-haytham-fourth-power-volumes
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/ibn-al-haytham-fourth-power-volumes.md}
---
## Resumen

¿Cómo podemos medir un volumen cuyo límite no es ni una caja ni un cilindro? [[person/ibn-al-haytham|El método de Ibn al-Haytham]] conecta sumas de cuartas potencias con la captura de un sólido curvo entre cantidades calculables. En este problema, su volumen es de ocho quinceas partes de su cilindro circundante {cite:katz-calculus-islam-india-1995 pp.165–168}. Esto no fue la invención de todo cálculo, ni la primera medición de cada paraboloide. Fue una extensión particular del cálculo geométrico a un problema que requería cuartas potencias, acompañada de una demostración en lugar de meramente la impresión de que las capas delgadas se asemejan a la forma {cite:bressoud-calculus-before-newton-i pp.2–4}.

## Qué es

La contribución es un método de cálculo y demostración, no una máquina superviviente. Una cuarta potencia multiplica un número por sí misma cuatro veces: dos a la cuarta es dieciséis. Sumar cuartas potencias consecutivas difiere de elevar la suma de esos números a la cuarta potencia {cite:dennis-addington-alhazen-summation-2009 pp.2–4}. La geometría requiere tanto una explicación de por qué cuadrar el radio de la sección introduce las cuartas potencias, como una forma de calcular su suma sin enumerar infinitamente muchas capas {cite:katz-calculus-islam-india-1995 pp.167–168}.

El sólido no es el cuenco paraboloide ordinario obtenido al girar una parábola sobre su propio eje. Aquí el eje de rotación es perpendicular al eje de la parábola y se sitúa en el límite de la región especificada {cite:bressoud-calculus-before-newton-i pp.2–3}. Por tanto, la proporción 8/15 no se aplica a todos los cuencos o cúpulas llamadas parabólicas. Nuestra imagen comparativa muestra el sólido axial ordinario anterior, no la nueva cúpula.

## El mundo que tenía delante

Los problemas de área y volumen precedieron durante mucho tiempo a Ibn al-Haytham. Katz discute la suma de cuadrados de Arquímedes y la fórmula de Aryabhata para cubos; su uso en un argumento posterior no convierte estos resultados anteriores en nuevas invenciones {cite:katz-calculus-islam-india-1995 p.165}. Los resultados geométricos solían expresarse como proporciones a formas conocidas, en lugar de fórmulas modernas simbólicas de volumen {cite:dennis-addington-alhazen-summation-2009 pp.4–5}.

Bressoud distingue el sólido axial de Arquímedes, con la mitad del volumen del cilindro correspondiente, de los precedentes de Thabit ibn Qurra y Abu Sahl al-Kuhi en la obra científica árabe {cite:bressoud-calculus-before-newton-i p.2}. Thabit permanece en esta versión: la regla de selección del creador del examinador no debe borrar a las personas cuyo trabajo precedió la contribución. El trabajo anterior no elimina la mejora, y la mejora no reduce a matemáticos anteriores a nombres incidentales.

## La historia

Katz sitúa la obra de suma en el Egipto del siglo XI y conecta al erudito de [[place/basra|Basora]] con su vida egipcia. TDV proporciona detalles biográficos mientras informa de diferencias en los relatos de su muerte {cite:katz-calculus-islam-india-1995 pp.165–166} {cite:tdv-ibnul-heysem pp.82–87}. Utilizamos [[place/cairo|El Cairo]] como contexto biográfico, no como evidencia de una sala concreta donde se escribió este tratado. La fecha general de actividad en siglo no es una fecha precisa de invención o composición.

Las fuentes matemáticas que realmente se leen aquí son explicaciones académicas modernas. Saber dónde está listada una edición o traducción no equivale a leer el tratado original. Los detalles del cálculo dependen de Katz y Bressoud; no afirmamos ni la ordenación independiente de manuscritos árabes ni la lectura de todas las ediciones de sus bibliografías {cite:katz-calculus-islam-india-1995 pp.166–168,174}.

## El(los) creador(es)

El registro de la persona conserva una base musulmá individualizada: la apertura en su nombre en la *Óptica* y el relato de TDV sobre sus escritos defendiendo la profecía y debatiendo cuestiones teológicas. Ni su nombre ni la denominación del estado anfitrión proporcionan esa identidad {cite:manazir-sabra-1983 scan-p.60} {cite:tdv-ibnul-heysem pp.82–87}. El marco suní es el marco declarado del museo, no la documentación de una escuela jurídica personal. El patrocinio fatimí no determina automáticamente su afiliación.

**Marco declarado suní:** atribuye la contribución limitada manteniendo la evidencia de identidad y sus límites {cite:tdv-ibnul-heysem pp.82–87}. **Relato académico:** Katz distingue los ejemplos del autor de la reconstrucción moderna; Bressoud no encuentra explícitamente evidencia de que haya ido más allá de las cuartas potencias, aunque el método puede ampliarse {cite:katz-calculus-islam-india-1995 pp.166–167} {cite:bressoud-calculus-before-newton-iii pp.2–3}. Esto es matemáticamente distinto de los [[invention/camera-obscura|experimentos existentes en cuarto]] oscuro, no otro recuento de ese experimento.

## Cómo funciona

Usamos notación docente moderna, no una reproducción de los símbolos del autor. Para longitudes positivas `a,b`, toma la parábola `x=a(y/b)^2` y la región entre ella y `x=a`, con `0≤y≤b`. Gira esta región alrededor de `x=a`. La sección horizontal tiene un radio `r(y)=a(1−(y/b)^2)`, que cae desde `a` en la base hasta cero en la cima {cite:bressoud-calculus-before-newton-i pp.2–3} {cite:katz-calculus-islam-india-1995 p.168}. La rotación alrededor del otro eje produce un sólido diferente, no otra vista del mismo volumen.

Divide la altura en `n` intervalos iguales, cada uno `b/n` de grosor. El área de un disco depende del cuadrado de su radio. Cuadrar una expresión de radio que contiene `y²` introduce `y⁴`; no está involucrada ninguna cuarta dimensión espacial {cite:dennis-addington-alhazen-summation-2009 p.1}. Un disco interior a altura `ib/n` contribuye `πa²b/n × (1−i²/n²)²`. Expandir el corchete como `1−2i²/n²+i⁴/n⁴` explica por qué deben sumarse tanto los cuadrados como las cuartas potencias {cite:katz-calculus-islam-india-1995 p.168}.

En notación moderna, la fórmula de cuarta potencia es `S4(n)=n^5/5+n^4/2+n^3/3−n/30`, equivalentemente `n(n+1)(2n+1)(3n²+3n−1)/30` {cite:katz-calculus-islam-india-1995 p.167}. Por ejemplo, `1+16+81+256=354`. Eso verifica un caso pequeño; no es una prueba de que la fórmula funcione para cada entero positivo.

Una reordenación de suma finita explica la derivación. Escriba `Sk` para una suma de potencias k-ésimas. Entonces `(n+1)S3(n)=S4(n)+ΣS3(j)`, para `j=1,...,n`. Sustituir la fórmula de suma cúbica obtiene el lado derecho `5S4/4+S3/2+S2/4`. En consecuencia `S4=4(n+1/2)S3/5−S2/5`; sustituir las fórmulas conocidas del cuadrado y del cubo para terminar {cite:bressoud-calculus-before-newton-iii pp.2–3} {cite:katz-calculus-islam-india-1995 pp.166–167}. Esta es una reconstrucción moderna comprobable. Katz especifica que la derivación del autor ilustra `n=4` y afirma el resultado general. La presentación moderna de Katz no debe convertirse en un supuesto texto medieval literal.

Tras la sustitución, la suma interna del disco dividida por el volumen del cilindro `πa²b` es `L(n)=8/15−1/(2n)−1/(30n^4)`. La suma exterior es `U(n)=L(n)+1/n`. Estas definiciones de enseñanza encierran cada capa real entre un disco más pequeño y uno más grande; su diferencia total es `1/n` del cilindro y puede hacerse tan pequeña como se requiera. En `n=4`, `L=0.408203125` y `U=0.658203125`, encerrando `8/15` {cite:katz-calculus-islam-india-1995 p.168}.

Esos números son nuestro ejemplo, no mediciones históricas. Supongamos que el volumen real difiere de `8πa²b/15`. Haz que el hueco que lo rodea sea menor que esa supuesta diferencia y obtén una contradicción con la contención geométrica: esta es una explicación moderna del argumento agotamiento/doble reductio que describe Katz {cite:katz-calculus-islam-india-1995 p.168}. No existe un disco final de espesor cero, y la convergencia no se demuestra dibujando muchas capas. Para nuestras propias longitudes `a=2,b=3`, el volumen es `32π/5` unidades cúbicas; las unidades de longitud deben coincidir.

Nuestra reconstrucción asume un número entero positivo de divisiones y un radio positivo de altura/base. La altura cero no deja intervalo para dividir; el radio cero colapsa el sólido. Estos casos degenerados no deben ocultarse mediante división por cero. Aumentar el número de divisiones no incrementa la altura del objeto: el grosor y el conteo del disco cambian mientras ambas longitudes permanecen fijas. Los modelos de disco distinguen cambiar una aproximación de cambiar lo que se mide {cite:bressoud-calculus-before-newton-i p.3} {cite:katz-calculus-islam-india-1995 p.168}.

La comprobación dimensional de forma independiente ayuda a detectar una fórmula mal transcrita. El volumen necesita longitud cúbica, consistente con `a²b`, no con el factor de área `ab`. La relación con el cilindro es adimensional porque ambas magnitudes tienen el mismo tipo de unidad. Duplicar todas las longitudes multiplica el volumen por ocho manteniendo la proporción. Esta es una consecuencia didáctica de la fórmula mostrada, no un experimento reportado realizado por el académico {cite:katz-calculus-islam-india-1995 p.168}.

## La propagación

Katz menciona la fórmula de la cuarta potencia en obras posteriores de Ibn Haydur, Ibn Ghazi y al-Kashi, pero presenta la transmisión hacia Europa como una cuestión de investigación manuscrita en lugar de una cadena completa de maestro a alumno {cite:katz-calculus-islam-india-1995 pp.168,174}. La presencia de una fórmula en un libro posterior no establece por sí sola la ruta por la que llegó. Tampoco demuestra la circulación latina documentada de la *Óptica* que cada resultado matemático separado circulara con ella {cite:katz-calculus-islam-india-1995 p.166}.

## Sobre qué se construyó

El cálculo utiliza sumas de potencia más simples, área circular y cantidades que engloban/inscrien. Dennis y Addington utilizan rectángulos y tiras para explicar la reorganización y la coordinación de la representación numérica con la geometría {cite:dennis-addington-alhazen-summation-2009 pp.1–4}. Esto no requiere asumir que Ibn al-Haytham leyó directamente el texto particular de Arquímedes sobre el sólido. Bressoud distingue la geometría heredada de las demostraciones desarrolladas en contextos científicos árabes {cite:bressoud-calculus-before-newton-i p.2}.

## Lo que se construyó sobre ello

**Suní—frontera de atribución:** establecer esta contribución no requiere asignar cada desarrollo matemático posterior a su creador {cite:tdv-ibnul-heysem pp.82–87}. **Relato académico:** Katz explica cómo la estructura aritmética puede generalizarse separando lo que podemos extraer hoy de lo que afirmó el estudioso; Las rutas europeas siguen siendo una cuestión de investigación en su relato {cite:katz-calculus-islam-india-1995 pp.166–167,174}. Por tanto, nuestro diagrama genérico no fabrica un vínculo directo con un programa de diseño designado o una cúpula histórica.

## Impacto en la vida diaria

Los pasajes leídos no documentan un taller que fabrica tanques según esta proporción, ni cuantifican ahorros de dinero o materiales. El logro documentado es matemático: encontrar un volumen exacto mediante cálculo y contención en lugar de estimar un límite curvo {cite:katz-calculus-islam-india-1995 pp.167–168}. Los visitantes pueden probar capas de papel, pero la precisión del corte y el grosor del papel pertenecen a un experimento moderno, no a la prueba histórica. La fotografía de un modelo no es evidencia de su antigüedad ni de su corrección matemática.

## Cómo cambió la historia

Este método muestra una historia de volumen e integración distribuida a lo largo de problemas y períodos, ni un solo momento de invención. Bressoud utiliza la dificultad de ir más allá de la geometría cuadrada/cubica para explicar el conocimiento previo a las fórmulas de escuela rápida {cite:bressoud-calculus-before-newton-i pp.1–4}. El número y la forma se limitan mutuamente: una fórmula de suma es insuficiente a menos que los discos encierren el sólido correcto, y un dibujo es insuficiente sin calcular su suma. Esa relación convierte al método en algo más que una curiosidad numérica.

## ¿Quién lo inventó?

La atribución es una extensión de los métodos de volumen utilizando cuartas potencias, no la invención de la suma, la primera cúpula o el Teorema Fundamental del Cálculo {cite:katz-calculus-islam-india-1995 pp.165–168,174}. **Suní:** el marco declarado no es evidencia de prioridad científica {cite:tdv-ibnul-heysem pp.82–87}. **Relato académico:** conservar lo que respaldan las explicaciones leídas y distinguir el argumento del autor de la reconstrucción moderna. No leer de forma independiente el original árabe es una limitación de la fuente, no un permiso para proporcionarlo de memoria {cite:katz-calculus-islam-india-1995 pp.166–168}.

## Hoy

El ejemplo enseña la diferencia entre una suma finita y un volumen exacto, y entre verificación numérica y demostración. El diagrama moderno de Steven Baltakatei Sandoval muestra el cuenco axial ordinario con diámetro y altura: es una comparación con el problema anterior, no una imagen de la cúpula 8/15 {cite:commons-paraboloid-dh image and licensing}. Cambiar mentalmente el eje de rotación cambia el objeto en sí, no solo el ángulo de cámara.

## Ejemplos supervivientes

Nuestros testigos inspeccionados son el papel moderno, que incluye 167–168 imágenes impresas, y la exposición de Bressoud—no un manuscrito autógrafo {cite:katz-calculus-islam-india-1995 pp.167–168} {cite:bressoud-calculus-before-newton-i pp.2–4}. Katz se refiere al estudio de Rashed sobre el paraboloide; es decir, es una pista de investigación, no un permiso para citar páginas no leídas {cite:katz-calculus-islam-india-1995 p.174}. La ilustración licenciada no es ni un instrumento histórico ni una hoja medieval recién descubierta.

## En la cultura

El ejemplo ayuda a contar matemáticas a través de personas nombradas, preguntas y mediadores, en lugar de afirmar que una sola civilización lo creó todo. Matemáticos de uso griego, indio y árabe aparecen con problemas y períodos diferentes en estos relatos {cite:bressoud-calculus-before-newton-i pp.1–4} {cite:katz-calculus-islam-india-1995 pp.165–168}. No todas las cúpulas visibles llevan la firma matemática de Ibn al-Haytham: el parecido no especifica exactamente una curva ni prueba que su constructor utilizara esta fórmula.

## Para lectores jóvenes

Imagina una torre de discos estrechándose hacia arriba. Una torre estrecha permanece dentro de una forma curva; una más ancha la cubre. Las capas más delgadas reducen la diferencia. Esto introduce la idea de delimitación detrás del cálculo {cite:katz-calculus-islam-india-1995 p.168}. Pregunta siempre qué región está girando y alrededor de qué línea. Luego prueba con números, recordando que cuatro capas exitosas no pueden por sí solas demostrar qué ocurre con cada número de capas.

## Referencias

- Katz1995, seleccionó 163–168.174 lecturas; 167–168 imágenes verificadas. No el artículo completo ni el tratado original en árabe {cite:katz-calculus-islam-india-1995 selected passages}.
- Bressoud I1–4 y III1–3, artículos reales en lugar de resúmenes de IA de plataformas {cite:bressoud-calculus-before-newton-i pp.1–4} {cite:bressoud-calculus-before-newton-iii pp.1–3}.
- Dennis/Addington señala, base de identidad individualizada existente y metadatos de imagen modernos {cite:dennis-addington-alhazen-summation-2009 pp.1–5} {cite:manazir-sabra-1983 scan-p.60} {cite:tdv-ibnul-heysem pp.82–87} {cite:commons-paraboloid-dh licensing}.
