---
layout: default
title: Stereo Vision ve Derinlik Algılama
nav_order: 16
parent: Computer Vision
---

# Stereo Vision ve Derinlik Algılama

Tek bir 2D görüntüden 3D yapıyı çıkarmak (derinliği anlamak) doğası gereği belirsiz bir problemdir. Aynı 2D görüntüyü oluşturabilecek sonsuz sayıda farklı 3D sahne olabilir. İnsanlar ve birçok hayvan, bu belirsizliği çözmek için iki göz kullanır. Computer Vision'da bu prensibi taklit eden alana **Stereo Vision** denir.

---

## 1. Temel Fikir: İki Gözle Derinlik

İki gözümüz (veya iki kamera), dünyayı birbirinden yatay olarak hafifçe kaydırılmış iki farklı bakış açısından görür. Beynimiz, bu iki görüntü arasındaki küçük farkları analiz ederek nesnelerin bize olan göreceli uzaklıklarını, yani derinliği algılar.

Bu farka **Disparite (Disparity)** veya **Eşitsizlik** denir.
*   **Yakındaki nesneler**, iki gözün görüntülerinde birbirine göre daha fazla kaymış görünür (yüksek disparite).
*   **Uzaktaki nesneler**, iki gözün görüntülerinde neredeyse aynı konumda görünür (düşük disparite).

Parmağınızı önce yüzünüze yakın tutup sonra kolunuzu uzatarak sırayla tek gözünüzü kapatıp açtığınızda bu etkiyi kolayca gözlemleyebilirsiniz.

---

## 2. Disparite ve Derinlik

En basit stereo sistemde, iki kamera birbirine paralel, optik eksenleri aynı yöne bakacak ve görüntü düzlemleri aynı hizada olacak şekilde yerleştirilir. Bu idealize edilmiş durumda, bir `P` noktasının derinliği (`Z`) ile disparitesi (`d`) arasında ters orantılı bir ilişki vardır:

`Z = (f * B) / d`

*   `Z`: Noktanın kameraya olan derinliği (uzaklığı).
*   `f`: Kameraların odak uzaklığı.
*   `B`: Kameralar arasındaki mesafe (baseline).
*   `d`: Disparite (`x_sol - x_sağ`).

Bu denklem, eğer bir noktanın iki görüntü arasındaki piksel kaymasını (`d`) bulabilirsek, o noktanın derinliğini (`Z`) doğrudan hesaplayabileceğimizi gösterir.

![Stereo Geometry](https://via.placeholder.com/600x300.png?text=Stereo+Kamera+Sistemi+ve+Disparite)
*Görsel: Paralel bir stereo kamera sisteminde, P noktasının sol ve sağ görüntülerdeki izdüşümleri arasındaki fark olan disparite (d), noktanın derinliği (Z) ile ters orantılıdır.*

---

## 3. Epipolar Geometri

Peki, sol görüntüdeki bir `p` pikselinin sağ görüntüdeki karşılığı `p'` nerede olabilir? `p'` pikseli, sağ görüntünün tamamında rastgele bir yerde olamaz. İki kameranın geometrisi, `p'`'nin nerede olabileceğini sınırlar. Bu kısıtlamaları tanımlayan geometriye **Epipolar Geometri** denir.

*   **Epipolar Çizgi (Epipolar Line):** Sol görüntüdeki bir `p` noktası için, sağ görüntüdeki karşılığı `p'`'nin üzerinde bulunmak zorunda olduğu çizgiye denir.
*   **Epipolar Kısıtlama (Epipolar Constraint):** Bu kısıtlama sayesinde, bir pikselin karşılığını arama problemi, tüm 2D görüntü yüzeyinden **1D bir çizgiye** indirgenir. Bu, arama işlemini çok büyük ölçüde basitleştirir ve hızlandırır.

Paralel stereo sistemde, tüm epipolar çizgiler görüntünün tarama çizgileriyle aynı, yani yataydır.

---

## 4. Eşleştirme Problemi (The Correspondence Problem)

Stereo Vision'ın kalbindeki en zorlu problem budur: Sol görüntüdeki her bir piksel veya piksel bölgesi için, sağ görüntüdeki epipolar çizgi üzerinde ona karşılık gelen doğru pikseli bulmak.

Bu eşleştirmeyi yapmak için genellikle, sol görüntüdeki küçük bir pencere (örneğin 5x5 piksel) alınır ve sağ görüntüdeki epipolar çizgi üzerinde kaydırılarak, bu pencereye en çok benzeyen bölge aranır. Benzerlik, SSD (Sum of Squared Differences) veya Normalize Edilmiş Çapraz Korelasyon (NCC) gibi metriklerle ölçülür.

Ancak bu problem zordur, çünkü:
*   **Dokusuz Alanlar:** Beyaz bir duvar gibi tekdüze bölgelerde, tüm pencereler birbirine benzeyeceği için doğru eşleşmeyi bulmak zordur.
*   **Tıkanma (Occlusion):** Bir gözün gördüğü bir nokta, diğeri tarafından görülemeyebilir.
*   **Tekrarlayan Desenler:** Bir çit veya tuğla duvar gibi tekrarlayan dokular, birden fazla olası eşleşmeye yol açabilir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Stereo vision sisteminde, bir nesne kameralara ne kadar yakınsa, disparitesi (disparity) o kadar ... olur.</p>
  <div class="quiz-option" data-correct="true">A) büyük</div>
  <div class="quiz-option">B) küçük</div>
  <div class="quiz-option">C) negatif</div>
  <div class="quiz-option">D) değişmez</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Disparite, bir noktanın iki görüntü arasındaki konum farkıdır. Nesneler yaklaştıkça, bu konum farkı artar. Derinlik ile disparite arasında ters orantı vardır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Epipolar kısıtlamanın (epipolar constraint) stereo eşleştirme problemine sağladığı en büyük avantaj nedir?</p>
  <div class="quiz-option">A) Görüntülerdeki gürültüyü azaltmak.</div>
  <div class="quiz-option">B) Kameranın içsel parametrelerini bulmak.</div>
  <div class="quiz-option" data-correct="true">C) Bir pikselin karşılığını arama problemini 2D bir alandan 1D bir çizgiye indirgemek.</div>
  <div class="quiz-option">D) Görüntülerin parlaklığını eşitlemek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> İki kameranın geometrisi sayesinde, sol görüntüdeki bir noktanın sağ görüntüdeki karşılığı, tüm görüntüde değil, "epipolar çizgi" adı verilen belirli bir çizgi üzerinde olmak zorundadır. Bu, arama uzayını dramatik bir şekilde küçültür.</p>
  </div>
</div>

