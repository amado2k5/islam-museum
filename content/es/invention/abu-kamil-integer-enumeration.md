---
id: invention/abu-kamil-integer-enumeration
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/abu-kamil-integer-enumeration.md}
---
## Resumen

Cengiz Aydin describe [[person/abu-kamil-shuja-ibn-aslam|a Abu]] Kamil investigando múltiples respuestas enteras en [[work/abu-kamil-taraif|su obra Cosas raras en el cálculo]], en lugar de detenerse en una sola solución. Los problemas se reducen a dos ecuaciones lineales con tres a cinco incógnitas. Esto es una contribución a la organización y enumeración de soluciones, no la invención de todos los rompecabezas de aves o ecuaciones numéricas {cite:tdv-abu-kamil work2}.

Difiere de su [[invention/abu-kamil-irrational-coefficients|álgebra de coeficientes irracionales]]. Aquí las cantidades pueden tener que ser números enteros porque cuentan aves completas, incluso cuando los precios son fracciones. Examinamos un modelo explícitamente moderno y distinguimos su recuento comprobado de los diferentes totales históricos reportados. La aritmética correcta de un museo no puede por sí sola autenticar una lectura manuscrita {cite:tdv-abu-kamil work2} {cite:proofwiki-abu-kamil-birds historical-note}.

## Qué es

Subdeterminado no significa no estar restringido. Más incógnitas que ecuaciones aún pueden dejar una colección finita de respuestas cuando las cantidades deben ser enteros positivos dentro de un total fijo. Aydin distingue entre buscar respuestas enteras y aceptar fracciones que satisfagan las ecuaciones, y describe el tratamiento algebraico de Abu Kamil como sistemático {cite:tdv-abu-kamil work2}.

Nuestro modelo de aves requiere tanto un número total como un coste total. Comprar 100 aves es insuficiente si su precio es incorrecto; gastar todo el presupuesto es insuficiente si se compran muy pocas aves. También debemos indicar si puede faltar un tipo. Permitir cero cambia la pregunta, no simplemente la tipografía de la respuesta.

## El mundo que tenía delante

Aydin analiza a Diofanto y los problemas indios asociados con la Aryabhata, distinguiendo la atención a las soluciones racionales de la búsqueda de todas las respuestas enteras. Estos precedentes descartan una historia en la que una sola persona inventara cada problema indeterminado. Llamar diofantino a los problemas no demuestra que un procedimiento particular provenga directamente de un libro concreto {cite:tdv-abu-kamil work2}.

MacTutor informa de los argumentos de Sisiano sobre el lugar de Abu Kamil entre los matemáticos árabes, incluyendo procedimientos ausentes en los libros conocidos de la Aritmética. Este es un argumento de historiador recogido a través de una biografía que leemos, no nuestra propia comparación de cada testigo. Las matizaciones sobre lo que sobrevive y lo que se sabe siguen formando parte de la afirmación prioritaria {cite:abu-kamil-mactutor rare-things}.

## La historia

Aydin separa el Taraif de un Libro de Pájaros catalogado cuyo contenido considera desconocido. No los fusionamos porque un problema contenga aves, o porque un resumen moderno use ese título. Tampoco hacemos que los problemas aritméticos sean idénticos a los del álgebra o del libro de medición; cada obra necesita su propia evidencia {cite:tdv-abu-kamil work2-and-conclusion}.

MacTutor enfatiza la escasez de información biográfica y da fechas aproximadas alrededor de 850 y 930. Por tanto, un horizonte de finales del siglo IX o principios del X es contexto, no una ceremonia de invención datada. La identidad de un autor egipcio no establece un mercado, taller o lugar de composición específico de El Cairo para cada problema {cite:abu-kamil-mactutor biography}.

## El(los) creador(es)

La base musulmana individual de Abu Kamil está registrada a partir de la descripción explícita de MacTutor; el marco suní del museo se declara por separado. Ni un problema indio similar ni el título de un libro aportan una nueva identificación sectaria personal. Este registro conserva la biografía existente y la contribución anterior en lugar de sustituirlas para ajustarlas a este tema {cite:abu-kamil-mactutor summary} {cite:tdv-abu-kamil biography}.

Aydin discute el conocimiento de los problemas indios manteniendo el desacuerdo sobre el conocimiento de los métodos, y menciona paralelismos y un comentarista anónimo. Un semejante o informe de comentario no es la admisión firmada por parte del autor de una ruta de transmisión precisa. Atribuimos el argumento sin decidir independencia o dependencia únicamente de un entorno de aves compartidas {cite:tdv-abu-kamil work2}.

## Cómo funciona

Esta es la ilustración moderna presentada en ProofWiki, no una tabla original que hemos inspeccionado: 100 pájaros por 100 monedas, con cinco precios unitarios2,1,1/2,1/3,1/4. Escribe sus cantidades como x,y,z,w,v. Luego x+y+z+w+v=100 y 2x+y+z/2+w/3+v/4=100. Estos símbolos y esta presentación son dispositivos didácticos modernos {cite:proofwiki-abu-kamil-birds prices}.

Multiplica la ecuación de costes por 12:24x+12y+6z+4w+3v=1200. Resta doce veces la ecuación de conteo para obtener 12x=6z+8w+9v; luego y=100−x−z−w−v. Enumera z,w,v dentro del total, aceptando una integral x y una y positiva. Esta es la forma independiente del museo de comprobar el modelo, no las líneas recuperadas del algoritmo histórico.

La tupla(4,90,1,3,2) funciona: su recuento es 100 y su coste8+90+1/2+1/2=100. Otra es (7,83,1,3,6). Su promedio (5,5,86,5,1,3,4) satisface ambas ecuaciones pero no supone una compra de aves enteras. Satisfacer las ecuaciones por sí solo no elimina el requisito entero.

Exigir cada tipo da 2678 soluciones positivas en nuestra enumeración; permitir cero da 3727 soluciones no negativas. Esta última incluye (0,100,0,0,0): solo la clase cuyo precio es 1. Estas son respuestas a preguntas con restricciones diferentes, no respuestas rivales a una sola pregunta. Estar de acuerdo con un total histórico reportado no certifica de forma independiente su origen manuscrito.

La ecuación reducida proporciona dos restricciones preliminares: v debe ser par, porque los demás términos son pares; w debe ser divisible por 3, considerando los restos módulo 3. Escribe w=3b y v=2c para obtener 2x=z+4b+3c, por lo que z+c también debe ser par. Estas son deducciones dentro de nuestro modelo, no reglas atribuidas a un manuscrito no leído. La divisibilidad sigue siendo insuficiente: también deben comprobarse el límite total y un y positivo.

## La propagación

Aydin informa de una traducción al hebreo asociada con Mordecai Finzi, que incluye un argumento a favor de un posible intermediario español en lugar de una traducción directa del árabe. También informa de un testigo latino a través de Suter. Estos son informes académicos atribuidos, no una cadena de transmisión recién establecida por nuestros manuscritos recopilatorios {cite:tdv-abu-kamil work2-translations}.

MacTutor analiza la recepción más amplia de la obra de Abu Kamil por parte de al-Karaji y Fibonacci. Esa recepción general no es una prueba automática de que esta tabla exacta de cinco precios viajó por una ruta determinada. Problemas o totales similares no identifican por sí solos qué testigo utilizó un lector; una afirmación más estrecha requiere evidencia más restrictiva {cite:abu-kamil-mactutor reception}.

## Sobre qué se construyó

Los ingredientes son ecuaciones lineales, cantidades enteras y precios que pueden ser fraccionarios. Media moneda no requiere medio pájaro: las cantidades que se cuentan deben ser enteros, no todos los coeficientes de la ecuación de costes. Aydin señala objetos sustituibles y personas, así como aves, y una tradición de problemas circulantes {cite:tdv-abu-kamil work2}.

Describe nombres verbales desconocidos como thing, dinar, fals y ring, con números escritos principalmente en palabras salvo tablas y algunas cifras. No convertimos esa explicación en una afirmación de que Abu Kamil utilizó notación moderna x,y, ni de que cada aparición de una palabra monetaria denote necesariamente una moneda literal en lugar de una desconocida {cite:tdv-abu-kamil work2-notation}.

## Lo que se construyó sobre ello

Un lector moderno puede explorar cómo dos ecuaciones con varias incógnitas interactúan con límites, integridad y positividad. Esta comparación no convierte toda la programación lineal moderna en una invención de Abu Kamil. Una herramienta actual puede comprobar un problema sin demostrar la descendencia histórica directa para cada aplicación de optimización.

Nuestra comprobación utiliza dos procedimientos de enumeración independientes, escalando el coste por 12 para evitar el redondeo decimal. Printing2678 no es suficiente: cada tupla debe cumplir ambas restricciones, aparecer una vez y coincidir con el conjunto completo generado de forma independiente. Estos son estándares de verificación modernos, no una afirmación de que el autor histórico haya usado un ordenador o nuestra notación.

## Impacto en la vida diaria

Un contexto de compra hace accesibles las restricciones, pero las fuentes leídas no documentan un mercado que realmente utilizara estos cinco precios ni un beneficio comercial medido del método. La fotografía no es un registro comercial. Los objetos intercambiables de Aydin ayudan a distinguir la estructura matemática de la mercancía en la historia {cite:tdv-abu-kamil work2}.

La distinción educativa es sencilla: encontrar una respuesta difiere de encontrar todas las respuestas. Un alumno puede comprobar una compra exitosa y luego preguntar qué deja el ejemplo sin descubrir. Esa es una lección obtenida de la estructura del problema, no de un censo inventado de escuelas históricas ni de un ahorro medido en tiempos antiguos de comercio.

## Cómo cambió la historia

Aydin sitúa la importancia de la obra en el tratamiento sistemático de problemas admitiendo numerosas respuestas enteras, más que en la satisfacción con una sola respuesta. El argumento de Sesiano, tal como relató MacTutor, hace que estos procedimientos merezcan ser estudiados sin exigir que cada problema e idea comenzara aquí. Tanto la contribución como sus límites pertenecen al relato {cite:tdv-abu-kamil work2} {cite:abu-kamil-mactutor rare-things}.

Esto también difiere de extender el álgebra a coeficientes irracionales: una contribución se refiere a cantidades admisibles en ecuaciones, la otra a la colección de respuestas admisibles. Los precios fraccionarios no hacen que esta sea una copia renombrada del ejemplo radical anterior. La pregunta y el trabajo separados justifican un registro separado {cite:tdv-abu-kamil work1-and-work2}.

## ¿Quién lo inventó?

**Marco suní declarado:** la base individual musulmana documentada existente sigue siendo independiente de la prioridad. **Relato académico:** Aydin conserva precedentes y su dependencia disputada de los métodos indios; MacTutor informa de los argumentos de Sisiano matizados por los textos conocidos. El museo no emite ni un veredicto absoluto pionero en el mundo ni una ruta directa probada para cada procedimiento {cite:abu-kamil-mactutor summary-and-rare-things} {cite:tdv-abu-kamil work2}.

Ni siquiera un recuento histórico de respuestas puede determinarse eligiendo un número conveniente en línea. ProofWiki imprime 2696 y reporta variantes 2676,2678,2698 en relatos modernos. Nuestra enumeración precisamente restringida explica un modelo, no lo que escribió cada copista ni por qué cada testigo difiere {cite:proofwiki-abu-kamil-birds variant-counts}.

## Hoy

Comparar 2678 con 3727 expone el efecto de una condición aparentemente pequeña: ¿puede estar ausente una especie? No se pueden comparar dos programas de forma justa si esa regla cambia entre ellos. La tupla cuenta cantidades por tipo, no aves dispuestas en línea; intercambiar individuos del mismo tipo no crea otra solución.

La fotografía contextual muestra una paloma gris moderna mirando hacia la izquierda, con un ojo naranja-rojo, cerea blanca y cuello iridiscente. No son 100 aves ni prueba de la identificación de cada palabra medieval de ave. El parecido con el ejemplo no transforma una fotografía moderna en un hecho registrado de la vida del autor {cite:commons-pigeon-portrait-dori current-image}.

## Ejemplos supervivientes

Leemos a MacTutor y Aydin, no manuscritos originales, ni la edición de Saidan de 1986, ni el estudio completo de Sisano. Aydin menciona un manuscrito superviviente en un pasaje, pero más tarde menciona testigos de Leiden y París. Preservamos esa tensión reportada en lugar de decidir el censo manuscrito mediante una recopilación que no realizamos {cite:tdv-abu-kamil work2-witnesses}.

La fotografía de Dori está fechada el 28 de marzo de 2008, Santa Bárbara, y licenciada CC BY-SA3.0US; el JPG original se utiliza sin cambios. La imagen y los derechos reales fueron inspeccionados, no sustituidos silenciosamente por una licencia no portada. Sus derechos y su objeto son preguntas separadas de autenticar un libro o contar sus soluciones {cite:commons-pigeon-portrait-dori description-rights}.

## En la cultura

Un enigma entretenido puede revelar la diferencia entre existencia y plenitud. El escenario de aves por sí solo no demuestra la transmisión entre pueblos. Por eso el relato preserva la discusión académica sobre el parecido y el desacuerdo en lugar de sustituir una historia sencilla que equipara la misma mercancía con el mismo método {cite:tdv-abu-kamil work2}.

La explicación no necesita ni una escena judicial inventada ni un título que convierta a su autor en el fondo de toda enumeración moderna. Los lectores pueden volver a las condiciones y ver por qué algunas tuplas califican y otras no. La imagen acompaña la comprensión; no es ni un retrato del autor ni una prueba fabricada de una página original.

## Para lectores jóvenes

Comproba (4,90,1,3,2) dos veces: una para el conteo y otra para el precio. Luego pregunta si puede faltar alguno tipo. Si no, (0,100,0,0,0) está prohibido aunque el conteo y el coste sean correctos. Escribe las condiciones del juego antes de buscar y no las cambies cuando aparezca otro resultado.

No partas un pájaro por la mitad para simplificar la respuesta. El dinero puede ser fraccionario mientras que el conteo de aves debe ser completo. Busca una segunda respuesta y luego pregunta por cada respuesta. Esta es una exploración moderna inspirada en el tipo de problema que describe Aydin, no en una tabla original puesta en la boca de Abu Kamil {cite:tdv-abu-kamil work2} {cite:proofwiki-abu-kamil-birds prices}.

## Referencias

- Aydin: trabajo, soluciones enteras, testigos {cite:tdv-abu-kamil work2}.
- MacTutor: biografía y argumento reportado sobre Sesiano {cite:abu-kamil-mactutor rare-things}.
- ProofWiki: precios modernos y variantes de recuento {cite:proofwiki-abu-kamil-birds historical-note}.
- Commons: Dori fotografía y derechos {cite:commons-pigeon-portrait-dori description-rights}.
