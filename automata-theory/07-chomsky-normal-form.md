---
layout: default
title: Chomsky Normal Form (CNF)
nav_order: 7
parent: Automata Theory
---

# Chomsky Normal Form (CNF)

Önceki bölümde `Context-Free Grammars` (CFG)'nin ne kadar güçlü olduğunu gördük. Ancak, kuralları `A → wBxyZ` gibi çok çeşitli ve karmaşık formlarda olabilir. Bu durum, gramerleri analiz eden ve onlarla çalışan algoritmaları (örneğin, bir dizginin dile ait olup olmadığını kontrol eden `CYK` algoritması) yazmayı zorlaştırır.

**Chomsky Normal Form (CNF)**, herhangi bir CFG'yi, kurallarını çok basit ve standart iki formattan birine indirgeyerek basitleştiren bir yöntemdir. Bu standardizasyon, birçok teorik ispatı ve pratik uygulamayı kolaylaştırır.

---

## 1. CNF'nin Tanımı

Bir `Context-Free Grammar` (CFG), **ε (boş dizgi) üretmiyorsa** ve sahip olduğu tüm kurallar (productions) aşağıdaki iki formattan **yalnızca birine** uyuyorsa, **Chomsky Normal Form**'dadır denir:

1.  `A → BC`
    *   Bir değişken, tam olarak **iki** başka değişkene dönüşür.

2.  `A → a`
    *   Bir değişken, tam olarak **bir** terminal sembole dönüşür.

Burada `A`, `B`, `C` birer değişkendir ve `a` bir terminaldir. Başlangıç sembolünün `S → ε` şeklinde bir kurala sahip olmasına istisnai olarak izin verilebilir, ancak bu durumda `S` başka hiçbir kuralın sağ tarafında yer alamaz.

---

## 2. Neden Önemlidir?

CNF'nin getirdiği bu basit yapı, birçok avantaj sağlar:
*   **Algoritmik Kolaylık:** Belirli bir dizginin bir dil tarafından üretilip üretilemeyeceğini belirleyen `CYK (Cocke-Younger-Kasami)` gibi dinamik programlama tabanlı ayrıştırma (parsing) algoritmaları, gramerin CNF'de olmasını gerektirir.
*   **Teorik İspatlar:** Birçok teorem ve ispat, gramerin bu standart formda olduğu varsayılarak daha kolay yapılır.
*   **Ayrıştırma Ağacı (Parse Tree) Yapısı:** CNF'deki bir gramer için herhangi bir türetmenin ayrıştırma ağacı her zaman bir **ikili ağaç (binary tree)** yapısındadır. Bu, ağacın derinliği ve dizginin uzunluğu arasında bir ilişki kurmayı kolaylaştırır.

---

## 3. CFG'yi CNF'ye Dönüştürme

Herhangi bir CFG (ε üretmeyen), bir dizi adım takip edilerek eşdeğer bir CNF'ye dönüştürülebilir. Bu adımlar, gramerin kurallarını aşamalı olarak basitleştirir:

1.  **Yeni Bir Başlangıç Sembolü Oluşturma:** Orijinal başlangıç sembolünün başka kuralların sağ tarafında görünmesini engellemek için yeni bir başlangıç sembolü `S₀` ve `S₀ → S` kuralı eklenir.
2.  **Birim Kuralları Eleme (Eliminate Unit Productions):** `A → B` gibi bir değişkenin tek bir değişkene dönüştüğü kurallar kaldırılır.
3.  **Yararsız Sembolleri Eleme (Eliminate Useless Symbols):** Hiçbir terminal dizgisi üretemeyen veya başlangıç sembolünden ulaşılamayan değişkenler ve ilgili kurallar kaldırılır.
4.  **Kuralları CNF Formatına Getirme:**
    *   Kuralların sağ tarafındaki terminaller, yeni değişkenlerle değiştirilir. Örneğin, `A → aB` kuralı, `A → X B` ve `X → a` şeklinde iki kurala ayrılır.
    *   İkiden fazla değişken içeren kurallar, zincirleme şekilde ikili kurallara bölünür. Örneğin, `A → BCD` kuralı, `A → BZ` ve `Z → CD` şeklinde iki kurala ayrılır.

Bu adımların sonunda, orijinal gramerle aynı dili tanıyan ancak tüm kuralları CNF formatında olan yeni bir gramer elde edilir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Aşağıdaki kurallardan hangisi Chomsky Normal Form (CNF) <b>formatına uygun değildir</b>?</p>
  <div class="quiz-option">A) `S → AB`</div>
  <div class="quiz-option">B) `A → a`</div>
  <div class="quiz-option" data-correct="true">C) `B → aC`</div>
  <div class="quiz-option">D) `C → DE`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> CNF kuralları ya bir değişkenin iki değişkene (`A → BC`) ya da bir değişkenin bir terminale (`A → a`) dönüşmesi şeklindedir. `B → aC` kuralı, bir terminal ve bir değişkeni bir arada içerdiği için bu formata uymaz.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Chomsky Normal Form'un en önemli pratik faydalarından biri nedir?</p>
  <div class="quiz-option">A) Gramerin daha az kurala sahip olmasını sağlamak.</div>
  <div class="quiz-option" data-correct="true">B) CYK gibi bazı standart ayrıştırma (parsing) algoritmalarının çalışabilmesi için bir ön koşul olması.</div>
  <div class="quiz-option">C) Gramerin belirsiz (ambiguous) olmasını engellemek.</div>
  <div class="quiz-option">D) Sadece düzenli dilleri (regular languages) tanımlayabilen gramerler oluşturmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> CNF, gramer kurallarını standartlaştırarak algoritmaların işini kolaylaştırır. Özellikle, bir dizginin bir CFG tarafından üretilip üretilemeyeceğini verimli bir şekilde test eden CYK algoritması, gramerin CNF'de olmasını gerektirir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> CNF'ye dönüştürülmüş bir gramer tarafından üretilen bir dizginin ayrıştırma ağacı (parse tree) her zaman hangi özelliğe sahiptir?</p>
  <div class="quiz-option">A) Derinliği en fazla 2'dir.</div>
  <div class="quiz-option">B) Tüm yaprakları değişkendir (variables).</div>
  <div class="quiz-option" data-correct="true">C) Her iç düğümün tam olarak iki çocuğu vardır (ikili ağaç yapısındadır).</div>
  <div class="quiz-option">D) Sadece bir tane yaprağı olabilir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> CNF'deki `A → BC` kuralı, bir düğümün tam olarak iki değişken çocuğa dallanmasını sağlar. `A → a` kuralı ise bir yaprak (terminal) oluşturur. Bu nedenle, ortaya çıkan ağacın tüm iç düğümleri (yapraklar hariç) tam olarak iki çocuğa sahip olur, bu da bir ikili ağaç (binary tree) tanımıdır.</p>
  </div>
</div>
