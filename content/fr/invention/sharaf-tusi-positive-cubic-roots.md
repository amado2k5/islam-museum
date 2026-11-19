---
id: invention/sharaf-tusi-positive-cubic-roots
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/sharaf-tusi-positive-cubic-roots.md}
---
## Résumé

Avant d'essayer de calculer une réponse, demandez-vous si le problème peut obtenir la réponse positive qu'il demande. Cette distinction est centrale à la contribution attribuée à [[person/sharaf-al-din-al-tusi|Sharaf al-Din al-Tusi]] dans l'analyse bigraphique des équations cubiques. Certaines classes admettent des solutions positives selon leurs conventions ; d'autres dépendent de valeurs de coefficients. Une tentative numérique ratée n'établit pas l'impossibilité, et appeler quelque chose une équation ne garantit pas le type de solution recherchée {cite:sharaf-tusi-mactutor equations}.

Ce document concerne cette analyse conditionnelle, et non toute l'algèbre ou un autre décompte des [[invention/khayyam-geometric-cubics|constructions géométriques de Khayyam]]. Un maximum fournit un seuil de solution dans un exemple clair. Nos démonstrations symboliques sont des explications modernes indépendantes, et non des transcriptions manuscrites. Les interprétations divergentes des historiens de la relation aux dérivées restent attribuées, et non converties, en une affirmation selon laquelle un calcul différentiel moderne complet existait déjà {cite:tdv-sharaf-tusi-ozel mathematical-analysis} {cite:sharaf-tusi-mactutor derivative-discussion}.

## Ce que c'est

Il s'agit d'une méthode d'analyse des classes d'équations, et non d'un instrument ou d'une table numérique isolée. Les comptes décrivent douze types de degré inférieur, huit types cubiques avec des solutions positives, et cinq types cubiques dont les solutions positives peuvent ne pas exister. Les coefficients positifs et les racines positives appartiennent aux conventions. La classification n'est pas un inventaire prétendu de toutes les solutions complexes en algèbre moderne {cite:sharaf-tusi-mactutor equations} {cite:tdv-sharaf-tusi-ozel works1}.

L'exemple de MacTutor est x³+a=bx avec a,b positif. Réarrangé en notation moderne, a=bx−x³ demande si l'expression à droite peut atteindre la valeur demandée pour x positif. La question de la possibilité peut donc précéder l'approximation. Ces lettres et symboles imprimés sont présentés de manière moderne : la biographie dit explicitement que Sharaf exprimait ses mathématiques en mots {cite:sharaf-tusi-mactutor equations}.

## Le monde devant lui

Les problèmes cubiques avaient déjà une histoire géométrique. Ozel place Sharaf après le traitement de Khayyam par des sections coniques. Cela ne signifie pas qu'ils aient fait exactement la même chose ou inventé toutes les courbes. L'article distingue la détermination numérique et l'investigation des solutions tout en conservant la preuve géométrique. Un enregistrement distinct est justifié par la question particulière d'existence et de seuil, et non par la réinterprétation d'une construction d'intersection antérieure {cite:tdv-sharaf-tusi-ozel mathematical-analysis}.

MacTutor identifie également des techniques antérieures en langue arabe pour l'approximation des racines des nombres avant d'aborder leurs applications plus larges en équation. De tels antécédents ne créent pas un inventeur unique de chaque méthode d'approximation ni ne prouvent une chaîne directe à Horner. Ils localisent un champ dans lequel une extension spécifique pourrait se produire. La portée et l'attribution nécessitent encore les limites {cite:sharaf-tusi-mactutor numerical-approximation} déclarées de la référence.

## L'histoire

Le [[work/al-muadalat-sharaf-tusi|Traité sur les équations]] est décrit comme ayant survécu dans un abrégé anonyme. Selon les comptes, les tables de calcul numériques ont été supprimées. Cela change ce qui peut être reconstruit : la classification et l'argumentation peuvent survivre tandis que certaines parties de l'implémentation computationnelle disparaissent. Nous ne comblons pas ces lacunes par des nombres générés et ne les étiquetons pas comme tables originales de Sharaf {cite:tdv-sharaf-tusi-ozel works1} {cite:sharaf-tusi-mactutor abridgement}.

Ozel rapporte l'édition parisienne de Rashed en 1986 et une traduction arabe de 1998 par Fares. Ce sont des rapports bibliographiques issus d'une source lue, et non des éditions lues indépendamment ici. Ozel avertit également qu'une revendication à vie en 1209 résultait d'une date de manuscrit effacé mal lue. Nous ne considérons pas cela comme une année exacte de découverte ou de composition. Le document utilise un horizon du XIIe siècle, et non une date d'invention {cite:tdv-sharaf-tusi-ozel biography-and-works1} documentée.

## Le(s) fabricant(s)

Sharaf al-Din al-Muzaffar al-Tusi est l'enseignant associé à des villes telles que Damas et Mossoul, dont la vie est peu documentée. Il n'est ni Nasir al-Din al-Tusi ni son propre élève Kamal al-Din ibn Yunus. Un nom de famille familier n'établit pas l'identité. MacTutor relie le travail algébrique à l'enseignement ultérieur de Bagdad, et non au site de découverte de chaque proposition {cite:sharaf-tusi-mactutor biography} {cite:tdv-sharaf-tusi-ozel biography}.

MacTutor identifie explicitement l'individu comme un mathématicien islamique. Cela fournit la base musulmane plutôt que son nom ou son mécène. Sunnite reste séparément le cadre par défaut déclaré du musée ; aucune école personnelle n'a été créée grâce à ces lectures. L'abrégateur anonyme et les interprètes modernes ont également des rôles : transmettre et expliquer une méthode ne fait pas automatiquement de chaque transmetteur son auteur mathématique {cite:sharaf-tusi-mactutor summary-and-abridgement} {cite:tdv-sharaf-tusi-ozel works1}.

## Comment ça fonctionne

MacTutor explique que bx−x³ atteint son maximum à t=√(b/3), avec maximum2(b/3)^(3/2). Une solution positive dans l'exemple nécessite donc que a ne dépasse pas cette borne. Puisque a est positif, une racine doit aussi se trouver entre 0 et√b. « Pas de solution » dans ce contexte signifie pas de racine positive demandée, pas une affirmation selon laquelle toutes les racines négatives ou complexes disparaissent {cite:sharaf-tusi-mactutor equations}.

Voici une démonstration moderne indépendante sans dérivation. Mettez b=3t². Alors 2t³−(bx−x³)=(x−t)²(x+2t). Pour x non négatif et t positif, le côté droit est non négatif, n'étant nulle qu'à x=t. Cela prouve une borne globale sur ce domaine, et non simplement la plus grande valeur parmi les suppositions échantillonnées. Il s'agit de notre démonstration algébrique, pas d'une reconstruction prétendue de la séquence de démonstrations du manuscrit.

## La diffusion

Ozel décrit la réception chez les auteurs ultérieurs d'algèbre et d'arithmétique, nommant les œuvres qui font référence au traitement de Sharaf. Cela soutient une affirmation limitée de la réception littéraire et mathématique, et non un recensement des élèves ou des écoles du monde entier. L'utilisation du livre par un auteur n'établit pas que chaque algorithme ou chaque tableau ultérieurement omis ait été adopté {cite:tdv-sharaf-tusi-ozel mathematical-reception}.

Les éditions et études modernes ont amené l'ouvrage à un débat historique plus poussé, y compris des interprétations dérivées divergentes. Les études originales n'ont pas été examinées de manière indépendante ici ; leurs positions sont rapportées à travers les deux biographies. Lire une bibliographie ne revient pas à lire toutes les œuvres qu'elle énumére, et les noms ultérieurs Newton ou Horner, dans une analogie, ne sont pas des documents d'un itinéraire de transmission continu {cite:sharaf-tusi-mactutor derivative-discussion} {cite:tdv-sharaf-tusi-ozel works1}.

## Sur quoi elle a été bâtie

Les récits décrivent les équations, le raisonnement géométrique et l'approximation numérique travaillant ensemble. La comparaison avec Khayyam rend visible la question ajoutée : dans quelles conditions une classe peut-elle obtenir la solution positive recherchée ? Séparer l'existence de la computation est une façon d'expliquer cette contribution particulière, et non un verdict selon lequel tous les mathématiciens précédents ont ignoré si une construction pouvait fonctionner {cite:tdv-sharaf-tusi-ozel mathematical-analysis}.

Dans notre exemple moderne, choisissez b=3. Alors 3x−x³ a un maximum2 à x=1. Choisir a=1 se situe en dessous du seuil, a=2 dessus, et a=3 au-dessus. Ce sont des choix pédagogiques, pas des entrées de tableau historiques. Garder le positif x explicite évite l'idée erronée qu'une racine positive manquante signifie qu'aucun nombre réel d'aucun signe ne peut satisfaire l'équation.

## Ce qui a été construit dessus

Pour a=1, notre exemple possède deux racines positives distinctes : l'une entre 0 et 1, l'autre entre 1 et √3. Cette conclusion moderne découle de la continuité et de la montée puis de la baisse de 3x−x³ sur le domaine positif concerné. Il ne prétend pas que Sharaf ait utilisé un théorème formel de valeurs intermédiaires ultérieur. Ici le crochetage et le resserrement d'une racine sont des calculs explicatifs, pas des lignes récupérées d'un tableau omis.

À a=2, x³−3x+2 se factorise com(x−1)²(x+2). Il existe une racine positive distincte,1, avec multiplicité deux, et une racine négative−2 en dehors de la question de racine positive. À a=3, il n'y a pas de racine positive car le maximum2 ne peut pas atteindre 3, bien qu'une racine réelle négative subsiste. Distinguer les racines distinctes de la multiplicité évite une contradiction apparente dans le comptage des solutions.

## Impact sur la vie quotidienne

C'est une contribution à la connaissance, non une pompe soulevant de l'eau ou une horloge qui sonne sur un marché. Les sources décrivent une analyse et une réception d'équations plus approfondies chez les mathématiciens, et non un registre économique du commerce transformé par une limite particulière. Nous ne transformons donc pas une preuve en une affirmation non étayée sur le rendement ou la navigation des cultures. L'avantage directement explicable est d'organiser une question avant d'entreprendre une recherche vaine {cite:tdv-sharaf-tusi-ozel mathematical-analysis-and-reception}.

Par exemple, demander a=3 avec b=3 ne sera pas sauvé en essayant indéfiniment des suppositions positives. L'obstacle est la borne supérieure, pas une table d'approximation médiocre. Il s'agit d'une illustration éducative moderne, pas d'un témoignage tiré du journal intime d'un utilisateur du XIIe siècle. De même, calculer plus de décimales pour une racine possible ne peut pas corriger le fait d'avoir choisi la mauvaise classe d'équation ou le mauvais domaine demandé.

## Comment cela a changé l'histoire

Ozel présente l'œuvre comme importante après Khayyam et compare ses questions à l'existence, aux maxima et à l'approximation dans le langage moderne. La comparaison doit rester la comparaison ; les noms mathématiques ultérieurs ne sont pas des termes retrouvés dans la formulation propre de l'auteur ici. Des interprétations différentes montrent pourquoi l'histoire exige plus que de faire correspondre une vieille expression à une règle moderne de classe {cite:tdv-sharaf-tusi-ozel mathematical-analysis} {cite:sharaf-tusi-mactutor derivative-discussion}.

La contribution soutenue est plus étroite que d'inventer toute l'algèbre ou d'anticiper à elle seule chaque ordinateur. Il s'agit d'une analyse systématique dans une tradition d'équations, préservée par un abrégé de tables manquantes et reflétée dans une réception mathématique ultérieure. Ces limites conservent sa place parmi les pratiques antérieures et les interprétations ultérieures sans en effacer aucune {cite:tdv-sharaf-tusi-ozel mathematical-reception-and-works1}.

## Qui l'a inventé ?

**Cadre muséal sunnite :** nous attribuons la méthode de Sharaf à Ozel et MacTutor, la séparant des constructions antérieures de Khayyam et de la notation symbolique moderne. Aucune priorité universelle n'est revendiquée pour tous les problèmes maximaux ou méthodes numériques. Cette méthode n'apporte pas non plus la même chose que son [[invention/tusi-linear-astrolabe|astrolabe linéaire]] simplement parce que le créateur est partagé {cite:tdv-sharaf-tusi-ozel mathematical-analysis-and-works} {cite:sharaf-tusi-mactutor biography}.

**Interprétation académique :** MacTutor rapporte des explications divergentes de la procédure maximale, incluant une analogie dérivée et un récit alternatif. Nous présentons le désaccord à travers cette source, et non comme si les articles originaux de Fares et Berggren avaient été lus indépendamment. Le musée ne délivre pas un verdict général de « premier inventeur du calcul différent » ni rejette une analyse sophistiquée parce qu'elle utilisait un autre texte {cite:sharaf-tusi-mactutor derivative-discussion}.

## Aujourd'hui

Les lecteurs peuvent vérifier indépendamment la borne, tracer des exemples et comparer des approximations avec la factorisation exacte. Ce sont des activités modernes dans cette présentation. Une équation peut être réarrangée sous différentes formes, et les classifications limitées aux coefficients positifs n'ont pas besoin d'avoir le même nombre de types que celles permettant des coefficients signés. Les conventions de domaine sont importantes lorsqu'on compare les travaux anciens avec l'algèbre moderne {cite:sharaf-tusi-mactutor equations}.

L'image affichée est un polynôme moderne différent, avec racines−4,−1,2 et équation(x+4)(x+1)(x−2)/4. Ce n'est pas 3x−x³ et ce n'est pas le dessin de Sharaf. Elle fournit un contexte de courbe cubique tout en indiquant le décalage. Ses métadonnées enregistrent N.Mori et la version du domaine public ; la page ne présente pas chaque image cubique comme médiévale, anonyme ou comme graphique de l'exemple traité {cite:commons-polynomialdeg3 description-and-history}.

## Exemples conservés

Le témoignage textuel décrit par les biographies est un abrégé sans tableaux numériques. Ozel discute de la comparaison avec un autre ouvrage pour évaluer le décriment. Nous le savons grâce à la référence, et non à une compilation effectuée ici. Les rapports des éditions de 1986 et 1998 ne permettent pas de licence de citations de pages inventées aux volumes non lus ni d'attribution de calculs modernes au manuscrit non consulté {cite:tdv-sharaf-tusi-ozel works1}.

Une méthode mathématique n'a pas besoin d'un artefact industriel survivant pour être considéré comme connaissance. L'image et la chaîne sont des supports explicatifs ; les preuves historiques concernent le texte et la réception. Un graphique moderne présenté sous forme de page originale modifierait le sens des preuves. C'est pourquoi l'auteur du graphique et l'équation différente restent visibles, aux côtés des limites de lecture de sources {cite:commons-polynomialdeg3 description} {cite:tdv-sharaf-tusi-ozel works1}.

## Dans la culture

L'histoire de l'algèbre peut inciter les lecteurs à se lancer dans une course vers des étiquettes modernes : Newton, Horner, dérivées et géométrie algébrique. Les biographies elles-mêmes utilisent de telles comparaisons. Notre responsabilité n'est pas de transformer une analogie en propriété d'une théorie complète plus tardive. Une relation mathématique peut concorder sans que les auteurs ne partagent des objectifs, un langage, un contexte pédagogique ou un chemin documenté de transmission textuelle {cite:sharaf-tusi-mactutor equations-and-derivative-discussion}.

Le savoir passait également par les élèves, les abrégés, les commentateurs et les éditeurs. Préserver leurs rôles et ce qui reste inconnu fait partie de l'histoire, non de l'encombrement. Le cadre déclaré distingue également l'identification musulmane individuelle de la preuve mathématique : prouver un maximum n'établit aucune école religieuse, et posséder une traduction moderne ne résoudrait pas automatiquement toutes les dates de vie contestées {cite:tdv-sharaf-tusi-ozel biography-and-reception} {cite:sharaf-tusi-mactutor summary}.

## Pour les jeunes lecteurs

Commencez par une question plus petite : pour un x positif, can3x−x³ égal à 3 ? Notre identité moderne montre qu'elle ne peut pas dépasser 2. Vous n'avez pas besoin de mille réponses pour répondre. Demander 1 permet deux croisements ; demander 2 atteint le sommet à une valeur positive distincte. Ce sont des chiffres papier, pas une expérience de mesure ni une affirmation selon laquelle un tableau historique contenait nos choix.

La leçon plus large consiste à vérifier si une cible est possible avant de chercher sa localisation. Les réponses positives et négatives ont des relations différentes avec les conditions de la question, et non une valeur morale différente. Ne copiez pas le graphique qui l'accompagne comme exemple : son polynôme énoncé est différent. Distinguer l'image, la revendication historique et l'explication moderne rend un lecteur plus attentif, et non simplement un collectionneur de noms d'inventions {cite:commons-polynomialdeg3 description}.

## Références

- {cite:sharaf-tusi-mactutor equations-and-derivative-discussion} O'Connor et Robertson, biographie complète, 1999.
- {cite:tdv-sharaf-tusi-ozel pp445-446} Ahmet Ozel, biographie, analyse et œuvres, 2012.
- {cite:commons-polynomialdeg3 description-and-history} Graphe moderne différent dans le domaine public ; éditions originales des équations et articles d'interprétation non lus de manière indépendante.
