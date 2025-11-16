---
layout: default
title: Kenar Tespiti ve Gradyanlar
nav_order: 8
parent: Computer Vision
---

# Kenar Tespiti ve Gradyanlar

Görüntülerdeki nesneleri, şekilleri ve dokuları anlamanın ilk adımı, bu yapıları birbirinden ayıran sınırları, yani **edges (kenarları)** bulmaktır. Kenarlar, bir görüntüdeki en temel ve bilgi açısından en zengin özelliklerden biridir.

---

## 1. Kenar Nedir?

Bir kenar, görüntü fonksiyonunun yoğunluk değerinde ani ve belirgin bir değişikliğin meydana geldiği yerdir. Bu değişiklikler genellikle fiziksel dünyadaki önemli olaylara karşılık gelir:
*   **Nesne Sınırları:** Bir nesnenin bittiği ve arka planın başladığı yer.
*   **Yüzey Normali Değişiklikleri:** Bir nesnenin yüzeyinin yön değiştirdiği yerler (örneğin, bir küpün köşeleri).
*   **Doku ve Renk Değişiklikleri:** Bir yüzey üzerindeki desen veya renk farklılıkları.
*   **Gölge Sınırları:** Bir nesnenin üzerine düşen gölgenin oluşturduğu sınırlar.

![Edges](https://via.placeholder.com/600x250.png?text=Görüntü+->+Kenar+Haritası)
*Görsel: Bir görüntüdeki kenarlar, sahnenin yapısal bir "çizimini" oluşturur.*

---

## 2. Kenarları Matematikle Bulmak: Türev ve Gradyan

Görüntü fonksiyonundaki bu "ani değişiklikleri" ölçmek için matematikteki **türev** kavramını kullanırız. 1D bir sinyal için türev, fonksiyonun değişim oranını verir. Kenarlar, bu türevin tepe (pozitif veya negatif) yaptığı noktalara karşılık gelir.

### Görüntü Gradyanı
2D bir görüntü için, her yöndeki değişimi ölçmemiz gerekir. Bu, **image gradient (`∇I` - görüntü gradyanı)** ile yapılır. Gradyan, görüntünün x ve y yönlerindeki kısmi türevlerinden oluşan bir vektördür:

`∇I = [ ∂I/∂x, ∂I/∂y ]`

Bu vektör bize iki önemli bilgi verir:
1.  **Gradient Magnitude (Gradyan Büyüklüğü):** Kenarın ne kadar "güçlü" veya "keskin" olduğunu belirtir.
    `mag(∇I) = sqrt( (∂I/∂x)² + (∂I/∂y)² )`
2.  **Gradient Orientation (Gradyan Yönü):** Kenarın hangi yöne dik olduğunu, yani yoğunluğun en hızlı arttığı yönü gösterir.
    `ori(∇I) = atan2( ∂I/∂y, ∂I/∂x )`

---

## 3. Ayrık Türevler ve Sobel Filtresi

Dijital görüntüler ayrık piksellerden oluştuğu için, türevi tam olarak hesaplayamayız. Bunun yerine, **finite differences (sonlu farklar)** kullanarak onu yaklaşık olarak hesaplarız. Bu, filtreleme (konvolüsyon) ile kolayca yapılabilir.

Örneğin, x yönündeki türevi `[-1, 1]` kerneli ile bir konvolüsyon olarak düşünebiliriz. Ancak bu kernel gürültüye karşı çok hassastır ve tam olarak piksel merkezine hizalı değildir.

### Sobel Operatörü
Daha `robust` (gürbüz) bir yaklaşım, hem türev almayı hem de bir miktar `smoothing` (pürüzsüzleştirme) yapmayı birleştiren **Sobel operatörünü** kullanmaktır. Sobel operatörü, x ve y yönleri için iki ayrı 3x3 kernel kullanır:

![Sobel Kernels](https://via.placeholder.com/400x150.png?text=Sobel+X+Kernel+|+Sobel+Y+Kernel)

Bu kerneller, görüntüye ayrı ayrı uygulanarak `∂I/∂x` ve `∂I/∂y` gradyan bileşenleri elde edilir. Ardından bu bileşenler kullanılarak her piksel için gradyan büyüklüğü ve yönü hesaplanır.

---

## 4. Gürültü Sorunu

Türev işlemleri, doğası gereği pikseller arasındaki küçük farklılıkları vurgular. Bu, ne yazık ki gürültüyü de aşırı derecede güçlendirdikleri anlamına gelir. Gürültülü bir görüntüye doğrudan bir türev filtresi uygulamak, genellikle kullanılamaz, gürültülü bir sonuç üretir.

**Çözüm:** Türev almadan önce, görüntüyü bir **Gaussian filtresiyle pürüzsüzleştirmek**. Bu ön işleme adımı, gürültüyü bastırır ve sadece daha belirgin, "gerçek" kenarların tespit edilmesini sağlar. Hatta bu iki adım birleştirilerek tek bir **"Derivative of Gaussian" (DoG)** filtresi oluşturulabilir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Görüntü gradyanının `magnitude` (büyüklüğü) bize ne ifade eder?</p>
  <div class="quiz-option">A) Kenarın hangi yöne baktığını.</div>
  <div class="quiz-option" data-correct="true">B) Kenarın ne kadar keskin veya güçlü olduğunu.</div>
  <div class="quiz-option">C) Görüntünün genel parlaklığını.</div>
  <div class="quiz-option">D) Pikselin rengini.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gradyan büyüklüğü, görüntü fonksiyonundaki değişim oranının miktarını ölçer. Büyük bir gradyan büyüklüğü, pikseller arasında yüksek bir yoğunluk farkı olduğunu, yani güçlü ve keskin bir kenar bulunduğunu gösterir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Kenar tespiti algoritmalarında, türev filtrelerini uygulamadan önce genellikle bir Gaussian filtresi uygulanmasının ana sebebi nedir?</p>
  <div class="quiz-option">A) Görüntüyü keskinleştirmek.</div>
  <div class="quiz-option">B) Görüntüyü renklendirmek.</div>
  <div class="quiz-option" data-correct="true">C) Türev işleminin vurgulayacağı gürültüyü azaltmak.</div>
  <div class="quiz-option">D) Görüntünün boyutunu küçültmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Türev operatörleri, pikseller arasındaki en küçük farkları bile güçlendirir. Bu, gürültünün de kenarlar gibi algılanmasına neden olabilir. Gaussian filtresi ile önceden pürüzsüzleştirme yapmak, bu gürültüyü bastırır ve algoritmanın sadece anlamlı kenarlara odaklanmasını sağlar.</p>
  </div>
</div>

