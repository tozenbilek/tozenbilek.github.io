---
layout: default
title: Filtreleme Temelleri (Korelasyon ve Konvolüsyon)
nav_order: 5
parent: Computer Vision
---

# Filtreleme Temelleri: Korelasyon ve Konvolüsyon

Görüntülerdeki gürültüyü azaltmak, kenarları keskinleştirmek, nesneleri bulanıklaştırmak veya belirli desenleri bulmak gibi birçok temel görev, **filtreleme** adı verilen bir işlemle gerçekleştirilir. Filtreleme, her bir pikselin değerini, komşularının değerlerini de içeren yerel bir hesaplamayla yeniden belirleme işlemidir.

---

## 1. Temel Fikir: Moving Average (Hareketli Ortalama)

Gürültüyü azaltmak için en sezgisel yöntemlerden biri, her pikseli, etrafındaki küçük bir penceredeki (örneğin 3x3'lük bir alan) piksellerin ortalama değeriyle değiştirmektir.

Bu fikrin arkasındaki varsayım, genellikle bir pikselin "gerçek" renginin, komşularının rengine oldukça benzer olduğu ve gürültünün rastgele olduğu, dolayısıyla ortalama alınınca birbirini götüreceğidir. Bu işlem, görüntüyü hafifçe bulanıklaştırır ama gürültüyü önemli ölçüde azaltır.

<div class="quiz-question">
  <p><b>Soru:</b> "Hareketli Ortalama" filtresinin gürültüyü azaltabilmesinin arkasındaki en temel varsayım nedir?</p>
  <div class="quiz-option">A) Gürültü her zaman siyah piksellerden oluşur.</div>
  <div class="quiz-option" data-correct="true">B) Bir pikselin gerçek değeri genellikle komşularının değerine yakındır.</div>
  <div class="quiz-option">C) Görüntüler her zaman bulanıktır.</div>
  <div class="quiz-option">D) Gürültü sadece renkli görüntülerde bulunur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Ortalama alma işlemi, "bir pikselin komşularına benzemesi gerektiği" varsayımına dayanır. Bu sayede, komşularından çok farklı olan ve muhtemelen gürültüden kaynaklanan aykırı bir piksel değeri, komşularının ortalamasına çekilerek "yumuşatılır".</p>
  </div>
</div>

---

## 2. Kernel (Maske) ve Korelasyon

Bu ortalama işlemini, her komşunun katkısını belirleyen bir ağırlık matrisi kullanarak genelleştirebiliriz. Bu matrise **kernel** veya **mask (maske)** denir.

**Filtreleme İşlemi (Cross-Correlation):**
1.  Bir kernel (örneğin 3x3'lük bir matris) seçilir.
2.  Kernel, görüntü üzerinde her bir pikselin üzerine gelecek şekilde gezdirilir.
3.  Her konumda, kernelin merkezindeki pikselin yeni değeri, kernelin ağırlıkları ile üzerine denk gelen görüntü piksellerinin değerlerinin **çarpımlarının toplamı** olarak hesaplanır.

Bu işleme `Cross-Correlation` denir (`G = H ⨂ F`).

<pre>
Adım 1: Görüntü (F) ve Kernel (H) üst üste getirilir.
  F: [[10, 20, 30],      H: [[1, 0, -1],
      [40, 50, 60],          [1, 0, -1],
      [70, 80, 90]]          [1, 0, -1]]

Adım 2: Eleman bazında çarpma yapılır.
(10*1) + (20*0) + (30*-1) = 10 + 0 - 30 = -20
(40*1) + (50*0) + (60*-1) = 40 + 0 - 60 = -20
(70*1) + (80*0) + (90*-1) = 70 + 0 - 90 = -20

Adım 3: Tüm sonuçlar toplanır.
Yeni piksel değeri (G) = (-20) + (-20) + (-20) = -60
</pre>

### Örnek: Box Filter (Kutu Filtre)
Basit bir ortalama filtresi, tüm ağırlıkları eşit olan bir kernel kullanır. Ağırlıkların toplamının 1 olması, görüntünün genel parlaklığının değişmemesini sağlar.
```
     1  1  1
1/9 *| 1  1  1 |
     1  1  1
```

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntüye 3x3'lük bir "box filter" (tüm elemanları 1/9 olan kernel) uygulamanın temel amacı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Görüntüyü bulanıklaştırarak gürültüyü azaltmak.</div>
  <div class="quiz-option">B) Görüntüdeki kenarları keskinleştirmek.</div>
  <div class="quiz-option">C) Görüntünün parlaklığını artırmak.</div>
  <div class="quiz-option">D) Görüntüdeki belirli bir nesneyi bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Box filter, her pikseli komşularının ortalamasıyla değiştirir. Bu işlem, pikseller arasındaki keskin farklılıkları (hem gürültüyü hem de ince detayları) yumuşatarak görüntüyü bulanıklaştırır ve gürültüyü azaltır.</p>
  </div>
</div>

---

## 3. Kenar Pikselleri Sorunu ve Padding (Doldurma)

Filtre kerneli görüntü üzerinde gezerken, kernelin bir kısmı görüntünün dışına taştığında ne olur? Örneğin, sol üst köşedeki piksele 3x3 bir kernel nasıl uygulanır? Bu sorunu çözmek için **padding (doldurma)** yöntemleri kullanılır.

*   **En Yaygın Yöntem: Zero-Padding (Sıfırla Doldurma):** Görüntünün etrafına, filtre boyutuna yetecek kadar sıfır değerine sahip piksellerden oluşan bir çerçeve eklenir. Bu, filtrenin kenar ve köşe piksellerine de uygulanabilmesini sağlar ve çıktı görüntüsünün boyutunun orijinal görüntüyle aynı kalmasına yardımcı olur.

<div class="quiz-question">
  <p><b>Soru:</b> Filtreleme işleminde "padding" (doldurma) kullanılmasının temel nedeni nedir?</p>
  <div class="quiz-option">A) Görüntüyü daha parlak yapmak.</div>
  <div class="quiz-option" data-correct="true">B) Görüntünün kenarlarındaki ve köşelerindeki piksellere de filtre uygulayabilmek.</div>
  <div class="quiz-option">C) Filtreleme işlemini yavaşlatmak.</div>
  <div class="quiz-option">D) Görüntüdeki gürültüyü artırmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Padding olmadan, bir kernelin merkezi asla görüntünün en kenarındaki piksellerin üzerine gelemez. Görüntünün etrafına sanal pikseller eklemek (padding), kernelin tüm pikseller üzerinde gezebilmesini sağlar ve genellikle çıktı boyutunun girdi boyutuyla aynı kalmasını sağlar.</p>
  </div>
</div>

---

## 4. Convolution (Konvolüsyon)

Konvolüsyon, korelasyona çok benzer bir işlemdir. Tek fark, görüntü üzerine getirilmeden önce **kernelin 180 derece döndürülmesidir.** Matematiksel ve sinyal işleme teorisinde daha "doğal" bir operasyon olarak kabul edilir ve birçok güzel matematiksel özelliğe (birleşme, değişme) sahiptir.

**Pratikteki Fark:** Eğer kullanılan kernel, hem yatay hem de dikey olarak simetrik ise (örneğin, Box filter veya Gaussian filter), korelasyon ve konvolüsyon **tamamen aynı sonucu** verir. Bu yüzden Computer Vision pratiğinde bu iki terim sıkça birbirinin yerine kullanılır.

<div class="quiz-question">
  <p><b>Soru:</b> Cross-Correlation ve Convolution operasyonları arasındaki temel fark nedir?</p>
  <div class="quiz-option">A) Korelasyon toplama, konvolüsyon çarpma kullanır.</div>
  <div class="quiz-option">B) Aralarında hiçbir fark yoktur.</div>
  <div class="quiz-option" data-correct="true">C) Konvolüsyon, işlemden önce filtre kernelini 180 derece döndürür.</div>
  <div class="quiz-option">D) Konvolüsyon sadece 1D sinyaller için kullanılır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> İki operasyon da eleman bazında çarpma ve toplama işlemi yapar. Aralarındaki tek matematiksel fark, konvolüsyonun, filtre kernelini görüntüye uygulamadan önce merkezi etrafında 180 derece döndürmesidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Hangi durumda bir filtreleme işleminin Convolution veya Cross-Correlation kullanılarak yapılması sonuç açısından fark etmez?</p>
  <div class="quiz-option">A) Görüntü siyah-beyaz ise.</div>
  <div class="quiz-option" data-correct="true">B) Kullanılan kernel (filtre) simetrik ise.</div>
  <div class="quiz-option">C) Görüntüde hiç gürültü yoksa.</div>
  <div class="quiz-option">D) Kernel sadece pozitif değerler içeriyorsa.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Eğer kernel 180 derece döndürüldüğünde kendisiyle aynı kalıyorsa (yani simetrikse), döndürme işleminin bir etkisi olmaz. Bu durumda Convolution ve Cross-Correlation tamamen aynı sonucu üretir. Box filter ve Gaussian filter bu duruma örnektir.</p>
  </div>
</div>

---

