---
layout: default
title: Filtering Temelleri
parent: 2. Image Formation ve Filtering
nav_order: 2
---

# Filtering Temelleri

`Image`'lerdeki `noise`'u azaltmak veya belirli özellikleri (`edge`'ler gibi) vurgulamak için **filtering** kullanılır. Bu işlem, her bir `pixel`'in değerini, çevresindeki komşu `pixel`'lerin değerlerini kullanarak yeniden hesaplamaya dayanır.

## Moving Average Fikri

`Noise` azaltma için en sezgisel yaklaşımlardan biri **moving average** filtresidir. Temel mantığı şudur:
"Bir `pixel`'in gerçek değeri, komşularının değerlerine benzer olmalıdır. `Noise` ise genellikle rastgele ve bağımsızdır."

Bu varsayımlara dayanarak, her `pixel`'i, kendisi ve komşularını içeren bir `neighborhood` (pencere) içindeki `pixel`'lerin ortalama değeriyle değiştirebiliriz.

- **1D Örnek:** `[... 5, 6, 100, 8, 7 ...]` gibi bir sinyalde `100` değeri bir `noise` olabilir. 3 birimlik bir pencere ile ortalama alırsak: `(6 + 100 + 8) / 3 ≈ 38`. `Noise`'un etkisi azalmış olur.
- **2D Image:** Bu mantık 2D'ye genişletilir. Örneğin, bir `pixel`'i 3x3'lük bir penceredeki 9 `pixel`'in ortalamasıyla değiştiririz. Bu işleme **box filter** de denir.

## Cross-Correlation ve Convolution

`Filtering` işlemi matematiksel olarak **correlation** veya **convolution** operasyonları ile ifade edilir. Her ikisi de bir **kernel** veya **mask** adı verilen küçük bir matrisi `image` üzerinde kaydırma prensibine dayanır.

**Kernel:** Filtrenin ağırlıklarını içeren küçük bir matristir. Örneğin, 3x3'lük bir ortalama filtresinin `kernel`'i şöyledir:

\[
\frac{1}{9}
\begin{bmatrix}
1 & 1 & 1 \\
1 & 1 & 1 \\
1 & 1 & 1
\end{bmatrix}
\]

### Cross-Correlation
`Correlation`, `kernel`'i `image` üzerinde kaydırarak her pozisyonda eleman-elemana çarpıp sonuçları toplamaktır.

`G[i, j] = Σ_u Σ_v H[u, v] * F[i+u, j+v]`

![Cross-Correlation Operasyonu Diagramı](https://placehold.co/600x250/EEE/31343C?text=Cross-Correlation:+Kernel'i+Görüntü+Üzerinde+Kaydırma)

Bu, `filtering` için en doğrudan ve sezgisel uygulamadır.

### Convolution
`Convolution`, `correlation`'a çok benzer, ancak bir farkla: işlemden önce **kernel 180 derece döndürülür**.

`G[i, j] = Σ_u Σ_v H[u, v] * F[i-u, j-v]` (veya `H`'yi döndürerek `H'[-u, -v]`)

**Neden Önemli?**
- **Simetrik Kerneller:** Eğer `kernel` merkezine göre simetrik ise (Gaussian, box filter gibi), `correlation` ve `convolution` **aynı sonucu** verir. Bu yüzden `noise` azaltma gibi uygulamalarda genellikle fark etmez.
- **Asimetrik Kerneller:** `Edge detection` için kullanılan türev filtreleri gibi asimetrik `kernel`'lerde sonuç farklı olur.
- **Matematiksel Özellikler:** `Convolution`, değişme (`commutative`) ve birleşme (`associative`) gibi önemli matematiksel özelliklere sahiptir. Bu, `(Filtre1 * Filtre2) * Image = Filtre1 * (Filtre2 * Image)` gibi optimizasyonlara olanak tanır.

## Linear Shift-Invariant (LSI) Sistemler

`Filtering` operasyonları genellikle **Linear Shift-Invariant (LSI)** sistemler olarak kabul edilir.
- **Linearity:** Sistemin iki temel özelliği sağlamasıdır:
  1.  `H(a*F) = a*H(F)` (Homojenlik)
  2.  `H(F1 + F2) = H(F1) + H(F2)` (Toplamsallık)
  `Correlation`/`convolution`, toplama ve çarpma işlemlerinden oluştuğu için lineerdir. `max()` veya `min()` gibi operasyonlar lineer değildir.

- **Shift Invariance:** Operatörün, uygulandığı konuma göre davranışının değişmemesidir. Yani, filtrenin çıktısı sadece `neighborhood` desenine bağlıdır, `image`'in neresinde olduğuna değil.

Bu özellikler, `image filtering` analizini ve tasarımını büyük ölçüde basitleştirir.

## Boundary Issues (Sınır Problemleri)

Filtre `kernel`'i `image`'in kenarlarına geldiğinde, pencere `image`'in dışına taşar. Bu durumu yönetmek için farklı stratejiler vardır:

1.  **Zero-padding (clip filter):** `Image` dışındaki `pixel`'leri 0 (siyah) olarak kabul et. Bu, kenarlarda kararmaya neden olabilir.
2.  **Wrap around:** `Image`'i bir torus gibi düşün; sol kenardan çıkınca sağ kenardan devam et. Genellikle yapay `edge`'ler oluşturur.
3.  **Copy edge (replicate):** En yakın kenar `pixel`'inin değerini dışarıya doğru tekrarla.
4.  **Reflect across edge:** Kenar çizgisinden `image`'i ayna gibi yansıt. Genellikle en doğal ve en az yapaylık üreten yöntemdir.

Seçilen yöntem, filtrelenmiş `image`'in kenarlarındaki kaliteyi doğrudan etkiler. Çoğu modern kütüphane varsayılan olarak `reflect` veya `replicate` yöntemlerini kullanır.

---

## Özet ve Anahtar Kavramlar

-   **Filtering:** Bir `pixel`'in değerini, komşularının değerlerini kullanarak yeniden hesaplama işlemidir. Genellikle gürültü azaltma veya özellik vurgulama için kullanılır.
-   **Kernel (Mask):** Filtrenin ağırlıklarını içeren küçük matristir.
-   **Cross-Correlation:** `Kernel`'i `image` üzerinde kaydırıp, her konumda eleman-elemana çarpıp toplayarak çıktı üreten temel filtreleme operasyonudur.
-   **Convolution:** `Cross-correlation` ile aynıdır, ancak `kernel`'in işlemden önce 180 derece döndürülmüş halidir. `Convolution`, `associative` (birleşme) ve `commutative` (değişme) gibi önemli matematiksel özelliklere sahiptir.
-   **Boundary Issues:** Filtre `image`'in kenarlarına geldiğinde oluşan problemi çözmek için `zero-padding`, `replicate`, `reflect` gibi çeşitli yöntemler kullanılır.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Simetrik bir `kernel` (örneğin Gaussian) kullanıldığında `Convolution` ve `Cross-Correlation` arasındaki fark nedir?</p>
  <div class="quiz-explanation">
    <p>Hiçbir fark yoktur. `Convolution` işleminden önce `kernel`'i 180 derece döndürür. Ancak `kernel` zaten simetrikse, döndürülmüş hali kendisiyle aynı olacağı için iki operasyon da tamamen aynı sonucu üretir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir `image`'i önce 3x3'lük bir `box filter` ile, sonra da 5x5'lik bir `box filter` ile filtrelemekle; doğrudan 7x7'lik bir `box filter` ile filtrelemek arasında nasıl bir ilişki vardır? Neden?</p>
  <div class="quiz-explanation">
    <p>İki küçük filtrenin ardışık uygulanması, daha büyük tek bir filtrenin etkisine benzer bir `smoothing` etkisi yaratır, ancak bu etki tam olarak 7x7'lik bir filtreninkiyle aynı değildir. `Convolution`'ın `associative` (birleşme) özelliği sayesinde iki filtrenin `convolution`'ı alınarak tek bir eşdeğer `kernel` elde edilebilir. Ancak iki `box filter`'ın `convolution`'ı, üçgen şeklinde bir ağırlık dağılımı oluşturur, bu da başka bir `box filter` değildir. Bu, ardışık filtrelemenin daha karmaşık filtreler oluşturmak için kullanılabileceğini gösterir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> `Image` kenarlarındaki `boundary` problemini yönetmek için neden genellikle "zero-padding" (siyahla doldurma) yerine "reflect" (yansıtma) yöntemi tercih edilir?</p>
  <div class="quiz-explanation">
    <p>"Zero-padding", `image`'in kenarlarına yapay olarak güçlü bir `edge` (görüntüden siyaha geçiş) ekler. Bu, filtreleme sonucunda kenarlarda istenmeyen kararmalara veya artefaktlara neden olabilir. "Reflect" yöntemi ise mevcut `pixel` desenini kenarın dışına yansıtarak daha doğal bir devamlılık sağlar ve bu tür yapay kenar etkilerini en aza indirir.</p>
  </div>
</div>
