---
layout: default
title: Template Matching
parent: 2. Image Formation ve Filtering
nav_order: 6
---

# Template Matching

`Filter`'ları sadece `noise` azaltmak veya `derivative` almak için değil, aynı zamanda bir `image` içinde belirli bir deseni veya **template**'i bulmak için de kullanabiliriz. Bu işleme **template matching** denir ve temel olarak bir "bulmaca" oyununa benzer: küçük bir `image` (`template`), büyük bir `image`'in (sahne) neresinde olduğunu bulmaya çalışırız.

## Filter'ları Template Olarak Anlamak

Bir `filter kernel`'i, aslında küçük bir `template`'dir. `Filtering` işlemi (`correlation`), bu `template`'i `image` üzerinde her pozisyonda gezdirerek o bölgenin `template`'e ne kadar "benzediğini" ölçer.
- Yüksek bir `filter` çıktısı, `image`'deki o bölgenin `template` ile yüksek bir `correlation`'a sahip olduğunu, yani benzediğini gösterir.
- Düşük bir `filter` çıktısı, benzemediklerini gösterir.

Bu mantıkla, aradığımız nesneyi içeren küçük bir `image`'i (`template`) alıp, onu büyük `image` (sahne) üzerinde bir `filter` gibi gezdirerek nesnenin yerini bulabiliriz.

## Normalized Cross-Correlation (NCC)

Basit `cross-correlation`, aydınlatma değişikliklerine karşı çok hassastır. Örneğin, `image`'deki bir bölge `template` ile aynı desene sahip olsa bile, daha karanlık veya daha parlaksa, `correlation` skoru düşük çıkabilir.

Bu problemi çözmek için **Normalized Cross-Correlation (NCC)** kullanılır. NCC, hem `template`'in hem de karşılaştırılan `image` bölgesinin `pixel` `intensity`'lerini kendi ortalamalarına ve standart sapmalarına göre normalleştirir. Bu sayede:
- **Aydınlatma Bağımsızlığı:** Parlaklık ve kontrasttaki doğrusal değişimlerden etkilenmez.
- **Güvenilir Skor:** Sonuçları her zaman `-1` (mükemmel anti-korelasyon) ile `+1` (mükemmel eşleşme) arasında bir skor olarak verir.

NCC uygulandığında, çıktı olarak bir **correlation map** elde edilir. Bu haritadaki her `pixel`'in değeri, `template`'in merkezinin o `pixel`'e yerleştirildiğinde elde edilen eşleşme skorunu gösterir. Aradığımız nesnenin konumu, bu haritadaki en yüksek tepe (`peak`) noktasının koordinatlarıdır.

## Template Matching'in Sınırlılıkları

`Template matching` basit ve etkili bir yöntem olmasına rağmen, önemli kısıtlamaları vardır:

1.  **Scale Changes:** Eğer `image`'deki nesne, `template`'den daha büyük veya daha küçükse, eşleşme skoru önemli ölçüde düşer ve tespit başarısız olabilir.
2.  **Rotation:** `Image`'deki nesne `template`'e göre döndürülmüşse, NCC onu bulamaz.
3.  **Viewpoint Changes:** Nesnenin bakış açısı değiştiğinde (örneğin, yandan yerine üstten bakıldığında), `template` artık eşleşmez.
4.  **Occlusion:** Nesnenin bir kısmı başka bir nesnenin arkasında kalarak gizlenmişse, eşleşme zorlaşır.
5.  **Deformation:** Esnek veya şekil değiştiren nesneler için uygun değildir.

Bu sınırlılıklardan dolayı, `template matching` en iyi, aranan nesnenin boyutu, yönelimi ve görünümünün çok fazla değişmediği kontrollü ortamlarda çalışır (örneğin, bir üretim bandındaki parçaları bulmak gibi). Daha karmaşık senaryolar için, ilerleyen konularda göreceğimiz `feature-based` yöntemler daha güçlüdür.
