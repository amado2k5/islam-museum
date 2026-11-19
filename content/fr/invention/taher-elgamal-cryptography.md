---
id: invention/taher-elgamal-cryptography
lang: fr
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
title: 'ElGamal cryptography: public-key security on discrete logarithms'
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-fr-2026-11-19, source: content/en/invention/taher-elgamal-cryptography.md}
---
## Résumé
ElGamal est le système de cryptographie à clé publique et de signature numérique que Taher Elgamal, cryptographe égypto-américain, a proposé dans un seul article publié en 1985. Basé sur l'échange Diffie-Hellman et la dureté des logarithmes discrets, le chiffrement fonctionne toujours à l'intérieur de GnuPG et PGP, tandis que le schéma de signature est devenu l'ancêtre de l'algorithme de signature numérique du gouvernement américain — et son créateur a ensuite piloté SSL, le cadenas du web {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Ce que c'est
Une paire de schémas mathématiques : un système de chiffrement à clé publique dans lequel n'importe qui peut sceller un message à une clé publique que seul le détenteur de la clé privée ouvre, et un schéma de signature prouvant l'origine d'un message. La sécurité repose sur le problème du logarithme discret — facile à calculer dans une direction, impossible à inverser dans un groupe cyclique bien choisi {cite:wikipedia-elgamal-encryption-en}.

## Le monde devant lui
L'échange de clés de Diffie et Hellman en 1976 avait ouvert la cryptographie à clé publique, et RSA a suivi ; mais le domaine avait encore besoin d'une seconde famille de schémas — chiffrement et signatures — reposant sur la dureté du logarithme discret à l'intérieur des groupes cycliques {cite:wikipedia-elgamal-encryption-en}.

## L'histoire
Elgamal a étudié le génie électrique à l'Université du Caire, puis a obtenu son doctorat à Stanford en 1984 sous la direction de Martin Hellman lui-même — un père de la cryptographie à clé publique — avant de rejoindre HP Labs. En juillet 1985, IEEE Transactions on Information Theory a publié son article de quatre pages proposant les deux schémas. Dix ans plus tard, en tant que scientifique en chef de Netscape, il a piloté le protocole SSL qui est devenu la base de TLS et HTTPS — ce qui lui a valu le titre de « père du SSL », le prix à vie RSA 2009, le prix Marconi 2019 et son élection à l'Académie nationale d'ingénierie en 2022 {cite:wikipedia-taher-elgamal-en}.

## Le(s) fabricant(s)
Taher Elgamal ⁦(born 1955)⁩ is the sole author of the founding paper and the documented inventor: both schemes carry his name, and the encryption article records him as the system's describer in 1985 {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Comment ça fonctionne
Trois phases : Alice publie une clé publique composée d'un groupe, d'un générateur et d'une valeur cachant son exponent secret ; Bob choisit une nouvelle clé éphémère pour chaque message, en découle un secret partagé et masque le message avec celle-ci ; La clé privée d'Alice récupère le même secret et retire le masque. Le nouvel éphémère à chaque fois est ce qui garde les anciens textes chiffrés en sécurité {cite:wikipedia-elgamal-encryption-en}.

## La diffusion
Le chiffrement perdure dans GNU Privacy Guard et les versions récentes de PGP ; la variante du schéma de signature a été adoptée par le NIST sous le nom d'Algorithme et Standard de Signature Numérique — et le SSL de son fabricant chez Netscape est devenu l'ancêtre du TLS qui sécurise la navigation quotidienne {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Sur quoi elle a été bâtie
L'échange de clés Diffie-Hellman de 1976 — ElGamal effectue cet échange en premier, puis utilise le secret partagé comme bloc d'utilisation unique — ainsi que les mathématiques des groupes cycliques et du problème du logarithme discret {cite:wikipedia-elgamal-encryption-en}.

## Ce qui a été construit dessus
La DSA et la norme de signature numérique ont signé des documents gouvernementaux et logiciels pendant des décennies ; les signatures à courbe elliptique sont des petits-enfants de la même ligne ; et toute l'infrastructure à clé publique du courrier chiffré porte sa logique {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Impact sur la vie quotidienne
Chaque fois que le logiciel se connecte lui-même, que le mail se chiffre lui-même, ou qu'un navigateur prouve l'identité d'un site, une machinerie de la famille ElGamal-Diffie-Hellman est à l'œuvre — une infrastructure invisible pour la communication privée {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Comment cela a changé l'histoire
Il a donné à la cryptographie une seconde grande famille de clés publiques et à la signature numérique sa forme standard ; avec SSL, son créateur a également lancé la génération de protocoles qui a rendu possible le commerce électronique {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Qui l'a inventé ?
Sans contestation : l'article est d'auteur unique, les deux dispositifs portent le nom ElGamal, et aucun revendicateur rival n'existe dans les sources {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Aujourd'hui
Toujours implémenté dans les dérivés de GnuPG et PGP et ancêtre des standards modernes de signature ; son créateur, quant à lui, reste l'un des cryptographes vivants les plus décorés {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Exemples conservés
L'article de 1985 lui-même — IEEE Transactions on Information Theory vol. 31 n° 4, pp. 469-472 — et le code en cours dans le logiciel libre sont les « survivants » {cite:elgamal-public-key-cryptosystem-1985} {cite:wikipedia-elgamal-encryption-en}.

## Dans la culture
« Père de SSL » a fait d'Elgamal une figure reconnue dans l'histoire d'Internet — et, dans la mémoire égyptienne et musulmane, la preuve que les créateurs de la sécurité du monde moderne incluent les fils de l'umma {cite:wikipedia-taher-elgamal-en}.

## Pour les jeunes lecteurs
Taher Elgamal est un scientifique égyptien qui a écrit une méthode astucieuse en 1985 : vous pouvez envoyer à un ami un message secret que personne d'autre ne peut lire même si tout le monde le voit, car la résolution nécessite une énigme mathématique très difficile à laquelle seul votre ami peut répondre. Avec cette idée, nous envoyons des messages de sécurité et faisons des achats sur Internet aujourd'hui.

## Références
Wikipédia anglais « ElGamal encryption » 1373205550 révision et 1371999818 de révision « Taher Elgamal » (faits d'entité) ; T. Elgamal, « A public key cryptosystem and a signature scheme based on discrete logarithms », IEEE Trans. Inf. Theory 31(4), 1985 (bibliographique).
