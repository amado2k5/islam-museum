---
id: invention/ibn-yunus-solar-time-tables
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/ibn-yunus-solar-time-tables.md}
---

## Résumé

L'altitude solaire seule ne peut pas nous indiquer combien de lumière du jour s'est écoulée : la réponse varie selon le lieu et la saison. [[person/ali-ibn-yunus-al-munajjim|Ibn Yunus al-Sadafi]] a contribué à un corpus du Caire composé de tables sphériques dérivant le temps et l'azimut de l'altitude solaire et de la position annuelle. David King décrit cela comme une contribution majeure tout en avertissant que la collection survivante comprend des ajouts ultérieurs qui ne peuvent pas tous être attribuables à Ibn Yunus {cite:ibn-yunus-king-bea timekeeping corpus}.

Nous enregistrons un outil informatique, non l'invention du temps, le premier cadran solaire ou une horloge à pendule. Les trois ensembles principaux de tableaux ne sont pas non plus considérés comme trois inventions : ils forment un programme connecté pour des problèmes astronomiques connexes. Des couches d'auteur appartiennent à l'histoire, non pas sous une affirmation trompeuse selon laquelle toutes les tables lui appartenaient.

## Ce que c'est

L'outil a deux arguments : altitude solaire et longitude solaire, donnant des quantités telles que le temps depuis le lever du soleil, le temps restant jusqu'à midi, ou l'azimut. La longitude solaire est une position sur l'écliptique, et non la longitude géographique de l'utilisateur. King décrit trois ensembles principaux, chacun dépassant 10 000 entrées dans le corpus survivant ; ce ne sont pas 10 000 observations documentées individuellement par Ibn Yunus {cite:ibn-yunus-king-bea main tables}.

« Sphérique » signifie que le calcul concerne la géométrie du ciel vue depuis une position terrestre. Le triangle plan accompagnant ne peut pas représenter toutes les variables. Le tabulage des résultats modifie le travail de calcul de l'utilisateur mais n'élimine pas la nécessité d'identifier des arguments, unités et conventions.

## Le monde devant lui

Le calcul du temps, les cadrans solaires et les observations ont précédé Ibn Yunus. King relie son œuvre à Mumtahan Zij de Yahya ibn Abi Mansur, préparé à Bagdad près de deux siècles plus tôt. TDV décrit son étude de Habash, al-Battani, al-Nayrizi et d'autres. Ils forment un réseau de prédécesseurs, pas une seule origine célèbre {cite:ibn-yunus-king-bea Mumtahan discussion} {cite:tdv-ibn-yunus-dizer predecessors}.

Les listes d'observation et le calcul planétaire ne sont pas automatiquement les mêmes que les tables de chronométrage. La distinction ici consiste à préparer un outil à deux arguments pour un problème de temps solaire dans un contexte du Caire, et non simplement à écrire des chiffres ou à remarquer le mouvement apparent du Soleil. Nous n'ajoutons aucune dépendance spécifique à un enregistrement antérieur de la table d'ombres simplement parce que les deux concernent la lumière solaire.

## L'histoire

King et Dizer considèrent la date de naissance comme inconnue, malgré le fait que l'en-tête de MacTutor affiche 950. Il vécut à Fustat, assista à la conquête fatimide et à la fondation du Caire alors qu'il était jeune homme en 969, et reçut le soutien d'al-Aziz puis d'al-Hakim. Les observations enregistrées se poursuivirent jusqu'en 1003 ; il mourut en 1009 {cite:ibn-yunus-king-bea biography} {cite:tdv-ibn-yunus-dizer biography} {cite:ibn-yunus-mactutor biography}.

La fin ouverte à vie du registre ne date que sa contribution individuelle, et non l'intégralité du corpus survivant avec des ajouts des XIIIe et XIVe siècles. Le registre de décès antérieur du créateur reste inchangé. Ni une copie ultérieure ni l'année d'une édition moderne ne constituent la date de composition des tableaux originaux.

## Le(s) fabricant(s)

O'Connor et Robertson identifient individuellement Ibn Yunus comme un mathématicien islamique. Cela fournit une base musulmane enregistrée. Sunnite est séparément le cadre du musée, non déduit de la famille, du nom arabe ou de l'affiliation personnelle des mécènes fatimides. Le parrainage politique ne certifie pas la secte {cite:ibn-yunus-mactutor summary} {cite:tdv-ibn-yunus-dizer biography} d'un érudit individuel.

Son rôle est celui d'améliorer et de contribuer. TDV attribue quelques tables ultérieures à al-Maqsi, tandis que King note explicitement la difficulté de déterminer combien Ibn Yunus a calculé. On ne peut pas tous intégrer les copistes et les contributeurs ultérieurs dans lui. Une suggestion selon laquelle des calculateurs professionnels ont assisté ne produit pas non plus une liste d'équipe vérifiée {cite:tdv-ibn-yunus-dizer work1} {cite:ibn-yunus-king-bea timekeeping corpus} {cite:ibn-yunus-mactutor support discussion}.

## Comment ça fonctionne

Notre explication est moderne, et non une affirmation selon laquelle l'auteur aurait dérivé cette équation symbolique. Soit phi la latitude, la déclinaison solaire delta, l'altitude solaire h et la distance angulaire H par rapport au méridien. Dans notre modèle sphérique, `sin(h)=sin(phi)sin(delta)+cos(phi)cos(delta)cos(H)`. La latitude géographique, la déclinaison solaire et la hauteur au-dessus de l'horizon sont des grandeurs différentes.

Choisissez une latitude de 30 degrés, correspondant à un paramètre historique de corpus rapporté par King, et choisissez la déclinaison zéro pour l'enseignement. Dans ce cas équinoctial simplifié, `cos(H)=sin(h)/cos(30°)`. Nous supposons un horizon idéal et excluons la réfraction atmosphérique et la taille du disque du Soleil. Ce n'est ni une procédure d'observation ni un horaire quotidien {cite:ibn-yunus-king-bea corpus parameters} utilisable.

Sur la branche du matin, une altitude de 30 degrés donne `cos(H)=1/sqrt(3)`, donc H est approximativement 54,736 degrés. À 15 degrés par heure solaire égale, il reste environ 3,649 heures jusqu'à midi. Notre demi-journée équinoctiale est de six heures, laissant environ 2,351 heures depuis le lever du soleil. Ce sont des valeurs modernes vérifiées indépendamment, pas des cellules lues d'un manuscrit.

À 45 degrés d'altitude, `cos(H)=sqrt(2/3)` : il reste environ 2,351 heures et 3,649 heures se sont écoulées. À midi, H est zéro et l'altitude 60 degrés, pas 90. Cela montre le rôle de la latitude. L'altitude ne correspond pas simplement aux heures écoulées, et le Soleil n'est pas au-dessus de chaque observateur à midi.

La même altitude peut se produire avant et après midi, il faut donc sélectionner une branche. Une déclinaison solaire changeante modifie la durée de la lumière du jour et les limites d'altitude au même endroit. La conversion de l'horloge civile introduit d'autres conventions, notamment le fuseau horaire et l'heure solaire apparente versus l'heure solaire moyenne. Notre modèle n'effectue pas ces conversions en silence.

MacTutor rapporte que la précision des tables a conduit King à suggérer une interpolation non linéaire. C'est une inférence d'un chercheur, pas une preuve que nous avons retrouvé l'algorithme d'Ibn Yunus. Ni l'article original de King en 1973 ni la grille manuscrite n'ont été lus ici ; choisir une règle d'interpolation moderne ne l'établirait pas comme la sienne {cite:ibn-yunus-mactutor solar-time-table discussion}.

## La diffusion

King rapporte l'utilisation du corpus du Caire jusqu'au XIXe siècle et l'inspiration pour les tables de Taiz d'Abu al-Uqul et les tables de Damas d'al-Khalili. Il s'agit d'un récit d'historien spécialisé, pas de notre recensement indépendant de chaque copie ou utilisateur. La pratique continue ne signifie pas que chaque cellule numérique soit restée inchangée {cite:ibn-yunus-king-bea corpus reception}.

Les manuscrits diffèrent dans l'ordre et la sélection. Un ordre différent ne fait pas de chaque copie une nouvelle composition, et la ressemblance n'attribue pas toutes les parties au premier contributeur. Le récit étalé reste donc descriptif plutôt que de fabriquer certaines arêtes causales à chaque ville mentionnée dans les études.

## Sur quoi elle a été bâtie

Le calcul nécessite des grandeurs sphériques, des conventions de temps et de position, des tables et des paramètres. King rapporte une latitude du Caire de 30 degrés et une obliquité de 23 degrés 35 minutes pour le corpus. Ce sont des paramètres historiques, non recommandés de coordonnées modernes pour chaque voisinage {cite:ibn-yunus-king-bea corpus parameters}.

L'obliquité n'est pas une déclinaison solaire chaque jour : elle aide à définir la plage annuelle de cette quantité changeante. Choisir le delta zéro n'efface pas l'obliquité historique ; cela sélectionne un exemple scolaire. Rendre explicites les hypothèses compte plus que d'afficher de nombreux chiffres inexpliqués.

## Ce qui a été construit dessus

King décrit des tableaux sphériques subsidiaires, dont certains concernent les cinq prières quotidiennes. TDV explique que Ghayat al-intifa fut un titre ultérieur pour une compilation incorporant les tables d'Ibn Yunus et d'autres. Le [[work/cairo-solar-time-corpus|corpus est donc enregistré comme superposé]], pas un seul livre entièrement en sa main {cite:ibn-yunus-king-bea subsidiary tables} {cite:tdv-ibn-yunus-dizer work1}.

Le Hakimi Zij est plus large, couvrant les observations, les planètes et les calendriers. Les tableaux lunaires discutés séparément par MacTutor, avec plus de 34 000 entrées et une attribution incertaine, constituent un autre sujet. Leur nombre ne doit pas migrer dans les calendriers. Différentes applications ne justifient pas non plus de diviser un exemple en totaux d'inventions gonflés {cite:ibn-yunus-mactutor lunar-table discussion}.

## Impact sur la vie quotidienne

La recherche relie la mesure du temps astronomique aux exigences quotidiennes et religieuses. Expliquer cela n'est pas émettre des horaires de prière ni une décision légale. Nous présentons un instrument de calcul et ses hypothèses, non un remplacement à un calendrier approuvé. Les sources ne fournissent ni le nombre d'utilisateurs pour chaque ensemble ni les économies de temps quantifiées {cite:ibn-yunus-king-bea timekeeping corpus} {cite:tdv-ibn-yunus-dizer timekeeping discussion}.

Sa valeur éducative consiste à voir un problème passer de la géométrie céleste à deux entrées et à une réponse numérique. Beaucoup de chiffres nécessitent encore d'interprétation : le temps est-il mesuré depuis le lever du soleil ou jusqu'à midi, et sur quelle branche ? Un mal en-tête de colonne peut gâcher l'utilisation d'un tableau correctement calculé.

## Comment cela a changé l'histoire

Le corpus représente un effort visant à transformer des problèmes sphériques complexes en une aide informatique réutilisable. King décrit environ des centaines de pages et de grands ensembles numériques tout en qualifiant l'attribution. L'échelle ne constitue pas la preuve d'un ordinateur perdu ou d'une méthode algébrique dont la source n'a jamais été décrite {cite:ibn-yunus-king-bea corpus scale and authorship}.

Cette réussite diffère de l'affirmation selon laquelle Ibn Yunus aurait inventé la mesure du temps par pendule. MacTutor rejette toute preuve de son utilisation du pendule et rapporte la retrace du mythe par King jusqu'à un récit européen ultérieur. La contribution à la table mérite d'être soulignée sans ajouter d'instrument non attesté {cite:ibn-yunus-mactutor pendulum discussion}.

## Qui l'a inventé ?

« La contribution d'Ibn Yunus au corpus du Caire » est plus précise que « toutes les tables du Caire étaient son invention ». L'association est forte dans la lecture scientifique, mais l'attribution des tables individuelles est incertaine et des ajouts ultérieurs sont connus. Affirmer cela ne diminue pas sa contribution ; cela empêche d'attribuer des générations de travail à une seule personne {cite:ibn-yunus-king-bea timekeeping authorship} {cite:tdv-ibn-yunus-dizer work1}.

Nous ne revendiquons pas non plus une priorité globale dans chaque calcul du temps. Cet enregistrement identifie un problème particulier, un cadre de calcul et des preuves énoncées, et non la première utilisation de la lumière du soleil ou du temps. « Outil » signifie ici organisation numérique, et non un mécanisme survivant dans une vitrine.

## Aujourd'hui

Les programmes modernes retournent rapidement le temps et l'azimut, mais cela ne prouve ni une descendance directe du corpus ni des définitions identiques du temps. Un exemple moderne aide les lecteurs à comprendre les entrées avant d'examiner la sortie. Nous ne calculons pas la réfraction, ni un horizon ou un fuseau horaire réel, ni nous masquons ces différences.

L'image est le triangle rectangle plan moderne de TheOtherJesse, rendu public en 2007. Elle rappelle les côtés et les angles mais ne représente pas un triangle sphérique complet, ni la page de tableau d'Ibn Yunus ni un observatoire équipé {cite:commons-trigonometry-triangle Description and licensing}.

## Exemples conservés

King cite d'importants manuscrits de corpus de Dublin et du Caire, ainsi que de nombreux témoins présentant des sélections et des agencements différents. Ils se distinguent des fragments de Hakimi Zij à Leiden, Oxford et Paris. Nommer les dépôts ne signifie pas que nous ayons ouvert leurs manuscrits ou comparé les valeurs des lignes {cite:ibn-yunus-king-bea corpus manuscripts and Hakimi fragments}.

Les manuscrits de chronométrage et l'étude originale de 1973 n'ont pas été lus ici. Nos sources définies sont la biographie savante de King, l'entrée de Dizer et MacTutor, toutes lues intégralement. Nous affirmons ne pas avoir eu lieu d'inspection directe et ne datons pas chaque couche d'une copie tardive.

## Dans la culture

Les sources racontent une distournance, l'astrologie et une prédiction de sa mort. Ce sont des histoires attribuées, non un diagnostic de personnalité ni une validation de l'astrologie. Le patronage ne juge pas non plus les croyances personnelles du chercheur ni ne garantit tous ses résultats {cite:ibn-yunus-king-bea biographical anecdotes} {cite:tdv-ibn-yunus-dizer biography}.

King et Dizer mettent en garde contre l'image familière d'un « observatoire bien équipé » : les descriptions des instruments et des sites d'observation ne l'établissent pas. Nous racontons l'histoire du calcul sans inventer un observatoire ni dessiner du matériel inconnu simplement parce que les mesures nécessitaient théoriquement du matériel {cite:ibn-yunus-king-bea observatory caution} {cite:tdv-ibn-yunus-dizer instruments}.

## Pour les jeunes lecteurs

Imaginez des cartes posant deux questions différentes : « Combien de temps depuis le lever du soleil ? » et « Combien de temps avant midi ? » Dans notre exemple de journée de 12 heures, les réponses du matin totalisent six heures. Ne soustrayez pas une à 24 ni ne la comparez directement à une horloge de téléphone : les significations et les points de référence diffèrent.

Lisez le titre de chaque colonne avant son numéro. Demandez si le modèle correspond à un lieu et un jour choisis ou à n'importe où. Vouloir connaître l'heure n'est jamais une permission de regarder le Soleil ou de tester la vue. Le papier suffit. Les sources soutiennent l'histoire ; une écriture soignée ne transforme pas nos chiffres scolaires en preuves anciennes.

## Références

- {cite:ibn-yunus-king-bea complete biography and selected references}
- {cite:tdv-ibn-yunus-dizer main entry and bibliography}
- {cite:ibn-yunus-mactutor complete biography}
- {cite:commons-trigonometry-triangle Description and licensing}
