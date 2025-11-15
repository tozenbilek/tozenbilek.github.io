---
layout: default
title: Uygulama Alanları ve Sistem Bileşenleri
parent: 1. Giriş
nav_order: 2
---

# Uygulama Alanları ve Sistem Bileşenleri

Bilgisayarlı Görü, teorik bir alan olmanın ötesinde, günümüz teknolojisini şekillendiren sayısız pratik uygulamaya sahiptir. Bu bölümde, bu uygulamaların ana kategorilerini ve tipik bir Bilgisayarlı Görü sistemini oluşturan temel yapı taşlarını inceleyeceğiz.

## Uygulama Kategorileri

Bilgisayarlı Görü uygulamaları, çözdükleri problemin niteliğine göre genel olarak dört ana kategoriye ayrılabilir:

-   **Algılama ve İzleme (Detection & Tracking):** Belirli nesnelerin veya kişilerin bir görüntüdeki yerini bulma ve hareketlerini video boyunca takip etme.
    -   *Örnekler:* Güvenlik kameralarında kişi takibi, otonom araçlar için araç tespiti, spor analizlerinde oyuncu takibi.
-   **Anlamlandırma ve Sınıflandırma (Recognition & Classification):** Bir görüntünün tamamını veya bir bölgesini önceden tanımlanmış bir kategoriye atama.
    -   *Örnekler:* Bir fotoğrafın "plaj" veya "orman" sahnesi olarak etiketlenmesi, tıbbi görüntülerde tümörlü dokunun sınıflandırılması.
-   **Yeniden Oluşturma ve Ölçüm (Reconstruction & Measurement):** 2D görüntülerden yola çıkarak 3D sahne yapısını veya nesne boyutlarını tahmin etme.
    -   *Örnekler:* Fotogrametri ile 3B arazi modelleri oluşturma, artırılmış gerçeklik (AR) için kamera pozisyonunu belirleme.
-   **Etkileşim ve Denetim (Interaction & Control):** Görsel girdiyi, bir sistemi kontrol etmek veya kullanıcıyla etkileşim kurmak için kullanma.
    -   *Örnekler:* Sanal gerçeklikte el takibi, jestlerle kontrol edilen kullanıcı arayüzleri, robotların engellerden kaçınması.

![Computer Vision Pipeline](https://placehold.co/800x250/EEE/31343C?text=Sensör+->+Önişleme+->+Özellik+Çıkarımı+->+Karar+Verme)
*<center>Tipik bir Bilgisayarlı Görü sisteminin genel akış şeması (pipeline).</center>*

## Tipik Bir Bilgisayarlı Görü Sistemi

Bir Bilgisayarlı Görü uygulaması, genellikle "pipeline" (boru hattı) olarak adlandırılan bir dizi ardışık adımdan oluşur:

1.  **Görüntü Kaynağı (Input):** Verinin elde edildiği sensördür. Bu, standart bir kamera, bir derinlik sensörü (Kinect, LiDAR) veya tıbbi bir görüntüleme cihazı (MR, CT) olabilir.
2.  **Önişleme (Preprocessing):** Ham görüntü verisini, sonraki adımlar için daha uygun hale getirme aşamasıdır.
    -   *İşlemler:* Gürültü azaltma, kontrast iyileştirme, beyaz dengesi ayarı, lens bozulmalarının düzeltilmesi.
3.  **Özellik Çıkarımı (Feature Extraction):** Görüntüdeki ham piksel verisinden, anlamlı ve ayırt edici bilgiler türetme adımıdır.
    -   *Özellikler:* Kenarlar, köşeler, renk histogramları veya derin öğrenme modellerinin ara katman çıktıkları gibi daha karmaşık temsiller olabilir.
4.  **Karar Verme / Yorumlama (Decision / Interpretation):** Çıkarılan özelliklerin, asıl görevi yerine getirmek için kullanıldığı son aşamadır.
    -   *Modeller:* Destek Vektör Makineleri (SVM), Karar Ağaçları veya Derin Sinir Ağları gibi makine öğrenmesi modelleri bu aşamada kullanılır. Çıktı, bir sınıf etiketi ("kedi"), bir konum (sınırlayıcı kutu) veya bir ölçüm olabilir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir cep telefonu kamerasının, bir QR kodunu okuyup içindeki web sitesi linkini açması, hangi ana uygulama kategorisine girer?</p>
  <div class="quiz-option">A) Yeniden Oluşturma ve Ölçüm</div>
  <div class="quiz-option">B) Anlamlandırma ve Sınıflandırma</div>
  <div class="quiz-option" data-correct="true">C) Algılama ve İzleme</div>
  <div class="quiz-option">D) Etkileşim ve Denetim</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C) Algılama ve İzleme.</b> İlk adım, görüntüdeki QR kodunun yerini "algılamak"tır. Ardından gelen linki çözme işlemi ise bir tür "anlamlandırma" içerse de, görevin temeli belirli bir deseni bulmaya dayanır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir Bilgisayarlı Görü "pipeline"ında, bir görüntünün bulanıklaştırılması genellikle hangi aşamada yapılır?</p>
  <div class="quiz-option">A) Karar Verme / Yorumlama</div>
  <div class="quiz-option">B) Özellik Çıkarımı</div>
  <div class="quiz-option">C) Görüntü Kaynağı</div>
  <div class="quiz-option" data-correct="true">D) Önişleme</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D) Önişleme.</b> Görüntüyü hafifçe bulanıklaştırmak (Gaussian blur gibi), yüksek frekanslı gürültüyü azaltmak için yaygın bir ön işleme tekniğidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Aşağıdakilerden hangisi "Özellik Çıkarımı" adımına bir örnek <b>değildir</b>?</p>
  <div class="quiz-option">A) Bir görüntüdeki tüm dikey kenarları bulmak.</div>
  <div class="quiz-option" data-correct="true">B) Görüntüdeki nesnenin "araba" olarak etiketlenmesi.</div>
  <div class="quiz-option">C) Görüntünün renk dağılımını bir histogram ile temsil etmek.</div>
  <div class="quiz-option">D) Harris algoritması ile görüntüdeki köşeleri tespit etmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Nesnenin "araba" olarak etiketlenmesi, özellikler çıkarıldıktan sonra yapılan nihai "Karar Verme / Yorumlama" aşamasıdır. Diğer seçeneklerin tümü, ham piksel verisinden daha anlamlı ama yine de orta seviye bilgiler türetme işlemleridir.</p>
  </div>
</div>

