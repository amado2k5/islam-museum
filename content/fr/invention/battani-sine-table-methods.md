---
id: invention/battani-sine-table-methods
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/battani-sine-table-methods.md}
---
## Résumé

Dans le chapitre trois de [[work/al-zij-al-sabi|son Zij]], [[person/al-battani|Muhammad ibn Jabir al-Battani]] explique la construction d'une table de demi-cordes d'arcs doublés et son utilisation dans les deux directions : d'un arc vers une longueur, et d'une longueur vers un arc {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17; Latin pp. 9–11}. Nous appelons aujourd'hui ces quantités des sinus ; il s'agit d'un affinement computationnel au sein des traditions plus anciennes, et non d'une invention du sinus ou de toute trigonométrie {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. Le chapitre combine géométrie, tabulation et approximation plutôt que de présenter des nombres sans instructions pour les utiliser {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## Ce que c'est

La table relie un arc d'une longueur calculée dans un cercle d'échelle spécifiée : al-Battani choisit un diamètre 120 et un rayon 60 {cite:nallino-albatenii-opus-astronomicum Arabic p. 13; Latin p. 9}. Une « demi-corde de l'arc doublé » signifie doubler l'angle de l'arc et prendre la moitié de la corde correspondante, sans réduire de moitié l'angle initial {cite:nallino-albatenii-opus-astronomicum Arabic pp. 15–16; Latin p. 10}. Cela fait que le sinus tabulable correspond directement à l'arc d'entrée de l'utilisateur, évitant ainsi le doublement répété lors du calcul {cite:nallino-albatenii-opus-astronomicum Latin p. 10}.

## Le monde devant lui

L'auteur suit explicitement Ptolémée en choisissant le diamètre 120 pour un calcul pratique ; l'échelle est héritée, et non une invention privée {cite:nallino-albatenii-opus-astronomicum Arabic p. 13; Latin p. 9}. Il commence par la géométrie des cordes et les relations triangulaires rectangles, puis construit des cordes d'arcs supplémentaires par moitié, addition et soustraction {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15; Latin pp. 9–10}. Cela n'établit pas que chaque opération soit apparue pour la première fois dans ce livre : le registre concerne leur disposition pratique et l'utilisation de la table au sein du Zij {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## L'histoire

Le travail d'observation d'Al-Battani était associé à [[place/raqqa|Raqqa]], et son Zij comprenait cinquante-sept chapitres, et non une feuille isolée de sinus {cite:tdv-battani-muftuoglu biography and Kitab al-Zij} {cite:battani-mactutor chapter outline}. Les fondations computationnelles précèdent les chapitres ultérieurs sur l'utilisation des tableaux, faisant du troisième chapitre une introduction à un outil de travail plus vaste {cite:tdv-battani-muftuoglu Kitab al-Zij}.

Les pages inspectées ne fournissent aucune année de composition indépendante pour ce chapitre ; ni une époque de catalogue stellaire ni le début des observations ne constituent une date d'invention {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17} {cite:tdv-battani-muftuoglu biography}. La date ouverte du document prend fin à sa mort en 317 H/929 : une reliure à vie la plus tardive, non une affirmation selon laquelle il l'aurait composée spécifiquement en 929 {cite:tdv-battani-muftuoglu biography}.

## Le(s) fabricant(s)

Le rôle enregistré d'al-Battani est celui d'« améliorateur » : le texte documente un choix computationnel et des procédures de travail superposées à une géométrie antérieure {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. Son identité musulmane repose ici sur l'ouverture religieuse de l'auteur, lue en arabe, et sur l'argument explicite de Nallino à partir de celle-ci — et non sur son nom ni son affiliation familiale {cite:nallino-albatenii-opus-astronomicum Arabic p. 6, scan1146; Latin preface XVI, scan25}. Le cadre sunnite du musée est déclaré séparément pour le cadre abbasside de Raqqa, et non présenté comme une déclaration personnelle de l'école juridique ; sa biographie conserve des opinions historiques nommées sans déduire une religion uniquement à partir d'« al-Sabi » {cite:tdv-battani-muftuoglu biography} {cite:nallino-albatenii-opus-astronomicum Latin preface XVI, scan25}.

## Comment ça fonctionne
La relation triangulaire rectangle affichée est planaire ; les problèmes sphériques dans le zij sont une application astronomique distincte, et non le même triangle tracé {cite:battani-mactutor trigonometry} {cite:tdv-battani-muftuoglu §§el-Zîc}.

L'exemple numérique inventé montre aussi pourquoi l'intervalle de table est important : 6/30 n'est pas 6/60, donc utiliser un degré complet au lieu d'un demi-degré modifie l'incrément numérique. En sens inverse, 20,4 seul est insuffisant sans ses lignes voisines et leur différence2 ; un excédent devient des minutes à travers la division et la multiplication décrites par le chapitre, et non simplement une nouvelle étiquette {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}. Ce sont d'autres explications de l'exemple en classe, pas des valeurs manuscrites.

Le point final illustre l'échelle géométrique : à 90 degrés, la moitié de la corde de l'arc doublé à 180 degrés correspond à la moitié du diamètre, soit 60. À 30 degrés, la moitié de la corde de 60 degrés est 30, car cette corde est égale au rayon {cite:nallino-albatenii-opus-astronomicum Arabic pp.13–16; Latin pp.9–10}. Les valeurs géométriques exactes à ces points diffèrent de l'interpolation entre les rangées voisines ; un tableau peut combiner des résultats géométriques avec des estimations intermédiaires.

MacTutor donne une relation de triangle rectangle attribuée à al-Battani : `b sin(A) = a sin(90 - A)` {cite:battani-mactutor trigonometric formulae}. Sa notation est la présentation de la référence moderne, et non des symboles manuscrits arabes copiés. Elle combine un sinus, le sinus d'un angle complémentaire et deux longueurs de côté, tandis que la table des demi-cordes fournit des nombres pour de tels calculs : la relation théorique et la table numérique remplissent des fonctions différentes {cite:battani-mactutor trigonometric formulae} {cite:nallino-albatenii-opus-astronomicum Arabic pp.13–17}.

Une démonstration moderne, et non un problème de manuscrit, prend 45 degrés : son sinus est égal à son sinus complémentaire, donc les côtés comparés sont égaux. Pour 30 degrés, le complément est 60 et ces sinus diffèrent ; le fait d'être à angle droit seul ne rend pas les deux côtés égaux. Écrire les deux côtés avec des sinus à l'échelle de rayon 60 introduit le même facteur de chaque côté, qui s'annule, laissant le rapport latéral inchangé {cite:battani-mactutor trigonometric formulae} {cite:nallino-albatenii-opus-astronomicum Arabic p.16; Latin p.10}. Ces calculs expliquent la relation rapportée sans prétendre que l'auteur ait utilisé ces exemples particuliers.

L'interpolation peut également être démontrée avec une table de classe explicitement inventée, et non avec des valeurs de Zij : supposons que les lignes voisines séparées par 30 minutes aient des valeurs 20 et 22. Une position 6 minutes au-dessus de la rangée inférieure correspond à un cinquième de l'intervalle, donc un cinquième de l'augmentation numérique2 est ajouté à 20, donnant 20,4. En sens inverse, l'excédent0,4 divisé par la différence de lignes2 renvoie un cinquième de l'intervalle angulaire, soit 6 minutes {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}. Réussir à inverser l'arithmétique ne prouve pas que la courbe réelle est droite : elle explique l'étape proportionnelle entre les points, pas l'exactitude de l'approximation {cite:nallino-albatenii-opus-astronomicum Latin pp.10–11}.

TDV identifie d'autres fonctions au sein du Zij : les chapitres 33 à 48 concernent l'utilisation des tables, le chapitre 32 la conversion de calendrier, et le chapitre 28 la durée des quatre saisons basée sur l'observation {cite:tdv-battani-muftuoglu Kitab al-Zij}. Toutes les valeurs tabulaires ne sont donc pas un sinus, ni toute différence entre dates et angles : la table des fonctions fait partie d'un travail reliant la mesure du temps, l'observation et la géométrie {cite:tdv-battani-muftuoglu Kitab al-Zij}.

L'encyclopédie attribue également des idées basées sur la projection orthographique et le théorème du cosinus sphérique aux discussions des chapitres 5 à 26 {cite:tdv-battani-muftuoglu Kitab al-Zij}. Ce récit secondaire se distingue du chapitre à demi-corde directement inspecté : un triangle sphérique et une projection ne sont pas le même objet qu'un triangle rectangle plan, et les fonctions partagées n'impliquent pas que chaque preuve ait été lue au chapitre 3 {cite:tdv-battani-muftuoglu Kitab al-Zij} {cite:nallino-albatenii-opus-astronomicum Arabic pp.13–17}.


Le chapitre construit d'abord des accords connus, y compris l'accord de 60 degrés égal au rayon, en utilisant des relations de côté carré dans les triangles rectangulaires et les cordes dont les arcs complètent un demi-cercle {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15; Latin pp. 9–10}. Il se transforme ensuite en demi-cordes d'arcs doublés, tabulabilisées chaque demi-degré à 90 degrés {cite:nallino-albatenii-opus-astronomicum Arabic pp. 15–16; Latin p. 10}. La construction inclut une approximation pour l'accord d'un degré, donc chaque étape ne doit pas être décrite comme exacte sans approximation {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–10}.

Dans la notation explicative moderne — non des symboles manuscrits copiés — `S(theta) = 60 sin(theta)` ; les entrées pour 30 et 90 degrés sont donc 30 et 60, et non 0,5 et 1 avant d'être divisées par 60 {cite:nallino-albatenii-opus-astronomicum Arabic p. 16; Latin p. 10}. Un accord complet est récupéré en doublant le sinus de la moitié de son angle, et non en doublant le sinus de ce même angle complet {cite:nallino-albatenii-opus-astronomicum Arabic p. 17; Latin p. 11}.

Pour un angle entre les lignes, prenez la différence entre les valeurs des tables adjacentes, multipliez par les minutes d'arc supplémentaires au-dessus de la ligne inférieure, divisez par 30 minutes d'arc, puis ajoutez le résultat à la valeur inférieure {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17; Latin pp. 10–11}. C'est une interpolation linéaire : un exemple pédagogique dérivé en place 30 degrés 15 minutes à mi-chemin entre 30 degrés et 30 degrés 30 minutes, en prenant la moitié de l'augmentation tabulaire sans inventer de chiffres historiques pour les deux entrées {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

La procédure inverse localise la valeur inférieure de la table, convertit la longueur excédentaire en minutes d'arc proportionnellement à la différence de ligne adjacente, puis les ajoute à l'arc de départ {cite:nallino-albatenii-opus-astronomicum Arabic p. 17; Latin p. 11}. Nallino appelle cela « arcuation » ; sa note de bas de page explique le choix de la terminologie latine sinus/cosinus pour rendre les expressions de demi-accord. Les mots latins du traducteur ne doivent pas être confondus avec une formulation littérale arabe {cite:nallino-albatenii-opus-astronomicum Latin p. 11 and note}.

## La diffusion

Le Zij parvint aux lecteurs latins et castillans, et les biographies discutent de la réception du livre dans l'astronomie ultérieure {cite:tdv-battani-muftuoglu Kitab al-Zij} {cite:battani-mactutor reception}. La transmission d'une œuvre contenant des calculs et des tables ne prouve pas à elle seule que chaque étape du chapitre à trois atteignit chaque lecteur sans changement ; ce document ne trace donc aucun itinéraire mondial précisément daté pour la procédure seule {cite:battani-mactutor reception}.

## Sur quoi elle a été bâtie

Le fondement immédiat de l'explication est la géométrie des cordes, la convention du diamètre 120, et les procédures construisant des arcs et leurs longueurs correspondantes ; Le nom de Ptolémée est conservé lorsque l'auteur reconnaît explicitement sa convention {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–15}. Le passage à des demi-cordes d'arcs doublés modifie l'entrée utilisée dans le travail de table, mais n'efface pas la géométrie précédente ni ne fait du cercle une invention nouvelle {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–10}.

## Ce qui a été construit dessus

Dans le chapitre quatre suivant, le calcul sinusoïdal et inverse d'arc répond à un problème de déclinaison dans le même rayon : une application identifiable à l'intérieur de l'œuvre, plutôt qu'une simple ressemblance moderne {cite:nallino-albatenii-opus-astronomicum Latin p. 12}. La loi du sinus sphérique n'est pas silencieusement regroupée dans ce résultat ; une table et son utilisation ne sont pas tous les théorèmes attribués à l'auteur de Zij et ne nécessitent pas leur propre enquête {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–12}.

## Impact sur la vie quotidienne

L'avantage immédiat concerne le fonctionnement de la calculatrice : traiter un angle non listé et résoudre le problème inverse sans reconstruire la géométrie à partir de zéro {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17}. Les pages inspectées ne fournissent aucun recensement des utilisateurs du marché ou de la navigation, donc un bénéfice computationnel ne devient pas une histoire non documentée concernant chaque foyer ou navire {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

## Comment cela a changé l'histoire

MacTutor décrit les méthodes trigonométriques d'al-Battani comme une avancée dans le calcul astronomique ; le chapitre examiné expose une partie du travail sous-tendant cette large affirmation {cite:battani-mactutor trigonometric methods} {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}. Sa valeur réside dans la construction de longueur de connexion, les valeurs organisées et les instructions pour trouver une quantité sans sa propre ligne imprimée — sans déclarer un seul père de toute la computation numérique moderne {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}.

## Qui l'a inventé ?

La question à réponse plus étroite est : qui explique ce système dans ce Zij : al-Battani, avec une dette explicite envers la géométrie plus ancienne {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17}. Le premier sinus, la première table et la première interpolation à travers chaque civilisation sont des questions différentes, non réglées par ces pages ni par le nom d'un érudit sur un livre {cite:nallino-albatenii-opus-astronomicum Latin pp. 9–11}.

## Aujourd'hui

Les lecteurs peuvent comparer l'échelle historique du rayon 60 avec la normalisation moderne des unités et comprendre l'interpolation comme une estimation entre les entrées, et non comme un remplacement exact de la fonction sous-jacente à chaque entrée {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}. L'image est un diagramme d'enseignement moderne en triangle rectangle rendu public par TheOtherJesse en 2007, et non le tableau d'al-Battani ; ses noms de façade sont relatifs à un angle particulier {cite:commons-trigonometry-triangle Description and Licensing}.

## Exemples conservés

Le témoin textuel inspecté est l'édition de Nallino : l'arabe imprimé 13–17 correspond aux scans de 1139 à 1135, et le latin imprimé de 9 à 11 à 100 à l'échelle 98–100 ; la partie arabe est réordonnée à l'envers dans ce fichier relié {cite:nallino-albatenii-opus-astronomicum Arabic pp. 13–17; Latin pp. 9–11}. Il s'agit de lire des pages spécifiées d'une édition publiée, sans examiner physiquement le manuscrit ni prétendre avoir lu tous les tableaux du livre {cite:nallino-albatenii-opus-astronomicum edition}.

## Dans la culture

La biographie d'« al-Battani » ou « Albaten(i)us » appartient à la transmission d'une œuvre arabe vers d'autres langues, mais les noms variés parmi les lecteurs ne justifient pas de lui attribuer le mérite de chaque méthode ultérieure {cite:battani-mactutor reception}. Le musée distingue l'ancien texte, la terminologie latine d'un traducteur et une image pédagogique moderne qui l'accompagne {cite:nallino-albatenii-opus-astronomicum Latin p. 11 note} {cite:commons-trigonometry-triangle Description}.

## Pour les jeunes lecteurs

Imaginez un tableau qui ne peut pas imprimer tous les angles possibles : que se passe-t-il lorsque le vôtre tombe entre deux rangées ? Al-Battani explique l'estimation d'une part de la différence, puis l'inversation de la longueur à l'angle ; la leçon est une façon de lire, pas seulement de mémoriser une longue chaîne de nombres {cite:nallino-albatenii-opus-astronomicum Arabic pp. 16–17}. Commencez par l'idée à mi-parcours, en gardant en tête qu'il s'agit d'une approximation, et non d'un dessin grandeur nature du ciel {cite:nallino-albatenii-opus-astronomicum Latin pp. 10–11}.

## Références

- Édition/traduction de Nallino : chapitre trois arabe13–17/scans1139–1135, latin9–11/scans98–100 ; début du chapitre quatre Latin12 ; ouverture arabe6/scan 1146 et argument d'identité latine XVI/scan 25 {cite:nallino-albatenii-opus-astronomicum edition}.
- Ferruh Müftüoğlu, « BETTÂNÎ », TDV,6 (1992), 9–10 {cite:tdv-battani-muftuoglu article}.
- O'Connor et Robertson, MacTutor, novembre 1999 ; dates de traduction contradictoires et inférence religieuse uniquement nommée non adoptée {cite:battani-mactutor biography}.
- Les métadonnées originales archivées de TheOtherJesse de 2007 du triangle et de la publication de l'auteur, pas le rendu révisé de 2024 {cite:commons-trigonometry-triangle Description, Licensing and file history}.
