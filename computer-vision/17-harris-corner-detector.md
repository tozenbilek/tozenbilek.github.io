---
layout: default
title: Harris Corner Detector
nav_order: 17
parent: Computer Vision
---

# "İyi" Özellikler ve Harris Köşe Dedektörü

Önceki bölümlerde, görüntülerden kenarlar gibi basit yapıları çıkarmayı öğrendik. Ancak, iki görüntüyü birbiriyle hizalamak, bir nesneyi farklı açılardan tanımak veya bir sahnenin 3D modelini oluşturmak gibi daha karmaşık görevler için, kenarlardan daha gürbüz (robust) ve ayırt edici **özelliklere (features)** ihtiyacımız var.

---

## 1. "İyi" Bir Özellik Nedir?

Bir görüntü özelliği, bir görüntünün diğerlerinde de güvenilir bir şekilde bulunabilecek, bilgi açısından zengin bir parçasıdır. İyi bir özelliğin iki ana karakteristiği olmalıdır:

1.  **Tekrarlanabilirlik (Repeatability):** Aynı 3D noktasına karşılık gelen özellik, farklı aydınlatma koşullarında, farklı bakış açılarında, ölçeklerde ve döndürmelerde de tespit edilebilmelidir.
2.  **Ayırt Edicilik (Distinctiveness / Saliency):** Özelliğin etrafındaki bölge, diğer özelliklerden kolayca ayırt edilebilecek kadar özgün bir desene sahip olmalıdır.

Bu kriterleri düşündüğümüzde, düz bir duvardaki bir nokta (ayırt edici değil) veya düz bir kenar üzerindeki bir nokta (kenar boyunca her yer birbirine benzediği için tekrarlanabilir ama ayırt edici değil) iyi bir özellik değildir.

Peki ne iyi bir özelliktir? **Köşeler (Corners)**.

---

## 2. Neden Köşeler?

Bir köşenin neden iyi bir özellik olduğunu anlamak için, görüntü üzerinde küçük bir pencereyi kaydırdığımızı hayal edelim:
*   **"Düz" Bölge:** Pencereyi hangi yöne kaydırırsak kaydıralım, pencerenin içindeki görünüm neredeyse hiç değişmez.
*   **"Kenar":** Pencereyi kenar boyunca kaydırırsak görünüm değişmez. Sadece kenara dik yönde kaydırırsak belirgin bir değişiklik olur.
*   **"Köşe":** Pencereyi hangi yöne kaydırırsak kaydıralım, görünüm her yönde de belirgin bir şekilde değişir.

İşte bu son özellik, yani her yönde de belirgin bir değişikliğe sahip olması, köşeleri hem kolayca yerelleştirilebilir (tekrarlanabilir) hem de ayırt edici kılar.

![Corner Idea](https://via.placeholder.com/700x250.png?text=Düz+Bölge+|+Kenar+|+Köşe)
*Görsel: Küçük bir pencere kaydırıldığında, düz bölgede hiçbir yönde, kenarda bir yönde, köşede ise her yönde büyük bir değişim gözlenir.*

---

## 3. Harris Köşe Dedektörü

Harris & Stephens (1988), bu sezgisel fikri matematiksel bir temele oturtan bir algoritma geliştirdiler.

1.  Görüntünün her pikseli için, x ve y yönlerindeki türevler (`Ix` ve `Iy`) hesaplanır.
2.  Her pikselin etrafındaki küçük bir pencere içindeki türevler kullanılarak 2x2'lik bir `M` matrisi oluşturulur:
    ```
    M = Σ [ Ix²    Ix*Iy ]
        [ Ix*Iy  Iy²   ]
    ```
3.  Bu `M` matrisinin **özdeğerleri (eigenvalues)**, `λ1` ve `λ2`, bize pencerenin kaydırılmasıyla oluşan değişimin ana yönlerini ve büyüklüklerini söyler.
    *   Eğer `λ1` ve `λ2` ikisi de küçükse, bu "düz" bir bölgedir.
    *   Eğer biri büyük, diğeri küçükse, bu bir "kenardır".
    *   Eğer `λ1` ve `λ2` ikisi de büyükse, bu bir **"köşedir"**.
4.  Özdeğerleri doğrudan hesaplamak yerine, Harris dedektörü daha verimli bir "köşelik" skoru `R` hesaplar:
    `R = det(M) - k * (trace(M))² = (λ1*λ2) - k * (λ1+λ2)²`

    *   `R` büyük ve pozitifse, bu bir köşedir.
    *   `R` negatifse, bu bir kenardır.
    *   `|R|` küçükse, bu düz bir bölgedir.

---

## 4. Harris Dedektörünün Sınırlılıkları

Harris köşe dedektörü, Computer Vision'da bir dönüm noktasıdır ve hala birçok uygulamada kullanılmaktadır.
*   **Döndürmeye (Rotation) Karşı Dayanıklıdır:** Görüntü döndüğünde, köşeler hala köşe olarak algılanır.
*   **Aydınlatma Değişikliklerine Karşı Dayanıklıdır:** Genel parlaklık artışı veya azalışından çok etkilenmez.

Ancak önemli bir zayıflığı vardır:
*   **Ölçeğe (Scale) Karşı Dayanıklı Değildir:** Bir görüntüye zum yapıldığında (ölçek değiştiğinde), eskiden köşe olan bir nokta artık bir kenar veya düz bir çizgi gibi görünebilir ve dedektör onu bulamayabilir.

![Scale Problem](https://via.placeholder.com/500x250.png?text=Yakınlaştırınca+Köşe+Kaybolur)
*Görsel: Uzaktan "köşe" gibi görünen bir yapı, yakınlaştırıldığında düz bir kenara dönüşebilir.*

Bu ölçek problemi, bir sonraki bölümde inceleyeceğimiz **SIFT (Scale-Invariant Feature Transform)** gibi daha modern ve güçlü özellik dedektörlerinin geliştirilmesine yol açmıştır.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Harris köşe dedektörüne göre, bir görüntü bölgesinin "köşe" olarak sınıflandırılmasının temel koşulu nedir?</p>
  <div class="quiz-option">A) Görüntü türevinin sadece x yönünde büyük olması.</div>
  <div class="quiz-option" data-correct="true">B) Küçük bir pencere kaydırıldığında, yoğunluğun her yönde de belirgin şekilde değişmesi.</div>
  <div class="quiz-option">C) Bölgenin parlaklığının belirli bir eşik değerinin üzerinde olması.</div>
  <div class="quiz-option">D) Bölgedeki piksellerin hepsinin aynı renkte olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir köşenin temel tanımı budur. Matematiksel olarak, bu durum `M` matrisinin iki özdeğerinin de büyük olmasına karşılık gelir, bu da her yönde güçlü bir gradyan olduğunu gösterir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Harris köşe dedektörünün en önemli zayıflığı aşağıdakilerden hangisidir?</p>
  <div class="quiz-option">A) Görüntü döndürüldüğünde iyi çalışmaması.</div>
  <div class="quiz-option">B) Renkli görüntülerde kullanılamaması.</div>
  <div class="quiz-option" data-correct="true">C) Görüntünün ölçeği değiştiğinde (örn: zoom yapıldığında) aynı köşeyi bulamaması.</div>
  <div class="quiz-option">D) Çok yavaş çalışması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Harris dedektörü, sabit bir pencere boyutuyla çalıştığı için ölçek değişikliklerine karşı hassastır. Bir nesneye yaklaştıkça, dedektörün "gördüğü" desen değişir ve daha önce köşe olarak algılanan bir nokta artık algılanmayabilir.</p>
  </div>
</div>
