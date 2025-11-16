---
layout: default
title: SIFT Tanımlayıcısı ve Özellik Eşleştirme
nav_order: 19
parent: Computer Vision
---

# SIFT Tanımlayıcısı (Descriptor) ve Özellik Eşleştirme (Feature Matching)

Önceki bölümde, SIFT algoritmasının ölçek değişikliklerine karşı dayanıklı anahtar noktaları (`keypoints`) nasıl tespit ettiğini gördük. Ancak, iki farklı görüntüdeki noktaların aynı olup olmadığını anlamak için, sadece konumlarını ve ölçeklerini bilmek yeterli değildir. Her bir anahtar noktanın etrafındaki bölgeyi, eşleştirmeye olanak tanıyacak şekilde ayırt edici bir "parmak izi" ile temsil etmemiz gerekir. Bu parmak izine **descriptor (tanımlayıcı)** denir.

---

## 1. Orientation Assignment (Oryantasyon Ataması)

SIFT tanımlayıcısının döndürme değişikliklerine karşı da dayanıklı olmasını sağlamak için, ilk olarak her anahtar noktaya bir veya daha fazla **oryantasyon (yönelim)** atanır.

1.  Anahtar noktanın karakteristik ölçeğindeki komşu piksellerin gradyan büyüklükleri ve yönleri hesaplanır.
2.  Bu gradyan yönleri, 36 binlik bir histogramda (her 10 derecelik açı için bir bin) biriktirilir. Her bir "oyun" büyüklüğü, ait olduğu pikselin gradyan büyüklüğüyle ağırlıklandırılır.
3.  Histogramdaki en yüksek tepe noktası, anahtar noktanın **ana oryantasyonu** olarak belirlenir. (Eğer başka tepeler de en yüksek tepenin %80'inden büyükse, bu yönelimler için de ayrı anahtar noktalar oluşturulur.)

**Sezgisel olarak:** Bu adım, her anahtar noktaya bir "kuzey yönü" atar. Tanımlayıcıyı oluşturmadan önce, etrafındaki piksel komşuluğunu bu "kuzey yönü"ne göre hizalarız. Bu sayede, bir nesne ve üzerindeki anahtar nokta döndüğünde, atanan oryantasyon da onunla birlikte döner ve biz tanımlayıcıyı her zaman aynı hizalanmış "pencereden" hesaplarız. Sonuç olarak, ortaya çıkan tanımlayıcı vektör, döndürmeden etkilenmemiş olur.

---

## 2. The SIFT Descriptor (SIFT Tanımlayıcısı)

Artık her anahtar noktanın bir konumu, bir ölçeği ve bir oryantasyonu var. Bu bilgiler kullanılarak, noktanın etrafındaki bölgeyi temsil eden 128 elemanlı bir vektör oluşturulur:

1.  Anahtar noktanın oryantasyonuna göre döndürülmüş ve ölçeğine göre boyutlandırılmış, merkezinde anahtar noktanın bulunduğu 16x16 piksellik bir komşuluk bölgesi alınır.
2.  Bu 16x16'lık bölge, 4x4'lük 16 adet alt bölgeye ayrılır.
3.  Her bir 4x4'lük alt bölge için, piksellerin gradyan yönlerinden 8 binlik bir histogram oluşturulur (örn: 0-44 derece, 45-89 derece vb.).
4.  Bu 16 adet 8-binlik histogram art arda eklenerek, anahtar noktayı tanımlayan **128 boyutlu (16 alt-bölge * 8 yön = 128) bir vektör** elde edilir.

<pre>
SIFT Tanımlayıcı Oluşturma Süreci:

1. [ 16x16'lık, ana oryantasyona göre hizalanmış piksel penceresi ]
            |
            v
2. [ 4x4'lük alt-bölgelere ayırma (toplam 16 alt-bölge) ]
      /      |      \
 [Bölge 1] [Bölge 2] ... [Bölge 16]
     |         |             |
     v         v             v
3. [Her bölge için 8 yönlü gradyan histogramı oluşturma]
 [8-boyutlu] [8-boyutlu] ... [8-boyutlu]
     \         |             /
      \        |            /
       \       |           /
        \      |          /
         v     v         v
4. [ Tüm histogramları birleştirme -> 128 boyutlu vektör ]
</pre>

Bu vektör, aydınlatma değişikliklerine karşı daha dayanıklı olması için normalize edilir (uzunluğu 1 yapılır) ve belirli bir eşiğin üzerindeki büyük gradyan değerleri kırpılır. Sonuç olarak elde edilen SIFT tanımlayıcısı, küçük perspektif değişikliklerine, aydınlatma farklılıklarına ve gürültüye karşı oldukça `robust` (gürbüz) bir yapıdadır.

---

## 3. Feature Matching (Özellik Eşleştirme)

Elimizde iki görüntü (Görüntü A ve Görüntü B) ve her biri için SIFT anahtar noktaları ve tanımlayıcıları var. Amaç: Görüntü A'daki her bir özellik için, Görüntü B'deki doğru karşılığı bulmak.

### a) En Yakın Komşu (Nearest Neighbor) Yöntemi

En basit yaklaşım, Görüntü A'daki bir `d_A` tanımlayıcısını almak ve Görüntü B'deki tüm tanımlayıcılara olan mesafesini (genellikle Öklid mesafesi) hesaplamaktır. `d_A`'ya en düşük mesafeye sahip olan Görüntü B'deki tanımlayıcı, en iyi eşleşme adayı olarak seçilir.

### b) Lowe's Ratio Test (Oran Testi)

Ancak, en yakın komşu her zaman doğru eşleşme olmayabilir. Özellikle tekrarlayan desenlere sahip bir sahnede, bir özelliğin birden fazla "benzer" adayı olabilir. Bu belirsizliği çözmek için SIFT'in mucidi David Lowe, **Ratio Test**'i önermiştir.

1.  Görüntü A'daki bir özellik için, Görüntü B'deki sadece **en yakın** komşuyu değil, aynı zamanda **ikinci en yakın** komşuyu da bul.
2.  Bu iki mesafeyi oranla: `Oran = (En Yakın Mesafe) / (İkinci En Yakın Mesafe)`
3.  Eğer bu `Oran`, belirli bir eşik değerinden (genellikle ~0.75) **küçükse**, eşleşme kabul edilir.

**Sezgisel olarak:** Eğer en yakın komşu, ikinci en yakın komşudan çok daha yakınsa (oran küçükse), bu, eşleşmenin gerçekten ayırt edici ve "özel" olduğu anlamına gelir. Eğer iki komşu da birbirine yakın mesafedeyse (oran 1'e yakınsa), bu, özelliğin ayırt edici olmadığı ve eşleşmenin belirsiz olduğu anlamına gelir, bu yüzden bu eşleşme reddedilir. Bu basit test, yanlış eşleşmelerin büyük bir kısmını etkin bir şekilde eler.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> Bir SIFT tanımlayıcısı (descriptor) neden 128 boyuta sahiptir?</p>
  <div class="quiz-option">A) Görüntünün 128 farklı renk tonunu analiz ettiği için.</div>
  <div class="quiz-option" data-correct="true">B) 16 alt-bölgenin her biri için 8 yönlü bir gradyan histogramı oluşturup bunları birleştirdiği için.</div>
  <div class="quiz-option">C) 128, bilgisayarların işlemesi için en verimli sayı olduğu için.</div>
  <div class="quiz-option">D) Anahtar noktanın etrafındaki 128 pikseli doğrudan kullandığı için.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> SIFT tanımlayıcısı, 16x16'lık bir pencereyi 4x4'lük 16 alt-bölgeye ayırır. Her bir alt-bölge için 8 farklı yöndeki gradyanların birikimli bir histogramını oluşturur. Bu 16 adet 8 boyutlu histogramın birleştirilmesiyle 16 * 8 = 128 boyutlu son vektör elde edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Özellik eşleştirmede kullanılan "Lowe's Ratio Test"in temel amacı nedir?</p>
  <div class="quiz-option">A) Eşleştirme işlemini daha hızlı hale getirmek.</div>
  <div class="quiz-option">B) Daha fazla sayıda eşleşme bulmak.</div>
  <div class="quiz-option" data-correct="true">C) Belirsiz ve potansiyel olarak yanlış olan eşleşmeleri (ambiguous matches) elemek.</div>
  <div class="quiz-option">D) Sadece en parlak bölgelerdeki özellikleri eşleştirmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Ratio Test, bir özelliğin en iyi eşleşmesinin, ikinci en iyi eşleşmesinden "anlamlı derecede" daha iyi olup olmadığını kontrol eder. Eğer en iyi ve ikinci en iyi adaylar birbirine çok benziyorsa, bu durum eşleşmenin belirsiz olduğunu gösterir ve bu eşleşme güvenilir olmadığı için reddedilir. Bu, özellikle tekrarlayan desenlere sahip yüzeylerde yanlış eşleşmeleri önlemek için çok etkilidir.</p>
  </div>
</div>