---
id: invention/mahani-sphere-division-cubic
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/mahani-sphere-division-cubic.md}
---
## Résumé

[[person/al-mahani|Al-Mahani]] tenta de déplacer un problème archimédien de la géométrie solide vers l'algèbre : où un plan devrait-il couper une sphère afin que les deux volumes résultants aient un rapport prescrit ? Il est arrivé à une équation impliquant un cube, un carré et un nombre, mais ne l'a pas résolue. MacTutor et Dold-Samplonius rapportent le récit de Khayyam et la solution ultérieure d'al-Khazin utilisant des sections coniques {cite:mahani-mactutor cubic} {cite:dold-samplonius-mahani-dsb cubic}.

La contribution enregistrée est la formulation, non la solution qu'il n'a pas pu achever, l'invention de la coupe de sphères, ou toutes les équations cubiques. Elle reste distincte [[invention/khayyam-geometric-cubics|des solutions géométriques systématiques de Khayyam]]. Changer le langage d'une question peut modifier ce que les chercheurs ultérieurs peuvent tenter, même lorsque son proposant ne peut pas achever la solution {cite:mahani-mactutor historical-assessment} {cite:tdv-mahani-fazlioglu algebra}.

## Ce que c'est

Le rapport demandé concerne les volumes, et non les hauteurs ou les surfaces de surface. Un plan près d'un poteau crée une petite casquette et un resto plus grand ; sa position doit correspondre à la proportion spécifiée. Le problème hérité provient de Sur la sphère et le cylindre, livre II, proposition 4. Le musée n'attribue pas la question initiale à al-Mahani {cite:dold-samplonius-mahani-dsb cubic}.

TDV écrit la forme moderne x³+c=ax², tandis que Dold-Samplonius utilise des noms de coefficients différents. Des lettres différentes ne créent pas de problèmes historiques différents. Nous choisissons notre propre notation pédagogique ci-dessous, sans prétendre que le manuscrit contenait ces signes imprimés ou les numéros particuliers dans nos exemples {cite:tdv-mahani-fazlioglu algebra} {cite:dold-samplonius-mahani-dsb cubic}.

## Le monde devant lui

La sphère, le problème et son traitement géométrique antérieur n'étaient pas des inventions d'al-Mahani. Ce que Khayyam met en lumière dans le récit transmis, c'est une tentative d'aborder la question de manière algébrique. L'apparition d'un cube n'établit nulle part la première cubique, et la difficulté à mener cette approche ne signifie pas que toutes les méthodes géométriques précédentes aient échoué {cite:mahani-mactutor Archimedes-and-Khayyam}.

L'ouvrage relie une question archimédienne au traitement algébrique dans son nouveau contexte. TDV décrit également les commentaires euclidiens d'al-Mahani, la théorie des rapports et les grandeurs irrationnelles. Leur coexistence n'est pas une chaîne causale pleinement documentée, ni une preuve que chaque page d'un commentaire d'Euclide ait été une étape nécessaire vers cette équation particulière {cite:tdv-mahani-fazlioglu mathematics}.

## L'histoire

On sait peu de choses sur sa vie. MacTutor donne naissance vers 820 ; des preuves plus solidement datées concernent les observations entre 853 et 866 rapportées par Ibn Yunus. TDV le situe à Bagdad vers 860. Une date d'observation n'est pas un jour d'invention documenté, et une ville active n'établit pas une pièce particulière dans laquelle le problème de la sphère a été formulé {cite:mahani-mactutor biography} {cite:tdv-mahani-fazlioglu biography}.

Les sources décrivent un [[work/mahani-sphere-cylinder-commentary|commentaire sur la sphère et le cylindre]] ainsi que des fragments ou témoins de commentaires associés à Leiden. Le rapport le plus clair de la solution inachevée provient du Khayyam tel que présenté par les chercheurs modernes. Nous distinguons le rapport d'un auteur ultérieur, la description manuscrite d'un érudit et une lecture originale que nous n'avons pas entreprise {cite:tdv-mahani-fazlioglu work5} {cite:dold-samplonius-mahani-dsb cubic}.

## Le(s) fabricant(s)

MacTutor identifie explicitement Abu Abd Allah Muhammad ibn Isa al-Mahani comme un mathématicien islamique ; TDV le place parmi les premiers mathématiciens-astronomes islamiques. Cela fournit des preuves individuelles, et non une déduction du nom ou du lieu de naissance. Le cadre du musée sunnite déclaré séparément n'est pas un certificat confessionnel personnel fourni par les biographies consultées {cite:mahani-mactutor summary} {cite:tdv-mahani-fazlioglu biography}.

La mort reste autour de 880, TDV remettant explicitement en question l'association 267/880. L'incertitude n'est pas republiée comme un jour exact. Trois rôles restent distincts : Archimède a fourni le problème hérité, al-Mahani sa réduction algébrique, et al-Khazin une solution conique ultérieure. Al-Khazin ne doit pas être confondu avec al-Khazini de l'Équilibre de la Sagesse {cite:tdv-mahani-fazlioglu biography-and-algebra}.

## Comment ça fonctionne

Il s'agit d'une explication moderne de musée, pas d'une reconstitution de chaque étape originale. Soit R le rayon de la sphère et h la hauteur du capuchon mesurée de son pôle au plan de coupe. Le volume du capuchon est V=πh²(3R−h)/3 ; l'ensemble de la sphère a un volume 4πR³/3. Le rayon du cercle de coupe satisfait a²=h(2R−h). Ce sont des volumes tridimensionnels, et non des surfaces de disque ou de dôme {cite:weisstein-spherical-cap eqs2-6}.

Fixez t=h/R et soit q la part du capuchon dans l'ensemble du volume de la sphère. En annulant les unités, on donne q=t²(3−t)/4, d'où t³+4q=3t². Un cube, des carrés et un nombre sont apparus à partir de la géométrie. L'intervalle physique est 0≤t≤2 : les extrémités sont un capuchon vide et une sphère entière, tandis que deux morceaux positifs nécessitent 0<q<1. La normalisation nous appartient, pas une transcription d'al-Mahani {cite:weisstein-spherical-cap eq6}.

Notre exemple indépendant t=1/2 donne q=5/32. Le rapport plafond/reste est de 5:27, et non 5:32 ; ce dernier compare le cap au tout. La substitution donne t³+4q=1/8+5/8=3/4, également 3t²=3/4. Ces chiffres vérifient la formulation, et non l'affirmation qu'al-Mahani les ait utilisés ou achevé la solution historique.

Pour la moitié du volume, q=1/2, l'équation moderne devient t³−3t²+2=0, factorisée com(t−1)(t²−2t−2)=0. Ses racines sont 1,1+√3 et 1−√3. Seule1 se trouve dans l'intervalle physique de capitalisation. Toutes les racines algébriques ne représentent pas une coupe possible, et choisir un exemple simple de section centrale ne résout pas le problème initial pour chaque rapport prescrit.

Dans le contrôle moderne, la dérivée de q par rapport à t est 3t(2−t)/4, positive entre 0 et 2. L'augmentation de la hauteur de la capsule augmente donc sa part de volume, avec une hauteur intérieure pour chaque action intérieure. D'autres racines polynomiales ne multiplient pas les coupes physiques. Cela prouve une propriété de notre modèle moderne, non pas que al-Mahani ait utilisé le calcul différentiel ou que son raisonnement perdu ait été retrouvé {cite:weisstein-spherical-cap eq6}.

## La diffusion

Le rapport de Khayyam montre que cette tentative est devenue partie intégrante du développement mémorisé de l'algèbre, et les sources décrivent la solution ultérieure d'al-Khazin. Il s'agit d'une séquence de contributions, pas d'une preuve que tous les chercheurs nommés se soient réunis ou appartenaient à une seule chaîne d'enseignement personnellement documentée. Les récits lus ici ne fournissent pas de carte géographique d'adoption {cite:mahani-mactutor cubic-history} datée.

TDV liste des témoins de commentaires dans plusieurs bibliothèques. L'emplacement actuel d'un manuscrit n'est ni un site d'invention ni un stade automatiquement daté de la circulation médiévale. Les fragments et commentaires conservés n'impliquent pas que chaque étape de leur transmission soit connue ; une liste de catalogue ne peut pas simplement devenir un itinéraire historique animé {cite:tdv-mahani-fazlioglu works}.

## Sur quoi elle a été bâtie

La condition donnée est un rapport entre deux pièces ; la relation requise relie le volume du capuchon à la position du plan de coupe. Le modèle suppose une sphère et un plan idéaux, et non un fruit irrégulier ou un récipient d'épaisseur inconnue. L'exemple moderne montre pourquoi la reformulation nécessite de définir la quantité, et non simplement d'écrire un cube à côté d'un objet rond {cite:weisstein-spherical-cap definition-and-eq6}.

Pour un rapport prescrit m :n, la part capitale est q=m/(m+n), et non m/n. Trouver la hauteur correspondante renvoie l'algèbre à la géométrie. C'est notre explication de la condition de ratio rapportée, et non une traduction littérale d'Archimède ni une affirmation selon laquelle son texte original aurait été examiné pour ce lot {cite:dold-samplonius-mahani-dsb prescribed-ratio}.

## Ce qui a été construit dessus

Les sources affirment qu'al-Khazin a résolu l'équation avec des coniques et évaluent l'importance de cette tentative pour relier l'algèbre à la géométrie. Résoudre un cas particulier antérieur reste différent de l'organisation ultérieure de Khayyam des formes cubiques multiples et des formules radicales modernes. Ces étapes ne sont pas comptées comme des noms interchangeables pour un seul enregistrement {cite:mahani-mactutor cubic-history}.

La notation actuelle permet de comparer les volumes et de sélectionner par calcul la racine appropriée. Ces outils ne sont pas attribués à al-Mahani simplement parce qu'une leçon de musée les utilise. Une substitution réussie n'établit pas non plus un chemin de transmission direct de son commentaire à chaque programme informatique moderne pour les équations cubiques {cite:tdv-mahani-fazlioglu algebra} {cite:weisstein-spherical-cap eq6}.

## Impact sur la vie quotidienne

Les lectures ne fournissent aucun registre d'atelier de découpe de sphères basé sur al-Mahani, les économies de matériaux attribuées à la méthode, ni une industrie créée par l'équation. L'impact soutenu concerne la formulation mathématique et l'histoire. Nous ne comblons pas ce vide avec un artisan fictif, ni ne transformons le modèle de géométrie solide en instructions pour la coupe physique des objets {cite:mahani-mactutor historical-assessment}.

Une distinction utile peut néanmoins être apprise : les rapports longueur, surface et volume ne sont pas interchangeables. Doubler à la fois le rayon et la hauteur du couvercle multiplie le volume par huit tout en préservant q. C'est une conséquence de la formule moderne, et non une mesure effectuée avec un ancien instrument ou un effet économique historiquement documenté {cite:weisstein-spherical-cap eq6}.

## Comment cela a changé l'histoire

Comme MacTutor le lit en Khayyam, l'incapacité d'al-Mahani à terminer n'a pas rendu la formulation sans valeur. Exprimer un problème dans une autre langue peut révéler des approches jamais apparentes auparavant. Cela ne fait pas de chaque équation non résolue une grande invention : ce cas comporte une question précise rapportée et une suite ultérieure particulière {cite:mahani-mactutor historical-assessment}.

Le disque fait de l'échec une partie intégrante de l'histoire plutôt qu'une note de bas de page sous un titre triomphal. Nous ne disons pas qu'al-Mahani a résolu la division de sphères lorsque les sources affirment qu'il s'est arrêté à un cubique. Distinguer le résultat obtenu du résultat encore recherché protège cette histoire contre un crédit rétrospectif exagéré {cite:dold-samplonius-mahani-dsb cubic}.

## Qui l'a inventé ?

**Sunnite — cadre déclaré :** l'identité islamique individuelle est documentée, distincte d'une revendication de priorité universelle. **Récit académique :** les sources rapportent la description par Khayyam de la tentative d'al-Mahani et la solution ultérieure d'al-Khazin. L'attribution concerne une réduction algébrique particulière, pas toutes les cubiques connues dans chaque civilisation ou un verdict muséal après examen de tous les manuscrits {cite:mahani-mactutor summary-and-cubic} {cite:tdv-mahani-fazlioglu algebra}.

Les sources conservent également une confiance différente concernant les témoins : TDV attribue un commentaire ultérieur à al-Quhi, tandis que Dold-Samplonius écrit « probablement ». Nous prétenons cette nuance plutôt que de fabriquer la certitude en combinant des récits. Un contributeur non musulman à l'histoire mathématique héritée n'est pas omis car le critère de ce fabricant est plus restreint {cite:tdv-mahani-fazlioglu work5} {cite:dold-samplonius-mahani-dsb cubic}.

## Aujourd'hui

Comparer t avec 2−t donne des condensateurs complémentaires dont les parts volumicales s'élèvent à 1. Pour t=3/2, q=27/32 et le rapport cap-de-reste est de 27:5. Cet exemple moderne vérifié indépendamment inverse le point de vue sur le même plan de coupe ; il ne s'agit pas de la découverte d'un second exemple historique utilisé par al-Mahani.

Dans l'illustration, r correspond au rayon de la sphère, à la hauteur du cap h et au rayon de cercle coupé ; notre explication utilise R pour le rayon de la sphère. Le a de l'image n'est pas le coefficient portant cette lettre dans le cubique général de TDV. Un bonnet violet et une sphère bleue sont des illustrations modernes, pas des preuves concernant l'appareil physique de l'auteur {cite:commons-spherical-cap-pbroks current-image}.

## Exemples conservés

Les lectures réelles sont la biographie complète de MacTutor, la liste du corps et des œuvres de la TDV d'İhsan Fazlıoğlu, ainsi que la biographie reproduite par Dold-Samplonius avec bibliographie dans un PDF d'une seule page. Aucun fragment de Leiden, aucune étude originale complète d'al-Mahani ni aucune étude de Rashed listée n'a été examinée simplement parce qu'elle figurait dans les références {cite:mahani-mactutor bibliography} {cite:tdv-mahani-fazlioglu work5} {cite:dold-samplonius-mahani-dsb bibliography}.

Les autres entrées de TDV incluent des révisions perdues et des avis de catalogue ; tous les titres ne représentent pas un livre complet survivant. L'illustration de Pbroks13 de 2008 a été rendue publique et ses droits ainsi que son image actuelle ont été inspectés. L'original inchangé est utilisé ; ce n'est pas une page du commentaire d'al-Mahani {cite:tdv-mahani-fazlioglu works} {cite:commons-spherical-cap-pbroks rights}.

## Dans la culture

Une histoire du savoir peut montrer une question ouvrant une voie sans créer un héros qui a répondu à tout. Le rapport aide à distinguer le langage d'un problème du langage de sa solution. Aucune maxime inventée ni scène dramatique non documentée à Bagdad n'est nécessaire pour rendre la distinction intéressante {cite:mahani-mactutor historical-assessment}.

« Cubique » ici décrit une puissance dans une équation, et non la forme de la pièce découpée à partir d'une sphère. « Division » signifie spécifier un plan et deux volumes, pas seulement une division numérique sur papier. Expliquer ces termes aide le lecteur à interpréter l'image sans transformer la terminologie moderne en une prétendue citation de l'auteur.

## Pour les jeunes lecteurs

Tracez un cercle représentant une section transversale d'une sphère et une ligne près de son sommet. La petite surface sur le papier suggère un capuchon tridimensionnel, mais n'est pas en soi le volume de ce capuchon. Aucune véritable boule ou outil de coupe tranchant n'est nécessaire. Vous pouvez dessiner différentes positions de plans et demander comment le volume change plutôt que de mesurer uniquement la surface colorée.

Choisir h=R/2 dans notre exemple donne 5/32 de l'ensemble du volume, pas la moitié. Al-Mahani n'a pas nécessairement choisi ces nombres ; nous les avons choisis pour enseigner la question. La formulation était une étape, la solution une autre. En lisant le titre d'une invention, demandez-vous ce que son créateur a accompli et ce qui restait pour les chercheurs ultérieurs {cite:weisstein-spherical-cap eq6} {cite:mahani-mactutor cubic}.

## Références

- MacTutor : biographie et récit rapporté de Khayyam {cite:mahani-mactutor biography-and-cubic}.
- Fazlıoğlu, TDV : équation et travaux {cite:tdv-mahani-fazlioglu body}.
- Dold-Samplonius : biographie, témoins et qualifications {cite:dold-samplonius-mahani-dsb body}.
- MathWorld : formules modernes, pas histoire de l'invention {cite:weisstein-spherical-cap eqs2-6}.
- Biens communs : illustration moderne et droits {cite:commons-spherical-cap-pbroks rights}.
