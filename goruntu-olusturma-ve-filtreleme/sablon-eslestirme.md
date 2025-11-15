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

<div class="quiz-question">
  <p><b>Soru 1:</b> Şablon eşleştirme (template matching) için neden ham `cross-correlation` yerine `Normalized Cross-Correlation (NCC)` kullanmak genellikle daha iyidir?</p>
  <div class="quiz-option">A) NCC hesaplama açısından daha hızlıdır.</div>
  <div class="quiz-option">B) NCC, şablonun döndürülmüş hallerini bulabilir.</div>
  <div class="quiz-option" data-correct="true">C) NCC, görüntüdeki aydınlatma ve kontrast değişikliklerine karşı daha dayanıklıdır.</div>
  <div class="quiz-option">D) NCC, sadece renkli görüntülerde çalışır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Ham `cross-correlation`, piksellerin mutlak parlaklık değerlerine duyarlıdır. Bu nedenle, görüntüdeki bir bölge şablonla aynı desene sahip olsa bile, daha aydınlık veya karanlıksa eşleşme skoru düşük çıkar. NCC, hem şablonu hem de görüntü bölgesini normalleştirerek bu parlaklık ve kontrast farklarını ortadan kaldırır, bu da onu çok daha güvenilir bir eşleştirme yöntemi yapar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Standart bir şablon eşleştirme algoritmasının en büyük zayıflığı aşağıdakilerden hangisidir?</p>
  <div class="quiz-option">A) Gürültülü görüntülerde çalışmaması.</div>
  <div class="quiz-option" data-correct="true">B) Şablonun görüntüdeki ölçek (boyut) ve rotasyon (dönme) değişimlerine karşı hassas olması.</div>
  <div class="quiz-option">C) Sadece küçük boyutlu şablonlarla çalışabilmesi.</div>
  <div class="quiz-option">D) Yüksek hesaplama maliyetine sahip olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Standart şablon eşleştirme, pikselleri birebir karşılaştırır. Eğer görüntüdeki nesne, şablona göre farklı bir boyutta veya açıda ise, piksel desenleri eşleşmeyecek ve algoritma nesneyi bulamayacaktır. Bu sınırlamayı aşmak için şablonun farklı boyut ve açılardaki versiyonlarıyla arama yapmak veya SIFT gibi daha gelişmiş yöntemler kullanmak gerekir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Şablon eşleştirme (template matching) aşağıdaki senaryolardan hangisi için en uygun yöntemdir?</p>
  <div class="quiz-option">A) Kalabalık bir caddedeki belirli bir insan yüzünü bulmak.</div>
  <div class="quiz-option">B) Bir orman fotoğrafındaki tüm ağaçları saymak.</div>
  <div class="quiz-option" data-correct="true">C) Bir üretim bandında, her zaman aynı konumda ve açıda görünen bir ürünün varlığını kontrol etmek.</div>
  <div class="quiz-option">D) Bir belgedeki el yazısı metni okumak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Şablon eşleştirme, aranan nesnenin görünümünün (boyut, açı, aydınlatma) çok az değiştiği kontrollü ortamlarda en iyi sonucu verir. Bir üretim bandı bu koşulları sağladığı için ideal bir kullanım alanıdır. Diğer senaryolar, görünümde çok fazla değişkenlik içerdiği için şablon eşleştirmenin zayıf kalacağı durumlardır.</p>
  </div>
</div>
