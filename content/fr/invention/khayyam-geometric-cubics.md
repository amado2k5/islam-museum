---
id: invention/khayyam-geometric-cubics
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/khayyam-geometric-cubics.md}
---
## Résumé

[[person/umar-khayyam|Umar Khayyam]] n'a pas commencé l'algèbre à partir de rien ni fourni la formule radicale générale aujourd'hui associée aux équations cubiques : sa contribution ici est un traitement géométrique systématique de quatorze formes cubiques irréductibles sous des conventions de coefficients positifs {cite:sep-umar-khayyam sec.4.1}. Un problème devient le choix de deux courbes, la construction de leur intersection, et la preuve qu'une longueur obtenue à partir de celle-ci satisfait à l'exigence {cite:khayyam-woepcke-1851 pp.32–34}. Nous présentons une amélioration méthodologique avec des prédécesseurs et des limites, et non une compétition qui fait disparaître tous ceux qui l'ont avant et après lui.

## Ce que c'est

Un problème cubique contient le cube d'une inconnue, peut-être à côté de son carré, un terme linéaire ou un nombre connu ; Khayyam distingue les formes selon les termes présents et le côté sur lequel elles apparaissent, en travaillant avec des grandeurs positives {cite:sep-umar-khayyam sec.4.1}. Quatorze formes ne signifient pas quatorze sujets sans lien : la classification correspond au langage et aux conventions de l'algèbre géométrique, plutôt qu'à une liste moderne de toutes les combinaisons possibles de signes {cite:sep-umar-khayyam sec.4.1}.

Les courbes pertinentes incluent les cercles, paraboles et hyperboles, l'intersection de deux déterminant une longueur requise ; le cercle n'est pas une décoration à côté d'une équation résolue indépendamment {cite:sep-umar-khayyam sec.4.1}. Une solution géométrique est une construction avec démonstration, tandis qu'une solution radicale fournit une expression algébrique impliquant des opérations telles que les racines carrées et cubiques. Partager une réponse numérique ne fait pas de ces éléments le même type de solution.

## Le monde devant lui

Les traitements géométriques des quadratiques appartenaient à des traditions plus anciennes ; Stanford situe Khayyam sur le travail grec et babylonien ainsi qu'après al-Khwarizmi et Thabit ibn Qurra, donc relier une magnitude inconnue à une figure géométrique n'était pas son invention isolée {cite:sep-umar-khayyam sec.4.1}. Thabit a sa place dans l'histoire prédécèdente : nous ne le reclassions ni comme un créateur musulman pour répondre aux critères du navigateur, ni ne l'effaceons de l'histoire.

Pour les cubiques, l'entrée mentionne la réduction par al-Mahani d'un problème archimède à une équation, la solution conique d'un cas particulier par al-Khazin, et le traitement non exhaustif d'al-Layth ; elle rapporte que Khayyam lui-même connaissait des solutions antérieures de quatre cas {cite:sep-umar-khayyam sec.4.1}. La différence entre un cas particulier et une classification plus large identifie la contribution, plutôt qu'une affirmation selon laquelle personne n'avait auparavant rencontré un cubique. Ces noms n'établissent pas de chaîne personnelle maître-élève.

## L'histoire

MacTutor associe le déménagement de Khayyam à [[place/samarqand|Samarcande]] en 1070 avec le soutien d'Abu Tahir et le traité d'algèbre ; nous utilisons cela comme contexte approximatif de composition, et non comme jour de première découverte ou construction {cite:khayyam-mactutor Samarkand and algebra}. L'organisation par type d'équation permettait une question au-delà d'un seul exemple : que se passe-t-il lorsque la combinaison des termes change, et une intersection peut-elle fournir la magnitude requise ? Son traitement systématique rend cette question plus large visible {cite:sep-umar-khayyam sec.4.1}.

Stanford décrit également un problème géométrique précoce impliquant la division d'un quadrant, menant en notation moderne à une cubique traitée avec un cercle et une hyperbole ; ce problème ne doit pas être confondu avec le cas cercle/parabole expliqué ci-dessous {cite:sep-umar-khayyam sec.4.1}. Différentes paires de courbes font partie de la méthode, et non une incohérence à dissimuler derrière un seul diagramme attrayant. Un marqueur de ville n'établit pas la pièce ou la surface d'écriture exacte utilisée.

## Le(s) fabricant(s)

Khayyam était un mathématicien, astronome et philosophe également associé à l'image du poète ; Stanford distingue sa voix philosophique de l'image poétique et décrit explicitement la première comme celle d'un philosophe musulman {cite:sep-umar-khayyam sec.2.7}. Cela fournit la base identitaire individuelle, plutôt que son nom ou la cour du mécène. Le cadre sunnite du musée est déclaré, et non une preuve documentaire de son école juridique personnelle.

**Sunnite — cadre déclaré :** Nous présentons l'œuvre dans son cadre seldjoukide documenté, distinguant la règle de cadrage du musée d'une déclaration personnelle que la référence ne fournit pas {cite:khayyam-mactutor life}. **Interprétation académique :** Stanford discute de tension apparente entre œuvres philosophiques et image poétique sans les assimiler automatiquement {cite:sep-umar-khayyam sec.2.7}. **Critique rapportée :** Unat rapporte la classification hostile de Najm al-Din Daya aux côtés de récits favorables ; nous attribuons ce jugement à la référence effectivement lue, sans verdict de musée {cite:tdv-omer-hayyam-unat pp.66–68}.

## Comment ça fonctionne

Prenez un cas de la traduction française, où un cube et des termes linéaires sont égaux à un nombre, et expliquez-le en notation moderne, et non en lettres prétendues être les propres {cite:khayyam-woepcke-1851 pp.32–34} de Khayyam. Soit `x³ + a²x = b`, avec un `a` et `b`. Choisissez la parabole `x² = ay` et un cercle de diamètre horizontal `b/a²`, écrit `y² = x(b/a² − x)`. Il s'agit d'une réécriture pédagogique d'un cas d'intersection, pas d'une recette pour les quatorze formes {cite:khayyam-woepcke-1851 pp.32–34} {cite:commons-khayyam-cubic-kuiper description}.

En substituant `y` on obtient `x⁴/a² = xb/a² − x²`, donc `x(x³ + a²x − b) = 0`. La prudence est essentielle : l'origine se trouve sur les deux courbes mais ne résout pas la cubique originale lorsque `b` est positif. Nous choisissons l'intersection positive non nulle ; en divisant `x` on montre alors que sa coordonnée horizontale répond à l'exigence. Il s'agit d'une condition mathématique, pas d'un détail visuel optionnel.

Pour un exemple moderne choisi ici pour l'enseignement, et non les nombres revendiqués dans le texte de Khayyam, ensemble `a=2`, `b=16` : le cubique est `x³+4x=16`, la parabole `y=x²/2`, et le cercle a centre `(2,0)` et rayon2. Les deux passent par `(2,2)`, donnant la longueur horizontale `x=2` ; la vérification est directe : `8+8=16`. Le texte traduit confirme le résultat par des longueurs et des proportions : la page 33 nomme la parabole, le demi-cercle et les projections perpendiculaires, et non cet exemple numérique moderne {cite:khayyam-woepcke-1851 pp.32–34}.

Cet exemple ne prouve pas que le traitement de Khayyam englobait tout ce que l'on sait aujourd'hui sur les racines : MacTutor et Stanford expliquent les limites dans sa gestion de solutions positives multiples, et les longueurs géométriques positives ne constituent pas une théorie des nombres complexes {cite:khayyam-mactutor algebra} {cite:sep-umar-khayyam sec.4.1}. Nous préservons à la fois la réussite et les limites de la construction plutôt que de sacrifier l'une ou l'autre au profit d'une histoire plus simple.

## La diffusion

L'édition de Woepcke de 1851 propose un texte arabe et une traduction française, et des références modernes nomment d'autres éditions et études ; la lecture principale pour ce document est spécifiquement français32–34, et non l'inspection de chaque manuscrit et édition d'une bibliographie {cite:khayyam-woepcke-1851 edition and pp.32–34} {cite:tdv-omer-hayyam-unat bibliography}. Savoir qu'un chemin vers le texte existe n'est pas la même chose que prétendre avoir suivi chaque chemin.

Stanford oppose les solutions géométriques aux méthodes radicales associées à del Ferro, Tartaglia et Cardano au XVIe siècle ; cette page n'infère pas une chaîne de transmission personnelle de Khayyam vers chacune d'elles {cite:sep-umar-khayyam sec.4.1}. La préséance chronologique diffère des preuves qu'une copie est arrivée, a été lue ou a directement informé une technique, de sorte que les inventions dépendantes confirmées ne sont pas inventées pour remplir un graphique.

## Sur quoi elle a été bâtie

L'ouvrage repose sur la construction conique, le raisonnement proportionnel et une histoire de transformation des magnitudes algébriques en problèmes géométriques ; Stanford cite des prédécesseurs qui ne peuvent être retirés pour faire paraître l'auteur seul {cite:sep-umar-khayyam sec.4.1} {cite:khayyam-woepcke-1851 pp.32–34}. La page 33 ne se contente pas d'observer que deux courbes semblent justes : elle relie une longueur au carré à un produit de longueurs et suit une suite de rapports {cite:khayyam-woepcke-1851 p.33}.

Notre chaîne d'enseignement générique va donc des problèmes héréditaires au traitement systématique. Sa flèche n'est pas un jugement sur la foi d'un prédécesseur, ni une preuve d'instruction personnelle, ni une affirmation selon laquelle chaque travail mathématique antérieur aurait directement causé celui-ci.

## Ce qui a été construit dessus

Le traitement fournit un exemple historique clair de solutions cubiques géométriques avant une formule radicale générale ; les références le placent dans l'histoire des relations entre algèbre et géométrie {cite:sep-umar-khayyam sec.4.1}. Cela ne fait pas de toute la géométrie analytique moderne une invention de Khayyam ni que les coordonnées utilisées dans notre explication sont reconnues dans son manuscrit.

La comparaison sûre ici demande en quoi la construction à deux courbes et une démonstration des longueurs diffèrent d'une expression algébrique pour une solution. Attribuer une méthode européenne particulière à son travail nécessiterait des preuves de transmission non fournies par les passages lus, de sorte qu'aucune dépendance technique automatique n'est enregistrée.

## Impact sur la vie quotidienne

L'impact démontré dans ces références est mathématique et pédagogique : une famille de problèmes cubiques devient un sujet organisé de construction, de preuve et de comparaison plutôt qu'un succès avec un seul exemple isolé {cite:sep-umar-khayyam sec.4.1}. Les passages lus ne fournissent aucun nombre de marchands ou de bâtisseurs utilisant ces cas, aucune économie monétaire et aucune base pour faire de cette construction la cause de la réforme du calendrier de Khayyam.

Pour le lecteur d'aujourd'hui, l'exemple distingue un dessin suggérant une réponse d'une preuve qui l'établit. Nous pouvons remarquer une intersection, la vérifier par substitution, et découvrir que l'origine induit en erreur si l'équation originale est oubliée. C'est un usage éducatif proposé ici, et non un recensement historique de l'impact quotidien.

## Comment cela a changé l'histoire

Les références décrivent un progrès au-delà des cas dispersés vers la classification et la solution, reconnaissant à la fois les travaux antérieurs et l'analyse incomplète de la multiplicité des racines {cite:sep-umar-khayyam sec.4.1} {cite:khayyam-mactutor algebra}. L'histoire montre pourquoi l'histoire de l'algèbre n'est pas simplement une voie unique sur laquelle les symboles remplacent brusquement les formes : la géométrie peut être une méthode de recherche et de démonstration, et non un prélude immature à des mathématiques valides.

Les éditions et études modernes placent cette œuvre aux côtés des quattrains les plus connus sans déterminer l'authenticité de chaque poème ou anecdote biographique ; différentes questions nécessitent des preuves différentes {cite:tdv-omer-hayyam-unat pp.66–68} {cite:sep-umar-khayyam secs.2.7,4.1}. Nous ne tranchons pas les désaccords littéraires avec une preuve mathématique ni ne validons une construction simplement parce que son auteur est célèbre.

## Qui l'a inventé ?

L'attribution du document est « amélioration » et le rôle de Khayyam « améliorateur » : les références attribuent le traitement géométrique systématique de quatorze formes tout en nommant les cas résolus avant lui {cite:sep-umar-khayyam sec.4.1}. « Résoudre des équations cubiques » à lui seul est trop imprécis : cela peut signifier une approximation numérique, une construction géométrique, une formule radicale ou un compte rendu de toutes les racines.

Nous identifions le type de travail et ses limites avant de répondre à la question prioritaire. La contribution soutenue est un traitement systématique dans un livre, pas la première rencontre avec une cubique ou l'invention de l'algèbre, des cercles ou des paraboles. Les formules radicales européennes ultérieures restent un sujet distinct, et non un nouveau nom pour exactement la même solution {cite:sep-umar-khayyam sec.4.1}.

## Aujourd'hui

Les lecteurs peuvent comparer le cas traduit avec l'image moderne et vérifier l'exemple par une arithmétique simple ; le diagramme publié est de Pieter Kuiper, avec une correction colorimétrique de Ruud Koot, sous une dédicace de domaine public {cite:commons-khayyam-cubic-kuiper description and upload history}. Il comporte une parabole bleue, un cercle violet et un segment rouge, et non une page écrite de la main de Khayyam ni un instrument archéologique imaginé {cite:commons-khayyam-cubic-kuiper image}.

La notation moderne sert à expliquer tandis que la date et l'emplacement du texte restent explicites, de sorte que la lisibilité n'efface pas les différences de langage mathématique. La valeur pédagogique continue est également distincte de l'affirmation que la construction est la méthode pratique privilégiée pour tout calcul contemporain.

## Exemples conservés

Le témoin lit spécifiquement est la traduction de Woepcke de 1851, en particulier les 32–34 et la construction associée à la figure 17 ; l'image de la page 33 a été vérifiée dans le public reader pour son parabole et son libellé en demi-cercle {cite:khayyam-woepcke-1851 pp.32–34}. Il s'agit ici d'une inspection d'un témoin traduit imprimé, non de l'identification d'un autographe ou d'une compilation indépendante de l'ensemble de l'arabe.

Le diagramme coloré témoigne de l'enseignement moderne, daté de 2011 dans son historique de téléchargement, et non de la première construction du XIe siècle {cite:commons-khayyam-cubic-kuiper upload history}. Maintenir cette différence évite que la date d'une image soit confondue avec celle d'une idée, ou que chaque illustration de musée soit prise pour un objet de l'époque de son sujet.

## Dans la culture

L'image poétique de Khayyam se trouve à côté de son travail mathématique et philosophique ; Stanford discute de la relation entre les voix attribuées plutôt que de réduire toutes les œuvres à une seule image {cite:sep-umar-khayyam sec.2.7}. Nous ne reproduisons aucun quatuor traduit et n'utilisons pas un poème contesté comme témoignage concluant des convictions de son auteur.

Une légende biographique fait de Khayyam, Nizam al-Mulk et Hasan-i Sabbah des amis d'enfance ; MacTutor évoque les différences d'âge qui compromettent sa forme familière {cite:khayyam-mactutor childhood legend}. Le patronage politique peut appartenir à une biographie sans prouver cette classe imaginée, raison pour laquelle l'abrégation précédente mêlant amitié et réforme du calendrier a été corrigée.

## Pour les jeunes lecteurs

Imaginez une question sur un nombre inconnu, puis deux formes se rencontrant. Khayyam utilisait des courbes pour des problèmes cubiques et les organisait après des chercheurs antérieurs {cite:sep-umar-khayyam sec.4.1}. Un beau dessin ne suffit pas : nous devons expliquer pourquoi son intersection donne la réponse.

Dans notre exemple moderne2 rencontre `2³+4×2=16`. Zéro ne le fait pas, même si les deux courbes le traversent. Cela enseigne la différence entre voir et prouver : revenir à la question initiale plutôt que choisir le premier point remarqué. Apprendre l'histoire d'une idée ne nécessite pas de créditer à un seul chercheur tout ce qu'on sait avant et après lui.

## Références

- Woepcke1851, traduction en algèbre française 32–34, figure 17 construction ; page 33 vérifiée visuellement, pas de collation arabe indépendante. {cite:khayyam-woepcke-1851 pp.32–34}
- Stanford Encyclopedia, révisée en 2023, 2.7 et 4.1 : identité philosophique, classification, prédécesseurs et limites. {cite:sep-umar-khayyam secs.2.7,4.1}
- Unat, TDV34(2007), 66–68 : section scientifique, non contribution littéraire distincte. {cite:tdv-omer-hayyam-unat pp.66–68}
- O'Connor et Robertson, MacTutor, mise à jour de juillet 1999 : biographie, Samarcande, limites algébriques et légende des camarades d'école. {cite:khayyam-mactutor}
- Commons, diagramme de Kuiper / édition couleur Koot : historique de téléchargement et dédicace. {cite:commons-khayyam-cubic-kuiper description and upload history}
