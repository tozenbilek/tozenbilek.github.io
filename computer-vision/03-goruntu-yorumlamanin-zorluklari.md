---
layout: default
title: Görüntü Yorumlamanın Zorlukları
nav_order: 3
parent: Computer Vision
---

# Görüntü Yorumlamanın Zorlukları

Computer Vision'ın hedefi basit gibi görünse de, bir görüntüyü "anlamak" inanılmaz derecede zor bir problemdir. İnsan görsel sistemi, bunu o kadar zahmetsizce yapar ki, arkasındaki karmaşıklığı genellikle gözden kaçırırız. Zorluğun temel kaynağı, 3D dünyanın 2D bir görüntüye yansırken yarattığı **bilgi kaybı ve belirsizliklerdir.**

---

## 1. Görmek, Ölçmek Değildir: Optik İllüzyonlar

Bu zorluğu anlamanın en iyi yollarından biri optik illüzyonlardır. Beynimizin, ham piksel verisinden ne kadar farklı bir yorumlama yaptığını gösterirler.

### Adelson'un Gölge İllüzyonu

Ünlü gölge illüzyonunda, `A` ve `B` kareleri farklı görünse de aslında **tamamen aynı gri tonuna** sahiptir. Beynimiz, gölge ve satranç tahtası deseni gibi bağlamsal ipuçlarını kullanarak `B`'nin aslında daha parlak olması gerektiğini "hesaplar". Bu, algısal bir yorumlamadır, saf bir ölçüm değil.

<pre>
       +-------+
      /       /|
     /       / |
    +-------+  |
    |  (_)  |  |
    |       |  +
    |       | /
    +-------+
+-------+-------+-------+-------+
|       |   A   |       |       |
+-------+-------+-------+-------+
|   B   |       |       |       |
+-------+-------+-------+-------+
</pre>

### Diğer İllüzyonlar

Benzer şekilde, durağan bazı desenler hareket ediyormuş gibi görünebilir veya bir nesnenin gölgesinin şekli, o nesne hakkındaki algımızı tamamen değiştirebilir. Tüm bu örnekler, "görmenin" sadece pikselleri ölçmek olmadığını, karmaşık bir yorumlama süreci olduğunu kanıtlar.

<div class="quiz-question">
  <p><b>Soru:</b> Adelson'un gölge illüzyonunda A ve B karelerinin aynı piksel değerine sahip olmasına rağmen farklı tonlarda algılanmasının temel nedeni nedir?</p>
  <div class="quiz-option">A) Gözümüzün renkleri yanlış algılaması.</div>
  <div class="quiz-option" data-correct="true">B) Beynimizin, gölge ve desen gibi bağlamsal ipuçlarını kullanarak görüntüyü yorumlaması.</div>
  <div class="quiz-option">C) Görüntünün dijital olarak manipüle edilmiş olması.</div>
  <div class="quiz-option">D) Ekran parlaklığının yetersiz olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> İnsan görsel sistemi, mutlak piksel değerlerini ölçmek yerine, çevresel faktörleri (gölge, bilinen desenler vb.) hesaba katarak algısal bir yorumlama yapar. Bu yüzden, aslında aynı olan renkleri farklıymış gibi algılarız.</p>
  </div>
</div>

---

## 2. Temel Zorluklar

Bu illüzyonlar ve belirsizlikler, Computer Vision sistemlerinin aşması gereken temel zorlukları özetler:

*   **Viewpoint (Bakış Açısı):** Bir nesnenin 2D görüntüsü, ona hangi açıdan bakıldığına göre dramatik şekilde değişir. (Örn: Bir kupanın yandan ve üstten görünüşü tamamen farklıdır).
*   **Aydınlatma (Illumination):** Aynı nesne, farklı ışık koşullarında (gölgede, direkt güneşte, floresan ışıkta) tamamen farklı renkte ve parlaklıkta görünebilir.
*   **Scale (Ölçek):** Nesneler kameraya yakın veya uzak olabilir, bu da görüntüdeki boyutlarını değiştirir.
*   **Deformation (Deformasyon):** Birçok nesne (insanlar, hayvanlar, kumaşlar) sabit bir 3D şekle sahip değildir ve sürekli şekil değiştirir.
*   **Occlusion (Tıkanma / Örtülme):** Nesneler sık sık birbirlerinin arkasında kalarak kısmen veya tamamen gizlenirler. (Örn: Kalabalıktaki bir insanın sadece yüzünün görünmesi).
*   **Background Clutter (Arka Plan Karmaşası):** Bir nesneyi, ona çok benzeyen doku ve renklere sahip bir arka plandan ayırt etmek zor olabilir. (Örn: Karlı bir ormanda beyaz bir tavşanı bulmak).
*   **Intra-class Variation (Sınıf İçi Çeşitlilik):** Aynı kategoriye ait nesneler bile birbirinden çok farklı görünebilir. (Örn: Onlarca farklı sandalye türünün olması).

Bir Computer Vision sisteminin, tüm bu değişkenlere rağmen bir nesneyi güvenilir bir şekilde tanıyabilmesi gerekir.

<div class="quiz-question">
  <p><b>Soru:</b> Bir kedinin, bir çitin arkasından yürüdüğünü ve sadece bacaklarının göründüğünü düşünün. Bir Computer Vision sisteminin bu nesneyi "kedi" olarak tanımasını zorlaştıran en temel problem hangisidir?</p>
  <div class="quiz-option">A) Aydınlatma Belirsizliği</div>
  <div class="quiz-option">B) Scale (Ölçek)</div>
  <div class="quiz-option" data-correct="true">C) Occlusion (Tıkanma)</div>
  <div class="quiz-option">D) Deformation (Deformasyon)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Kedinin büyük bir kısmının çit tarafından gizlenmesi, "occlusion" (tıkanma) problemine klasik bir örnektir. Sistemin, nesnenin sadece bir parçasını görerek bütününü tanıması gerekir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Farklı cinslerde, renklerde ve boyutlardaki köpeklerin hepsini "köpek" olarak tanıyabilen bir sistem, en temelde hangi zorluğun üstesinden gelmiş demektir?</p>
  <div class="quiz-option">A) Occlusion (Tıkanma)</div>
  <div class="quiz-option" data-correct="true">B) Intra-class Variation (Sınıf İçi Çeşitlilik)</div>
  <div class="quiz-option">C) Background Clutter (Arka Plan Karmaşası)</div>
  <div class="quiz-option">D) Viewpoint (Bakış Açısı)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir "köpek" kategorisi içindeki nesnelerin (Danua, Kaniş, Sibirya Kurdu vb.) birbirinden çok farklı görünebilmesi, sınıf içi çeşitliliğe bir örnektir. Başarılı bir sistem, bu çeşitliliğe rağmen ortak özellikleri bulup doğru sınıflandırmayı yapabilmelidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Uzaktan çekilmiş bir hava fotoğrafında bir arabayı tanımaya çalışan bir sistem, aynı arabayı yakın çekim bir sokak fotoğrafında tanımakta zorlanabilir. Bu senaryoda hangi iki temel zorluk bir arada görülmektedir?</p>
  <div class="quiz-option">A) Occlusion ve Deformation</div>
  <div class="quiz-option" data-correct="true">B) Scale (Ölçek) ve Viewpoint (Bakış Açısı)</div>
  <div class="quiz-option">C) Aydınlatma ve Background Clutter</div>
  <div class="quiz-option">D) Deformation ve Aydınlatma</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Arabanın boyutu iki fotoğrafta çok farklıdır (Scale) ve arabaya farklı açılardan bakılmaktadır (hava fotoğrafı vs. sokak seviyesi - Viewpoint). Bu iki faktör, nesnenin 2D görüntüsünü tamamen değiştirir.</p>
  </div>
</div>

---

