---
layout: default
title: Context-Free Grammars (CFG)
nav_order: 6
parent: Automata Theory
---

# Context-Free Grammars (Bağlamdan Bağımsız Dilbilgisi)

Önceki bölümlerde, `Regular Languages` (Düzenli Diller) sınıfını ve bunları tanıyan `Finite Automata` (Sonlu Otomatlar)'yı inceledik. Ancak, programlama dillerindeki iç içe geçmiş yapılar (parantezler, `if-else` blokları) veya `L = {0ⁿ1ⁿ}` gibi diller, sonlu otomatların sınırlı hafızası tarafından tanınamaz.

Bu daha karmaşık dilleri tanımlamak için daha güçlü bir araca ihtiyacımız var: **Context-Free Grammars (Bağlamdan Bağımsız Dilbilgisi)**, kısaca **CFG**. CFG'ler, bir dilin sözdizimsel (syntactic) yapısını ve kurallarını tanımlamak için kullanılır ve `Context-Free Languages` (CFL) olarak bilinen daha geniş bir dil sınıfını oluştururlar.

---

## 1. CFG'nin Formel Tanımı

Bir CFG, matematiksel olarak 4 elemanlı bir demet (4-tuple) ile ifade edilir: `G = (V, T, P, S)`

1.  **V:** **Değişkenler (Variables)** veya *non-terminals* olarak adlandırılan sonlu bir küme. Genellikle büyük harflerle gösterilirler (Örn: `E`, `T`, `F`). Bunlar, dilin daha küçük parçalarını temsil eden ara sembollerdir.
2.  **T:** **Terminaller (Terminals)** olarak adlandırılan, alfabeyi oluşturan sembollerin sonlu bir kümesi. Genellikle küçük harfler, sayılar veya sembollerle gösterilirler (Örn: `a`, `b`, `0`, `1`, `+`, `*`). Bunlar, dildeki nihai dizgileri oluşturan temel yapı taşlarıdır.
3.  **P:** **Kurallar (Productions)** veya *rules* olarak adlandırılan sonlu bir küme. Her kural, bir değişkenin hangi terminal ve değişken kombinasyonlarına dönüşebileceğini belirtir. `A → α` şeklinde gösterilir, burada `A` bir değişken, `α` ise değişken ve terminallerden oluşan bir dizgidir.
4.  **S:** **Başlangıç Sembolü (Start Symbol)**. `S ∈ V` olmalıdır ve tüm türetme işlemleri bu sembolden başlar.

"Bağlamdan bağımsız" (context-free) terimi, kuralların sol tarafında her zaman tek bir değişken olmasından gelir. Yani, `A` değişkeni, etrafında hangi semboller (bağlam) olursa olsun, her zaman aynı şekilde `α`'ya dönüşebilir.

---

## 2. Türetme (Derivations) ve Ayrıştırma Ağaçları (Parse Trees)

Bir CFG'nin bir dili nasıl ürettiğini anlamak için **türetme (derivation)** sürecini kullanırız. Bu süreç, başlangıç sembolü `S` ile başlar ve bir kuralı tekrar tekrar uygulayarak, sadece terminal sembollerden oluşan bir dizgi elde edene kadar devam eder.

**Örnek:** Basit bir aritmetik ifade grameri `G`:
*   `V = {E}`
*   `T = {a, +, *}`
*   `S = E`
*   `P:`
    1.  `E → E + E`
    2.  `E → E * E`
    3.  `E → a`

Bu gramerden `a+a*a` dizgisini türetelim:
`E ⇒ E + E` (Kural 1)
`⇒ a + E` (Kural 3, soldaki E'ye)
`⇒ a + E * E` (Kural 2, sağdaki E'ye)
`⇒ a + a * E` (Kural 3)
`⇒ a + a * a` (Kural 3)

### Ayrıştırma Ağaçları (Parse Trees)
Bu türetme süreci, **ayrıştırma ağacı (parse tree)** adı verilen bir ağaç yapısıyla görselleştirilebilir.
*   Ağacın **kökü** başlangıç sembolüdür.
*   **İç düğümler** değişkenlerdir.
*   **Yapraklar** terminal sembollerdir.
*   Bir kuralın uygulanması (`A → α`), `A` düğümünün çocukları olarak `α`'daki sembolleri eklemek anlamına gelir.

---

## 3. Belirsizlik (Ambiguity)

Bir gramer, bazı dizgiler için **birden fazla farklı ayrıştırma ağacı** üretebiliyorsa, o gramere **belirsiz (ambiguous)** denir. Yukarıdaki örnek gramer, `a+a*a` dizgisi için belirsizdir çünkü bu dizgi iki farklı şekilde türetilebilir (önce `+` veya önce `*` uygulanarak).

Belirsizlik, özellikle programlama dilleri ve derleyiciler için istenmeyen bir durumdur, çünkü bir ifadenin nasıl yorumlanacağı konusunda kafa karışıklığına yol açar. Genellikle, operatör önceliği (operator precedence) gibi kurallar eklenerek gramerlerin belirsizliği giderilir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir CFG'nin "terminalleri" (terminals) neyi temsil eder?</p>
  <div class="quiz-option">A) Dilbilgisi kurallarını.</div>
  <div class="quiz-option">B) `S` gibi başlangıç sembollerini.</div>
  <div class="quiz-option" data-correct="true">C) Dilin alfabesini oluşturan ve daha fazla parçalanamayan temel sembolleri.</div>
  <div class="quiz-option">D) `E` gibi ara yapıları temsil eden değişkenleri.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Terminaller, türetme sürecinin sonunda elde edilen nihai dizgiyi oluşturan sembollerdir. 'a', '0', '+' gibi semboller terminaldir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir dilbilgisinin "bağlamdan bağımsız" (context-free) olarak adlandırılmasının sebebi nedir?</p>
  <div class="quiz-option">A) Sadece tek bir başlangıç sembolü olması.</div>
  <div class="quiz-option" data-correct="true">B) Kuralların sol tarafında her zaman tek bir değişken bulunması, bu sayede değişkenin etrafındaki bağlamdan bağımsız olarak değiştirilebilmesi.</div>
  <div class="quiz-option">C) Kuralların sağ tarafında en fazla iki sembol olabilmesi.</div>
  <div class="quiz-option">D) Hiçbir kuralın `ε` (boş dizgi) üretememesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `A → α` gibi bir kuralda, `A`'nın `α`'ya dönüşmesi için `A`'nın solunda veya sağında ne olduğu önemli değildir. Bu, "bağlamdan bağımsız" olmanın tanımıdır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir gramerin "belirsiz" (ambiguous) olması ne anlama gelir?</p>
  <div class="quiz-option">A) Gramerin sonsuz sayıda kuralı olması.</div>
  <div class="quiz-option">B) Gramerin hiçbir dizgi üretememesi.</div>
  <div class="quiz-option">C) Gramerin hem `a` hem de `A` gibi semboller içermesi.</div>
  <div class="quiz-option" data-correct="true">D) Gramerin ürettiği bazı dizgiler için birden fazla farklı ayrıştırma ağacının (parse tree) olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Belirsizlik, bir dizginin sözdizimsel yapısının birden fazla şekilde yorumlanabilmesi anlamına gelir. Bu, derleyicilerde genellikle operatör önceliği gibi kurallarla çözülür.</p>
  </div>
</div>
