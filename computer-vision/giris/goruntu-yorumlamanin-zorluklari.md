---
layout: default
title: Görüntü Yorumlamanın Zorlukları
nav_order: 2
parent: Computer Vision
---

# Görüntü Yorumlamanın Zorlukları

Görüntülerdeki bilgi yüzeysel olarak net görünse de, fiziksel dünya ile sensörün ölçtüğü veriler arasındaki kopukluk, Computer Vision sistemleri için bir dizi temel zorluk oluşturur. Bu zorluklar genel olarak üç ana kategoride incelenebilir: fiziksel, algısal ve hesaplamaya dayalı.

## Fiziksel Belirsizlikler

Görüntünün oluşum süreci, doğası gereği bilgi kaybına ve belirsizliklere yol açar.

-   **Aydınlatma:** Aynı nesne, farklı ışık koşulları (kaynağın açısı, gücü, renk sıcaklığı) altında tamamen farklı piksel dağılımları üretebilir.
-   **Malzeme ve Geometri:** Bir nesnenin yüzeyinin mat, parlak veya yarı saydam olması, sensörde tamamen farklı cevaplar üretir. Yüzeyin geometrisi de ışığın nasıl yansıdığını kökten değiştirir.
-   **Projeksiyon Kayıpları:** 3 boyutlu bir sahne 2 boyutlu bir düzleme yansıtılırken derinlik bilgisi kaybolur. Bu perspektif bozulmaları, nesnelerin gerçek boyutlarını ve aralarındaki mesafeyi güvenilmez kılar.

## Algısal Zorluklar

İnsan görsel sistemi, eksik bilgiyi bağlam ve önceki deneyimlerle tamamlama konusunda ustadır. Ancak bu durum, makineler için algısal tuzaklar yaratır.

-   **Görsel İllüzyonlar:** Adelson’un gölge illüzyonunda olduğu gibi, aslında aynı `intensity` değerine sahip olan iki farklı bölge, insan tarafından tamamen farklı algılanabilir. Bu, ham `pixel` verisine dayalı algoritmaların ne kadar yanıltıcı olabileceğini gösterir.
-   **Bağlamsal Anlam:** İnsanlar, bir sahnedeki nesneleri ve ilişkileri (örneğin, bir masanın üzerinde duran bir vazo) anında yorumlayabilir. Bilgisayarların bu tür bağlamsal ipuçlarını bir modele dahil etmesi karmaşık bir problemdir.
-   **Ayrım (`Segmentation`):** Bir nesnenin nerede başlayıp nerede bittiğini belirlemek (şekil-zemin ayrımı), özellikle karmaşık ve örtüşen nesnelerin olduğu sahnelerde oldukça zordur.

## Hesaplamaya Dayalı Zorluklar

Teorik olarak mükemmel çalışan bir model bile, pratik uygulamada ciddi engellerle karşılaşabilir.

-   **Veri Miktarı ve Boyutu:** Yüksek çözünürlüklü bir video akışını işlemek, muazzam miktarda hesaplama gücü ve bellek bant genişliği gerektirir. Otonom sürüş gibi uygulamalarda bu işlemin gerçek zamanlı yapılması zorunluluğu, algoritma tasarımını kısıtlar.
-   **Veri Etiketleme İhtiyacı:** Denetimli öğrenme (`supervised learning`) tabanlı modern yaklaşımlar, genellikle milyonlarca elle etiketlenmiş örneğe ihtiyaç duyar. Bu veri kümelerini oluşturmak son derece maliyetli ve zaman alıcıdır.
-   **Genelleme Problemi:** Bir model, eğitim gördüğü veri setinde ne kadar başarılı olursa olsun, daha önce hiç karşılaşmadığı koşullara (farklı aydınlatma, hava durumu, nesne tipleri vb.) sahip gerçek dünya verileriyle karşılaştığında başarısız olabilir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir nesnenin yüzeyi kırmızı olmasına rağmen, bir fotoğrafta mavi görünüyorsa, bunun en olası fiziksel sebebi nedir?</p>
  <div class="quiz-option">A) Kameranın lensinde `distortion` olması.</div>
  <div class="quiz-option" data-correct="true">B) Nesnenin üzerine mavi bir ışık düşmesi.</div>
  <div class="quiz-option">C) Görüntünün dijital olarak yanlış sıkıştırılması.</div>
  <div class="quiz-option">D) Kameranın sensörünün kırmızı rengi algılayamaması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Görüntüdeki renk sadece nesnenin yüzey özelliklerine değil, aynı zamanda üzerine düşen ışığın rengine ve açısına da bağlıdır. Kırmızı bir yüzey, üzerine düşen mavi ışığı yansıttığında mavi görünebilir. Bu, aydınlatma koşullarının yarattığı en temel belirsizliklerden biridir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Aşağıdakilerden hangisi, 3D bir dünyanın 2D bir görüntüye yansıtılması sırasında yaşanan temel bilgi kaybıdır?</p>
  <div class="quiz-option">A) Renk bilgisi</div>
  <div class="quiz-option" data-correct="true">B) Derinlik bilgisi</div>
  <div class="quiz-option">C) Doku (`texture`) bilgisi</div>
  <div class="quiz-option">D) Şekil bilgisi</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B) Derinlik bilgisi.</b> Projeksiyon işlemi, bir nesnenin kameraya olan uzaklığı bilgisini tek bir noktaya sıkıştırarak kaydeder. Diğer bilgiler (renk, doku, şekil) bozulsa da tamamen kaybolmaz.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> "Genelleme Problemi" (`Generalization Problem`) en iyi hangi senaryo ile açıklanır?</p>
  <div class="quiz-option">A) Bir algoritmanın yüksek çözünürlüklü videolarda yavaş çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Sadece gündüz çekilmiş fotoğraflarla eğitilmiş bir yaya tanıma sisteminin, gece çekilmiş bir fotoğraftaki yayayı tanıyamaması.</div>
  <div class="quiz-option">C) Milyonlarca kedi fotoğrafını etiketlemenin çok uzun sürmesi.</div>
  <div class="quiz-option">D) Bir optik illüzyonun, bir kenar tespit algoritmasını yanıltması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Genelleme problemi, bir modelin eğitim verisinin (gündüz fotoğrafları) dağılımı dışındaki test verilerinde (gece fotoğrafları) başarısız olmasıdır.</p>
  </div>
</div>

