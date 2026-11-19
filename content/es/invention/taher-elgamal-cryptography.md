---
id: invention/taher-elgamal-cryptography
lang: es
source_lang: en
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-19), draft translation']
title: 'ElGamal cryptography: public-key security on discrete logarithms'
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (spanish lane, Word for Mac Translate Document, managed by Claude Code)', model: microsoft-translator, run: word-docs-es-2026-11-19, source: content/en/invention/taher-elgamal-cryptography.md}
---
## Resumen
ElGamal es el sistema de criptosistema de clave pública y firma digital que Taher Elgamal, un criptógrafo egipcio-estadounidense, propuso en un único artículo de 1985. Basado en el intercambio Diffie-Hellman y en la dureza de los logaritmos discretos, el cifrado sigue funcionando dentro de GnuPG y PGP, mientras que el esquema de firma se convirtió en el antecesor del Algoritmo de Firma Digital del gobierno estadounidense — y su creador impulsó entonces SSL, el candado de la web {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Qué es
Un par de esquemas matemáticos: un sistema de cifrado de clave pública en el que cualquiera puede sellar un mensaje a una clave pública que solo abre el titular de la clave privada, y un esquema de firmas que demuestra el origen del mensaje. La seguridad se basa en el problema del logaritmo discreto — fácil de calcular en una sola dirección, inviable de revertir en un grupo cíclico bien elegido {cite:wikipedia-elgamal-encryption-en}.

## El mundo que tenía delante
El intercambio de claves de Diffie y Hellman en 1976 había abierto la criptografía de clave pública, y RSA le siguió; pero el campo aún necesitaba una segunda familia de esquemas — cifrado y firmas — basados en la dureza de logaritmo discreto dentro de grupos cíclicos {cite:wikipedia-elgamal-encryption-en}.

## La historia
Elgamal estudió ingeniería eléctrica en la Universidad de El Cairo, luego obtuvo su doctorado en Stanford en 1984 bajo la tutela del propio Martin Hellman — un padre de la criptografía de clave pública — antes de incorporarse a HP Labs. En julio de 1985, IEEE Transactions on Information Theory publicó su artículo de cuatro páginas proponiendo ambos esquemas. Una década después, como científico jefe de Netscape, impulsó el protocolo SSL que se convirtió en la base de TLS y HTTPS — lo que le valió el título de "padre del SSL", el premio vitalicio RSA en 2009, el Premio Marconi en 2019 y la elección para la Academia Nacional de Ingeniería en 2022 {cite:wikipedia-taher-elgamal-en}.

## El(los) creador(es)
Taher Elgamal ⁦(born 1955)⁩ is the sole author of the founding paper and the documented inventor: both schemes carry his name, and the encryption article records him as the system's describer in 1985 {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Cómo funciona
Tres fases: Alice publica una clave pública formada por un grupo, un generador y un valor que oculta su exponente secreto; Bob elige una nueva clave efímera para cada mensaje, obtiene un secreto compartido y enmascara el mensaje con ella; La clave privada de Alice recupera el mismo secreto y elimina la máscara. El nuevo efímero cada vez es lo que mantiene seguros los antiguos textos cifrados {cite:wikipedia-elgamal-encryption-en}.

## La propagación
El cifrado sigue presente en GNU Privacy Guard y en las versiones recientes de PGP; la variante del esquema de firma fue adoptada por NIST como Algoritmo y Estándar de Firma Digital — y el SSL de su creador en Netscape se convirtió en el antecesor del TLS que asegura la navegación diaria {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Sobre qué se construyó
El intercambio de claves Diffie-Hellman de 1976 — ElGamal realiza primero ese intercambio y luego utiliza el secreto compartido como un pad de uso único — y las matemáticas de los grupos cíclicos y el problema del logaritmo discreto {cite:wikipedia-elgamal-encryption-en}.

## Lo que se construyó sobre ello
La DSA y el Estándar de Firma Digital firmaron documentos gubernamentales y de software durante décadas; las firmas de curva elíptica son nietos de la misma línea; y toda la infraestructura de clave pública del correo cifrado lleva su lógica {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Impacto en la vida diaria
Cada vez que el software inicia sesión por sí mismo, el correo se encripta o un navegador demuestra la identidad de un sitio, la maquinaria de la familia ElGamal-Diffie-Hellman está en acción — infraestructura invisible para la comunicación privada {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Cómo cambió la historia
Le dio a la criptografía una segunda gran familia de claves públicas y a la firma digital su forma estándar; con SSL, su creador también impulsó la generación de protocolos que hizo posible el comercio electrónico {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## ¿Quién lo inventó?
Sin oposición: el artículo es de autor único, ambos esquemas llevan el nombre ElGamal, y no existe ningún reclamante rival en las fuentes {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Hoy
Todavía implementado en derivados de GnuPG y PGP y antecesor de los estándares modernos de firma; su creador, por su parte, sigue siendo uno de los criptógrafos vivos más condecorados {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Ejemplos supervivientes
El propio artículo de 1985 — IEEE Transactions on Information Theory vol. 31 no. 4, pp. 469-472 — y el código en ejecución en software libre son los "supervivientes" {cite:elgamal-public-key-cryptosystem-1985} {cite:wikipedia-elgamal-encryption-en}.

## En la cultura
"Padre de SSL" convirtió a Elgamal en una figura reconocida en la historia de Internet — y, en la memoria egipcia y musulmana, prueba de que los creadores de la seguridad del mundo moderno incluyen a los hijos de la umma {cite:wikipedia-taher-elgamal-en}.

## Para lectores jóvenes
Taher Elgamal es un científico egipcio que escribió un método ingenioso en 1985: puedes enviar a un amigo un mensaje secreto que nadie más puede leer aunque todo el mundo lo vea, porque resolverlo requiere un rompecabezas matemático muy difícil que solo tu amigo puede responder. Con esta idea enviamos mensajes seguros y compramos hoy en Internet.

## Referencias
Wikipedia en inglés "ElGamal encryption" 1373205550 revisión y 1371999818 de revisión "Taher Elgamal" (hechos de entidad); T. Elgamal, "A public key cryptosystem and a signature scheme based on discrete logaritms", IEEE Trans. Inf. Theory 31(4), 1985 (bibliográfico).
