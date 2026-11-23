---
id: invention/ibn-yunus-solar-time-tables
lang: id
source_lang: ar
translators: ['Microsoft Translator (Translate Document in Word for Mac, 2026-11-22), draft translation']
status: {review: published}
provenance: {generated_by: 'scripts/local-mt/import_gt.py (turkish-indonesian lane, Word for Mac Translate Document)', model: microsoft-translator, run: word-docs-id-2026-11-22, source: content/ar/invention/ibn-yunus-solar-time-tables.md}
---

## Ringkasan

Tidak cukup hanya dengan ketinggian matahari saja untuk mengatakan berapa hari telah berlalu; jawabannya bervariasi tergantung tempat dan musim. [[person/ali-ibn-yunus-al-munajjim|Ibn Yunus al-Sudafi]] dikaitkan dengan warisan Kairo berupa tabel bola yang menghitung waktu dan azimut ketinggian serta posisi matahari sepanjang tahun. David King menggambarkan warisan ini sebagai karya utama Ibn Yunus, tetapi ia menunjukkan bahwa koleksi yang tersisa mencakup tambahan yang tidak semuanya dapat dikaitkan dengannya {cite:ibn-yunus-king-bea timekeeping corpus}.

Kita memberikan kontribusi pada alat perhitungan, bukan penemuan waktu, bandul pertama, atau bandul. Kita tidak membagi tiga kelompok utama menjadi tiga penemuan untuk menambah jumlahnya; ini adalah program yang terhubung untuk membantu menyelesaikan masalah astronomi yang dekat. Lapisan-lapisan komposisi tetap menjadi bagian dari cerita, bukan catatan kaki yang tersembunyi oleh frasa "Semua tabel adalah karya Ibn Yunus."

## Apa itu

Tabel di sini adalah alat dengan dua perantara: kita mencari menggunakan ketinggian matahari dan bujur astronomi, lalu menemukan jumlah seperti waktu dari matahari terbit atau sisanya hingga tengah hari atau bujur langit. Bujur astronomi ditempatkan pada aspek zodiak, bukan bujur geografis pengguna. King menggambarkan tiga kelompok utama, masing-masing melebihi sepuluh ribu entri dalam kelompok sisanya, bukan sepuluh ribu pengamatan pribadi yang terdokumentasi dari Ibn Yunus {cite:ibn-yunus-king-bea main tables}.

"Bola" berarti perhitungan berkaitan dengan geometri langit seperti yang tampak dari posisi di Bumi; segitiga bidang terkait tidak merupakan model yang cukup untuk semua variabel. Mengorganisasi hasil ke dalam tabel mengubah pekerjaan aritmatika yang dibutuhkan pengguna, tetapi tidak menghilangkan pengetahuan media mana yang mereka pilih atau unit mana yang dibaca.

## Dunia ada di hadapannya

Waktu, perhitungan, dan meteorologi sudah ada sebelum Ibn Yunus. King mempresentasikan hubungannya dengan 'Pernikahan Teruji' yang disiapkan oleh Yahya ibn Abi Mansur di Baghdad sekitar dua abad lalu, sementara TDV menggambarkan pembacaannya tentang pernikahan Habash, Al-Battani, Al-Nirizi, dan lainnya. Ini adalah jaringan preseden; tidak ada satu asal yang dapat kita rangkum dalam nama terkenal {cite:ibn-yunus-king-bea Mumtahan discussion} {cite:tdv-ibn-yunus-dizer predecessors}.

Namun tabel observasi atau perhitungan planet tidak semuanya adalah jadwal yang sama. Perbedaan yang dicatat di sini adalah persiapan alat waktu dua mediasi dalam konteks force majeure, bukan hanya memiliki daftar angka atau mengetahui bahwa matahari tampaknya bergerak. Kita tidak menggambar tepi referensi spesifik ke tabel bayangan sebelumnya hanya karena subjek menggunakan matahari.

## Cerita

Tanggal lahirnya tidak diketahui oleh Raja dan Desir, meskipun judul halaman MacTooth 950 tidak memberikan bukti baru tentang hari yang diketahui. Ia tinggal di Fustat dan menyaksikan saat muda masuknya Fatimiyah dan pendirian Kairo pada tahun 969. Al-Aziz dan kemudian Al-Hakim mengawasi pekerjaannya, dan catatan pengamatannya berlanjut hingga tahun 1003, dan ia meninggal pada tahun 1009 {cite:ibn-yunus-king-bea biography}, {cite:tdv-ibn-yunus-dizer biography}, dan {cite:ibn-yunus-mactutor biography}.

Batas waktu yang dibuka pada kartu berakhir dengan tahun kematian hanya untuk kontribusi individu. Ini bukan tanggal pembentukan semua kelompok yang tersisa yang dimasukkan dengan tabel pada abad ke-13 dan ke-14. Kami tidak mengubah tanggal kematian sebelumnya dalam catatan orang tersebut atau mengonversi tahun edisi atau salinan berikutnya ke tahun tabel disusun.

## Sang penemu dan para inovator

Terjemahan O'Connor dan Robertson atas Ibn Yunus dikenal dengan namanya sebagai matematikawan Islam; ini adalah dasar individu yang tercatat untuk identitas Muslimnya. Adapun Sunni, ia adalah kerangka museum yang terpisah, bukan inferensi dari keluarga, nama, atau sekte pribadi para pelindung Fatimiyahnya. Kami tidak menjadikan patronase politik sebagai kesaksian doktrin seorang ulama tertentu {cite:ibn-yunus-mactutor summary} {cite:tdv-ibn-yunus-dizer biography}.

Perannya di sini adalah sebagai peningkat dan kontributor. TDV mencatat bahwa beberapa tabel berikutnya disiapkan oleh Al-Muqassi, sementara King menyatakan kesulitan dalam menentukan jumlah tabel yang dihitung oleh Ibn Yunus. Oleh karena itu, kami tidak mengaitkan setiap penyalin atau host kepadanya, juga tidak menetapkan tebakan memiliki dua asisten kalkulator kepada tim yang dikenal dengan nama dan tugas {cite:tdv-ibn-yunus-dizer work1}, {cite:ibn-yunus-king-bea timekeeping corpus}, {cite:ibn-yunus-mactutor support discussion}.

## Cara kerjanya

Kami menjelaskan gagasan ini dengan model modern, bukan dengan cara yang diturunkan oleh penulis dengan simbol ini. Kami menyebut posisi lintang phi, yaitu inklinasi delta matahari, elevasinya h, dan jarak sudutnya dari gerhana H. Relasi bola dalam model kami adalah `sin(h)=sin(phi)sin(delta)+cos(phi)cos(delta)cos(H)`. Kita tidak boleh mencampuradukkan lintang geografis dengan inklinasi matahari atau ketinggiannya di atas cakrawala.

Mari kita pilih lintang 30 derajat, yang sesuai dengan nilai historis yang disebutkan King untuk warisan, tetapi kita memilih nol miring matahari untuk pendidikan. Dalam contoh ekuinoks yang disederhanakan ini, ia menjadi `cos(H)=sin(h)/cos(30°)`. Kita mengasumsikan horizon ideal dan mengecualikan pembiasan atmosfer serta ukuran cakram matahari; ini bukan instruksi observasi atau waktu siap pakai {cite:ibn-yunus-king-bea corpus parameters}.

Pada cabang pagi, ketika H sama dengan 30 derajat, kita mendapatkan `cos(H)=1/sqrt(3)`, dari mana H sekitar 54,736 derajat. Rotasi 15 derajat setara dengan jam matahari yang sama dalam model, menyisakan sekitar 3.649 jam hingga tengah hari. Dan karena siang dalam contoh ekuinoks kita adalah enam jam, sekitar 2.351 jam telah berlalu sejak matahari terbit. Semua nilai ini dikonfirmasi oleh hadits, bukan oleh digit yang kita baca dari manuskrip.

Pada ketinggian 45 derajat, menjadi `cos(H)=sqrt(2/3)`, menyisakan sekitar 2.351 jam hingga tengah hari dan sekitar 3.649 jam. Pada tengah hari, suhu nol dan elevasi 60 derajat, bukan 90. Contoh ini menunjukkan efek lintang situs; persamaan ini tidak sama dengan elevasi dalam jumlah jam, juga tidak menempatkan matahari di atas kepala setiap orang pada tengah hari.

Ketinggian yang sama dapat terjadi di pagi atau sore; cabang harus ditentukan sebelum memilih jawaban. Jika kemiringan matahari berubah, jam dan batas ketinggian berubah bahkan di lokasi yang sama. Saat beralih ke waktu sipil, kita membutuhkan kesepakatan lain, seperti zona waktu dan perbedaan antara waktu surya tampak dan rata-rata; jadwal pendidikan kita tidak diam-diam membawa konversi ini.

McCutter mengatakan akurasi tabel membuat King lebih memilih interpolasi nonlinier. Ini adalah inferensi dari sebuah studi terbaru, bukan bukti bahwa kita telah mengingat algoritma Ibn Yunus. Kita tidak membaca makalah asli King tahun 1973 atau grid manuskrip, jadi kita tidak memilih aturan interpolasi dan menyatakan itu metodenya {cite:ibn-yunus-mactutor solar-time-table discussion}.

## Distribusi

King menyebutkan penggunaan warisan Kairo hingga abad kesembilan belas dan pengaruhnya terhadap tabel Abu al-Uqul untuk Taiz dan tabel Al-Khalili untuk Damaskus. Ini adalah catatan seorang sejarawan khusus, bukan hasil sensus independen dari setiap salinan atau pengguna yang kami lakukan. Perlu dibedakan antara kelanjutan tradisi matematika dan keberlanjutan setiap sel sebagaimana adanya {cite:ibn-yunus-king-bea corpus reception}.

Naskah berbeda dalam susunan tabel dan pemilihan koleksi dari naskah. Perbedaan urutan tidak berarti setiap salinan adalah komposisi baru, juga tidak berarti bahwa semua bagian dimiliki oleh penulis asli. Oleh karena itu, peta distribusi di sini tetap deskriptif dan tidak menciptakan batas kausal yang menentukan untuk setiap kota yang disebutkan dalam studi.

## Apa yang dibangun di atasnya

Karya ini mengasumsikan pengetahuan tentang kuantitas bola dan penentuan waktu serta posisi, selain tabel dan parameter. King of Heritage menyebutkan lebar Kairo sebagai 30 derajat dan inklinasi zodiak sebagai 23 derajat dan 35 menit. Kami mencatatnya sebagai nilai studi sejarah, bukan koordinat modern, yang kami rekomendasikan diterapkan di setiap lingkungan kota {cite:ibn-yunus-king-bea corpus parameters}.

Kemiringan zodiak bukanlah kemiringan matahari itu sendiri setiap hari; yang pertama adalah tonggak yang terkait dengan batas gerakan kedua sepanjang tahun. Pilihan kami terhadap delta nol tidak berarti bahwa kemiringan, 23 derajat dan 35 menit, telah hilang dari sejarah; melainkan, kami memilih kasus khusus untuk menyederhanakan gagasan ini. Kejelasan pilihan-pilihan ini lebih penting daripada mencetak banyak angka yang tidak jelas.

## Apa yang dibangun di atasnya

King menyajikan tabel lain dengan fungsi bola, beberapa terkait dengan waktu lima doa harian. TDV menunjukkan bahwa gelar "Manfaat Utama" kemudian diberikan kepada koleksi yang mencakup tabel oleh Ibn Yunus dan lainnya. Kami mencatat [[work/cairo-solar-time-corpus|warisan sebagai koleksi berlapis]], bukan satu buku tunggal, sepenuhnya dalam aksara {cite:ibn-yunus-king-bea subsidiary tables} {cite:tdv-ibn-yunus-dizer work1}.

Zimmer yang berkuasa lebih luas dalam pengamatan, planet, kalender, dan tabel bulan yang dikaitkan dengannya, yang McTotter sebutkan melebihi 34.000 entri subjek lain dengan rasio tertentu yang memerlukan reservasi. Kami tidak mentransfer jumlah mereka ke jadwal, juga tidak menggunakan perbedaan fungsional sebagai justifikasi untuk memecah satu contoh menjadi nomor penemuan berulang {cite:ibn-yunus-mactutor lunar-table discussion}.

## Dampak pada kehidupan

Studi menjelaskan hubungan antara waktu astronomi dan kebutuhan harian serta keagamaan dalam masyarakat. Namun, penyajian ini bukan soal mengeluarkan waktu doa atau putusan yurisprudensi; yang kami sediakan adalah tanggal alat perhitungan dan syaratnya, bukan pengganti kalender yang disetujui. Sumber sastra juga tidak menyediakan statistik tentang jumlah orang yang menggunakan setiap kelompok atau jumlah waktu yang dihemat oleh {cite:ibn-yunus-king-bea timekeeping corpus} {cite:tdv-ibn-yunus-dizer timekeeping discussion}.

Manfaat pendidikan saat ini terletak pada bagaimana sebuah masalah bergerak dari menggambar langit ke dua mediator lalu ke jawaban numerik. Kelimpahan angka tidak menghilangkan kebutuhan untuk menafsirkannya: Apakah waktu dari matahari terbit atau hingga akhir? Dan apakah nilai positif yang dimaksud ada pada cabang tertentu? Kesalahan pada judul kolom dapat merusak penggunaan tabel bilangan bulat.

## Bagaimana sejarah berubah

Koleksi ini mengungkapkan upaya untuk mengubah masalah bola yang kompleks menjadi alat yang dapat digunakan kembali. King memberikan deskripsi ratusan halaman dan kumpulan nilai yang sangat besar, dengan keraguan terhadap proporsi setiap bagian. Kami tidak mengubah ukuran angka yang sangat besar menjadi bukti hilangnya komputer atau metode aljabar yang tidak disebutkan dalam sumber {cite:ibn-yunus-king-bea corpus scale and authorship}.

Kontribusi ini berbeda dari klaim bahwa ia menciptakan bandul untuk mengukur waktu. MacCutter menyangkal bukti penggunaannya dan menelusuri kisah King tentang legenda ini ke cerita Eropa yang lebih baru. Cerita berbentuk tabel sudah cukup untuk memperkirakan karya tersebut; Anda tidak perlu menambahkan perangkat yang belum terbukti untuk terlihat penting {cite:ibn-yunus-mactutor pendulum discussion}.

## Siapa sebenarnya yang menemukannya?

Lebih tepatnya, pernyataan "kontribusi Ibn Yunus terhadap warisan Kairo" bukanlah "semua tabel Kairo adalah ciptaannya." Hubungan ini kuat dalam studi tertulis, tetapi kepemilikan rinci beberapa tabel tidak pasti, dan penambahan selanjutnya diketahui. Sejujurnya, perbedaan ini tidak mengurangi kontribusi; hal ini mencegah mengambil karya generasi dan mengaitkannya dengan satu orang {cite:ibn-yunus-king-bea timekeeping authorship} {cite:tdv-ibn-yunus-dizer work1}.

Kami tidak mengklaim prioritas universal dalam setiap perhitungan waktu. Yang membedakan kartu adalah materi spesifik, perhitungan yang ditentukan, dan bukti yang dinyatakan, bukan penggunaan matahari atau waktu untuk pertama kalinya. Bahkan kata "instrumen" di sini berarti organisasi numerik, bukan perangkat fisik yang tersisa di kotak tampilan.

## Saat ini

Program modern memberikan waktu dan azimut dengan cepat, tetapi hal ini tidak membuktikan hubungan langsung mereka dengan warisan ini atau kecocokan definisi waktu di antara mereka. Contoh modern memungkinkan pemahaman input dan kondisinya sebelum melihat layar. Kita tidak menghitung jejak pembiasan, cakrawala nyata, atau zona waktu, lalu menyembunyikan perbedaan tersebut dari pembaca.

Gambar ini adalah segitiga datar siku-siku modern yang disiapkan oleh TheOtherJesse dan dirilis ke domain publik pada tahun 2007. Gambar ini berfungsi untuk mengingatkan pengunjung tentang makna sisi dan sudut, tetapi tidak mewakili seluruh segitiga bola, maupun halaman dari tabel Ibn Yunus, maupun gambar observatorium yang lengkap {cite:commons-trigonometry-triangle Description and licensing}.

## Bukti yang tersisa

King merujuk pada dua salinan warisan penting di Dublin dan Kairo, dengan banyak bukti pilihan dan susunan yang berbeda-beda. Ini bukan fragmen dari Zig yang berkuasa di Leiden, Oxford, dan Paris. Menamai brankas pelestarian tidak berarti kita membuka naskah mereka atau membandingkan nomor baris {cite:ibn-yunus-king-bea corpus manuscripts and Hakimi fragments}.

Manuskrip atau studi waktu asli yang diterbitkan pada tahun 1973 belum dibaca di sini. Sumber yang diketahui adalah terjemahan ilmiah King, pengantar Deeser, dan terjemahan McCutter, yang telah dibaca sepenuhnya. Kami tidak mengaitkan museum dengan pemeriksaan langsung yang tidak terjadi, juga tidak menggunakan keberadaan salinan yang lebih baru untuk menentukan tanggal semua lapisan koleksi.

## Dalam budaya

Sumber-sumber menceritakan berita tentang pengembaraannya, astrologinya, dan kisah kematian yang diramalkan. Laporan-laporan ini tetap dikaitkan dengan penulisnya, bukan sebagai diagnosis kepribadiannya atau bukti keakuratan astrologi. Begitu pula perhatian penerusnya tidak menilai doktrin pribadi sang sarjana atau akurasi semua hasilnya {cite:ibn-yunus-king-bea biographical anecdotes} {cite:tdv-ibn-yunus-dizer biography}.

King dan Deezer memperingatkan terhadap citra umum dari "observatorium yang lengkap"; mendeskripsikan mesin dan mengamati lokasi tidak cukup untuk mendukung kesaksian tersebut. Kami menceritakan sejarah perhitungan tanpa membangun observatorium fiksi di sekitarnya atau memotret mesin yang tidak kami ketahui hanya karena kebutuhan teoretis {cite:ibn-yunus-king-bea observatory caution} {cite:tdv-ibn-yunus-dizer instruments}.

## Untuk si kecil

Bayangkan dua kartu yang mengajukan dua pertanyaan berbeda: "Sudah berapa lama sejak matahari terbit?" dan "Berapa lama lagi sampai tengah hari?" Dalam contoh hari 12 jam, kita menambahkan dua jawaban tersebut ke 6 jam di pagi hari. Kita tidak mengurangi satu dari 24 jam atau membandingkannya langsung dengan jam telepon, karena makna dan referensinya berbeda.

Baca nama setiap kolom sebelum angka, dan tanyakan apakah model tersebut untuk hari dan tempat tertentu atau untuk setiap tempat. Tidak perlu mengetahui waktu dengan melihat matahari atau menguji mata; contoh kertas sudah cukup. Sumber memuat apa yang kita ketahui tentang tabel; nomor sekolah tidak memiliki tanggal kuno hanya karena ditulis dengan tulisan tangan yang indah.

## Referensi

- {cite:ibn-yunus-king-bea complete biography and selected references}
- {cite:tdv-ibn-yunus-dizer main entry and bibliography}
- {cite:ibn-yunus-mactutor complete biography}
- {cite:commons-trigonometry-triangle Description and licensing}
