---
id: invention/kashi-sine-one-degree
lang: es
source_lang: en
translators: ['Claude (claude-fable-5-2), draft translation']
status: { review: published }
provenance: {generated_by: 'Claude Code subagent (spanish lane, records the document services could not return intact)', model: claude-fable-5-2, run: claude-es-2026-11-19, source: content/en/invention/kashi-sine-one-degree.md}
---

## Resumen

El seno de un grado no es el grado mismo, y mejorar su cálculo no inventó la trigonometría. La obra de [[person/al-kashi|Ghiyath al-Din al-Kashi]] asociada con el [[work/risala-watar-jayb-kashi|Treatise on the Chord and Sine]] aproximó un valor pequeño con gran precisión. MacTutor describe una ecuación cúbica y un método numérico iterativo. Esto difiere de su [[invention/al-kashi-pi-calculation|cálculo de la circunferencia]]: aquí una razón entre lados, allí la circunferencia dividida por el diámetro {cite:kashi-mactutor final treatise}.

Nuestra atribución es de mejora, no de origen absoluto. MacTutor reconoce el tratamiento aproximado anterior de al-Biruni; las fuentes describen de manera diferente la terminación, el papel de Qadi Zada y la precisión. Conservamos esos límites y luego ofrecemos un ejemplo explicativo moderno. No hemos leído el algoritmo original ni cotejado sus dígitos con un manuscrito {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

## Qué es

En un triángulo rectángulo, el seno de un ángulo agudo es el lado opuesto dividido por la hipotenusa. La razón no tiene unidad de longitud y sobrevive a la ampliación sin que cambie la forma del triángulo. “Cuerda” en el título también recuerda la geometría del círculo, pero cuerda y seno no son términos intercambiables en toda convención histórica. TDV identifica el cálculo preciso de un grado como un tema de este tratado {cite:tdv-kashi-okten work8}.

El resultado no son diecisiete dígitos leídos en una regla. Lo producen relaciones y aritmética sucesiva. Iranica informa de una expansión decimal de diecisiete dígitos, mientras que otros relatos resumen la exactitud de manera diferente. No convertimos esos informes en una certificación independiente de cada dígito, ni afirmamos que una observación del cielo poseyera la misma precisión que un valor calculado {cite:iranica-kashi sine computation} {cite:qadi-zada-mactutor original work}.

## El mundo anterior

Los senos, las cuerdas y las tablas precedieron a al-Kashi. El [[invention/battani-sine-table-methods|cálculo de la tabla de senos de al-Battani]] del museo aporta un contexto anterior, no una prueba de que una copia concreta llegara a al-Kashi. MacTutor nombra a al-Biruni como predecesor en las soluciones aproximadas de la cúbica de la trisección del ángulo. Este era un problema heredado, no una pregunta creada de repente en Samarcanda {cite:kashi-mactutor final treatise}.

Una tabla y un método para extraer un valor básico son cosas diferentes. Una operación puede interpolar entre celdas existentes; otra mejora los valores a partir de los cuales se construye una tabla. No contamos por separado cada uso del seno. Este registro concierne a una contribución numérica concreta asociada con una obra nombrada, no a una nueva etiqueta para toda la trigonometría, las tablas de senos anteriores o la medición del tiempo {cite:tdv-kashi-okten work8} {cite:iranica-kashi sine computation}.

## La historia

Las biografías sitúan a al-Kashi en el entorno erudito de [[place/samarqand|Samarcanda]] bajo Ulugh Beg: libros, cálculos, instrumentos y discusiones. Las cartas a su padre ofrecen sus juicios sobre los colegas, no una clasificación neutral que el museo respalde. Asistir a la misma reunión no establece coautoría, y apoyar una institución no da a un mecenas la autoría de cada resultado {cite:kashi-mactutor Samarkand and letters} {cite:iranica-kashi Life}.

MacTutor llama al Chord and Sine su última obra, posiblemente inacabada a su muerte y terminada por Qadi Zada. Iranica incluye su título en la lista de obras de la introducción del Key to Arithmetic de 1427. Un título listado no resuelve si todas las partes estaban completas. Nuestra fecha abierta termina en el límite de la vida de al-Kashi, de1429, no en un año de composición inventado ni en una fecha para el comentario posterior {cite:kashi-mactutor final treatise} {cite:iranica-kashi work list}.

## El autor o los autores

MacTutor identifica individualmente a al-Kashi como matemático islámico. Esto aporta la base musulmana registrada, no su nombre ni su ciudad. El marco suní por defecto del museo, que es aparte, no es una prueba detallada de escuela personal. No lo derivamos de la afiliación de un mecenas ni sugerimos que estas biografías académicas constituyan un registro completo de su educación religiosa {cite:kashi-mactutor summary} {cite:tdv-kashi-okten biography}.

Qadi Zada plantea una cuestión de documentación aparte. Su biografía de MacTutor describe un método diferente para el mismo valor; TDV nombra un comentario; la biografía de al-Kashi trata la posible terminación. Estos pueden concernir a obras o etapas diferentes, pero no hemos cotejado textos para decidirlo. Ni borrar su papel ni hacerlo silenciosamente coautor igual de cada paso {cite:qadi-zada-mactutor original work} {cite:tdv-kashi-okten work8} {cite:kashi-mactutor final treatise}.

## Cómo funciona

Lo que sigue es una derivación moderna, no una transcripción. MacTutor conecta el problema histórico con una cúbica y con la iteración; explicamos esa conexión usando la notación actual sin atribuir nuestra secuencia exacta a al-Kashi. Sea `x` el seno de un grado y `a` el seno de tres grados. La relación del ángulo triple da `a=3*x-4*x*x*x`. Triplicar el ángulo no triplica simplemente su seno {cite:kashi-mactutor final treatise}.

Reordénese esto como `x=(a+4*x*x*x)/3`. Con una entrada aproximada `a`, empiécese en `x0=a/3`, y luego sustitúyase la estimación actual en el lado derecho para obtener otra. Elevar al cubo significa multiplicar un número por sí mismo tres veces, no multiplicarlo por tres. Dividimos la suma especificada, no cada ángulo o lado de un dibujo.

Nuestro cálculo moderno toma `a≈0.05233595624294383` de una función trigonométrica de software. Empieza cerca de `0.017445318748`, luego da `0.017452397806`, luego `0.017452406427`. Los valores mostrados están redondeados, no son celdas leídas de una tabla histórica. Usar una función ya hecha pone a prueba esta ilustración; no reconstruye cómo un matemático anterior obtuvo la entrada.

¿Por qué ayudan aquí estos pasos? Entre cero y 0.02 la derivada del lado derecho, `4*x*x`, es como máximo0.0016. Los cambios en la salida son mucho menores que los cambios en la estimación. Nuestra comprobación moderna verifica que la transformación permanece en este pequeño intervalo y que las diferencias sucesivas se reducen. Esto concierne al intervalo elegido, no es una promesa de que toda cúbica y toda conjetura inicial converjan.

La cúbica tiene otras raíces; queremos la pequeña y positiva apropiada para un ángulo agudo de un grado. La selección de la raíz es parte de la resolución, no un adorno tras escribir una ecuación. Una iteración rápida no puede reparar una entrada errónea: cambiar `a` cambia el problema. Más dígitos de salida no pueden borrar la aproximación inicial ni el error de redondeo aritmético.

La precisión histórica sigue siendo referida a través de la erudición, no probada por este limitado ejemplo de máquina. No lo llamamos método de Newton, ni atribuimos una estructura de programa moderna a al-Kashi, ni inferimos la trisección exacta con regla y compás de ángulos arbitrarios. La aproximación numérica y una construcción geométrica exacta son problemas distintos, aun cuando ambos traten de ángulos {cite:kashi-mactutor final treatise}.

## La difusión

TDV enumera el comentario de Qadi Zada, una impresión de Teherán numerada 1299 y una traducción rusa. Referimos esa indicación bibliográfica sin conjeturar una conversión de calendario ni afirmar haber inspeccionado la impresión. Un comentario o una traducción documenta la atención tal como la describe un estudioso, no un censo de estudiantes ni una prueba de que todos los testimonios sean idénticos {cite:tdv-kashi-okten work8}.

MacTutor dice que estos logros permanecieron mucho tiempo desconocidos en Europa y fueron estudiados en los siglos diecinueve y veinte. La semejanza con un método moderno no establece una transmisión directa. Una ruta documentada requiere copias, lecturas y citas, no meramente dos fechas y la suposición de que un autor anterior necesariamente proveyó a todo autor posterior {cite:kashi-mactutor conclusion}.

## Sobre qué se construyó

Las relaciones trigonométricas, la aritmética, el álgebra y el valor posicional están detrás del resultado. MacTutor reconoce el trabajo aproximado de al-Biruni sobre la cúbica, no una cadena de transmisión manuscrita que hayamos verificado. Los lectores pueden comparar la [[invention/biruni-difference-interpolation|interpolación por diferencias]] para distinguir entre corregir una tabla y resolver repetidamente una relación algebraica; herramientas diferentes no tienen por qué convertirse en un solo algoritmo {cite:kashi-mactutor final treatise}.

Nuestro `a` moderno también requiere una fuente de cálculo conocida. Decir “calcula el seno de tres grados” no explica el procedimiento de un autor anterior. No podemos llenar ese vacío con una llamada de software y atribuirla hacia atrás. Distinguir entrada, relación, selección de raíz y regla de parada revela cuatro capas de una explicación; tener una no prueba las otras.

## Qué se construyó sobre ello

Las fuentes sitúan el cálculo exacto dentro de la astronomía de Samarcanda, pero una tabla astronómica combina observación, modelos, calendarios y aritmética. Un seno preciso no hace correcta cada coordenada estelar con el mismo número de cifras. No añadimos ningún invento posterior concreto meramente porque la astronomía use la trigonometría {cite:iranica-kashi mathematics and astronomy} {cite:qadi-zada-mactutor collaborative catalogue}.

El informe de TDV sobre el comentario aporta un hilo de recepción, conservando las diferentes descripciones del papel de Qadi Zada. El software moderno es una comparación didáctica, no un descendiente demostrado. Dejar vacíos los dependientes directos es más honesto que construir una red de influencia de nombres famosos sin pruebas leídas. No significa que la obra careciera de valor; este tipo de conexión específica no está establecido aquí {cite:tdv-kashi-okten work8}.

## Impacto en la vida cotidiana

Un valor pequeño puede parecer remoto, pero ilustra una distinción práctica entre medir una figura y realizar un cálculo reproducible. Iranica vincula la búsqueda de una mayor precisión del seno con necesidades astronómicas, no con una máquina doméstica causada por esos dígitos. No poseemos ningún total medido de dinero, tiempo o viajes ahorrados por el tratado y no inventamos ninguno {cite:iranica-kashi sine computation}.

La calidad de la entrada importa junto con la destreza de procedimiento. Continuar después de que los dígitos mostrados se estabilicen no aporta ningún conocimiento nuevo de un testimonio histórico. Ese es un uso educativo actual que proponemos, separado del impacto social documentado. Nuestro cálculo en papel no es un sistema de navegación, y la actividad infantil no requiere ni observación solar ni fabricación de instrumentos.

## Cómo cambió la historia

La obra une el álgebra y la trigonometría: un problema de ángulos se convierte en una ecuación y luego en un proceso de aproximación. MacTutor destaca la calidad de la iteración e Iranica su exactitud referida. Describimos un desarrollo numérico acotado, no una prueba de que todas las ramas de la matemática moderna empezaran aquí, ni una razón para borrar la aproximación anterior {cite:kashi-mactutor final treatise} {cite:iranica-kashi sine computation}.

Su estudio también separa el logro de la recepción posterior. Un texto que circula en un entorno, unos historiadores que lo estudian en otro lugar y un software contemporáneo que produce un valor relacionado son tres historias, no un linaje único automático. El relato de MacTutor sobre el conocimiento europeo tardío no puede valer por una inspección independiente de cada autor y biblioteca europeos {cite:kashi-mactutor conclusion}.

## ¿Quién lo inventó?

La atribución descansa en la erudición que describe el Chord and Sine, no en la semejanza entre un dibujo moderno y un manuscrito. Al-Biruni es un predecesor reconocido; Qadi Zada tiene papeles descritos de manera diferente. Reconocerlos ni elimina a al-Kashi ni eleva un “posiblemente terminado” a participación cierta en cada cálculo {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

Los informes sobre la exactitud también difieren. Iranica dice diecisiete dígitos en una expansión decimal; la biografía de al-Kashi compara la exactitud del seno con pi, mientras que la biografía de Qadi Zada da un resumen del orden de `10^-12`. Preservamos esas formulaciones en lugar de forzar un acuerdo o llamarlas lecturas independientes de dígitos históricos. Se necesita un testimonio numérico leído para evaluar el redondeo y el error {cite:iranica-kashi sine computation} {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

## Hoy

Una lección moderna puede poner a prueba un intervalo pequeño, comparar estimaciones sucesivas e inspeccionar el residuo `3*x-4*x*x*x-a`. Un residuo pequeño comprueba la ecuación de entrada, no la corrección histórica de la entrada. Distíngase una visualización redondeada de un valor interno más largo; de lo contrario, dos estimaciones pueden parecer idénticas simplemente porque una pantalla oculta su diferencia.

La imagen reutilizada es el diagrama de triángulo rectángulo de TheOtherJesse de2007, cedido al dominio público. Las letrasA,B,C y los rótulos ingleses de los lados son modernos; el ángulo dibujado no es de un grado. No contiene ni las figuras de al-Kashi ni su página, y su escala no establece su procedimiento. Explica el lado opuesto y la hipotenusa, no es un testimonio histórico {cite:commons-trigonometry-triangle Description licence and original history}.

## Ejemplos conservados

Nuestra prueba son los relatos académicos realmente leídos. TDV identifica el tratado y el comentario, e Iranica aporta una lista de obras. No hemos leído el texto original, el comentario ni el estudio técnico de Dilgan citado por la biografía de Qadi Zada. No se presenta como prueba inspeccionada ninguna signatura recordada ni ninguna página fotografiada no vista {cite:tdv-kashi-okten work8} {cite:iranica-kashi work list} {cite:qadi-zada-mactutor references}.

Las descripciones de terminación, comentario y método diferente permanecen visibles en el registro de la obra y en la prosa de apoyo. No declaramos perdido el tratado a partir de un resumen de búsqueda ni afirmamos que se conserve un autógrafo del autor. Declarar lo que leímos permite evaluar la capa probatoria: conocer un título difiere de haber establecido su texto.

## En la cultura

Samarcanda evoca la arquitectura y un observatorio, pero esta es también una historia de cálculo y de libros. Las cartas entre padre e hijo, el mecenazgo y las discusiones con colegas aparecen en las biografías. El elogio sigue siendo discurso atribuido, no una competición nacional ni el museo declarando que un estudioso superó a todos en todos los campos {cite:kashi-mactutor letters and patronage} {cite:iranica-kashi Life}.

Los números largos tientan a las historias heroicas. Iranica distingue la destreza de cálculo y de instrumentos de las contribuciones menos establecidas a la teoría planetaria cosmológica. Eso no disminuye un resultado numérico; hace a una persona histórica más específica que un eslogan. La compleja cuestión de la autoría pertenece a la historia del conocimiento, no es un defecto que ocultar {cite:iranica-kashi concluding assessment}.

## Para los lectores jóvenes

Escribe “ángulo” en una tarjeta de papel y “razón entre lados” en otra. ¿Es un tercio de un número la misma pregunta que el seno de un tercio de un ángulo? Un adulto puede identificar las partes del triángulo sin medir la exactitud del dibujo. Lo importante es distinguir clases de cantidad, no memorizar una respuesta larga.

Luego escribe una estimación, una corrección y de dónde vino el valor inicial. No hace falta sol, telescopio ni equipo especial. Cuando los dígitos mostrados coincidan, pregunta si la respuesta se volvió exacta o si el papel simplemente dejó de mostrar diferencias más pequeñas. Reconocer los límites de un ejemplo es parte de aprender, como reconocer que nuestro dibujo no es la página de al-Kashi.

## Referencias

- {cite:kashi-mactutor complete biography}
- {cite:tdv-kashi-okten work8 and biography}
- {cite:iranica-kashi mathematics work list and assessment}
- {cite:qadi-zada-mactutor complete biography}
- {cite:commons-trigonometry-triangle Description licence and original history}
