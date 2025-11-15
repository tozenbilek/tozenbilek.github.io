---
layout: default
title: Goruntu Yorumlamanin Zorluklari
parent: 1. Giriş
nav_order: 3
---

# Goruntu Yorumlamanin Zorluklari

Görüntülerdeki bilgi yüzeysel olarak net görünse de, fiziksel dünya ile ölçümlerin arasındaki kopukluk bilgisayarlı görüyü zorlaştırır. Bu sayfada zorluğu üç açıdan inceliyoruz: fizik, algı, hesaplama.

## Adım 1 – Fiziksel Belirsizlikleri Tanı

- **Aydınlatma Alternatifleri:** Aynı nesne farklı ışık koşullarında tamamen farklı piksel dağılımı üretir.  
  - *Öneri:* Veriyi toplarken ışık kaynağı açısını ve renk sıcaklığını kayda al, eğitim veri setini bu parametrelerle zenginleştir.
- **Malzeme ve Geometri Etkileşimi:** Mat, parlak veya yarı saydam yüzeyler sensörde bambaşka cevaplar üretir.  
  - *İpucu:* BRDF modelleri veya görüntü tabanlı relighting yöntemleri kullanarak varyasyonu simüle et.
- **Projeksiyon Kayıpları:** 3B sahne 2B düzleme aktarılırken derinlik bilgisi kaybolur; perspektif bozulmaları nesne boyutlarını güvenilmez kılar.

## Adım 2 – Algısal Tuzakları Hatırla

- **Görsel İllüzyonlar:** Adelson’un gölge illüzyonunda olduğu gibi aynı yoğunluğa sahip kareleri insan farklı algılar; bu, ham yoğunluk verisine dayanan algoritmaların ne kadar hassas olması gerektiğini hatırlatır.
- **Şekil-Tasarım Belirsizliği:** İnsanlar bağlamdan hızlıca sonuç çıkarır; bilgisayarların benzer bağlamsal ipuçlarını modele katması gerekir (ör. ilişki çıkarımı, graf tabanlı yaklaşımlar).
- **Hareket Yanılsamaları:** Statik görüntülerde hareket varmış hissi, optik akış tahmininde yanıltıcı olabilir; zaman filtreleriyle bu hataları azalt.

## Adım 3 – Hesaplama ve Veri Boyutu Engelleri

- **Gerçek Zaman Kısıtları:** Otonom sürüşte saniyede onlarca kare işlemek zorundasın; pipeline'da gecikme bütçesi tut.  
  - *Trick:* Modeli katman bazında profille, darboğazı GPU/CPU ayrımıyla saptayıp optimize et.
- **Veri Etiketleme:** Derin ağlar milyonlarca örnek ister. Veri kümesi üretmek pahalı olduğundan aktif öğrenme veya öz denetimli yöntemler planla.
- **Genelleme:** Eğitim verisiyle test verisi arasındaki dağılım farkı sahaya çıkıldığında başarısızlık doğurur; domain generalization teknikleri kritik.

## Adım 4 – Zorlukları Ölçülebilir Hale Getir

- **Metriği Önce Seç:** mAP, IoU, F1 veya poz tahmin hatası gibi metrikler, hangi zorluğun seni daha fazla etkilediğini sayısal olarak gösterir.
- **Kıyaslı Senaryolar Oluştur:** Aynı modeli farklı ışık koşulları, çözünürlükler ve gürültü seviyelerinde denerken sonuçları tabloya dök.
- **Hataları Sınıflandır:** Yanlış pozitif, yanlış negatif, düşük güven gibi kategoriler belirleyerek geliştirme planı çıkar.

## Adım 5 – Çalışma Listesi

1. **İllüzyon Analizi:** Adelson gölge illüzyonu veya benzer örnekleri yeniden oluştur; histogram analizi yap ve piksel değerlerinin eşit olduğunu kanıtla.
2. **Aydınlatma Deneyi:** Aynı objeyi üç farklı ışık kaynağıyla fotoğrafla; histogramları karşılaştır ve hangi önişleme adımlarının farkı azalttığını raporla.
3. **Pipeline Profili:** Seçtiğin bir algoritmanın her aşamasına zaman damgası ekle; gerçek zaman hedefiyle kıyaslayıp darboğazı belirle.

Bu farkındalıkla ilerlediğinde, yalnızca algoritmaları uygulamakla kalmaz, sahadaki beklenmedik durumlara karşı hazırlıklı olursun.

