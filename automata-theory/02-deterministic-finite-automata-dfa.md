---
layout: default
title: Deterministic Finite Automata (DFA)
nav_order: 2
parent: Automata Theory
---

# Deterministic Finite Automata (DFA)

Önceki bölümde, otomatlar teorisinin temel kavramlarını öğrendik. Şimdi, en basit otomat türü olan **Deterministic Finite Automaton (Belirleyici Sonlu Otomat)**, kısaca **DFA**'yı detaylı olarak inceleyeceğiz.

DFA'lar, hafızası sonlu sayıda state'ten ibaret olan ve okuduğu her symbol için o anki state'inden tam olarak bir sonraki state'e geçen basit makinelerdir. "Belirleyici" (deterministic) olmaları, her state ve her giriş symbol'ü için geçilecek bir ve yalnızca bir sonraki state'in olmasından kaynaklanır.

---

## 1. DFA'nın Formel Tanımı

Bir DFA, matematiksel olarak 5 elemanlı bir demet (5-tuple) ile ifade edilir: `A = (Q, Σ, δ, q₀, F)`

1.  **Q:** Sonlu bir **States (durumlar)** kümesi. (Örn: `{q₀, q₁, q₂}`)
2.  **Σ:** Bir **Alphabet (alfabe)**. (Örn: `{0, 1}`)
3.  **δ (delta):** **Transition Function (geçiş fonksiyonu)**. Bu fonksiyon, mevcut state'i ve okunan symbol'ü girdi olarak alıp bir sonraki state'i çıktı olarak verir. `δ: Q × Σ → Q`.
4.  **q₀:** **Start State (başlangıç durumu)**. `q₀ ∈ Q` olmalıdır.
5.  **F:** **Accepting States (kabul durumları)** veya final states kümesi. `F ⊆ Q` olmalıdır.

---

## 2. DFA'nın Grafik Gösterimi: `State Diagrams` (Durum Diyagramları)

DFA'ları kağıt üzerinde görselleştirmek için **State Diagrams (durum diyagramları)** kullanılır:
*   **States (Q):** Daireler (node'lar) ile gösterilir.
*   **Start State (q₀):** Hiçbir yerden gelmeyen bir ok ile işaretlenir.
*   **Accepting States (F):** Çift daire ile gösterilir.
*   **Transitions (δ):** Bir state'ten diğerine yönelen ve okunan symbol ile etiketlenmiş oklar (arc'lar) ile gösterilir. Örneğin, `δ(q₁, 0) = q₂` transition'ı, `q₁` state'inden `q₂` state'ine üzerinde `0` yazan bir ok ile çizilir.

<div align="center">

*Görsel: Çift sayıda '1' içeren ikili string'leri (`ε`, `00`, `11`, `0110`, `101`, vs.) kabul eden bir DFA.*
```mermaid
graph LR
    direction LR
    
    %% q_even hem başlangıç hem de kabul durumudur.
    
    [*] --> q_even
    q_even((q_even))
    
    style q_even fill:#d4edda,stroke:#c3e6cb

    q_even -- "0" --> q_even
    q_even -- "1" --> q_odd
    q_odd -- "0" --> q_odd
    q_odd -- "1" --> q_even
```

</div>

---

## 3. Bir DFA, Bir `String`'i Nasıl İşler?

Bir DFA, bir girdi string'ini (`w`) başından sonuna kadar symbol symbol okur.
1.  İşlem, **başlangıç state'i `q₀`**'da başlar.
2.  String'in ilk symbol'ü okunur ve transition function `δ` kullanılarak bir sonraki state'e geçilir.
3.  Bu işlem, string'in tüm symbol'leri okunana kadar devam eder.
4.  String'in son symbol'ü okunduktan sonra, makinenin bulunduğu state bir **kabul state'i (F'nin bir elemanı)** ise, DFA o string'i **kabul eder (accepts)**.
5.  Eğer son state bir kabul state'i değilse, string **reddedilir (rejects)**.

### Extended Transition Function (δ̂)
Bir symbol yerine bütün bir string için transition'ı tanımlayan fonksiyona `δ̂` (delta-hat) denir. `δ̂(q, w)`, `q` state'inden başlayarak `w` string'ini okuduktan sonra gelinecek state'i verir.

---

## 4. Bir DFA'nın Language'ı

Bir `A` DFA'sının tanıdığı language, `L(A)` ile gösterilir ve o DFA tarafından kabul edilen **tüm string'lerin kümesidir**.

`L(A) = { w | δ̂(q₀, w) ∈ F }`

Yani, başlangıç state'inden başlayıp `w` string'ini okuduktan sonra bir kabul state'ine ulaştığımız tüm `w` string'leri, o DFA'nın language'ını oluşturur. DFA'lar tarafından tanınabilen language'lara **Regular Languages (Düzenli Diller)** denir.

---

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir DFA'nın "deterministik" (belirleyici) olarak adlandırılmasının ana sebebi nedir?</p>
  <div class="quiz-option">A) Sonlu sayıda state'i olması.</div>
  <div class="quiz-option" data-correct="true">B) Her state ve her alfabe symbol'ü için transition function'ının tam olarak bir sonraki state'i tanımlaması.</div>
  <div class="quiz-option">C) Bir başlangıç state'ine sahip olması.</div>
  <div class="quiz-option">D) Boş string (`ε`) ile transition yapamaması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Determinizm, belirsizliğin olmaması anlamına gelir. Bir DFA, belirli bir state'te belirli bir symbol'ü okuduğunda, gidebileceği tek bir yer vardır. Bu, transition function `δ: Q × Σ → Q` ile garanti edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir DFA'nın durum diyagramında, bir state'in "kabul state'i" (accepting state) olduğunu nasıl anlarız?</p>
  <div class="quiz-option">A) "Final" kelimesiyle etiketlenmiştir.</div>
  <div class="quiz-option">B) Gelen bir ok ile işaretlenmiştir.</div>
  <div class="quiz-option" data-correct="true">C) Çift daire ile çizilmiştir.</div>
  <div class="quiz-option">D) En sağdaki state'tir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Standart gösterimde, kabul state'leri iç içe geçmiş iki daire (çift daire) ile belirtilirken, diğer state'ler tek bir daire ile gösterilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir `A` DFA'sı, bir `w` string'ini ne zaman "kabul eder"?</p>
  <div class="quiz-option">A) `w` string'indeki tüm symbol'ler DFA'nın alfabesine aitse.</div>
  <div class="quiz-option">B) `w` string'ini işlerken en az bir kez kabul state'inden geçerse.</div>
  <div class="quiz-option">C) `w` string'i boş string (`ε`) ise.</div>
  <div class="quiz-option" data-correct="true">D) `w` string'inin tamamı okunduktan sonra makinenin bulunduğu son state, kabul state'leri kümesinin bir elemanı ise.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Bir string'in kabul edilmesi için tek kriter, tüm string işlendikten sonra ulaşılan nihai state'in, önceden tanımlanmış kabul state'leri (`F`) kümesinde yer almasıdır.</p>
  </div>
</div>
