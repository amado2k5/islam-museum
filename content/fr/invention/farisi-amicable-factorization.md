---
id: invention/farisi-amicable-factorization
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/farisi-amicable-factorization.md}
---
## Résumé

Un nombre peut en produire un autre lorsque ses diviseurs propres sont ajoutés, et les diviseurs de l'autre peuvent revenir au premier. Deux nombres différents possédant cette propriété sont amicaux, comme 220 et 284. [[person/kamal-al-din-al-farisi|Kamal al-Din al-Farisi]] n'a pas inventé cet exemple ni l'ancienne règle de Thabit ibn Qurra. Sa contribution ici est une nouvelle approche factorisée/combinatoire pour démontrer la règle, telle que MacTutor la décrit {cite:weisstein-amicable-pair definition} {cite:farisi-mactutor number-theory}.

Son [[work/farisi-tadhkirat-al-ahbab|Mémorandum pour les amis sur l'amiabilité]] est distinct de son [[invention/farisi-water-sphere-rainbow|modèle arc-en-ciel]]. Ce document n'accorde ni priorité absolue à la factorisation ni la première preuve complète de son unicité. MacTutor attribue cette interprétation à Rashed et note le désaccord académique sur le statut de la preuve {cite:farisi-mactutor factorization} {cite:tdv-farisi-bozhuyuk work5}.

## Ce que c'est

Les diviseurs concernés sont des entiers positifs divisant sans résidu. Pour l'amiabilité, nous excluons le nombre lui-même. Écrivez sigma pour la somme incluant le soi, et s pour la somme excluant le soi : s(N)=sigma(N)−N. Confondre les deux sommes change la question. Ce sont des symboles explicatifs modernes, et non une notation attribuée à un manuscrit inspecté {cite:weisstein-amicable-pair definition-and-equations}.

Les nombres doivent être positifs, distincts et satisfaire les deux directions. Par exemple, 6 a des diviseurs propres 1,2,3 sommant 6. Il est parfait, il n'est pas une paire amicale avec lui-même selon notre définition. Un trajet à sens unique ne suffit pas non plus : le second nombre doit revenir au premier.

## Le monde devant lui

MacTutor attribue la construction à Thabit ibn Qurra avant de discuter de la nouvelle preuve d'al-Farisi. Le prédécesseur conserve son nom ; tout ce qui se trouve dans le traité ultérieur ne devient pas une invention distincte de son auteur. Mentionner ce prédécesseur ne le considère pas comme un nouveau créateur musulman par une déduction issue de son environnement {cite:farisi-mactutor inherited-rule}.

MacTutor rapporte également l'argument de Hogendijk selon lequel Thabit aurait déjà connu 17296 et 18416. Nous ne convertissons pas cela en un nouveau verdict de priorité ni ne reconnaissons un Européen ultérieur simplement parce qu'un nom familier accompagne le duo. La dénomination conventionnelle, une preuve conservée et la première découverte sont des questions historiques différentes {cite:farisi-mactutor large-pair-history}.

## L'histoire

La biographie universitaire note que le travail sur la théorie des nombres est devenu important dans les études ultérieures à l'ancien article de Rashed dans le Dictionnaire de biographie scientifique, qui portait sur l'optique. L'omission d'un récit antérieur ne démontre pas une absence dans l'œuvre de l'auteur. TDV énumère séparément le traité d'amitié par titre {cite:farisi-mactutor introduction} {cite:tdv-farisi-bozhuyuk work5}.

Aucune date exacte de composition ni de scène de conversation n'est établie ici. Un horizon de la fin du XIIIe / début du XIVe siècle relie l'œuvre à son auteur, et non à une journée d'invention ou à une conversion hijrie fabriquée. Tabriz appartient à son univers biographique ; ce n'est pas une salle d'écriture particulière vérifiée à partir de l'original {cite:farisi-mactutor biography} {cite:tdv-farisi-bozhuyuk biography}.

## Le(s) fabricant(s)

La base musulmane individuelle documentée d'Al-Farisi est conservée dans la description explicite de MacTutor, le cadre sunnite étant déclaré séparément. Un nom ou un enseignant persan n'établit pas de secte personnelle. Sa contribution optique antérieure reste intacte : un seul érudit peut travailler sur la lumière et les nombres sans rendre les deux questions identiques {cite:farisi-mactutor summary-and-biography}.

TDV diffère de MacTutor par son nom et ses dates : Hasan ibn Ali ibn Hasan, naissance en 1267 et décès en 1319 du colophon rapporté d'un étudiant, plutôt que Muhammad et approximativement 1260/1320. Nous attribuons cette divergence, sans inventer une autre personne ni revendiquer une classification originale. Les champs hérités restent attribuables à leurs sources antérieures tandis que les lecteurs peuvent voir l'alternative {cite:tdv-farisi-bozhuyuk opening} {cite:farisi-mactutor quick-info}.

## Comment ça fonctionne

Pour une illustration moderne, prenez 220=2²×5×11. Chaque diviseur choisit un exposant de 2 de 0 à 2, et un exposant de 5 et 11 de 0 à 1. Il existe 3×2×2=12 choix distincts, y compris 220 lui-même. Organiser ces choix aide à éviter de manquer ou de dupliquer des diviseurs ; cela illustre la structure de factorisation dans la forme moderne {cite:farisi-mactutor factorization}.

La somme du diviseur complet est (1+2+4)(1+5)(1+11)=7×6×12=504. Soustrahez 220 pour obtenir 284. De même, 284=2²×71, avec la somme complète 7×72=504 ; 504−284=220. La liste directe vérifie les deux calculs indépendamment. Il s'agit d'une vérification explicative moderne, pas d'une citation de l'ancienne preuve {cite:weisstein-amicable-pair divisors220284}.

La règle de Thabit en notation moderne prend n≥2 et forme p=3×2^(n−1)−1, q=3×2^n−1, r=9×2^(2n−1)−1. **Si les trois sont nombres premiers**, A=2^n×p×q et B=2^n×r sont amicaux. La primalité fait partie de la règle, pas la décoration optionnelle. Cette construction suffisante fournit une famille, pas toutes les paires amicales possibles {cite:farisi-mactutor inherited-rule}.

Pour n=4, les nombres premiers sont 23,47,1151, donnant A=17296 et B=18416. Les deux sommes complètes sont égales à 35712:31×24×48 pour A et 31×1152 pour B. En soustrayant l'un ou l'autre, on retrouve l'autre. MacTutor décrit al-Farisi à l'aide de lemmes, y compris une application de tamis, pour établir la primalité de 1151 ; notre arithmétique ne reproduit pas la suite originale des lemmes {cite:farisi-mactutor example-n4}.

Un contre-exemple clarifie les conditions. Pour n=3, r=287=7×41 est composite. Les formules donnent 2024 et 2296, et s(2024)=2296, mais s(2296)=2744, pas 2024. Traiter 287 comme premier et insérer 1+287 dans la formule diviseur-produit est erroné : la contribution correcte est (1+7)(1+41). Ce calcul moderne indépendant explique pourquoi tant les prémisses que la direction du retour comptent.

Pour la structure générale, on met t=2^n. Sous les conditions premières sigma(A)=sigma(B)=(2t−1)×9t²/2 ; l'expansion algébrique donne également A+B égal à cette expression. En soustrayant A, on obtient donc B, et inversement. Des sommes inclusives égales seules seraient insuffisantes sans leur égalité avec A+B. Cette explication conditionnelle est de l'algèbre moderne de musée, pas une transcription.

La restriction n≥2 maintient les facteurs premiers supposés impayés et différents de 2, permettant des choix de facteurs indépendants. Prendre n=1 donne donc 20 et 34, qui ne sont pas amicaux. Supprimer la borne inférieure et imputer cet échec à la règle testerait une formule en dehors de son domaine énoncé.

## La diffusion

MacTutor identifie la connaissance de la paire plus grande avant les noms européens ultérieurs, tout en laissant sa découverte la plus ancienne ouverte à l'investigation. MathWorld discute des redécouvertes et des règles qui en découlent, et non une chaîne de manuscrits que nous avons établie d'al-Farisi à chaque auteur ultérieur. Des nombres identiques seuls ne prouvent pas une voie textuelle directe {cite:farisi-mactutor large-pair-history} {cite:weisstein-amicable-pair history}.

Une édition moderne ne constitue pas en soi une preuve de la circulation historique des écoles. TDV liste l'édition et l'étude de Rashed de 1982 ; nous n'avons pas lu l'édition complète ici. L'œuvre et sa discussion savante sont rapportées à travers la source réellement lue, sans parcours manuscrit inventé ni expérience pédagogique {cite:tdv-farisi-bozhuyuk work5}.

## Sur quoi elle a été bâtie

Les ingrédients explicatifs sont les puissances premières, les diviseurs et les choix d'exposants. La même formule de produit ne peut pas simplement être appliquée à des facteurs qui se chevauchent : 24=4×6 ne permet pas de multiplier les sommes divisives de 4 et 6, puisqu'elles partagent 2. Dans notre explication moderne, nous séparons d'abord les puissances premières distinctes avant d'organiser les choix indépendants.

MacTutor attribue à Rashed une interprétation basée sur une factorisation unique à puissance première et une tentative de démonstration, puis note la discussion sur la question de savoir si elle a été démontrée ou seulement tentée. Cette limite est importante. Deux exemples réussis ne prouvent pas le théorème général, et énumérer les facteurs d'un petit entier n'est pas une preuve d'unicité pour chaque entier {cite:farisi-mactutor factorization-debate}.

## Ce qui a été construit dessus

Un étudiant peut comparer une liste de diviseurs réelle avec un produit de sommes de puissance première, en vérifiant la complétude et la non-duplication. Notre vérification muséale les compare indépendamment pour de nombreux entiers, et non seulement pour un seul résultat réussi. Cela valide notre explication actuelle ; elle ne récupère pas une page perdue du traité.

Même une règle correcte n'a pas besoin de produire chaque paire. 1184 et 1210 sont amicaux, mais 1210 n'est pas divisible par 4, alors que les deux membres de cette famille Thabit sont divisibles par 4 parce que n≥2. La paire ne peut donc pas découler de cette formule. Une condition suffisante génère des exemples sans devenir une condition nécessaire pour toute amiabilité {cite:weisstein-amicable-pair pair-list} {cite:farisi-mactutor inherited-rule}.

## Impact sur la vie quotidienne

Les sources lirées décrivent l'arithmétique et la théorie des nombres, et non un bénéfice mesuré sur le marché. Le nom d'amitié ne fait pas des chiffres un charme, un traitement ou une promesse concernant les relations humaines. Notre sujet est une relation divisive spécifiée, et non une preuve d'effets surnaturels ou une approbation d'une croyance non examinée {cite:weisstein-amicable-pair definition}.

Sa valeur pédagogique réside dans le fait que des conditions distinctes deviennent visibles : une direction est insuffisante, une somme inclusive diffère d'une somme à diviseur propre et un facteur composite n'est pas premier. Les lecteurs peuvent tester ces distinctions sur la plus petite paire avant des nombres plus grands, sans prétendre que notre exercice reconstruit une leçon historique documentée.

## Comment cela a changé l'histoire

MacTutor considère l'œuvre d'al-Farisi comme plus qu'une simple modification mineure de la preuve de Thabit : une nouvelle approche employant la factorisation et les idées combinatoires. Apprécier cette étape ne nécessite ni d'effacer l'auteur de la règle ni d'attribuer tout le langage moderne de la théorie des nombres à al-Farisi. La contribution est une approche spécifiée dans un traité précis {cite:farisi-mactutor new-approach}.

Elle est indépendante de l'expérience de la sphère d'eau : l'une concerne les diviseurs, la primalité et la preuve numérique ; l'autre concerne les trajectoires lumineuses. Ce n'est pas un autre exemple de la même théorie optique renommée pour augmenter le nombre de documents. La biographie elle-même distingue ces deux contributions majeures {cite:farisi-mactutor introduction-and-number-theory}.

## Qui l'a inventé ?

**Cadre sunnite déclaré :** la base musulmane individuelle héritée subsiste, et non un certificat confessionnel personnel extrait d'un nom. **Compte rendu académique :** La règle de Tabit précède la nouvelle approche d'al-Farisi ; L'interprétation de la preuve de factorisation par Rashed reste contestée. Le musée ne délivre ni verdict final de première preuve complète ni première découverte de la paire plus grande {cite:farisi-mactutor summary-and-factorization}.

La source rapporte l'argument de Hogendijk en faveur d'une connaissance antérieure par Thabit. Son article complet n'a pas été lu ici : l'index des auteurs l'identifie, tandis que la navigation normale de l'éditeur s'arrêtait à la vérification humaine. L'argument reste attribué via MacTutor, sans être déguisé en une lecture complète d'un article réalisée malgré la barrière d'accès {cite:farisi-mactutor large-pair-history}.

## Aujourd'hui

Nous distinguons deux A,B différents d'un nombre parfait revenant à lui-même. Nous distinguons également d'autres usages modernes de « amical » avec une définition différente : ici, le test est la somme des diviseurs positifs excluant le soi. Un nom attrayant ne remplace pas l'écriture de la définition avant de comparer les tables {cite:weisstein-amicable-pair definition-and-terminology}.

L'illustration contextuelle à bâtonnets colorés place 284 au-dessus de 220, avec des rangées de facteurs et des sommes à diviseurs propres. C'est l'image moderne d'Hyacinth, pas les bâtons utilisés par al-Farisi ni une page du mémorandum. Elle illustre l'exemple plus petit, pas chaque étape de la démonstration générale ni la paire 17296/18416 {cite:commons-amicable-rods-hyacinth current-image}.

## Exemples conservés

Nous avons lu MacTutor, TDV et certains définitions/exemples modernes, et non l'original arabe, l'édition de Rashed de 1982, ni tous les éléments de la bibliographie. TDV identifie le traité par son titre, mais son manuscrit n'a pas été examiné ici. Le compte rendu arithmétique dépend de la description académique réellement lue, et non d'une nouvelle édition critique {cite:tdv-farisi-bozhuyuk work5} {cite:farisi-mactutor number-theory}.

L'image a été créée le 28 avril 2016 ; l'historique du 29 avril inclut la révision actuelle en gras. Il s'agit de CC BY-SA4.0, utilisé comme PNG original inchangé. Les droits de l'image et réels ont été inspectés. Nous ne transférons ni la licence d'une autre image à celle-ci ni ne la renommons un artefact de l'auteur du vivant {cite:commons-amicable-rods-hyacinth description-rights}.

## Dans la culture

Le « amis » du titre attire l'attention sur une relation qui peut être vérifiée numériquement. Appeler les nombres amis est une analogie verbale, pas un mécanisme régissant leur comportement ni une explication mystique. Les sommes à diviseurs propres doivent simplement renvoyer le partenaire dans les deux directions selon la définition déclarée {cite:weisstein-amicable-pair definition}.

Les limites restent partie intégrante de l'histoire muséale : un prédécesseur antérieur, un auteur élaborant une preuve, et des chercheurs en désaccord sur la force et la priorité. Aucune scène de découverte inventée n'est nécessaire, ni un titre rendant chaque méthode moderne de factorisation la propriété d'une seule personne {cite:farisi-mactutor factorization-and-priority}.

## Pour les jeunes lecteurs

Les diviseurs propres de Write220 : 1,2,4,5,10,11,20,22,44,55,110. Leur somme est 284. Inversez l'exercice avec 1,2,4,71,142 pour obtenir 220. N'oubliez pas1 et n'incluez pas le nombre lui-même : changer l'une ou l'autre condition change ce que vous calculez {cite:weisstein-amicable-pair divisors220284}.

Ensuite, essaie6 et demande pourquoi il n'est pas un paire avec lui-même. Pour un défi plus large, vérifiez l'exemple raté de 2024/2296 dans les deux sens plutôt que de vous arrêter au premier succès. Ce sont des explorations arithmétiques modernes, pas des instructions manuscrites mot à mot ni un jugement final de priorité historique.

## Références

- MacTutor : approche, règle, désaccords {cite:farisi-mactutor number-theory}.
- Bozhuyuk : œuvres et biographie alternative {cite:tdv-farisi-bozhuyuk biography-and-work5}.
- MathWorld : définition/diviseurs {cite:weisstein-amicable-pair definition}.
- Biens communs : illustration/droits {cite:commons-amicable-rods-hyacinth description-rights}.
