---
id: invention/biruni-difference-interpolation
lang: tr
source_lang: ar
translators: ['Claude (Anthropic), model translation, 2026-11-24, not read by a human']
provenance: {generated_by: 'Claude Code (model translation)', model: claude-sonnet-5-5, run: model-tr-id-fr-es-2026-11-24, source: content/ar/invention/biruni-difference-interpolation.md}
---

## Özet

Bir tablodan, sahibi tarafından ayrı bir satırda yazılmamış bir değer nasıl çıkarılır? İki satır arasındaki artışı eşit paylara bölmek her zaman yetmez; artışların kendisi değişebilir. [[person/al-biruni-muhammad-ibn-ahmad|Birûnî]], [[work/al-qanun-al-masudi|el-Kânûnü'l-Mes'ûdî]]'de işlemi düzeltmenin bir yolunu açıklamadan önce bu sorunu tartışır {cite:qanun-masudi-jundi-v1 scan pp.301–302,321–324}. Bu kartın konusu, tablo okumada belirli bir iyileştirmedir; sinüsün ya da interpolasyonun tamamının icadı değildir, bir tek yazara sonraki her ikinci dereceden formülün sahipliğini vermek de değildir. İnterpolasyonun tarihi, modern araştırmanın gösterdiği gibi daha eski Hint yöntemlerini de içerir {cite:meijering-interpolation-2002 II.B–II.C}. Burada sunulan şey bir metin ve yaklaşık bir hesaptır; ne bir eser alettir ne de her sonucun doğruluğunu kanıtlayan bir deneydir.

## Nedir

İnterpolasyon, bilinen değerler arasında kalan bir değeri tahmin etmektir; [[concept/istikmal-interpolation|istikmâl]], muhakkikin Birûnî'nin çalışmasını sunuşunda bulunan bir addır; okunan asıl metin ise alışılmış işlem ile tecyîb ve takvîs'teki titizliği birbirinden ayırır {cite:qanun-masudi-jundi-v1 scan pp.40–42,321–324}. Tecyîb, yaydan sinüs değerini ister; takvîs ise isteği tersine çevirerek bilinen bir değer için yayı arar; yazar, sinüs adını her tabloya genellememeye özen gösterir {cite:qanun-masudi-jundi-v1 scan p.321}. İyileştirme, düşünceye bir fark daha ekler: yalnızca iki satır arasındaki değişim miktarı değil, bu miktarın öncekinden nasıl farklılaştığı. Kartın birimi budur; sütunlar ya da çarpma işlemleri, sayıyı katlayacağımız bağımsız icatlar değildir.

## Ondan önceki dünya

Meijering, Brahmagupta'daki ikinci dereceden formülleri ve Birûnî'den önceki sonraki Hint yöntemlerini açıklar ve bunları astronomik tabloların daha geniş tarihine yerleştirir {cite:meijering-interpolation-2002 II.B–II.C}. Raşid'in özeti, Birûnî'nin, Semev'el'in incelediği bir metin aracılığıyla ikisi Hint olmak üzere dört interpolasyon yöntemi bildiğini belirtir {cite:rashed-interpolation-1991 abstract}. Bu özeti yazmanın ya da makalenin bütün ispatlarının bir okumasına dönüştürmeyiz ve el-Kânûn'daki her işlemin tek bir yöntemin birebir kopyası olduğunu çıkarmayız. Müzede ayrıca, doğrudan ve ters doğrusal interpolasyon içeren [[invention/battani-sine-table-methods|Battânî'nin tabloları]] hakkında başka bir kart vardır; yeni kart onun yeniden adlandırılması değildir {cite:nallino-albatenii-opus-astronomicum Arabic pp.16–17; Latin pp.10–11}.

## Hikâye

Soru, talimat listesinden önce başlar. Çap sayısının seçimi bahsinde Birûnî, çarpma ve bölmeyi hafifletmek için en büyük sinüsü bir yapmayı tercih eder, sonra sinüs farklarının yay farklarıyla sabit oranla orantılı olmadığını geometrik olarak ispatlar {cite:qanun-masudi-jundi-v1 scan pp.301–302}. Bölümlerin dakikalara kadar inceltilmesi halinde uzun hesabın maliyetini anar ve tabloda çeyrek derecelik adımları seçmesini açıklar {cite:qanun-masudi-jundi-v1 scan p.302}. Çok sayıda sayısal basamak, onu kullanmanın sağlam bir yolunun yerini tutmaz. Buradaki tarihleme, Meijering'in kitabı sınıflandırdığı gibi on birinci yüzyıla ait belgesel bir bağlamdır; bildiğimiz bir icat günü ya da bu modern baskının yılı değildir {cite:meijering-interpolation-2002 II.C}. Tarihin boşluğunu, asıl haber gibi hesaplanmış bir hicrî ile doldurmayız.

## Mucit ve mucitler

İyileştirmenin Birûnî'ye nisbeti, genel şöhretine değil, yazılı açıklamasına dayanır; kart sahibinin rolü belirli tablo çalışmasının iyileştirilmesidir, öncüller de hikâyede kalır {cite:qanun-masudi-jundi-v1 scan pp.321–324,339–340} {cite:meijering-interpolation-2002 II.B–II.C}. Kayıt, metnin yazarı ile baskının muhakkiki, Raşid, Meijering ve modern resmin sahibini birbirinden ayırır; bunların sayfada birleşmesini tek bir tarihî ele nisbet etmez.

**Ehl-i sünnet:** Müslüman olarak Birûnî'nin sıfatı, Britannica'da ve Tümer'in araştırmasında kişi için belgelenmiştir; mezhebî sınıflandırması ise ihtilaflıdır ve biyografisi, Tümer'in okumasını ilan edilmiş Sünnî çerçeve içinde sunar {cite:britannica-al-biruni biography} {cite:tdv-biruni-tumer religious-affiliation}.

**Nakledilen iki nisbet, Şiî ve Zeydî:** Kişi kaydı, her iki sınıflandırmayı Tümer aracılığıyla sunar; müzenin kesin bir hükmü olarak değil {cite:tdv-biruni-tumer religious-affiliation}. Yazarın adı, himaye edenin mezhebi ya da taramanın barındırıldığı yer, bireysel şahitliğin yerini tutmaz.

## Nasıl çalışır

Okuyucu, yayı istenenden küçük olan satırı alır, onun değerini ve yayın geri kalanını saklar; sonra yazar, alışılmış düzeltmeyle hesaplanan artış ile komşu fazla ve önceki fazladan düzelttiği artışı ayırır {cite:qanun-masudi-jundi-v1 scan pp.321–322}. Anlamı şudur: kullanılan artış oranı bütün noktalarda tek kalmaz; metin, onun kademelenmesi için geometrik bir gerekçe sunar {cite:qanun-masudi-jundi-v1 scan p.323}. «Düzeltme» sözcüğü, sonucun hatasız tam bir değer olduğu anlamına gelmez.

Artan değerler işlemi modern sembollerle şöyle çözümlenebilir: başlangıç değeri `y0`, önceki ve sonraki artışlar `Dprev` ve `Dnext`, aralıktan alınan kesir `t`; o zaman okuma `y0+t*((1-t)*Dprev+t*Dnext)` olur {cite:qanun-masudi-jundi-v1 scan pp.322–323,339–340}. Bu, okunan sözün bizim tarafımızdan öğretici bir yazımıdır; yazarın sembolleri ya da üç noktadan geçmesi zorunlu olan alışılmış Newton formülü değildir. Kalan ile çarpma iki kez görünür, dolayısıyla ilişki doğrusal değildir.

Ders için hazırlanmış, değerleri −1, 0 ve 1 noktalarında 1, 2 ve 2.5 olan bir tabloda, önceki artış 1, sonraki artış 0.5'tir. Sonraki aralığın yarısında işlem 2.375 verirken doğrusal interpolasyon 2.25 verir; bu verilerden tek başına, ikisi arasında kalan gerçek değeri bilemeyiz. Örnek, el-Kânûn'un sayıları ya da genel bir üstünlük ispatı değil, talimatlarda neyin değiştiğini gösterir.

Birimlerin de ayarlanması gerekir. İşlemde geçen dört dakika, 1/15 değerinde altmışlık bir sayıdır; çeyrek derecenin on beş dakikaya bölünmesinin yerini tutar, dört derecelik yeni bir açı değildir {cite:qanun-masudi-jundi-v1 scan p.323}. Metin takvîsi, her yaklaşımın tersinin gerçek fonksiyonun tersi olduğunu ilan etmekle değil, kendi adımlarıyla ele alır {cite:qanun-masudi-jundi-v1 scan pp.322,324}.

Sinüsten yaya dönüş de ayrı bir dikkati hak eder: yazar, en yakın küçük sinüsle başlar ve yayını saklar, sonra yay artışını elde etmek için sinüsün kalanını ve farkları kullanır {cite:qanun-masudi-jundi-v1 scan p.322}. Tüm hesap işlemlerini koruyup yalnızca iki sütunun başlıklarını değiştirmek doğru olmaz; çünkü bilinen miktar ile istenen kalan yer değiştirmiştir. Aynı şekilde, önceki fark, okuyucunun ekranı şimdiki satırdan başladığı için sıfır değildir; işlem belirli bir komşu bilgiye ihtiyaç duyar. Gösterim penceresinin seçimi tarihî tablonun sınırları değildir; bu yüzden eksik bir uç için kural uydurmaz ya da bulamadığımız bir bilginin yerine sessizce bir değer koymayız. Bu, okunan talimatların gereklerinin bir açıklamasıdır, yazara nisbet edilen yeni bir program değildir.

## Yayılışı

Raşid'in özeti, Semev'el'in Birûnî'den bir pasajı aktardığını, doğrusal ve doğrusal olmayan yöntemleri ve sonuçlarını karşılaştırdığını ve onları iyileştirmeye çalıştığını naklediyor; bu, sonraki bir okuma ve tartışmanın belirli bir şahididir, ülkeler arasındaki her aktarımın haritası değildir {cite:rashed-interpolation-1991 abstract}. Bu sunum için makalenin tamamını ya da onun yayımladığı yazmayı okumadık; bu yüzden özetin ardından müstensih adları ya da ekol tarihleri uydurmayız. Meijering, Arapça ve Farsça kaynaklarda, muhtemel Hint etkisiyle birlikte interpolasyon yöntemlerinin varlığını gösterir; bütün formüller arasında otomatik bir örtüşme yoktur {cite:meijering-interpolation-2002 II.C}. Yayılış listesi, okunanın kanıtlamadığı duraklardan yoksun kalır; çünkü olası bir aktarım, grafikte belgelenmiş bir bağımlılık kenarı değildir.

## Üzerine kurulduğu şey

Çalışma, yayı ve sinüsünü bilmeye, dairenin ve tablonun bölünmesine, altmışlık hesaba ve satırlar arasındaki farklara dayanır; yazar bir birin seçimini ve onu altmış yarıçaplı bir seçenekle karşılaştırışını açıklar {cite:qanun-masudi-jundi-v1 scan pp.301,323–324}. Bu seçim Birûnî'yi kesirlerin ya da oranların her kullanımının mucidi yapmaz. Hint öncül, tarihin gerçek bir parçasıdır, süslü bir fon değildir; ancak modern kaynak, her belirli adımı kesinlikle adı geçen bir dönüm noktasına bağlamamıza izin vermez {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. Önceden bir geleneğin var olması ile bilinen bir okura geçmiş bilinen bir nüshanın var olması arasındaki farkı koruruz; ilki tek başına ikincisini kanıtlamaz.

## Üzerine kurulanlar

Sinüslerin ve gölgelerin sunumundan sonra metin, düzeltilmiş çalışmanın bütün tablolara genellenmesini ayırır: saklanan bir değeri ve komşu değerleri alır, öncekini farkların farklılığına göre ayarlar, sonra kesir payını hesaplar {cite:qanun-masudi-jundi-v1 scan pp.339–340}. Bu, kitabın kendi içinde bir üçgen örnekten daha geniş bir işleme geçiştir; hayal edilebilecek her veri için mutlak başarıya dair bir şahitlik değildir. Semev'el'in yöntemleri karşılaştırmasını ise Raşid'in özeti betimler ve ona nisbet edilmiş kalır {cite:rashed-interpolation-1991 abstract}. Çizimi bugünkü her programa ya da uyduya doğrudan bağlamayız ve modern sembollerin benzerliğinin Newton'a giden tarihî bir yolu kanıtladığını da iddia etmeyiz; iki hesabın benzerliği ile bir metnin sahipleri arasında aktarıldığının kanıtı farklı iki meseledir.

## Hayattaki etkisi

Okunan doğrudan etki, tablo kullanıcısına tabloda yer almayan açılarda ve bir değerden açıya dönüşte yardım etmesi ve tek bir oranın neden yetmediğini açıklamasıdır {cite:qanun-masudi-jundi-v1 scan pp.321–324,328–329}. Bu, hesaplayan okur için bir iştir; okunan metin, belirli bir işlemden kaç evin, caminin ya da yolculuğun yararlandığına dair bir istatistik sunmaz. Bu yüzden zaman ya da para tasarrufu ya da bütün önceki tabloların yerine geçmesi hakkında sayılar uydurmayız. Karşılaştırma, önemli bir farkı anlamaya imkân verir: Bir tablo özenle hesaplanmış olabilir, sonra iki satır arasında kullanılırken yaklaşıklık girer. Kitabı hassas diye nitelemek, sonraki her adımın birimi ve varsayımları hakkındaki soruyu ortadan kaldırmaya yetmez.

## Tarihi nasıl değiştirdi

Şahidin değeri, bir hesap varsayımını eleştiri ve gerekçelendirme konusu yapmasındadır; matematik tarihinin tamamını tek bir kahramanın hikâyesiyle değiştirmesinde değildir. Birûnî yalnızca bir işlem vermekle yetinmez, farkların değişkenliğini de gerekçelendirir {cite:qanun-masudi-jundi-v1 scan pp.301–302,323}. Meijering'in tarihi içinde Hint ve Çin başarıları ile Arapça ve Farsça kaynaklar, sonraki Avrupa gelişmelerinden önce yan yana durur {cite:meijering-interpolation-2002 II.B–II.C}. Bu sıralama tek başına, her yazarın kendisinden sonrakilerle bağlantılı olduğuna dair bir delil vermez. Pratik ifadeleri yeniden okumanın önemi, bize tanıdık gelen bir formülü, yalnızca ikisi de farkları kullanıyor diye başka bir formülün üzerine geçirmemizi engellemesidir; bu hem tarihî hem öğretici bir faydadır ve sonuçlarına dair uydurma bir istatistik yoktur.

## Onu gerçekten kim icat etti?

**İlan edilmiş Sünnî çerçevede metin:** Kart, okuduğumuz belirli açıklamayı Birûnî'ye nisbet eder ve tartışmalı bireysel aidiyetini biyografisinin sunduğu gibi korur; böylece hesap bir mezhebî delile dönüşmez {cite:qanun-masudi-jundi-v1 scan pp.321–324} {cite:tdv-biruni-tumer religious-affiliation}. Ona dünyanın ilk ikinci dereceden interpolasyonunu nisbet etmez.

**Akademik okuma:** Önceki Hint yöntemleri Meijering'in araştırmasında sabittir ve Raşid'in özeti Birûnî'de dört yöntemden, bir Hint katkısından ve Semev'el'in karşılaştırmalarından söz eder {cite:meijering-interpolation-2002 II.B–II.C} {cite:rashed-interpolation-1991 abstract}. Muhakkikin mukaddimesinde Newton ve Gregory ile yaptığı karşılaştırma nisbet edilmiş bir yorumlayıcı söz olarak kalır; örtüşme ya da metnin onlara aktarılması hakkında bir hüküm değildir {cite:qanun-masudi-jundi-v1 scan pp.40–42}. Önceliği, yöntemlerin çokluğu ve bu yöntemin ayrıntıları ayrı sorulardır.

## Bugün

Ziyaretçi, teleskop ya da program olmadan kâğıt üzerinde iki yaklaşımı karşılaştırabilir. `t=0` iken işlem ilk değeri korur, `t=1` iken sonrakine ulaşır; iki artış eşitse doğrusal hesaba döner. Bunlar, öğretici formülasyonun cebirsel sonuçlarıdır, Birûnî'nin önümüzde yaptığı bir deney değildir {cite:qanun-masudi-jundi-v1 scan pp.339–340}. Ancak iki tarafın uyuşması, aralarındaki şeyi bildiğimizi garanti etmez ve işlemin her fonksiyon için daha iyi olduğunu kanıtlamaz. Bu, talimatları iyi anlamakla çalışmanın ortaya koymadığı bir sayısal güvence sunmak arasındaki ayrımı yapar. Okuyucu, çok sayıda sayıya hayran olmadan önce hata ve aralık sınırları hakkında soru sorabilir; metni, bağımsız doğrulama gerektiren bir seyir ya da zamanlamada kullanamaz.

## Kalan şahitler

Arapça baskıdan seçilmiş yerleri okuduk ve basılı 300, 321, 322 ve 339'a denk gelen tarama 301, 322, 323 ve 340 görüntülerini inceledik; bütün yeni atıflar taramaya yapılmıştır, dolayısıyla basılı sayfalarla karışmaz {cite:qanun-masudi-jundi-v1 scan pp.301,322–323,340}. Bu, yazmaların karşılaştırması ya da metin çıkarmada bozulmuş kitabın bütün tablolarının okunması değildir.

Gösterilen görsel, 7 Mart 2010 tarihli modern Dabbler çizimidir; açıkça kamu malı olarak sunulmuştur ve 960×720 nüshası incelenmiştir {cite:commons-quadratic-interpolation description,rights,image}. Üç örnekten geçen bir parabolü, bir uç değer işaretini ve altında bir değişim paneli gösterir; kavramsal bir karşılaştırmadır, bu işlemin kendi ağırlıkları değildir ve Birûnî'nin modern bir türevi çizdiğinin delili de değildir {cite:commons-quadratic-interpolation code}. Taramalar ve orijinal dosyalar depo dışında saklanır.

## Kültürde

Bu bölüm, geometrik bir dili ve hesaplayıcı için talimatları bir araya getirir; yazar, karışıklığı önlemek için yaylar ve tümleyenleri için kısa adlar seçer ve tabloyu ayrıntılandırmanın maliyetini de tartışır {cite:qanun-masudi-jundi-v1 scan pp.302,321}. Bu, uygulamalı bilginin bir kitapta sunuluş biçimini gösterir; her tarihî okurun onu aynı şekilde anladığı ya da kullandığı bir ilan değildir. Modern levha mavi, kırmızı ve basılı eksenler kullanır; bu, yazmaya geri götürmediğimiz, sonraki başka bir öğretici dildir {cite:commons-quadratic-interpolation image,code}. İki dili yan yana sunmak, betimleme aralarındaki mesafeyi açıkladığı sürece faydalıdır; bugünkü çizimin zarafeti, incelenmemiş bir tarihî kökenin delili olmaz.

## Küçükler için

Bir kâğıda −1, 0 ve 1 olmak üzere üç yer yaz, altlarına da 1, 2 ve 2.5. İlkinden ortadakine artış 1, ortadakinden sonuncuya artış 0.5. Ortadaki ile sonuncunun yarısı için doğrusal hesap 2.25 verir. İki artışı eşit karıştır, 0.75 elde edersin; sonra yarısını al ve 2'ye ekle; sonuç 2.375. Bu, talimatların sırasını göstermek için seçtiğimiz sayılarla oynanan bir oyundur, eski ölçümler değildir {cite:qanun-masudi-jundi-v1 scan pp.339–340}.

İstenen ortadaki değeri gizle ve bir kazanan seçme; biz onu yalnızca kartlardan bilemeyiz. İki eşit artış dene ve iki işlemin uyuştuğunu gözle. Bir kalem ve kâğıt yeter; güneşi gözlemeye ya da ona dürbün tutmaya gerek yok. Faydalı soru, hangi sayının daha güzel göründüğü değildir; oraya varmak için ne varsaydığımızdır.

## Kaynakça

- [[source/qanun-masudi-jundi-v1|el-Kânûnü'l-Mes'ûdî, birinci cilt]], taramadan seçilmiş okuma ve anılan sayfaların incelenmesi; basılı, tarama numarasından bir öncedir.
- [[source/meijering-interpolation-2002|Meijering, İnterpolasyonun tarihi]], II.B–II.C, yazarın nüshasından fiilî okuma.
- [[source/rashed-interpolation-1991|Raşid, Semev'el, Birûnî ve Brahmagupta]], yalnızca yayıncı özeti; makalenin tamamı değil.
- [[source/britannica-al-biruni|Britannica: Birûnî]] ve [[source/tdv-biruni-tumer|Tümer: Birûnî]], bireysel kimliğin ve nakledilen mezhebî nisbetlerin temeli.
- [[source/commons-quadratic-interpolation|Dabbler çizimi ve hakları]], kamu malına bağışlanmış modern bir karşılaştırma.
- [[source/nallino-albatenii-opus-astronomicum|Nallino'nun tahkikiyle Battânî'nin zîci]], önceki doğrusal kartla karşılaştırmanın sınırları.
