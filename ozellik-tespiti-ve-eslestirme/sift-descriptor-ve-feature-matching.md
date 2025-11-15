---
layout: default
title: SIFT Descriptor ve Feature Matching
parent: 5. Feature Detection ve Matching
nav_order: 3
---

# SIFT Descriptor ve Feature Matching

`Scale-invariant` `keypoint`'leri bulduktan sonraki adım, bu `keypoint`'leri `image` `rotation`'ı ve aydınlatma değişiklikleri gibi diğer dönüşümlere karşı da dayanıklı olacak şekilde tanımlamaktır. Bu tanıma **descriptor** denir. Ardından, bu `descriptor`'ları kullanarak `image`'ler arasında eşleşmeler (`matches`) buluruz.

## Orientation Assignment (Yönelim Belirleme)

`Rotation invariance` sağlamak için, her `keypoint`'e `canonical` (standart) bir `orientation` (yönelim) atanır. Bu, `descriptor`'ın her zaman bu `orientation`'a göre hesaplanmasını sağlar.

1.  `Keypoint`'in `scale`'ine uygun bir `Gaussian` ile `smooth` edilmiş `image` bölgesi alınır.
2.  Bu bölgedeki her `pixel` için `gradient` `magnitude`'u ve `orientation`'ı hesaplanır.
3.  `Gradient` `orientation`'ları için bir `histogram` oluşturulur (genellikle 36 `bin`, her biri 10 derece). Her `pixel`'in `histogram`'a katkısı, `gradient` `magnitude`'u ile ağırlıklandırılır.
4.  `Histogram`'daki en yüksek tepe (peak), `keypoint`'in ana `orientation`'ı olarak belirlenir. Eğer başka bir tepe, en yüksek tepenin %80'inden daha büyükse, o `orientation` için de ayrı bir `keypoint` oluşturulur. Bu, aynı konum ve `scale`'de birden fazla `orientation`'a sahip stabil `feature`'ların (örneğin, dik bir `corner`'da) temsil edilmesini sağlar.

Bu histogramdaki en yüksek tepe (peak), `keypoint`'in **ana yönünü (dominant orientation)** belirler. Bu ana yön, `descriptor` hesaplamasından önce `keypoint`'in koordinat sistemini "düzeltmek" için kullanılır. Bu sayede, `descriptor` rotasyona karşı değişmez hale gelir. Eğer ikinci bir tepe, birincinin %80'inden daha yüksekse, o yöne de sahip yeni bir `keypoint` oluşturulur.

![SIFT Orientation Assignment](https://via.placeholder.com/600x400.png?text=Keypoint+Etrafında+Gradient+Yön+Histogramı+->+Dominant+Yön)
*<center>Yön ataması: Keypoint etrafındaki piksellerin gradient yönleri bir histogramda toplanır ve en yüksek tepe, keypoint'in ana yönünü belirler.</center>*

## SIFT Descriptor'ını Oluşturma

`Descriptor`, `keypoint`'in etrafındaki `local` `image` yapısını özetleyen bir vektördür.

1.  **Bölgeyi Normalize Etme:**
           - `Keypoint`'in `scale`'ine göre 16x16'lık bir `pixel` penceresi alınır.
           - Bu pencere, `keypoint`'in atanmış `orientation`'ına göre döndürülerek `rotation invariance` sağlanır.

2.  **`Gradient` `Histogram`'ları Oluşturma:**
           - 16x16'lık pencere, 4x4'lük `sub-region`'lara (her biri 4x4 `pixel`) bölünür.
           - Her bir `sub-region` için, `gradient` `orientation`'larını içeren 8 `bin`'lik bir `histogram` oluşturulur. Her `pixel`'in `histogram`'a katkısı, `gradient` `magnitude`'u ve `keypoint`'in merkezine olan uzaklığına göre `Gaussian` ağırlıklandırma ile belirlenir.
           - Toplamda 16 `sub-region` olduğu için, `4x4x8 = 128` elemanlı bir vektör elde edilir. Bu vektör, SIFT `descriptor`'ıdır.

Bu 16 histogramın her birindeki 8'er değer art arda eklenerek `4x4x8 = 128` elemanlı bir **SIFT `descriptor` vektörü** oluşturulur. Bu vektör, `keypoint` etrafındaki lokal `gradient` bilgisinin zengin bir temsilidir. Vektör daha sonra aydınlatma değişimlerine karşı hassasiyeti azaltmak için normalize edilir.

![SIFT Descriptor Grid](https://via.placeholder.com/600x450.png?text=16x16'lık+Bölge+->+4x4'lük+Grid+->+Her+Grid'de+8-bin+Histogram+->+128-boyutlu+Vektör)
*<center>SIFT Descriptor: Keypoint etrafındaki 16x16'lık bölge, 4x4'lük bir grid'e ayrılır. Her bir hücre içinde 8 yönlü bir gradient histogramı oluşturulur. Bu 16 histogram birleştirilerek 128 boyutlu descriptor vektörü elde edilir.</center>*

3.  **`Descriptor`'ı Normalize Etme:**
           - `Descriptor` vektörü, `unit` (birim) uzunluğa normalize edilir. Bu, `image` parlaklığındaki (`intensity`) değişimlere karşı (örneğin, `image`'in aydınlanması veya kararması) dayanıklılık sağlar.
           - Parlaklığın doygunluğa ulaştığı (clipping) gibi `non-linear` aydınlatma etkilerini azaltmak için, vektördeki değerler belirli bir `threshold` (genellikle 0.2) ile sınırlandırılır ve vektör tekrar normalize edilir.

## Feature Matching (Özellik Eşleştirme)

İki `image`'den SIFT `descriptor`'ları çıkarıldıktan sonra, aralarındaki eşleşmeler bulunur.

- **En Yakın Komşu (Nearest Neighbor) Arama:** Bir `image`'deki her bir `descriptor` için, ikinci `image`'deki **tüm** `descriptor`'lar arasında Öklid (`Euclidean`) mesafesi en küçük olan `descriptor` bulunur.

- **Eşleşme Filtreleme (Ratio Test):** En yakın komşu (`1-NN`) her zaman doğru eşleşme olmayabilir. `Descriptor`'ın ayırt edici olup olmadığını anlamak için, en yakın komşuya olan mesafenin, ikinci en yakın komşuya (`2-NN`) olan mesafeye oranı kontrol edilir.

         `Mesafe(1-NN) / Mesafe(2-NN) < Threshold`

         Eğer bu oran belirli bir `threshold`'un (örneğin, 0.7 - 0.8) altındaysa, eşleşme kabul edilir. Bu, `descriptor`'ın gerçekten ayırt edici olduğunu ve en yakın komşusunun diğer tüm adaylardan önemli ölçüde daha iyi bir eşleşme olduğunu gösterir. Aksi takdirde, eşleşme belirsiz kabul edilir ve reddedilir. Bu basit ama etkili test, hatalı eşleşmelerin büyük bir kısmını eler.

Ancak en yakın komşu her zaman doğru eşleşme olmayabilir. İkinci en yakın komşu da neredeyse birinci kadar yakınsa, bu eşleşme belirsizdir ve muhtemelen yanlıştır.

**Ratio Test:** Bu belirsizliği çözmek için, birinci en yakın komşunun mesafesinin (`d1`), ikinci en yakın komşunun mesafesine (`d2`) oranı kontrol edilir.
`d1 / d2 < threshold` (Genellikle ~0.7-0.8)

Eğer bu oran belirlenen `threshold`'dan küçükse, eşleşme kabul edilir. Aksi halde, eşleşme belirsiz (`ambiguous`) kabul edilerek reddedilir. Bu basit test, hatalı eşleşmelerin büyük bir kısmını etkili bir şekilde eler.

![Feature Matching Ratio Test](https://via.placeholder.com/800x350.png?text=Soldaki+Feature+->+Sağdaki+En+Yakın+1+(d1)+ve+2+(d2)+->+d1/d2<Threshold?)
*<center>Ratio Test: Görüntü 1'deki bir feature için, Görüntü 2'deki en yakın ve ikinci en yakın komşular bulunur. Eğer en yakın mesafe (d1), ikinci en yakın mesafeye (d2) göre anlamlı ölçüde daha küçükse, eşleşme kabul edilir.</center>*

---

## Özet ve Anahtar Kavramlar

-   **Orientation Assignment:** SIFT `descriptor`'ünü rotasyona karşı değişmez yapmak için, her `keypoint`'e etrafındaki `gradient` yönlerinin histogramına dayalı bir veya daha fazla "ana yön" atanması işlemidir.
-   **SIFT Descriptor:** Bir `keypoint` etrafındaki 16x16'lık `pixel` bölgesinin `gradient` bilgisini özetleyen 128 boyutlu bir vektördür. Bu `descriptor`, `keypoint`'in lokal görünümünü temsil eder ve eşleştirme için kullanılır.
-   **Feature Matching:** İki görüntüdeki `feature`'ların `descriptor` vektörleri arasındaki Öklid mesafesini hesaplayarak birbirine en çok benzeyen `feature` çiftlerini bulma işlemidir.
-   **Ratio Test:** Bir eşleşmenin güvenilirliğini artırmak için kullanılan bir tekniktir. En yakın komşunun mesafesinin, ikinci en yakın komşunun mesafesine oranını kontrol eder. Bu oran düşükse, eşleşme belirgindir ve kabul edilir.

---

## Kavrama Soruları

<details>
  <summary><b>Soru 1:</b> Bir SIFT `keypoint`'ine neden birden fazla yön atanabilir? Bu ne anlama gelir?</summary>
  <p>Eğer `gradient` yönü histogramında, en yüksek tepeye çok yakın yükseklikte (%80'inden fazla) başka bir tepe varsa, bu durum bölgede iki farklı baskın `gradient` yönü olduğunu gösterir. Örneğin, bir duvarın köşesi hem dikey hem de yatay olarak güçlü kenarlara sahiptir. Bu durumda, SIFT aynı konum ve ölçekte, ancak farklı yönlerde iki ayrı `keypoint` oluşturur. Bu, eşleştirme algoritmasının daha sağlam olmasına yardımcı olur.</p>
</details>

<details>
  <summary><b>Soru 2:</b> SIFT `descriptor`'ü oluşturulurken `gradient` yönleri neden `keypoint`'in ana yönüne göre göreceli olarak hesaplanır?</summary>
  <p>Bu işlem, `descriptor`'ü rotasyona karşı değişmez (rotation invariant) yapmak için kritik öneme sahiptir. Görüntü döndüğünde, `keypoint`'in ana yönü de aynı miktarda dönecektir. `Descriptor`'deki tüm `gradient`'ler bu ana yöne göre hizalandığı için, görüntü ne kadar dönerse dönsün, hesaplanan 128 boyutlu `descriptor` vektörü aynı kalacaktır. Bu, aynı nesnenin farklı açılardan çekilmiş fotoğraflarındaki `feature`'ların başarıyla eşleştirilebilmesini sağlar.</p>
</details>

<details>
  <summary><b>Soru 3:</b> `Ratio Test`'i kullanmamanın ve her zaman en yakın komşuyu en iyi eşleşme olarak kabul etmenin potansiyel dezavantajı nedir?</summary>
  <p>Eğer `Ratio Test` kullanılmazsa, bir `feature` için her zaman bir "en iyi" eşleşme bulunur, bu eşleşme ne kadar kötü veya belirsiz olursa olsun. Özellikle tekrarlayan desenlere sahip (örneğin, bir binanın pencereleri, bir kumaşın deseni) görüntülerde, bir `feature`'ın birden fazla potansiyel doğru eşleşmesi olabilir. Bu durumda, en yakın komşu ile ikinci en yakın komşu arasındaki mesafe farkı çok az olur. `Ratio Test`, bu gibi "belirsiz" eşleşmeleri tespit edip eleyerek, nihai eşleşme setinin kalitesini ve güvenilirliğini önemli ölçüde artırır. Testi kullanmamak, çok sayıda hatalı eşleşmeye (`false positive`) yol açar.</p>
</details>
