---
layout: default
title: Canny Edge Detector
parent: 2. Image Formation ve Filtering
nav_order: 5
---

# Canny Edge Detector

**Canny edge detector**, 1986'da John F. Canny tarafından geliştirilen ve günümüzde hala en yaygın kullanılan ve en etkili `edge detection` algoritmalarından biri olarak kabul edilen çok aşamalı bir yöntemdir. Amacı, üç temel kritere göre en iyi `edge map`'ini çıkarmaktır:
1.  **Good Detection:** Gerçek `edge`'leri kaçırmamalı ve `noise`'u `edge` olarak algılamamalı.
2.  **Good Localization:** Tespit edilen `edge` `pixel`'leri, gerçek `edge`'e mümkün olduğunca yakın olmalı.
3.  **Single Response:** Tek bir `edge` için birden fazla `pixel`'den oluşan kalın `edge`'ler yerine, tek `pixel`'lik ince `edge`'ler üretmeli.

Canny algoritması bu hedeflere ulaşmak için dört ana adımdan oluşur:

## 1. Noise Reduction

Ham `image`'deki `noise`, `derivative` işlemlerini olumsuz etkileyeceği için, ilk adım olarak `image` bir **Gaussian filter** ile `smooth` edilir. Bu, sahte `edge` tespitlerini önler. Kullanılan `Gaussian filter`'ın `σ` (sigma) değeri, `edge detection`'ın ölçeğini belirler; büyük `σ` değerleri daha büyük ölçekli, belirgin `edge`'leri bulurken küçük detayları yok eder.

## 2. Gradient Magnitude ve Direction'ı Bulma

`Smooth` edilmiş `image` üzerinden, **Sobel** gibi bir `derivative filter` kullanılarak her `pixel` için `image gradient`'inin (`Gx` ve `Gy`) `magnitude`'u ve `direction`'ı hesaplanır.
- **Gradient Magnitude:** `Pixel`'in bir `edge` olma potansiyelini (gücünü) verir.
- **Gradient Direction:** `Edge`'in yönelimini belirlemek için kullanılır ve bir sonraki adım için kritik öneme sahiptir.

## 3. Non-Maximum Suppression

Bu adımın amacı, `gradient magnitude`'undan elde edilen "kalın" `edge`'leri tek `pixel`'lik ince çizgilere dönüştürmektir. Her `pixel` için şu işlem yapılır:
1.  `Pixel`'in `gradient direction`'ı incelenir (örneğin, 90 derece ise dikey, 0 derece ise yatay).
2.  `Pixel`'in `gradient magnitude`'u, `gradient direction`'ı boyunca önündeki ve arkasındaki iki komşu `pixel`'in `magnitude`'ları ile karşılaştırılır.
3.  Eğer `pixel`'in `magnitude`'u, bu iki komşusundan daha büyük değilse (yani o yöndeki lokal maksimum değilse), bu `pixel` bir `edge` olarak kabul edilmez ve değeri 0'a ayarlanır.

Bu işlem sonucunda, sadece bulundukları yöndeki en tepe noktada olan `pixel`'ler hayatta kalır ve `edge`'ler inceltilmiş olur.

![Non-Maximum Suppression Etkisi](https://via.placeholder.com/600x300.png?text=Solda:+Gradient+Magnitude+|+Sağda:+Non-Maximum+Suppression)
*<center>Solda Gradient Magnitude, sağda Non-Maximum Suppression sonrası inceltilmiş kenarlar.</center>*

## 4. Hysteresis Thresholding

Bu son adım, hangi `pixel`'lerin gerçekten `edge` olduğunu ve hangilerinin `noise` olduğunu belirler. Tek bir `threshold` değeri kullanmak yerine, Canny iki farklı `threshold` değeri kullanır:
- **High Threshold:** Bu değerin üzerindeki `gradient magnitude`'una sahip `pixel`'ler "strong edge" olarak kabul edilir.
- **Low Threshold:** Bu değerin altındaki `pixel`'ler `edge` değil olarak kabul edilir ve atılır.

İki `threshold` arasındaki `pixel`'ler ise "weak edge" olarak etiketlenir. Bir `weak edge` `pixel`'inin `edge` olarak kabul edilip edilmeyeceğine şöyle karar verilir:
- Eğer bir `weak edge` `pixel`'i, 8 komşusundan herhangi biri aracılığıyla bir "strong edge" `pixel`'ine bağlıysa, o da bir `edge`'in parçası olarak kabul edilir.
- Eğer bir "strong edge" ile bağlantısı yoksa, `noise` olarak kabul edilir ve atılır.

Bu yöntem, "strong edge"ler tarafından başlatılan `edge` çizgilerinin, daha az belirgin ama sürekli olduğu "weak edge" bölgeleri boyunca devam etmesine olanak tanır. Bu sayede, `noise`'dan kaynaklanan izole `pixel`'leri elerken, `edge` çizgilerindeki boşlukları doldurarak daha bütüncül ve güvenilir bir `edge map` oluşturulur.

![Canny Edge Detector Sonucu](https://via.placeholder.com/400x300.png?text=Canny+Sonucu:+İnce+ve+Sürekli+Kenarlar)
*<center>Orijinal görüntünün Canny algoritması adımları sonrası nihai kenar haritası.</center>*

---

## Özet ve Anahtar Kavramlar

Canny algoritması 4 ana adımdan oluşur:
1.  **Noise Reduction:** Görüntü, `Gaussian filter` ile yumuşatılır. `σ` parametresi, bulunacak kenarların ölçeğini belirler.
2.  **Gradient Calculation:** Yumuşatılmış görüntü üzerinden `gradient`'in `magnitude` ve `direction`'ı hesaplanır.
3.  **Non-Maximum Suppression:** Kenarları tek `pixel` kalınlığına indirmek için, her `pixel` `gradient` yönündeki komşularıyla karşılaştırılır ve lokal maksimum değilse elenir.
4.  **Hysteresis Thresholding:** İki farklı `threshold` (yüksek ve alçak) kullanılır. Yüksek `threshold`'u geçen `pixel`'ler "strong edge" olarak kabul edilir. Bu "strong edge"lere bağlı olan ve alçak `threshold`'u geçen "weak edge" `pixel`'leri de kenar haritasına dahil edilir. Bu yöntem, kenar devamlılığını sağlar ve gürültüyü eler.

---

## Kavrama Soruları

<details>
  <summary><b>Soru 1:</b> "Non-Maximum Suppression" adımının temel amacı nedir ve bu adım olmasaydı Canny'nin çıktısı nasıl görünürdü?</summary>
  <p>Temel amacı, `gradient magnitude`'undan elde edilen kalın, "bulanık" kenarları tek `pixel` kalınlığında keskin çizgilere dönüştürmektir. Bu adım olmasaydı, Canny'nin çıktısı nesnelerin etrafında aydınlık haleler veya kalın yollar gibi görünürdü, bu da kenarların yerini hassas bir şekilde belirlemeyi imkansız kılardı.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Canny algoritmasının tek bir `threshold` yerine iki `threshold` (Hysteresis) kullanmasının avantajı nedir?</summary>
  <p>Tek bir yüksek `threshold` kullanmak, gürültüyü iyi eler ancak gerçek kenar çizgilerinde boşluklar bırakabilir (kenarın zayıf kısımları kaybolur). Tek bir düşük `threshold` kullanmak ise kenar devamlılığını sağlar ama çok fazla gürültüyü de kenar olarak kabul eder. Hysteresis yöntemi, bu iki dünyanın en iyisini birleştirir: Yüksek `threshold` ile güvenilir "strong edge"leri bularak başlar ve ardından bu güvenilir kenarlara bağlı olan daha zayıf ama yine de kenarın bir parçası olması muhtemel "weak edge"leri de alçak `threshold`'u kullanarak takip eder. Bu, hem gürültüye dayanıklı hem de devamlılığı olan kenarlar üretir.</p>
</details>

<details>
  <summary><b>Soru 3:</b> Canny algoritmasının ilk adımı olan Gaussian `smoothing`'deki `σ` (sigma) değerini değiştirmek çıktıyı nasıl etkiler?</summary>
  <p>`σ` değeri, `smoothing`'in miktarını, dolayısıyla kenar tespitinin "ölçeğini" kontrol eder. Küçük bir `σ` değeri, daha az `smoothing` anlamına gelir ve bu da görüntüdeki ince detayların ve ince kenarların (gürültüyle birlikte) tespit edilmesini sağlar. Büyük bir `σ` değeri ise daha fazla `smoothing` yapar, gürültüyü daha iyi bastırır ancak ince detayları ve zayıf kenarları yok eder, sadece büyük ölçekli ve belirgin kenarların bulunmasını sağlar.</p>
</details>
