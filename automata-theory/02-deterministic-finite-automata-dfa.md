---
layout: default
title: Deterministic Finite Automata (DFA)
nav_order: 2
parent: Automata Theory
---

# Deterministic Finite Automata (DFA)

Önceki bölümde, otomatlar teorisinin temel kavramlarını öğrendik. Şimdi, en basit otomat türü olan **Deterministic Finite Automaton (Belirleyici Sonlu Otomat)**, kısaca **DFA**'yı detaylı olarak inceleyeceğiz.

DFA'lar, hafızası sonlu sayıda "durumdan" ibaret olan ve okuduğu her sembol için o anki durumundan tam olarak bir sonraki duruma geçen basit makinelerdir. "Belirleyici" (deterministic) olmaları, her durum ve her giriş sembolü için geçilecek bir ve yalnızca bir sonraki durumun olmasından kaynaklanır.

---

## 1. DFA'nın Formel Tanımı

Bir DFA, matematiksel olarak 5 elemanlı bir demet (5-tuple) ile ifade edilir: `A = (Q, Σ, δ, q₀, F)`

1.  **Q:** Sonlu bir **durumlar (states)** kümesi. (Örn: `{q₀, q₁, q₂}`)
2.  **Σ:** Bir **alfabe (alphabet)**. (Örn: `{0, 1}`)
3.  **δ (delta):** Geçiş fonksiyonu (**transition function**). Bu fonksiyon, mevcut durumu ve okunan sembolü girdi olarak alıp bir sonraki durumu çıktı olarak verir. `δ: Q × Σ → Q`.
4.  **q₀:** Başlangıç durumu (**start state**). `q₀ ∈ Q` olmalıdır.
5.  **F:** Kabul durumları (**accepting states** veya final states) kümesi. `F ⊆ Q` olmalıdır.

---

## 2. DFA'nın Grafik Gösterimi: Durum Diyagramları

DFA'ları kağıt üzerinde görselleştirmek için **durum diyagramları (state diagrams)** kullanılır:
*   **Durumlar (Q):** Daireler (node'lar) ile gösterilir.
*   **Başlangıç Durumu (q₀):** Hiçbir yerden gelmeyen bir ok ile işaretlenir.
*   **Kabul Durumları (F):** Çift daire ile gösterilir.
*   **Geçişler (δ):** Bir durumdan diğerine yönelen ve okunan sembolle etiketlenmiş oklar (arc'lar) ile gösterilir. Örneğin, `δ(q₁, 0) = q₂` geçişi, `q₁` durumundan `q₂` durumuna üzerinde `0` yazan bir ok ile çizilir.

![DFA State Diagram](https://via.placeholder.com/500x300.png?text=DFA+Durum+Diyagramı+Örneği)
*Görsel: Çift sayıda '1' içeren ikili dizgileri kabul eden bir DFA'nın durum diyagramı.*

---

## 3. DFA Bir Dizgiyi Nasıl İşler?

Bir DFA, bir girdi dizgisini (`w`) başından sonuna kadar sembol sembol okur.
1.  İşlem, **başlangıç durumu `q₀`**'da başlar.
2.  Dizginin ilk sembolü okunur ve geçiş fonksiyonu `δ` kullanılarak bir sonraki duruma geçilir.
3.  Bu işlem, dizginin tüm sembolleri okunana kadar devam eder.
4.  Dizginin son sembolü okunduktan sonra, makinenin bulunduğu durum bir **kabul durumu (F'nin bir elemanı)** ise, DFA o dizgiyi **kabul eder (accepts)**.
5.  Eğer son durum bir kabul durumu değilse, dizgi **reddedilir (rejects)**.

### Genişletilmiş Geçiş Fonksiyonu (δ̂)
Bir sembol yerine bütün bir dizgi için geçişi tanımlayan fonksiyona `δ̂` (delta-hat) denir. `δ̂(q, w)`, `q` durumundan başlayarak `w` dizgisini okuduktan sonra gelinecek durumu verir.

---

## 4. Bir DFA'nın Dili

Bir `A` DFA'sının tanıdığı dil, `L(A)` ile gösterilir ve o DFA tarafından kabul edilen **tüm dizgilerin kümesidir**.

`L(A) = { w | δ̂(q₀, w) ∈ F }`

Yani, başlangıç durumundan başlayıp `w` dizgisini okuduktan sonra bir kabul durumuna ulaştığımız tüm `w` dizgileri, o DFA'nın dilini oluşturur. DFA'lar tarafından tanınabilen dillere **Regular Languages (Düzenli Diller)** denir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir DFA'nın "deterministik" (belirleyici) olarak adlandırılmasının ana sebebi nedir?</p>
  <div class="quiz-option">A) Sonlu sayıda durumu olması.</div>
  <div class="quiz-option" data-correct="true">B) Her durum ve her alfabe sembolü için geçiş fonksiyonunun tam olarak bir sonraki durumu tanımlaması.</div>
  <div class="quiz-option">C) Bir başlangıç durumuna sahip olması.</div>
  <div class="quiz-option">D) Boş dizgi (`ε`) ile geçiş yapamaması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Determinizm, belirsizliğin olmaması anlamına gelir. Bir DFA, belirli bir durumda belirli bir sembolü okuduğunda, gidebileceği tek bir yer vardır. Bu, geçiş fonksiyonu `δ: Q × Σ → Q` ile garanti edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir DFA'nın durum diyagramında, bir durumun "kabul durumu" (accepting state) olduğunu nasıl anlarız?</p>
  <div class="quiz-option">A) "Final" kelimesiyle etiketlenmiştir.</div>
  <div class="quiz-option">B) Gelen bir ok ile işaretlenmiştir.</div>
  <div class="quiz-option" data-correct="true">C) Çift daire ile çizilmiştir.</div>
  <div class="quiz-option">D) En sağdaki durumdur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Standart gösterimde, kabul durumları iç içe geçmiş iki daire (çift daire) ile belirtilirken, diğer durumlar tek bir daire ile gösterilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir `A` DFA'sı, bir `w` dizgisini ne zaman "kabul eder"?</p>
  <div class="quiz-option">A) `w` dizgisindeki tüm semboller DFA'nın alfabesine aitse.</div>
  <div class="quiz-option">B) `w` dizgisini işlerken en az bir kez kabul durumundan geçerse.</div>
  <div class="quiz-option">C) `w` dizgisi boş dizgi (`ε`) ise.</div>
  <div class="quiz-option" data-correct="true">D) `w` dizgisinin tamamı okunduktan sonra makinenin bulunduğu son durum, kabul durumları kümesinin bir elemanı ise.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Bir dizginin kabul edilmesi için tek kriter, tüm dizgi işlendikten sonra ulaşılan nihai durumun, önceden tanımlanmış kabul durumları (`F`) kümesinde yer almasıdır.</p>
  </div>
</div>
