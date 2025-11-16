---
layout: default
title: SIFT Descriptor ve Feature Matching
nav_order: 19
parent: Computer Vision
---

# SIFT Descriptor ve Feature Matching

Önceki bölümde, SIFT algoritmasının ölçek değişikliklerine karşı dayanıklı anahtar noktaları (keypoints) nasıl tespit ettiğini gördük. Ancak, iki farklı görüntüdeki noktaların aynı olup olmadığını anlamak için, sadece konumlarını ve ölçeklerini bilmek yeterli değildir. Her bir anahtar noktanın etrafındaki bölgeyi, eşleştirmeye olanak tanıyacak şekilde ayırt edici bir "parmak izi" ile temsil etmemiz gerekir. Bu parmak izine **tanımlayıcı (descriptor)** denir.

---

## 1. Oryantasyon Ataması (Orientation Assignment)

SIFT tanımlayıcısının döndürme değişikliklerine karşı da dayanıklı olmasını sağlamak için, ilk olarak her anahtar noktaya bir veya daha fazla **oryantasyon (yönelim)** atanır.

1.  Anahtar noktanın karakteristik ölçeğindeki komşu piksellerin gradyan büyüklükleri ve yönleri hesaplanır.
2.  Bu gradyan yönleri, 36 binlik bir histogramda (her 10 derecelik açı için bir bin) biriktirilir. Her bir oyun büyüklüğü, ait olduğu pikselin gradyan büyüklüğüyle ağırlıklandırılır.
3.  Histogramdaki en yüksek tepe noktası, anahtar noktanın **ana oryantasyonu** olarak belirlenir. (Eğer başka tepeler de en yüksek tepenin %80'inden büyükse, bu yönelimler için de ayrı anahtar noktalar oluşturulur.)

Bu adım sayesinde, bir nesne döndüğünde, o nesne üzerindeki anahtar noktaların etrafındaki gradyanlar da dönecek, ancak hesaplanan ana oryantasyon da aynı miktarda dönecektir. Tanımlayıcı, bu ana oryantasyona göre hizalandığı için, sonuçta ortaya çıkan tanımlayıcı vektör, döndürmeden etkilenmemiş olur.

---

## 2. SIFT Tanımlayıcısı (Descriptor)

Artık her anahtar noktanın bir konumu, bir ölçeği ve bir oryantasyonu var. Bu bilgiler kullanılarak, noktanın etrafındaki bölgeyi temsil eden 128 elemanlı bir vektör oluşturulur:

1.  Anahtar noktanın oryantasyonuna göre döndürülmüş ve ölçeğine göre boyutlandırılmış, merkezinde anahtar noktanın bulunduğu 16x16 piksellik bir komşuluk bölgesi alınır.
2.  Bu 16x16'lık bölge, 4x4'lük 16 adet alt bölgeye ayrılır.
3.  Her bir 4x4'lük alt bölge için, piksellerin gradyan yönlerinden 8 binlik bir histogram oluşturulur.
4.  Bu 16 adet 8-binlik histogram art arda eklenerek, anahtar noktayı tanımlayan **128 boyutlu (16 * 8 = 128) bir vektör** elde edilir.

Bu vektör, aydınlatma değişikliklerine karşı daha dayanıklı olması için normalize edilir (uzunluğu 1 yapılır). Sonuç olarak elde edilen SIFT tanımlayıcısı, küçük perspektif değişikliklerine, aydınlatma farklılıklarına ve gürültüye karşı oldukça gürbüz (robust) bir "parmak izi"dir.

![SIFT Descriptor](https://via.placeholder.com/600x300.png?text=16x16+Bölge+->+16+adet+4x4+Alt+Bölge+->+128-Boyutlu+Vektör)
*Görsel: SIFT tanımlayıcısının oluşturulma şeması.*

---

## 3. Özellik Eşleştirme (Feature Matching)

İki görüntüden (örneğin, Görüntü A ve Görüntü B) SIFT özellikleri (anahtar noktalar ve tanımlayıcılar) çıkarıldıktan sonraki adım, Görüntü A'daki her bir özelliğin Görüntü B'deki karşılığını bulmaktır.

En basit yaklaşım, Görüntü A'daki bir `f_A` tanımlayıcısı için, Görüntü B'deki tüm tanımlayıcılar arasından ona en yakın olanı (Öklid mesafesi en düşük olanı) bulmaktır. Bu yönteme **En Yakın Komşu (Nearest Neighbor)** araması denir.

---

## 4. Eşleşme Filtreleme: "Ratio Test"

Ancak, en yakın komşu her zaman doğru eşleşme olmayabilir. Özellikle tekrarlayan desenlerin olduğu bölgelerde, bir özellik birden fazla özelliğe benzeyebilir. Bu tür belirsiz ve potansiyel olarak yanlış eşleşmeleri elemek için David Lowe, **"Ratio Test"** adı verilen basit ama çok etkili bir yöntem önermiştir.

1.  Görüntü A'daki bir özellik için, Görüntü B'deki sadece en yakın komşusu değil, **ikinci en yakın komşusu** da bulunur.
2.  En yakın komşuya olan mesafe (`d1`) ile ikinci en yakın komşuya olan mesafe (`d2`) karşılaştırılır.
3.  Eğer `d1 / d2` oranı belirli bir eşik değerinden (örneğin, 0.75) küçükse, bu eşleşme kabul edilir. Aksi takdirde reddedilir.

Bu testin arkasındaki mantık şudur: Eğer bir eşleşme gerçekten iyi ve ayırt edici ise, en yakın komşusu diğer tüm adaylardan (ikinci en yakın olan da dahil) **belirgin bir şekilde** daha yakın olmalıdır. Eğer en yakın ve ikinci en yakın komşular birbirine çok yakınsa, bu durum bir belirsizlik olduğunu gösterir ve eşleşme güvenilir değildir.

Bu adımların sonunda, iki görüntü arasında yüksek olasılıkla doğru olan, gürbüz bir eşleşme seti elde edilir. Bu eşleşmeler, bir sonraki bölümde göreceğimiz RANSAC gibi algoritmalarla Homography veya diğer geometrik dönüşümleri hesaplamak için kullanılabilir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> SIFT tanımlayıcısının (descriptor) görüntü döndürmelerine karşı dayanıklı olmasını sağlayan ana adım hangisidir?</p>
  <div class="quiz-option">A) Görüntüyü önceden Gaussian ile bulanıklaştırmak.</div>
  <div class="quiz-option" data-correct="true">B) Her anahtar noktaya, gradyan yönleri histogramından bir "ana oryantasyon" atamak.</div>
  <div class="quiz-option">C) Tanımlayıcı vektörünü 128 boyutlu yapmak.</div>
  <div class="quiz-option">D) Ratio Test kullanmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Tanımlayıcı oluşturulmadan önce, anahtar noktanın etrafındaki bölge, hesaplanan bu ana oryantasyona göre "düzeltilir" (hizalanır). Bu sayede, nesne ne kadar dönerse dönsün, tanımlayıcı hep aynı standart oryantasyona göre hesaplanır ve sonuç vektörü değişmez.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> SIFT özelliklerini eşleştirirken kullanılan "Ratio Test"in amacı nedir?</p>
  <div class="quiz-option">A) Eşleştirme işlemini hızlandırmak.</div>
  <div class="quiz-option">B) Ölçek değişikliklerine karşı dayanıklılık sağlamak.</div>
  <div class="quiz-option" data-correct="true">C) En yakın ve ikinci en yakın komşular arasındaki mesafeyi karşılaştırarak belirsiz ve muhtemelen yanlış olan eşleşmeleri elemek.</div>
  <div class="quiz-option">D) Daha fazla sayıda eşleşme bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Ratio Test, bir eşleşmenin ne kadar "ayırt edici" olduğunu ölçer. Eğer en yakın komşu, ikinci en yakın komşudan çok daha yakın değilse, bu eşleşme belirsiz kabul edilir ve atılır. Bu, eşleşme kalitesini önemli ölçüde artırır.</p>
  </div>
</div>
