---
id: invention/taher-elgamal-cryptography
lang: tr
source_lang: ar
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-22), draft translation']
title: 'تعمية الجمل: التشفير بمفتاح عمومي على اللوغاريتمات المتقطعة'
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (turkish-indonesian lane, Word for Mac Translate Document)', model: microsoft-translator, run: word-docs-tr-2026-11-22, source: content/ar/invention/taher-elgamal-cryptography.md}
---
## Özet
Parola şifreleme, Mısırlı-Amerikalı kriptograf Taher El-Gamal tarafından 1985 yılında tek bir makalede önerilen bir açık anahtarlı şifreleme sistemi ve dijital imza şemasıdır. Dewey-Hellman değişimi ve ayrık logaritmaların zorluğu temelinde, şifreleme bugün hâlâ GnuPG ve PGP içinde çalışırken, imza şeması ABD hükümetinin dijital imza algoritması (DSA) için orijinal yöntem haline gelmiştir — o zamanlar sahibi ağı kilitlemek için SSL protokolünü {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en} zorlamıştır.

## Nedir
Bir çift matematiksel şema: herkesin mesajı sadece özel anahtar sahibinin açabileceği bir açık anahtara damgalamasına izin veren bir açık anahtar şifreleme sistemi ve mesajın kaynağını kanıtlayan bir imza şeması. Güvenliği, ayrık logaritma problemine dayanır — bir yönde kolay hesaplama ama iyi seçilmiş bir dairesel grup {cite:wikipedia-elgamal-encryption-en} içinde tersine çevrilmesi çok zordur.

## Dünya önünde
1976'daki Dewey-Hellman değişimi, açık anahtarlı şifrelemenin kapısını açtı, ardından RSA; ancak alan, dairesel gruplardaki ayrık logaritmaların zorluğuna dayalı olarak ikinci bir şema ailesi—şifreleme ve imza—gerektiriyordu {cite:wikipedia-elgamal-encryption-en}.

## Hikaye
Al-Jamal, Kahire Üniversitesi'nde elektrik mühendisliği okudu, ardından 1984'te Stanford'da Martin Hellmann'ın danışmanlığında doktorasını yaptı—kamu kriptografisinin öncülerinden biri—ve HP Labs'a katıldı. Temmuz 1985'te IEEE Transactions on Information Theory, şemacılar önerdiği dört sayfalık makalesini yayımladı. On yıl sonra, Netscape'in baş bilim insanı olarak, TLS ve HTTPS'nin temelini oluşturan SSL protokolü onu "SSL'nin babası" konumuna taşıdı; 2009'da RSA Başarı Ödülü, 2019'da Marconi Ödülü ve 2022'de Ulusal Mühendislik Akademisi üyeliği {cite:wikipedia-taher-elgamal-en} kazandı.

## Mucit ve yenilikçiler
Tahir Al-Jamal (1955 doğumlu), kurucu makalenin tek yazarı ve belgelenmiş mucididir: iki planlayıcı onun adını taşır ve aynı gizemli makale onun 1985 {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en} yılında sistemin tanımını kaydeder.

## Nasıl çalışır
Üç aşama: Alice, gizli özünü gizleyen bir grup, üreteç ve değerden oluşan bir açık anahtar yayınlar; Bob, paylaşılan bir sırrı çıkarmak ve mesajı ikna etmek için her mesaj için yeni bir geçici anahtar seçer; Alice'in özel anahtarı aynı sırrı alır ve maskeyi kaldırır. Her seferinde, yeni geçiciler eski mesajları {cite:wikipedia-elgamal-encryption-en} ezberler.

## Yayılım
Şifreleme GNU Privacy Guard ve modern PGP sürümlerinde yer alır; NIST, imza şeması formülü ve dijital imza standardı benimsedi — ve Netscape'teki SSL, günlük taramayı {cite:wikipedia-elgamal-encryption-en} güvence altına alan TLS varlığı oldu {cite:wikipedia-taher-elgamal-en}.

## Üzerine ne inşa ediliyor
Dewey-Hellman 1976 değişimi — cümleler önce bu değişimi yapar, ardından tek bir dolgunun ortak sırrını kullanır — dairesel grupların matematiği ve ayrık logaritma problemi {cite:wikipedia-elgamal-encryption-en}.

## Üzerine ne inşa ediliyor
DSA algoritması ve standardı devlet belgeleri ve sözleşme yazılımı tarafından imzalanır; oval imzalar aynı betik türemesidir; şifrelenmiş posta taşıma bölgesi {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en} ile birlikte açık anahtar yapısı vardır.

## Hayata etkisi
Bir program aynı programı imzaladığında, kendi postasını şifrelediğinde veya bir tarayıcı bir site kimliği yüklediğinde, Camel-Devi-Hellman ailesinden mekanizmalar çalışır — gizli özel bağlantı {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en}.

## Tarih nasıl değişti
Şifreleme, ikinci büyük kamu ailesine sahip oldu ve dijital imzalara standart formunu verdi; sahibi SSL ile birlikte e-ticareti mümkün kılan protokol üretimini {cite:wikipedia-taher-elgamal-en} {cite:wikipedia-elgamal-encryption-en} sağladı.

## Gerçekten kim icat etti?
Tartışmasız: Makale aynı yazar tarafından yazılmıştır, iki diyagram cümlenin adını taşır ve kaynaklarda {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en} tartışmalı bir iddia sahibi yoktur.

## Günümüz
Hâlâ GnuPG ve PGP türevlerinde uygulanmakta olup modern imzalama standartlarının kaynağıdır; en saygın yaşayan şifreleyicilerden biri {cite:wikipedia-elgamal-encryption-en} {cite:wikipedia-taher-elgamal-en} tarafından sahiplenilmektedir.

## Kalan kanıtlar
Aynı makale — IEEE Transactions on Information Theory Cilt 31, No. 4, s. 469-472 — ve özgür yazılımda çalışan kod, kaydın "Sertifikaları"dır {cite:elgamal-public-key-cryptosystem-1985} {cite:wikipedia-elgamal-encryption-en}.

## Kültürde
"SSL'nin Babası" unvanı, El-Cemal'i internet tarihinde — ve Mısır ile Müslüman hafızasında — önemli bir figür haline getirdi; modern dünya güvenliğinin yaratıcılarının {cite:wikipedia-taher-elgamal-en}'ın oğulları olduğunu kanıtladı.

## Küçükler için
Taher El-Gamal 1985'te yazan akıllıca bir yöntem yazan Mısırlı bir bilim insanıdır: Arkadaşınıza herkesin görmesi bile kimsenin okumadığı gizli bir mesaj gönderebilirsiniz, çünkü bunu çözmek, cevabını sadece onun bildiği çok zor bir matematiksel problem gerektirir. Bu fikirle bugün güvenli mesajlarımızı gönderiyor ve internetten satın alıyoruz.

## Kaynaklar
İngilizce Vikipedi: 'ElGamal şifreleme' 1373205550 incelemesi ve 'Taher Elgamal' 1371999818 incelemesi (varlığın bildirilerinin); ve T. Elgamal'ın IEEE Trans. Inf. Theory 31(4) 1985'teki makalesi (bibliyografi).
