---
layout: default
title: Regular Expressions
nav_order: 4
parent: Automata Theory
---

# Regular Expressions (Düzenli İfadeler)

Şimdiye kadar, `Regular Languages` (Düzenli Dilleri) tanıyan makineleri, yani DFA ve NFA'ları inceledik. Şimdi ise bu dilleri cebirsel bir yolla tanımlamak ve oluşturmak için kullanılan güçlü bir notasyon olan **Regular Expressions (Düzenli İfadeler)**, kısaca **RE**'leri öğreneceğiz.

Düzenli ifadeler, bir metin editöründe "bul ve değiştir" yaparken veya bir terminalde dosya ararken (`ls *.txt`) kullandığımız kalıp eşleştirme (pattern matching) kurallarının teorik temelidir.

---

## 1. Düzenli Diller ve Düzenli İfadeler Arasındaki İlişki

Bu üç kavram arasında çok güçlü ve temel bir bağlantı vardır:
*   Her düzenli ifade (`E`), bir düzenli dili (`L(E)`) tanımlar.
*   Her düzenli dil, bir NFA (ve dolayısıyla bir DFA) tarafından tanınabilir.
*   Her düzenli dil, bir düzenli ifade ile tanımlanabilir.

Kısacası, **DFA'lar, NFA'lar ve Düzenli İfadeler, aynı dil sınıfını (Düzenli Diller) tanımlamanın üç farklı yoludur.**

---

## 2. Diller Üzerindeki İşlemler

Düzenli ifadeleri anlamak için, diller üzerinde tanımlı üç temel işlemi bilmemiz gerekir:

1.  **Birleşim (Union):** `L ∪ M` veya `L + M`. `L` veya `M` diline ait tüm dizgileri içeren dildir.
2.  **Birleştirme (Concatenation):** `LM`. `L`'den bir `x` dizgisi ile `M`'den bir `y` dizgisinin art arda eklenmesiyle (`xy`) oluşan tüm dizgileri içeren dildir.
3.  **Kleene Star (Kleene Yıldızı):** `L*`. `L` dilindeki dizgilerin sıfır veya daha fazla kez birleştirilmesiyle (kendisiyle concatenate edilmesiyle) oluşturulabilecek tüm dizgileri içeren dildir. `L*` her zaman boş dizgiyi (`ε`) içerir.

---

## 3. Düzenli İfadelerin Tanımı

Düzenli ifadeler, temel ifadelerden ve bu üç işlemden türetilir:

| Kural | Düzenli İfade | Tanımladığı Dil | Açıklama |
| :--- | :--- | :--- | :--- |
| **Temel** | `∅` | `{}` (Boş Dil) | Hiçbir dizgi içermeyen dil. |
| | `ε` | `{ε}` | Sadece boş dizgiyi içeren dil. |
| | `a` (eğer `a ∈ Σ` ise) | `{a}` | Sadece 'a' sembolünü içeren dil. |
| **Türetme** | `E₁ + E₂` | `L(E₁) ∪ L(E₂)` | İki ifadenin dillerinin birleşimi. |
| | `E₁E₂` | `L(E₁)L(E₂)` | İki ifadenin dillerinin birleştirilmesi. |
| | `E*` | `(L(E))*` | Bir ifadenin dilinin Kleene yıldızı. |
| | `(E)` | `L(E)` | Gruplama için parantezler. |

**Operatör Önceliği:** `*` (en yüksek) > Concatenation > `+` (en düşük). Örneğin, `a+bc*` ifadesi `a + (b(c*))` olarak yorumlanır.

---

## 4. Dönüşümler

### a) Düzenli İfadeden NFA'ya (Thompson's Construction)
Herhangi bir düzenli ifade, parçalara ayrılarak ve her parça için basit NFA'lar oluşturulup sonra bu NFA'ların `ε`-geçişleri ile birleştirilmesiyle sistematik olarak eşdeğer bir NFA'ya dönüştürülebilir.
*   **Temel:** `∅`, `ε`, ve tek bir `a` sembolü için basit 2 durumlu NFA'lar vardır.
*   **Türetme:** `E₁ + E₂`, `E₁E₂` ve `E*` işlemleri için, alt ifadelerin NFA'larını `ε`-geçişleri ile birleştiren standart şablonlar kullanılır.

### b) DFA'dan Düzenli İfadeye (State Elimination)
Bu dönüşüm daha karmaşıktır ve genellikle durum eleme (state elimination) yöntemiyle yapılır. DFA, kenar etiketlerinin semboller yerine düzenli ifadeler olabildiği bir **Genelleştirilmiş NFA (GNFA)**'ya dönüştürülür. Ardından, durumlar tek tek sistematik olarak elenir ve geçişler üzerindeki düzenli ifadeler birleştirilir. Sonunda sadece başlangıç ve bitiş durumu kaldığında, aralarındaki yayın etiketi orijinal DFA'nın tanıdığı dilin düzenli ifadesidir.

---

## 5. Düzenli İfadelerin Cebirsel Kuralları

Düzenli ifadeler, üzerinde tanımlı cebirsel kurallara sahiptir. Bu kurallar, bir ifadeyi basitleştirmek veya farklı görünen iki ifadenin aslında aynı dili tanımlayıp tanımlamadığını anlamak için kullanılır.

*   **Birleşme (Union) Değişme ve Birleşme Özelliği:**
    *   `L + M = M + L` (Değişme - Commutative)
    *   `L + (M + N) = (L + M) + N` (Birleşme - Associative)
*   **Birleştirme (Concatenation) Birleşme Özelliği:**
    *   `L(MN) = (LM)N` (Birleşme - Associative)
    *   Ancak birleştirme işleminin değişme özelliği yoktur: `LM ≠ ML`
*   **Dağılma (Distributive) Özelliği:**
    *   `L(M + N) = LM + LN`
    *   `(M + N)L = ML + NL`
*   **Etkisiz Elemanlar (Identities):**
    *   Birleşme için: `L + ∅ = L`
    *   Birleştirme için: `Lε = εL = L`
*   **Yutan Eleman (Annihilator):**
    *   Birleştirme için: `L∅ = ∅L = ∅`
*   **Kendine Dönüş (Idempotence):**
    *   `L + L = L`
*   **Yıldız (Closure) Kuralları:**
    *   `(L*)* = L*`
    *   `∅* = ε`
    *   `ε* = ε`

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> `Σ = {0, 1}` alfabesi için `0(0+1)*1` düzenli ifadesi hangi dili tanımlar?</p>
  <div class="quiz-option">A) İçinde "01" geçen tüm dizgiler.</div>
  <div class="quiz-option" data-correct="true">B) '0' ile başlayıp '1' ile biten tüm dizgiler.</div>
  <div class="quiz-option">C) '0' ve '1' sayılarının eşit olduğu tüm dizgiler.</div>
  <div class="quiz-option">D) Sadece "01" dizgisi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> İfadeyi parçalara ayıralım: `0` (bir '0' ile başlamalı), `(0+1)*` (ortada '0' veya '1'den oluşan herhangi bir dizgi olabilir), `1` ('1' ile bitmeli).</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> `(a+b)*` düzenli ifadesinin Kleene yıldızı, yani `((a+b)*)*` ifadesinin en basit eşdeğeri nedir?</p>
  <div class="quiz-option">A) `(a*+b*)*`</div>
  <div class="quiz-option">B) `a*b*`</div>
  <div class="quiz-option" data-correct="true">C) `(a+b)*`</div>
  <div class="quiz-option">D) `(ab)*`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir ifadenin yıldızının tekrar yıldızını almak, dilin kendisine bir şey eklemez. `(a+b)*` zaten 'a' ve 'b'den oluşan tüm olası dizgileri içerir. Bu kümenin tekrar yıldızını almak aynı kümeyi verir. Bu, `(L*)* = L*` cebirsel kuralıdır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Düzenli ifadeler ve sonlu otomatlar (DFA/NFA) arasındaki ilişki için aşağıdakilerden hangisi doğrudur?</p>
  <div class="quiz-option">A) Her düzenli ifade bir DFA'ya dönüştürülebilir ama her DFA bir düzenli ifadeye dönüştürülemez.</div>
  <div class="quiz-option">B) Düzenli ifadeler, NFA'ların tanıyamadığı dilleri de tanımlayabilir.</div>
  <div class="quiz-option" data-correct="true">C) Bir dilin düzenli ifade ile tanımlanabilmesi, o dilin bir sonlu otomat tarafından tanınabilmesine denktir.</div>
  <div class="quiz-option">D) Düzenli ifadeler sadece metin arama için kullanılır ve teorik bir karşılıkları yoktur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu, teorinin temel sonucudur (Kleene's Theorem). Düzenli ifadeler ve sonlu otomatlar, Düzenli Diller sınıfını tanımlamanın eşdeğer yollarıdır.</p>
  </div>
</div>
