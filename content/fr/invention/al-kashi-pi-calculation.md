---
id: invention/al-kashi-pi-calculation
lang: fr
source_lang: en
translators: ['Claude (claude-fable-5-2), draft translation']
status: { review: published }
provenance: {generated_by: 'Claude Code subagent (spanish lane, records the document services could not return intact)', model: claude-fable-5-2, run: claude-fr-2026-11-19, source: content/en/invention/al-kashi-pi-calculation.md}
---

## Résumé

Un petit dessin ne peut pas établir seize décimales. L'accomplissement de [[person/al-kashi|Ghiyath al-Din al-Kashi]] dans le [[work/risala-muhitiyya-kashi|Treatise on the Circumference]] fut un calcul soigneux, non la mesure d'un cercle avec un compas plus grand. MacTutor date l'œuvre de 1424 et décrit l'expression du double du rapport de la circonférence au diamètre sous des formes sexagésimale et décimale avec une haute précision. Cela a amélioré un calcul hérité ; cela n'a pas découvert pi {cite:kashi-mactutor Circumference treatise}.

Notre notice concerne une méthode numérique au sein de la géométrie et de l'astronomie. Les cercles et polygones antérieurs ne disparaissent pas derrière le nom de l'auteur, et son résultat n'établit pas non plus l'invention des fractions décimales. Nous expliquons les bornes par un petit exemple moderne, en le séparant du résultat historiquement rapporté. Nous n'avons pas lu le manuscrit original ni transcrit son calcul ligne par ligne {cite:kashi-mactutor decimal predecessors} {cite:iranica-kashi polygon computation}.

## Ce que c'est

Pi est la circonférence divisée par le diamètre en géométrie plane ordinaire. Le double de pi est la circonférence d'un cercle de rayon unité : les confondre double la réponse à tort. Okten rapporte la valeur décimale d'al-Kashi 6.2831853071795865, une approximation du double du rapport, non de pi lui-même, accompagnée d'une représentation sexagésimale {cite:tdv-kashi-okten mathematics}.

Ce n'est pas une expression finie égale à un développement infini. C'est une approximation dont la précision dépend de la maîtrise des erreurs dans les racines, la multiplication et la division. Iranica décrit des polygones à l'intérieur et autour d'un cercle, tandis que MacTutor souligne le résultat dans deux systèmes de numération. La géométrie des formes et l'habileté de calcul se rencontrent ici ; afficher un long nombre sans expliquer son sens est insuffisant {cite:iranica-kashi polygon computation} {cite:kashi-mactutor Circumference treatise}.

## Le monde d'avant

Les problèmes du cercle et les approximations ont précédé al-Kashi. Iranica relie son traité à l'amélioration des approximations employées en astronomie et reconnaît des traditions plus anciennes. La géométrie n'a pas recommencé en 1424, et le simple fait de dessiner un polygone à l'intérieur d'un cercle n'est pas non plus son invention personnelle. La contribution délimitée est le travail de calcul et la précision atteinte {cite:iranica-kashi As Mathematician and Astronomer}.

MacTutor place aussi les décimales et l'extraction des racines dans des travaux antérieurs, y compris l'école d'al-Karaji et al-Samawal. « A employé les fractions avec habileté » ne doit pas devenir « a inventé toutes les fractions décimales ». La comparaison chronologique avec des résultats européens ultérieurs ne prouve pas non plus que leurs auteurs l'aient lu. Une occurrence antérieure et une transmission textuelle documentée sont des affirmations différentes {cite:kashi-mactutor decimals and root methods}.

## L'histoire

Les sources décrivent une carrière allant du milieu de Kashan à Samarcande, mais les détails biographiques ont une certitude inégale. MacTutor estime la naissance vers 1380 ; Iranica discute d'environ 1386, inféré en supposant un âge lors de l'observation de 1406. Nous ne combinons pas ces données en un anniversaire inventé et ne cachons pas le caractère d'estimation derrière une date familière {cite:kashi-mactutor biography} {cite:iranica-kashi Life}.

Le milieu savant d'Ulugh Beg offrait un soutien à l'astronomie et au calcul. MacTutor date la Muhitiyya de juillet 1424 et le Key to Arithmetic de 1427 : des œuvres différentes. Les études diffèrent aussi sur les étapes de la construction de l'observatoire. La date d'un bâtiment ne peut pas dater chaque livre ni l'arrivée de chaque savant. Notre notice n'utilise que l'année du traité, sans jour deviné ni conversion hégirienne {cite:kashi-mactutor Samarkand and works} {cite:iranica-kashi Life}.

## Le ou les auteurs

MacTutor identifie individuellement al-Kashi comme un mathématicien islamique. C'est la base musulmane consignée, non son nom ou l'origine de sa famille. Le cadre sunnite est séparément le cadre par défaut du musée dans le milieu timouride documenté, non un certificat d'école personnelle ni une inférence tirée de la religion d'Ulugh Beg. Les biographies savantes lues ici ne donnent aucune attestation contraire d'appartenance confessionnelle personnelle ; le silence n'est pas une biographie détaillée de la croyance {cite:kashi-mactutor summary} {cite:tdv-kashi-okten biography}.

Il est un améliorateur du calcul. Qadi Zada, Ulugh Beg et d'autres savants partageaient le cadre intellectuel, mais cela n'établit pas une co-paternité de chaque calcul de la Muhitiyya. Les lettres à son père classent les capacités de ses collègues ; ce sont ses appréciations, non un classement objectif annoncé par le musée {cite:iranica-kashi letters and scientific environment}.

## Comment cela fonctionne

Imaginez un cercle de rayon unité. Un polygone régulier dont les sommets sont sur sa circonférence prend un chemin plus court ; un polygone tangent qui l'entoure prend un chemin plus long. Diviser leurs périmètres par deux donne des bornes inférieure et supérieure pour pi. Cette explication moderne illustre la description par Iranica des bornes par polygones ; elle ne reproduit ni les symboles d'al-Kashi ni l'ordre de sa preuve {cite:iranica-kashi polygon computation}.

Appelons n le nombre de côtés et s la longueur du côté inscrit. Notre borne inférieure est `L=n*s/2` ; la supérieure est `U=L/sqrt(1-s*s/4)`. Pour un hexagone s=1, ce qui donne L=3 et U approximativement 3.464102. Nous n'avons pas besoin d'abord du long développement décimal de pi : les côtés et les rayons fournissent des relations géométriques exprimables par des racines carrées.

Bissecter l'angle au centre double le nombre de côtés. Notre récurrence explicative est `s_new=s/sqrt(2+sqrt(4-s*s))`. Douze côtés donnent une borne inférieure d'environ 3.105829 et une supérieure d'environ 3.215390. L'intervalle reste large mais il est plus étroit que celui de l'hexagone. Ce sont des nombres modernes fraîchement vérifiés, non des cellules lues dans la Muhitiyya.

Continuer jusqu'à 96 côtés donne approximativement `3.141032 < pi < 3.142715`. Cela ne peut pas établir la longue précision historiquement rapportée. Cela enseigne à resserrer un intervalle plutôt qu'à annoncer une réponse exacte. Tout polygone fini reste un polygone ; l'image d'accompagnement à deux hexagones ne reproduit ni la suite complète du calcul historique ni son échelle.

L'expression équivalente `sqrt(2-sqrt(4-s*s))` soustrait des quantités presque égales quand le côté devient petit. Nous choisissons la première forme pour notre exemple moderne afin de réduire l'annulation numérique. C'est une explication de calcul contemporaine, non un langage ou une architecture d'ordinateur attribués à un savant du quinzième siècle. Une démonstration sur machine à précision finie ne certifie pas indépendamment chaque chiffre historique.

Les notations sexagésimale et décimale expriment des quantités fractionnaires en utilisant des valeurs de position différentes. Okten imprime `6;16,59,28,1,34,51,46,15,50` et `6.2831853071795865` : après le séparateur sexagésimal, les positions ont pour dénominateurs 60 et ses puissances. Convertir une quantité arrondie d'une base à l'autre ou la diviser par deux ne crée pas d'information absente du calcul original {cite:tdv-kashi-okten mathematics}.

Cependant, la vérification de la suite imprimée littérale révèle une divergence : elle se convertit en approximativement `6.2831853071795924`, non en la décimale qui l'accompagne. Nous signalons le désaccord sans deviner une correction d'un chiffre historique. Sans lire l'original, nous ne pouvons pas localiser l'erreur dans la transmission, la typographie ou ailleurs. Une haute précision rapportée et la vérification que ces deux lignes imprimées concordent sont des questions différentes {cite:tdv-kashi-okten mathematics}.

## La diffusion

MacTutor décrit l'œuvre d'al-Kashi comme restée longtemps inconnue en Europe et ayant reçu plus tard une étude historique aux dix-neuvième et vingtième siècles. Okten liste l'étude et la traduction allemandes du Circumference par Paul Luckey, publiées en 1953. Cela documente une érudition et une publication, non le transfert direct de chaque technique numérique à chaque Européen comparé à lui {cite:kashi-mactutor conclusion} {cite:tdv-kashi-okten work6}.

Le Circumference doit aussi être distingué de l'usage du Key comme texte d'enseignement. Okten décrit la réception du manuel plus vaste et des traductions de parties, non une circulation identique pour ce traité plus court. Nous ne pouvons pas emprunter chaque signe de la popularité du Key comme preuve pour chaque page de la Muhitiyya ni tracer une carte certaine à partir d'un simple récit général de réception {cite:tdv-kashi-okten work7}.

## Sur quoi cela s'appuyait

La méthode a besoin des relations du cercle et du triangle, des racines et de l'arithmétique des positions fractionnaires. Les biographies soulignent la combinaison de géométrie et de calcul chez al-Kashi tout en distinguant les travaux antérieurs sur les décimales et les racines. Cela n'identifie pas un livre particulier du musée derrière chaque étape ; le précurseur reste une description générale sourcée plutôt qu'un lien causal inventé {cite:kashi-mactutor mathematical contributions}.

L'astronomie aide à expliquer le souci de précision, mais le traité n'est pas simplement une table d'observation. Une figure idéale calculée diffère d'un instrument physique affecté par les matériaux et le mouvement. Iranica décrit l'inquiétude devant la déformation des grands instruments : l'exactitude géométrique, numérique et matérielle sont liées sans être identiques {cite:iranica-kashi instruments and practical precision}.

## Ce qui s'est appuyé sur cela

Les œuvres d'al-Kashi traitent plusieurs problèmes : le Khaqani Zij met à jour une astronomie antérieure ; le Key enseigne l'arithmétique ; le Chord and Sine traite un autre calcul ; les instruments accomplissent d'autres tâches. Ce ne sont pas des titres interchangeables pour la Muhitiyya. La précision du sinus d'un degré n'appartient pas à une table de circonférence, et de nombreux titres ne justifient pas non plus automatiquement de multiplier une contribution en plusieurs notices {cite:tdv-kashi-okten works} {cite:kashi-mactutor sine treatise}.

Nous documentons un accomplissement délimité pour l'étude et la comparaison ultérieures. Tout programme moderne calculant pi ne devient pas son descendant. Partager une cible mathématique ne prouve pas l'héritage d'un algorithme particulier. De même, une ancienne procédure géométrique ne devient pas une série infinie ou une méthode moderne du seul fait qu'elle produit une quantité que nous connaissons aujourd'hui plus précisément.

## Effets sur la vie quotidienne

MacTutor décrit les applications prévues du Key en astronomie, en arpentage, en architecture, en comptabilité et en commerce. Cela place le calcul dans un cadre intellectuel pratique, mais ne mesure pas les effets de la Muhitiyya. Nous n'avons aucun document montrant combien de bâtiments ou de transactions ont changé à cause de sa seizième décimale précisément {cite:kashi-mactutor Key to Arithmetic}.

L'effet étayé est une capacité de calcul améliorée et l'expression d'un résultat précis dans deux systèmes. Davantage de chiffres ne signifient pas que chaque tâche quotidienne en a besoin ni que chaque instrument de l'époque mesure le monde à cette précision. L'enseignement peut distinguer « calculable » de « mesurable » sans inventer des économies ou des nombres de bénéficiaires que les sources ne fournissent pas {cite:tdv-kashi-okten mathematics}.

## Comment cela a changé l'histoire

Les biographies décrivent un accomplissement de calcul médiéval notable ; MacTutor compare sa précision avec des résultats antérieurs et ultérieurs. Nous conservons cela comme un récit historique, non comme notre certificat indépendant que toutes les civilisations et tous les textes perdus ont été explorés. L'accomplissement n'exige pas de supprimer les calculs grecs, chinois ou islamiques antérieurs {cite:kashi-mactutor Circumference treatise}.

La consignation d'un résultat sexagésimal et décimal montre aussi un mouvement entre outils arithmétiques au sein d'une même œuvre. MacTutor souligne l'emploi des fractions décimales pour des quantités telles que pi, non seulement pour des approximations de racines algébriques. C'est un développement de la pratique numérique, distinct de l'invention de la virgule décimale moderne, de tout concept de nombre réel ou d'un itinéraire direct vers un Européen nommé {cite:kashi-mactutor decimal contributions}.

## Qui l'a inventé ?

Al-Kashi est l'auteur du calcul associé à ce traité, non du cercle ni de chaque approximation de son rapport. L'attribution est donc une amélioration, non une origine absolue. MacTutor nuance explicitement les revendications de priorité sur les décimales et les racines en considérant les prédécesseurs. Nous n'importons pas de revendications plus fortes simplement pour rendre le titre plus excitant {cite:kashi-mactutor priority qualifications}.

L'unité numérique est tout aussi importante : `6.2831853071795865` approche le double de pi. Les décimales ne sont pas des positions sexagésimales. Diviser par deux un résultat arrondi peut afficher un chiffre supplémentaire sans exactitude nouvelle. L'approximation, la troncature et l'arrondi sont des opérations différentes ; répéter « seize décimales » ou montrer un beau diagramme n'en établit aucune indépendamment {cite:tdv-kashi-okten mathematics}.

## Aujourd'hui

Le petit exemple enseigne les bornes, l'erreur accumulée et une expression plus stable. Ce sont des outils explicatifs modernes, non une reconstruction documentée à partir du premier manuscrit. Un algorithme historique exact exige de lire un témoin ou une édition précisés et d'identifier sa notation, non de combler les lacunes par les connaissances actuelles en programmation.

L'image d'Urutseg de 2009 montre deux cercles avec un hexagone inscrit et un hexagone circonscrit. Commons l'identifie comme de la géométrie simple moderne dans le domaine public, non comme une peinture de Samarcande. Elle ne contient ni des millions de côtés ni les chiffres d'al-Kashi. Séparer l'illustration de la preuve permet aux lecteurs d'utiliser ce que l'image explique réellement sans imaginer ce qu'elle ne montre pas {cite:commons-archimedes-pi-urutseg Description and history}.

## Exemples conservés

Okten nomme l'édition et la traduction allemande de Luckey et décrit plusieurs autres œuvres conservées dans des manuscrits. Nous n'avons pas lu la Muhitiyya originale ni l'édition allemande et ne présentons pas le résultat comme une transcription d'une page vue. Nos références sont les œuvres effectivement consultées ; le résultat numérique est rapporté à travers elles, les systèmes de numération étant distingués {cite:tdv-kashi-okten works6–8}.

Les lettres à son père offrent une autre fenêtre sur la vie scientifique. Iranica discute de leur valeur, de l'éloge de soi et de la compétition ; elles ne sont ni un inventaire impartial des capacités des collègues ni des substituts à la lecture de l'œuvre arithmétique. La date de copie d'un livre différent ne peut pas dater la Muhitiyya, et un titre conservé ne peut pas à lui seul établir un témoin commun unique {cite:iranica-kashi letters and works}.

## Dans la culture

Les longs nombres attirent l'attention, mais l'histoire d'al-Kashi n'est pas un concours de mémorisation de chiffres. Les sources dépeignent un savant écrivant à son père, cherchant un soutien et travaillant parmi des collègues et à la cour. L'éloge d'Ulugh Beg reste le jugement de celui qui le prononce, non un verdict du musée selon lequel chacune des opinions d'al-Kashi surpassait tous ses rivaux {cite:kashi-mactutor biography and patronage} {cite:iranica-kashi Life}.

Iranica distingue l'habileté de calcul et d'instrument des limites des contributions connues à la théorie planétaire cosmologique. Cela ne rabaisse pas l'arithmétique : l'astronomie a plusieurs domaines, et la distinction dans l'un ne prouve pas automatiquement chaque accomplissement dans tous. Un savant historique est plus qu'un nombre célèbre et moins qu'un héros crédité de tout {cite:iranica-kashi concluding assessment}.

## Pour les jeunes lecteurs

Regarde les cercles et les hexagones. Lequel a ses coins sur la circonférence, et lequel a ses côtés qui touchent le cercle de l'extérieur ? Dessine un chemin de papier plus court et un plus long et écris « la réponse se trouve ici » entre eux. C'est une activité sur les bornes, non la mesure de seize décimales à partir d'une petite image ni la reproduction exacte du travail d'al-Kashi.

Écrire davantage de chiffres rend-il une réponse correcte ? Écris une courte estimation et explique ses limites plutôt que d'ajouter des nombres non étayés. Aucune fabrication d'instrument ni observation du ciel n'est requise. Du papier et une question suffisent. Un dessin légèrement imparfait démontre aussi pourquoi une image qui explique diffère d'une relation mathématique qui prouve.

## Références

- {cite:kashi-mactutor complete biography}
- {cite:tdv-kashi-okten complete entry}
- {cite:iranica-kashi complete article body}
- {cite:commons-archimedes-pi-urutseg Description licence and history}
