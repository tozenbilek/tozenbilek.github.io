---
layout: default
title: Harris Corner Detector
parent: 5. Feature Detection ve Matching
nav_order: 1
---

# Harris Corner Detector

`Template matching` gibi yöntemlerin, nesnenin `scale` ve `rotation`'ındaki değişimlere karşı ne kadar hassas olduğunu gördük. Daha sağlam bir yaklaşım, `image`'ler arasında eşleştirilebilecek **ilgi noktaları (interest points)** veya **özellikleri (features)** tespit etmektir. Peki, "iyi" bir `feature` ne anlama gelir?

İyi bir `feature`, ayırt edici ve tekrar bulunabilir olmalıdır. Yani, farklı aydınlatma koşullarında, farklı açılardan bakıldığında veya ölçeği değiştiğinde bile güvenilir bir şekilde tespit edilebilmelidir. `Image`'lerdeki **köşeler (corners)**, bu tanıma uyan en iyi adaylardan biridir.

## Köşeleri Neden Severiz?

Bir `image`'deki küçük bir pencereyi (patch) düşünelim. Bu pencereyi hafifçe kaydırdığımızda `image` içeriği ne kadar değişir?
- **Düz bir duvarda ("Flat" region):** Pencereyi nereye kaydırırsak kaydıralım, içeriği neredeyse hiç değişmez. Bu bölge ayırt edici değildir.
- **Bir pencere kenarında ("Edge" region):** Pencereyi kenar boyunca kaydırırsak içeriği pek değişmez, ama kenara dik yönde kaydırırsak içeriği aniden değişir. Bu bölge tek yönde ayırt edicidir.
- **Bir pencere köşesinde ("Corner" region):** Pencereyi **hangi yöne** kaydırırsak kaydıralım, içeriği belirgin bir şekilde değişir. Bu bölge her yönde ayırt edicidir ve bu yüzden iyi bir `feature`'dır.

![Harris Corner Detection Intuition](https://placehold.co/800x300/EEE/31343C?text=Düz+Bölge+(Her+Yöne+Benzer)+|+Kenar+(1+Yön+Farklı)+|+Köşe+(Her+Yön+Farklı))
*<center>Harris Corner Detector'ın temel fikri: Pencereyi kaydırdığımızda oluşan değişimin analizi. Köşeler, her yönde büyük değişime neden olan bölgelerdir.</center>*

## Harris Detector Matematiği

Harris Corner Detector, yukarıdaki fikri matematiksel olarak formüle eder. Bir `(x,y)` `pixel`'i etrafındaki bir pencere için, bu pencerenin `(u,v)` kadar kaydırılmasıyla oluşan `intensity` değişimini `E(u,v)` olarak tanımlar:

`E(u,v) = Σ [ w(x,y) * (I(x+u, y+v) - I(x,y)) ]²`

Burada `w(x,y)` bir ağırlıklandırma fonksiyonudur (genellikle Gaussian). Bu ifadeyi Taylor serisi ile açıp basitleştirdiğimizde, `E(u,v)`'nin `(u,v)` vektörüne bağlı kuadratik bir forma dönüştüğünü görürüz:

`E(u,v) ≈ [u, v] * M * [u; v]`

Buradaki `M` matrisi, **Harris Matrisi** veya **Structure Tensor** olarak bilinir ve `image`'in o penceredeki `gradient` bilgisini özetler:

\[ M = \begin{bmatrix} \Sigma I_x^2 & \Sigma I_xI_y \\ \Sigma I_xI_y & \Sigma I_y^2 \end{bmatrix} \]

Bu `M` matrisinin **özdeğerleri (eigenvalues)**, `λ₁` ve `λ₂`, bize penceredeki `intensity` değişiminin iki ana yönü ve büyüklüğü hakkında bilgi verir:
- **Düz Bölge:** İki özdeğer de küçüktür.
- **Kenar:** Bir özdeğer büyük, diğeri küçüktür.
- **Köşe:** İki özdeğer de büyüktür.

Özdeğerleri doğrudan hesaplamak yerine, Harris, `cornerness` skoru `R`'yi matrisin `determinant` ve `trace`'inden (`iz`) hesaplayan daha verimli bir yöntem önerir:

`R = det(M) - k * trace(M)² = λ₁λ₂ - k(λ₁+λ₂)²`

- `k` ampirik bir sabittir (genellikle 0.04-0.06 arası).
- `R`'nin değeri, bölgenin köşe olup olmadığını belirler.

![Eigenvalues and Cornerness](https://placehold.co/500x400/EEE/31343C?text=λ1+ve+λ2'ye+göre+Bölge+Tipi+(Düz,+Kenar,+Köşe))
*<center>M matrisinin özdeğerleri (λ1, λ2), bölgenin tipini belirler. İki özdeğer de büyükse, bu bir köşedir.</center>*

## Harris Corner Detector Algoritması
1. Görüntüyü gri seviyeye çevir.
2. Her `pixel` için x ve y yönlerindeki uzamsal türevleri (`Ix`, `Iy`) hesapla.
3. Her `pixel` için `Ix²`, `Iy²`, ve `IxIy` değerlerini hesapla.
4. Bu değerleri her `pixel` etrafındaki bir Gaussian penceresi ile toplayarak `M` matrisinin bileşenlerini oluştur.
5. Her `pixel` için `R` `cornerness` skorunu hesapla.
6. `R` değeri belirli bir `threshold`'un üzerinde olan ve kendi komşuluğunda `local maxima` olan `pixel`'leri köşe olarak işaretle (`Non-Maximum Suppression`).

---

## Özet ve Anahtar Kavramlar

-   **İyi Özellik (Good Feature):** Farklı ve tekrarlanabilir bir şekilde tespit edilebilen, `image`'deki ayırt edici bir bölgedir. Köşeler, bu tanıma uyan en iyi özelliklerden biridir.
-   **Harris Corner Detector Fikri:** Küçük bir pencereyi her yöne kaydırdığımızda `pixel` `intensity`'lerinin ne kadar değiştiğini analiz eder. Değişim her yönde büyükse, orası bir köşedir.
-   **M Matrisi (Structure Tensor):** Bir pencere içindeki `gradient`lerin dağılımını özetleyen 2x2'lik bir matristir.
-   **Eigenvalues (Özdeğerler - `λ₁, λ₂`):** `M` matrisinin özdeğerleri, `gradient`'in iki ana yöndeki büyüklüğünü temsil eder. İki özdeğer de büyükse, bu bir köşeye işaret eder.
-   **Cornerness (R Skoru):** Bir `pixel`'in köşe olma olasılığını ölçen ve matrisin `determinant` ve `trace`'inden (`iz`) türetilen bir skordur.
-   **Non-Maximum Suppression:** Birbirine çok yakın olan birden fazla köşe tespitini tek bir baskın köşeye indirme işlemidir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Harris Corner Detector'da, `M` matrisinin iki özdeğerinin de (`λ₁`, `λ₂`) büyük ve birbirine yakın olması ne anlama gelir?</p>
  <div class="quiz-option">A) Bölgenin düz ve homojen bir alana ait olduğu.</div>
  <div class="quiz-option">B) Bölgede düz bir kenar (edge) olduğu.</div>
  <div class="quiz-option" data-correct="true">C) Bölgede bir köşe (corner) olduğu.</div>
  <div class="quiz-option">D) Bölgede gürültü olduğu.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> İki özdeğerin de büyük olması, küçük pencerenin her iki yönde de hareket ettirildiğinde görüntü yoğunluğunda büyük bir değişim olduğunu gösterir. Bu durum sadece köşeler için geçerlidir. Düz alanlarda her iki özdeğer de küçük, kenarlarda ise biri büyük diğeri küçük olur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Harris Corner Detector'ın aşağıdaki geometrik dönüşümlerden hangisine karşı `invariant` (değişmez) **olmadığı** söylenebilir?</p>
  <div class="quiz-option">A) Görüntünün ötelenmesi (Translation).</div>
  <div class="quiz-option">B) Görüntünün döndürülmesi (Rotation).</div>
  <div class="quiz-option" data-correct="true">C) Görüntünün ölçeklenmesi (Scaling).</div>
  <div class="quiz-option">D) Görüntünün parlaklığının değişmesi (Brightness change).</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Harris, sabit boyutlu bir pencere kullandığı için ölçek değişimlerine duyarlıdır. Görüntü büyütülürse, bir köşe artık bir kenar gibi görünebilir; görüntü küçültülürse, bir köşe tüm detayını kaybedebilir. Algoritma, rotasyon ve ötelemeye karşı değişmezdir. Parlaklık değişimlerine karşı da kısmen dayanıklıdır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Köşe yanıt fonksiyonu `R = det(M) - k * trace(M)²` denkleminde, `trace(M)²` teriminin rolü nedir?</p>
  <div class="quiz-option">A) Köşelerin skorunu artırmak.</div>
  <div class="quiz-option" data-correct="true">B) Kenarların (edges) köşe olarak algılanmasını bastırmak ve skorlarını düşürmek.</div>
  <div class="quiz-option">C) Düz alanların skorunu artırmak.</div>
  <div class="quiz-option">D) Algoritmanın hızını artırmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kenar bölgelerinde, özdeğerlerden biri büyük, diğeri ise çok küçüktür (`λ₁ >> λ₂ ≈ 0`). Bu durumda `det(M) = λ₁λ₂` küçük, ancak `trace(M) = λ₁+λ₂` büyük olur. `trace(M)²` terimi, bu durumu "cezalandırarak" kenarların köşe yanıt skorunu düşürür ve sadece her iki özdeğerin de büyük olduğu gerçek köşelerin yüksek skor almasını sağlar.</p>
  </div>
</div>
