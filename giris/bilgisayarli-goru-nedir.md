---
layout: default
title: Computer Vision Nedir?
parent: 1. Giriş
nav_order: 1
---

# Computer Vision Nedir?

**Computer Vision**, bilgisayarların ve sistemlerin dijital görüntülerden veya videolardan anlamlı bilgiler elde etmesini sağlayan bir bilim ve teknoloji alanıdır. Temel amaç, insan görsel sisteminin yapabildiği görevleri otomatikleştirmektir. Yani, "görmek" ve "anlamak" eylemlerini makinelere öğretmektir.

![Seeing vs Understanding](https://via.placeholder.com/600x300.png?text=Görmek+(Piksel+Matrisi)+->+Anlamak+(Bu+bir+KEDİDİR))
*<center>Computer Vision, sadece pikselleri görmekle kalmaz, aynı zamanda bu piksellerin ne anlama geldiğini yorumlar.</center>*

## Temel Amaç

Her resim bir hikaye anlatır. Computer Vision'ın temel amacı, bilgisayar programları yazarak bu hikayeyi yorumlayabilmektir. Bu, bir görüntüdeki nesneleri tanımak, sahneyi üç boyutlu olarak algılamak veya bir videodaki hareketleri takip etmek gibi görevleri içerebilir.

## Computer Vision vs. Görüntü İşleme

Bu iki kavram sıkça karıştırılsa da aralarında önemli bir fark vardır:

-   **Görüntü İşleme (Image Processing):** Genellikle bir görüntüyü girdi olarak alıp, başka bir görüntüyü çıktı olarak üreten operasyonlarla ilgilenir. Amaç genellikle görüntüyü iyileştirmek veya değiştirmektir (örneğin, bulanıklaştırma, netleştirme, renk düzeltme).
-   **Computer Vision:** Bir görüntüyü girdi olarak alır, ancak çıktısı genellikle bir görüntü değil, bir **bilgi** veya **yorumdur** (örneğin, "görüntüde 3 kedi var", "nesne 5 metre uzakta", "bu bir insan yüzü").

![Image Processing vs Computer Vision](https://via.placeholder.com/800x300.png?text=Görüntü+İşleme+(Görüntü->Görüntü)+vs.+Computer+Vision+(Görüntü->Bilgi))
*<center>Temel fark: Görüntü İşleme görüntüyü manipüle ederken, Computer Vision görüntüden anlam çıkarır.</center>*

> Görüntü işleme operasyonları, genellikle Computer Vision algoritmalarının bir parçası olarak, ön işleme adımlarında sıklıkla kullanılır.

## Neden Önemlidir?

Günümüzde görüntü ve video verisi her yerdedir. Akıllı telefonlardan güvenlik kameralarına, tıbbi görüntüleme cihazlarından otonom araçlara kadar milyarlarca cihaz sürekli olarak görsel veri üretmektedir. Computer Vision, bu devasa veriyi işleyerek değerli bilgilere dönüştürmemizi sağlar. Bazı uygulama alanları:

-   **Sağlık:** Tıbbi görüntülerden (MR, CT) hastalık teşhisi.
-   **Otomotiv:** Sürücüsüz araçlar için şerit takibi, yaya ve araç tespiti.
-   **Güvenlik:** Yüz tanıma sistemleri ve anormal durum tespiti.
-   **Perakende:** Müşteri davranış analizi veya kasasız marketler.
-   **Eğlence:** Filmlerdeki özel efektler ve artırılmış gerçeklik (AR) uygulamaları.

---

## Özet ve Anahtar Kavramlar

-   **Computer Vision:** Makinelerin görsel dünyayı "anlamasını" sağlayan bilim dalıdır. Görüntülerden anlamlı bilgi çıkarır.
-   **Görüntü İşleme:** Görüntüleri manipüle ederek veya iyileştirerek bir görüntüden başka bir görüntü üreten tekniklerdir.
-   **Temel Fark:** Girdi her ikisi için de görüntü olabilir, ancak Görüntü İşleme'nin çıktısı genellikle bir görüntü iken, Computer Vision'ın çıktısı bir bilgidir (etiket, sayı, konum vb.).

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir fotoğrafın Instagram'da "sepia" filtresiyle renklendirilmesi hangi alana girer?</p>
  <div class="quiz-option">A) Computer Vision</div>
  <div class="quiz-option" data-correct="true">B) Görüntü İşleme</div>
  <div class="quiz-option">C) Makine Öğrenmesi</div>
  <div class="quiz-option">D) Veri Bilimi</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B) Görüntü İşleme.</b> Çünkü işlem, bir görüntüyü (orijinal fotoğraf) girdi olarak alıp başka bir görüntüyü (filtreli fotoğraf) çıktı olarak üretmektedir. Görüntünün içeriği hakkında bir yorum yapılmamaktadır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir güvenlik kamerasının, bir otoparktaki boş park yeri sayısını ekrana yazdırması hangi alana girer?</p>
  <div class="quiz-option">A) Görüntü Sıkıştırma</div>
  <div class="quiz-option">B) Artırılmış Gerçeklik</div>
  <div class="quiz-option" data-correct="true">C) Computer Vision</div>
  <div class="quiz-option">D) Görüntü İşleme</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C) Computer Vision.</b> Çünkü sistem, bir video görüntüsünü girdi olarak alıp, onu yorumlayarak anlamlı bir bilgi ("boş park yeri sayısı") üretmektedir.</p>
  </div>
</div>
