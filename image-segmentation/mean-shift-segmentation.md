---
layout: default
title: Mean Shift Segmentation
parent: 6. Image Segmentation
nav_order: 2
---

# Mean Shift Segmentation

K-Means'in bazı dezavantajlarına (K'yı belirleme, küresel cluster varsayımı) bir alternatif olarak **Mean Shift** algoritması geliştirilmiştir. Mean Shift, `feature space`'teki veri yoğunluğunun tepe noktalarını (modlarını veya yerel maksimumlarını) bulmaya çalışan bir yöntemdir. Her bir tepe noktası, bir `cluster`'ın merkezini temsil eder.

## Mean Shift Nasıl Çalışır?

Mean Shift, her bir veri noktasını (`pixel`'in `feature vector`'ü) alır ve o noktanın etrafındaki veri yoğunluğunun daha yüksek olduğu bir bölgeye doğru iteratif olarak kaydırır. Bu işlem, bir "tepeye tırmanma" (`hill-climbing`) algoritması olarak düşünülebilir.

1.  **Bir Başlangıç Noktası Seç:** Rastgele bir `pixel`'in `feature vector`'ü `x` seçilir.
2.  **Komşuluk Penceresi Belirle:** `x`'i merkez alan belirli bir `h` yarıçaplı (`bandwidth`) bir pencere (genellikle küresel) tanımlanır.
3.  **Ağırlık Merkezini (Mean) Hesapla:** Pencerenin içindeki tüm noktaların ağırlık merkezi (`mean`'i) `m` hesaplanır.
4.  **Kaydır (Shift):** Başlangıç noktası `x`'i, hesaplanan ağırlık merkezi `m`'ye kaydır.
5.  **Tekrarla:** Yeni `x` noktası için 2-4 adımlarını, pencerenin merkezi artık değişmeyene (yani bir yoğunluk tepesine yakınsayana) kadar tekrarla.

![Mean Shift Hill Climbing](https://via.placeholder.com/600x400.png?text=1.+Pencere+Seç+->+2.+Merkezi+Hesapla+->+3.+Merkeze+Kaydır+->+Tekrarla)
*<center>Mean Shift'in çalışma prensibi: Her bir nokta, etrafındaki komşuluğun yoğunluk merkezine doğru kaydırılır ve bu işlem, yoğunluğun tepe noktasına ulaşana kadar tekrarlanır.</center>*

Bu işlem, `feature space`'teki tüm başlangıç noktaları için yapılır. Sonunda aynı tepe noktasına ulaşan tüm başlangıç noktaları, aynı `cluster`'a ait olarak kabul edilir.

## Mean Shift ile Clustering ve Segmentasyon

- **Attraction Basin (Çekim Havzası):** Aynı tepe noktasına (`mode`) ulaşan tüm başlangıç noktaları (pencere merkezleri), o tepenin "çekim havzasını" oluşturur.
- **Cluster:** Bir çekim havzasındaki tüm veri noktaları, tek bir `cluster` olarak kabul edilir.
- **Segmentation:** Son adımda, aynı `cluster`'a ait olan tüm `pixel`'ler aynı `segment` olarak etiketlenir.

![Mean Shift Segmentation Result](https://via.placeholder.com/600x300.png?text=Orijinal+Görüntü+->+Mean+Shift+ile+Segmentasyon)
*<center>Mean Shift segmentasyonunun tipik bir sonucu: Görüntü, algısal olarak anlamlı ve pürüzsüz sınırlara sahip bölgelere ayrılır.</center>*

## Mean Shift'in Artıları ve Eksileri

**Artıları:**
- **`K` Gerekmez:** `Cluster` sayısını önceden belirlemeye gerek yoktur; algoritma bunu veri yoğunluğuna göre otomatik olarak bulur.
- **Esnek `Cluster` Şekilleri:** K-Means gibi küresel `cluster`'lar varsaymaz; karmaşık ve keyfi şekilli `segment`'leri bulabilir.
- **Parametre Sayısı Az:** Ayarlanması gereken tek ana parametre pencere boyutudur (`window size`).

**Eksileri:**
- **Pencere Boyutu Seçimi:** Algoritmanın performansı, seçilen pencere boyutuna oldukça duyarlıdır. Bu boyut, bulunacak `segment`'lerin ölçeğini belirler.
- **Hesaplama Maliyeti:** Özellikle yüksek boyutlu `feature space`'lerde veya çok sayıda veri noktası olduğunda yavaş çalışabilir.
-   **Parametre Seçimi:** Algoritmanın performansı, `bandwidth` (`h`) parametresinin seçimine oldukça duyarlıdır. `h`'nin optimal değerini bulmak zor olabilir.
-   **Hesaplama Maliyeti:** Özellikle yüksek boyutlu `feature space`'lerde ve büyük `image`'lerde oldukça yavaş olabilir.

---

## Özet ve Anahtar Kavramlar

-   **Mean Shift:** `Feature space`'teki veri noktalarının yoğunluk fonksiyonunun tepe noktalarını (modlarını) bulmaya çalışan, parametrik olmayan bir `clustering` algoritmasıdır.
-   **Hill-Climbing:** Mean Shift'in temel çalışma prensibi, her bir veri noktasını iteratif olarak etrafındaki yoğunluğun daha yüksek olduğu bir bölgeye doğru kaydırarak tepeye tırmanmaktır.
-   **Bandwidth (h):** Her bir noktanın etrafında komşuluğun ne kadar büyük bir alanda dikkate alınacağını belirleyen kritik bir parametredir.
-   **Non-Parametric:** Mean Shift, K-Means'in aksine, `cluster` sayısını (`K`) önceden bilmeyi gerektirmez. Bulunan tepe sayısı, `cluster` sayısını otomatik olarak belirler.
-   **Feature Space:** K-Means'de olduğu gibi, segmentasyonun kalitesi `[R,G,B,x,y]` gibi `feature`'ların seçimine bağlıdır.

---

## Kavrama Soruları

<details>
  <summary><b>Soru 1:</b> Mean Shift'in K-Means'e göre en temel iki avantajı nedir?</summary>
  <p>1. **K'yı belirlemeye gerek yoktur:** Algoritma, veri yoğunluğunun tepe noktalarını bularak `cluster` sayısını otomatik olarak belirler. 2. **Keyfi şekilli `cluster`'ları bulabilir:** K-Means'in küresel `cluster` varsayımının aksine, Mean Shift yoğunluk gradyanını takip ettiği için daha karmaşık ve düzensiz şekilli `cluster`'ları da başarılı bir şekilde bulabilir.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Mean Shift'teki `bandwidth` (`h`) parametresini çok büyük veya çok küçük seçmenin sonuçları ne olur?</summary>
  <p>`h`'yi çok küçük seçmek, algoritmanın verideki küçük gürültü tepeciklerinde takılıp kalmasına ve sonuç olarak veriyi aşırı segmentlemesine (çok fazla küçük `cluster`) neden olur. `h`'yi çok büyük seçmek ise, farklı yoğunluk tepelerinin tek bir büyük pencere içinde birleşmesine ve dolayısıyla veriyi eksik segmentlemesine (birbirinden farklı `cluster`'ların tek bir `cluster` olarak birleştirilmesi) yol açar.</p>
</details>

<details>
  <summary><b>Soru 3:</b> Bir görüntüde, birbirinden uzakta bulunan ama tamamen aynı renge sahip iki farklı nesne var. Mean Shift'i `feature space` olarak sadece `[R, G, B]` kullanarak uygularsak sonuç ne olur?</summary>
  <p>Eğer `feature space` sadece renklerden oluşuyorsa, bu iki nesnenin `pixel`'leri `feature space`'te aynı noktada veya çok yakın bir bölgede kümelenir. Mean Shift, bu `pixel`'lerin hepsinin aynı yoğunluk tepesine ait olduğunu bulacak ve onları tek bir `cluster` olarak etiketleyecektir. Sonuç olarak, bu iki fiziksel olarak ayrı nesne, aynı segmentin parçası olarak kabul edilir. Konumsal olarak ayrı segmentler elde etmek için `feature space`'e `(x, y)` koordinatlarının da eklenmesi gerekir.</p>
</details>
