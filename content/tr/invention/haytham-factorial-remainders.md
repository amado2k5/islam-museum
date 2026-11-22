---
id: invention/haytham-factorial-remainders
lang: tr
source_lang: ar
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-22), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (turkish-indonesian lane, Word for Mac Translate Document)', model: microsoft-translator, run: word-docs-tr-2026-11-22, source: content/ar/invention/haytham-factorial-remainders.md}
---
## Özet

İbn el-Heytham, bir [[person/ibn-al-haytham|sayının 2, 3, 4, 5 ve 6'ya bölündüğünde bir kaldığı ve artık olmadan 7'ye bölünebildiği problemini sunar. Sayıları çarpan ve ardından bir toplayan bir yapıyı açıklar: 6!+1=721. Bu, her kalıntı hesaplamanın ya da çoklu koşullu her problemin icadı değildir {cite:haytham-mactutor number-theory}]].

Sunum, şimdi Wilson teoremi olarak adlandırılan yöntemi kullanır ve tüm çözümleri sunan ikinci bir yöntemin haberi vardır. Mactotter bu yöntemin ayrıntılarını listelemez. Bu nedenle, tarihsel iletilen cevabı modern müze türevi 301+420j'den ayırır ve 721'i en küçük pozitif cevap olarak adlandırmıyoruz; 301 ondan küçüktür ve aynı koşulları sağlar {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem eq1}.

## Nedir

Geri kalan ise, bölenin tam sayı katları alındıktan sonra geriye kalan şeydir. Yani 721'in 6'ya bölündüğünde 1 bıraktığı 721=6×120+1 anlamına gelir, bölenin dışında değil. Problem, birden fazla koşulu birlikte karşılamayı gerektirir; bir koşulu sağlayan bir sayı bulmak tam olarak kontrol edilen bir çözüm değildir {cite:haytham-mactutor number-theory}.

'Çarpan', ardışık tam sayıların çarpılması için yapılan özlü bir hadis gösterimidir: 6!=1×2×3×4×5×6=720. Ünlem işareti edebi ünlem değildir ve orijinal İbn al-Heystem'den alıntı yaptığımız bir işaret değildir. Kart, ilişkiyi günümüz okuyucusuna açık bir dilde sunarken, iletilen kökeni ve inceleme yöntemini ayırt edilebilecek iki şey olarak korur {cite:weisstein-wilson-theorem definition}.

## Dünya önünde

Mactotter bu soruyu Çin kalıntı teorisi olarak adlandırılan özel bir durum olarak tanımlar. Bu nedenle, bölünme koşullarını ekleme fikrini İbn el-Heytham'a atfetmek doğru değildir. Bu kartın konumu, daha geniş problemler geleneğinde çarpanlar için özel bir yapıdır; bir emsalin varlığı, sonraki bir katkının açıklanabilme olasılığını ortadan kaldırmaz, ancak dünyanın sıfırdan tek başına başladığı iddiasını engeller {cite:haytham-mactutor number-theory}.

Bu soru, hacimleri [[invention/ibn-al-haytham-fourth-power-volumes|dördüncü kuvvetle ölçmekten]] veya aynanın [[invention/ibn-al-haytham-circular-reflection|yansımasının konumunu belirlemekten de]] farklıdır. Tek bir katkıyı birçok isimle yeniden hesaplamayız: burada tam sayılar üzerinde kısıtlamalar vardır, optik yüzey veya hacim bölümü değil. Bir bilim insanının biyografisindeki alanların çokluğu tek başına bu alanlar arasında belirli bir yöntemin aktarıldığını kanıtlamaz {cite:haytham-mactutor number-theory}.

## Hikaye

MacCutter, Opuscula makalesinden bahseder ve Rashid'in çalışmasında bir çeviri kullanır, ardından iki yöntemi tanımlar. İlk yapının içeriğini aktarır ve ikinci yapının tüm bu çözümleri ele aldığını söyler. Bu sunumu okuruz, Arapça orijinali veya Rashid'in tam baskısı değil; Arapça tez başlığı tahmin olarak oluşturmayız ve modern grup adını eski bir kitabın {cite:haytham-mactutor Opuscula} adına çevirmiyoruz.

Bu paragraftan herhangi bir konsey, tarih veya oda hakkında bir çözüm bilgisi yoktur. Yazarın yaşam ufku yaklaşık olarak onuncu yüzyılın sonları ve on birinci yüzyılın başlarında yer alır ve Kahire biyografisinin bağlamıdır, bu konuda kesin bir temel oluşturmak için bir yer değildir. Tartışmacılar kitabının tarihini her diğer sayısal fikir için otomatik bir tarih yapmayız {cite:haytham-mactutor biography-and-number-theory} {cite:tdv-ibnul-heysem biography}.

## Mucit ve yenilikçiler

Yazarın bireysel kimliğini ve tartışmaların başlangıcından ve TDV raporundan kaydedilmiş temelini, ayrıca anlatının doğruluğu iddiasından bağımsız olarak ilan edilen Sünni çerçeveyi koruyoruz. Mısır'daki çalışmasından yeni bir doktrin eklemiyoruz, dinini metodolojinin adından türetmiyoruz. Bu oturum, biyografisindeki tüm metinlerin yeniden incelenmesi değildir {cite:manazir-sabra-1983 p.60} {cite:tdv-ibnul-heysem biography}.

Wilson adı, matematiksel bir sonuç için kullanılan modern bir terimdir. Mathworld, Wilson, Waring, Leibniz'in önceki bilgisi ve Lagrange'ın ispatını listeler; MacCutter, Ibn al-Haytham'da daha önceki bir kullanımı sunar. İki tarihsel hesaplamayı, bir kopyadan diğerine doğrudan bir yol icat etmeden veya problemin tüm tarihçesini {cite:weisstein-wilson-theorem history} {cite:haytham-mactutor number-theory} vermeden görünür tutarız.

## Nasıl çalışır

2'den 6'ya kadar olan her sayı 720'de bir çarpan olduğundan, 720'nin geri kalanı bunlardan herhangi birine bölündüğünde 0'dır ve 721'in geri kalanı 1'dir. Ancak bu tek başına 7'ye bölme koşulunu kanıtlamaz. Burada şimdi Wilson teoremi olarak adlandırılan sonuç ortaya çıkar: eğer p asal sayıysa, (p−1)!+1 onun katıdır. Örnekte 721=7×103 {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory}.

Bu sayılar 721'in asal olduğunu söylemez; 7 ve 103'e bölmek ise tam tersini gösterir. Asal koşul p'yi belirtir, yapılandırılmış sayı değil. Ayrıca, 7'nin herhangi bir bileşik sayıyla değiştirilmesi kabul edilemez: 4'te 3!+1=7'dir ve bu 4'e bölünemez. Bir formülün bilinen bir tanım kümesindeki geçerliliği, varsayımından {cite:weisstein-wilson-theorem definition-and-composite-exception} vazgeçildikten sonra kullanımının bir beyanı değildir.

Bu, örnekteki tüm olumlu cevapların bağımsız modern bir türetimidir, ikinci yöntemin tekrarı değildir: 2'den 6'ya en küçük ortak katı 60'tır, yani N=60k+1. Ve 60, 7'ye bölündüğünde 4 olarak kaldığı için, 4k+1'in 7'ye bölünmesine ihtiyacımız var; yani k=5+7j. N=301+420j elde edilir.

j harfini pozitif cevaplar için negatif olmayan bir tamsayı olarak alırız. Önce 301, sonra 721, sonra 1141. Örneğin, 301=5×60+1=7×43 ve 721=12×60+1=7×103. İlk cevapların listesi tek başına tamlığın kanıtı değildir; burada tamlık, koşulları N=60k+1'e dönüştürüp 7 koşulu çözerek gelir, aramayı istediğimiz sayıda durdurmaktan değil.

420 eklemesi koşulların tekrarını açıklar: 60 ve 7'ye bölünür, böylece gerekli kalan hiçbir şey değişmez. 7'yi 721'e eklersek, 7'ye bölünebilir kalan ancak 6'ya bölündüğünde 1 kalmayan 728 olur; 2 kalır. Ek 60, ilk koşulları korur, otomatik olarak 7 koşulu değil. Bu nedenle, her toplama başka bir cevap üretmez. Bu, modern çözümde ortak dönemin anlamının incelenmesidir; el yazmasında bulunan sayılar listesine dair bir bilgi yoktur ve formülasyonumuzun yazarın ikincil sunumdaki eksik formu olduğuna dair bir kanıt yoktur. Detay, bir koşulun korunması ile tüm koşullar sisteminin sürdürülmesi arasındaki farkı korur.

## Yayılım

Burada okunan kaynaklar, yazarın Wilson'a doğrudan kopya haritası sunmamaktadır. Modern bir isim ve daha eski bir sonuç, bir el yazması, alıntı veya çevirinin iletildiğini kanıtlamak için yeterli değildir. Raporları sahiplerine atfediyoruz ve diyagramda {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history} doğrulanmış bir pay olmadan belgelenmemiş bir iletim bağlantısı bırakıyoruz.

Ayrıca, ikinci yöntemin haberi, her okulda veya pazarda benimsenmesiyle ilgili bir haber değildir. Bir sorunun kullanılma olasılığını tarihsel bir dolaşım istatististine dönüştürmüyoruz. Okuyucunun bugün modern açıklamalarda gördüğü şey çağdaş bir eğitim alımıdır; eski bir öğretim kursuna bağlamak, okuma paragraflarının sunmadığı ek kanıtlar gerektirir.

## Üzerine ne inşa ediliyor

Doğrudan taban, sayıları çarpıp bir toplar, son bölen için özel bir koşul ile birleştirilmiştir. Son koşulu çıkarırsak, 60k+1 formundaki çözümler olur, tek bir sayı değil. 720'de tekrarlanan çarpanların varlığı onu geçerli bir çarpan yapar, ancak en küçük ortak çarpan değildir; tüm sayıların çarpımı her zaman en kısaltılmış yöntem değildir {cite:haytham-mactutor number-theory}.

Modern açıklamada küçük çarpan 60'ı kullanırız çünkü 2'den 6'ya kadar olan koşulları tek bir ifadede birleştirir. Bu bölenler asal iki değildir: 2, 4 ve 6 ortak bölenlerle birlikte. Bu nedenle, sessiz diferansiyel bölenler durumu için bir formül uygulamayız; artık teori için genel bir isim kullanmadan önce örneğin doğasını tanımlarız.

## Üzerine ne inşa ediliyor

Bugün Mathworld, teoremin p>1'de birincilik için gerekli ve yeterli bir koşul olarak formüle edilmesine izin verir. Ancak modern aritmetiği sunumumuz, her iki koşulun ispatının İbn al-Haytham'ın kökeninde tam olduğunu iddia etmez. Bir sonucu kullanmak, kanıtlamak ve farklı iddiaların kendi kendine birleşmediği hızlı pratik bir test sağlamak {cite:weisstein-wilson-theorem definition} {cite:haytham-mactutor number-theory}.

Çarpım, derse büyük sayılar yazmaktan kaçınmak için sadece kalan kısmı saklanarak adım adım hesaplanabilir. Bu, örnekleri incelemek için modern bir yöntemdir, yazara atfedilen bir hesaplama algoritması değildir. Sadece aritmetik biçimden, her çağdaş programlama veya kodlama kullanımına doğrudan bir zincir değerlendirmeyiz.

## Hayata etkisi

Okunan paragraflar, bu örneği uygulayan satıcılar veya sözleşmeler tarafından kazanılan saatleri kaydetmiyor. Desteklenen etki, koşulların yapısı ve birden fazla çözüm olasılığı üzerine sayısal bir araştırmanın parçasıdır. Hesaplamayı tarihsel bir günlük araç gibi göstermek için bir ticaret hikayesi eklemiyoruz, ayrıca finansal kârı ölçmediği için sorunun değerini azaltmıyoruz {cite:haytham-mactutor number-theory}.

Bugün okuyucu net bir ders almıştır: doğru cevap mutlaka en küçük değildir, ne de her şeyi kapsayan cevap değildir. Bir yapı yöntemi büyük ve kolay elde edilen bir sonuç verebilirken, koşulların yeniden formüle edilmesi tüm ailenin daha özlü bir tanımını sağlar. Bu, 301 ve 721'in eğitici bir karşılaştırmasıdır, İbn el-Heytem için kişisel ekonomik bir hedefin kanıtı değildir.

## Tarih nasıl değişti

Sorun, yazarın görsel olmayan yönlerinden birini görünür kılar: sayıların eşzamanlı kısıtlamalarla ele alınması, sadece aynada ve gözde işleyen klişe bir dünya imgesi değil. Ancak izleyicinin şöhreti her konuda önceliğini kanıtlamaz. Buradaki atfedilme, tarihsel paragraf {cite:haytham-mactutor number-theory} ile tanımlandığı gibi özel bir sayısal yapıya dayanır.

Soru ayrıca yapı, inceleme ve doğrulama arasında ayrım yapar. 721 kurup her koşulun incelenmesi, daha küçük bir koşulun varlığını sorgulamak ve tüm cevaplar sorgulanabilir. Bunlar farklı görevlerdir ve tarihsel sunumda ikinci bir yöntemden bahsetmek, hikayenin sadece ilk sayıyı üretmekle kalmadığını gösterir. Eksik detayları modern bir kanıtla doldurup sahibini {cite:haytham-mactutor Opuscula} gizlemeziz.

## Gerçekten kim icat etti?

**Bildirilen Sünni çerçeve:** İbn el-Heytem'in bireysel kimliğinin temeli, aritmetikten çıkarılan bir doktrin çıkarımından değil, kayıtlardan korunmuştur. **Akademik Okuma:** MacCutter eski yapıyı ve kullanımı tanımlar, Mathworld ise teoremin adını ve daha sonraki bir Avrupa tarihini listeler. Bunun doğrudan bir aktarım yolunu kanıtladığını veya modern adın fikrin {cite:tdv-ibnul-heysem biography}, {cite:haytham-mactutor number-theory}, {cite:weisstein-wilson-theorem history} tüm tarihini kapsadığını değerlendirmiyoruz.

Buradaki iyileştirmeye katkının tanımı sınırı korur: bu, tepsinin ilk kalıntısı, ilk çarpımı ya da uyumların tüm hesaplanması değildir. Kaynağını okumayı veya tüm öncelikli konuları ayırmayı iddia etmiyoruz. Sunabileceğimiz şey, okuyucunun incelemesine yardımcı olacak modern bir tanımla birlikte özel bir yapı ve sınırlarıdır.

## Günümüz

Görüntüde, 0, 3, 6 ve 9 numaralı iki gri saat vardır ve aralarında +4h bulunur. Akrep 9'dan 1'e hareket eder çünkü 9+4=13 ve geri kalan 1 12 ile ölçülür. Bu, periyodik hesaplama için modern bir benzetmedir, İbn el-Heytem'in bir saati ya da el yazmasından bir kopya değildir. Görüntü Issue 7 değildir: Standard 12 bileşik {cite:commons-clock-group-spindled current-image}.

Periyodik eşitlik, sıradan tam sayılar arasında 13=1'in 12'ye bölündüğünde aynı kalıntıyı bıraktığı anlamına gelmez. Bölme artıklarıyla uğraşmak, sayısal farkları silmekten farklıdır. Biçim, çarpılan yapının {cite:commons-clock-group-spindled description} ihtiyaç duyduğu her asal özelliği kanıtlamadan ziyade, terimin anlaşılmasına yardımcı olur.

## Kalan kanıtlar

MacCutter'daki özel paragrafları, tanımı, ilk formu ve Mathworld'deki tarihi okuyoruz. Orijinal Opuscula'yı ya da tam Rashid baskısını okumadık, ayrıca sadece bu isimden dolayı Arapça el yazması tanımlayıcısı da atamıyoruz. Burada yeni bir çalışma oluşturulmamaktadır, yazarın bu konuda hiçbir şey yazmadığı iddiası değil {cite:haytham-mactutor Opuscula}.

Commons görüntüsü ve hakları şu kişilere atfedilmiştir: 19 Ekim 2006'daki orijinal yükleyici Spindle ve 2008'den itibaren metin hizalama düzeltmesi ile CC BY-SA3.0 lisanslı mevcut sürüm. Mevcut orijinal SVG değişiklik yapılmadan yayımlanmıştır. Yükleme tarihi antik matematiğin tarihini vermez veya bu biçimde antik bir saatin varlığını kanıtlamaz {cite:commons-clock-group-spindled description-rights}.

## Kültürde

İcat hikayesi tek bir isim, bir zafer atışı ve sonlu bir sayı tercih edebilir. Ancak mesele, belirli bir cevap ile genel bir tanım ve teoremin adı ile kullanıldığı tarih arasındaki ayrım devam ettiğinde daha zenginleşir. Bu, isimler hakkında bir yargı değil, müzenin kanıtların ne söylediğini ve ne söylemediğini gösterme biçimidir {cite:haytham-mactutor number-theory} {cite:weisstein-wilson-theorem history}.

Yorum, yazarın hayali bir çizimi veya anlatı danışmanlığını gerektirmez. Koşulları okuyup yeniden incelemek, ardından iki saatlik görüntünün başka bir döneme ait olduğunu fark etmek yeterlidir. Belirtilen karşılaştırma, yakın tarihli bir eğitim eserini, sahip olmadığımız belgeleri illüzyonla yansıtan bir esere dönüştürmeden anlamaya yardımcı olur.

## Küçükler için

721 yazın, 2, 3, 4, 5, 6, sonra 7'ye bölün. Geri kalanını sadece bölme dışında değil, kaydedin. 301 ile tekrarlayın. Kontrol, en küçük sayının da koşulları karşıladığını gösterecektir; ilk doğru cevapta durmayın veya araştırma veya kanıt olmadan en küçük cevap olarak adlandırmayın.

Sonra 3!+1'den çıkan 7'yi deneyin: 4'e böler mi? Hayır. İlk örnekten hangi koşulun farklı olduğunu sorun7. Modern saatin yazarın elinde olduğunu hayal etmek gerekmez; bu sadece geri kalan için bir metafordur. Bugün yaşadığınız tarihsel rapor ile hesaplama, aynı şey olmadan {cite:weisstein-wilson-theorem eq1} {cite:haytham-mactutor number-theory} birleşir.

## Kaynaklar

- Maktotter: Kalıntılar ve hareketli yapı meselesi {cite:haytham-mactutor number-theory}.
- Mathworld: Tanım, Tarih ve Öncelik Koşulu {cite:weisstein-wilson-theorem eq1-and-history}.
- TDV: Yazar bağlamı, doğrulanmış bir oluşturma pozisyonu değil {cite:tdv-ibnul-heysem biography}.
- Commons: Modern Image ve Hakları {cite:commons-clock-group-spindled description-rights}.
