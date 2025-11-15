---
layout: default
title: Uygulama Alanlari ve Sistem Bilesenleri
parent: 1. Giriş
nav_order: 2
---

# Uygulama Alanlari ve Sistem Bilesenleri

Bu bölümde Bilgisayarlı Görü uygulamalarının çeşitliliğini ve tipik bir sistemin yapı taşlarını adım adım ele alıyoruz. Her adımda temel kavramın yanı sıra dikkat etmen gereken püf noktalarını ve pratik önerileri bulacaksın.

## Adım 1 – Uygulama Kategorilerini Haritalandır

- **Algılama ve İzleme:** Güvenlik kameralarında kişi veya nesne takibi, spor yayınlarında oyuncu hareketlerinin analizi.  
  - *İpucu:* İzleme projeleri çoğu zaman önce sağlam bir algılama modeli, ardından veri ilişkilendirme stratejisi gerektirir.
- **Anlamlandırma ve Sınıflandırma:** Bir görüntünün veya video karesinin sahne türünü, hava durumunu ya da trafik yoğunluğunu sınıflandırmak.  
  - *Strateji:* Sınıflandırma veri setlerinde sınıf dengesizliği sık görülür; ağırlıklı kayıp fonksiyonları veya veri çoğaltma teknikleri kullan.
- **Yeniden Oluşturma ve Ölçüm:** Fotogrametri, 3B model çıkarımı, artırılmış gerçeklik için kamera poz tahmini.  
  - *Kontrol:* Kalibrasyon hataları 3B sonuçları dramatik biçimde bozar; çekim düzenini ve hedef boyutlarını kaydet.
- **Etkileşim ve Denetim:** Sanal gerçeklik el takip sistemleri, jestle kontrol edilen arayüzler, robot navigasyonu.  
  - *Öneri:* Bu kategoride gecikme süreleri kritik; pipelinenın her aşamasını profille.

## Adım 2 – Tipik Bir Bilgisayarlı Görü Boru Hattını Çöz

1. **Algı Sensörü:** Kamera, LiDAR veya derinlik sensörü.  
   - *Dikkat:* Deklanşör türü (rolling vs. global) hareketli sahnelerde artefakt üretebilir.
2. **Görüntü Oluşturma ve Kalibrasyon:** Ham verinin doğrusal olmayan hatalardan arındırılması, renksel düzenleme, lens distorsiyonunun giderilmesi.  
   - *Tüyolar:* Kalibrasyon tahtalarını farklı uzaklıklarda çekerek parametreleri sağlamlaştır.
3. **Önişleme:** Gürültü azaltma, kontrast iyileştirme, beyaz dengesi.  
   - *Trick:* Kütle merkezini koruyan filtreler (örneğin bilateral) kenar bilgilerini korur.
4. **Özellik Çıkarımı:** Kenarlar, köşeler, bölgeler veya derin ağların ara katman aktivasyonları.  
   - *Not:* Özellik ölçeği, takip edeceğin nesnenin boyut aralığıyla uyumlu olmalı.
5. **Karar Verme ve Çıkış:** Entegre edilen özelliklerin sınıflandırılması, regresyonu veya olasılıksal modellenmesi.  
   - *Öneri:* Çıkış katmanında belirsizlik ölçmek için softmax entropisi veya bayesçi yöntemler ekle.

## Adım 3 – Örnek Proje Kurguları

- **Akıllı Perakende Rafı:** Raf görüntülerini işleyip stok azaldığında uyarı gönderir. Aşamalar: kamera kalibrasyonu → aydınlatma normalizasyonu → ürün tespiti → boş raf yüzdesi hesaplama.
- **Cerrahi Destek Sistemi:** Ameliyat kamerasından gelen video üzerinde kritik dokuları vurgular. İhtiyaçlar: gerçek zamanlı segmentasyon, düşük gecikme, hassas renk doğruluğu.
- **Otonom Dron:** Arazi haritalaması için eşzamanlı konumlandırma ve haritalama (SLAM). Zorluk: titreşim, aydınlatma değişimi, sınırlı hesaplama gücü.

## Adım 4 – Yaygın Zorlukları Önceden Kur

- **Veri Çeşitliliği:** Sahneler, hava durumu, kamera ayarları değiştikçe performans düşebilir. Domain adaptation teknikleri planla.
- **Yerleşik Sistem Kısıtları:** Mobil cihazlarda bellek ve enerji sınırlıdır; model daraltma (quantization, pruning) stratejilerini önden belirle.
- **Etiketleme Maliyeti:** Büyük veri kümeleri için yarı denetimli veya öz denetimli yaklaşımlar zamandan tasarruf sağlar.

## Adım 5 – Pratik Çalışmalar

1. **Sınıflandırma Haritası:** Haftalık olarak karşılaştığın CV uygulamalarını tabloya dök. Sensör, önişleme, model ve çıktı bileşenlerini sütunlarda listele.
2. **Boru Hattı Tasarımı:** Seçtiğin bir problemi (ör. park yeri doluluğu) üstteki adımlarla çözmek için ayrıntılı akış diyagramı hazırla.
3. **Risk Analizi:** Tespit ettiğin üç zorluğu (ör. veri çeşitliliği, gecikme) için azaltma stratejileri yaz. Teknik, araç ve metrik belirle.

Bu adımları tamamladığında yalnızca uygulama örneklerini ezberlemekle kalmaz, yeni projeleri de sistematik biçimde parçalayabilir hale gelirsin. Bir sonraki bölümde görsel algılamayı zorlaştıran fiziksel ve algısal faktörleri detaylandıracağız.

