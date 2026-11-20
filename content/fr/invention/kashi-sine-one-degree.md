---
id: invention/kashi-sine-one-degree
lang: fr
source_lang: en
translators: ['Claude (claude-fable-5-2), draft translation']
status: { review: published }
provenance: {generated_by: 'Claude Code subagent (spanish lane, records the document services could not return intact)', model: claude-fable-5-2, run: claude-fr-2026-11-19, source: content/en/invention/kashi-sine-one-degree.md}
---

## Résumé

Le sinus d'un degré n'est pas le degré lui-même, et l'amélioration de son calcul n'a pas inventé la trigonométrie. Le travail de [[person/al-kashi|Ghiyath al-Din al-Kashi]] associé au [[work/risala-watar-jayb-kashi|Treatise on the Chord and Sine]] a approché une petite valeur avec une haute précision. MacTutor décrit une équation cubique et une méthode numérique itérative. Cela diffère de son [[invention/al-kashi-pi-calculation|calcul de la circonférence]] : ici un rapport de côtés, là une circonférence divisée par un diamètre {cite:kashi-mactutor final treatise}.

Notre attribution est une amélioration, non une origine absolue. MacTutor reconnaît le traitement approximatif antérieur d'al-Biruni ; les sources décrivent différemment l'achèvement, le rôle de Qadi Zada et la précision. Nous conservons ces limites, puis proposons un exemple explicatif moderne. Nous n'avons pas lu l'algorithme original ni collationné ses chiffres avec un manuscrit {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

## Ce que c'est

Dans un triangle rectangle, le sinus d'un angle aigu est le côté opposé divisé par l'hypoténuse. Le rapport n'a pas d'unité de longueur et survit à l'agrandissement sans changer la forme du triangle. « Corde » dans le titre rappelle aussi la géométrie du cercle, mais corde et sinus ne sont pas des termes interchangeables dans toutes les conventions historiques. La TDV identifie le calcul précis d'un degré comme un sujet de ce traité {cite:tdv-kashi-okten work8}.

Le résultat n'est pas dix-sept chiffres lus sur une règle. Des relations et une arithmétique successive le produisent. Iranica rapporte un développement décimal de dix-sept chiffres, tandis que d'autres récits résument l'exactitude différemment. Nous ne transformons pas ces rapports en certification indépendante de chaque chiffre, et ne prétendons pas qu'une observation du ciel possédait la même précision qu'une valeur calculée {cite:iranica-kashi sine computation} {cite:qadi-zada-mactutor original work}.

## Le monde d'avant

Les sinus, les cordes et les tables ont précédé al-Kashi. Le [[invention/battani-sine-table-methods|calcul de la table des sinus d'al-Battani]] du musée fournit un contexte antérieur, non la preuve qu'un exemplaire particulier est parvenu à al-Kashi. MacTutor nomme al-Biruni comme prédécesseur dans les solutions approchées de la cubique de la trisection de l'angle. C'était un problème hérité, non une question soudainement créée à Samarcande {cite:kashi-mactutor final treatise}.

Une table et une méthode pour extraire une valeur de base sont des choses différentes. Une opération peut interpoler entre des cellules existantes ; une autre améliore les valeurs à partir desquelles une table est construite. Nous ne comptons pas séparément chaque usage du sinus. Cette notice concerne une contribution numérique particulière associée à une œuvre nommée, non une nouvelle étiquette pour toute la trigonométrie, les tables de sinus antérieures ou la mesure du temps {cite:tdv-kashi-okten work8} {cite:iranica-kashi sine computation}.

## L'histoire

Les biographies placent al-Kashi dans le milieu savant de [[place/samarqand|Samarcande]] sous Ulugh Beg : livres, calculs, instruments et discussions. Les lettres à son père offrent ses jugements sur ses collègues, non un classement neutre que le musée endosse. Assister à la même réunion n'établit pas une co-paternité, et soutenir une institution ne donne pas à un mécène la paternité de chaque résultat {cite:kashi-mactutor Samarkand and letters} {cite:iranica-kashi Life}.

MacTutor appelle le Chord and Sine sa dernière œuvre, peut-être inachevée à sa mort et achevée par Qadi Zada. Iranica inclut son titre dans la liste d'œuvres de l'introduction du Key to Arithmetic de 1427. Un titre listé ne tranche pas la question de savoir si chaque partie était complète. Notre date ouverte se termine à la borne de la vie d'al-Kashi1429, non à une année de composition inventée ni à une date de commentaire ultérieur {cite:kashi-mactutor final treatise} {cite:iranica-kashi work list}.

## Le ou les auteurs

MacTutor identifie individuellement al-Kashi comme un mathématicien islamique. Cela fournit la base musulmane consignée, non son nom ou sa ville. Le cadre sunnite par défaut du musée, distinct, n'est pas une preuve détaillée d'école personnelle. Nous ne le déduisons pas de l'affiliation d'un mécène et ne suggérons pas que ces biographies savantes constituent un registre complet de son éducation religieuse {cite:kashi-mactutor summary} {cite:tdv-kashi-okten biography}.

Qadi Zada pose une question de documentation distincte. Sa biographie MacTutor décrit une méthode différente pour la même valeur ; la TDV nomme un commentaire ; la biographie d'al-Kashi discute d'un achèvement possible. Ceux-ci peuvent concerner des œuvres ou des étapes différentes, mais nous n'avons pas collationné les textes pour en décider. Ni effacer son rôle ni faire silencieusement de lui le co-auteur à part égale de chaque étape {cite:qadi-zada-mactutor original work} {cite:tdv-kashi-okten work8} {cite:kashi-mactutor final treatise}.

## Comment cela fonctionne

Ce qui suit est une dérivation moderne, non une transcription. MacTutor relie le problème historique à une cubique et à l'itération ; nous expliquons ce lien en notation actuelle sans attribuer notre suite exacte à al-Kashi. Soit `x` le sinus d'un degré et `a` le sinus de trois degrés. La relation de l'angle triple donne `a=3*x-4*x*x*x`. Tripler l'angle ne triple pas simplement son sinus {cite:kashi-mactutor final treatise}.

Réarrangeons cela en `x=(a+4*x*x*x)/3`. Avec une entrée approchée `a`, on part de `x0=a/3`, puis on substitue l'estimation courante dans le membre de droite pour en obtenir une autre. Élever au cube signifie multiplier un nombre par lui-même trois fois, non le multiplier par trois. Nous divisons la somme indiquée, non chaque angle ou côté d'un dessin.

Notre calcul moderne prend `a≈0.05233595624294383` à partir d'une fonction trigonométrique logicielle. Il part de près de `0.017445318748`, puis donne `0.017452397806`, puis `0.017452406427`. Les valeurs affichées sont arrondies, non des cellules lues dans une table historique. L'emploi d'une fonction toute faite teste cette illustration ; il ne reconstruit pas la manière dont un mathématicien antérieur a obtenu l'entrée.

Pourquoi ces étapes aident-elles ici ? Entre zéro et 0,02 la dérivée du membre de droite, `4*x*x`, vaut au plus0.0016. Les changements de la sortie sont bien plus petits que les changements de l'estimation. Notre vérification moderne contrôle que la transformation reste dans ce petit intervalle et que les différences successives diminuent. Cela concerne l'intervalle choisi, non une promesse que toute cubique et toute estimation de départ convergent.

La cubique a d'autres racines ; nous voulons la petite racine positive appropriée à un angle aigu d'un degré. Le choix de la racine fait partie de la résolution, non d'une décoration après l'écriture d'une équation. Une itération rapide ne peut pas réparer une entrée fausse : changer `a` change le problème. Davantage de chiffres en sortie ne peuvent pas effacer l'approximation initiale ou l'erreur d'arrondi arithmétique.

La précision historique reste rapportée par l'érudition, non prouvée par cet exemple limité sur machine. Nous ne l'appelons pas méthode de Newton, n'attribuons pas à al-Kashi une structure de programme moderne, et n'en inférons pas une trisection exacte à la règle et au compas d'angles quelconques. L'approximation numérique et une construction géométrique exacte sont des problèmes distincts, même quand tous deux traitent d'angles {cite:kashi-mactutor final treatise}.

## La diffusion

La TDV liste le commentaire de Qadi Zada, une impression de Téhéran numérotée 1299 et une traduction russe. Nous rapportons cet énoncé bibliographique sans deviner une conversion de calendrier ni prétendre avoir inspecté l'impression. Un commentaire ou une traduction documente une attention telle que décrite par un savant, non un recensement d'étudiants ni la preuve que tous les témoins sont identiques {cite:tdv-kashi-okten work8}.

MacTutor dit que ces accomplissements sont restés longtemps inconnus en Europe et ont été étudiés aux dix-neuvième et vingtième siècles. La ressemblance avec une méthode moderne n'établit pas une transmission directe. Un itinéraire documenté exige des copies, des lectures et des citations, non simplement deux dates et la supposition qu'un auteur antérieur a nécessairement alimenté chaque auteur ultérieur {cite:kashi-mactutor conclusion}.

## Sur quoi cela s'appuyait

Les relations trigonométriques, l'arithmétique, l'algèbre et la valeur de position se trouvent derrière le résultat. MacTutor reconnaît le travail approximatif d'al-Biruni sur la cubique, non une chaîne de transmission manuscrite que nous ayons vérifiée. Les lecteurs peuvent comparer l'[[invention/biruni-difference-interpolation|interpolation par différences]] pour distinguer la correction d'une table de la résolution répétée d'une relation algébrique ; des outils différents n'ont pas à devenir un seul algorithme {cite:kashi-mactutor final treatise}.

Notre `a` moderne exige aussi une source de calcul connue. Dire « calculez le sinus de trois degrés » n'explique pas la procédure d'un auteur antérieur. Nous ne pouvons pas combler cette lacune par un appel logiciel et l'attribuer rétroactivement. Distinguer l'entrée, la relation, le choix de la racine et la règle d'arrêt révèle quatre strates d'une explication ; en avoir une ne prouve pas les autres.

## Ce qui s'est appuyé sur cela

Les sources placent le calcul exact au sein de l'astronomie de Samarcande, mais une table astronomique combine observation, modèles, calendriers et arithmétique. Un sinus précis ne rend pas chaque coordonnée d'étoile correcte au même nombre de décimales. Nous n'ajoutons aucune invention particulière en aval du seul fait que l'astronomie utilise la trigonométrie {cite:iranica-kashi mathematics and astronomy} {cite:qadi-zada-mactutor collaborative catalogue}.

Le rapport de la TDV sur le commentaire fournit un fil de réception, les descriptions divergentes du rôle de Qadi Zada étant conservées. Le logiciel moderne est une comparaison pédagogique, non un descendant démontré. Laisser vides les dépendants directs est plus honnête que de construire un réseau d'influence de noms célèbres sans preuve lue. Cela ne signifie pas que l'œuvre manquait de valeur ; ce genre de lien précis n'est pas établi ici {cite:tdv-kashi-okten work8}.

## Effets sur la vie quotidienne

Une petite valeur peut sembler lointaine, pourtant elle illustre une distinction pratique entre mesurer une forme et effectuer un calcul reproductible. Iranica relie la recherche d'une plus grande précision du sinus à des besoins astronomiques, non à une machine domestique causée par ces chiffres. Nous ne possédons aucun total mesuré d'argent, de temps ou de voyages épargnés par le traité et n'en inventons aucun {cite:iranica-kashi sine computation}.

La qualité de l'entrée compte à côté de l'habileté procédurale. Continuer après que les chiffres affichés se sont stabilisés ne fournit aucune connaissance nouvelle d'un témoin historique. C'est un usage éducatif actuel que nous proposons, séparé de l'effet social documenté. Notre calcul sur papier n'est pas un système de navigation, et l'activité pour enfants n'exige ni observation solaire ni fabrication d'instrument.

## Comment cela a changé l'histoire

L'œuvre joint l'algèbre et la trigonométrie : un problème d'angle devient une équation, puis un processus d'approximation. MacTutor souligne la qualité de l'itération et Iranica son exactitude rapportée. Nous décrivons un développement numérique délimité, non la preuve que chaque branche des mathématiques modernes a commencé ici, ni une raison d'effacer l'approximation antérieure {cite:kashi-mactutor final treatise} {cite:iranica-kashi sine computation}.

Son étude sépare aussi l'accomplissement de la réception ultérieure. Un texte circulant dans un cadre, des historiens l'étudiant ailleurs et un logiciel contemporain produisant une valeur apparentée sont trois histoires, non une lignée unique automatique. Le récit de MacTutor sur une connaissance européenne tardive ne peut pas tenir lieu d'une inspection indépendante de chaque auteur et de chaque bibliothèque d'Europe {cite:kashi-mactutor conclusion}.

## Qui l'a inventé ?

L'attribution repose sur l'érudition décrivant le Chord and Sine, non sur la ressemblance entre un dessin moderne et un manuscrit. Al-Biruni est un prédécesseur reconnu ; Qadi Zada a des rôles décrits différemment. Les reconnaître ne retire pas al-Kashi et ne promeut pas « peut-être achevé » en participation certaine à chaque calcul {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

Les rapports sur l'exactitude diffèrent aussi. Iranica dit dix-sept chiffres dans un développement décimal ; la biographie d'al-Kashi compare l'exactitude du sinus avec pi, tandis que la biographie de Qadi Zada donne un résumé de l'ordre de `10^-12`. Nous préservons ces formulations plutôt que de forcer un accord ou de les appeler des lectures indépendantes de chiffres historiques. Un témoin numérique lu est nécessaire pour évaluer l'arrondi et l'erreur {cite:iranica-kashi sine computation} {cite:kashi-mactutor final treatise} {cite:qadi-zada-mactutor original work}.

## Aujourd'hui

Une leçon moderne peut tester un petit intervalle, comparer des estimations successives et inspecter le résidu `3*x-4*x*x*x-a`. Un petit résidu vérifie l'équation d'entrée, non la justesse historique de l'entrée. Distinguez un affichage arrondi d'une valeur interne plus longue, sinon deux estimations peuvent paraître identiques simplement parce qu'un écran cache leur différence.

L'image réutilisée est le diagramme de triangle rectangle de TheOtherJesse2007, versé dans le domaine public. Les lettresA,B,C et les étiquettes anglaises des côtés sont modernes ; l'angle dessiné n'est pas d'un degré. Elle ne contient ni les figures d'al-Kashi ni sa page, et son échelle n'établit pas sa procédure. Elle explique le côté opposé et l'hypoténuse, non un témoin historique {cite:commons-trigonometry-triangle Description licence and original history}.

## Exemples conservés

Notre preuve est constituée des récits savants effectivement lus. La TDV identifie le traité et le commentaire, et Iranica fournit une liste d'œuvres. Nous n'avons pas lu le texte original, le commentaire ni l'étude technique de Dilgan citée par la biographie de Qadi Zada. Aucune cote remémorée ni aucune page photographiée non vue n'est présentée comme preuve inspectée {cite:tdv-kashi-okten work8} {cite:iranica-kashi work list} {cite:qadi-zada-mactutor references}.

Les descriptions de l'achèvement, du commentaire et d'une méthode différente restent visibles dans la notice de l'œuvre et dans la prose qui l'accompagne. Nous ne déclarons pas le traité perdu à partir d'un résumé de recherche et ne prétendons pas qu'un autographe de l'auteur subsiste. Dire ce que nous avons lu permet d'évaluer la strate de preuve : connaître un titre diffère d'avoir établi son texte.

## Dans la culture

Samarcande évoque l'architecture et un observatoire, mais ceci est aussi une histoire de calcul et de livres. Les lettres entre père et fils, le mécénat et les discussions avec des collègues apparaissent dans les biographies. L'éloge reste une parole attribuée, non une compétition nationale ni le musée déclarant qu'un savant a surpassé tout le monde dans tous les domaines {cite:kashi-mactutor letters and patronage} {cite:iranica-kashi Life}.

Les longs nombres incitent aux récits héroïques. Iranica distingue l'habileté de calcul et d'instrument de contributions moins établies à la théorie planétaire cosmologique. Cela ne diminue pas un résultat numérique ; cela rend une personne historique plus précise qu'un slogan. La question complexe de la paternité appartient à l'histoire du savoir, non à un défaut à dissimuler {cite:iranica-kashi concluding assessment}.

## Pour les jeunes lecteurs

Écris « angle » sur une carte de papier et « rapport de côtés » sur une autre. Le tiers d'un nombre est-il la même question que le sinus du tiers d'un angle ? Un adulte peut repérer les parties du triangle sans mesurer l'exactitude de l'image. Le but est de distinguer des genres de quantité, non de mémoriser une longue réponse.

Écris ensuite une estimation, une correction et d'où venait la valeur de départ. Ni soleil, ni télescope, ni équipement spécial ne sont nécessaires. Quand les chiffres affichés concordent, demande-toi si la réponse est devenue exacte ou si le papier a simplement cessé de montrer des différences plus petites. Reconnaître les limites d'un exemple fait partie de l'apprentissage, comme reconnaître que notre dessin n'est pas la page d'al-Kashi.

## Références

- {cite:kashi-mactutor complete biography}
- {cite:tdv-kashi-okten work8 and biography}
- {cite:iranica-kashi mathematics work list and assessment}
- {cite:qadi-zada-mactutor complete biography}
- {cite:commons-trigonometry-triangle Description licence and original history}
