---
id: invention/abu-kamil-integer-enumeration
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/abu-kamil-integer-enumeration.md}
---
## Résumé

Cengiz Aydin décrit [[person/abu-kamil-shuja-ibn-aslam|Abu Kamil]] comme étudiant plusieurs réponses entières dans son [[work/abu-kamil-taraif|ouvrage Rare Things in Calculation]], plutôt que de s'arrêter à une seule solution. Les problèmes se réduisent à deux équations linéaires avec trois à cinq inconnues. Il s'agit d'une contribution à l'organisation et à l'énumération des solutions, et non de l'invention de chaque puzzle d'oiseaux ou équation numérique {cite:tdv-abu-kamil work2}.

Elle diffère de son [[invention/abu-kamil-irrational-coefficients|algèbre à coefficients irrationnels]]. Ici, les quantités peuvent devoir être des nombres entiers car elles comptent les oiseaux entiers, même lorsque les prix sont des fractions. Nous examinons un modèle explicitement moderne et distinguons son nombre vérifié de totaux historiques rapportés différents. L'arithmétique correcte des musées ne peut pas à elle seule authentifier une lecture manuscrite {cite:tdv-abu-kamil work2} {cite:proofwiki-abu-kamil-birds historical-note}.

## Ce que c'est

Sous-déterminé ne signifie pas non contraint. Plus d'inconnues que d'équations peuvent néanmoins laisser une collection finie de réponses lorsque les quantités doivent être des entiers positifs dans un total fixe. Aydin distingue la recherche de réponses entières de l'acceptation de fractions satisfaisant les équations, et décrit le traitement algébrique d'Abu Kamil comme systématique {cite:tdv-abu-kamil work2}.

Notre modèle d'oiseaux exige à la fois un nombre total et un coût total. Acheter 100 oiseaux est insuffisant si leur prix est incorrect ; dépenser l'ensemble du budget est insuffisant si trop peu d'oiseaux sont achetés. Nous devons également indiquer si un type peut être absent. Autoriser zéro change la question, pas simplement la typographie de la réponse.

## Le monde devant lui

Aydin discute de Diophantus et des problèmes indiens associés à l'Aryabhata, distinguant l'attention portée aux solutions rationnelles de la recherche de toutes les réponses en entiers. Ces précédents excluent une histoire où une seule personne aurait inventé chaque problème indéterminé. Appeler les problèmes Diophantin ne prouve pas qu'une procédure particulière provient directement d'un livre particulier {cite:tdv-abu-kamil work2}.

MacTutor rapporte les arguments de Sesiano sur la place d'Abu Kamil parmi les mathématiciens arabes, y compris des procédures absentes des livres connus de l'Arithmétique. Il s'agit de l'argument d'un historien rapporté à travers une biographie que nous lisons, et non de notre propre comparaison de chaque témoin. Les précisions concernant ce qui subsiste et ce qui est connu font encore partie de l'affirmation prioritaire {cite:abu-kamil-mactutor rare-things}.

## L'histoire

Aydin sépare le Taraif d'un Livre des Oiseaux classé dont il qualifie le contenu inconnu. Nous ne les fusionnons pas parce qu'un problème contient des oiseaux, ou parce qu'un résumé moderne utilise ce titre. Nous ne rendons pas non plus les problèmes arithmétiques identiques à l'algèbre ou au livre de mesure ; chaque œuvre a besoin de sa propre preuve {cite:tdv-abu-kamil work2-and-conclusion}.

MacTutor souligne la rareté des informations biographiques et donne des dates approximatives autour de 850 et 930. Un horizon de la fin du IXe / du début du Xe siècle constitue donc un contexte, et non une cérémonie d'invention datée. L'identité d'un auteur égyptien n'établit pas un marché, un atelier ou un lieu de composition spécifique du Caire pour chaque problème {cite:abu-kamil-mactutor biography}.

## Le(s) fabricant(s)

La base musulmane individuelle d'Abu Kamil est reprise à partir de la description explicite de MacTutor ; le cadre sunnite du musée est déclaré séparément. Ni un problème indien similaire ni le titre d'un livre n'apportent une nouvelle identification sectaire personnelle. Ce document conserve la biographie existante et la contribution antérieure plutôt que de les remplacer pour correspondre à ce sujet {cite:abu-kamil-mactutor summary} {cite:tdv-abu-kamil biography}.

Aydin discute de la connaissance des problèmes indiens tout en conservant un désaccord sur la connaissance des méthodes, et mentionne des parallèles ainsi qu'un commentateur anonyme. Une ressemblance ou un rapport de commentaires n'est pas l'aveu signé par l'auteur d'un itinéraire de transmission précis. Nous attribuons cet argument sans décider d'indépendance ou de dépendance uniquement à partir d'un cadre oiseau partagé {cite:tdv-abu-kamil work2}.

## Comment ça fonctionne

Voici l'illustration moderne présentée dans ProofWiki, pas un tableau original que nous avons consulté : 100 oiseaux pour 100 pièces, avec cinq prix unitaires2,1,1/2,1/3,1/4. Écrivez leurs quantités comme x,y,z,w,v. Puis x+y+z+w+v=100 et 2x+y+z/2+w/3+v/4=100. Ces symboles et cette présentation sont des dispositifs pédagogiques modernes {cite:proofwiki-abu-kamil-birds prices}.

Multipliez l'équation de coût par 12:24x+12y+6z+4w+3v=1200. Soustrayez douze fois l'équation de comptage pour obtenir 12x=6z+8w+9v ; puis y=100−x−z−w−v. Énumérez z,w,v dans le total, en acceptant une intégrale x et un y positif. C'est la manière indépendante du musée de vérifier le modèle, et non les lignes récupérées de l'algorithme historique.

Le tuple(4,90,1,3,2) fonctionne : son nombre est 100 et son coût8+90+1/2+1/2=100. Un autre est (7,83,1,3,6). Leur moyenne (5,5,86,5,1,3,4) satisfait les deux équations mais n'est pas un achat d'oiseaux entiers. Satisfaire les équations à elle seule ne supprime pas l'exigence d'un entier.

Exiger chaque type donne 2678 solutions positives dans notre énumération ; permettre zéro donne 3727 solutions non négatives. Cette dernière inclut (0,100,0,0,0) : uniquement le type tarifé à 1. Ce sont des réponses à des questions contraintes différemment, pas des réponses concurrentes à une seule question. L'accord avec un total historique rapporté ne certifie pas indépendamment son origine manuscrite.

L'équation réduite impose deux restrictions préliminaires : v doit être pair, car les autres termes sont pairs ; w doit être divisible par 3, en considérant les restes modulo3. Écrivez w=3b et v=2c pour obtenir 2x=z+4b+3c, donc z+c doit également être pair. Ce sont des déductions dans notre modèle, pas des règles attribuées à un manuscrit non lu. La divisibilité reste insuffisante : la borne totale et un y positif doivent également être vérifiées.

## La diffusion

Aydin rapporte une traduction hébraïque associée à Mordecai Finzi, incluant un argument en faveur d'un possible intermédiaire espagnol plutôt qu'en faveur d'une traduction directe de l'arabe. Il rapporte également un témoin latin via Suter. Ce sont des rapports académiques attribués, et non une chaîne de transmission nouvellement établie par nos manuscrits de compilation {cite:tdv-abu-kamil work2-translations}.

MacTutor discute de la réception plus large du travail d'Abu Kamil par al-Karaji et Fibonacci. Cette réception générale n'est pas une preuve automatique que cette table exacte à cinq prix a emprunté un itinéraire particulier. Des problèmes ou totaux similaires n'identifient pas seuls quel témoin un lecteur a utilisé ; une affirmation plus étroite nécessite des preuves plus étroites {cite:abu-kamil-mactutor reception}.

## Sur quoi elle a été bâtie

Les ingrédients sont les équations linéaires, les quantités entières et les prix pouvant être fractionnaires. Une demi-pièce ne nécessite pas la moitié d'un oiseau : les quantités comptées doivent être des entiers, pas tous les coefficients de l'équation du coût. Aydin note les objets et personnes substituables ainsi que les oiseaux, et une tradition de problème circulant {cite:tdv-abu-kamil work2}.

Il décrit des noms verbaux inconnus tels que chose, dinar, fals et anneau, avec des chiffres principalement écrits en mots, sauf en tableaux et quelques chiffres. Nous ne transformons pas ce récit en une affirmation selon laquelle Abu Kamil aurait utilisé la notation moderne x,y, ni que chaque occurrence d'un mot monétaire désigne nécessairement une pièce littérale plutôt qu'une inconnue {cite:tdv-abu-kamil work2-notation}.

## Ce qui a été construit dessus

Un lecteur moderne peut explorer comment deux équations avec plusieurs inconnues interagissent avec les bornes, l'intégralité et la positivité. Cette comparaison ne fait pas de toute la programmation linéaire moderne une invention d'Abu Kamil. Un outil actuel peut vérifier un problème sans prouver une descendance historique directe pour chaque application d'optimisation.

Notre vérification utilise deux procédures d'énumération indépendantes, en faisant évoluer le coût par 12 pour éviter l'arrondissement décimal. Printing2678 ne suffit pas : chaque uple doit satisfaire les deux contraintes, apparaître une fois et concorder avec l'ensemble complet généré de manière indépendante. Ce sont des normes modernes de vérification, pas une affirmation selon laquelle l'auteur historique a utilisé un ordinateur ou notre notation.

## Impact sur la vie quotidienne

Un cadre d'achat rend les contraintes accessibles, mais les sources lues ne documentent pas un marché ayant réellement utilisé ces cinq prix ni un avantage commercial mesuré de la méthode. La photographie n'est pas un registre commercial. Les objets interchangeables d'Aydin aident à distinguer la structure mathématique de la marchandise dans l'histoire {cite:tdv-abu-kamil work2}.

La distinction éducative est simple : trouver une réponse diffère de trouver toutes les réponses. Un élève peut vérifier un achat réussi puis demander ce que l'exemple laisse inconnu. C'est une leçon issue de la structure du problème, et non d'un recensement inventé des écoles historiques ni d'une économie mesurée à l'époque ancienne du commerce.

## Comment cela a changé l'histoire

Aydin situe l'importance de l'œuvre dans le traitement systématique de problèmes admettant de nombreuses réponses entières, plutôt que dans la satisfaction d'une seule réponse. L'argument de Sesiano, tel que rapporté par MacTutor, rend ces procédures dignes d'étude sans exiger que chaque problème et chaque idée aient commencé ici. La contribution et ses limites appartiennent à la fois dans le récit {cite:tdv-abu-kamil work2} {cite:abu-kamil-mactutor rare-things}.

Cela diffère également de l'extension de l'algèbre aux coefficients irrationnels : une contribution concerne les grandeurs admissibles dans les équations, l'autre la collection de réponses admissibles. Les prix fractionnaires ne font pas de ce texte une copie renommée de l'exemple radical précédent. La question séparée et le travail justifient un enregistrement distinct {cite:tdv-abu-kamil work1-and-work2}.

## Qui l'a inventé ?

**Cadre sunnite déclaré :** la base musulmane individuelle documentée existante reste distincte de la priorité. **Compte rendu académique :** Aydin conserve des précédents et une dépendance contestée aux méthodes indiennes ; MacTutor rapporte les arguments de Sisiano qualifiés par les textes connus. Le musée ne donne ni verdict absolu inédit au monde ni voie directe prouvée pour chaque procédure {cite:abu-kamil-mactutor summary-and-rare-things} {cite:tdv-abu-kamil work2}.

Même un nombre historique de réponses ne peut être établi en choisissant un numéro pratique en ligne. ProofWiki imprime 2696 et rapporte les variantes 2676, 2678, 2698 dans les récits modernes. Notre énumération précisément contrainte explique un modèle, pas ce que chaque copiste a écrit ni pourquoi chaque témoin diffère {cite:proofwiki-abu-kamil-birds variant-counts}.

## Aujourd'hui

Comparer 2678 à 3727 met en lumière l'effet d'une condition apparemment faible : un type pourrait-il être absent ? Deux programmes ne peuvent pas être comparés équitablement si cette règle change entre eux. Le tuple compte les quantités par espèce, pas les oiseaux disposés en ligne ; échanger des individus du même type ne crée pas une autre solution.

La photographie contextuelle montre un pigeon gris moderne tourné vers la gauche, avec un œil orange-rouge, une cere blanche et un cou iridescent. Ce n'est pas 100 oiseaux ni preuve de l'identification de chaque mot oiseau médiéval. La ressemblance avec l'exemple ne transforme pas une photographie moderne en un événement enregistré issu de la vie de l'auteur {cite:commons-pigeon-portrait-dori current-image}.

## Exemples conservés

Nous lisons MacTutor et Aydin, pas les manuscrits originaux, l'édition de 1986 de Saidan, ni l'étude complète de Sisano. Aydin mentionne un manuscrit survivant dans un passage mais rapporte plus tard des témoins de Leyde et de Paris. Nous conservons cette tension rapportée plutôt que de décider du recensement des manuscrits via une compilation que nous n'avons pas réalisée {cite:tdv-abu-kamil work2-witnesses}.

La photographie de Dori est datée du 28 mars 2008, à Santa Barbara, et est sous licence CC BY-SA3.0US ; le JPG original est utilisé sans modification. L'image et les droits réels ont été inspectés, et non remplacés silencieusement par une licence non portée. Ses droits et son objet sont des questions distinctes de l'authentification d'un livre ou du comptage de ses solutions {cite:commons-pigeon-portrait-dori description-rights}.

## Dans la culture

Un casse-tête divertissant peut révéler la différence entre existence et complétude. Le décor oiseau à lui seul ne démontre pas la transmission entre les peuples. C'est pourquoi le récit préserve la discussion savante sur la ressemblance et le désaccord plutôt que de remplacer une histoire facile assimilant la même matière à la même méthode {cite:tdv-abu-kamil work2}.

L'explication n'a besoin ni d'une scène de cour inventée ni d'un titre qui fait de son auteur le fondateur de toute énumération moderne. Les lecteurs peuvent revenir aux conditions et comprendre pourquoi certains tuples remplissent les critères et d'autres non. L'image accompagne la compréhension ; ce n'est ni un portrait de l'auteur ni une preuve fabriquée d'une page originale.

## Pour les jeunes lecteurs

Vérifiez (4,90,1,3,2) deux fois : une fois pour le comptage et une fois pour le prix. Puis demandez si un type peut être absent. Sinon, (0,100,0,0,0) est interdit même si le comptage et le coût sont corrects. Écrivez les conditions du jeu avant de rechercher, et ne les modifiez pas lorsqu'un autre résultat apparaît.

Ne divisez pas un oiseau en deux pour simplifier la réponse. L'argent peut être fractionné tandis que le nombre d'oiseaux doit être entier. Trouvez une seconde réponse, puis demandez à propos de chaque réponse. C'est une exploration moderne inspirée par le type de problème décrit par Aydin, pas par une table originale mise dans la bouche d'Abu Kamil {cite:tdv-abu-kamil work2} {cite:proofwiki-abu-kamil-birds prices}.

## Références

- Aydin : travail, solutions entières, témoins {cite:tdv-abu-kamil work2}.
- MacTutor : biographie et argument relaté sur Sesiano {cite:abu-kamil-mactutor rare-things}.
- ProofWiki : prix modernes et variantes de décompte {cite:proofwiki-abu-kamil-birds historical-note}.
- Biens communs : photographie Dori et droits {cite:commons-pigeon-portrait-dori description-rights}.
