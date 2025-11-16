---
layout: default
title: Derse Giriş ve 5 Büyük Gerçek
nav_order: 1
parent: System Programming
---

# Derse Giriş ve 5 Büyük Gerçek

Bu bölüme, dersin ana temasını ve bir sistem programcısı olarak her zaman aklınızda tutmanız gereken beş temel prensibi ("5 Büyük Gerçek") inceleyerek başlıyoruz.

---

## Dersin Teması: Soyutlama İyidir Ama Gerçekliği Unutma

Bilgisayar bilimleri eğitiminin büyük bir kısmı **soyutlama (abstraction)** üzerine kuruludur. Soyut veri tipleri (abstract data types), asimptotik analiz gibi kavramlar, karmaşık sistemleri daha yönetilebilir parçalara ayırmamızı sağlar. Ancak bu soyutlamaların da sınırları vardır.

Bir programcı olarak, yazdığınız kodun altındaki "gerçekliği" - yani donanımın, derleyicinin ve işletim sisteminin nasıl çalıştığını - anladığınızda çok daha etkili olursunuz. Bu dersin amacı, sizi bu gerçeklikle tanıştırmaktır.

**Bu Yaklaşımın Faydaları:**
*   **Daha Etkili Programcı Olmak:** Kodunuzun gerçekte ne yaptığını anlarsınız.
*   **Hataları Ayıklamak (Debugging):** Özellikle anlaşılması zor, "gizemli" hataların kökenine inebilirsiniz.
*   **Performansı Optimize Etmek:** Kodunuzun neden yavaş çalıştığını anlayıp, darboğazları ortadan kaldırabilirsiniz.
*   **İleri Seviye Sistem Derslerine Hazırlık:** İşletim sistemleri, derleyiciler, bilgisayar mimarisi gibi konular için sağlam bir temel oluşturur.

![Soyutlama Katmanları](https://via.placeholder.com/600x300.png?text=Yazılım+(Soyutlama)+<-->+Donanım+(Gerçeklik))
*Görsel: Yazılım soyutlamaları ile donanım gerçekliği arasındaki ilişki.*

---

## Büyük Gerçek #1: `int` Tamsayı Değildir, `float` Reel Sayı Değildir

Matematikteki tamsayılar sonsuzdur, ancak bilgisayardaki `int` gibi veri tipleri sınırlı sayıda bit ile temsil edilir. Bu da **taşma (overflow)** gibi beklenmedik sonuçlara yol açabilir.

Örneğin, 32-bit bir `int` en fazla `2,147,483,647` değerini tutabilir. Bu sayıyı bir artırdığınızda sonuç `2,147,483,648` olmaz, negatif bir sayıya (`-2,147,483,648`) döner.

Benzer şekilde, `float` ve `double` tipleri, matematikteki reel sayıları temsil etmeye çalışır ama bunu sınırlı bir hassasiyetle yaparlar. Bu durum, özellikle finansal veya bilimsel hesaplamalarda küçük **yuvarlama hatalarının (rounding errors)** birikerek büyük sorunlara yol açmasına neden olabilir.

**Örnek:**
`(3.14 + 1e20) - 1e20` ifadesinin sonucu `0.0` olabilirken, `3.14 + (1e20 - 1e20)` ifadesinin sonucu `3.14` olacaktır. Bu, `float` işlemlerinin birleşme (associative) özelliğine sahip olmadığını gösterir.

---

## Büyük Gerçek #2: Assembly Bilmek Zorundasınız

Yüksek seviyeli diller (C, Java, Python) programlamayı kolaylaştırsa da, derleyicinin bu dilleri makine koduna nasıl çevirdiğini anlamak kritik öneme sahiptir. Assembly, makine kodunun insan tarafından okunabilir halidir.

**Assembly Bilmek Neden Önemli?**
*   **Derleyicinin Optimizasyonlarını Anlamak:** Derleyicinin kodunuzu nasıl daha verimli hale getirdiğini (veya getiremediğini) görürsünüz.
*   **Gizemli Hataları Ayıklamak:** Programın beklenmedik şekilde çökmesine neden olan düşük seviye hataları (örn: bellek bozulmaları) anlamanıza yardımcı olur.
*   **Performans Analizi:** Kodunuzdaki performans darboğazlarını tespit etmek için kritik bir araçtır.
*   **Sistemlerin Derinliklerine İnmek:** İşletim sistemi ve derleyici gibi karmaşık sistemlerin nasıl çalıştığını anlamanın tek yolu, makine seviyesindeki işleyişi bilmektir.
*   **Güvenlik:** Kötü amaçlı yazılımları (malware) analiz etmek ve sistemlerdeki güvenlik zafiyetlerini anlamak için assembly bilgisi şarttır.

---

## Büyük Gerçek #3: Bellek Önemlidir (Memory Matters)

Bellek, sonsuz ve hatasız bir kaynak değildir. C ve C++ gibi diller, programcıya bellek üzerinde tam kontrol verir, ancak bu büyük bir sorumluluktur.

**Bellekle İlgili Temel Gerçekler:**
*   **Bellek Hataları Tehlikelidir:** Bir dizinin sınırları dışına yazmak (`buffer overflow`) veya serbest bırakılmış bir bellek alanına erişmeye çalışmak (`dangling pointer`), programın çökmesinden daha kötüsüne, öngörülemez davranışlara ve güvenlik açıklarına yol açabilir.
*   **Hatanın Etkisi Uzakta Ortaya Çıkabilir (Action at a Distance):** Yanlış bir bellek erişimi, hatanın oluştuğu yerden çok uzakta, bambaşka bir veri yapısını bozabilir. Bu, hatanın kaynağını bulmayı son derece zorlaştırır.
*   **Performans Bellek Hiyerarşisine Bağlıdır:** Modern bilgisayarlarda bellek erişimi, işlemci hızına göre çok yavaştır. Bu yüzden **önbellekler (caches)** kullanılır. Verilerinize nasıl eriştiğiniz (örn: bir matrisin satırları veya sütunları boyunca ilerlemek), önbellek performansını ve dolayısıyla programınızın toplam çalışma süresini dramatik şekilde etkileyebilir.

![Bellek Hiyerarşisi](https://via.placeholder.com/500x350.png?text=CPU+<->+L1/L2/L3+Cache+<->+RAM+<->+Disk)
*Görsel: Hız ve kapasiteye göre sıralanmış bellek hiyerarşisi.*

---

## Büyük Gerçek #4: Performans Asimptotik Karmaşıklıktan İbaret Değildir

Algoritma derslerinde, algoritmaları `O(N)` veya `O(N log N)` gibi asimptotik notasyonlarla analiz ederiz. Bu, büyük veriler için algoritmanın ölçeklenmesini anlamak için harikadır. Ancak pratikte, **sabit çarpanlar (constant factors)** da en az o kadar önemlidir.

Aynı asimptotik karmaşıklığa sahip iki kod parçasından biri, diğeri_
nden 10 kat, hatta 100 kat daha yavaş çalışabilir.

**Performansı Etkileyen Faktörler:**
*   **İşlemci Mimarisi:** Komutların nasıl işlendiği, boru hattı (pipeline) yapısı.
*   **Derleyici Optimizasyonları:** Kodun nasıl makine koduna çevrildiği.
*   **Bellek Erişimi Desenleri:** Önbellek dostu (cache-friendly) kod yazmak.
*   **Döngü Yapıları:** Basit bir döngünün sırasını değiştirmek bile performansı katbekat artırabilir.

---

## Büyük Gerçek #5: Bilgisayarlar Program Çalıştırmaktan Fazlasını Yapar

Yazdığımız programlar, izole bir dünyada çalışmaz. Bir işletim sistemi üzerinde çalışır ve dış dünya ile sürekli etkileşim halindedirler.

**Sistemin Diğer Görevleri:**
*   **Girdi/Çıktı (I/O):** Dosyalardan okuma, diske yazma, ağ üzerinden veri alıp gönderme gibi işlemler, programın performansını önemli ölçüde etkiler.
*   **Ağ (Networking):** Programlar, güvenilir olmayan ağlar üzerinden diğer makinelerle iletişim kurar.
*   **Eşzamanlılık (Concurrency):** Modern sistemlerde programlar, birden çok görevi aynı anda (veya öyleymiş gibi) yürütür. Bu, yeni ve karmaşık hata türlerini beraberinde getirir.

Bu etkileşimleri anlamak, sağlam ve verimli sistemler kurmanın temelidir.

---

### Özet ve Değerlendirme

Bu bölümde dersin temel felsefesini ve sistem programlamanın "5 Büyük Gerçeği"ni ele aldık. Bu prensipler, ders boyunca karşılaşacağımız konuları anlamak için bir çerçeve sunmaktadır. Unutmayın, soyutlamalar güçlü araçlardır, ancak altındaki gerçekliği anladığınızda gerçek bir usta olursunuz.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> 32-bit işaretli bir tamsayı (`int`) değişkeninde `2,147,483,647` değeri varken, bu değişkene 1 eklenirse ne olur?</p>
  <div class="quiz-option">A) Değer `2,147,483,648` olur.</div>
  <div class="quiz-option">B) Program bir hata vererek çöker.</div>
  <div class="quiz-option" data-correct="true">C) Değer, `integer overflow` nedeniyle negatif bir sayıya döner.</div>
  <div class="quiz-option">D) Değer değişmez, aynı kalır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Sınırlı bit sayısı nedeniyle, pozitif en büyük değere 1 eklendiğinde "taşma" (overflow) olur ve sayı doğrusunun en negatif ucuna döner. Bu, "Int'ler Tamsayı Değildir" gerçeğinin klasik bir örneğidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir programcı, yazdığı C kodunun belirli bir bölümünün neden çok yavaş çalıştığını anlamak istiyor. Hangi araca veya bilgiye başvurması en aydınlatıcı olur?</p>
  <div class="quiz-option">A) Kodun asimptotik karmaşıklığını (`Big-O`) hesaplamak.</div>
  <div class="quiz-option" data-correct="true">B) Derleyicinin ürettiği Assembly kodunu incelemek.</div>
  <div class="quiz-option">C) Daha yüksek seviyeli bir dil olan Python'da aynı kodu yazmak.</div>
  <div class="quiz-option">D) Programın kullandığı kütüphanelerin dokümantasyonunu okumak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Assembly kodunu incelemek, derleyicinin kodu nasıl optimize ettiğini, bellek erişimlerinin nasıl yapıldığını ve işlemcinin komutları nasıl yürüttüğünü en net şekilde gösterir. Bu, "Assembly Bilmek Zorundasınız" ve "Performans Asimptotik Karmaşıklıktan İbaret Değildir" gerçekleriyle doğrudan ilgilidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir matris üzerinde işlem yapan iki farklı döngü yazılıyor. İkisi de aynı sayıda ve türde matematiksel işlem yapmasına rağmen, birisi diğerinden 10 kat daha hızlı çalışıyor. Bu durumun en olası açıklaması nedir?</p>
  <div class="quiz-option">A) Hızlı olan döngü daha az değişken kullanıyordur.</div>
  <div class="quiz-option">B) Yavaş olan döngüde bir `integer overflow` meydana geliyordur.</div>
  <div class="quiz-option">C) İşletim sistemi, hızlı olan döngüye daha fazla öncelik tanımıştır.</div>
  <div class="quiz-option" data-correct="true">D) Hızlı olan döngü, bellek erişimlerini önbellek (cache) ile daha uyumlu yapıyordur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Modern sistemlerde işlemci hızı ile bellek hızı arasında büyük bir fark vardır. Belleğe sıralı ve öngörülebilir şekilde erişen kod, verileri önbellekte (cache) tutarak işlemciyi daha az bekletir ve çok daha hızlı çalışır. Bu, "Bellek Önemlidir" gerçeğinin en somut örneklerinden biridir.</p>
  </div>
</div>
