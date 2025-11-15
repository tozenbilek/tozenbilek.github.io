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

![Template Matching Örneği](https://placehold.co/800x300/EEE/31343C?text=Sahne+|+Şablon+|+Correlation+Map+(En+Parlak+Nokta))
*<center>Solda sahne, ortada aranan şablon (template) ve sağda Normalized Cross-Correlation sonucu (correlation map). En parlak nokta, şablonun bulunduğu yeri gösterir.</center>*

## Template Matching'in Sınırlılıkları

`Template matching` basit ve etkili bir yöntem olmasına rağmen, önemli kısıtlamaları vardır:

1.  **Scale Changes:** Eğer `image`'deki nesne, `template`'den daha büyük veya daha küçükse, eşleşme skoru önemli ölçüde düşer ve tespit başarısız olabilir.
2.  **Rotation:** `Image`'deki nesne `template`'e göre döndürülmüşse, NCC onu bulamaz.
3.  **Viewpoint Changes:** Nesnenin bakış açısı değiştiğinde (örneğin, yandan yerine üstten bakıldığında), `template` artık eşleşmez.
4.  **Occlusion:** Nesnenin bir kısmı başka bir nesnenin arkasında kalarak gizlenmişse, eşleşme zorlaşır.
5.  **Deformation:** Esnek veya şekil değiştiren nesneler için uygun değildir.

Bu sınırlılıklardan dolayı, `template matching` en iyi, aranan nesnenin boyutu, yönelimi ve görünümünün çok fazla değişmediği kontrollü ortamlarda çalışır (örrneğin, bir üretim bandındaki parçaları bulmak gibi). Daha karmaşık senaryolar için, ilerleyen konularda göreceğimiz `feature-based` yöntemler daha güçlüdür.

---

## Özet ve Anahtar Kavramlar

-   **Template Matching:** Küçük bir şablon (template) görüntüsünün, daha büyük bir sahne görüntüsü içindeki yerini bulma işlemidir.
-   **Correlation as Matching:** Filtreleme (`correlation`) işlemi, bir şablonun görüntüdeki bir bölgeye ne kadar benzediğini ölçmek için kullanılabilir. Çıktının yüksek olması, yüksek benzerlik anlamına gelir.
-   **Normalized Cross-Correlation (NCC):** `Cross-correlation`'ın aydınlatma ve kontrasttaki değişimlerden etkilenmeyen, normalleştirilmiş bir versiyonudur. Eşleşme skorunu `-1` ile `+1` arasında güvenilir bir aralığa getirir.
-   **Correlation Map:** NCC operasyonunun çıktısıdır. Bu haritadaki en parlak `pixel`, şablonun en iyi eşleştiği konumu belirtir.
-   **Sınırlılıklar:** `Template matching`, şablonun **ölçek, rotasyon, bakış açısı** ve aydınlatma değişikliklerine karşı hassastır.

---

## Kavrama Soruları

<details>
  <summary><b>Soru 1:</b> Normal `cross-correlation` yerine neden genellikle `Normalized Cross-Correlation (NCC)` tercih edilir?</summary>
  <p>Normal `cross-correlation`, `pixel`'lerin ham `intensity` değerlerine dayandığı için aydınlatma değişimlerinden çok etkilenir. Bir bölge aranan desenle aynı olsa bile, daha karanlık veya parlaksa, `correlation` skoru düşük çıkar. NCC ise hem şablonu hem de görüntü bölgesini kendi ortalamalarına ve standart sapmalarına göre normalleştirdiği için bu tür aydınlatma ve kontrast değişimlerinden etkilenmez, bu da onu çok daha güvenilir bir eşleştirme metriği yapar.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Bir `template matching` algoritması, aradığı nesnenin sahnede 90 derece dönmüş halini bulabilir mi? Neden?</summary>
  <p>Genellikle bulamaz. `Template matching`, `pixel` `pixel`'e bir karşılaştırma yapar. Nesne döndürüldüğünde, `pixel` deseni tamamen değişir ve şablonla olan benzerlik (NCC skoru) dramatik bir şekilde düşer. Döndürülmüş nesneleri bulmak için ya şablonun döndürülmüş versiyonlarıyla da arama yapmak ya da SIFT gibi rotasyona dayanıklı `feature-based` yöntemler kullanmak gerekir.</p>
</details>

<details>
  <summary><b>Soru 3:</b> `Template matching`'in başarılı bir şekilde kullanılabileceği gerçek hayattan bir uygulama örneği verin.</summary>
  <p>Bir üretim hattında, konveyör bandı üzerinde ilerleyen belirli bir ürünün (örneğin, bir vida veya elektronik çip) konumunu tespit etmek için kullanılabilir. Bu ortamda aydınlatma, nesnenin boyutu, yönelimi ve bakış açısı genellikle sabit ve kontrol altında olduğu için `template matching`'in sınırlılıkları bir sorun teşkil etmez ve hızlı ve güvenilir bir şekilde çalışır.</p>
</details>
