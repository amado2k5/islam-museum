---
id: invention/habash-shadow-tables
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/habash-shadow-tables.md}
---

## Résumé

Une ombre peut être comprise à travers un dessin, mais la relation entre sa longueur et l'angle d'un rayon peut également être organisée numériquement. C'est la contribution ici associée à [[person/habash-al-hasib-al-marwazi|Habash al-Hasib al-Marwazi]]. Ihsan Fazlioglu le relie à des tables d'ombres correspondant à ce que nous appelons aujourd'hui le calcul tangent, attribuant une revendication prioritaire à Sarton. Nous enregistrons une amélioration computationnelle bornée, et non l'invention d'ombres, de cadrans solaires ou de toute trigonométrie {cite:tdv-habash-fazlioglu trigonometry}.

Connaître une relation géométrique et préparer un outil numérique réutilisable sont des accomplissements différents. Cependant, une source moderne disant « d'abord » n'est pas une image de l'ancien tableau. Nous n'avons pas lu ici la discussion originale de Sarton ni le manuscrit de Habash. La priorité reste donc attribuée, et les valeurs pédagogiques ci-dessous sont les nôtres, et non des cellules historiques prétendues.

## Ce que c'est

Une table organise les valeurs pour la recherche au lieu de répéter chaque construction géométrique. Une « ombre » computationnelle n'est pas simplement une tache sombre : c'est une magnitude liée à l'ombre d'un gnomon selon une échelle convenue. MacTutor distingue la route historique des grandeurs d'ombre et d'ombre réciproque de la corde et de la voie sinusoïdale {cite:mactutor-trigonometric-functions shadow discussion}.

La tangente et la cotangente modernes nécessitent un angle spécifié. Si nous choisissons l'élévation d'un rayon au-dessus de l'horizontale, l'ombre horizontale divisée par la hauteur verticale du gnomon est égale à la cotangente dans notre modèle. Le réciproque est la tangente. C'est un langage explicatif moderne, pas une traduction littérale de chaque terme manuscrit ou de chaque orientation gnomon. Changer la convention d'angle change quelle fonction moderne représente un rapport particulier.

## Le monde devant lui

La mesure des ombres précède Habash de plusieurs siècles. MacTutor aborde les cadrans solaires et les hauteurs calculées à partir des ombres, tout en décrivant les cordes grecques et les demi-cordes indiennes selon une autre voie historique. Le monde avant cette contribution n'était pas une page blanche ; un tableau numérique n'était pas la première rencontre de l'humanité avec une ombre changeante {cite:mactutor-trigonometric-functions early-history and shadow discussions}.

François Charette décrit Habash ayant appris les traditions indiennes et perses, puis travaillant dans l'astronomie ptolémaïque tout en révisant ses observations. Cela ne fait pas en sorte que chaque élément de son travail dérive d'une seule source ou n'émerge pas des tables et instruments antérieurs. La contribution appartient à un héritage mixte plutôt qu'à l'effacer de cet héritage {cite:habash-charette-bea career and zij discussions}.

## L'histoire

Son travail est mieux documenté que sa vie personnelle. TDV rapporte des observations de Bagdad entre 829 et 864, une longue vie et une possible mort entre 864 et 874. Charette discute d'observations aussi tardives que 868, situe l'achèvement du zij après 869, et estime provisoirement une espérance de vie autour de 796–894. Nous ne regroupons pas ces estimations en dates précises de naissance et de décès {cite:tdv-habash-fazlioglu biography} {cite:habash-charette-bea chronology}.

Les archives situent la contribution à la table de manière générale au IXe siècle. La déclaration de MacTutor concernant les tables ombres arabes vers 860 n'est pas une date de composition individuelle. Les liens avec la Cour n'établissent pas non plus une appartenance formelle à l'équipe d'observation de Ma'mun : Charette et TDV distinguent le contact et bénéficient de la participation que les preuves ne démontrent pas de manière sûre {cite:mactutor-trigonometric-functions shadow discussion} {cite:habash-charette-bea mumtahan discussion}.

## Le(s) fabricant(s)

Charette qualifie explicitement Habash d'astronome musulman dans une biographie académique rédigée. Il s'agit d'une preuve d'identité individuelle, indépendamment du nom arabe, de la ville ou de la religion du mécène. Sunnite est séparément le cadre déclaré du musée pour le cadre abbasside, et non un certificat nouvellement inventé de son école de droit personnelle {cite:habash-charette-bea opening biography}.

Son rôle ici est celui d'amélioration computationnelle. Nous n'attribuons pas à chaque astronome contemporain le statut de coauteur de tableaux ni ne confondons les mécènes et copistes avec les contributeurs. L'attribution des sources antérieures et du contributeur original du créateur reste intacte. Cette série ajoute des sources et un compte rendu plus complet sans prétendre avoir lu le contenu utilisé par un contributeur antérieur.

## Comment ça fonctionne

Dessinez un modèle uniquement sur papier : une hauteur verticale, une longueur horizontale, et une hypotenuse représentant un rayon droit surélevé par des angles au-dessus de l'horizontale. Dans le triangle rectangle idéal, `s/h=cot(a)` et `h/s=tan(a)`. Spécifier l'angle et le dénominateur empêche d'inverser le sens lorsque le dessin change. Ce sont nos équations d'enseignement modernes, et non des symboles prétendus apparaître dans le zij de Habash.

À 45 degrés, les deux pieds sont égaux, donc le ratio est de 1. Choisir une hauteur d'enseignement de 12 unités donne une ombre de 12 unités. Douze est notre choix pratique, pas une hauteur historique de gnomon ou une base de table récupérée. Doubler les deux longueurs préserve leur ratio : les ratios distinguent la forme de la taille.

À 30 degrés, `s/h=sqrt(3)` ; à 60 degrés, `s/h=1/sqrt(3)`. Pour notre hauteur 12, les longueurs correspondantes sont `12sqrt(3)` et `4sqrt(3)`. Nous conservons les radicaux exacts ou étiquetons explicitement une approximation. Les emplacements de calculatrice modernes ne sont pas imprimés comme des entrées manuscrites supposées. Le triangle moderne accompagnant ne peut pas établir la convention d'échelle historique de l'auteur.

Une table permet la recherche numérique, mais des incréments d'angle égaux ne produisent pas d'incréments d'ombre égaux. De 30 à 45 degrés, le rapport change de la racine carrée de 3 à 1 ; de 45 à 60, il passe de 1 à l'inverse de la racine carrée de 3. Ces changements diffèrent. Cela vérifie la non-linéarité sans emprunter de cellules historiques invisibles.

L'altitude solaire n'est donc pas directement égale aux heures depuis le lever du soleil. Convertir l'altitude en temps nécessite une géométrie astronomique, incluant la localisation, la saison et la position sur la trajectoire quotidienne. Nous ne transformons pas un paragraphe descriptif moderne en une loi linéaire. À l'horizon idéal, le rapport d'ombre n'a pas de valeur finie ; le cas aérien a sa propre limite. La division par zéro ne doit pas être présentée comme une valeur ordinaire de table.

## La diffusion

Charette décrit al-Biruni utilisant le zij d'Habash au début de sa propre carrière. TDV rapporte des études sur le zij par Ibn Irak et al-Biruni, parallèlement à la critique d'Ibn Yunus sur certaines valeurs de latitude de Vénus et Mercure. La réception impliquait l'usage et la critique, pas des louanges ininterrompues {cite:habash-charette-bea reception} {cite:tdv-habash-fazlioglu reception}.

La réception de l'intégralité du manuel ne prouve pas que chaque lecteur a copié la même table d'ombre sans modification. Nous n'ajoutons donc aucun avantage de transmission automatique à chaque auteur ou instrument moderne. Suivre une cellule particulière à travers les manuscrits nécessite des preuves allant au-delà de l'historique général de la réception d'une œuvre. La date d'une copie ultérieure n'est pas la date de la méthode originale.

## Sur quoi elle a été bâtie

L'explication repose sur la géométrie rectangulaire et sur la mesure antérieure de l'ombre. La recherche situe Habash dans un passage des modèles indiens et persans à une disposition ptolémaïque révisée par observations. Charette met l'accent sur une adhésion étroite à de nombreux modèles et procédures ptolémaïques ainsi que des paramètres et méthodes computationnelles améliorés. Suivre une tradition et l'améliorer ne sont pas nécessairement des opposés {cite:habash-charette-bea Ptolemaic-zij discussion}.

Sine, tangent et sinusoïde versé doivent rester distincts. La TDV discute des tables sinusoïdales et de la terminologie pour le sinus et le versin, mais cela ne permet pas de copier des formules électroniques endommagées mêlant une échelle de rayon 60 avec normalisation à 1. Nous conservons la distinction entre fonctions et donnons un exemple moderne à échelle cohérente, plutôt que de corriger les mathématiques historiques en supposant {cite:tdv-habash-fazlioglu trigonometry}.

## Ce qui a été construit dessus

Charette décrit des tables auxiliaires importantes appelées jadwal al-taqwim ainsi que des travaux portant sur les instruments, la sphère et la qibla. Celles-ci montrent l'étendue du programme de Habash. Ce ne sont pas automatiquement des noms alternatifs pour chaque tableau ou chaque chapitre ombre pour être considérés mécaniquement comme des inventions distinctes. Le lien d'une méthode numérique avec une application nécessite une identification, et non simplement le mot partagé « table » {cite:habash-charette-bea auxiliary-tables and instruments discussions}.

Les relations entre témoins et méthodes restent des questions historiques. Notre équation moderne n'établit pas qu'un programmeur appelant une fonction trigonométrique transmet directement le texte de Habash. On peut démontrer un lien conceptuel ; une généalogie technique continue nécessite des traces documentées, et non des résultats similaires de calculatrice.

## Impact sur la vie quotidienne

MacTutor place les tableaux d'ombres dans le contexte de la mesure de la hauteur et des cadrans solaires. L'organisation numérique rend une relation géométrique disponible pour des calculs répétés au lieu d'exiger un nouveau dessin à chaque fois. Nos sources ne comptent pas les utilisateurs de Habash ni ne quantifient le temps gagné par chaque géomètre, nous n'inventons donc aucune statistique d'adoption sociale {cite:mactutor-trigonometric-functions shadow discussion}.

Le calcul n'élimine pas les conditions de mesure. Notre modèle suppose un gnomon vertical, une surface horizontale et un angle défini. Ces hypothèses expliquent pourquoi mémoriser une valeur est insuffisant. Nous demandons aux visiteurs de ne pas effectuer d'observations solaires ni d'utiliser une ombre incidente pour une décision professionnelle ou religieuse. L'activité reste sur papier.

## Comment cela a changé l'histoire

Cette contribution appartient à l'histoire de la transformation des relations géométriques en outils numériques utilisables à travers les problèmes. MacTutor donne une histoire distincte des termes latins d'ombre et des noms européens ultérieurs de tangentes et de cotangentes. Le mot moderne tangent et ses abréviations ne doivent donc pas être attribués à Habash {cite:mactutor-trigonometric-functions tangent and cotangent terminology}.

La valeur de l'œuvre n'est pas un concours de priorités national condensé. Elle faisait partie d'un réseau de livres, d'observations et de langues, avec des révisions intégrées au processus. Les visiteurs peuvent apprécier Habash sans croire qu'il a créé chaque fonction à partir de rien, que les tables grecques et indiennes n'existaient pas, ou que la critique ultérieure annule toutes les réalisations antérieures.

## Qui l'a inventé ?

La déclaration de priorité spécifique la plus forte de TDV est attribuée à Sarton, et non un jugement que nous avons porté après avoir comparé chaque manuscrit survivant. Nous conservons cette attribution et utilisons « amélioration » dans le registre. MacTutor donne une date générale autour de 860 pour les tableaux ombres arabes, et non un auteur individuel pour chaque tableau dans ce paragraphe {cite:tdv-habash-fazlioglu trigonometry} {cite:mactutor-trigonometric-functions shadow discussion}.

Trois couches restent séparées : le calcul de l'ombre plus ancien, la recherche attribuant des tables à Habash, et une affirmation universelle pour la première fois. Cette lecture soutient suffisamment la couche intermédiaire pour expliquer la contribution et présente la troisième comme une affirmation de source plutôt que de transformer une recherche prioritaire incomplète en certitude.

## Aujourd'hui

Une calculatrice peut désormais fournir une fonction trigonométrique tout en dissimulant les conventions d'angle et d'unité. Notre exemple de papier les rend visibles : l'angle est-il mesuré horizontalement ou verticalement ? La réponse est-elle une longueur ou un rapport ? Les entrées sont-elles des degrés ou des radians ? Ce sont des questions d'enseignement modernes, pas des citations tirées d'une introduction de zij.

L'image est un triangle rectangle moderne réalisé par TheOtherJesse et rendu public en 2007. Elle distingue le côté opposé, le côté adjacent et l'hypoténuse. Ce n'est ni un gnomon survivant, ni la table de Habash, ni une illustration d'un atelier de Samarra, et ne fournit aucune échelle historique {cite:commons-trigonometry-triangle Description and licensing}.

## Exemples conservés

Charette distingue un témoin d'Istanbul plus proche de l'original d'une recension berlinoise contenant du matériel ultérieur, et soutient que quatre titres désignent un zij ptolémaïque survivant. TDV traite les noms et la relation entre Dimashqi et Mumtahan dans une discussion plus différenciée. Nous exposons cette différence interprétative au lieu de fabriquer quatre livres certains à partir de quatre noms {cite:habash-charette-bea manuscripts and titles} {cite:tdv-habash-fazlioglu works2–5}.

Ni le témoin ni l'enquête de Debarnot n'ont été examinés ici. Une déclaration rédigée en 2007 ne peut pas certifier la situation actuelle des publications. Le [[work/zij-habash-al-hasib|dossier zij]] fournit le contexte du programme tabulaire, et non un folio original contenant nos valeurs pédagogiques. Aucun numéro de folio, rangée ou hauteur gnomon n'a été inventé.

## Dans la culture

Charette explique al-Hasib comme un titre pour un travail mathématique-astronomique, et non comme une affirmation romantique selon laquelle son porteur aurait tout calculé mentalement. TDV traite la signification même de Habash avec prudence. Une explication spéculative d'un surnom ne doit pas devenir une affirmation d'apparence personnelle ou d'ascendance {cite:habash-charette-bea opening biography} {cite:tdv-habash-fazlioglu biography}.

Le musée peut raconter une histoire plus discrète : un chercheur lit un travail hérité, révise des observations, organise des calculs, puis est ensuite lu et corrigé par d'autres. Un nom mémorable ou la précision d'un instrument moderne ne peuvent se substituer à la documentation d'une contribution spécifique.

## Pour les jeunes lecteurs

Dessinez un triangle rectangulaire sur du papier avec des jambes égales. Leur ratio est de 1 que chacun mesure 2 ou 4 unités. Agrandez le dessin sans changer de forme et remarquez que la taille change alors que le ratio ne change pas. C'est notre exemple moderne, pas une page tirée de Habash.

Alors lisez la fiche source : voyons-nous une vieille table ou un récit moderne de celle-ci ? Les deux peuvent nous apprendre quelque chose, mais ce sont des preuves différentes. Aucun gnomon extérieur ni regarder vers le Soleil n'est nécessaire. Le papier suffit ; l'observation solaire reste en dehors de cette activité.

## Références

- {cite:tdv-habash-fazlioglu main entry and bibliography}
- {cite:habash-charette-bea complete biography and selected references}
- {cite:mactutor-trigonometric-functions complete history}
- {cite:commons-trigonometry-triangle Description and licensing}
