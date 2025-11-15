---
layout: default
title: Bilgisayarlı Görü Nedir?
parent: 1. Giriş
nav_order: 1
---

# Bilgisayarlı Görü (Computer Vision) Nedir?

**Bilgisayarlı Görü**, bilgisayarların ve sistemlerin dijital görüntülerden veya videolardan anlamlı bilgiler elde etmesini sağlayan bir bilim ve teknoloji alanıdır. Temel amaç, insan görsel sisteminin yapabildiği görevleri otomatikleştirmektir. Yani, "görmek" ve "anlamak" eylemlerini makinelere öğretmektir.

![Seeing vs Understanding](https://placehold.co/600x300/EEE/31343C?text=Görmek+(Piksel+Matrisi)+->+Anlamak+(Bu+bir+KEDİDİR))
*<center>Bilgisayarlı Görü, sadece pikselleri görmekle kalmaz, aynı zamanda bu piksellerin ne anlama geldiğini yorumlar.</center>*

## Temel Amaç

Her resim bir hikaye anlatır. Bilgisayarlı Görü'nün temel amacı, bilgisayar programları yazarak bu hikayeyi yorumlayabilmektir. Bu, bir görüntüdeki nesneleri tanımak, sahneyi üç boyutlu olarak algılamak veya bir videodaki hareketleri takip etmek gibi görevleri içerebilir.

## Bilgisayarlı Görü vs. Görüntü İşleme

Bu iki kavram sıkça karıştırılsa da aralarında önemli bir fark vardır:

-   **Görüntü İşleme (Image Processing):** Genellikle bir görüntüyü girdi olarak alıp, başka bir görüntüyü çıktı olarak üreten operasyonlarla ilgilenir. Amaç genellikle görüntüyü iyileştirmek veya değiştirmektir (örneğin, bulanıklaştırma, netleştirme, renk düzeltme).
-   **Bilgisayarlı Görü (Computer Vision):** Bir görüntüyü girdi olarak alır, ancak çıktısı genellikle bir görüntü değil, bir **bilgi** veya **yorumdur** (örneğin, "görüntüde 3 kedi var", "nesne 5 metre uzakta", "bu bir insan yüzü").

![Image Processing vs Computer Vision](https://placehold.co/800x300/EEE/31343C?text=Görüntü+İşleme+(Görüntü->Görüntü)+vs.+CV+(Görüntü->Bilgi))
*<center>Temel fark: Görüntü İşleme görüntüyü manipüle ederken, Bilgisayarlı Görü görüntüden anlam çıkarır.</center>*

> Görüntü işleme operasyonları, genellikle Bilgisayarlı Görü algoritmalarının bir parçası olarak, ön işleme adımlarında sıklıkla kullanılır.

## Neden Önemlidir?

Günümüzde görüntü ve video verisi her yerdedir. Akıllı telefonlardan güvenlik kameralarına, tıbbi görüntüleme cihazlarından otonom araçlara kadar milyarlarca cihaz sürekli olarak görsel veri üretmektedir. Bilgisayarlı Görü, bu devasa veriyi işleyerek değerli bilgilere dönüştürmemizi sağlar. Bazı uygulama alanları:

-   **Sağlık:** Tıbbi görüntülerden (MR, CT) hastalık teşhisi.
-   **Otomotiv:** Sürücüsüz araçlar için şerit takibi, yaya ve araç tespiti.
-   **Güvenlik:** Yüz tanıma sistemleri ve anormal durum tespiti.
-   **Perakende:** Müşteri davranış analizi veya kasasız marketler.
-   **Eğlence:** Filmlerdeki özel efektler ve artırılmış gerçeklik (AR) uygulamaları.

---

## Özet ve Anahtar Kavramlar

-   **Bilgisayarlı Görü:** Makinelerin görsel dünyayı "anlamasını" sağlayan bilim dalıdır. Görüntülerden anlamlı bilgi çıkarır.
-   **Görüntü İşleme:** Görüntüleri manipüle ederek veya iyileştirerek bir görüntüden başka bir görüntü üreten tekniklerdir.
-   **Temel Fark:** Girdi her ikisi için de görüntü olabilir, ancak Görüntü İşleme'nin çıktısı genellikle bir görüntü iken, Bilgisayarlı Görü'nün çıktısı bir bilgidir (etiket, sayı, konum vb.).

---

## Kavrama Soruları

<details>
  <summary><b>Soru 1:</b> Bir fotoğrafın Instagram'da "sepia" filtresiyle renklendirilmesi hangi alana girer?</summary>
  <br>
  A) Bilgisayarlı Görü<br>
  B) Görüntü İşleme<br>
  C) Makine Öğrenmesi<br>
  D) Veri Bilimi<br>
  <p><b>Cevap: B) Görüntü İşleme.</b> Çünkü işlem, bir görüntüyü (orijinal fotoğraf) girdi olarak alıp başka bir görüntüyü (filtreli fotoğraf) çıktı olarak üretmektedir. Görüntünün içeriği hakkında bir yorum yapılmamaktadır.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Bir güvenlik kamerasının, bir otoparktaki boş park yeri sayısını ekrana yazdırması hangi alana girer?</summary>
  <br>
  A) Görüntü Sıkıştırma<br>
  B) Artırılmış Gerçeklik<br>
  C) Bilgisayarlı Görü<br>
  D) Görüntü İşleme<br>
  <p><b>Cevap: C) Bilgisayarlı Görü.</b> Çünkü sistem, bir video görüntüsünü girdi olarak alıp, onu yorumlayarak anlamlı bir bilgi ("boş park yeri sayısı") üretmektedir.</p>
</details>
