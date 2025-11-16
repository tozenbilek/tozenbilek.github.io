---
layout: default
title: Computer Vision Nedir?
nav_order: 1
parent: Computer Vision
---

# Computer Vision Nedir?

Her resim bir hikaye anlatır. **Computer Vision (Bilgisayarlı Görü)**, bilgisayarlara bu hikayeleri "anlama" ve görsel dünyayı insanlar gibi yorumlama yeteneği kazandırmayı amaçlayan bir bilim dalıdır. Temel hedef, dijital görüntülerden veya videolardan yola çıkarak anlamlı bilgiler üretmektir.

---

## Computer Vision vs. Görüntü İşleme (Image Processing)

Bu iki kavram sıkça karıştırılsa da aralarında önemli bir fark vardır:

*   **Görüntü İşleme (Image Processing):** Bir görüntüyü girdi olarak alıp, yine bir görüntü çıktı olarak üreten işlemlerdir. Örneğin, bir fotoğrafa filtre uygulamak (örn: "sepia" filtresi), parlaklığını artırmak veya görüntüyü keskinleştirmek birer görüntü işleme operasyonudur. **Amaç, görüntüyü değiştirmektir.**

*   **Computer Vision:** Bir görüntüyü girdi olarak alır, ancak çıktı olarak o görüntü hakkında bir **anlam** veya **açıklama** üretir. Örneğin, bir fotoğrafta "kedi var" demek, trafik kamerasındaki araçları saymak veya bir MR görüntüsünden tümör tespiti yapmak birer Computer Vision problemidir. **Amaç, görüntüyü yorumlamaktır.**

![Vision vs Image Processing](https://via.placeholder.com/700x250.png?text=Görüntü+->+Görüntü+İşleme+->+Geliştirilmiş+Görüntü+||+Görüntü+->+Computer+Vision+->+"Bu+bir+kedidir")
*Görsel: Görüntü İşleme bir görüntüyü dönüştürürken, Computer Vision bir görüntüden anlam çıkarır.*

---

## Neden Computer Vision Çalışmalıyız?

Görüntüler ve videolar, hayatımızın her alanında (üretimden tüketime) temel bir veri kaynağı haline gelmiştir. Bu görsel veriyi işleyebilen, anlayabilen ve ondan değer üretebilen sistemlere olan ihtiyaç her geçen gün artmaktadır.

*   **Güvenlik:** Otomatik gözetleme sistemleri ve anomali tespiti.
*   **3D Modelleme:** Görüntülerden üç boyutlu dünya modelleri oluşturma (örn: Google Earth).
*   **Otomasyon:** Endüstriyel robotların parçaları tanıması veya otonom araçların yolu görmesi.
*   **Tıp:** Medikal görüntülerden hastalık teşhisi.

En önemlisi de, insan algısını makinelere kazandırmaya çalışmak, çözmesi hem zorlayıcı hem de son derece keyifli, derin ve harika bir problem setidir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir fotoğrafın Instagram'da "sepia" filtresiyle renklendirilmesi hangi alana girer?</p>
  <div class="quiz-option">A) Computer Vision</div>
  <div class="quiz-option" data-correct="true">B) Görüntü İşleme (Image Processing)</div>
  <div class="quiz-option">C) Makine Öğrenmesi</div>
  <div class="quiz-option">D) Veri Bilimi</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B) Görüntü İşleme.</b> Çünkü işlem, bir görüntüyü (orijinal fotoğraf) girdi olarak alıp başka bir görüntüyü (filtreli fotoğraf) çıktı olarak üretmektedir. Görüntünün içeriği hakkında bir yorum yapılmamaktadır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Aşağıdakilerden hangisi bir Computer Vision probleminin çıktısı olmaya en uygun örnektir?</p>
  <div class="quiz-option">A) Bir fotoğrafın daha parlak hale getirilmiş versiyonu.</div>
  <div class="quiz-option" data-correct="true">B) Bir güvenlik kamerası videosundaki insan sayısı.</div>
  <div class="quiz-option">C) Bir görüntünün JPEG formatında sıkıştırılmış hali.</div>
  <div class="quiz-option">D) Bir fotoğrafın boyutunun küçültülmüş kopyası.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bu seçenek, görsel bir girdiden (video) yola çıkarak sayısal ve anlamsal bir bilgi (insan sayısı) üretmeyi hedefler. Diğer seçenekler, bir görüntüyü girdi alıp yine bir görüntü çıktısı üreten görüntü işleme operasyonlarıdır.</p>
  </div>
</div>
