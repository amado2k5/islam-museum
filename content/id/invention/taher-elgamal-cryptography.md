---
id: invention/taher-elgamal-cryptography
lang: id
source_lang: ar
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-22), draft translation']
title: 'تعمية الجمل: التشفير بمفتاح عمومي على اللوغاريتمات المتقطعة'
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (turkish-indonesian lane, Word for Mac Translate Document)', model: microsoft-translator, run: word-docs-id-2026-11-22, source: content/ar/invention/taher-elgamal-cryptography.md}
---
## Ringkasan
Enkripsi kata sandi adalah sistem enkripsi kunci publik dan skema tanda tangan digital yang diusulkan oleh kriptografer Mesir-Amerika Taher El-Gamal dalam satu makalah pada tahun 1985. Berdasarkan pertukaran Dewey-Hellman dan kesulitan logaritma diskrit, enkripsinya masih beroperasi hingga kini dalam GnuPG dan PGP, sementara skema tanda tangannya menjadi asli untuk algoritma tanda tangan digital pemerintah AS (DSA) — kemudian pemiliknya mendorong protokol SSL untuk mengunci jaringan {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Apa itu
Sepasang skema matematika: sistem enkripsi kunci publik yang memungkinkan siapa saja mencap pesan ke kunci publik yang hanya dapat dibuka oleh pemegang kunci privat, dan skema tanda tangan yang membuktikan sumber pesan tersebut. Keamanannya didasarkan pada masalah logaritma diskrit — perhitungan mudah ke arah tertentu tetapi sangat sulit dibalik dalam grup sirkular {cite:wikipedia-elgamal-encryption-en} yang dipilih dengan baik.

## Dunia ada di hadapannya
Bursa Dewey-Hellman pada tahun 1976 membuka pintu untuk enkripsi kunci publik, diikuti oleh RSA; namun bidang ini membutuhkan keluarga skema kedua—enkripsi dan tanda tangan—berdasarkan kesulitan logaritma diskrit dalam grup sirkular {cite:wikipedia-elgamal-encryption-en}.

## Cerita
Al-Jamal belajar teknik elektro di Universitas Kairo, kemudian meraih gelar PhD di Stanford pada tahun 1984 di bawah bimbingan Martin Hellmann sendiri—salah satu bapak kriptografi publik—sebelum bergabung dengan HP Labs. Pada Juli 1985, IEEE Transactions on Information Theory menerbitkan makalah empat halaman yang mengusulkan para perencana. Satu dekade kemudian, sebagai ilmuwan utama Netscape, protokol SSL yang menjadi dasar TLS dan HTTPS mendorongnya menjadi "bapak SSL," memenangkan RSA Achievement Award pada 2009, Marconi Prize pada 2019, dan menjadi anggota National Academy of Engineering pada 2022 {cite:wikipedia-taher-elgamal-en}.

## Sang penemu dan para inovator
Tahir Al-Jamal (lahir 1955) adalah satu-satunya penulis dan penemu dokumen dari makalah pendiri: kedua perencana tersebut menggunakan namanya, dan artikel samar yang sama mencatat deskripsinya tentang sistem pada tahun 1985 {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Cara kerjanya
Tiga tahap: Alice menerbitkan kunci publik yang terdiri dari grup, generator, dan nilai yang menyembunyikan esensi rahasianya; Bob memilih kunci transien baru untuk setiap pesan guna mengekstrak rahasia bersama dan meyakinkan pesan tersebut; dan kunci privat Alice mengambil rahasia yang sama dan menghapus topeng tersebut. Setiap kali, transien baru itulah yang menghafal pesan lama {cite:wikipedia-elgamal-encryption-en}.

## Distribusi
Enkripsi ada di GNU Privacy Guard dan versi PGP modern; NIST mengadopsi formula skematik tanda tangan dan standar tanda tangan digital — dan penerusnya, SSL di Netscape, menjadi aset TLS yang mengamankan penelusuran harian {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Apa yang dibangun di atasnya
Pertukaran Dewey-Hellman 1976 — kalimat-kalimat tersebut pertama-tama melakukan pertukaran ini dan kemudian menggunakan rahasia umum dari satu padding — matematika grup sirkular dan masalah logaritma diskrit {cite:wikipedia-elgamal-encryption-en}.

## Apa yang dibangun di atasnya
Algoritma dan standar DSA ditandatangani oleh dokumen pemerintah dan perangkat lunak kontrak; tanda tangan oval adalah keturunan dari skrip yang sama; dan struktur kunci publik dari email terenkripsi membawa zona {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Dampak pada kehidupan
Ketika sebuah program menandatangani program yang sama, mengenkripsi emailnya sendiri, atau browser menginstal identitas situs, mekanisme dari keluarga Camel-Devi-Hellman beroperasi — koneksi pribadi tersembunyi {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Bagaimana sejarah berubah
Enkripsi memberikan keluarga publik besar kedua dan tanda tangan digital sebagai bentuk standar; dengan SSL, pemiliknya menanamkan pembuatan protokol yang memungkinkan e-commerce {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en}.

## Siapa sebenarnya yang menemukannya?
Tidak Diperdebatkan: Makalah ini ditulis oleh penulis yang sama, kedua diagram memuat nama kalimat, dan tidak ada klaim yang diperdebatkan dalam sumber {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Saat ini
Perangkat ini masih diimplementasikan dalam turunan GnuPG dan PGP serta menjadi sumber standar penandatanganan modern; dimiliki oleh salah satu enkriptor hidup {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en} yang paling dihormati.

## Bukti yang tersisa
Makalah yang sama — IEEE Transactions on Information Theory, Vol. 31, No. 4, hlm. 469-472 — dan kode yang bekerja dalam perangkat lunak bebas adalah "Sertifikat" dari catatan {cite:elgamal-public-key-cryptosystem-1985} {cite:wikipedia-elgamal-encryption-en}.

## Dalam budaya
Gelar "Bapak SSL" menjadikan Al-Gamal sosok penting dalam sejarah internet — serta dalam ingatan Mesir dan Muslim, membuktikan bahwa para pembuat keamanan dunia modern adalah putra-putra {cite:wikipedia-taher-elgamal-en}.

## Untuk si kecil
Taher El-Gamal adalah seorang ilmuwan Mesir yang menulis pada tahun 1985 sebuah metode cerdas: Anda bisa mengirimkan pesan rahasia kepada teman Anda yang tidak dibaca orang lain meskipun semua orang melihatnya, karena menyelesaikannya membutuhkan masalah matematika yang sangat sulit yang jawabannya hanya dia yang tahu. Dengan ide ini, hari ini kita mengirim pesan aman dan membeli dari internet.

## Referensi
Wikipedia Bahasa Inggris: tinjauan 1373205550 'ElGamal encryption', dan tinjauan 1371999818 'Taher Elgamal' (tentang prosisting entitas); serta makalah T. Elgamal dalam IEEE Trans. Inf. Theory 31(4) 1985 (bibliografi).
