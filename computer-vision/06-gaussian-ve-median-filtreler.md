---
layout: default
title: Gaussian ve Median Filtreler
nav_order: 6
parent: Computer Vision
---

# Gelişmiş Filtreler: Gaussian ve Median

Basit ortalama (box) filtresi, gürültüyü azaltmak için iyi bir başlangıç noktasıdır, ancak her tür gürültü için en iyi çözüm değildir ve bazı istenmeyen yan etkilere neden olabilir. Bu bölümde, daha sofistike ve yaygın olarak kullanılan iki filtreleme tekniğini inceleyeceğiz: **Gaussian filtresi** ve **Median filtresi**.

---

## 1. Gaussian Filtresi

Basit ortalama filtresi, komşu piksellerin hepsine eşit ağırlık verir. Ancak daha mantıklı bir yaklaşım, merkez piksele daha yakın olan komşuların, daha uzaktakilere göre daha fazla katkıda bulunmasıdır. Gaussian filtresi tam olarak bunu yapar.

Kernelin ağırlıkları, merkezde en yüksek olan ve merkezden uzaklaştıkça pürüzsüzce azalan bir 2D Gaussian fonksiyonu ("çan eğrisi") kullanılarak hesaplanır.

![Gaussian Kernel](https://via.placeholder.com/400x300.png?text=Gaussian+Kernel+(3D+Görünüm))
*Görsel: Bir Gaussian kernelin ağırlıklarının 3D gösterimi. Merkezdeki ağırlık en yüksektir.*

### Gaussian Filtresinin Avantajları:
*   **Daha Pürüzsüz Sonuçlar:** Kutu filtrenin yaratabileceği "bloklu" veya köşeli yapaylıkları (artifacts) oluşturmaz, daha doğal bir bulanıklaştırma sağlar.
*   **Parametrik Kontrol:** Gaussian fonksiyonunun standart sapması (`sigma`) ayarlanarak bulanıklaştırmanın miktarı hassas bir şekilde kontrol edilebilir. Daha büyük `sigma` değeri, daha fazla bulanıklaştırma anlamına gelir.

Gaussian filtresi, gürültü azaltma ve daha sonraki adımlar (kenar tespiti gibi) için görüntüleri ön işleme amacıyla Computer Vision'da en sık kullanılan bulanıklaştırma filtresidir.

---

## 2. Median Filtresi

Gaussian ve ortalama filtreleri, `Gaussian Noise` gibi dağılmış gürültü türleri için etkilidir. Ancak **Salt and Pepper Noise (Tuz ve Biber)** gibi aykırı değerlere sahip gürültülerde başarısız olurlar. Çünkü `0` (biber) veya `255` (tuz) gibi aşırı bir değer, ortalamayı tek başına önemli ölçüde saptırabilir.

**Median filtresi**, bu soruna zarif bir çözüm sunar. Bir pikselin yeni değerini, komşularının ortalaması olarak değil, **medyanı** olarak belirler.

**Medyan Nasıl Çalışır?**
1.  Filtre penceresi içindeki tüm piksel değerleri alınır.
2.  Bu değerler küçükten büyüğe sıralanır.
3.  Sıralanmış listenin ortasındaki değer, merkez pikselin yeni değeri olarak atanır.

### Median Filtresinin Avantajları:
*   **Aykırı Değerlere Karşı Dayanıklılık:** Sıralama işlemi sayesinde, `0` veya `255` gibi aşırı değerler listenin en başına veya en sonuna atılır ve orta değeri (medyanı) etkilemezler. Bu, "Tuz ve Biber" gürültüsünü temizlemede son derece etkili olmasını sağlar.
*   **Kenarları Koruma:** Ortalama filtrelerine kıyasla, görüntünün önemli bir özelliği olan kenarları daha az bulanıklaştırma eğilimindedir.

![Median Filter Example](https://via.placeholder.com/700x250.png?text=Gürültülü+Görüntü+->+Gaussian+Filter+->+Median+Filter)
*Görsel: "Tuz ve Biber" gürültüsüne sahip bir görüntüde, Gaussian filtresi gürültüyü sadece yayarken, Median filtresi onu etkili bir şekilde temizler.*

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir görüntüde çok sayıda "Salt and Pepper" gürültüsü (rastgele beyaz ve siyah noktalar) varsa, bu gürültüyü temizlemek için en uygun filtre hangisidir?</p>
  <div class="quiz-option">A) Gaussian filtresi</div>
  <div class="quiz-option" data-correct="true">B) Median filtresi</div>
  <div class="quiz-option">C) Kutu (Box) filtresi</div>
  <div class="quiz-option">D) Kenar keskinleştirme filtresi</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Median filtresi, komşu piksellerin medyanını (orta değerini) alarak çalışır. Bu yöntem, ortalamayı aşırı derecede etkileyen aykırı değerleri (tuz ve biber gürültüsü gibi) etkili bir şekilde göz ardı eder ve temizler.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Gaussian filtresinin bulanıklaştırma miktarını kontrol eden ana parametre nedir?</p>
  <div class="quiz-option">A) Kernelin boyutu (örn: 3x3, 5x5)</div>
  <div class="quiz-option" data-correct="true">B) Gaussian fonksiyonunun standart sapması (`sigma`)</div>
  <div class="quiz-option">C) Görüntünün parlaklığı</div>
  <div class="quiz-option">D) Kerneldeki ağırlıkların toplamı</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `Sigma` değeri, Gaussian çan eğrisinin genişliğini belirler. Daha büyük bir `sigma`, daha geniş bir eğri ve dolayısıyla daha fazla komşunun hesaba katıldığı daha güçlü bir bulanıklaştırma anlamına gelir.</p>
  </div>
</div>

