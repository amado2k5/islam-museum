"""Sura names (Arabic, English transliteration) and ayah counts. Names are museum labels, not Qur'an text; verify against Tanzil's metadata."""
NAMES = [
("الفاتحة","Al-Fatiha"),("البقرة","Al-Baqara"),("آل عمران","Al Imran"),("النساء","An-Nisa"),("المائدة","Al-Ma'ida"),("الأنعام","Al-An'am"),("الأعراف","Al-A'raf"),("الأنفال","Al-Anfal"),("التوبة","At-Tawba"),("يونس","Yunus"),
("هود","Hud"),("يوسف","Yusuf"),("الرعد","Ar-Ra'd"),("إبراهيم","Ibrahim"),("الحجر","Al-Hijr"),("النحل","An-Nahl"),("الإسراء","Al-Isra"),("الكهف","Al-Kahf"),("مريم","Maryam"),("طه","Ta-Ha"),
("الأنبياء","Al-Anbiya"),("الحج","Al-Hajj"),("المؤمنون","Al-Mu'minun"),("النور","An-Nur"),("الفرقان","Al-Furqan"),("الشعراء","Ash-Shu'ara"),("النمل","An-Naml"),("القصص","Al-Qasas"),("العنكبوت","Al-Ankabut"),("الروم","Ar-Rum"),
("لقمان","Luqman"),("السجدة","As-Sajda"),("الأحزاب","Al-Ahzab"),("سبأ","Saba"),("فاطر","Fatir"),("يس","Ya-Sin"),("الصافات","As-Saffat"),("ص","Sad"),("الزمر","Az-Zumar"),("غافر","Ghafir"),
("فصلت","Fussilat"),("الشورى","Ash-Shura"),("الزخرف","Az-Zukhruf"),("الدخان","Ad-Dukhan"),("الجاثية","Al-Jathiya"),("الأحقاف","Al-Ahqaf"),("محمد","Muhammad"),("الفتح","Al-Fath"),("الحجرات","Al-Hujurat"),("ق","Qaf"),
("الذاريات","Adh-Dhariyat"),("الطور","At-Tur"),("النجم","An-Najm"),("القمر","Al-Qamar"),("الرحمن","Ar-Rahman"),("الواقعة","Al-Waqi'a"),("الحديد","Al-Hadid"),("المجادلة","Al-Mujadila"),("الحشر","Al-Hashr"),("الممتحنة","Al-Mumtahana"),
("الصف","As-Saff"),("الجمعة","Al-Jumu'a"),("المنافقون","Al-Munafiqun"),("التغابن","At-Taghabun"),("الطلاق","At-Talaq"),("التحريم","At-Tahrim"),("الملك","Al-Mulk"),("القلم","Al-Qalam"),("الحاقة","Al-Haqqa"),("المعارج","Al-Ma'arij"),
("نوح","Nuh"),("الجن","Al-Jinn"),("المزمل","Al-Muzzammil"),("المدثر","Al-Muddaththir"),("القيامة","Al-Qiyama"),("الإنسان","Al-Insan"),("المرسلات","Al-Mursalat"),("النبأ","An-Naba"),("النازعات","An-Nazi'at"),("عبس","Abasa"),
("التكوير","At-Takwir"),("الانفطار","Al-Infitar"),("المطففين","Al-Mutaffifin"),("الانشقاق","Al-Inshiqaq"),("البروج","Al-Buruj"),("الطارق","At-Tariq"),("الأعلى","Al-A'la"),("الغاشية","Al-Ghashiya"),("الفجر","Al-Fajr"),("البلد","Al-Balad"),
("الشمس","Ash-Shams"),("الليل","Al-Layl"),("الضحى","Ad-Duha"),("الشرح","Ash-Sharh"),("التين","At-Tin"),("العلق","Al-Alaq"),("القدر","Al-Qadr"),("البينة","Al-Bayyina"),("الزلزلة","Az-Zalzala"),("العاديات","Al-Adiyat"),
("القارعة","Al-Qari'a"),("التكاثر","At-Takathur"),("العصر","Al-Asr"),("الهمزة","Al-Humaza"),("الفيل","Al-Fil"),("قريش","Quraysh"),("الماعون","Al-Ma'un"),("الكوثر","Al-Kawthar"),("الكافرون","Al-Kafirun"),("النصر","An-Nasr"),
("المسد","Al-Masad"),("الإخلاص","Al-Ikhlas"),("الفلق","Al-Falaq"),("الناس","An-Nas"),
]
AYAT = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,
        34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,
        30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]
assert len(NAMES) == 114 and len(AYAT) == 114 and sum(AYAT) == 6236
