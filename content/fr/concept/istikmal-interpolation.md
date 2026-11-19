---
id: concept/istikmal-interpolation
lang: fr
source_lang: en
translators: ['Google Translate (document translation on translate.google.com, 2026-11-19), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Google Translate document pilot, managed by Claude Code)', model: google-translate, run: gt-docs-fr-2026-11-19, source: content/en/concept/istikmal-interpolation.md}
---
## Résumé
L'interpolation (istikmal) est une méthode permettant de trouver la valeur d'une fonction entre deux valeurs données dans une table ; [[person/al-biruni-muhammad-ibn-ahmad|al-Biruni]] en a conçu une forme dans le livre 3 d'[[work/al-qanun-al-masudi|al-Qanun al-Mas'udi]] afin d'améliorer l'utilisation des tables de sinus. {cite:qanun-masudi-jundi-v1 p. 40} {cite:qanun-masudi-jundi-v1 p. 41}

## Le problème
L'éditeur explique que la méthode courante supposait que, dans un intervalle donné, l'augmentation du sinus était proportionnelle à l'augmentation de l'angle ; or, des intervalles angulaires égaux ne donnent pas des différences de sinus égales, ce qui rend la méthode courante inexacte. {cite:qanun-masudi-jundi-v1 p. 41}

## La solution d'Al-Biruni
Al-Biruni a adopté deux approches. Premièrement, il a réduit les intervalles : il a calculé les tables de sinus pour chaque quart de degré au lieu de chaque degré entier, regrettant de ne pouvoir le faire pour chaque minute, compte tenu de la longueur de l’ouvrage ; l’éditeur indique que ses tables sont exactes à la septième ou huitième décimale. {cite:qanun-masudi-jundi-v1 p. 41} Deuxièmement, il a amélioré la méthode d’utilisation : constatant qu’une variation de l’angle entraîne une variation progressive des différences de sinus plutôt que des sinus eux-mêmes, il a fixé le rapport de la partie de l’intervalle à l’intervalle entier égal au rapport de la différence correspondante à la différence des différences, ce qui donne une valeur plus précise. {cite:qanun-masudi-jundi-v1 p. 41}

## Son lieu
L'éditeur considère qu'al-Biruni a ainsi abouti aux lois d'interpolation sous la forme simple attribuée plus tard à Newton et Gregory, six cents ans après lui, et que sa méthode de mesure des différences d'angles constituait la pierre angulaire de la méthode de génération qu'ils utilisèrent. {cite:qanun-masudi-jundi-v1 p. 32} {cite:qanun-masudi-jundi-v1 p. 40} Il ajoute qu'al-Biruni fut le premier à prendre l'unité comme rayon dans les tables de sinus, de sorte que les longueurs tabulées devinrent des rapports. {cite:qanun-masudi-jundi-v1 p. 42}
