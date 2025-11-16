---
layout: default
title: Doku (Texture) Temelli Segmentasyon
nav_order: 4
parent: Computer Vision
---

# Texture-Based Segmentation

Bazı durumlarda, `pixel`'lerin sadece renk, parlaklık veya konum gibi basit `feature`'ları, bir `image`'i anlamlı bölgelere ayırmak için yeterli olmaz. Örneğin, bir çita postunu (benekli) savanadaki otlardan (çizgili) ayırmak için, bu bölgelerin "doku" (`texture`) özelliklerini dikkate almamız gerekir.

**Doku**, bir yüzeyin `intensity` veya renk desenindeki tekrarlayan yapısal düzenlemeler olarak tanımlanabilir. Doku segmentasyonu, `image`'i farklı dokusal özelliklere sahip bölgelere ayırmayı amaçlar.

![Texture Segmentation Goal](https://placehold.co/600x300/EEE/31343C?text=Farklı+Desenlere+Sahip+Bölgeleri+Ayırma)
*<center>Doku segmentasyonu, çita (benekli) ve ot (çizgili) gibi farklı dokusal desenlere sahip bölgeleri birbirinden ayırır.</center>*

## Filter Bank ile Doku Özellikleri Çıkarma

Dokuyu bir `feature space`'te temsil etmek için genellikle "filter bank" adı verilen bir yaklaşım kullanılır.

1.  **Filter Bank:** `Image`, farklı yönelimlerde (`orientation`) ve ölçeklerde (`scale`) kenarları, köşeleri, noktaları veya belirli desenleri tespit etmek için tasarlanmış bir dizi `filter`'dan (örneğin, Gabor `filter`'ları) geçirilir.
2.  **Feature Vector:** Her bir `pixel` için, `filter bank`'taki her bir `filter`'ın o `pixel`'deki çıktısı (`response`) hesaplanır. Bu çıktılar birleştirilerek o `pixel` için yüksek boyutlu bir "doku `feature vector`'ü" oluşturulur. Örneğin, 24 farklı `filter` kullandıysak, her `pixel` 24-boyutlu bir `feature space`'te bir nokta ile temsil edilir.

Bu `filter bank`, `image` ile `convolution` işlemine sokulur ve her bir `filter` için bir "response" `image`'i elde edilir. Belirli bir `pixel` için, bu `filter`'lardan gelen `response`'lar bir araya getirilerek o `pixel`'in **doku `feature` vektörünü** oluşturur. Örneğin, 48 farklı `filter` kullandıysak, her `pixel` için 48 boyutlu bir `feature vector` elde ederiz.

## Texton'lar ve Clustering

Bu yüksek boyutlu `feature space`'i doğrudan kullanmak yerine, genellikle "texton" adı verilen temel doku birimleri oluşturulur.

1.  **Texton'ları Bulma:** `Image`'deki tüm `pixel`'lerin doku `feature vector`'leri, K-Means gibi bir `clustering` algoritması kullanılarak gruplanır. Her bir `cluster`'ın merkezi, bir "texton" olarak adlandırılır. Texton'lar, o `image`'de bulunan temel mikro-desenleri (örneğin, "dikey çizgi parçası", "küçük benek", "yatay çizgi parçası") temsil eder.
2.  **Texton Haritası:** Her `pixel`, kendisine en yakın olan `texton` ile etiketlenerek bir "texton haritası" oluşturulur.
3.  **Doku Histogramı:** `Image`'i `segment`'lere ayırmak için, genellikle küçük pencereler (`window`) içindeki texton dağılımlarına bakılır. Her bir pencere için, içinde hangi `texton`'dan kaç tane olduğunu gösteren bir "texton histogramı" oluşturulur. Bu histogram, o pencerenin genel dokusunu tanımlayan yeni bir `feature vector` olur.
4.  **Son Clustering:** Son olarak, bu histogram `feature`'larına göre pencereler gruplanarak `image`'in doku tabanlı `segmentation`'ı gerçekleştirilir.

Bu `feature vector`'leri, `K-Means` gibi bir `clustering` algoritması kullanılarak gruplanır. `Clustering` sonucunda elde edilen her bir `cluster` merkezine **texton** denir. Her `texton`, `image`'de tekrar eden temel bir mikro-doku desenini temsil eder (örneğin, küçük bir benek, dikey bir çizgi parçası vb.).

Daha sonra, `image`'deki her `pixel`, kendisine en yakın `texton`'a atanarak bir **texton map** oluşturulur.

![Texture Segmentation Pipeline](https://placehold.co/800x250/EEE/31343C?text=Image+->+Filter+Bank+->+Clustering+(Textons)+->+Texton+Map)
*<center>Doku segmentasyonu süreci: Görüntü bir filtre bankasından geçirilir, her piksel için bir özellik vektörü oluşturulur, bu vektörler kümelenerek "texton"lar bulunur ve son olarak her piksel en yakın texton'a atanır.</center>*

## Texton Map Üzerinde Segmentasyon

Bu histogramlar, artık bölgenin doku özelliklerini temsil eden yeni, daha kompakt `feature vector`'leridir. Son adımda, bu histogram `feature`'ları kullanılarak `image`'in son segmentasyonu yapılır (örneğin, `Normalized Cuts` ile).

---

## Özet ve Anahtar Kavramlar

-   **Texture (Doku):** Bir yüzeydeki `intensity` veya renk desenlerinin tekrarlayan yapısal düzenidir.
-   **Filter Bank:** Farklı yönelimlerde, ölçeklerde ve frekanslarda desenleri yakalamak için tasarlanmış bir `filter` koleksiyonudur (örn: yönlendirilmiş `Gaussian` türevleri, `Gabor` filtreleri).
-   **Texture Feature Vector:** Bir `pixel`'in, `filter bank`'ındaki her bir `filter`'a verdiği `response`'lardan oluşan ve o `pixel`'in lokal doku özelliklerini temsil eden vektördür.
-   **Texton:** Bir görüntüdeki temel mikro-doku desenlerine karşılık gelen `cluster` merkezleridir. `Texture feature vector`'lerinin `K-Means` ile kümelenmesiyle bulunur.
-   **Texton Map:** Görüntüdeki her `pixel`'in, en çok benzediği `texton`'un ID'si ile etiketlendiği haritadır. Bu harita, doku segmentasyonunun temelini oluşturur.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Görüntü dokusunu (texture) tanımlamak için kullanılan "filter bank" yaklaşımının temel mantığı nedir?</p>
  <div class="quiz-option">A) Görüntüyü tek bir ortalama filtre ile yumuşatmak.</div>
  <div class="quiz-option" data-correct="true">B) Görüntüyü farklı yönelim ve ölçeklerdeki bir dizi filtreyle (örneğin, Gabor) süzerek her piksel için bir özellik vektörü oluşturmak.</div>
  <div class="quiz-option">C) Görüntünün renk histogramını çıkarmak.</div>
  <div class="quiz-option">D) Görüntüdeki kenarları Canny kenar dedektörü ile bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> "Filter bank" yaklaşımı, tek bir özelliğin dokuyu tanımlamak için yetersiz olduğu varsayımına dayanır. Bunun yerine, görüntüye farklı "sorular soran" bir filtre seti (farklı açılardaki kenarlar, farklı boyutlardaki `blob`'lar vb.) uygulanır. Her bir filtrenin bir pikseldeki tepkisi, o pikselin doku özelliklerini tanımlayan çok boyutlu bir vektörün bir elemanı haline gelir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> "Texton" kavramı, doku analizinde neyi temsil eder?</p>
  <div class="quiz-option">A) Görüntüdeki metin karakterlerini.</div>
  <div class="quiz-option">B) Görüntünün sıkıştırılmış halini.</div>
  <div class="quiz-option" data-correct="true">C) Bir görüntüdeki temel mikro-yapıları veya tekrarlayan desen prototiplerini.</div>
  <div class="quiz-option">D) Görüntünün ortalama renk değerini.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> "Texton"lar, dokuların "kelimeleri" olarak düşünülebilir. Bunlar, bir `filter bank`'tan elde edilen özellik vektörlerinin K-Means gibi bir algoritma ile kümelenmesiyle bulunur. Her küme merkezi, görüntüde sıkça tekrar eden temel bir deseni (örneğin, belirli bir yönde küçük bir çizgi, küçük bir nokta, bir köşe) temsil eden bir "texton" olur. Bir doku, bu `texton`'ların histogramı ile tanımlanabilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Doku tabanlı segmentasyonun, sadece renk tabanlı segmentasyona göre üstün olduğu bir senaryo aşağıdakilerden hangisidir?</p>
  <div class="quiz-option">A) Mavi bir gökyüzünü kırmızı bir arabadan ayırmak.</div>
  <div class="quiz-option" data-correct="true">B) Bir çita'yı (benekli), üzerinde durduğu savanadan (çizgili otlar) ayırmak.</div>
  <div class="quiz-option">C) Siyah-beyaz bir satranç tahtasındaki kareleri ayırmak.</div>
  <div class="quiz-option">D) Bir stüdyoda çekilmiş, tek renkli düz bir arka plan önündeki bir nesneyi ayırmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Çita ve savana, ortalama renk olarak birbirine çok yakın (sarı/kahverengi tonları) olabilir. Bu durumda sadece renk bilgisine dayalı bir segmentasyon başarısız olur. Ancak, dokuları (benekler ve çizgiler) tamamen farklıdır. Doku özelliklerini analiz eden bir algoritma, bu iki bölgeyi dokusal farklılıklarına dayanarak başarılı bir şekilde ayırabilir.</p>
  </div>
</div>
