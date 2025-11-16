---
layout: default
title: SIFT Descriptor ve Feature Matching
nav_order: 19
parent: Computer Vision
---

# SIFT Descriptor ve Feature Matching

Önceki bölümde, SIFT algoritmasının ölçek değişikliklerine karşı dayanıklı anahtar noktaları (`keypoints`) nasıl tespit ettiğini gördük. Ancak, iki farklı görüntüdeki noktaların aynı olup olmadığını anlamak için, sadece konumlarını ve ölçeklerini bilmek yeterli değildir. Her bir anahtar noktanın etrafındaki bölgeyi, eşleştirmeye olanak tanıyacak şekilde ayırt edici bir "parmak izi" ile temsil etmemiz gerekir. Bu parmak izine **descriptor (tanımlayıcı)** denir.

---

## 1. Orientation Assignment (Oryantasyon Ataması)

SIFT tanımlayıcısının döndürme değişikliklerine karşı da dayanıklı olmasını sağlamak için, ilk olarak her anahtar noktaya bir veya daha fazla **oryantasyon (yönelim)** atanır.

1.  Anahtar noktanın karakteristik ölçeğindeki komşu piksellerin gradyan büyüklükleri ve yönleri hesaplanır.
2.  Bu gradyan yönleri, 36 binlik bir histogramda (her 10 derecelik açı için bir bin) biriktirilir. Her bir oyun büyüklüğü, ait olduğu pikselin gradyan büyüklüğüyle ağırlıklandırılır.
3.  Histogramdaki en yüksek tepe noktası, anahtar noktanın **ana oryantasyonu** olarak belirlenir. (Eğer başka tepeler de en yüksek tepenin %80'inden büyükse, bu yönelimler için de ayrı anahtar noktalar oluşturulur.)

Bu adım sayesinde, bir nesne döndüğünde, o nesne üzerindeki anahtar noktaların etrafındaki gradyanlar da dönecek, ancak hesaplanan ana oryantasyon da aynı miktarda dönecektir. Tanımlayıcı, bu ana oryantasyona göre hizalandığı için, sonuçta ortaya çıkan tanımlayıcı vektör, döndürmeden etkilenmemiş olur.

---

## 2. The SIFT Descriptor (SIFT Tanımlayıcısı)

Artık her anahtar noktanın bir konumu, bir ölçeği ve bir oryantasyonu var. Bu bilgiler kullanılarak, noktanın etrafındaki bölgeyi temsil eden 128 elemanlı bir vektör oluşturulur:

1.  Anahtar noktanın oryantasyonuna göre döndürülmüş ve ölçeğine göre boyutlandırılmış, merkezinde anahtar noktanın bulunduğu 16x16 piksellik bir komşuluk bölgesi alınır.
2.  Bu 16x16'lık bölge, 4x4'lük 16 adet alt bölgeye ayrılır.
3.  Her bir 4x4'lük alt bölge için, piksellerin gradyan yönlerinden 8 binlik bir histogram oluşturulur.
4.  Bu 16 adet 8-binlik histogram art arda eklenerek, anahtar noktayı tanımlayan **128 boyutlu (16 * 8 = 128) bir vektör** elde edilir.

Bu vektör, aydınlatma değişikliklerine karşı daha dayanıklı olması için normalize edilir (uzunluğu 1 yapılır). Sonuç olarak elde edilen SIFT tanımlayıcısı, küçük perspektif değişikliklerine, aydınlatma farklılıklarına ve gürültüye karşı oldukça `