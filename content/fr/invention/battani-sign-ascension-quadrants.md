---
id: invention/battani-sign-ascension-quadrants
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: draft}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/battani-sign-ascension-quadrants.md}
---
## Résumé
La méthode d'al-Battani pour les ascensions de signes entre les quadrants de la sphère est le chapitre LV de son Zij accompagné d'un traité dédié, aujourd'hui perdu, que les catalogues médiévaux répertorient sous le titre Kitab ma'rifat matali' al-buruj fi ma bayna arba' al-falak {cite:nallino-albatenii-opus-astronomicum p. 28}. Les ascensions droites au méridien et les ascensions obliques à l'horizon étaient déjà connues ; ce que le chapitre ajoute est un schéma complet pour les espaces entre ces quatre cuspides, selon une règle proportionnelle entre les deux valeurs connues {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. Les quantités servent aux temps croissants des signes zodiacals et aux directions astrologiques que Ptolémée a évoquées dans les Tétrabibles {cite:nallino-albatenii-opus-astronomicum t. I p. 135}.

## Ce que c'est
C'est une méthode computationnelle en astronomie sphérique : un schéma piloté par une table permettant de déterminer combien d'heures équinoctiales un signe met pour se lever ou se coucher à n'importe quel point de la sphère céleste, à n'importe quelle latitude. La méthode fonctionne sur l'écliptique divisée en douze signes et trente degrés chacun ; pour tout degré ou étoile, avec ou sans latitude, elle interpole entre l'ascension droite connue de la sphère droite et l'ascension oblique connue à partir des tables climatiques {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. La sortie est une quantité en heures temporelles, l'unité dans laquelle le montant et le coucher sont mesurés sur la sphère céleste.

## Le monde devant lui
Avant al-Battani, les astronomes possédaient deux familles de valeurs ascensionnelles. Dans la sphère droite — la sphère faisant référence à l'équateur céleste — les ascensions des signes au méridien et aux cuspides du nadir étaient tabulabilement dans les premiers chapitres de la tradition Zij {cite:nallino-albatenii-opus-astronomicum t. I p. 131}. Dans chaque climat, les ascensions obliques des signes aux cuspides de l'horizon — les points ascendant et descendant — étaient également connues à partir des tables climatiques {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–132}. Ce qui restait inconnu, c'était le comportement des signes dans les régions de la sphère entre ces cuspides, et c'est précisément là l'écart que le chapitre aborde.

Le problème n'était pas purement académique. Les quantités sont nécessaires en astrologie : pour trouver la direction d'une planète ou un point sensible d'une nativité, il faut connaître l'arc de la sphère par laquelle elle traverse entre la montée et la culmination, et cet arc dépend d'ascensions qui varient selon la position {cite:nallino-albatenii-opus-astronomicum t. I p. 135}. Les calculateurs antérieurs avaient approximé les grandeurs nécessaires ; le chapitre d'al-Battani remplace l'approximation par une règle énoncée.

## L'histoire
[[person/al-battani|Abu Abdallah Muhammad ibn Jabir al-Battani]], connu en latin sous le nom d'Albategnius, travailla à la Raqqa abbasside du IXe siècle, où il fit des observations solaires et lunaires minutieuses et composa le zij qui porte son nom {cite:tdv-battani-muftuoglu}. Le zij existe en deux versions : une version antérieure dont les chapitres furent déjà cités par Thabit ibn Qurra avant 288 H, et une version plus récente et plus précise {cite:nallino-albatenii-opus-astronomicum t. I p. 131}. Le chapitre LV appartient à ce corpus.

Le chapitre commence en triant ce qui était connu de ce qui restait. La traduction latine de Nallino conserve la structure : l'auteur rappelle d'abord les ascensions droites des signes dans la sphère droite, puis les ascensions des signes dans le climata aux deux cuspides de l'horizon, puis précise que ce qui reste nécessaire, c'est le calcul des espaces entre ces cuspides dans chaque région de la sphère {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–134}. Il donne ensuite la règle, donne un exemple sur le signe Bélier et généralise aux degrés et étoiles, avec ou sans latitude, dans trois cas positionnels {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}.

Un traité distinct sur le même sujet est répertorié par trois bibliographes médiévaux — Ibn al-Nadim dans le Fihrist, al-Qifti dans l'Akhbar al-hukama, et Ibn Khallikan dans le Wafayat al-a'yan — sous le titre Kitab ma'rifat matali' al-buruj fi ma bayna arba' al-falak, « le livre de connaître les ascensions des signes dans ce qui se trouve entre les quatre sphères » {cite:nallino-albatenii-opus-astronomicum p. 28}. Le traité n'a pas survécu ; L'édition critique de Nallino ne conserve que les notes du catalogue et le chapitre de zij lui-même.

## Le(s) fabricant(s)
Al-Battani était un astronome musulman du début de la période abbasside, actif à Raqqa sous les successeurs des califes al-Ma'mun. Sa biographie dans le TDV Islam Ansiklopedisi le décrit comme l'un des grands astronomes d'observation de son époque, dont les paramètres solaires corrigèrent ceux de Ptolémée et dont la théorie lunaire nourrit les tables zij ultérieures {cite:tdv-battani-muftuoglu}. Son zij fut traduit en grec par George Chrysococcès au XIIIe siècle et influença les traditions tolétique et alfonsine {cite:nallino-albatenii-opus-astronomicum t. I}. Dans le cadre sunnite du musée, son identité musulmane est documentée par les sources arabes et sa position dans les institutions savantes abbassides ; aucun madhhab personnel n'est attesté séparément dans les sources lues.

## Comment ça fonctionne
La méthode repose sur une proportion. Pour un degré ou une étoile située entre deux cuspides de référence de la sphère, la distance en heures temporelles à partir d'une cuspide détermine quelle fraction de la différence entre l'ascension droite et l'ascension oblique s'applique {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. L'édition de Nallino montre l'exemple travaillé sur Bélier : le signe monte à la cuspide méridienne en 27 degrés 53 minutes de temps équinoctial, tandis que dans le quatrième climat il monte à l'horizon en 19 degrés 12 minutes, et se couche avec la montée de la Balance en 36 degrés 34 minutes {cite:nallino-albatenii-opus-astronomicum t. I p. 134}. Six heures temporelles séparent chaque cuspide de la suivante, et la règle proportionnelle s'interpole à l'intérieur de cet intervalle.

Le chapitre donne ensuite les règles générales. Pour un degré ou une étoile sans latitude, le calcul utilise la différence entre les ascensions droite et oblique pondérée par position ; pour un corps avec latitude, des termes supplémentaires tiennent compte de sa distance par rapport à l'écliptique {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. Trois cas sont distingués selon que le corps se trouve dans l'hémisphère oriental, l'hémisphère occidental ou soit réparti entre les deux. Une formulation alternative utilise directement les heures temporelles diurnes et nocturnes. Le chapitre se termine en précisant que ces quantités sont nécessaires pour les nativités des astrologues, pour diriger les significateurs comme le décrit Ptolémée dans les Tétrabibles {cite:nallino-albatenii-opus-astronomicum t. I p. 135}.

## La diffusion
Le zij contenant le chapitre voyagea largement. Il fut traduit en grec, étudié en latin occidental, et constitua l'une des sources des tables Alfonsines ; le sujet du chapitre — ascensions pour des directions astrologiques — le maintenait dans le cadre de l'astronomie opérationnelle tant de la cour que des madrasas {cite:nallino-albatenii-opus-astronomicum t. I}. Le traité dédié n'apparaît que dans des bibliographies ; sa disparition signifie que le chapitre zij est la seule déclaration survivante du schéma.

## Sur quoi elle a été bâtie
La méthode repose sur deux couches héritées. Premièrement, la tradition astronomique ptolémaïque et indienne qui a fourni le cadre sphérique, les tables climatiques et la notion même d'ascension oblique {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–132}. Deuxièmement, les chapitres antérieurs d'al-Battani lui-même, qui ont tablement les ascensions droites et climatiques que sa nouvelle règle interpole entre {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. L'introduction de Nallino note que les calculateurs précédents avaient traité le problème par des approximations plus rudimentaires et que la valeur d'al-Battani réside dans l'énoncation explicite de la règle proportionnelle {cite:nallino-albatenii-opus-astronomicum t. I pp. 315–317}.

## Ce qui a été construit dessus
Dans la tradition zij, le chapitre alimentait les chapitres astrologiques qui calculent les directions et les pronéties ; le traité perdu, s'il avait survécu, aurait été son énoncé le plus complet {cite:nallino-albatenii-opus-astronomicum p. 28}. Les auteurs plus tardifs de zij héritèrent des tables ascensionnelles et du problème de direction, bien que l'édition de Nallino ne trace pas de successeur nommé à cette règle proportionnelle spécifique. La survie du schéma est principalement textuelle : elle figure dans le chapitre où les copistes ultérieurs l'ont conservée.

## Impact sur la vie quotidienne
Son impact quotidien était indirect mais réel. Les temps de prière et la direction de la qibla dépendent des mêmes quantités sphériques — arcs ascendants, angles horaires, distances méridiennes — que le chapitre systématise {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}. Le muwaqqit qui chronométrerait les prières dans une mosquée travaillait avec des tables ascensionnelles de ce type exact, même si le but déclaré du chapitre était astrologique plutôt que rituel {cite:tdv-battani-muftuoglu}.

## Comment cela a changé l'histoire
Le chapitre témoigne de la précision de l'astronomie computationnelle abbasside : un problème que les mains avaient approximé auparavant se voit attribuer une règle d'interpolation explicite avec des exemples travaillés et des limites énoncées {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. Il marque également la frontière entre l'astronomie mathématique et l'astrologie à l'intérieur du zij — les mêmes tables servent les deux, et le chapitre le dit en liant ses quantités au Tetrabiblos {cite:nallino-albatenii-opus-astronomicum t. I p. 135}. Son poids historique est documentaire : le traité perdu signifie que nous voyons la méthode à l'étape que le zij conserve, et non à sa forme possiblement plus complète.

## Qui l'a inventé ?
Al-Battani n'a pas inventé l'astronomie ascensionnelle. Les ascensions droite et obliques furent tabulates devant lui, et le problème de direction était celui de Ptolémée. Sa contribution documentée est l'extension systématique du calcul aux espaces entre les quatre cuspides, énoncée comme une règle proportionnelle et traitée en détail — une amélioration au sein d'une tradition héritée, et non une nouvelle science. Le musée note le statut d'amélioration, avec la réserve que la perte du traité dédié laisse le chapitre zij comme seul témoin.

## Aujourd'hui
La règle proportionnelle elle-même est supplantée : l'astronomie sphérique moderne calcule ascensions et directions par des formules directes, et les quantités recherchées par le chapitre sont désormais obtenues instantanément par logiciel {cite:nallino-albatenii-opus-astronomicum t. I pp. 134–135}. Ce qui subsiste, c'est le problème — la façon dont les arcs ascendants varient à travers la sphère céleste — et le chapitre reste un exemple clair de la façon dont les astronomes médiévaux ont transformé une difficulté géométrique en un calcul tabulable et régi par des règles.

## Exemples conservés
Aucun instrument ni manuscrit du traité perdu n'est connu comme ayant survécu. La méthode subsiste textuellement au chapitre LV du zij, préservé dans la tradition manuscrite arabe, ainsi que dans l'édition critique {cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135} de Nallino de 1899–1907. L'image affichée dans ce document montre un manuscrit astronomique islamique médiéval — un Livre des Images des Étoiles — comme contexte de la culture manuscrite qui a conservé de telles œuvres, et non comme exemple de la méthode elle-même.

## Dans la culture
La tradition du zij qui porte ce chapitre appartient au même monde savant qui a produit l'astrolabe, le quadrant et les tables du muwaqqit ; ses chapitres ascensionnels faisaient partie du savoir pratique des astronomes de Bagdad au Caire et à Cordoue {cite:tdv-battani-muftuoglu}. Le double public du chapitre — mathématiciens et astrologues — reflète la confiance de l'époque qu'une seule machine sphérique pouvait servir à la fois à mesurer le temps avec précision et à interpréter l'influence céleste.

## Pour les jeunes lecteurs
Imaginez le ciel comme une sphère géante couverte de signes, et chaque signe met un temps différent pour grimper au-dessus de l'horizon selon l'endroit où l'on se trouve. Al-Battani a trouvé un raccourci astucieux : au lieu de mesurer chaque point séparément, il a montré que la réponse change en proportion à mesure que l'on se déplace entre deux points connus. Comme pour deviner la température à mi-chemin entre deux relevés de thermomètres, sa règle permettait aux astronomes de calculer les temps de montée n'importe où dans le ciel — une astuce qui aidait à la fois les observateurs d'étoiles et les personnes qui chronométraient les prières.

Ainsi, le chapitre LV du zij — ainsi que son traité perdu — témoigne d'une période où le calcul de l'astronomie était précis et méthodique, avant que les instruments ultérieurs ne l'absorbent et que les formules prêtes à l'emploi ne remplacent les règles faites à la main.

## Références
{cite:nallino-albatenii-opus-astronomicum p. 28}
{cite:nallino-albatenii-opus-astronomicum t. I pp. 131–135}
{cite:nallino-albatenii-opus-astronomicum t. I p. 135}
{cite:nallino-albatenii-opus-astronomicum t. I pp. 315–317}
{cite:tdv-battani-muftuoglu}
