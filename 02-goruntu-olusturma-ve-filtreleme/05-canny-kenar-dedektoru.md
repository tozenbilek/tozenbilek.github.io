---
layout: default
title: Canny Edge Detector
parent: 2. Görüntü Oluşturma ve Filtreleme
nav_order: 5
---

# Canny Edge Detector

**Canny edge detector**, 1986'da John F. Canny tarafından geliştirilen ve günümüzde hala en yaygın kullanılan ve en etkili `edge detection` algoritmalarından biri olarak kabul edilen çok aşamalı bir yöntemdir. Amacı, üç temel kritere göre en iyi `edge map`'ini çıkarmaktır:
1.  **Good Detection:** Gerçek `edge`'leri kaçırmamalı ve `noise`'u `edge` olarak algılamamalı.
2.  **Good Localization:** Tespit edilen `edge` `pixel`'leri, gerçek `edge`'e mümkün olduğunca yakın olmalı.
3.  **Single Response:** Tek bir `edge` için birden fazla `pixel`'den oluşan kalın `edge`'ler yerine, tek `pixel`'lik ince `edge`'ler üretmeli.

Canny algoritması bu hedeflere ulaşmak için dört ana adımdan oluşur:

## Adım 1: Noise Reduction

Ham `image`'deki `noise`, `derivative` işlemlerini olumsuz etkileyeceği için, ilk adım olarak `image` bir **Gaussian filter** ile `smooth` edilir. Bu, sahte `edge` tespitlerini önler. Kullanılan `Gaussian filter`'ın `σ` (sigma) değeri, `edge detection`'ın ölçeğini belirler; büyük `σ` değerleri daha büyük ölçekli, belirgin `edge`'leri bulurken küçük detayları yok eder.

## Adım 2: Gradient Magnitude ve Direction'ı Bulma

`Smooth` edilmiş `image` üzerinden, **Sobel** gibi bir `derivative filter` kullanılarak her `pixel` için `image gradient`'inin (`Gx` ve `Gy`) `magnitude`'u ve `direction`'ı hesaplanır.
- **Gradient Magnitude:** `Pixel`'in bir `edge` olma potansiyelini (gücünü) verir.
- **Gradient Direction:** `Edge`'in yönelimini belirlemek için kullanılır ve bir sonraki adım için kritik öneme sahiptir.

## Adım 3: Non-Maximum Suppression

Bu adımın amacı, `gradient magnitude`'undan elde edilen "kalın" `edge`'leri tek `pixel`'lik ince çizgilere dönüştürmektir. Her `pixel` için şu işlem yapılır:
1.  `Pixel`'in `gradient direction`'ı incelenir (örneğin, 90 derece ise dikey, 0 derece ise yatay).
2.  `Pixel`'in `gradient magnitude`'u, `gradient direction`'ı boyunca önündeki ve arkasındaki iki komşu `pixel`'in `magnitude`'ları ile karşılaştırılır.
3.  Eğer `pixel`'in `magnitude`'u, bu iki komşusundan daha büyük değilse (yani o yöndeki lokal maksimum değilse), bu `pixel` bir `edge` olarak kabul edilmez ve değeri 0'a ayarlanır.

Bu işlem sonucunda, sadece bulundukları yöndeki en tepe noktada olan `pixel`'ler hayatta kalır ve `edge`'ler inceltilmiş olur.

## Adım 4: Hysteresis Thresholding

Bu son adım, hangi `pixel`'lerin gerçekten `edge` olduğunu ve hangilerinin `noise` olduğunu belirler. Tek bir `threshold` değeri kullanmak yerine, Canny iki farklı `threshold` değeri kullanır:
- **High Threshold:** Bu değerin üzerindeki `gradient magnitude`'una sahip `pixel`'ler "strong edge" olarak kabul edilir.
- **Low Threshold:** Bu değerin altındaki `pixel`'ler `edge` değil olarak kabul edilir ve atılır.

İki `threshold` arasındaki `pixel`'ler ise "weak edge" olarak etiketlenir. Bir `weak edge` `pixel`'inin `edge` olarak kabul edilip edilmeyeceğine şöyle karar verilir:
- Eğer bir `weak edge` `pixel`'i, 8 komşusundan herhangi biri aracılığıyla bir "strong edge" `pixel`'ine bağlıysa, o da bir `edge`'in parçası olarak kabul edilir.
- Eğer bir "strong edge" ile bağlantısı yoksa, `noise` olarak kabul edilir ve atılır.

Bu yöntem, "strong edge"ler tarafından başlatılan `edge` çizgilerinin, daha az belirgin ama sürekli olduğu "weak edge" bölgeleri boyunca devam etmesine olanak tanır. Bu sayede, `noise`'dan kaynaklanan izole `pixel`'leri elerken, `edge` çizgilerindeki boşlukları doldurarak daha bütüncül ve güvenilir bir `edge map` oluşturulur.
