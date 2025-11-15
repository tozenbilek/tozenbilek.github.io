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

![Harris Corner Detection Intuition](https://via.placeholder.com/800x300.png?text=Düz+Bölge+(Her+Yöne+Benzer)+|+Kenar+(1+Yön+Farklı)+|+Köşe+(Her+Yön+Farklı))
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

![Eigenvalues and Cornerness](https://via.placeholder.com/500x400.png?text=λ1+ve+λ2'ye+göre+Bölge+Tipi+(Düz,+Kenar,+Köşe))
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

<details>
  <summary><b>Soru 1:</b> Neden düz bölgeler veya düz kenarlar "iyi" `feature` olarak kabul edilmez?</summary>
  <p>Düz bölgeler, `intensity`'leri neredeyse aynı olan `pixel`'lerden oluşur. Bu bölgeden alınan bir yama (patch), görüntünün başka bir yerindeki düz bir bölgeyle tamamen aynı görünebilir. Benzer şekilde, bir kenar boyunca alınan bir yama, o kenarın farklı bir noktasından alınan bir yamadan ayırt edilemez (aperture problemi). Bu belirsizlik, bu bölgelerin güvenilir bir şekilde eşleştirilmesini imkansız kılar. Köşeler ise iki yönde de belirgin `gradient`'lere sahip oldukları için bu belirsizlik sorununu yaşamazlar.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Harris Corner Detector'ın `k` parametresi (`R = det(M) - k*trace(M)²` denklemindeki) ne işe yarar ve değerini değiştirmek sonucu nasıl etkiler?</summary>
  <p>`k`, ampirik olarak belirlenen bir hassasiyet parametresidir (genellikle 0.04-0.06 arası). `trace(M)²` terimi, `R` skorunun kenarlara karşı daha az hassas olmasını sağlar (çünkü kenarlarda bir özdeğer büyükken diğeri küçüktür, bu da `trace`'i `determinant`'a göre daha büyük yapar). `k` değerini artırmak, algoritmanın daha "köşe gibi" olan, yani iki özdeğerin de çok büyük olduğu daha keskin köşeleri bulmasını sağlar ve kenarlara verdiği tepkiyi azaltır. `k`'yi azaltmak ise daha yumuşak köşelerin de tespit edilmesine izin verir.</p>
</details>

<details>
  <summary><b>Soru 3:</b> Harris Corner Detector rotasyona karşı değişmez (invariant) midir? Neden?</summary>
  <p>Evet, rotasyona karşı değişmezdir. Çünkü `M` matrisinin özdeğerleri (`λ₁` ve `λ₂`), matrisin temel aldığı koordinat sisteminin döndürülmesinden etkilenmez. Görüntüdeki bir köşe döndürüldüğünde, etrafındaki `gradient`lerin yönleri değişir, ancak `gradient` dağılımının ana eksenlerinin büyüklükleri (yani özdeğerler) aynı kalır. `R` skoru da sadece bu özdeğerlere bağlı olduğu için, sonuç rotasyondan etkilenmez.</p>
</details>
