---
id: invention/biruni-difference-interpolation
lang: fr
source_lang: en
translators: ['Claude (claude-fable-5-2), draft translation']
status: { review: published }
provenance: {generated_by: 'Claude Code subagent (spanish lane, records the document services could not return intact)', model: claude-fable-5-2, run: claude-fr-2026-11-19, source: content/en/invention/biruni-difference-interpolation.md}
---

## Résumé

Comment un lecteur peut-il obtenir une valeur qu'une table ne donne pas dans sa propre ligne ? Diviser l'accroissement entre les lignes en parts égales ne suffit pas toujours : les accroissements eux-mêmes peuvent changer. [[person/al-biruni-muhammad-ibn-ahmad|Al-Biruni]] discute de ce problème dans le [[work/al-qanun-al-masudi|Qanun al-Mas'udi]], puis explique une manière d'ajuster le calcul {cite:qanun-masudi-jundi-v1 scan pp.301–302,321–324}. Cette entrée concerne une amélioration précise de l'usage des tables, non l'invention du sinus, de toute interpolation ou de chaque formule quadratique ultérieure. Les méthodes indiennes antérieures appartiennent au récit, non à son extérieur {cite:meijering-interpolation-2002 II.B–II.C}. La preuve ici est du texte et du calcul approché, non une machinerie archéologique ni une démonstration que chaque résultat est plus exact.

## Ce que c'est

L'interpolation estime une valeur entre des entrées connues. L'éditeur emploie [[concept/istikmal-interpolation|istikmal]] en parlant d'al-Biruni ; le passage primaire lui-même distingue des procédures coutumière et raffinée pour trouver un sinus ou trouver un arc {cite:qanun-masudi-jundi-v1 scan pp.40–42,321–324}. La recherche directe cherche un sinus à partir d'un arc ; la recherche inverse cherche un arc à partir d'une valeur. L'auteur met aussi en garde contre le fait d'appeler recherche de sinus toute opération tabulaire quand son objet est autre chose {cite:qanun-masudi-jundi-v1 scan p.321}.

Le raffinement fait entrer une autre différence en considération : non seulement le changement entre lignes voisines, mais la manière dont ce changement diffère du précédent. Cette procédure est l'unité de cette entrée. Les colonnes, la soustraction et chaque multiplication ne sont pas comptées séparément comme des inventions. Appeler une expression non linéaire n'établit pas non plus son égalité avec toute autre expression non linéaire.

## Le monde d'avant

Meijering explique des formules du second ordre associées à Brahmagupta et aux travaux indiens qui ont suivi avant al-Biruni, au sein d'une histoire bien plus longue des tables astronomiques {cite:meijering-interpolation-2002 II.B–II.C}. Le résumé de Rashed rapporte quatre méthodes dont disposait al-Biruni, dont deux indiennes, à travers un passage examiné chez al-Samaw'al {cite:rashed-interpolation-1991 abstract}. Lire ce résumé n'est pas lire le manuscrit sous-jacent ni chaque preuve mathématique de l'article complet.

L'[[invention/battani-sine-table-methods|entrée sur les méthodes de table d'al-Battani]], distincte, du musée inclut l'interpolation linéaire directe et inverse {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}. Cette entrée n'est pas un réétiquetage de ce travail. L'existence d'un précurseur ne rend pas chaque règle ultérieure identique à lui, mais une amélioration ultérieure précise ne peut pas effacer un travail antérieur simplement parce qu'un résumé moderne appelle son auteur un pionnier.

## L'histoire

La question commence avant les instructions. En discutant du choix du diamètre, al-Biruni préfère un sinus maximal de un pour réduire les multiplications et divisions répétées, puis soutient géométriquement que les différences de sinus ne varient pas dans la même proportion fixe que les arcs {cite:qanun-masudi-jundi-v1 scan pp.301–302}. Il reconnaît aussi le labeur du calcul à des intervalles plus fins et explique l'espacement d'un quart de degré adopté pour sa table des sinus {cite:qanun-masudi-jundi-v1 scan p.302}.

De nombreuses positions numériques ne remplacent pas une procédure convenable pour s'en servir. La datation ici est le large contexte documentaire du onzième siècle assigné au Qanun par Meijering, non un jour d'invention exact ni la date de l'édition moderne {cite:meijering-interpolation-2002 II.C}. Aucune date hégirienne calculée n'est insérée comme si elle était un rapport historique original.

## Le ou les auteurs

L'attribution repose sur l'exposé écrit d'al-Biruni, non sur sa renommée générale. Son rôle ici est celui d'améliorateur d'une procédure tabulaire particulière, les prédécesseurs étant conservés {cite:qanun-masudi-jundi-v1 scan pp.321–324,339–340} {cite:meijering-interpolation-2002 II.B–II.C}. L'auteur du texte, l'éditeur de l'édition, Rashed, Meijering et l'illustrateur moderne sont des contributeurs distincts. Réunir leur travail sur une page ne les transforme pas en une seule main historique.

**Cadre sunnite :** Britannica et Tümer fournissent une base individuelle pour l'identité musulmane, tandis que la classification confessionnelle personnelle reste débattue. La biographie présente l'interprétation de Tümer dans le cadre sunnite déclaré {cite:britannica-al-biruni biography} {cite:tdv-biruni-tumer religious-affiliation}.

**Classifications chiite et zaydite rapportées :** La notice de la personne conserve les deux à travers Tümer, non comme un verdict décisif du musée {cite:tdv-biruni-tumer religious-affiliation}. Un nom, l'affiliation d'un mécène ou un site web hébergeant une numérisation ne peuvent pas remplacer une preuve sur l'individu.

## Comment cela fonctionne

Le lecteur prend la ligne dont l'arc est inférieur à l'arc requis, retient sa valeur et la portion restante de l'arc, puis distingue la correction coutumière d'un raffinement utilisant la différence adjacente et celle qui la précède {cite:qanun-masudi-jundi-v1 scan pp.321–322}. L'accroissement utilisé dans le calcul n'est donc pas maintenu fixe sur tout l'intervalle. Le texte explique géométriquement son changement graduel {cite:qanun-masudi-jundi-v1 scan p.323}. Appeler le résultat raffiné ne le rend pas exact ni exempt d'erreur.

Pour des valeurs croissantes, un déploiement moderne utilise une valeur de départ `y0`, des accroissements précédent et suivant `Dprev` et `Dnext`, et une fraction d'un intervalle de table `t`. L'instruction résultante se lit `y0+t*((1-t)*Dprev+t*Dnext)` {cite:qanun-masudi-jundi-v1 scan pp.322–323,339–340}. Ce sont nos symboles d'enseignement, non la notation de l'auteur ni la règle standard de Newton qui s'ajuste nécessairement aux trois échantillons. La multiplication par le résidu intervient deux fois, ce qui rend l'expression non linéaire.

Prenons une table d'enseignement inventée avec les valeurs1,2,2.5 aux positions−1,0,1. L'accroissement précédent est 1 et l'accroissement suivant0.5. À la moitié de l'intervalle suivant, cette procédure donne 2.375, tandis que l'interpolation linéaire donne 2.25. Rien dans ces seuls échantillons ne nous dit la valeur intermédiaire réelle. Ce ne sont pas des données numériques du Qanun ni la preuve d'une exactitude universellement supérieure ; cela montre ce qui a changé dans les instructions.

Les unités comptent aussi. Les quatre minutes de l'instruction primaire sont le nombre sexagésimal 1/15, représentant la division par les quinze minutes d'arc d'un intervalle d'un quart de degré, non un nouvel angle de quatre degrés {cite:qanun-masudi-jundi-v1 scan p.323}. La recherche inverse reçoit sa propre procédure ; l'inverse d'une approximation n'est pas automatiquement la vraie fonction inverse {cite:qanun-masudi-jundi-v1 scan pp.322,324}.

Le retour du sinus à l'arc mérite une attention séparée : l'auteur part du sinus inférieur le plus proche, retient son arc et utilise le sinus restant et les différences pour obtenir un incrément d'arc {cite:qanun-masudi-jundi-v1 scan p.322}. Échanger simplement les en-têtes de colonnes en préservant chaque opération ne suffit pas, parce que la quantité connue et le résidu requis ont changé. La différence précédente n'est pas non plus nulle du seul fait que la fenêtre affichée d'un lecteur commence à la ligne courante. Un voisin particulier est requis. Les limites d'affichage ne sont pas des bornes historiques de la table ; aucune règle pour une extrémité manquante ni aucune valeur de remplacement silencieuse n'est inventée. Cela explique les exigences des instructions, non un nouveau logiciel attribué à l'auteur.

## La diffusion

Le résumé de Rashed rapporte qu'al-Samaw'al a cité al-Biruni, examiné des procédures linéaires et non linéaires, comparé leurs résultats et essayé de les améliorer {cite:rashed-interpolation-1991 abstract}. C'est un témoin particulier d'une lecture et d'une discussion ultérieures, non une carte complète de la migration entre pays. Nous n'avons pas lu l'article complet ni le manuscrit pour cette entrée et n'inventons ni copistes ni dates d'école à partir de ce qui se trouve derrière son résumé.

Meijering décrit l'interpolation dans les sources arabes et persanes et de possibles influences indiennes, sans établir une identité automatique entre toutes les formules {cite:meijering-interpolation-2002 II.C}. La liste de diffusion ne contient aucune étape non étayée. Une influence possible n'est pas un lien de dépendance documenté ; consigner cette distinction est plus utile que de remplir une carte de flèches séduisantes mais non vérifiées.

## Sur quoi cela s'appuyait

La procédure utilise la connaissance des arcs et des sinus, la division du cercle, les tables, l'arithmétique sexagésimale et les différences entre lignes. L'auteur explique le choix de un et le compare avec un rayon de soixante {cite:qanun-masudi-jundi-v1 scan pp.301,323–324}. Ce choix ne fait pas de lui l'inventeur des fractions ni de tout usage des rapports.

Le travail indien antérieur est une part substantielle de l'histoire, non un arrière-plan décoratif. Cependant, les sources modernes n'autorisent pas un itinéraire certain et nommé de maître à élève pour chaque instruction particulière {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. Une tradition technique antérieure et un exemplaire connu parvenant à un lecteur connu sont des genres de preuve différents. La première seule n'établit pas le second, et ni l'une ni l'autre n'excuse d'ignorer l'algorithme réel qui est exposé.

## Ce qui s'est appuyé sur cela

Après avoir discuté des sinus et des ombres, l'auteur généralise explicitement le travail raffiné à toutes les tables : retenir une valeur, obtenir les voisins, ajuster la différence précédente selon les différences changeantes, puis calculer la contribution fractionnaire {cite:qanun-masudi-jundi-v1 scan pp.339–340}. Cela passe d'un exemple trigonométrique à une procédure plus large au sein du livre lui-même, non à la preuve d'un succès pour tout jeu de données imaginable.

La comparaison ultérieure d'al-Samaw'al est rapportée par le résumé de Rashed et lui reste attribuée {cite:rashed-interpolation-1991 abstract}. Aucune ligne n'est tracée directement vers chaque programme d'ordinateur ou satellite moderne. Des symboles modernes semblables ne peuvent pas prouver un chemin historique vers Newton. La ressemblance mathématique et la preuve qu'un texte est passé entre ses auteurs sont des questions séparées ; une chaîne d'enseignement ne devrait pas prétendre le contraire.

## Effets sur la vie quotidienne

Le bénéfice directement étayé concerne les utilisateurs de tables cherchant la valeur d'un angle non listé ou revenant d'une valeur à un angle, avec une explication de la raison pour laquelle une proportion unique peut ne pas suffire {cite:qanun-masudi-jundi-v1 scan pp.321–324,328–329}. Les passages inspectés ne comptent pas les foyers, les mosquées ou les voyages utilisant ce raffinement particulier. Aucun chiffre d'argent économisé, de temps de calcul ou de remplacement universel de tables plus anciennes n'est inventé.

La comparaison met au jour une distinction importante : une table peut avoir été calculée avec soin, tandis que l'approximation entre quand quelqu'un travaille entre ses lignes. Décrire un livre comme exact ne peut pas dispenser chaque opération ultérieure de l'examen de ses unités et de ses hypothèses. L'utilité pratique ici est un but de calcul documenté, non une enquête moderne sur l'adoption.

## Comment cela a changé l'histoire

Le témoin compte parce qu'une hypothèse arithmétique devient un objet de critique et d'explication. Al-Biruni ne se contente pas de donner des instructions ; il explique les différences inégales {cite:qanun-masudi-jundi-v1 scan pp.301–302,323}. Il n'est pas nécessaire de remplacer l'histoire des mathématiques par un récit de héros solitaire pour reconnaître cet accomplissement.

Le récit de Meijering place les contributions indiennes et chinoises à côté des sources arabes et persanes avant les développements européens ultérieurs {cite:meijering-interpolation-2002 II.B–II.C}. La succession chronologique seule ne prouve pas un contact entre chaque auteur et son successeur. Relire la formulation opératoire empêche aussi qu'une formule moderne familière soit projetée sur une procédure différente du seul fait que toutes deux utilisent des différences. C'est une valeur historique et éducative, sans mesure numérique inventée de ses conséquences.

## Qui l'a inventé ?

**Texte dans le cadre sunnite déclaré :** Cette entrée attribue l'exposé précis inspecté à al-Biruni, en conservant l'affiliation individuelle débattue de sa biographie plutôt que de faire de l'arithmétique une preuve confessionnelle {cite:qanun-masudi-jundi-v1 scan pp.321–324} {cite:tdv-biruni-tumer religious-affiliation}. Elle ne lui décerne pas la première interpolation du second ordre au monde.

**Lecture académique :** Meijering documente des méthodes indiennes antérieures ; le résumé de Rashed décrit quatre méthodes dont disposait al-Biruni, des contributions indiennes et les comparaisons d'al-Samaw'al {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. La comparaison avec Newton et Gregory dans l'introduction de l'édition reste une interprétation attribuée, non le constat de formules identiques ou d'une transmission directe vers eux {cite:qanun-masudi-jundi-v1 scan pp.40–42}. La priorité, la pluralité des méthodes et les détails de cette procédure particulière doivent rester distinguables.

## Aujourd'hui

Les visiteurs peuvent comparer des approximations sur papier sans télescopes ni logiciel. En `t=0` la procédure déployée garde la valeur initiale ; en `t=1` elle atteint la suivante. Des accroissements égaux la réduisent au calcul linéaire. Ce sont des conséquences algébriques de l'expression d'enseignement, non une expérience observée dans l'atelier d'al-Biruni {cite:qanun-masudi-jundi-v1 scan pp.339–340}.

L'accord aux extrémités ne garantit pas la connaissance entre elles ni la supériorité pour toute fonction. Comprendre des instructions et fournir une garantie numérique non établie par la recherche sont des accomplissements différents. Un lecteur peut s'interroger sur l'erreur, les limites de l'intervalle et les hypothèses avant d'admirer de nombreux chiffres. Le récit historique n'est pas une recommandation pour des tâches de navigation ou de mesure du temps exigeant une vérification indépendante.

## Exemples conservés

Nous avons lu des passages arabes choisis et inspecté les numérisations 301,322,323,340, correspondant aux imprimés 300,321,322,339. Les nouvelles citations utilisent explicitement les pages de la numérisation ; le numéro imprimé est inférieur d'une unité {cite:qanun-masudi-jundi-v1 scan pp.301,322–323,340}. Ce n'est pas une collation de manuscrits ni la lecture de chaque table, dont beaucoup sont brouillées dans le texte extrait.

L'image affichée est l'illustration moderne de DaBler du7 mars2010, explicitement versée dans le domaine public ; son rendu en 960×720 a été inspecté {cite:commons-quadratic-interpolation description,rights,image}. Elle montre une parabole passant par trois échantillons, un maximum marqué et un panneau inférieur de différence/pente. C'est une comparaison conceptuelle, non les poids exacts de cette règle ni la preuve qu'al-Biruni a tracé une dérivée moderne {cite:commons-quadratic-interpolation code}. Les numérisations, le texte extrait et les fichiers binaires originaux restent hors du dépôt.

## Dans la culture

Le passage combine un langage géométrique et des instructions pour les calculateurs. L'auteur choisit des noms concis pour les arcs et leurs compléments afin de prévenir la confusion et discute du labeur d'une tabulation plus fine {cite:qanun-masudi-jundi-v1 scan pp.302,321}. Cela montre comment un savoir pratique est présenté dans un livre, non que chaque lecteur historique l'ait compris ou utilisé de manière identique.

L'illustration moderne emploie du bleu, du rouge et des axes tracés, un langage pédagogique bien plus tardif qui n'est pas attribué au manuscrit {cite:commons-quadratic-interpolation image,code}. Placer les deux approches ensemble n'est utile que lorsque leur distance est expliquée. L'élégance du dessin d'aujourd'hui ne doit pas devenir la preuve d'un original historique non examiné ni d'une notation que l'auteur n'a jamais utilisée dans le passage lu.

## Pour les jeunes lecteurs

Écris les positions−1,0,1 sur du papier, avec les valeurs1,2,2.5 en dessous. Le premier accroissement est 1, le suivant0.5. À mi-chemin entre la position du milieu et la dernière, l'estimation linéaire est 2.25. Mélange les deux accroissements à parts égales pour obtenir0.75, prends-en la moitié et ajoute-la à 2 : le résultat est 2.375. Ces nombres de jeu inventés illustrent la suite d'instructions, non des mesures historiques {cite:qanun-masudi-jundi-v1 scan pp.339–340}.

Garde cachée la valeur intermédiaire inconnue et ne choisis pas de gagnant : les cartes seules ne la donnent pas. Essaie des accroissements égaux et remarque l'accord. Un stylo et du papier suffisent ; n'observe pas le Soleil et ne pointe pas de télescope vers lui. Ne demande pas quel nombre paraît le plus joli, mais quelle hypothèse y a conduit.

## Références

- [[source/qanun-masudi-jundi-v1|Qanun al-Mas'udi, vol.1]], lecture choisie de pages de la numérisation et inspections d'images précisées ; la numérotation imprimée est inférieure d'une unité.
- [[source/meijering-interpolation-2002|Meijering, A Chronology of Interpolation]],II.B–II.C, article effectivement hébergé par l'auteur.
- [[source/rashed-interpolation-1991|Rashed, al-Samaw'al, al-Biruni and Brahmagupta]], résumé de l'éditeur seulement, non l'article complet.
- [[source/britannica-al-biruni|Britannica]] et [[source/tdv-biruni-tumer|Tümer]], identité individuelle et classifications confessionnelles rapportées.
- [[source/commons-quadratic-interpolation|Illustration de DaBler et droits]], comparaison moderne dans le domaine public.
- [[source/nallino-albatenii-opus-astronomicum|Édition d'al-Battani par Nallino]], frontière avec l'entrée antérieure sur la méthode linéaire.
