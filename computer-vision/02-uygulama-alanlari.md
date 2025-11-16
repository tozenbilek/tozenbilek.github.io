---
layout: default
title: Uygulama Alanları
nav_order: 2
parent: Computer Vision
---

# Computer Vision Uygulama Alanları

Computer Vision, teorik bir alan olmaktan çıkıp hayatımızın her köşesine dokunan, görsel veriden değer üreten pratik uygulamalara dönüşmüştür. İşte günümüzdeki en heyecan verici ve yaygın kullanım alanlarından bazıları:

---

## 1. Optical Character Recognition (OCR) ve Desen Tanıma

Taranmış dokümanlardaki, fotoğraflardaki veya trafik kameralarındaki metinlerin otomatik olarak okunarak dijital metne dönüştürülmesidir. Bu kategori, QR kodları veya barkodlar gibi yapısal desenlerin tanınmasını da içerir.

*   **Örnekler:** Plaka tanıma sistemleri, taranmış kitapların dijitalleştirilmesi, fatura okuma, QR kod ile menü açma.

<div class="quiz-question">
  <p><b>Soru:</b> Bir market kasasında, kasadan geçmeyen ama alışveriş sepetinin altında unutulan ürünleri tespit edip kasiyeri uyaran bir sistem, hangi Computer Vision görevini yerine getirir?</p>
  <div class="quiz-option">A) Yüz Tanıma</div>
  <div class="quiz-option" data-correct="true">B) Nesne Tanıma (Object Recognition)</div>
  <div class="quiz-option">C) 3D Modelleme</div>
  <div class="quiz-option">D) Medikal Görüntüleme</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bu sistem, kamera görüntüsünden belirli nesneleri (ürünleri) tanıyarak çalışır. Bu, perakende sektöründe kayıpları önlemek için kullanılan gerçek bir Computer Vision uygulamasıdır.</p>
  </div>
</div>

---

## 2. Yüz Tespiti ve Tanıma (Face Detection and Recognition)

Dijital kameraların en yaygın özelliklerinden biri haline gelmiştir. Sadece yüzün yerini bulmakla (detection) kalmaz, aynı zamanda kimlik tanıma (recognition), gülümseme veya göz kırpma gibi ifadelerin analizi için de kullanılır.

*   **Örnekler:** Telefon kilitlerini açma, sosyal medya fotoğraflarında kişileri otomatik etiketleme, güvenlik sistemleri.

<div class="quiz-question">
  <p><b>Soru:</b> Telefonunuzun, yüzünüze baktığınızda kilidi açması hangi iki Computer Vision görevini temel olarak birleştirir?</p>
  <div class="quiz-option">A) OCR ve Şerit Takibi</div>
  <div class="quiz-option" data-correct="true">B) Yüz Tespiti (Face Detection) ve Yüz Tanıma (Face Recognition)</div>
  <div class="quiz-option">C) 3D Modelleme ve Gözetleme</div>
  <div class="quiz-option">D) Medikal Görüntüleme ve Artırılmış Gerçeklik</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Sistem önce görüntüde bir yüz olduğunu tespit eder (detection), sonra da bu yüzün kayıtlı kullanıcıya ait olup olmadığını doğrular (recognition).</p>
  </div>
</div>

---

## 3. Akıllı Araçlar ve Otonom Sürüş

Modern otomobiller, şerit takibi, yaya tespiti, trafik işareti tanıma ve çarpışma önleme gibi görevler için kameraları aktif olarak kullanır. Otonom araçların "görme" yeteneğinin temelini bu teknolojiler oluşturur.

<div class="quiz-question">
  <p><b>Soru:</b> Otonom bir aracın, bir "DUR" tabelasını algılayıp ona göre yavaşlaması hangi Computer Vision görevini içerir?</p>
  <div class="quiz-option">A) Yüz Tanıma</div>
  <div class="quiz-option">B) Hareket Yakalama (Motion Capture)</div>
  <div class="quiz-option" data-correct="true">C) Nesne Tespiti ve Sınıflandırma (Object Detection and Classification)</div>
  <div class="quiz-option">D) OCR</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Araç, kamera görüntüsündeki belirli bir nesneyi (tabelayı) tespit eder ve onu "DUR tabelası" olarak sınıflandırarak anlamını yorumlar.</p>
  </div>
</div>

---

## 4. Özel Efektler, Artırılmış Gerçeklik ve Oyun

Gerçek dünya görüntüsünün üzerine bilgisayar tarafından üretilen sanal nesnelerin bindirilmesi (Augmented Reality), sinema sektöründeki özel efektler ve interaktif oyunlar bu alana girer.

*   **Örnekler:** Snapchat/Instagram filtreleri, Pokémon GO, filmlerdeki CGI karakterler için hareket yakalama (motion capture), Nintendo Wii gibi oyun konsollarındaki hareket algılama.

<div class="quiz-question">
  <p><b>Soru:</b> Amerikan futbolu yayınlarında, oyun sahasına dijital olarak çizilen ve oyuncuların geçmesi gereken "first down" çizgisi, hangi teknolojinin bir uygulamasıdır?</p>
  <div class="quiz-option">A) Medikal Görüntüleme</div>
  <div class="quiz-option" data-correct="true">B) Artırılmış Gerçeklik (Augmented Reality)</div>
  <div class="quiz-option">C) Otonom Sürüş</div>
  <div class="quiz-option">D) Güvenlik ve Gözetleme</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bu teknoloji, canlı video görüntüsünün (gerçek dünya) üzerine bilgisayar tarafından üretilen bir grafiği (sarı çizgi) gerçek zamanlı olarak bindirir. Bu, artırılmış gerçekliğin tanımıdır.</p>
  </div>
</div>

---

## 5. Medikal Görüntüleme

MR, CT, röntgen gibi tıbbi görüntülerden hastalıkların (örn: tümör, anomali) otomatik olarak tespit edilmesi, doktorlara teşhis koyma sürecinde yardımcı olur ve cerrahi operasyonlara rehberlik eder.

<div class="quiz-question">
  <p><b>Soru:</b> Bir radyoloğun, bir MR görüntüsündeki potansiyel tümörleri daha kolay fark etmesi için şüpheli bölgeleri otomatik olarak işaretleyen bir yazılım, hangi alana girer?</p>
  <div class="quiz-option" data-correct="true">C) Medikal Görüntü Analizi</div>
  <div class="quiz-option">A) Artırılmış Gerçeklik</div>
  <div class="quiz-option">B) Otonom Sürüş</div>
  <div class="quiz-option">D) OCR</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu, tıbbi bir görüntüden (MR) yola çıkarak anlamsal bir çıktı (şüpheli bölgeler) üreten, teşhise yardımcı bir Computer Vision uygulamasıdır.</p>
  </div>
</div>

---

## 6. Güvenlik ve Gözetleme

Kalabalık alanlarda terk edilmiş nesneleri, şüpheli hareketleri veya belirli kişileri otomatik olarak tespit eden akıllı gözetleme sistemleridir.

<div class="quiz-question">
  <p><b>Soru:</b> Bir havalimanı kamerasının, 30 dakikadan uzun süredir sahibi olmadan duran bir çantayı tespit edip alarm vermesi hangi Computer Vision tekniğiyle ilgilidir?</p>
  <div class="quiz-option">A) Yüz Tanıma</div>
  <div class="quiz-option" data-correct="true">B) Anomali Tespiti (Anomaly Detection)</div>
  <div class="quiz-option">C) Artırılmış Gerçeklik</div>
  <div class="quiz-option">D) Medikal Görüntüleme</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bu sistem, "normal" davranışın (insanların eşyalarıyla birlikte hareket etmesi) dışına çıkan "anormal" bir durumu (sahipsiz nesne) tespit etmek üzere tasarlanmıştır.</p>
  </div>
</div>

---

## 7. 3D Modelleme

Birden çok görüntüden veya videodan yola çıkarak gerçek dünyadaki nesnelerin veya mekanların üç boyutlu dijital modellerini oluşturmaktır.

*   **Örnekler:** Google Earth ve Microsoft Virtual Earth'teki gibi şehirlerin 3D modelleri, tarihi eserlerin dijital olarak arşivlenmesi.

<div class="quiz-question">
  <p><b>Soru:</b> Bir şehrin sokaklarında dolaşan bir aracın çektiği binlerce 2D fotoğrafı kullanarak o şehrin üç boyutlu bir haritasını oluşturan Google Earth gibi bir servis, temel olarak hangi Computer Vision tekniğini kullanır?</p>
  <div class="quiz-option">A) OCR</div>
  <div class="quiz-option">B) Yüz Tanıma</div>
  <div class="quiz-option" data-correct="true">C) 3D Modelleme (3D Reconstruction)</div>
  <div class="quiz-option">D) Anomali Tespiti</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu süreç, "Structure from Motion" gibi teknikler kullanarak iki boyutlu görüntülerdeki derinlik ve yapı bilgisini çıkarıp bunları birleştirerek üç boyutlu bir model oluşturma işlemidir.</p>
  </div>
</div>

---

