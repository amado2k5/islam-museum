---
id: invention/combinatorics-ibn-munim
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/combinatorics-ibn-munim.md}
---

## Résumé

Combien de sélections un ensemble fixe de couleurs peut-il produire ? Comment la réponse change-t-elle si l'ordre compte ou si la répétition est permise ? [[person/ibn-munim-al-abdari|Ibn Munim al-Abdari]] a fait de ces questions des outils pour compter les lettres et les mots dans la section XI du [[work/fiqh-hisab-ibn-munim|Fiqh al-hisab]]. Ahmed Djebbar décrit le passage des modèles concrets aux règles, tableaux et raisonnement, et non simplement l'écriture d'une longue liste et le comptage de ses lignes {cite:djebbar-ibn-munim-combinatoire pp9–13}.

Notre dossier concerne le développement combinatoire systématique, non l'invention du comptage ou la première table triangulaire au monde. Djebbar reconnaît le travail prédécesseur linguistique d'al-Khalil ibn Ahmad et la construction algébrique d'al-Karaji. La contribution concerne l'interprétation des entrées via des sélections et permutations et l'extension des problèmes de répétition, avec des limites à l'abstraction explicitement abordées par l'historien {cite:djebbar-ibn-munim-combinatoire pp10–12}.

## Ce que c'est

Une combinaison sélectionne des éléments sans tenir compte de l'ordre ; une permutation traite les positions modifiées comme des résultats différents. Permettre à un élément de se répéter change à nouveau les possibilités. Ces définitions modernes expliquent le problème, et non une affirmation selon laquelle chaque mot historique correspond à un terme actuel du manuel. Djebbar distingue ces types au sein d'un projet linguistique, utilisant les couleurs comme modèle de comptage {cite:djebbar-ibn-munim-combinatoire pp10–12}.

« Compter les mots » peut signifier compter des constructions sous présupposés concernant les lettres et les signes, sans énumérer le vocabulaire significatif en usage réel. Arrabita décrit un alphabet choisi, la longueur maximale de l'exemple et les conditions de marquage. Ce sont des hypothèses modélaires, pas la découverte de tout ce que les humains ont dit. La possibilité formelle, un dictionnaire, le nombre de langues et le nombre de locuteurs sont des quantités différentes {cite:arrabita-fiqh-hisab combinatorial section}.

## Le monde devant lui

Le travail des linguistes, en particulier le comptage d'al-Khalil, apparaît dans le récit d'Ibn Munim sur sa tâche tel que rapporté par Djebbar. Les relations entre les lettres et les arrangements possibles menaient déjà à des questions arithmétiques. L'auteur étend le comptage sans lettres répétées plutôt que de revendiquer un vide désorganisé devant lui. Les traditions mathématiques et linguistiques vont bien s'entrelacer dans cette histoire {cite:djebbar-ibn-munim-combinatoire pp9–11} {cite:arrabita-fiqh-hisab combinatorial section}.

L'algèbre antérieure d'Al-Karaji fournissait un triangle arithmétique. Cela est distinct de son [[invention/karaji-polynomial-arithmetic|enregistrement arithmétique polynomial]] et de l'interprétation combinatoire ici. Nous ne comptons pas la même forme deux fois sous « premier inventeur du triangle de Pascal ». Nous identifions le raisonnement et utilisons : des nombres identiques n'établissent pas que les auteurs comprenaient toutes les mêmes relations ou lisaient la même copie {cite:djebbar-ibn-munim-combinatoire pp10–11}.

## L'histoire

La biographie d'Abd al-Aziz al-Naqr décrit un homme originaire de Denia dans al-Andalus s'installant et enseignant à la Mansuriyya à [[place/marrakesh|Marrakech]]. L'arrivée n'est pas datée ; une invitation califale est une suggestion académique rapportée. Le rapport antérieur de Djebbar ne pouvait pas établir le lieu de composition. Nous distinguons la connaissance de ce rapport de l'utilisation par une biographie mise à jour de preuves biographiques plus anciennes {cite:arrabita-ibn-munim-naqr section3} {cite:djebbar-ibn-munim-combinatoire p8}.

Djebbar date provisoirement le livre de 1207–1212 à partir de la dédicace et des louanges d'al-Nasir, et non d'un colophon daté. Notre document utilise un placement large du XIIIe siècle et attribue cette suggestion plus restreint. Son analyse rapporte également des tableaux d'application ajoutés après la circulation des copies parmi les étudiants. Il s'agissait d'enseigner et de développer une exposition, pas d'un seul moment d'inspiration parfaitement daté {cite:djebbar-ibn-munim-combinatoire pp7–8,12}.

## Le(s) fabricant(s)

L'auteur est Abu Jafar Ahmad ibn Ibrahim ibn Ali ibn Munim al-Abdari, et non le Sicilien Muhammad ibn Isa ibn Abd al-Munim. La biographie met en garde contre la confusion ; des noms similaires et une occupation mathématique similaires n'établissent pas l'identité. L'article d'Arrabita le nomme explicitement parmi les érudits musulmans. Cela fournit une base musulmane individuelle, et non son nom ou son lieu de naissance {cite:arrabita-ibn-munim-naqr sections1,3} {cite:arrabita-fiqh-hisab introduction}.

Le cadre sunnite distinct est le défaut déclaré du musée, et non une attestation personnelle de Maliki. Djebbar rapporte des éloges préfectoires d'Ibn Tumart et du souverain almohade ; cela reste une rhétorique attribuée, ni approuvée par le musée ni suffisante à elle seule pour une biographie personnelle complète de la secte. L'enseignement paternel, la médecine et les étudiants figurent dans la biographie, mais les informations restent rares {cite:djebbar-ibn-munim-combinatoire pp5–8} {cite:arrabita-ibn-munim-naqr sections3–5}.

## Comment ça fonctionne

Djebbar présente dix couleurs de soie transformées en touffes d'une couleur, deux, et ainsi de suite jusqu'à dix, en comptant les sélections de chaque taille. La première ligne comporte dix étuis monocolores. Pour former des paires, fixez une couleur ultérieure et associez-la à toutes les précédentes, évitant un second compte lorsque leur ordre s'inverse. Nous avons vérifié visuellement les imprimés 19–20 : un compte rendu analytique moderne, pas le manuscrit de l'auteur {cite:djebbar-ibn-munim-combinatoire pp19–20}.

Dans notre notation, dix couleurs donnent `1+2+...+9=45` paires et `C(10,3)=120` triples. Ici `C(n,k)` sélectionne `k` différents objets de `n`, ignorant l'ordre. Regrouper les cas selon leur plus grand élément sélectionné transforme un grand problème en sommes plus petites. Ne pas compter une sélection deux fois est une condition de correction, pas simplement un raccourci.

Notre exemple moderne plus petit choisit deux cartes différentes parmi cinq de dix façons. Distinguez la première position de la seconde et il y a vingt : deux positions pour chaque paire. Permettez des cartes répétées dans deux positions ordonnées et il y a vingt-cinq. Ignorez l'ordre mais laissez la répétition et il y a quinze. Des réponses différentes ne signifient pas forcément une arithmétique erronée ; la question a changé.

Une explication moderne divise les sélections selon que la dernière carte est incluse ou non. Cela donne `C(n,k)=C(n-1,k)+C(n-1,k-1)`, avec `C(n,0)=1` et `C(n,n)=1`. Notre convention compte une sélection vide, bien que le problème de la touffe commence par une seule couleur. Nous n'attribuons pas cette affirmation de frontière à une ligne originale non lue.

La récurrence construit la ligne `1,5,10,10,5,1` pour cinq et `1,10,45,120,210,252,210,120,45,10,1` pour dix. La seconde s'élève à 1024, donnant 1023 sélections non vides. Nous les avons vérifiées indépendamment par énumération et récurrence. Ce ne sont pas une photographie du tableau original ni une preuve que l'auteur a identifié chaque entrée avec un coefficient binomial.

La répétition nécessite une autre distinction. Les lettres A, A, B donnent trois chaînes distinctes, pas six ; échanger des copies identiques A ne crée aucune nouvelle écriture. Le projet linguistique ajoute des signes et des restrictions de prononciation. Multiplier tout par quatre par lettre échoue si le modèle exclut certains états. Djebbar décrit la répétition, le raisonnement récursif et les tableaux, pas un logiciel qui connaît le sens lexical {cite:djebbar-ibn-munim-combinatoire pp11–13}.

## La diffusion

Al-Naqr rapporte l'usage d'Ibn al-Banna, Ibn Haydur et Ibn Zakariyya al-Gharnati, et cite Ibn Khaldun concernant les sources de Raf al-hijab. Ce sont des rapports de réception issus d'articles lus, et non notre lecture de chaque texte ou recensement ultérieur. Djebbar distingue l'enseignement qui préserve les résultats à partir de preuves reconnaissant explicitement le raisonnement combinatoire comme un outil indépendant {cite:arrabita-ibn-munim-naqr section2} {cite:djebbar-ibn-munim-combinatoire pp12–13}.

La ressemblance ne trace pas de lien direct avec Pascal ou Mersenne. Djebbar compare les procédures avec les travaux ultérieurs ; la comparaison n'est pas un registre de transmission particulier. Notre image moderne utilise un nom triangulaire familier. Son titre ne fait ni de l'illustrateur une autorité sur Ibn Munim ni ne règle la priorité universelle ou le vol intellectuel. Chaque itinéraire historique a besoin de ses propres preuves.

## Sur quoi elle a été bâtie

L'aperçu du livre identifie les Éléments d'Euclide et une partie de l'Istikmal d'al-Mutaman comme lecture préparatoire, aux côtés de l'analyse et de la synthèse dans les démonstrations. Cela ne fait pas de chaque argument combinatoire une copie de la géométrie. Djebbar identifie le raisonnement inductif et combinatoire aux côtés des outils expositifs déclarés : une analyse d'historien, clairement attribuée {cite:arrabita-fiqh-hisab book introduction} {cite:djebbar-ibn-munim-combinatoire pp12–13}.

Les couleurs et les lettres sont des modèles différents partageant des règles de comptage sélectionnées. Le transfert fonctionne lorsque les conditions de distinction, d'ordre et de répétition survivent, non pas parce qu'une couleur et une lettre sont des choses identiques. Djebbar voit une voie vers une abstraction plus large sans qu'un modèle explicitement unique réduise tous les problèmes de comptage à une seule structure générale à ce stade {cite:djebbar-ibn-munim-combinatoire pp11–12}.

## Ce qui a été construit dessus

Une réception ultérieure du Maghribi est rapportée, mais aucun programme informatique ou de langage n'est un descendant direct de ce livre. La comparaison éducative ne nécessite pas de généalogie inventée. Une liste vide de personnes à charge directe signifie que des liens d'invention particuliers ne sont pas établis ici, non pas que l'œuvre manquait d'influence ou que les étudiants n'aient rien appris {cite:arrabita-ibn-munim-naqr sections2,5}.

Djebbar souligne que posséder le triangle n'établit pas la reconnaissance de son interprétation binomiale. En effet, il remet en question l'absence de ce lien dans la section d'extraction de racines. Nous ne pouvons pas compléter un résultat historique non exprimé car cela semble désormais facile. Ce qui suit mathématiquement et ce qu'une personne a énoncé de manière démontrable sont des questions distinctes {cite:djebbar-ibn-munim-combinatoire pp10–11}.

## Impact sur la vie quotidienne

Les couleurs de la soie rendent la sélection visible, et non la preuve qu'une usine utilisait une seule table ou qu'Ibn Munim ait inventé le tissage. Les touffes servent un modèle excluant la position de la sélection. Les cartes en papier expliquent le problème sans manipuler les fils historiques ni fabriquer un produit. Nous n'avons aucun volume de commerce mesuré ni gain de temps attribuable à ces règles {cite:djebbar-ibn-munim-combinatoire pp19–23}.

L'histoire pédagogique est plus claire qu'une affirmation économique non étayée : des tableaux et des exemples ont été ajoutés après que les élèves aient reçu des exemplaires. Djebbar lit une exposition répondant aux besoins éducatifs. Cela n'établit ni les programmes modernes, ni les examens standardisés, ni une taille de classe particulière, mais cela maintient les apprenants présents au lieu de réduire le savoir à un héros isolé {cite:djebbar-ibn-munim-combinatoire p12}.

## Comment cela a changé l'histoire

L'importance réside dans l'organisation et l'explication des problèmes au-delà d'un seul exemple, et non dans un énorme décompte prétendu de toutes les langues humaines. Djebbar montre des questions linguistiques ouvrant des résultats plus larges, avec les limites de l'abstraction contemporaine. Il s'agit d'un développement méthodologique limité, et non d'une idée du musée adoptant de larges affirmations célébratoires selon lesquelles une civilisation a universellement surpassé les autres {cite:djebbar-ibn-munim-combinatoire pp9–13}.

L'histoire de la recherche montre également des connaissances changeantes : un rapport antérieur tirait des indices de la dédicace ; une biographie ultérieure ajoutait des informations provenant d'une source plus ancienne. Les nouvelles preuves élargissent le tableau plutôt que de rendre les connaissances limitées antérieures malhonnêtes. Auteur, copiste, éditeur et historien ont des rôles différents. Découvrir un manuscrit à l'époque moderne ne date pas l'invention de ses règles.

## Qui l'a inventé ?

L'attribution repose sur la section décrite du Fiqh al-hisab. Al-Khalil la précède dans le comptage linguistique et al-Karaji dans la construction algébrique des triangles. La plus ancienne évaluation connue de Djebbar en construction combinatoire est qualifiée par ses connaissances et le type de construction, et non par une revendication du tout premier triangle arithmétique. « Amélioration » ne doit pas devenir l'origine absolue d'un titre plus fort {cite:djebbar-ibn-munim-combinatoire pp10–11}.

Le mathématicien reste distinct de ses personnes du musée au nom sicilien et au nom similaire. La garde de l'identité empêche le transfert de livres, de dates ou de religions entre individus. 1207–1212 est la composition suggérée ; 1551 un exemplaire rapporté ; 2005 une édition moderne. Remplacer l'un par un autre change la revendication, même lorsque tous apparaissent dans l'histoire du même livre {cite:arrabita-ibn-munim-naqr sections1–4} {cite:arrabita-fiqh-hisab manuscript and edition}.

## Aujourd'hui

Les programmes actuels peuvent vérifier de petits cas par énumération et récurrence. C'est notre vérification moderne, pas le programme d'Ibn Munim. Comptez indépendamment les paires ordonnées, puis divisez par deux pour deux objets différents : cinq donne dix. ButA,A n'est pas une paire à objets différents ; transférer la même division à un autre cas sans modifier les hypothèses brise le raisonnement.

L'image CC0 de Rohieb de 2016 comporte huit rangées indexées de zéro à sept. Les chiffres modernes et la disposition triangulaire ne représentent ni Fiqh al-hisab ni touffes de soie. La dernière ligne est 1,7,21,35,35,21,7,1. Les relations sont également expliquées dans le texte : les lecteurs n'ont pas besoin de les extraire uniquement d'une image {cite:commons-pascal-small-rohieb Description and licence}.

## Exemples conservés

Arrabita décrit un exemplaire de la collection 416, pages 214–419, copié à Tunis par Hasan al-Rabai en 958 H/1551, trouvé par Idriss Lamrabet en 1981 et édité en 2005. Ces détails proviennent de l'article, pas d'une consultation directe. Sa seule mention de copie connue dans le contexte de l'édition n'est pas un recensement mondial des bibliothèques {cite:arrabita-fiqh-hisab manuscript and edition} actuel.

Nous avons lu certaines parties de l'étude de Djebbar et examiné 19 à 20 pages imprimées, et non les 131 pages en total ni leur reproduction en arabe. Les symboles éditoriaux modernes ne sont pas nécessairement des lettres manuscrites. La séparation des couches permet aux lecteurs d'évaluer ce qu'une image, une analyse secondaire ou un texte inconnu établit. Un fichier téléchargeable n'est pas une autorisation pour mettre le livre source dans Git.

## Dans la culture

La langue, l'enseignement et l'arithmétique rencontrent la biographie d'un médecin-enseignant. Al-Naqr rapporte un récit plus ancien d'Ibn Munim révisant mentalement Euclide à rebours avant de dormir. Il s'agit d'une anecdote attribuée, non d'une routine observée ni d'un test d'intelligence. Les éloges médicaux dans cette biographie ne sont ni une recette de traitement ni une preuve moderne d'efficacité {cite:arrabita-ibn-munim-naqr sections3–4}.

Le Fiqh al-hisab concerne ici la connaissance du calcul, pas la transformation de chaque résultat en une décision religieuse. L'éloge politique de la dédicace est une rhétorique historique à but précis. Nous la conservons sans répéter les jugements sur les opposants dans la voix du musée ni faire en sorte que le mécénat établisse la vérité d'une preuve mathématique {cite:djebbar-ibn-munim-combinatoire pp5–9}.

## Pour les jeunes lecteurs

Utilisez cinq cartes avec des symboles différents, pas seulement des couleurs, donc la discrimination des couleurs n'est pas nécessaire. Listez chaque paire une fois. Si la gauche et la droite s'échangent, cela devrait-il compter à nouveau ? Écrivez la règle avant de compter. Cela explore la sélection versus l'ordre sans fils, outils ni artefacts originaux.

Alors permettez le même symbole deux fois et demandez pourquoi la réponse change. Un adulte peut comparer la liste avec un petit triangle tout en expliquant qu'elle est moderne, et non l'écriture d'Ibn Munim. La question centrale est de savoir ce qui compte comme identique ou différent. Un nombre correct répond à des hypothèses explicites ; ce n'est pas un long ornement à mémoriser sans comprendre.

## Références

- {cite:djebbar-ibn-munim-combinatoire selected pp5–13,19–23}
- {cite:arrabita-ibn-munim-naqr sections1–5}
- {cite:arrabita-fiqh-hisab book manuscript and methods}
- {cite:commons-pascal-small-rohieb Description licence and image}
