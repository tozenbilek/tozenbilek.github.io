---
layout: default
title: Nondeterministic Finite Automata (NFA)
nav_order: 3
parent: Automata Theory
---

# Nondeterministic Finite Automata (NFA)

DFA'lar, her durum ve her sembol için tek bir sonraki adıma sahip olmalarıyla "belirleyici" (deterministic) idi. Şimdi ise daha esnek ve güçlü bir model olan **Nondeterministic Finite Automaton (Belirleyici Olmayan Sonlu Otomat)**, yani **NFA**'yı inceleyeceğiz.

"Belirleyici olmama" (nondeterminism), bir NFA'nın belirli bir durumda belirli bir sembolü okuduğunda, birden fazla olası sonraki duruma gidebilmesi veya hiçbir yere gitmemesi anlamına gelir. Hatta, hiçbir sembol okumadan da durum değiştirebilirler!

---

## 1. NFA'nın DFA'dan Farkları

Bir NFA, üç temel yeteneğiyle DFA'dan ayrılır:

1.  **Çoklu Geçiş (Multiple Transitions):** Bir durumdan, aynı giriş sembolü için birden fazla farklı duruma geçiş olabilir.
2.  **Eksik Geçiş (Missing Transitions):** Bir durumda, belirli bir sembol için tanımlanmış hiçbir geçiş olmayabilir. Bu yola giren dizgi "sıkışır" ve reddedilir.
3.  **Epsilon Geçişleri (ε-Transitions):** Bir NFA, hiçbir giriş sembolü okumadan (`ε` ile) durum değiştirebilir. Bu, bir durumdan diğerine "bedava" geçiş yapabilmesini sağlar.

Bu esneklik, belirli dilleri DFA'lara göre çok daha basit ve daha az durumla ifade etmeyi mümkün kılar.

---

## 2. NFA'nın Formel Tanımı

Bir NFA da DFA gibi 5'li bir demet ile tanımlanır: `A = (Q, Σ, δ, q₀, F)`. Ancak tek ve en önemli fark **geçiş fonksiyonu `δ`**'nın tanımındadır.

*   **DFA'da:** `δ: Q × Σ → Q` (Bir durum ve bir sembol, tek bir sonraki durumu verir)
*   **NFA'da:** `δ: Q × (Σ ∪ {ε}) → P(Q)` (Bir durum ve bir sembol (veya ε), bir **durumlar kümesini** verir)

Buradaki `P(Q)`, `Q` kümesinin **kuvvet kümesidir (Power Set)**, yani `Q`'nun tüm olası alt kümelerinin kümesidir. Bu tanım, bir geçişin sonucunun tek bir durum değil, bir durumlar kümesi (hiç durum içermeyen boş küme dahil) olabileceğini gösterir.

---

## 3. NFA Bir Dizgiyi Nasıl Kabul Eder?

DFA'da bir dizgiyi işlerken takip edilecek tek bir yol vardı. NFA'da ise, çoklu geçişler ve ε-geçişleri nedeniyle bir dizgi için birden fazla olası "hesaplama yolu" olabilir.

Bir NFA, bir `w` dizgisini şu koşulda **kabul eder**:
> `w` dizgisinin tamamı okunduktan sonra, mümkün olan tüm yollardan **en az bir tanesi** bir kabul durumunda (`F`'nin bir elemanı) sonlanıyorsa.

Makine, sanki tüm olası yolları aynı anda keşfediyormuş gibi düşünülebilir. Eğer bu yollardan herhangi biri başarıya (kabul durumuna) ulaşırsa, dizgi kabul edilir. Hepsi başarısız olursa (red durumlarında sonlanırsa veya yolda sıkışırsa), dizgi reddedilir.

### ε-Closure Kavramı
`ECLOSE(q)` (epsilon-closure), bir `q` durumundan başlayarak sadece ε-geçişleri kullanılarak ulaşılabilecek tüm durumların kümesidir (q'nun kendisi dahil). Bu kavram, NFA'nın bir sembolü okuduktan sonra gidebileceği tüm "bedava" yolları hesaplamak için kullanılır.

---

## 4. NFA'nın Gücü ve Eşdeğerlik

NFA'lar daha esnek ve genellikle daha sezgisel görünse de, hesaplama gücü olarak DFA'lardan daha güçlü **değildirler**. Bu, otomatlar teorisindeki en önemli sonuçlardan biridir:

> Bir dil, bir NFA tarafından tanınabiliyorsa, o zaman o dili tanıyan bir DFA da mutlaka vardır (ve tersi).

Her NFA, **Subset Construction (Alt Küme İnşası)** adı verilen bir algoritma ile eşdeğer bir DFA'ya dönüştürülebilir. Bu işlem, NFA'nın aynı anda bulunabileceği tüm durumların kombinasyonlarını, DFA için tek bir durum olarak ele alır. Ancak bu dönüşüm sonucunda durum sayısı katlanarak artabilir (en kötü durumda `n` durumlu bir NFA, `2ⁿ` durumlu bir DFA'ya dönüşebilir).

Bu nedenle, NFA ve DFA'lar aynı dil sınıfını tanır: **Regular Languages (Düzenli Diller)**.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Aşağıdakilerden hangisi bir NFA'nın yapabileceği ancak bir DFA'nın yapamayacağı bir eylemdir?</p>
  <div class="quiz-option">A) Bir başlangıç durumundan başlamak.</div>
  <div class="quiz-option">B) Bir dizgiyi okuduktan sonra kabul durumunda sonlanmak.</div>
  <div class="quiz-option" data-correct="true">C) Hiçbir sembol okumadan (`ε` ile) durum değiştirmek.</div>
  <div class="quiz-option">D) Alfabedeki bir sembolü okuyarak durum değiştirmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Epsilon (`ε`) geçişleri, NFA'ların belirleyici olmayan doğasının bir parçasıdır ve DFA'larda bulunmazlar. Bu, NFA'ların hiçbir girdi almadan durum değiştirmesine olanak tanır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir NFA, `w = 010` dizgisini işledikten sonra olası tüm yolların sonunda `{q₁, q₃, q₅}` durumlarında bulunuyor. DFA'nın kabul durumları kümesi `F = {q₄, q₅}` ise, dizgi kabul edilir mi?</p>
  <div class="quiz-option" data-correct="true">A) Evet, çünkü olası son durumlardan en az biri (`q₅`) kabul durumları kümesine aittir.</div>
  <div class="quiz-option">B) Hayır, çünkü tüm olası son durumlar (`q₁`, `q₃`, `q₅`) kabul durumları kümesine ait değildir.</div>
  <div class="quiz-option">C) Belirsizdir, çünkü NFA'lar deterministik değildir.</div>
  <div class="quiz-option">D) Hayır, çünkü `q₁` ve `q₃` kabul durumu değildir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Bir NFA'nın bir dizgiyi kabul etmesi için, olası hesaplama yollarından sadece bir tanesinin bile bir kabul durumunda bitmesi yeterlidir. `q₅` bir kabul durumu olduğu için dizgi kabul edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> NFA'ların hesaplama gücü DFA'lara kıyasla nasıldır?</p>
  <div class="quiz-option">A) NFA'lar DFA'lardan daha güçlüdür.</div>
  <div class="quiz-option">B) DFA'lar NFA'lardan daha güçlüdür.</div>
  <div class="quiz-option" data-correct="true">C) NFA'lar ve DFA'lar eşdeğer hesaplama gücüne sahiptir.</div>
  <div class="quiz-option">D) Bazı dilleri sadece NFA'lar tanıyabilir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Her NFA, eşdeğer bir DFA'ya dönüştürülebildiği için, iki model de aynı dil sınıfını, yani Düzenli Dilleri (Regular Languages) tanır. NFA'lar genellikle daha az durumla daha öz bir gösterim sunsa da, bu onların daha "güçlü" olduğu anlamına gelmez.</p>
  </div>
</div>
