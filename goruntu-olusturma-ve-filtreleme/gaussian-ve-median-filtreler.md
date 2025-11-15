---
layout: default
title: Gaussian ve Median Filter'lar
parent: 2. Image Formation ve Filtering
nav_order: 3
---

# Gaussian ve Median Filter'lar

Farklı `noise` türleriyle başa çıkmak için özelleşmiş `filter`'lar kullanırız. En yaygın ve güçlü iki `filter`, **Gaussian filter** ve **Median filter**'dır.

## Gaussian Filter

**Box filter**, yani basit ortalama alma, bazı dezavantajlara sahiptir. Penceredeki tüm `pixel`'lere eşit ağırlık verir ve bu da filtrelenmiş `image`'de bloklu yapılar oluşturabilir. Daha doğal bir `smoothing` için **Gaussian filter** kullanılır.

**Temel Fikir:**
Bir `pixel`'in değerini hesaplarken, merkezdeki `pixel`'e daha yakın olan komşulara daha fazla ağırlık ver, uzaklaştıkça ağırlığı azalt. Bu ağırlık dağılımı, çan eğrisi olarak da bilinen **Gaussian function** ile modellenir.

**Kernel:**
`Gaussian filter`'ın `kernel`'i, merkezde en yüksek değere sahip olan ve kenarlara doğru simetrik olarak azalan değerlerden oluşur. Örneğin, 3x3 bir `Gaussian kernel` şuna benzer:

\[
\frac{1}{16}
\begin{bmatrix}
1 & 2 & 1 \\
2 & 4 & 2 \\
1 & 2 & 1
\end{bmatrix}
\]

**Parametre: Standard Deviation (`σ`)**
`Gaussian filter`'ın en önemli parametresi `σ`'dır (sigma).
- **Küçük `σ`:** Ağırlıklar merkeze çok yakın toplanır, bu da daha az `smoothing`'e neden olur. İnce detaylar korunur.
- **Büyük `σ`:** Ağırlıklar daha geniş bir alana yayılır, bu da daha güçlü bir `smoothing` etkisi yaratır. `Image` daha bulanık hale gelir, ancak `noise` daha etkili bir şekilde bastırılır.

> **Ne Zaman Kullanılır?** `Gaussian filter`, **Gaussian noise**'u gidermek için en etkili `linear filter`'dır. `Image smoothing` ve `preprocessing` adımlarında çok yaygın olarak kullanılır.

## Median Filter

**Salt and Pepper** gibi, `image`'de aykırı ve aşırı değerlere sahip (0 veya 255 gibi) `noise` türleri için ortalama tabanlı `filter`'lar iyi çalışmaz. Çünkü bu aşırı değerler ortalamayı ciddi şekilde saptırır.

**Temel Fikir:**
Bir `pixel`'in değerini, `neighborhood` penceresindeki `pixel`'lerin ortalaması yerine **median (ortanca) değeri** ile değiştir.

**Nasıl Çalışır?**
1.  Filtre penceresindeki tüm `pixel` değerleri küçükten büyüğe doğru sıralanır.
2.  Sıralanmış bu listenin ortasındaki değer seçilir.
3.  Merkez `pixel`'in değeri bu `median` değer ile güncellenir.

**Örnek:**
Pencere değerleri: `[10, 15, 20, 12, 255, 18, 22, 14, 17]`
Sıralanmış hali: `[10, 12, 14, 15, **17**, 18, 20, 22, 255]`
`Median` değer `17`'dir. `255` gibi aykırı bir değer hesaplamayı etkilemez.

**Özellikleri:**
- **Non-linear:** `Median` operasyonu toplama ve çarpma kurallarına uymadığı için `linear filter` değildir.
- **Edge Preserving:** Ortalama `filter`'larına göre `edge`'leri daha iyi koruma eğilimindedir, çünkü `edge`'ler boyunca `median` değeri çok fazla değişmez.
- **Spike Gürültüsünü Giderme:** *Salt and Pepper* ve *Impulse* gibi ani ve aşırı `noise`'ları gidermede son derece etkilidir.

> **Ne Zaman Kullanılır?** **Salt and Pepper** veya **Impulse** türü `noise`'ları temizlemek için en iyi seçenektir. Aykırı değerleri (`outliers`) ortadan kaldırmada çok başarılıdır.
