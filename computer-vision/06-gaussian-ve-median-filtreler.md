---
layout: default
title: Gaussian ve Median Filtreler
nav_order: 6
parent: Computer Vision
---

# Gelişmiş Filtreler: Gaussian ve Median

Basit ortalama (box) filtresi, komşu piksellerin hepsine eşit ağırlık vererek gürültüyü azaltır. Ancak bu "herkese eşit davranma" yaklaşımı, hem `Salt and Pepper` gibi aykırı değerlere karşı savunmasızdır hem de köşeli, yapay görünümlere (artifacts) neden olabilir. Bu bölümde, bu sorunları aşan iki sofistike filtreyi inceleyeceğiz: **Gaussian** ve **Median**.

---

## 1. Gaussian Filtresi: Ağırlıklı Ortalama

Gaussian filtresi, "merkez piksele daha yakın olan komşular, daha önemlidir" sezgisini temel alır. Kernelin ağırlıkları, merkezde en yüksek olan ve merkezden uzaklaştıkça pürüzsüzce azalan bir 2D Gaussian fonksiyonu ("çan eğrisi") kullanılarak hesaplanır. Bu sayede daha doğal bir bulanıklaştırma sağlar.

*   **Parametrik Kontrol:** Gaussian fonksiyonunun standart sapması (`sigma`), bulanıklaştırmanın miktarını hassas bir şekilde kontrol eder.
    *   **Küçük `sigma`:** Sadece en yakın komşular hesaba katılır, hafif bir bulanıklaştırma olur.
    *   **Büyük `sigma`:** Uzaktaki komşuların da etkisi artar, daha güçlü bir bulanıklaştırma olur.

Gaussian filtresi, özellikle `Gaussian` tipi gürültüyü azaltmak ve kenar tespiti gibi sonraki adımlar için görüntüleri ön işlemek amacıyla en sık kullanılan bulanıklaştırma filtresidir.

<div class="quiz-question">
  <p><b>Soru:</b> Gaussian filtresinin bulanıklaştırma miktarını kontrol eden ana parametre nedir?</p>
  <div class="quiz-option">A) Kernelin boyutu (örn: 3x3, 5x5)</div>
  <div class="quiz-option" data-correct="true">B) Gaussian fonksiyonunun standart sapması (`sigma`)</div>
  <div class="quiz-option">C) Görüntünün parlaklığı</div>
  <div class="quiz-option">D) Kerneldeki ağırlıkların toplamı</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `Sigma` değeri, Gaussian çan eğrisinin genişliğini belirler. Daha büyük bir `sigma`, daha geniş bir eğri ve dolayısıyla daha fazla komşunun hesaba katıldığı daha güçlü bir bulanıklaştırma anlamına gelir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Gaussian filtresini, basit bir "box filter"a (ortalama filtresi) göre daha avantajlı kılan temel fikir nedir?</p>
  <div class="quiz-option">A) Daha hızlı çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Merkez piksele daha yakın komşulara daha fazla ağırlık vermesi.</div>
  <div class="quiz-option">C) Sadece siyah-beyaz görüntülerde çalışması.</div>
  <div class="quiz-option">D) Kerneldeki tüm değerlerin pozitif olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Box filter tüm komşuları eşit görürken, Gaussian filtresi "yakındaki pikseller daha önemlidir" sezgisini temel alır. Bu, daha yumuşak ve doğal görünümlü bir bulanıklaştırma sağlar.</p>
  </div>
</div>

---

## 2. Median Filtresi: Sıralamaya Dayalı Gürültü Temizleme

`Salt and Pepper` gürültüsü gibi aşırı aykırı değerler (`0` veya `255`), ortalama tabanlı filtreleri (Box, Gaussian) kolayca bozar. Median filtresi, bu soruna ortalama almak yerine **medyan** (orta değer) bularak zarif bir çözüm sunar.

**Medyan Nasıl Çalışır?**
1.  Filtre penceresi içindeki tüm piksel değerleri bir listeye alınır.
2.  Bu liste küçükten büyüğe sıralanır.
3.  Sıralanmış listenin tam ortasındaki değer, merkez pikselin yeni değeri olarak atanır.

<pre>
Penceredeki Değerler:
[[50, 60, 255],
 [70, 80, 90],
 [40, 55, 0]]

Adım 1: Tüm değerleri listele -> [50, 60, 255, 70, 80, 90, 40, 55, 0]

Adım 2: Listeyi sırala -> [<b>0</b>, 40, 50, 55, <b style="color:red;">60</b>, 70, 80, 90, <b>255</b>]
                          (Aykırı değerler en uca gider)

Adım 3: Ortadaki değeri seç -> Yeni Değer: 60
</pre>

Bu yöntem sayesinde, `0` ve `255` gibi aşırı değerler listenin en başına veya en sonuna atıldığı için orta değeri (medyanı) etkileyemezler. Bu, "Tuz ve Biber" gürültüsünü temizlemede son derece etkilidir ve kenarları ortalama filtrelerine göre daha iyi korur.

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntüde çok sayıda "Salt and Pepper" gürültüsü (rastgele beyaz ve siyah noktalar) varsa, bu gürültüyü temizlemek için en uygun filtre hangisidir?</p>
  <div class="quiz-option">A) Gaussian filtresi</div>
  <div class="quiz-option" data-correct="true">B) Median filtresi</div>
  <div class="quiz-option">C) Kutu (Box) filtresi</div>
  <div class="quiz-option">D) Kenar keskinleştirme filtresi</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Median filtresi, komşu piksellerin medyanını (orta değerini) alarak çalışır. Bu yöntem, ortalamayı aşırı derecede etkileyen aykırı değerleri (tuz ve biber gürültüsü gibi) etkili bir şekilde göz ardı eder ve temizler.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir 3x3 penceredeki piksel değerleri `[10, 20, 15, 25, 18, 90, 5, 22, 12]` ise, Median filtresi uygulandıktan sonra merkez pikselin yeni değeri ne olur?</p>
  <div class="quiz-option">A) 24</div>
  <div class="quiz-option">B) 90</div>
  <div class="quiz-option" data-correct="true">C) 18</div>
  <div class="quiz-option">D) 5</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Değerleri sıraladığımızda: `[5, 10, 12, 15, 18, 20, 22, 25, 90]`. 9 elemanlı bu listenin ortasındaki (5. eleman) değer `18`'dir.</p>
  </div>
</div>

---

## 3. Filtrelerin Karşılaştırması

| Filtre Türü | Çalışma Prensibi | İyi Olduğu Gürültü | Temel Dezavantajı |
| :--- | :--- | :--- | :--- |
| **Box Filter** | Tüm komşuların ortalaması | Hafif, genel gürültü | Kenarları bulanıklaştırır, aykırı değerlere hassastır |
| **Gaussian** | Merkeze ağırlıklı ortalama | `Gaussian` gürültüsü | Kenarları yine de bulanıklaştırır |
| **Median** | Komşuların orta değeri | `Salt & Pepper` gürültüsü | Gaussian'a göre daha yavaştır, ince desenleri bozabilir |

<div class="quiz-question">
  <p><b>Soru:</b> Düşük ışıkta çekildiği için genel bir "karıncalanma" (Gaussian noise) olan, ancak aynı zamanda birkaç tane de arızalı pikselden kaynaklanan parlak beyaz nokta (Salt/Impulse noise) içeren bir görüntüyü temizlemek için hangi strateji en mantıklısıdır?</p>
  <div class="quiz-option">A) Sadece güçlü bir Gaussian filtresi uygulamak.</div>
  <div class="quiz-option" data-correct="true">B) Önce Median filtresi uygulayıp sonra hafif bir Gaussian filtresi uygulamak.</div>
  <div class="quiz-option">C) Sadece Median filtresi uygulamak.</div>
  <div class="quiz-option">D) Önce Gaussian filtresi uygulayıp sonra Median filtresi uygulamak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> En mantıklı yaklaşım, önce aykırı değerlere karşı güçlü olan Median filtresi ile parlak beyaz noktaları temizlemek, ardından kalan genel karıncalanmayı yumuşatmak için hafif bir Gaussian filtresi uygulamaktır. Diğer türlü (önce Gaussian), parlak beyaz noktalar etrafa "bulaşarak" daha büyük lekelere dönüşür ve Median filtresinin işini zorlaştırır.</p>
  </div>
</div>

---

