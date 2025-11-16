---
layout: default
title: Şablon Eşleştirme (Template Matching)
nav_order: 7
parent: Computer Vision
---

# Şablon Eşleştirme (Template Matching)

Filtrelemeyi sadece gürültü azaltma veya bulanıklaştırma için değil, aynı zamanda bir görüntü içinde belirli bir deseni veya şablonu bulmak için de kullanabiliriz. Bu tekniğe **Şablon Eşleştirme (Template Matching)** denir ve temelinde **korelasyon** operasyonu yatar.

---

## 1. Temel Fikir

Elimizde iki görüntü olduğunu varsayalım:
1.  **Sahne (Scene):** İçinde arama yapacağımız büyük görüntü.
2.  **Şablon (Template):** Aradığımız nesneyi içeren küçük görüntü (örneğin, Waldo'nun yüzü).

Amaç, şablonun sahne görüntüsü içindeki konumunu bulmaktır.

Bunu yapmak için, şablonu bir **filtre kerneli** olarak kullanırız. Şablonu, sahne görüntüsü üzerinde piksel piksel kaydırırız ve her konumda, şablon ile altındaki sahne bölgesi arasında bir **benzerlik skoru** hesaplarız. En yüksek benzerlik skorunu veren konum, şablonun sahnede bulunduğu en olası yerdir.

![Template Matching](https://via.placeholder.com/700x300.png?text=Şablon+->+Sahne+Üzerinde+Kaydırılır+->+Benzerlik+Haritası)
*Görsel: Şablon (template), sahne görüntüsü üzerinde kaydırılarak her konum için bir benzerlik skoru hesaplanır. Bu skorların oluşturduğu haritada en parlak nokta, en iyi eşleşmeyi gösterir.*

---

## 2. Benzerlik Ölçütü: Normalize Edilmiş Çapraz Korelasyon (NCC)

Basit bir korelasyon (piksellerin çarpımlarının toplamı), görüntüdeki parlaklık değişimlerinden çok etkilenir. Örneğin, sahnenin bir kısmı daha aydınlık, bir kısmı daha karanlıksa, bu durum benzerlik skorunu yanıltabilir.

Bu sorunu çözmek için **Normalize Edilmiş Çapraz Korelasyon (Normalized Cross-Correlation - NCC)** kullanılır. NCC, hem şablonun hem de altındaki sahne bölgesinin piksel değerlerini, kendi ortalamalarını çıkarıp standart sapmalarına bölerek normalize eder. Bu, işlemin parlaklık ve kontrasttaki genel değişikliklere karşı dayanıklı olmasını sağlar.

Sonuç, `-1` (tamamen zıt) ile `+1` (tamamen aynı) arasında bir benzerlik skoru olur.

---

## 3. Şablon Eşleştirmenin Sınırlılıkları

NCC tabanlı şablon eşleştirme, basit ve etkili bir yöntem olmasına rağmen, bazı önemli sınırlılıklara sahiptir:

*   **Ölçek Değişimi:** Eğer sahnedeki nesne, şablondakinden daha büyük veya daha küçükse, eşleşme skoru düşük olur.
*   **Dönme (Rotation):** Eğer sahnedeki nesne, şablona göre dönmüş bir açıyla duruyorsa, eşleşme başarısız olur.
*   **Bakış Açısı Değişimi:** Nesnenin 3D yapısı nedeniyle farklı bir bakış açısından çekilmiş görüntüsü, şablonla eşleşmez.
*   **Aydınlatma:** NCC, genel parlaklık değişimlerine karşı dayanıklı olsa da, güçlü gölgeler veya vurgular gibi karmaşık aydınlatma değişiklikleri performansı düşürebilir.

Bu sınırlılıklardan dolayı, basit şablon eşleştirme en iyi, aranan nesnenin boyutu, açısı ve görünümünün çok fazla değişmediği kontrollü ortamlarda çalışır (örneğin, bir üretim bandındaki parçaları bulmak). Daha karmaşık tanıma görevleri için, ileriki konularda göreceğimiz **özellik (feature) tabanlı** yöntemler kullanılır.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Şablon eşleştirme (template matching) sırasında basit korelasyon yerine Normalize Edilmiş Çapraz Korelasyon (NCC) kullanılmasının ana nedeni nedir?</p>
  <div class="quiz-option" data-correct="true">A) Görüntüdeki parlaklık ve kontrast değişikliklerine karşı daha dayanıklı olmak.</div>
  <div class="quiz-option">B) Hesaplamanın daha hızlı olması.</div>
  <div class="quiz-option">C) Nesnenin döndürülmüş hallerini de bulabilmek.</div>
  <div class="quiz-option">D) Gürültüyü daha iyi temizlemek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> NCC, hem şablonu hem de altındaki görüntü bölgesini normalize ederek, aydınlatma koşullarındaki farklılıklardan kaynaklanan genel parlaklık ve kontrast değişikliklerini ortadan kaldırır. Bu, eşleşmenin sadece desenlerin yapısal benzerliğine dayanmasını sağlar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Aşağıdaki senaryolardan hangisinde basit şablon eşleştirme tekniğinin **başarısız olma ihtimali en yüksektir**?</p>
  <div class="quiz-option">A) Bir üretim bandında, kameraya hep aynı uzaklıkta ve açıda gelen bir vidayı bulmak.</div>
  <div class="quiz-option">B) Taranmış bir belgede, belirli bir şirket logosunu bulmak.</div>
  <div class="quiz-option" data-correct="true">C) Bir güvenlik kamerası görüntüsünde, kameraya doğru yürüyen (sürekli büyüyen) bir insan yüzünü bulmak.</div>
  <div class="quiz-option">D) Bir uydu fotoğrafında, hep aynı yöne bakan standart bir "dur" işaretini bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Kameraya doğru yürüyen bir insanın yüzü, görüntüde sürekli olarak büyüyecektir. Basit şablon eşleştirme, bu tür ölçek değişikliklerine karşı dayanıklı olmadığı için, sabit boyutlu bir yüz şablonu ile bu kişiyi güvenilir bir şekilde takip edemez.</p>
  </div>
</div>
