---
layout: default
title: Functional Programming (Scheme)
nav_order: 7
parent: Principles of Programming Languages
mermaid: true
---

# Functional Programming: Scheme
{: .no_toc }

Imperative dillerden (C, Java) kaçış. Yan etki yok, döngü yok, sadece saf fonksiyonlar ve listeler.

## İçindekiler
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Matematiksel Fonksiyonlar

Imperative diller **Von Neumann** mimarisine (CPU + Memory) dayanır. Değişkenler "bellek hücreleridir".
Fonksiyonel diller **Matematiksel Fonksiyonlara** dayanır.

*   **Referential Transparency:** Bir fonksiyon aynı girdilerle her zaman aynı çıktıyı verir. (`time()` veya global değişken kullanımı yoktur).
*   **No Side Effects:** Değişken değeri değiştirilmez, yeni değer üretilir.

---

## 2. LISP ve Scheme

LISP (LISt Processing), 1958'de MIT'de geliştirildi. Scheme, onun daha temiz ve modern bir lehçesidir.

*   **Prefix Notation (Ön-takı):** `a + b` yerine `(+ a b)`.
*   **S-Expressions:** Kod ve veri aynı yapıdadır (Parantezli listeler).

### Temel Primitifler (Primitive Functions)

| Fonksiyon | Anlamı | Örnek | Sonuç |
|:---|:---|:---|:---|
| `QUOTE` / `'` | Değerlendirme (Veri olarak al) | `'(A B)` | `(A B)` |
| `CAR` | Listenin **BAŞI** (Head) | `(CAR '(A B C))` | `A` |
| `CDR` | Listenin **KUYRUĞU** (Tail) | `(CDR '(A B C))` | `(B C)` |
| `CONS` | Birleştir (Construct) | `(CONS 'A '(B C))` | `(A B C)` |
| `LIST` | Liste yap | `(LIST 'A 'B)` | `(A B)` |

---

## 3. List Yapısı ve Cons Cells

LISP'te listeler birbirine bağlı "Cons Cell" yapılarından oluşur. Her hücrede iki pointer vardır: biri veriye (CAR), diğeri sonraki hücreye (CDR).

Örnek Liste: `(A B C)` $\equiv$ `(CONS 'A (CONS 'B (CONS 'C '())))`

```mermaid
graph LR
    subgraph Cons_Cell_1
    A((A)) --- P1[.]
    P1 -->|cdr| Cons_Cell_2
    end
    
    subgraph Cons_Cell_2
    B((B)) --- P2[.]
    P2 -->|cdr| Cons_Cell_3
    end
    
    subgraph Cons_Cell_3
    C((C)) --- P3[.]
    P3 -->|cdr| NIL[NIL / '()]
    end
    
    style A fill:#f9f
    style B fill:#f9f
    style C fill:#f9f
    style NIL fill:#bbb
```

---

## 4. Recursion (Döngü Yerine)

Scheme'de `for` veya `while` yoktur. Her şey **Recursion** (Özyineleme) ile yapılır.

### Örnek: Listenin Uzunluğu (Length)

Mantık:
1.  Liste boşsa (`NULL?`), uzunluk 0'dır. (Base Case).
2.  Değilse, uzunluk `1 + (Kuyruğun Uzunluğu)`'dur. (Recursive Step).

```scheme
(DEFINE (my-length lst)
  (IF (NULL? lst)
      0
      (+ 1 (my-length (CDR lst)))
  )
)
```

### Tail Recursion (Kuyruk Özyinelemesi)
Eğer recursive çağrı fonksiyonun **en son** işlemiyse, derleyici bunu optimize eder ve Stack Overflow yaşanmaz (adeta bir döngü gibi çalışır).

---

## 5. Higher-Order Functions

Fonksiyonları parametre olarak alan veya döndüren fonksiyonlar. `MAP`, `FILTER`, `REDUCE`.

*   **MAP:** Bir fonksiyonu listenin her elemanına uygular.
    *   `(map (lambda (x) (* x x)) '(1 2 3))` $\to$ `(1 4 9)`

---

## 6. Alıştırmalar (Self-Quiz)

<details>
<summary><strong>Soru 1:</strong> <code>(CDR '(A))</code> işleminin sonucu nedir?</summary>
<br>
Cevap: <strong>() veya NIL</strong>.
Listenin başı A'dır. Kuyruğu ise geriye kalanlardır. A'dan sonra hiçbir şey olmadığı için boş liste döner. Hata vermez.
</details>

<details>
<summary><strong>Soru 2:</strong> <code>(CONS '(A B) '(C D))</code> işleminin sonucu nedir?</summary>
<br>
Cevap: <strong>((A B) C D)</strong>.
Dikkat! İlk eleman <code>(A B)</code> listesidir. İkinci eleman <code>(C D)</code> listesidir. Cons, birinciyi ikincinin <em>başına</em> ekler. Sonuç 3 elemanlı bir liste olur: 1. eleman <code>(A B)</code>, 2. eleman C, 3. eleman D.
</details>

<details>
<summary><strong>Soru 3:</strong> Imperative dillerde recursion neden pahalıdır?</summary>
<br>
Cevap: Her fonksiyon çağrısı bellekte (Stack) yeni bir <strong>Activation Record (Stack Frame)</strong> yaratır. Çok derinleşirse bellek biter (Stack Overflow). Functional dillerde "Tail Call Optimization" ile bu maliyet sıfırlanır.
</details>
