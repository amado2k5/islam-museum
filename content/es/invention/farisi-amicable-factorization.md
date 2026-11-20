---
id: invention/farisi-amicable-factorization
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/farisi-amicable-factorization.md}
---
## Resumen

Un número puede generar otro cuando se suman sus divisores propios, y los divisores del otro pueden conducir de nuevo al primero. Dos números diferentes con esta propiedad son amigables, como 220 y 284. [[person/kamal-al-din-al-farisi|Kamal al-Din al-Farisi]] no inventó este ejemplo ni la regla antigua de Thabit ibn Qurra. Su contribución aquí es un nuevo enfoque de factorización/combinatorio para demostrar la regla, tal como la describe MacTutor {cite:weisstein-amicable-pair definition} {cite:farisi-mactutor number-theory}.

Su [[work/farisi-tadhkirat-al-ahbab|Memorando para amigos sobre la amistad]] es distinto de su [[invention/farisi-water-sphere-rainbow|modelo arcoíris]]. Este registro no otorga ni prioridad absoluta a la factorización ni la primera prueba completa de su singularidad. MacTutor atribuye esa interpretación a Rashed y señala el desacuerdo académico sobre el estado de la demostración {cite:farisi-mactutor factorization} {cite:tdv-farisi-bozhuyuk work5}.

## Qué es

Los divisores en cuestión son enteros positivos que dividen sin resto de sobra. Para la amistobilidad excluimos el número en sí. Escribe sigma para la suma incluyendo el yo, y s para la suma excluyendo el yo: s(N)=sigma(N)−N. Confundir las dos sumas cambia la pregunta. Estos son símbolos explicativos modernos, no notación atribuida a un manuscrito {cite:weisstein-amicable-pair definition-and-equations}.

Los números deben ser positivos, distintos y satisfacer ambas direcciones. Por ejemplo, 6 tiene divisores propios 1,2,3 sumando 6. Es perfecto, no es un par amistoso consigo mismo según nuestra definición. Tampoco es suficiente un viaje de ida único: el segundo número debe conducir de vuelta al primero.

## El mundo que tenía delante

MacTutor atribuye la construcción a Thabit ibn Qurra antes de discutir la nueva prueba de al-Farisi. El predecesor conserva su nombre; no todo en el tratado posterior se convierte en una invención separada de su autor. Mencionar a ese predecesor no lo considera un nuevo fabricante musulmán a partir de una inferencia de su entorno {cite:farisi-mactutor inherited-rule}.

MacTutor también informa del argumento de Hogendijk de que Thabit podría haber conocido ya 17296 y 18416. No convertimos esto en un nuevo veredicto de prioridad ni acreditamos a un europeo posterior simplemente porque un nombre familiar acompañe a la pareja. La denominación convencional, una prueba superviviente y el primer descubrimiento son cuestiones históricas diferentes {cite:farisi-mactutor large-pair-history}.

## La historia

La biografía universitaria señala que el trabajo basado en la teoría numérica se volvió relevante en estudios posteriores al antiguo artículo de Rashed en el Diccionario de Biografía Científica, que se centraba en la óptica. La omisión de un relato anterior no demuestra ausencia en la obra del autor. TDV enumera por separado el tratado de amistad por título {cite:farisi-mactutor introduction} {cite:tdv-farisi-bozhuyuk work5}.

No se establece aquí una fecha exacta de composición ni escena conversacional. Un horizonte de finales del siglo XIII y principios del XIV relaciona la obra con su autor, no con un día de invención ni una conversión fabricada en la Hijri. Tabriz pertenece a su contexto biográfico; no es una sala de escritura en particular verificada a partir del original {cite:farisi-mactutor biography} {cite:tdv-farisi-bozhuyuk biography}.

## El(los) creador(es)

La base musulmana individual documentada de Al-Farisi se conserva de la descripción explícita de MacTutor, con el marco suní declarado por separado. Un nombre o maestro persa no establece una secta personal. Su anterior contribución óptica permanece intacta: un solo erudito puede trabajar sobre la luz y los números sin hacer idénticas las dos preguntas {cite:farisi-mactutor summary-and-biography}.

TDV difiere de MacTutor en nombre y fechas: Hasan ibn Ali ibn Hasan, nacimiento 1267 y fallecimiento 1319 por el colofón reportado por un estudiante, en lugar de Mahoma y aproximadamente 1260/1320. Atribuimos la discrepancia, no inventamos a otra persona ni reclamamos la ordenación original. Los campos heredados permanecen atribuibles a sus fuentes anteriores, mientras que los lectores pueden ver la alternativa {cite:tdv-farisi-bozhuyuk opening} {cite:farisi-mactutor quick-info}.

## Cómo funciona

Para una ilustración moderna tomemos 220=2²×5×11. Cada divisor elige un exponente de 2 de 0 a 2, y un exponente de 5 y 11 de 0 a 1. Hay 3×2×2=12 opciones distintas, incluyendo el propio 220. Organizar estas opciones ayuda a evitar divisores que falten o duplican; esto ilustra la estructura de factorización en la forma moderna {cite:farisi-mactutor factorization}.

La suma del divisor completo es (1+2+4)(1+5)(1+11)=7×6×12=504. Resta 220 para obtener 284. De manera similar, 284=2²×71, con suma completa 7×72=504; 504−284=220. La listación directa verifica ambos cálculos de forma independiente. Esta es una verificación explicativa moderna, no una cita de la antigua prueba {cite:weisstein-amicable-pair divisors220284}.

La regla de Thabit en notación moderna toma n≥2 y forma p=3×2^(n−1)−1, q=3×2^n−1, r=9×2^(2n−1)−1. **Si los tres son primos**, A=2^n×p×q y B=2^n×r son amistosos. La primalidad forma parte de la regla, no la decoración opcional. Esta construcción suficiente proporciona una familia, no todos los posibles pares amistosos {cite:farisi-mactutor inherited-rule}.

Para n=4 los primos son 23,47,1151, lo que da A=17296 y B=18416. Ambas sumas completas son 35712:31×24×48 para A y 31×1152 para B. Restar cualquiera de los números devuelve el otro. MacTutor describe a al-Farisi usando lemas, incluida una aplicación de tamiz, para establecer la primalidad de 1151; nuestra aritmética no reproduce la secuencia original de lemas {cite:farisi-mactutor example-n4}.

Un contraejemplo aclara las condiciones. Para n=3, r=287=7×41 es compuesto. Las fórmulas dan 2024 y 2296, y s(2024)=2296, pero s(2296)=2744, no2024. Tratar 287 como primo e insertar 1+287 en la fórmula divisor-producto es incorrecto: la contribución correcta es (1+7)(1+41). Este cálculo moderno independiente explica por qué tanto las premisas como la dirección del retorno importan.

Para la estructura general ponga t=2^n. Bajo las condiciones primas sigma(A)=sigma(B)=(2t−1)×9t²/2; la expansión algebraica también da A+B igual a esa expresión. Por tanto, restar A obtiene B, y viceversa. Las sumas inclusivas iguales por sí solas serían insuficientes sin su igualdad a A+B. Esta explicación condicional es álgebra moderna de museo, no una transcripción.

La restricción n≥2 mantiene los factores primos asumidos impares y diferentes de 2, permitiendo elecciones de factores independientes. Tomar n=1 en cambio da 20 y 34, que no son amigables. Eliminar la cota inferior y culpar a la regla de ese fracaso pondría a prueba una fórmula fuera de su dominio declarado.

## La propagación

MacTutor identifica el conocimiento del par más grande antes de los nombres europeos posteriores, dejando su descubrimiento más antiguo abierto a la investigación. MathWorld analiza redescubrimientos y reglas posteriores, no una cadena de manuscritos que hayamos establecido desde al-Farisi hasta cada autor posterior. Números idénticos por sí solos no demuestran una ruta textual directa {cite:farisi-mactutor large-pair-history} {cite:weisstein-amicable-pair history}.

Una edición moderna no constituye en sí misma evidencia de la circulación escolar histórica. TDV enumera la edición y estudio de Rashed de 1982; no leímos la edición completa aquí. La obra y su discusión académica se informan a través de la fuente realmente leída, sin un viaje manuscrito inventado ni un encuentro docente {cite:tdv-farisi-bozhuyuk work5}.

## Sobre qué se construyó

Los ingredientes explicativos son potencias primas, divisores y elecciones de exponentes. La misma fórmula del producto no puede aplicarse simplemente a factores superpuestos: 24=4×6 no permite multiplicar las sumas divisorias de 4 y 6, ya que comparten2. En nuestra explicación moderna, primero separamos potencias primas distintas antes de organizar elecciones independientes.

MacTutor atribuye a Rashed una interpretación basada en la factorización única de potencia prima y en un intento de demostración, y luego señala la discusión sobre si fue demostrada o solo intentada. Este límite importa. Dos ejemplos exitosos no demuestran el teorema general, y enumerar los factores de un pequeño entero no constituye una demostración de unicidad para cada entero {cite:farisi-mactutor factorization-debate}.

## Lo que se construyó sobre ello

Un estudiante puede comparar una lista real de divisores con un producto de sumas de potencias primas, comprobando la completitud y la no duplicación. Nuestra comprobación de museos compara estos de forma independiente para muchos enteros, no solo para un resultado exitoso. Eso valida nuestra explicación actual; no recupera una página perdida del tratado.

Incluso una regla correcta no tiene por qué producir todos los pares. 1184 y 1210 son amigables, pero 1210 no es divisible por 4, mientras que ambos miembros de esta familia Thabit son divisibles por 4 porque n≥2. Por tanto, el par no puede derivar de esta fórmula. Una condición suficiente genera ejemplos sin convertirse en condición necesaria para toda amistad {cite:weisstein-amicable-pair pair-list} {cite:farisi-mactutor inherited-rule}.

## Impacto en la vida diaria

Las fuentes que dicen describen aritmética y teoría de números, no un beneficio medido de mercado. El nombre de amistad no convierte a los números en un encanto, tratamiento o promesa sobre las relaciones humanas. Nuestro tema es una relación divisoria especificada, no evidencia de efectos sobrenaturales ni respaldo a una creencia no examinada {cite:weisstein-amicable-pair definition}.

Su valor educativo es que se vuelven visibles condiciones separadas: una dirección es insuficiente, una suma inclusiva difiere de una suma de divisores propios y un factor compuesto no es primo. Los lectores pueden poner a prueba estas distinciones en el par más pequeño antes de números mayores, sin afirmar que nuestro ejercicio reconstruye una lección histórica documentada.

## Cómo cambió la historia

MacTutor trata la obra de al-Farisi como algo más que una modificación menor de la demostración de Thabit: un nuevo enfoque que emplea la factorización y las ideas combinatorias. Apreciar ese paso no requiere ni borrar el autor de la regla ni asignar todo el lenguaje moderno de teoría numérica a al-Farisi. La contribución es un enfoque especificado en un tratado {cite:farisi-mactutor new-approach}.

Es independiente del experimento de la esfera de agua: uno se refiere a divisores, primalidad y demostración numérica; el otro se refiere a trayectorias de luz. No es otro ejemplo de la misma teoría óptica renombrada para aumentar el recuento de registros. La propia biografía distingue estas dos contribuciones principales {cite:farisi-mactutor introduction-and-number-theory}.

## ¿Quién lo inventó?

**Marco suní declarado:** la base musulmana individual heredada permanece, no un certificado sectario personal extraído de un nombre. **Relato académico:** La regla de Tabit precede al nuevo enfoque de al-Farisi; La interpretación de Rashed de la prueba de factorización sigue siendo objeto de debate. El museo no otorga ni un veredicto final de primera prueba completa ni el primer descubrimiento del par mayor {cite:farisi-mactutor summary-and-factorization}.

La fuente informa del argumento de Hogendijk sobre el conocimiento previo de Thabit. Su artículo completo no fue leído aquí: el índice de autores lo identifica, mientras que la navegación normal del editor se detenía en la verificación humana. El argumento sigue siendo atribuído a MacTutor, no disfrazado como una lectura completa de un artículo a pesar de la barrera de acceso {cite:farisi-mactutor large-pair-history}.

## Hoy

Distinguimos dos A,B diferentes de un número perfecto que vuelve a sí mismo. También distinguimos otros usos modernos de "amigable" con una definición distinta: aquí la prueba es la suma de divisores positivos excluyendo el yo. Un nombre atractivo no sustituye escribir la definición antes de comparar tablas {cite:weisstein-amicable-pair definition-and-terminology}.

La ilustración contextual de varillas coloreadas sitúa 284 por encima de 220, con filas de factores y sumas de divisores propios. Es la imagen moderna de Hyacinth, no varas usadas por al-Farisi ni una página del Memorándum. Ilustra el ejemplo más pequeño, no cada paso de la demostración general ni el par 17296/18416 {cite:commons-amicable-rods-hyacinth current-image}.

## Ejemplos supervivientes

Leímos MacTutor, TDV y definiciones/ejemplos modernos seleccionados, no el original árabe, la edición de Rashed de 1982 ni todos los elementos de la bibliografía. TDV identifica el tratado por su título, pero su manuscrito no fue inspeccionado aquí. El relato aritmético depende de la descripción académica que realmente se lee, no de una nueva edición crítica {cite:tdv-farisi-bozhuyuk work5} {cite:farisi-mactutor number-theory}.

La imagen fue creada el 28 de abril de 2016; el historial del 29 de abril incluye la revisión actual en negrita. Es CC BY-SA4.0, utilizado como un PNG original sin cambios. Se inspeccionaron tanto la imagen como los derechos reales. No transferimos la licencia de otra imagen ni la renombramos como un artefacto de la vida del autor {cite:commons-amicable-rods-hyacinth description-rights}.

## En la cultura

El "amigos" del título llama la atención sobre una relación que puede comprobarse numéricamente. Llamar amigos a los números es una analogía verbal, no un mecanismo que riga su comportamiento ni una explicación mística. Las sumas divisoras propias deben simplemente devolver al socio en ambas direcciones bajo la definición declarada {cite:weisstein-amicable-pair definition}.

Los límites siguen formando parte de la historia del museo: un predecesor anterior, un autor desarrollando una demostración y estudiosos que discrepan sobre la fortaleza y la prioridad. No hace falta una escena de descubrimiento inventada, ni un título que haga que cada método moderno de factorización sea propiedad de una sola persona {cite:farisi-mactutor factorization-and-priority}.

## Para lectores jóvenes

Divisores propios de Write220: 1,2,4,5,10,11,20,22,44,55,110. Su suma es 284. Invierte el ejercicio con 1,2,4,71,142 para obtener 220. No olvides1 ni incluyas el número en sí: cambiar cualquiera de las dos condiciones cambia lo que estás calculando {cite:weisstein-amicable-pair divisors220284}.

Luego inténtalo6 y pregúntate por qué no es un par consigo mismo. Para un desafío mayor, revisa el ejemplo fallido de 2024/2296 en ambas direcciones en lugar de detenerte en el primer éxito. Estas son exploraciones aritméticas modernas, no instrucciones textuales de manuscritos ni un juicio histórico final de prioridad.

## Referencias

- MacTutor: enfoque, regla, desacuerdos {cite:farisi-mactutor number-theory}.
- Bozhuyuk: obras y biografía alternativa {cite:tdv-farisi-bozhuyuk biography-and-work5}.
- MathWorld: definición/divisores {cite:weisstein-amicable-pair definition}.
- Bienes comunes: ilustración/derechos {cite:commons-amicable-rods-hyacinth description-rights}.
