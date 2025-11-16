---
layout: default
title: Harris Köşe Dedektörü (Harris Corner Detector)
nav_order: 17
parent: Computer Vision
---

# "İyi" Özellikler ve Harris Köşe Dedektörü

Önceki bölümlerde, görüntülerden kenarlar gibi basit yapıları çıkarmayı öğrendik. Ancak, iki görüntüyü birbiriyle hizalamak, bir nesneyi farklı açılardan tanımak veya bir sahnenin 3D modelini oluşturmak gibi daha karmaşık görevler için, kenarlardan daha `robust` (gürbüz) ve ayırt edici **features (özelliklere)** ihtiyacımız var.

---

## 1. "İyi" Bir Özellik Nedir?

Bir görüntü özelliği, bir görüntünün diğerlerinde de güvenilir bir şekilde bulunabilecek, bilgi açısından zengin bir parçasıdır. İyi bir özelliğin iki ana karakteristiği olmalıdır:

1.  **Repeatability (Tekrarlanabilirlik):** Aynı 3D noktasına karşılık gelen özellik, farklı aydınlatma koşullarında, farklı bakış açılarında, ölçeklerde ve döndürmelerde de tespit edilebilmelidir.
2.  **Distinctiveness / Saliency (Ayırt Edicilik):** Özelliğin etrafındaki bölge, diğer özelliklerden kolayca ayırt edilebilecek kadar özgün bir desene sahip olmalıdır.

Bu kriterleri düşündüğümüzde, düz bir duvardaki bir nokta (ayırt edici değil) veya düz bir kenar üzerindeki bir nokta (kenar boyunca her yer birbirine benzediği için tekrarlanabilir ama ayırt edici değil) iyi bir özellik değildir.

Peki ne iyi bir özelliktir? **Corners (Köşeler)**.

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

## 3. Harris Köşe Dedektörü: Matematiksel Sezgi

Harris & Stephens (1988), bu sezgisel fikri matematiksel bir temele oturtan bir algoritma geliştirdiler.

1.  Her pikselin etrafındaki küçük bir pencere içindeki gradyan (türev) bilgileri kullanılarak 2x2'lik bir `M` matrisi (yapı tensörü) oluşturulur:
    ```
    M = Σ [ Ix²    Ix*Iy ]
        [ Ix*Iy  Iy²   ]
    ```
    Burada `Σ` (toplam), pencere üzerindeki tüm pikseller için bir ağırlıklı toplamı (genellikle Gaussian ağırlıklı) ifade eder. `Ix` ve `Iy`, o pikseldeki x ve y yönlerindeki görüntü türevleridir.

2.  Bu `M` matrisinin **eigenvalues (özdeğerleri)**, `λ1` ve `λ2`, bize gradyanın dağılımını, yani pencere kaydırıldığında yoğunluğun hangi yönlerde ve ne kadar değiştiğini söyler.
    *   Eğer `λ1` ve `λ2` ikisi de küçükse, bu "düz" bir bölgedir.
    *   Eğer biri büyük, diğeri küçükse, bu bir "kenardır".
    *   Eğer `λ1` ve `λ2` ikisi de büyükse, bu bir **"köşedir"**.

<pre>
Özdeğerlerin Yorumu (Gradyan Dağılım Elipsi):

  λ2
  ^
  |
  +-------+
  | Köşe  |   (λ1 ve λ2 büyük) --> Belirgin bir elips yok, her yönde değişim
  +-------+
  | Kenar |   (λ1 büyük, λ2 küçük) --> Yatay ince bir elips
--+-------+--> λ1
  | Düz   |   (λ1 ve λ2 küçük) --> Merkezde küçük bir nokta
  +-------+

</pre>

3.  Özdeğerleri doğrudan hesaplamak yerine, Harris dedektörü daha verimli bir **"köşelik" skoru (`R`)** hesaplar:
    `R = det(M) - k * (trace(M))² = (λ1*λ2) - k * (λ1+λ2)²`

    *   `R` büyük ve pozitifse, bu bir köşedir.
    *   `R` negatifse, bu bir kenardır.
    *   `|R|` küçükse, bu düz bir bölgedir.

---

## 4. Harris Dedektörü Algoritmasının Adımları

Pratikte algoritma şu adımlarla çalışır:
1.  **Gradyan Hesaplama:** Görüntünün x ve y türevlerini (`Ix`, `Iy`) hesapla (örn: Sobel filtresi ile).
2.  **Gradyan Ürünleri:** `Ix²`, `Iy²` ve `Ix*Iy` görüntülerini oluştur.
3.  **Toplama:** Bu üç görüntü üzerinde küçük bir Gaussian filtre gezdir. Bu, her piksel için `M` matrisinin elemanlarını etkin bir şekilde hesaplar.
4.  **Köşelik Skoru:** Her piksel için `R` skorunu hesaplayarak bir "köşelik haritası" oluştur.
5.  **Non-Maximum Suppression (Maksimum Olmayanı Bastırma):** Köşelerin tek ve hassas bir pikselde tespit edilmesi için, `R` haritasındaki yerel maksimumları bul. Yani, bir pikselin `R` skoru, etrafındaki 8 komşusundan daha büyük değilse, o pikseli köşe olarak kabul etme. Bu, köşe etrafındaki "kalın" tepkileri tek bir noktaya indirger.

---

## 5. Harris Dedektörünün Özellikleri ve Sınırlılıkları

Harris köşe dedektörü, Computer Vision'da bir dönüm noktasıdır ve hala birçok uygulamada kullanılmaktadır.
*   **Rotation (Döndürmeye) Karşı Dayanıklıdır:** Görüntü döndüğünde, köşeler hala köşe olarak algılanır.
*   **Aydınlatma Değişikliklerine Karşı Dayanıklıdır:** Genel parlaklık artışı veya azalışından çok etkilenmez.

Ancak önemli bir zayıflığı vardır:
*   **Scale (Ölçeğe) Karşı Dayanıklı Değildir:** Bir görüntüye zum yapıldığında (ölçek değiştiğinde), eskiden köşe olan bir nokta artık bir kenar veya düz bir çizgi gibi görünebilir ve dedektör onu bulamayabilir.

![Scale Problem](https://via.placeholder.com/500x250.png?text=Yakınlaştırınca+Köşe+Kaybolur)
*Görsel: Uzaktan "köşe" gibi görünen bir yapı, yakınlaştırıldığında düz bir kenara dönüşebilir.*

Bu ölçek problemi, bir sonraki bölümde inceleyeceğimiz **SIFT (Scale-Invariant Feature Transform)** gibi daha modern ve güçlü özellik dedektörlerinin geliştirilmesine yol açmıştır.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> Harris köşe dedektörüne göre, bir görüntü bölgesinin "köşe" olarak sınıflandırılmasının temel koşulu nedir?</p>
  <div class="quiz-option">A) Görüntü türevinin sadece x yönünde büyük olması.</div>
  <div class="quiz-option" data-correct="true">B) Küçük bir pencere kaydırıldığında, yoğunluğun her yönde de belirgin şekilde değişmesi.</div>
  <div class="quiz-option">C) Bölgenin parlaklığının belirli bir eşik değerinin üzerinde olması.</div>
  <div class="quiz-option">D) Bölgedeki piksellerin hepsinin aynı renkte olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir köşenin temel tanımı budur. Matematiksel olarak, bu durum `M` matrisinin iki özdeğerinin de büyük olmasına karşılık gelir, bu da her yönde güçlü bir gradyan olduğunu gösterir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Harris köşe dedektörünün en önemli zayıflığı aşağıdakilerden hangisidir?</p>
  <div class="quiz-option">A) Görüntü döndürüldüğünde iyi çalışmaması.</div>
  <div class="quiz-option">B) Renkli görüntülerde kullanılamaması.</div>
  <div class="quiz-option" data-correct="true">C) Görüntünün ölçeği değiştiğinde (örn: zoom yapıldığında) aynı köşeyi bulamaması.</div>
  <div class="quiz-option">D) Çok yavaş çalışması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Harris dedektörü, sabit bir pencere boyutuyla çalıştığı için ölçek değişikliklerine karşı hassastır. Bir nesneye yaklaştıkça, dedektörün "gördüğü" desen değişir ve daha önce köşe olarak algılanan bir nokta artık algılanmayabilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Görüntüde belirgin bir **dikey kenar** üzerindeki bir piksel için Harris dedektörünün `M` matrisini oluşturan `Ix` ve `Iy` türevleri hakkında ne beklersiniz?</p>
  <div class="quiz-option" data-correct="true">A) `Ix` büyük, `Iy` sıfıra yakın olur.</div>
  <div class="quiz-option">B) `Iy` büyük, `Ix` sıfıra yakın olur.</div>
  <div class="quiz-option">C) Hem `Ix` hem de `Iy` büyük olur.</div>
  <div class="quiz-option">D) Hem `Ix` hem de `Iy` sıfıra yakın olur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Dikey bir kenar, yatay (x) yönde büyük bir yoğunluk değişimi gösterir, bu nedenle `Ix` gradyanı büyük olur. Ancak dikey (y) yön boyunca yoğunluk değişmediği için `Iy` gradyanı sıfıra yakın olacaktır. Bu durum, `M` matrisinin özdeğerlerinden birinin büyük, diğerinin küçük olmasına yol açar ve bölgenin "kenar" olarak sınıflandırılmasına neden olur.</p>
  </div>
</div>

