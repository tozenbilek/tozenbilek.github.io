---
layout: default
title: Texture-Based Segmentation
parent: 6. Image Segmentation
nav_order: 3
---

# Texture-Based Segmentation

Bazı durumlarda, `pixel`'lerin sadece renk, parlaklık veya konum gibi basit `feature`'ları, bir `image`'i anlamlı bölgelere ayırmak için yeterli olmaz. Örneğin, bir çita postunu (benekli) savanadaki otlardan (çizgili) ayırmak için, bu bölgelerin "doku" (`texture`) özelliklerini dikkate almamız gerekir.

Doku, bir `image` bölgesindeki `pixel` değerlerinin uzamsal düzenlenişi olarak tanımlanabilir. Tek bir `pixel`'e bakarak doku anlaşılamaz; doku, bir `pixel`'in komşuluğuna bakarak elde edilen bir özelliktir.

## Dokuyu Feature Olarak Kullanmak

Dokuyu bir `feature space`'te temsil etmek için genellikle "filter bank" adı verilen bir yaklaşım kullanılır.

1.  **Filter Bank:** `Image`, farklı yönelimlerde (`orientation`) ve ölçeklerde (`scale`) kenarları, köşeleri, noktaları veya belirli desenleri tespit etmek için tasarlanmış bir dizi `filter`'dan (örneğin, Gabor `filter`'ları) geçirilir.
2.  **Feature Vector:** Her bir `pixel` için, `filter bank`'taki her bir `filter`'ın o `pixel`'deki çıktısı (`response`) hesaplanır. Bu çıktılar birleştirilerek o `pixel` için yüksek boyutlu bir "doku `feature vector`'ü" oluşturulur. Örneğin, 24 farklı `filter` kullandıysak, her `pixel` 24-boyutlu bir `feature space`'te bir nokta ile temsil edilir.

## Texton'lar ve Doku Tanımlama

Bu yüksek boyutlu `feature space`'i doğrudan kullanmak yerine, genellikle "texton" adı verilen temel doku birimleri oluşturulur.

1.  **Texton'ları Bulma:** `Image`'deki tüm `pixel`'lerin doku `feature vector`'leri, K-Means gibi bir `clustering` algoritması kullanılarak gruplanır. Her bir `cluster`'ın merkezi, bir "texton" olarak adlandırılır. Texton'lar, o `image`'de bulunan temel mikro-desenleri (örneğin, "dikey çizgi parçası", "küçük benek", "yatay çizgi parçası") temsil eder.
2.  **Texton Haritası:** Her `pixel`, kendisine en yakın olan `texton` ile etiketlenerek bir "texton haritası" oluşturulur.
3.  **Doku Histogramı:** `Image`'i `segment`'lere ayırmak için, genellikle küçük pencereler (`window`) içindeki texton dağılımlarına bakılır. Her bir pencere için, içinde hangi `texton`'dan kaç tane olduğunu gösteren bir "texton histogramı" oluşturulur. Bu histogram, o pencerenin genel dokusunu tanımlayan yeni bir `feature vector` olur.
4.  **Son Clustering:** Son olarak, bu histogram `feature`'larına göre pencereler gruplanarak `image`'in doku tabanlı `segmentation`'ı gerçekleştirilir.

Bu yaklaşım, bir `image`'i sadece renge göre değil, aynı zamanda "benekli", "çizgili", "pürüzsüz" gibi algısal doku özelliklerine göre de anlamlı bölgelere ayırmamızı sağlar.
