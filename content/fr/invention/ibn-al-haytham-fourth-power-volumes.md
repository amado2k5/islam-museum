---
id: invention/ibn-al-haytham-fourth-power-volumes
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/ibn-al-haytham-fourth-power-volumes.md}
---
## Résumé

Comment mesurer un volume dont la frontière n'est ni une boîte ni un cylindre ? [[person/ibn-al-haytham|La méthode d'Ibn al-Haytham]] relie les sommes des quatrièmes puissances au piégeage d'un solide courbé entre des grandeurs calculables. Dans ce problème, son volume est de huit quinzièmes de son cylindre environnant {cite:katz-calculus-islam-india-1995 pp.165–168}. Ce n'était pas l'invention de tout calcul différentiel, ni la première mesure de chaque paraboloïde. C'était une extension particulière du calcul géométrique à un problème nécessitant des quatrièmes puissances, accompagnée d'une démonstration plutôt que de simplement l'impression que les couches fines ressemblent à la forme {cite:bressoud-calculus-before-newton-i pp.2–4}.

## Ce que c'est

La contribution est une méthode de calcul et de démonstration, et non une machine survivante. Une quatrième puissance multiplie un nombre par elle-même quatre fois : deux à la quatrième fait seize. Ajouter des quatrièmes puissances consécutives diffère de porter la somme de ces nombres à la quatrième puissance {cite:dennis-addington-alhazen-summation-2009 pp.2–4}. La géométrie nécessite à la fois une explication des raisons pour lesquelles le carré du rayon de la section introduit des quatrièmes puissances, et un moyen de calculer leur somme sans énumérer indéfiniment de couches {cite:katz-calculus-islam-india-1995 pp.167–168}.

Le solide n'est pas le bol paraboloïde ordinaire obtenu en faisant tourner une parabole autour de son propre axe. Ici, l'axe de rotation est perpendiculaire à l'axe de la parabole et se situe à la limite de la région spécifiée {cite:bressoud-calculus-before-newton-i pp.2–3}. Le rapport 8/15 ne s'applique donc pas à tous les bols ou dômes appelés paraboliques. Notre image de comparaison montre le solide axial ordinaire précédent, et non le nouveau dôme.

## Le monde devant lui

Les problèmes de surface et de volume ont longtemps précédé Ibn al-Haytham. Katz discute de la somme des carrés d'Archimède et de la formule d'Aryabhata pour les cubes ; leur utilisation dans un argument ultérieur ne fait pas de ces résultats antérieurs de nouvelles inventions {cite:katz-calculus-islam-india-1995 p.165}. Les résultats géométriques étaient souvent exprimés sous forme de rapports avec des formes connues, plutôt que sous forme de formules modernes symboliques de volume {cite:dennis-addington-alhazen-summation-2009 pp.4–5}.

Bressoud distingue le solide axial d'Archimède, avec la moitié du volume du cylindre correspondant, des précédents de Thabit ibn Qurra et Abu Sahl al-Kuhi dans les travaux scientifiques arabes {cite:bressoud-calculus-before-newton-i p.2}. Thabit reste dans ce récit : la règle de sélection du fabricant du navigateur ne doit pas effacer les personnes dont le travail a précédé la contribution. Les travaux antérieurs n'éliminent pas l'amélioration, et l'amélioration ne réduit pas les mathématiciens antérieurs à des noms accessoires.

## L'histoire

Katz situe l'ouvrage de synthèse dans l'Égypte du XIe siècle et relie le chercheur de [[place/basra|Bassorah]] à sa vie égyptienne. TDV fournit des détails biographiques tout en rapportant des différences dans les récits de sa mort {cite:katz-calculus-islam-india-1995 pp.165–166} {cite:tdv-ibnul-heysem pp.82–87}. Nous utilisons [[place/cairo|Le Caire]] comme contexte biographique, et non comme preuve d'une pièce particulière où ce traité a été rédigé. La date générale d'activité-siècle n'est pas une date précise d'invention ou de composition.

Les sources mathématiques effectivement lues ici sont des explications savantes modernes. Savoir où une édition ou une traduction est listée ne revient pas à lire le traité original. Les détails de calcul reposent sur Katz et Bressoud ; nous ne prétendons ni avoir été classée de manuscrits arabes indépendants ni avoir lu chaque édition de leurs bibliographies {cite:katz-calculus-islam-india-1995 pp.166–168,174}.

## Le(s) fabricant(s)

Le registre de la personne conserve une base musulmane individualisée : l'ouverture dans son nom dans *Optics*, et le récit de TDV sur ses écrits défendant la prophétie et discutant de questions théologiques. Ni son nom ni la dénomination de son État d'accueil ne fournissent cette identité {cite:manazir-sabra-1983 scan-p.60} {cite:tdv-ibnul-heysem pp.82–87}. Le cadre sunnite est le cadre déclaré du musée, et non la documentation d'une école juridique personnelle. Le mécénat fatimide ne détermine pas automatiquement son affiliation.

**Cadre sunnite déclaré :** attribuer la contribution limitée tout en conservant les preuves identitaires et ses limites {cite:tdv-ibnul-heysem pp.82–87}. **Compte rendu académique :** Katz distingue les exemples de l'auteur de la reconstruction moderne ; Bressoud ne trouve explicitement aucune preuve qu'il soit allé au-delà des quatrièmes puissances, même si la méthode peut être étendue {cite:katz-calculus-islam-india-1995 pp.166–167} {cite:bressoud-calculus-before-newton-iii pp.2–3}. Cela est mathématiquement distinct des [[invention/camera-obscura|expériences existantes en chambre]] noire, pas un autre compte de cette expérience.

## Comment ça fonctionne

Nous utilisons la notation pédagogique moderne, pas une reproduction des symboles de l'auteur. Pour des longueurs positives `a,b`, prenez la parabole `x=a(y/b)^2` et la région entre celle-ci et `x=a`, avec `0≤y≤b`. Faites tourner cette région autour de `x=a`. La section horizontale a un rayon `r(y)=a(1−(y/b)^2)`, descendant de `a` à la base jusqu'à zéro au sommet {cite:bressoud-calculus-before-newton-i pp.2–3} {cite:katz-calculus-islam-india-1995 p.168}. La rotation autour de l'autre axe produit un solide différent, pas une autre vue du même volume.

Divisez la hauteur en `n` intervalles égaux, chacun `b/n` d'épaisseur. La surface d'un disque dépend du carré de son rayon. Faire un carré d'une expression de rayon contenant `y²` introduit `y⁴` ; aucune quatrième dimension spatiale n'est impliquée {cite:dennis-addington-alhazen-summation-2009 p.1}. Un disque intérieur en hauteur `ib/n` contribue `πa²b/n × (1−i²/n²)²`. L'élargissement du crochet en `1−2i²/n²+i⁴/n⁴` explique pourquoi les carrés et les quatrièmes puissances doivent être sommées {cite:katz-calculus-islam-india-1995 p.168}.

En notation moderne, la formule de quatrième puissance est `S4(n)=n^5/5+n^4/2+n^3/3−n/30`, équivalentement `n(n+1)(2n+1)(3n²+3n−1)/30` {cite:katz-calculus-islam-india-1995 p.167}. Par exemple, `1+16+81+256=354`. Cela vérifie un cas petit ; ce n'est pas une preuve que la formule fonctionne pour tout entier positif.

Un réarrangement à somme finie explique la dérivation. Écrivez `Sk` pour une somme de k-ièmes puissances. Alors `(n+1)S3(n)=S4(n)+ΣS3(j)`, pour `j=1,...,n`. En substituant la formule de la somme cube, on obtient le côté droit `5S4/4+S3/2+S2/4`. Par conséquent `S4=4(n+1/2)S3/5−S2/5` ; substituez les formules connues du carré et du cube pour terminer {cite:bressoud-calculus-before-newton-iii pp.2–3} {cite:katz-calculus-islam-india-1995 pp.166–167}. Il s'agit d'une reconstruction moderne vérifiable. Katz précise que la dérivation de l'auteur illustre `n=4` et affirme le résultat général. La présentation moderne de Katz ne doit pas devenir un texte médiéval prétendument littéral.

Après substitution, la somme interne du disque divisée par le volume cylindrique `πa²b` est `L(n)=8/15−1/(2n)−1/(30n^4)`. La somme extérieure est `U(n)=L(n)+1/n`. Ces définitions pédagogiques englobent chaque couche réelle entre un disque plus petit et un disque plus grand ; leur différence totale est `1/n` du cylindre et peut être rendue aussi petite que nécessaire. Aux `n=4`, `L=0.408203125` et `U=0.658203125`, englobant `8/15` {cite:katz-calculus-islam-india-1995 p.168}.

Ces chiffres sont notre exemple, pas des mesures historiques. Supposons que le volume réel diffère de `8πa²b/15`. Réduisez l'espace entourant cette différence supposée et obtenez une contradiction avec le confinement géométrique : c'est une explication moderne de l'argument épuisement/double-réduction que Katz décrit {cite:katz-calculus-islam-india-1995 p.168}. Il n'existe pas de disque final d'épaisseur nulle, et la convergence n'est pas prouvée en dessinant de nombreuses couches. Pour nos propres longueurs `a=2,b=3`, le volume est `32π/5` des unités cubiques ; les unités de longueur doivent concorder.

Notre reconstruction suppose un nombre entier positif de divisions et une hauteur positive/rayon de base. La hauteur nulle ne laisse aucun intervalle pour diviser ; le rayon zéro effondre le solide. Ces cas dégénérés ne doivent pas être masqués par la division par zéro. Augmenter le nombre de divisions n'augmente pas la hauteur de l'objet : l'épaisseur du disque et le nombre varient tant que les deux longueurs restent fixes. Les modèles de disque distinguent le changement d'approximation de ce qui est mesuré {cite:bressoud-calculus-before-newton-i p.3} {cite:katz-calculus-islam-india-1995 p.168}.

La vérification dimensionnelle permet de détecter une formule mal transcrite. Le volume nécessite une longueur cubique, cohérente avec `a²b`, et non avec le facteur d'aire `ab`. Le rapport au cylindre est sans dimension car les deux grandeurs ont le même type d'unité. Doubler toutes les longueurs multiplie le volume par huit tout en préservant le ratio. Il s'agit d'une conséquence pédagogique de la formule affichée, et non d'une expérience rapportée réalisée par l'érudit {cite:katz-calculus-islam-india-1995 p.168}.

## La diffusion

Katz rapporte la formule de la quatrième puissance dans les œuvres ultérieures d'Ibn Haydur, Ibn Ghazi et al-Kashi, mais présente la transmission vers l'Europe comme une question de recherche manuscrite plutôt que comme une chaîne complète enseignant-élève {cite:katz-calculus-islam-india-1995 pp.168,174}. La présence d'une formule dans un livre ultérieur n'établit pas en soi la voie par laquelle elle est arrivée. La circulation latine documentée de l'*Optique* ne prouve pas non plus que chaque résultat mathématique séparé a circulé avec elle {cite:katz-calculus-islam-india-1995 p.166}.

## Sur quoi elle a été bâtie

Le calcul utilise des sommes de puissance plus simples, une surface circulaire et des grandeurs englobantes/inscrites. Dennis et Addington utilisent des rectangles et des bandes pour expliquer le réarrangement et la coordination de la représentation numérique avec la géométrie {cite:dennis-addington-alhazen-summation-2009 pp.1–4}. Cela ne nécessite pas de supposer qu'Ibn al-Haytham ait lu directement le texte particulier d'Archimède sur le solide. Bressoud distingue la géométrie héritée des démonstrations développées dans les contextes scientifiques arabes {cite:bressoud-calculus-before-newton-i p.2}.

## Ce qui a été construit dessus

**Frontière sunnite — attribution :** établir cette contribution ne nécessite pas d'attribuer chaque développement mathématique ultérieur à son créateur {cite:tdv-ibnul-heysem pp.82–87}. **Compte rendu académique :** Katz explique comment la structure arithmétique peut être généralisée tout en séparant ce que nous pouvons extraire aujourd'hui de ce que le chercheur a affirmé ; Les routes européennes restent une question de recherche dans son exposé {cite:katz-calculus-islam-india-1995 pp.166–167,174}. Notre diagramme générique ne fabrique donc pas de lien direct avec un programme de conception nommé ou un dôme historique.

## Impact sur la vie quotidienne

Les passages lus ne documentent pas un atelier fabriquant des réservoirs selon ce ratio, ni ne quantifient les économies d'argent ou de matériaux. La réalisation documentée est mathématique : trouver un volume exact par calcul et confinement plutôt que par estimation d'une limite courbe {cite:katz-calculus-islam-india-1995 pp.167–168}. Les visiteurs peuvent essayer les couches de papier, mais la précision de la découpe et l'épaisseur du papier appartiennent à une expérience moderne, pas à la preuve historique. La photographie d'un modèle n'est pas une preuve de son âge ou de sa justesse mathématique.

## Comment cela a changé l'histoire

Cette méthode montre une histoire du volume et de l'intégration répartie à travers les problèmes et les périodes, pas un seul moment d'invention. Bressoud utilise la difficulté d'aller au-delà de la géométrie carrée/cube pour expliquer les connaissances précédant les formules d'école rapide {cite:bressoud-calculus-before-newton-i pp.1–4}. Le nombre et la forme se contraignent mutuellement : une formule de sommation est insuffisante à moins que les disques n'encapsulent le solide correct, et un dessin n'est pas suffisant sans calcul de leur somme. Cette relation fait de la méthode plus qu'une simple curiosité numérique.

## Qui l'a inventé ?

L'attribution est une extension des méthodes de volume utilisant les quatrièmes puissances, et non l'invention de l'addition, du premier dôme ou du théorème fondamental du calcul différentiel {cite:katz-calculus-islam-india-1995 pp.165–168,174}. **Sunni :** le cadre déclaré n'est pas une preuve de priorité scientifique {cite:tdv-ibnul-heysem pp.82–87}. **Compte rendu académique :** conserve ce que les explications lues soutiennent et distingue l'argument de l'auteur de la reconstruction moderne. Ne pas lire indépendamment l'original arabe constitue une limitation de source, pas une autorisation de le fournir de mémoire {cite:katz-calculus-islam-india-1995 pp.166–168}.

## Aujourd'hui

L'exemple enseigne la différence entre une somme finie et un volume exact, ainsi qu'entre la vérification numérique et la démonstration. Le diagramme moderne de partage de Steven Baltakatei Sandoval montre le bol axial ordinaire avec diamètre et hauteur : il s'agit d'une comparaison avec le problème précédent, pas d'une image du dôme 8/15 {cite:commons-paraboloid-dh image and licensing}. Modifier mentalement l'axe de rotation modifie l'objet lui-même, pas seulement l'angle de caméra.

## Exemples conservés

Nos témoins inspectés sont le papier moderne, comprenant 167–168 images imprimées, et l'exposition de Bressoud — pas un manuscrit autographe {cite:katz-calculus-islam-india-1995 pp.167–168} {cite:bressoud-calculus-before-newton-i pp.2–4}. Katz fait référence à l'étude de Rashed sur le paraboloide ; c'est une piste de recherche, pas une permission de citer des pages non lues {cite:katz-calculus-islam-india-1995 p.174}. L'illustration sous licence n'est ni un instrument historique ni une feuille médiévale nouvellement découverte.

## Dans la culture

L'exemple aide à expliquer les mathématiques à travers des personnes nommées, des questions et des médiateurs, plutôt que de prétendre qu'une seule civilisation a tout créé. Les mathématiciens grecs, indiens et arabes apparaissent avec des problèmes et des périodes différents dans ces récits {cite:bressoud-calculus-before-newton-i pp.1–4} {cite:katz-calculus-islam-india-1995 pp.165–168}. Toutes les coupoles visibles ne portent pas la signature mathématique d'Ibn al-Haytham : la ressemblance ne spécifie pas exactement une courbe ni ne prouve que son bâtisseur a utilisé cette formule.

## Pour les jeunes lecteurs

Imaginez une tour de disques se rétrécissant vers le haut. Une tour étroite reste à l'intérieur d'une forme courbe ; une tour plus large la recouvre. Les couches plus fines réduisent la différence. Cela introduit l'idée de délimitation derrière le calcul {cite:katz-calculus-islam-india-1995 p.168}. Demandez toujours quelle région tourne, et autour de quelle ligne. Essayez ensuite les chiffres, en gardant en tête que quatre couches réussies ne peuvent pas à elles seules prouver ce qui se passe pour chaque nombre de couches.

## Références

- Katz1995, sélectionné 163–168,174 lus ; 167–168 images vérifiées. Pas l'article complet ni le traité arabe original {cite:katz-calculus-islam-india-1995 selected passages}.
- Bressoud I1–4 et III1–3, articles réels plutôt que résumés IA de plateforme {cite:bressoud-calculus-before-newton-i pp.1–4} {cite:bressoud-calculus-before-newton-iii pp.1–3}.
- Dennis/Addington note une base identitaire individualisée existante et des métadonnées d'image modernes {cite:dennis-addington-alhazen-summation-2009 pp.1–5} {cite:manazir-sabra-1983 scan-p.60} {cite:tdv-ibnul-heysem pp.82–87} {cite:commons-paraboloid-dh licensing}.
