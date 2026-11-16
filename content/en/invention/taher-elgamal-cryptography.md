---
id: invention/taher-elgamal-cryptography
lang: en
source_lang: ar
title: "ElGamal cryptography: public-key security on discrete logarithms"
status: { review: published }
provenance: { generated_by: devin-drafter-w2-33, model: devin, run: inventions-w2-33, source: "Recorded Wikipedia revisions: ElGamal encryption, Taher Elgamal; 1985 IEEE paper bibliographic" }
---
## Summary
ElGamal is the public-key cryptosystem and digital-signature scheme that Taher Elgamal, an Egyptian-American cryptographer, proposed in a single 1985 paper. Built on the Diffie-Hellman exchange and the hardness of discrete logarithms, the encryption still runs inside GnuPG and PGP, while the signature scheme became the ancestor of the US government's Digital Signature Algorithm — and its maker then drove SSL, the padlock of the web {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## What it is
A pair of mathematical schemes: a public-key encryption system in which anyone can seal a message to a public key that only the private-key holder opens, and a signature scheme proving a message's origin. Security rests on the discrete logarithm problem — easy to compute in one direction, infeasible to reverse in a well-chosen cyclic group {cite:wikipedia-elgamal-encryption-en}.

## The world before it
Diffie and Hellman's 1976 key exchange had opened public-key cryptography, and RSA followed; but the field still needed a second family of schemes — encryption and signatures — resting on the discrete-logarithm hardness inside cyclic groups {cite:wikipedia-elgamal-encryption-en}.

## The story
Elgamal studied electrical engineering at Cairo University, then took his doctorate at Stanford in 1984 under Martin Hellman himself — a father of public-key cryptography — before joining HP Labs. In July 1985 IEEE Transactions on Information Theory published his four-page paper proposing both schemes. A decade later, as Netscape's chief scientist, he drove the SSL protocol that became the basis of TLS and HTTPS — earning him the title "father of SSL", the 2009 RSA lifetime award, the 2019 Marconi Prize and election to the National Academy of Engineering in 2022 {cite:wikipedia-taher-elgamal-en}.

## The maker(s)
Taher Elgamal ⁦(born 1955)⁩ is the sole author of the founding paper and the documented inventor: both schemes carry his name, and the encryption article records him as the system's describer in 1985 {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## How it works
Three phases: Alice publishes a public key made of a group, a generator and a value hiding her secret exponent; Bob picks a fresh ephemeral key for every message, derives a shared secret and masks the message with it; Alice's private key recovers the same secret and strips the mask. The new ephemeral each time is what keeps old ciphertexts safe {cite:wikipedia-elgamal-encryption-en}.

## The spread
The encryption lives on in GNU Privacy Guard and recent PGP versions; the signature scheme's variant was adopted by NIST as the Digital Signature Algorithm and Standard — and its maker's SSL at Netscape became the ancestor of the TLS that secures daily browsing {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## What it was built on
The 1976 Diffie-Hellman key exchange — ElGamal performs that exchange first, then uses the shared secret as a one-time pad — and the mathematics of cyclic groups and the discrete logarithm problem {cite:wikipedia-elgamal-encryption-en}.

## What was built on it
The DSA and the Digital Signature Standard signed government and software documents for decades; elliptic-curve signatures are grandchildren of the same line; and the whole public-key infrastructure of encrypted mail carries its logic {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Impact on daily life
Whenever software signs itself, mail encrypts itself, or a browser proves a site's identity, machinery in the ElGamal-Diffie-Hellman family is at work — invisible infrastructure for private communication {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## How it changed history
It gave cryptography a second great public-key family and the digital signature its standard form; with SSL its maker also seeded the protocol generation that made e-commerce possible {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Who invented it?
Uncontested: the paper is single-authored, both schemes bear the name ElGamal, and no rival claimant exists in the sources {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Today
Still implemented in GnuPG and PGP derivatives and ancestor of modern signature standards; its maker, meanwhile, remains one of the most decorated living cryptographers {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Surviving examples
The 1985 paper itself — IEEE Transactions on Information Theory vol. 31 no. 4, pp. 469-472 — and the running code in free software are the record's "survivors" {cite:elgamal-public-key-cryptosystem-1985} {cite:wikipedia-elgamal-encryption-en}.

## In culture
"Father of SSL" made Elgamal a named figure in Internet history — and, in Egyptian and Muslim memory, proof that the makers of the modern world's security include the ummah's sons {cite:wikipedia-taher-elgamal-en}.

## For young readers
Taher Elgamal is an Egyptian scientist who wrote a clever method in 1985: you can send a friend a secret message that nobody else can read even if everyone sees it, because solving it needs a very hard maths puzzle only your friend can answer. With this idea we send safe messages and shop on the Internet today.

## References
English Wikipedia "ElGamal encryption" revision 1373205550 and "Taher Elgamal" revision 1371999818 (entity facts); T. Elgamal, "A public key cryptosystem and a signature scheme based on discrete logarithms", IEEE Trans. Inf. Theory 31(4), 1985 (bibliographic).
