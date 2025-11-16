---
layout: default
title: Kamera Kalibrasyonu (Camera Calibration)
nav_order: 15
parent: Computer Vision
---

# Kamera Kalibrasyonu (Camera Calibration)

Bir bilgisayarın bir görüntüden 3D çıkarımlar (bir nesnenin boyutu, konumu, mesafesi vb.) yapabilmesi için, öncelikle o görüntüyü oluşturan kameranın "kimliğini" ve "dünyaya nasıl baktığını" anlaması gerekir. **Kamera Kalibrasyonu**, kameranın bu içsel ve dışsal özelliklerini, yani parametrelerini matematiksel olarak bulma işlemidir.

Bu işlem sonucunda, bir görüntüdeki 2D piksel koordinatları ile o piksellere karşılık gelen 3D dünya ışınları arasında hassas bir geometrik ilişki kurarız.

---

## Kamera Parametreleri Nelerdir?

Kameranın özelliklerini iki ana grupta inceleriz:

### 1. İçsel Parametreler (Intrinsics) - `K` Matrisi
Bunlar kameranın "fabrika ayarlarıdır"; lensin ve sensörün değişmeyen, içsel geometrik özellikleridir.

*   **Odak Uzaklığı (`fx`, `fy`):** Lensin sahneyi ne kadar "yakınlaştırdığını" (zoom) belirler. Genellikle piksel birimi cinsinden ifade edilir.
*   **Optik Merkez (`cx`, `cy`):** Görüntü sensörünün merkezini temsil eden piksel koordinatlarıdır. Genellikle görüntünün genişliğinin ve yüksekliğinin yarısına çok yakındır.

Bu dört parametre, 3x3'lük **İçsel Matris (Camera Matrix)** `K`'yi oluşturur:
<pre>
K = [ fx,  0, cx ]
    [  0, fy, cy ]
    [  0,  0,  1 ]
</pre>

### 2. Dışsal Parametreler (Extrinsics) - `[R|t]` Matrisi
Bunlar kameranın dünyaya göre "pozunu", yani konumunu ve yönelimini tanımlar. Bu parametreler kamera her hareket ettiğinde değişir ve her bir fotoğraf için ayrı ayrı hesaplanır.

*   **Dönüş Matrisi (`R`):** Kameranın hangi yöne baktığını (3D rotasyonunu) tanımlayan 3x3'lük bir matristir.
*   **Öteleme Vektörü (`t`):** Kameranın 3D uzaydaki konumunu tanımlayan 3x1'lik bir vektördür.

### 3. Lens Distorsiyon Parametreleri
Mükemmel lens yoktur. Gerçek lensler, görüntüde geometrik bozulmalara (distorsiyon) neden olur. Kalibrasyon süreci, bu bozulmaları modelleyen **distorsiyon katsayılarını** da bulur. En yaygın iki türü:

*   **Radyal Distorsiyon:** Görüntünün merkezinden uzaklaştıkça artan, çizgilerin içe veya dışa doğru bükülmesine neden olan "fıçı" (barrel) veya "iğne yastığı" (pincushion) bozulması.
*   **Teğetsel Distorsiyon:** Lensin ve sensörün tam olarak paralel olmamasından kaynaklanan bozulmalar.

---

## Projeksiyon Denklemi: Hepsini Birleştirmek

Bir 3D dünya noktasının `P_world = (X, Y, Z)` bir 2D görüntü pikseline `p_image = (u, v)` nasıl yansıtıldığını gösteren denklem şöyledir:

`p_image = K * [R|t] * P_world`

Kalibrasyonun amacı, bu denklemdeki bilinmeyenleri, yani `K`, `R`, `t` ve distorsiyon katsayılarını bulmaktır.

---

## Kalibrasyon Süreci: Satranç Tahtası Yöntemi

Bu parametreleri bulmak için, 3D'deki konumlarını bildiğimiz noktaların, görüntüdeki 2D piksel konumlarını bildiğimiz karşılıklarına ihtiyacımız vardır. Bu amaçla genellikle bir **satranç tahtası** kullanılır.

1.  **Görüntüleri Çekme:** Satranç tahtasının farklı açılardan ve konumlardan çok sayıda fotoğrafı çekilir.
2.  **2D Köşeleri Bulma:** Her bir fotoğrafta, satranç tahtası köşelerinin 2D piksel koordinatları `(u,v)` otomatik olarak tespit edilir.
3.  **3D Noktaları Tanımlama:** Satranç tahtası düzlemsel olduğu için, bir köşeyi `(0,0,0)` kabul edebiliriz. Karenin boyutu bilindiği için, diğer tüm köşelerin 3D dünya koordinatlarını `(X,Y,0)` olarak tanımlayabiliriz.
4.  **Optimizasyon:** Bu 2D-3D nokta eşleşmeleri bir optimizasyon algoritmasına verilir. Algoritma, projeksiyon denklemindeki hatayı en aza indirecek en iyi `K`, `R`, `t` ve distorsiyon parametrelerini hesaplar.

<pre>
Süreç Özeti:

[Satranç Tahtası Görüntüleri]
            |
            v
[2D Köşe Noktaları (u,v)]  <-->  [3D Köşe Noktaları (X,Y,0)]
            |
            v
[Optimizasyon Algoritması]
            |
            v
[K (İçsel), R, t (Dışsal), Distorsiyon Katsayıları]
</pre>

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> Bir kamerayı kalibre etmenin temel amacı nedir?</p>
  <div class="quiz-option">A) Fotoğrafları daha güzel hale getirmek.</div>
  <div class="quiz-option">B) Kameranın pil ömrünü uzatmak.</div>
  <div class="quiz-option" data-correct="true">C) Görüntülerden hassas 3D ölçümler yapabilmek için kameranın bilinmeyen parametrelerini bulmak.</div>
  <div class="quiz-option">D) Kameranın hafıza kartını formatlamak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Kalibrasyon, 2D görüntü pikselleri ile 3D dünya arasındaki geometrik ilişkiyi tam olarak modellememizi sağlayan parametreleri bulma işlemidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Kamera kalibrasyonu sırasında neden bir satranç tahtası gibi bilinen bir desen kullanılır?</p>
  <div class="quiz-option">A) Siyah-beyaz olduğu için estetik görünür.</div>
  <div class="quiz-option" data-correct="true">B) Gerçek dünyadaki 3D noktalar ile görüntüdeki 2D pikseller arasında kesin eşleşmeler kurmayı sağlar.</div>
  <div class="quiz-option">C) Lensin kirlenmesini önler.</div>
  <div class="quiz-option">D) Sadece tek bir fotoğraf çekmenin yeterli olması için.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kalibrasyon algoritmasının temel girdisi, 3D dünya koordinatları (`X,Y,Z`) ile bu noktaların görüntüdeki 2D piksel karşılıkları (`u,v`) arasındaki eşleşmelerdir. Satranç tahtası, bu eşleşmeleri hassas bir şekilde kurmayı kolaylaştırır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir video analizi projesinde, tavana sabitlenmiş bir güvenlik kamerasının görüntülerini kullanıyorsunuz. Kamera kalibrasyonu yapıldıktan sonra, bu kameranın hangi parametre seti zamanla **değişmez**?</p>
  <div class="quiz-option" data-correct="true">A) İçsel Parametreler (Intrinsics)</div>
  <div class="quiz-option">B) Dışsal Parametreler (Extrinsics)</div>
  <div class="quiz-option">C) Hem içsel hem dışsal parametreler</div>
  <div class="quiz-option">D) Hiçbiri, hepsi değişebilir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> İçsel parametreler (odak uzaklığı, optik merkez) lensin ve sensörün özellikleridir ve değişmezler. Dışsal parametreler ise kameranın dünyadaki pozunu (konum ve yönelim) belirtir. Kamera sabitlendiği için dışsal parametreler de bu senaryoda değişmez, ancak genel olarak kamera hareket ettikçe değişen onlardır. Sorunun en doğru ve genel cevabı içsel parametrelerin sabit olduğudur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Kalibrasyon sonrası elde edilen distorsiyon katsayıları ne için kullanılır?</p>
  <div class="quiz-option">A) Görüntünün parlaklığını artırmak için.</div>
  <div class="quiz-option">B) Görüntüye sanatsal bir "balık gözü" efekti eklemek için.</div>
  <div class="quiz-option" data-correct="true">C) Lensten kaynaklanan geometrik bozulmaları (eğrilmeleri) düzelterek görüntüyü "düzleştirmek" için.</div>
  <div class="quiz-option">D) Kameranın odak uzaklığını değiştirmek için.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Distorsiyon katsayıları, lensteki kusurların yarattığı fıçı/iğne yastığı gibi bozulmaları matematiksel olarak modeller. Bu katsayılar kullanılarak görüntüdeki her pikselin olması gereken doğru konuma taşınmasıyla "undistortion" (düzeltme) işlemi yapılır.</p>
  </div>
</div>

