---
layout: default
title: Syntax & Semantics (BNF)
nav_order: 2
parent: Principles of Programming Languages
mermaid: true
---

# Describing Syntax & Semantics
{: .no_toc }

Bir programlama dilinin kuralları (Syntax) ve anlamı (Semantics) nasıl tanımlanır? Context-Free Grammars ve BNF.

## İçindekiler
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Syntax vs Semantics

Bir dili tanımlamak için iki şeye ihtiyaç vardır:

1.  **Syntax (Sözdizimi):** İfadelerin *formu* veya yapısı.
    *   *Örn:* `if ( <expr> ) <stmt>` doğrudur, ama `if <expr> then` C'de yanlıştır.
2.  **Semantics (Anlam):** İfadelerin *ne iş yaptığı*.
    *   *Örn:* `x = y + z` işleminin anlamı, y ve z'nin değerini toplayıp x'in adresine yazmaktır.

---

## 2. Context-Free Grammars (CFG) & BNF

Programlama dillerini tanımlamak için Noam Chomsky'nin **Context-Free Grammar** yapısı kullanılır. Bunu yazılı olarak ifade etmenin yolu **BNF (Backus-Naur Form)**'dur.

### BNF Terminolojisi

*   **Terminal:** Dilin en küçük yapı taşı (token). `if`, `while`, `+`, `id`.
*   **Non-terminal:** Daha alt kurallara açılan soyutlamalar. `<stmt>`, `<expr>`.
*   **Production (Rule):** Sol tarafın sağ tarafa nasıl dönüşeceğini gösterir.
    *   `<assign> -> <var> = <expression>`
*   **Start Symbol:** Derlemenin başladığı kök sembol.

### Örnek: Basit Atama Grameri

```text
<assign> -> <id> = <expr>
<id>     -> A | B | C
<expr>   -> <id> + <expr>
          | <id> * <expr>
          | ( <expr> )
          | <id>
```

---

## 3. Parse Trees (Ayrıştırma Ağaçları)

Syntax analizinin (Parser) çıktısıdır. Hiyerarşik yapıyı gösterir.
Örnek ifade: `A = B * ( A + C )`

```mermaid
graph TD
    S[< assign >] --> Id1[< id >: A]
    S --> Eq[=]
    S --> E1[< expr >]
    
    E1 --> Term1[< id >: B]
    E1 --> Mul[*]
    E1 --> E2[< expr >]
    
    E2 --> LP[(]
    E2 --> E3[< expr >]
    E2 --> RP[)]
    
    E3 --> E4[< id >: A]
    E3 --> Plus[+]
    E3 --> E5[< id >: C]
    
    style S fill:#f9f,stroke:#333
    style E1 fill:#bbf,stroke:#333
    style E2 fill:#bbf,stroke:#333
    style E3 fill:#bbf,stroke:#333
```

---

## 4. Ambiguity (Belirsizlik)

Bir gramer, aynı cümle için **birden fazla** Parse Tree üretebiliyorsa, o gramer **Ambiguous** (Belirsiz) kabul edilir. Bu kötüdür çünkü derleyici hangi anlamı seçeceğini bilemez.

### Örnek: "Dangling Else" Problemi
C gibi dillerde şu yapı belirsizdir:
`if (x) if (y) S1 else S2`

Soru: `else` kime ait?
1.  **Yorum 1:** İçerideki if'e ait. (Doğru olan).
2.  **Yorum 2:** Dışarıdaki if'e ait.

Gramer şöyleyse belirsizdir:
`<stmt> -> if <expr> <stmt> | if <expr> <stmt> else <stmt>`

{: .warning }
> **Çözüm:**
> Çoğu dil (C, Java) "Else, eşleşmemiş en yakın if'e aittir" kuralını koyarak belirsizliği çözer. Grameri yeniden yazarak da çözülebilir.

---

## 5. Operator Precedence & Associativity

Matematikteki işlem önceliğini (`*`, `+`'dan önce yapılır) gramere nasıl yediririz?

*   **Precedence (Öncelik):** Parse tree'de *aşağıda* olan işlem *önce* yapılır.
    *   Çarpma işlemini toplamanın "altına" koyarak önceliği sağlarsın.
*   **Associativity (Birleşme):** `5 - 3 - 1`.
    *   Soldan sağa (Left Assoc): `(5-3) - 1 = 1`.
    *   Sağdan sola (Right Assoc): `5 - (3-1) = 3`.

### Gramerde Hiyerarşi
Aşağıdaki gramer, Çarpma'ya Toplama'dan daha yüksek öncelik verir:

```text
<expr>   -> <expr> + <term>  | <term>    (Toplama en üstte)
<term>   -> <term> * <factor>| <factor>  (Çarpma altta - ÖNCE yapılır)
<factor> -> ( <expr> )       | <id>      (Parantez en altta - EN ÖNCE)
```

---

## 6. Alıştırmalar (Self-Quiz)

<details>
<summary><strong>Soru 1:</strong> Derleyici <code>A = B + C * A</code> ifadesini nasıl yorumlar?</summary>
<br>
Cevap: <strong>A = (B + (C * A))</strong>.
Çünkü standart gramerlerde çarpma operatörü, parse tree'de toplamadan daha aşağıdadır. Ağaç aşağıdan yukarı çözüldüğü için önce çarpma yapılır.
</details>

<details>
<summary><strong>Soru 2:</strong> Bir gramerin Ambiguous olup olmadığını anlamanın genel bir algoritması var mıdır?</summary>
<br>
Cevap: <strong>HAYIR (Undecidable).</strong>
Genel durum için bunu çözen bir algoritma yoktur. Ancak belirli kısıtlamalarla (örn: LALR parser generator kullanarak) "shift/reduce conflict" gibi hatalarla tespit edilebilir.
</details>

<details>
<summary><strong>Soru 3:</strong> <code>{ a^n b^n | n >= 1 }</code> dili (örn: ab, aabb, aaabbb) Regular Expression ile ifade edilebilir mi?</summary>
<br>
Cevap: <strong>HAYIR.</strong>
Regular dillerin "hafızası" yoktur, yani kaç tane 'a' geldiğini sayıp o kadar 'b' koyamaz. Bunun için en azından <strong>Context-Free Grammar</strong> (Stack yapısı) gerekir.
</details>
