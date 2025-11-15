---
layout: default
title: Texture-Based Segmentation
parent: 6. Image Segmentation
nav_order: 3
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

<details>
  <summary><b>Soru 1:</b> Neden tek bir `filter` (örneğin basit bir `Sobel` `edge detector`) doku analizi için yeterli değildir de bir `filter bank` kullanırız?</summary>
  <p>Tek bir `filter`, sadece tek bir türde `feature`'ı (örneğin, dikey kenarlar) yakalayabilir. Dokular ise çok daha karmaşıktır ve farklı yönlerde (dikey, yatay, 45 derece vb.), farklı ölçeklerde (ince çizgiler, kalın çizgiler) ve farklı frekanslarda (yumuşak geçişler, keskin geçişler) desenlerin birleşiminden oluşur. Bir `filter bank`, bu zengin desen çeşitliliğini yakalayabilmek için tasarlanmış çok sayıda `filter` içerir ve bu sayede dokuyu çok daha kapsamlı bir şekilde temsil edebilir.</p>
</details>

<details>
  <summary><b>Soru 2:</b> "Texton" kavramını basit bir analoji ile açıklayın.</summary>
  <p>Texton'ları, dokunun "kelimeleri" olarak düşünebilirsiniz. Nasıl ki bir metin, "a", "b", "c" gibi harflerin bir araya gelmesiyle oluşan "elma", "ağaç", "ev" gibi kelimelerden oluşuyorsa; bir dokusal bölge de, "küçük dikey çizgi", "küçük yuvarlak benek", "45 derecelik eğim" gibi temel mikro-desenlerin (texton'ların) bir araya gelmesiyle oluşur. `Clustering` adımı, görüntüdeki tüm "harfleri" (piksel `feature`'larını) analiz ederek bu temel "kelimeleri" (texton'ları) bulma işlemidir.</p>
</details>

<details>
  <summary><b>Soru 3:</b> `Texton map` oluşturulduktan sonra neden doğrudan bu haritayı segmentasyon sonucu olarak kullanmıyoruz da üzerinde ek bir segmentasyon adımı (örneğin `Texton Histogramları` + `N-Cuts`) uyguluyoruz?</summary>
  <p>`Texton map`'i genellikle oldukça gürültülüdür. Bir çita postunun üzerindeki benekli bir bölgede, hem "sarı tüy" texton'ları hem de "siyah benek" texton'ları bir arada bulunur. Haritayı doğrudan kullanmak, bu bölgeyi iki ayrı, iç içe geçmiş segmente ayırırdı. Bunun yerine, küçük pencereler içindeki `texton`'ların dağılımına (histogramına) bakarak daha üst seviye bir `feature` oluştururuz. Bu histogram, "bu bölge %70 sarı tüy, %30 siyah benek dokusuna sahip" der. Bu yeni ve daha kararlı `feature`'lar üzerinde segmentasyon yapmak, gürültüyü ortadan kaldırır ve algısal olarak bütüncül olan "çita postu" bölgesini tek bir segment olarak bulmamızı sağlar.</p>
</details>
