---
layout: default
title: Görüntü Yorumlamanın Zorlukları
nav_order: 3
parent: Computer Vision
---

# Görüntü Yorumlamanın Zorlukları

Computer Vision'ın hedefi basit gibi görünse de, bir görüntüyü "anlamak" inanılmaz derecede zor bir problemdir. İnsan görsel sistemi, bunu o kadar zahmetsizce yapar ki, arkasındaki karmaşıklığı genellikle gözden kaçırırız. Zorluk, bir görüntünün sadece piksellerden oluşan bir matris olmasından ve fiziksel dünyanın bu matrise yansırken birçok belirsizlik yaratmasından kaynaklanır.

---

## Görmek, Ölçmek Değildir: Adelson'un Gölge İllüzyonu

Bu zorluğu anlamanın en iyi yollarından biri, Edward Adelson tarafından yaratılan ünlü gölge illüzyonudur. Aşağıdaki görüntüye bakın. `A` ile işaretli kare mi daha koyu, yoksa `B` ile işaretli kare mi?

![Adelson Illusion](https://via.placeholder.com/400x300.png?text=Adelson'un+Gölge+İllüzyonu)
*Görsel: A ve B karelerinden hangisi daha koyu renklidir?*

Çoğu insan için `A` karesi bariz bir şekilde `B`'den daha koyudur. Ancak gerçekte, iki kare de **tamamen aynı gri tonuna** sahiptir.

Peki beynimiz neden yanılıyor? Çünkü beynimiz, piksellerin mutlak parlaklık değerlerini ölçmez. Görüntüyü bir bütün olarak yorumlar:
1.  **Gölge Bilgisi:** Beynimiz, silindirin bir gölge yarattığını algılar ve gölgedeki bir yüzeyin gerçekte olduğundan daha parlak olması gerektiğini "bilir".
2.  **Bağlam Bilgisi:** Satranç tahtası desenini tanır ve `B`'nin açık renkli bir kare olması gerektiğini, `A`'nın ise koyu renkli bir kare olması gerektiğini varsayar.

Beynimiz, bu ve benzeri birçok ipucunu kullanarak, `B` karesinin aslında açık renkli bir kare olduğunu ama bir gölge tarafından karartıldığını, bu yüzden `A`'dan daha parlak olması gerektiğini "hesaplar". Bu, algısal bir yorumlamadır, saf bir ölçüm değil.

---

## Temel Zorluklar

Bu illüzyon, Computer Vision'ın karşılaştığı temel zorlukları özetler:

*   **Aydınlatma Belirsizliği:** Bir yüzeyden yansıyan ışık (yani kameranın ölçtüğü değer), sadece yüzeyin rengine değil, aynı zamanda üzerine düşen ışığın miktarına, rengine ve açısına da bağlıdır. Aynı nesne, farklı ışık koşullarında tamamen farklı görünebilir.
*   **Bakış Açısı (Viewpoint):** Bir nesnenin 2D görüntüsü, ona hangi açıdan bakıldığına göre dramatik şekilde değişir.
*   **Ölçek (Scale):** Nesneler kameraya yakın veya uzak olabilir, bu da görüntüdeki boyutlarını değiştirir.
*   **Deformasyon (Deformation):** Birçok nesne (insanlar, hayvanlar, kumaşlar) sabit bir 3D şekle sahip değildir.
*   **Tıkanma (Occlusion):** Nesneler sık sık birbirlerinin arkasında kalarak kısmen veya tamamen gizlenirler.
*   **Arka Plan Karmaşası (Background Clutter):** Bir nesneyi, ona çok benzeyen doku ve renklere sahip bir arka plandan ayırt etmek zor olabilir.

Bir Computer Vision sisteminin, tüm bu değişkenlere rağmen bir nesneyi güvenilir bir şekilde tanıyabilmesi gerekir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Adelson'un gölge illüzyonunda A ve B karelerinin aynı piksel değerine sahip olmasına rağmen farklı tonlarda algılanmasının temel nedeni nedir?</p>
  <div class="quiz-option">A) Gözümüzün renkleri yanlış algılaması.</div>
  <div class="quiz-option" data-correct="true">B) Beynimizin, gölge ve desen gibi bağlamsal ipuçlarını kullanarak görüntüyü yorumlaması.</div>
  <div class="quiz-option">C) Görüntünün dijital olarak manipüle edilmiş olması.</div>
  <div class="quiz-option">D) Ekran parlaklığının yetersiz olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> İnsan görsel sistemi, mutlak piksel değerlerini ölçmek yerine, çevresel faktörleri (gölge, bilinen desenler vb.) hesaba katarak algısal bir yorumlama yapar. Bu yüzden, aslında aynı olan renkleri farklıymış gibi algılarız.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir kedinin, bir çitin arkasından yürüdüğünü ve sadece bacaklarının göründüğünü düşünün. Bir Computer Vision sisteminin bu nesneyi "kedi" olarak tanımasını zorlaştıran en temel problem hangisidir?</p>
  <div class="quiz-option">A) Aydınlatma Belirsizliği</div>
  <div class="quiz-option">B) Ölçek (Scale)</div>
  <div class="quiz-option" data-correct="true">C) Tıkanma (Occlusion)</div>
  <div class="quiz-option">D) Deformasyon (Deformation)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Kedinin büyük bir kısmının çit tarafından gizlenmesi, "occlusion" (tıkanma) problemine klasik bir örnektir. Sistemin, nesnenin sadece bir parçasını görerek bütününü tanıması gerekir.</p>
  </div>
</div>

