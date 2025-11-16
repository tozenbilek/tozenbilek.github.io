---
layout: default
title: Computer Vision Nedir?
nav_order: 1
parent: Computer Vision
---

# Computer Vision Nedir?

Her resim bir hikaye anlatır. **Computer Vision (Bilgisayarlı Görü)**, bilgisayarlara bu hikayeleri "anlama", görsel dünyayı insanlar gibi yorumlama ve dijital görüntülerden veya videolardan yola çıkarak anlamlı bilgiler üretme yeteneği kazandırmayı amaçlayan bir bilim dalıdır.

---

## 1. Computer Vision vs. Image Processing (Görüntü İşleme)

Bu iki kavram sıkça karıştırılsa da aralarında temel bir amaç farkı vardır:

*   **Image Processing (Görüntü İşleme):** Bir görüntüyü girdi olarak alıp, yine bir görüntü çıktı olarak üretir. Amaç, görüntüyü **değiştirmektir**. Örneğin, bir fotoğrafa filtre uygulamak, parlaklığını artırmak veya görüntüyü keskinleştirmek birer görüntü işleme operasyonudur.
*   **Computer Vision:** Bir görüntüyü girdi olarak alır, ancak çıktı olarak o görüntü hakkında bir **anlam** veya **açıklama** üretir. Amaç, görüntüyü **yorumlamaktır**. Örneğin, bir fotoğrafta "kedi var" demek, trafik kamerasındaki araçları saymak veya bir MR görüntüsünden tümör tespiti yapmak birer Computer Vision problemidir.

<pre>
Süreç 1: Image Processing
[Görüntü] ---> [Filtrele / Değiştir] ---> [YENİ GÖRÜNTÜ]

Süreç 2: Computer Vision
[Görüntü] ---> [Yorumla / Anlam Çıkar] ---> ["Bu bir kedidir", "3 araç var", "Tümör mevcut"]
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Bir fotoğrafın Instagram'da "sepia" filtresiyle renklendirilmesi hangi alana girer?</p>
  <div class="quiz-option">A) Computer Vision</div>
  <div class="quiz-option" data-correct="true">B) Image Processing (Görüntü İşleme)</div>
  <div class="quiz-option">C) Makine Öğrenmesi</div>
  <div class="quiz-option">D) Veri Bilimi</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Çünkü işlem, bir görüntüyü (orijinal fotoğraf) girdi olarak alıp başka bir görüntüyü (filtreli fotoğraf) çıktı olarak üretmektedir. Görüntünün içeriği hakkında bir yorum yapılmamaktadır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Aşağıdakilerden hangisi bir Computer Vision probleminin çıktısı olmaya en uygun örnektir?</p>
  <div class="quiz-option">A) Bir fotoğrafın daha parlak hale getirilmiş versiyonu.</div>
  <div class="quiz-option" data-correct="true">B) Bir güvenlik kamerası videosundaki insan sayısı.</div>
  <div class="quiz-option">C) Bir görüntünün JPEG formatında sıkıştırılmış hali.</div>
  <div class="quiz-option">D) Bir fotoğrafın boyutunun küçültülmüş kopyası.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bu seçenek, görsel bir girdiden (video) yola çıkarak sayısal ve anlamsal bir bilgi (insan sayısı) üretmeyi hedefler. Diğer seçenekler, bir görüntüyü girdi alıp yine bir görüntü çıktısı üreten görüntü işleme operasyonlarıdır.</p>
  </div>
</div>

---

## 2. Computer Vision Neden Zordur? Algı vs. Ölçüm

Computer Vision'ın zor olmasının temel nedenlerinden biri, insan algısının basit piksel ölçümlerinden çok daha karmaşık olmasıdır. "Görmek", bir sensörün yaptığı ölçümleri kaydetmekle aynı şey değildir. Görmek, bu ölçümlere dayanarak dünyada ne olduğuna dair bir **algı oluşturmaktır.**

Örneğin, ünlü Adelson satranç tahtası illüzyonunda, "koyu" olarak algıladığımız bir kare ile "açık" olarak algıladığımız başka bir kare, aslında tamamen aynı piksel parlaklık değerine sahiptir. Beynimiz, gölgeleri ve çevresel faktörleri hesaba katarak bir yorum yapar, ancak bir bilgisayar için bu iki kare "ölçüm" olarak aynıdır.

Bu durum, bir bilgisayara "görmeyi" öğretmenin, pikselleri analiz etmekten çok daha fazlası olduğunu gösterir.

<div class="quiz-question">
  <p><b>Soru:</b> Adelson'un satranç tahtası illüzyonu, Computer Vision'ın hangi temel zorluğunu vurgular?</p>
  <div class="quiz-option">A) Yüksek çözünürlüklü görüntüleri işlemek için çok fazla hesaplama gücü gerekmesi.</div>
  <div class="quiz-option" data-correct="true">B) Bir nesnenin algılanan özelliğinin (örn: renk, parlaklık), ham piksel değerlerinden farklı olabilmesi.</div>
  <div class="quiz-option">C) Videodaki nesneleri takip etmenin, tek bir fotoğraftaki nesneleri tanımaktan daha zor olması.</div>
  <div class="quiz-option">D) Farklı kamera türlerinin farklı renk profilleri üretmesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> İllüzyon, beynimizin gölgeleri ve bağlamı yorumlayarak farklı gördüğü iki karenin aslında aynı piksel değerine sahip olduğunu gösterir. Bu, "görmenin" sadece piksel ölçmek olmadığını, aynı zamanda bir yorumlama ve algı süreci olduğunu kanıtlar. Bu, bilgisayarlar için en büyük zorluklardan biridir.</p>
  </div>
</div>

---

## 3. Neden Computer Vision Çalışmalıyız?

Görüntüler ve videolar, hayatımızın her alanında temel bir veri kaynağı haline gelmiştir. Bu görsel veriyi işleyebilen, anlayabilen ve ondan değer üretebilen sistemlere olan ihtiyaç her geçen gün artmaktadır.

*   **Güvenlik:** Otomatik gözetleme sistemleri ve anomali tespiti.
*   **3D Modelleme:** Görüntülerden üç boyutlu dünya modelleri oluşturma (örn: Google Earth).
*   **Otomasyon:** Endüstriyel robotların parçaları tanıması veya otonom araçların yolu görmesi.
*   **Tıp:** Medikal görüntülerden hastalık teşhisi.

En önemlisi de, insan algısını makinelere kazandırmaya çalışmak, çözmesi hem zorlayıcı hem de son derece keyifli, derin ve harika bir problem setidir.

<div class="quiz-question">
  <p><b>Soru:</b> Computer Vision'ın temel motivasyonlarından biri, görsel veriden **değer** üretmektir. Aşağıdakilerden hangisi bu motivasyona en iyi örnektir?</p>
  <div class="quiz-option">A) Bir tatil fotoğrafını sosyal medyada paylaşmadan önce daha canlı renklere kavuşturmak.</div>
  <div class="quiz-option">B) Eski bir filmdeki görüntüleri dijital olarak temizleyip restore etmek.</div>
  <div class="quiz-option" data-correct="true">C) Bir tarlanın drone ile çekilmiş fotoğraflarını analiz ederek bitki hastalıklarını erken evrede tespit etmek.</div>
  <div class="quiz-option">D) Bir videonun dosya boyutunu kalitesi çok düşmeden küçültmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu seçenek, görsel veriden (drone fotoğrafları) yola çıkarak somut, ekonomik ve pratik bir değer (hastalıkların tespiti) üretme amacını en iyi şekilde yansıtır. Diğer seçenekler daha çok görüntü işleme veya veri sıkıştırma ile ilgilidir.</p>
  </div>
</div>

---

