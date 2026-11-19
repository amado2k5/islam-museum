---
id: invention/haytham-factorial-remainders
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/haytham-factorial-remainders.md}
---
## Résumé

MacTutor présente [[person/ibn-al-haytham|Ibn al-Haytham]] en considérant un nombre qui laisse le reste1 à la division par 2,3,4,5 et 6, mais qui est divisible par 7. Elle explique une construction multipliant les entiers consécutifs et ajoutant un :6 !+1=721. Il s'agit d'une contribution particulière en théorie des nombres, pas de l'invention de chaque problème de restes ou de chaque ensemble de conditions simultanées {cite:haytham-mactutor number-theory}.

Le récit invoque ce qu'on appelle aujourd'hui le théorème de Wilson et rapporte une seconde méthode donnant toutes les solutions, sans en reproduire les détails. Nous distinguons ce rapport de la famille moderne indépendante du musée 301+420j. 721 n'est pas non plus la réponse la moins positive : 301 est plus petit et remplit exactement les mêmes conditions {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem eq1}.

## Ce que c'est

Un reste est ce qui reste après suppression d'un nombre entier de multiples du diviseur. Dire que 721 laisse 1 à la division par 6 signifie 721=6×120+1, pas que son quotient soit 1. Le problème nécessite plusieurs conditions à la fois. Remplir une seule condition n'est pas une solution entièrement vérifiée {cite:haytham-mactutor number-theory}.

Factoriel est notre abrégation moderne pour multiplier les entiers positifs successifs : 6 !=1×2×3×4×5×6=720. Le point d'exclamation est une notation mathématique, pas une ponctuation copiée de l'original d'Ibn al-Haytham. Nous expliquons la relation dans un langage accessible aujourd'hui tout en gardant la construction historique rapportée séparée de notre manière de la vérifier {cite:weisstein-wilson-theorem definition}.

## Le monde devant lui

MacTutor qualifie le problème de cas particulier du théorème chinois du reste. Il serait donc erroné de créditer à Ibn al-Haytham chaque idée de combiner les conditions de division. Ce document identifie une construction factorielle spécifique au sein d'une tradition plus large du problème. Les fondations antérieures n'effacent pas une contribution ultérieure, mais empêchent une histoire d'une personne partant de rien {cite:haytham-mactutor number-theory}.

Cette question diffère également de sa [[invention/ibn-al-haytham-fourth-power-volumes|méthode du volume à quatrième puissance]] et du [[invention/ibn-al-haytham-circular-reflection|problème du point de réflexion circulaire]]. Nous ne comptons pas une contribution à plusieurs reprises sous des noms différents. Ici, les contraintes concernent des entiers, et non une surface optique ou un volume. Travailler entre sujets n'établit pas en soi un transfert direct d'une méthode particulière entre eux {cite:haytham-mactutor number-theory}.

## L'histoire

MacTutor fait référence à Opuscula et utilise une traduction dans l'étude de Rashed avant de décrire deux méthodes. Il explique la première construction et dit que la seconde fournit toutes les solutions de ce type. Nous lisons ce récit, non l'original arabe ni l'édition complète de Rashed. Nous n'inventons ni un titre de traité arabe ni une identité de livre ancien à partir d'une étiquette de collection moderne {cite:haytham-mactutor Opuscula}.

Le passage ne donne aucune séance d'enseignement ni salle d'écriture datée de manière sûre. La vie de l'auteur à la fin du Xe et au début du XIe siècle reste un large horizon ; Le Caire est un contexte biographique, et non un site de composition confirmé pour cette question. Une date associée au Livre d'optique n'est pas automatiquement une date pour toutes les autres idées numériques {cite:haytham-mactutor biography-and-number-theory} {cite:tdv-ibnul-heysem biography}.

## Le(s) fabricant(s)

La base identitaire individuelle existante de l'auteur, tirée de l'ouverture de l'Optique et de TDV, est conservée parallèlement au cadre sunnite déclaré séparément. Nous n'en déduisons aucune nouvelle dénomination de son emploi égyptien ni d'un calcul réussi. Cette séance n'est pas une nouvelle enquête critique de chaque texte biographique {cite:manazir-sabra-1983 p.60} {cite:tdv-ibnul-heysem biography}.

Wilson est le nom moderne associé au résultat arithmétique. MathWorld discute de Wilson, Waring, des connaissances antérieures de Leibniz et de la démonstration de Lagrange ; MacTutor décrit un usage antérieur par Ibn al-Haytham. Les deux récits historiques restent visibles sans inventer un parcours direct manuscrit à manuscrit ni attribuer toute l'histoire à une seule personne {cite:weisstein-wilson-theorem history} {cite:haytham-mactutor number-theory}.

## Comment ça fonctionne

Tout entier de 2 à 6 est un facteur de 720. La division de 720 par l'un d'eux laisse 0, donc la division de 721 laisse 1. Cela seul n'établit pas la divisibilité par 7. Le résultat désormais appelé théorème de Wilson fournit la condition première : pour primep, le nombre(p−1) !+1 est divisible byp. Ici721=7×103 {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory}.

Cela ne fait pas de 721 une prime : ses facteurs7 et 103 montrent le contraire. La condition première concerne sp, pas la réponse construite. Et non plus7 ne peut-elle pas être remplacée silencieusement par un composite arbitraire : pour 4, la construction3 !+1 donne 7, qui n'est pas divisible par 4. Une formule valable sous une hypothèse ne peut pas être utilisée après que cette hypothèse ait été écartée {cite:weisstein-wilson-theorem definition-and-composite-exception}.

Voici une dérivation moderne indépendante de toutes les réponses positives, et non une récupération de la deuxième méthode historique. Le multiple commun le plus bas de 2 à 6 est 60, donc N=60k+1. Puisque 60 laissent le reste4 en division par 7, nous avons besoin de 4k+1 divisible par 7. Cela requiert k=5+7j, ce qui donne N=301+420j.

Takej comme un entier non négatif pour les réponses positives. Les premiers sont 301,721 et 1141. Par exemple, 301=5×60+1=7×43, tandis que 721=12×60+1=7×103. Lister quelques réponses ne prouve pas à lui seul l'exhaustivité. Ici, la complétude vient de la réduction des conditions à N=60k+1 et de la résolution de la condition restante modulo7, plutôt que d'arrêter une recherche à un nombre attractif.

L'incrément 420 explique la répétition : il est divisible par 60 et 7, préservant tous les restes requis. Ajouter seulement 7 à 721 donne 728, toujours divisible par 7 mais laissant 2 plutôt que 1 en division par 6. Ajouter 60 préserve les conditions antérieures, et non automatiquement la condition pour 7. Un incrément arbitraire ne produit donc pas d'autre réponse. Cela vérifie la période commune dans notre solution moderne, pas une liste trouvée dans un manuscrit ou une preuve que notre formulation reproduit la deuxième méthode historique. Préserver une contrainte diffère de préserver l'ensemble du système.

## La diffusion

Les sources lues ici ne fournissent aucun chemin manuscrit reliant directement l'auteur à Wilson. Un nom moderne et un résultat plus ancien n'établissent ni la copie, ni la traduction ni la citation. Les rapports restent attribués à leurs sources, et un lien de transmission non documenté ne devient pas une flèche sûre dans un diagramme {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

Signaler une seconde méthode ne permet pas non plus d'établir son adoption dans chaque école ou chaque marché. Une application possible n'est pas une statistique historique de circulation. Les explications modernes sont des preuves de l'enseignement actuel ; les relier à un ancien programme particulier nécessiterait des preuves absentes des passages consultés ici.

## Sur quoi elle a été bâtie

Les ingrédients immédiats sont la multiplication des entiers et l'ajout d'un, avec une condition particulière pour le diviseur final. Sans cette condition finale, les réponses de la forme 60k+1 restent, plutôt qu'un nombre unique. Les facteurs répétés font de 720 un multiple commun approprié, mais pas le multiple le moins commun. Multiplier tout n'est pas toujours la construction la plus courte {cite:haytham-mactutor number-theory}.

Nous utilisons 60 dans l'explication moderne car il combine les conditions pour les diviseurs2 à 6. Ces diviseurs ne sont pas copremiers par paires : 2,4 et 6 ont des facteurs communs. Nous ne devons pas appliquer silencieusement une formule restreinte aux modules pair-coprimes. Identifier la structure réelle compte plus que d'invoquer le nom du théorème général.

## Ce qui a été construit dessus

MathWorld énonce le théorème moderne comme une condition de primalité nécessaire et suffisante forp>1. Cette explication moderne n'est pas une annonce que nous avons trouvée pleinement démontrée dans l'original d'Ibn al-Haytham. Utiliser un résultat, le démontrer et concevoir un test pratique rapide à partir de celui-ci sont des affirmations distinctes {cite:weisstein-wilson-theorem definition} {cite:haytham-mactutor number-theory}.

Pour l'enseignement, on peut multiplier étape par étape tout en ne conservant que le reste actuel, évitant ainsi d'énormes entiers écrits. C'est une manière moderne de vérifier des exemples, pas un algorithme informatique attribué à l'auteur médiéval. Une arithmétique similaire n'établit pas de lignée directe avec chaque logiciel ou application cryptographique actuelle.

## Impact sur la vie quotidienne

Les passages consultés ne mentionnent aucun gain de temps ni contrat des marchands appliquant cet exemple. La contribution étayée concerne la recherche sur les conditions numériques simultanées et les solutions multiples. Nous n'inventons aucune anecdote commerciale pour faire de l'arithmétique un ancien dispositif quotidien ; une question n'a pas besoin d'un retour financier mesuré pour mériter une explication {cite:haytham-mactutor number-theory}.

Le lecteur d'aujourd'hui tire une leçon claire : une bonne réponse n'a pas besoin d'être la plus petite, et une seule réponse n'est pas chaque réponse. Une méthode constructive peut produire un grand nombre facilement vérifiable tandis que reformuler les conditions donne une description plus courte de l'ensemble de la famille. C'est une leçon tirée des points 301 et 721, pas une preuve du motif économique personnel de l'auteur.

## Comment cela a changé l'histoire

Le problème rend visible les mathématiques non optiques de l'auteur : des entiers soumis à des contraintes simultanées, pas seulement des miroirs et des yeux. Pourtant, la renommée de l'optique ne s'avère pas prioritaire dans tous les autres sujets. L'attribution ici reste limitée à une construction particulière décrite dans le récit historique {cite:haytham-mactutor number-theory}.

Il sépare également construction, vérification et complétée. On peut construire 721, vérifier chaque condition, puis demander des réponses plus petites et toute la famille. Ce sont des tâches différentes. Rapporter une seconde méthode montre que le récit historique ne s'arrête pas à produire le premier nombre. Nous ne remplissons pas ses détails manquants par une preuve moderne et ne dissimulons pas la substitution {cite:haytham-mactutor Opuscula}.

## Qui l'a inventé ?

**Cadre sunnite déclaré :** La base identitaire individuelle existante d'Ibn al-Haytham est conservée, et non déduite de l'arithmétique. **Compte rendu académique :** MacTutor décrit la construction et l'utilisation antérieures ; MathWorld décrit le nom du théorème et l'histoire européenne ultérieure. Aucun n'établit sa propre voie de transmission directe ni ne fait d'un nom moderne la limite de l'histoire de l'idée {cite:tdv-ibnul-heysem biography} {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

« Amélioration » protège la limite de l'attribution : pas le premier théorème chinois du reste, ni le premier calcul factoriel ni tous les calculs de congruence. Nous ne revendiquons ni lecture du texte original ni jugement final sur chaque question prioritaire. Ce que nous pouvons montrer, c'est une construction particulière, ses limites et une affirmation moderne qui aide les lecteurs à la vérifier.

## Aujourd'hui

L'image présente deux horloges grises marquées 0,3,6,9, avec +4h entre elles. L'aiguille passe de 9 à 1:9+4=13, ce qui laisse 1 modulo 12. Il s'agit d'une analogie moderne pour l'arithmétique cyclique, et non de l'horloge d'Ibn al-Haytham ni d'une illustration manuscrite. Ce n'est pas non plus le problème de prime7 lui-même : 12 est composite {cite:commons-clock-group-spindled current-image}.

La congruence ne signifie pas 13=1 en tant que nombres entiers ordinaires. Cela signifie qu'ils laissent le même reste en division par 12. L'arithmétique des restes n'efface pas la différence entre les nombres. L'image aide à expliquer le vocabulaire, pas à démontrer toutes les propriétés des nombres premiers nécessaires par la construction factorielle {cite:commons-clock-group-spindled description}.

## Exemples conservés

Nous avons lu les passages spécifiés de MacTutor ainsi que la définition, la première formule et le paragraphe historique de MathWorld. Nous n'avons pas lu l'Opuscula original ni l'édition complète de Rashed, et n'en déduisons pas d'identifiant de manuscrit arabe à partir de cette étiquette. Ne pas créer ici un nouveau registre de travail préserve cette frontière ; cela n'affirme pas que l'auteur n'a rien écrit sur le problème {cite:haytham-mactutor Opuscula}.

L'image Commons et les droits réels ont été inspectés. Spindled a effectué le téléchargement original le 19 octobre 2006 ; la version actuelle inclut une correction d'alignement de texte a2008 et porte CC BY-SA3.0. Le SVG original actuel est publié sans modification. Les dates de mise en ligne ne datent pas les mathématiques anciennes ni ne prouvent l'existence d'une horloge historique survivante de cette apparence {cite:commons-clock-group-spindled description-rights}.

## Dans la culture

Une histoire d'invention peut privilégier un seul nom, une scène triomphante et un numéro final. Cette question devient plus riche lorsqu'une réponse particulière reste distincte d'une description générale, et le nom d'un théorème à partir de ses usages antérieurs. Ce n'est pas un jugement contre des mathématiciens nommés ; c'est la manière dont le musée montre ce que les preuves établissent ou ne démontrent pas {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

L'explication n'a besoin ni d'un portrait imaginaire ni d'un rassemblement pédagogique fictif. Lisez les conditions, vérifiez-les à nouveau, et reconnaissez que l'image à deux horloges appartient à une autre période. Une comparaison explicitement déclarée enseigne sans faire prétendre à un atout éducatif moderne de documenter une scène ancienne.

## Pour les jeunes lecteurs

Écrivez 721 et divisez par 2,3,4,5,6, puis 7. Notez les restes, pas seulement les quotients. Répétez avec 301. Le nombre le plus petit remplit également les conditions. Ne vous arrêtez pas à la première réponse correcte ni ne la considérez comme la plus petite sans recherche ou preuve.

Maintenant, try7, obtenu à partir de 3 !+1 : est-ce divisible par 4 ? Non. Demandez quelle hypothèse diffère de l'exemple original de prime7. L'horloge moderne n'était pas nécessairement entre les mains de l'auteur ; ce n'est qu'une analogie du reste. Les preuves historiques et l'arithmétique d'aujourd'hui se rencontrent sans devenir la même chose {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory}.

## Références

- MacTutor : problème de reste rapporté et construction {cite:haytham-mactutor number-theory}.
- MathWorld : formule, histoire et condition de primalité {cite:weisstein-wilson-theorem eq1-and-history}.
- TDV : cadre de l'auteur, pas site de composition vérifié {cite:tdv-ibnul-heysem biography}.
- Biens communs : image moderne et droits {cite:commons-clock-group-spindled description-rights}.
