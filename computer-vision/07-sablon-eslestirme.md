---
layout: default
title: Şablon Eşleştirme (Template Matching)
nav_order: 7
parent: Computer Vision
---

# Şablon Eşleştirme (Template Matching)

Filtrelemeyi sadece gürültü azaltma veya bulanıklaştırma için değil, aynı zamanda bir görüntü içinde belirli bir deseni veya "şablonu" bulmak için de kullanabiliriz. Bu tekniğe **Template Matching (Şablon Eşleştirme)** denir ve temelinde **korelasyon** operasyonu yatar.

---

## 1. Temel Fikir: Şablonu Görüntü Üzerinde Kaydırmak

Elimizde iki görüntü olduğunu varsayalım:
1.  **Scene (Sahne):** İçinde arama yapacağımız büyük görüntü.
2.  **Template (Şablon):** Aradığımız nesneyi içeren küçük görüntü (örneğin, bir "göz" resmi).

Amaç, şablonu bir **filtre kerneli** gibi kullanarak sahne görüntüsü üzerinde piksel piksel kaydırmak ve her konumda bir **benzerlik skoru** hesaplamaktır. En yüksek benzerlik skorunu veren konum, şablonun sahnede bulunduğu en olası yerdir.

<pre>
Adım 1: Şablonu (T) Sahne (S) üzerinde bir konuma getir.
  T: [[5,6],   S: [[<b>1,2</b>,3,4],
      [7,8]]      [<b>5,6</b>,7,8],
                   [9,1,2,3]]

Adım 2: O konum için bir benzerlik skoru hesapla (örn: Korelasyon).

Adım 3: Tüm konumlar için 2. adımı tekrarla ve bir "Benzerlik Haritası" oluştur.
  Harita: [[Skor(0,0), Skor(0,1), ...],
           [Skor(1,0), Skor(1,1), ...]]

Adım 4: Haritadaki en yüksek (en parlak) noktanın konumunu bul.
  Bu konum, en iyi eşleşmeyi verir.
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Şablon eşleştirme (template matching) tekniğinde "şablon" (template), filtreleme terminolojisindeki hangi kavrama karşılık gelir?</p>
  <div class="quiz-option">A) Gürültü</div>
  <div class="quiz-option">B) Görüntünün kendisi</div>
  <div class="quiz-option" data-correct="true">C) Kernel (Filtre)</div>
  <div class="quiz-option">D) Piksel</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Şablon eşleştirmede, aradığımız deseni içeren küçük şablon görüntüsü, büyük sahne görüntüsü üzerinde kaydırılan bir filtre (kernel) olarak işlev görür.</p>
  </div>
</div>

---

## 2. Benzerlik Ölçütü: Normalized Cross-Correlation (NCC)

Basit bir korelasyon, görüntüdeki parlaklık değişimlerinden çok etkilenir. Örneğin, sahnenin bir kısmı daha aydınlık, bir kısmı daha karanlıksa, bu durum benzerlik skorunu yanıltabilir.

Bu sorunu çözmek için **Normalized Cross-Correlation (NCC)** kullanılır. NCC, karşılaştırma yapmadan önce hem şablonun hem de altındaki sahne bölgesinin piksel değerlerini "normalize eder" (yani ortalamasını sıfır, standart sapmasını bir yapar). Bu, işlemi parlaklık ve kontrasttaki genel değişikliklere karşı dayanıklı hale getirir. Sanki her iki pencere de kendi içinde "standart" bir aydınlatmadaymış gibi karşılaştırılır.

Sonuç, `-1` (tamamen zıt) ile `+1` (tamamen aynı) arasında bir benzerlik skoru olur.

<div class="quiz-question">
  <p><b>Soru:</b> Template matching sırasında basit korelasyon yerine Normalized Cross-Correlation (NCC) kullanılmasının ana nedeni nedir?</p>
  <div class="quiz-option" data-correct="true">A) Görüntüdeki parlaklık ve kontrast değişikliklerine karşı daha dayanıklı olmak.</div>
  <div class="quiz-option">B) Hesaplamanın daha hızlı olması.</div>
  <div class="quiz-option">C) Nesnenin döndürülmüş hallerini de bulabilmek.</div>
  <div class="quiz-option">D) Gürültüyü daha iyi temizlemek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> NCC, hem şablonu hem de altındaki görüntü bölgesini normalize ederek, aydınlatma koşullarındaki farklılıklardan kaynaklanan genel parlaklık ve kontrast değişikliklerini ortadan kaldırır. Bu, eşleşmenin sadece desenlerin yapısal benzerliğine dayanmasını sağlar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir şablon ile bir görüntü bölgesi arasında NCC skoru `-1` olarak hesaplanırsa, bu ne anlama gelir?</p>
  <div class="quiz-option">A) İki bölge arasında hiçbir ilişki yoktur.</div>
  <div class="quiz-option">B) İki bölge tamamen aynıdır.</div>
  <div class="quiz-option">C) Şablon görüntüden daha büyüktür.</div>
  <div class="quiz-option" data-correct="true">D) İki bölge birbirinin negatifidir (örneğin, siyah-beyaz bir desende renkler tamamen terstir).</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> NCC skorunun `+1` olması mükemmel eşleşmeyi, `0` olması ilişkisizliği, `-1` olması ise mükemmel anti-korelasyonu (birbirinin tersi olma durumunu) gösterir.</p>
  </div>
</div>

---

## 3. Şablon Eşleştirmenin Sınırlılıkları

NCC tabanlı şablon eşleştirme, basit ve etkili olmasına rağmen, aranan nesnenin görünümü değiştiğinde kolayca başarısız olur:

*   **Ölçek (Scale):** Sahnedeki nesne, şablondakinden daha büyük veya daha küçükse eşleşme skoru düşer.
*   **Dönme (Rotation):** Sahnedeki nesne, şablona göre farklı bir açıyla duruyorsa eşleşme başarısız olur.
*   **Bakış Açısı (Viewpoint):** Nesnenin 3D yapısı nedeniyle farklı bir bakış açısından çekilmiş görüntüsü, şablonla eşleşmez. (Örn: Bir arabanın önden ve yandan görünüşü).
*   **Deformasyon:** Esnek veya hareketli nesneler (örn: yürüyen bir insan) şablonla birebir aynı olmaz.
*   **Aydınlatma:** NCC genel parlaklık değişimlerine karşı dayanıklı olsa da, güçlü gölgeler gibi karmaşık aydınlatma değişiklikleri performansı düşürebilir.

Bu sınırlılıklardan dolayı, basit şablon eşleştirme en iyi, aranan nesnenin boyutu, açısı ve görünümünün çok az değiştiği kontrollü ortamlarda (örneğin, bir üretim bandındaki parçaları bulmak) çalışır.

<div class="quiz-question">
  <p><b>Soru:</b> Aşağıdaki senaryolardan hangisinde basit şablon eşleştirme tekniğinin **başarısız olma ihtimali en yüksektir**?</p>
  <div class="quiz-option">A) Bir üretim bandında, kameraya hep aynı uzaklıkta ve açıda gelen bir vidayı bulmak.</div>
  <div class="quiz-option">B) Taranmış bir belgede, belirli bir şirket logosunu bulmak.</div>
  <div class="quiz-option" data-correct="true">C) Bir güvenlik kamerası görüntüsünde, kameraya doğru yürüyen (sürekli büyüyen) bir insan yüzünü bulmak.</div>
  <div class="quiz-option">D) Bir uydu fotoğrafında, hep aynı yöne bakan standart bir "dur" işaretini bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Kameraya doğru yürüyen bir insanın yüzü, görüntüde sürekli olarak büyüyecektir. Basit şablon eşleştirme, bu tür ölçek değişikliklerine karşı dayanıklı olmadığı için, sabit boyutlu bir yüz şablonu ile bu kişiyi güvenilir bir şekilde takip edemez.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Dikey bir "kalem" görüntüsünü şablon olarak kullanarak, yatay duran bir kalemi içeren bir sahnede arama yaparsak ne olur?</p>
  <div class="quiz-option" data-correct="true">A) Şablon eşleştirme, Rotation (dönme) sınırlılığı nedeniyle muhtemelen kalemi bulamaz.</div>
  <div class="quiz-option">B) NCC, dönmeyi otomatik olarak telafi eder ve kalemi bulur.</div>
  <div class="quiz-option">C) Sistem, kalemin sadece bir kısmıyla eşleşir.</div>
  <div class="quiz-option">D) Sistem, görüntüdeki tüm dikey nesneleri kalem olarak işaretler.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Standart şablon eşleştirme, piksellerin yapısal düzenine çok duyarlıdır. Şablon 90 derece döndürüldüğünde, piksel desenleri tamamen değişir ve NCC skoru çok düşük çıkar, bu yüzden eşleşme bulunamaz.</p>
  </div>
</div>

---

