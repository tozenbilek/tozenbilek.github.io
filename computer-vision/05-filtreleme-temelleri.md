---
layout: default
title: Filtreleme Temelleri (Korelasyon ve Konvolüsyon)
nav_order: 5
parent: Computer Vision
---

# Filtreleme Temelleri: Korelasyon ve Konvolüsyon

Görüntülerdeki gürültüyü azaltmak, kenarları keskinleştirmek veya belirli desenleri bulmak gibi birçok temel Computer Vision görevi, **filtreleme** adı verilen bir işlemle gerçekleştirilir. Filtreleme, her bir pikselin değerini, kendisi ve komşularının değerlerini içeren yerel bir hesaplamayla yeniden belirleme işlemidir.

---

## 1. Temel Fikir: Moving Average (Hareketli Ortalama)

Gürültüyü azaltmak için akla gelen en sezgisel yöntemlerden biri, her pikseli, etrafındaki küçük bir penceredeki (örneğin 3x3'lük bir alan) piksellerin ortalama değeriyle değiştirmektir.

**Bu fikrin arkasındaki varsayımlar:**
1.  **Görüntü Pürüzsüzlüğü:** Genellikle, bir pikselin "gerçek" rengi, komşularının rengine oldukça benzerdir.
2.  **Gürültü Bağımsızlığı:** Her piksele eklenen gürültü, komşularına eklenen gürültüden bağımsız ve rastgeledir.

Bu varsayımlar altında, bir grup komşu pikselin ortalamasını almak, rastgele gürültülerin birbirini götürmesini sağlarken, alttaki "gerçek" sinyali (görüntüyü) koruyacaktır. Bu işlem, görüntüyü hafifçe bulanıklaştırır ama gürültüyü önemli ölçüde azaltır.

---

## 2. Kernel (Maske) ve Korelasyon

Bu "hareketli ortalama" işlemini genelleştirebiliriz. Her bir komşu pikselin ortalamaya ne kadar katkıda bulunacağını belirleyen ağırlıklar tanımlayabiliriz. Bu ağırlık matrisine **kernel** veya **mask (maske)** denir.

**Filtreleme İşlemi (Korelasyon):**
1.  Bir kernel (örneğin 3x3'lük bir matris) seçilir.
2.  Bu kernel, görüntü üzerinde her bir pikselin üzerine gelecek şekilde gezdirilir.
3.  Her konumda, kernelin merkezindeki pikselin yeni değeri, kernelin ağırlıkları ile üzerine denk gelen görüntü piksellerinin değerlerinin çarpımlarının toplamı olarak hesaplanır.

Bu işleme **Cross-Correlation (Korelasyon)** denir ve `G = H ⨂ F` olarak gösterilir, burada `G` yeni görüntü, `H` kernel ve `F` orijinal görüntüdür.

![Correlation](https://via.placeholder.com/600x300.png?text=Kernel+(H)+Görüntü+(F)+Üzerinde+Kaydırılır)
*Görsel: Bir kernelin (filtre) görüntü üzerinde kaydırılarak her piksel için yeni bir değer hesaplaması.*

**Örnek: Box Filter (Kutu Filtre)**
Basit bir ortalama filtresi, tüm ağırlıkları eşit olan bir kernel kullanır. Ağırlıkların toplamının 1 olması, görüntünün genel parlaklığının değişmemesini sağlar.

```
     1  1  1
1/9 *| 1  1  1 |
     1  1  1
```

---

## 3. Convolution (Konvolüsyon)

Konvolüsyon, korelasyona çok benzer bir işlemdir. Tek fark, görüntü üzerine getirilmeden önce **kernelin 180 derece döndürülmesidir.** Matematiksel ve sinyal işleme teorisinde daha "doğal" bir operasyon olarak kabul edilir ve birçok güzel matematiksel özelliğe (birleşme, değişme) sahiptir.

`G = H * F`

**Pratikteki Fark:**
Eğer kullanılan kernel, hem yatay hem de dikey olarak simetrik ise (örneğin, Box filter veya Gaussian filter), korelasyon ve konvolüsyon **tamamen aynı sonucu** verir. Bu yüzden Computer Vision pratiğinde bu iki terim sıkça birbirinin yerine kullanılır. Ancak simetrik olmayan kerneller (örneğin, kenar tespiti için kullanılan türev filtreleri) için sonuçlar farklı olacaktır.

---

### Test Soruları

<div class="quiz-question">
  <p<b>Soru 1:</b> Bir görüntüye 3x3'lük bir "box filter" (tüm elemanları 1/9 olan kernel) uygulamanın temel amacı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Görüntüyü bulanıklaştırarak gürültüyü azaltmak.</div>
  <div class="quiz-option">B) Görüntüdeki kenarları keskinleştirmek.</div>
  <div class="quiz-option">C) Görüntünün parlaklığını artırmak.</div>
  <div class="quiz-option">D) Görüntüdeki belirli bir nesneyi bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Box filter, her pikseli komşularının ortalamasıyla değiştirir. Bu işlem, pikseller arasındaki keskin farklılıkları (hem gürültüyü hem de ince detayları) yumuşatarak görüntüyü bulanıklaştırır ve gürültüyü azaltır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Cross-Correlation ve Convolution operasyonları arasındaki temel fark nedir?</p>
  <div class="quiz-option">A) Korelasyon toplama, konvolüsyon çarpma kullanır.</div>
  <div class="quiz-option">B) Aralarında hiçbir fark yoktur.</div>
  <div class="quiz-option" data-correct="true">C) Konvolüsyon, işlemden önce filtre kernelini 180 derece döndürür.</div>
  <div class="quiz-option">D) Konvolüsyon sadece 1D sinyaller için kullanılır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> İki operasyon da eleman bazında çarpma ve toplama işlemi yapar. Aralarındaki tek matematiksel fark, konvolüsyonun, filtre kernelini görüntüye uygulamadan önce merkezi etrafında 180 derece döndürmesidir.</p>
  </div>
</div>

