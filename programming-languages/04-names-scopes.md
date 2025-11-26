---
layout: default
title: Names, Bindings & Scopes
nav_order: 4
parent: Principles of Programming Languages
mermaid: true
---

# Names, Bindings, and Scopes
{: .no_toc }

Değişkenler nerede yaşar? İsimler ne zaman değerlere bağlanır? Static vs Dynamic Scoping savaşı.

## İçindekiler
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Değişkenin 4 Özelliği

Bir değişken (`int x = 5;`) sadece bir isim değildir. 4 temel özelliği vardır:

1.  **Name (İsim):** Koddaki etiketi (`x`).
2.  **Address (L-Value):** Bellekteki yeri.
3.  **Value (R-Value):** İçindeki değer (`5`).
4.  **Type:** Veri tipi (`int`).

---

## 2. Binding Times (Bağlama Zamanları)

Bir özellik, değişkene *ne zaman* yapışır?

*   **Language Design Time:** `*` operatörünün çarpma olduğu.
*   **Language Implementation Time:** `int` tipinin 32-bit mi 64-bit mi olduğu.
*   **Compile Time:** `x` değişkeninin `int` olduğu (Java/C için).
*   **Load Time:** Global değişkenin bellekteki mutlak adresi.
*   **Runtime:** Yerel değişkenin adresi (Stack frame oluşunca) veya değeri.

---

## 3. Static vs Dynamic Scoping (Sınav Favorisi)

Scope (Kapsam), bir ismin görünür olduğu kod aralığıdır.

### Static (Lexical) Scoping
*   **Kural:** Değişkenin kapsamı, kodun **yazılış hiyerarşisine** (text) göre belirlenir.
*   **Kim Kullanır?** C, Java, Python, Modern Lisp, C++.
*   **Nasıl Çalışır?** Bir değişkeni bulmak için önce kendi bloğuna, yoksa *kapsayan bloğa (parent)* bakar.

### Dynamic Scoping
*   **Kural:** Değişkenin kapsamı, **çağrılma sırasına** (call stack) göre belirlenir.
*   **Kim Kullanır?** Eski Lisp, Bash, Perl (opsiyonel).
*   **Nasıl Çalışır?** Bir değişkeni bulmak için önce kendi bloğuna, yoksa *beni çağıran fonksiyona (caller)* bakar.

### Görsel Örnek (Mermaid)

```c
// Global
int x = 10;

void big() {
    int x = 20;
    sub();
}

void sub() {
    print(x); // Hangi x?
}

main() {
    big();
}
```

```mermaid
graph TD
    subgraph Static_Scope_Bakisi
    Note1[sub fonksiyonu globalde tanimlanmis]
    Note1 --> SResult[Result: 10 (Global x)]
    end
    
    subgraph Dynamic_Scope_Bakisi
    Note2[sub, big tarafindan cagrilmis]
    Note2 --> DResult[Result: 20 (big'in x'i)]
    end
    
    style SResult fill:#dfd
    style DResult fill:#fdd
```

*   **Static Scope:** `sub()` nerede yazıldı? Global'de. O zaman `x` global `10`'dur.
*   **Dynamic Scope:** `sub()` kim tarafından çağrıldı? `big()` tarafından. `big` içinde `x=20` var mı? Var. O zaman `20`'dir.

---

## 4. Lifetime (Ömür)

Değişkenin bellekte tahsis edildiği (allocation) ve silindiği (deallocation) aralık.

1.  **Static:** Program başladığında yaratılır, bitene kadar yaşar. (Globaller, C `static`).
2.  **Stack-Dynamic:** Fonksiyon çağrılınca Stack'te yaratılır, dönünce ölür. (Local variables).
    *   *Avantaj:* Recursion desteği.
3.  **Explicit Heap-Dynamic:** Programcı `new` veya `malloc` ile yaratır, `delete` ile siler.
4.  **Implicit Heap-Dynamic:** Sadece atama yapınca yaratılır. (JS, Python stringleri).
    *   `list = [1, 2, 3];` (Boyut değişebilir, Heap'te yaşar).

---

## 5. Referencing Environments (Referans Ortamı)

Bir noktada erişilebilen **tüm** değişkenlerin (lokal + global + parent scopes) toplamına denir.
*   **Hole in Scope (Kapsamdaki Delik):**
    Eğer globalde `x` varsa ve fonksiyonda da `x` tanımlarsanız, fonksiyon içinde global `x` görünmez olur (gölgelenir - shadowing). Global `x` "hole" (delik) içinde kalır.
    *   C++'da `::x` ile erişilebilir, ama çoğu dilde erişilemez.

---

## 6. Alıştırmalar (Self-Quiz)

<details>
<summary><strong>Soru 1:</strong> C dilinde bir fonksiyon içinde <code>static int count = 0;</code> tanımlarsak ne olur?</summary>
<br>
Cevap: <strong>Lifetime'ı uzar ama Scope'u değişmez.</strong>
Değişken program sonuna kadar bellekte kalır (değerini korur), ama SADECE o fonksiyon içinden erişilebilir. Global olmaz.
</details>

<details>
<summary><strong>Soru 2:</strong> Dynamic Scoping neden modern dillerde pek kullanılmaz?</summary>
<br>
Cevap: <strong>Okunabilirlik (Readability) ve Type Checking yüzünden.</strong>
Bir fonksiyonun hangi değişkeni kullanacağını anlamak için o fonksiyonun <em>kim tarafından çağrıldığını</em> bilmek gerekir. Bu da kodu okumayı imkansız hale getirir. Ayrıca statik tip kontrolünü zorlaştırır.
</details>

<details>
<summary><strong>Soru 3:</strong> "Alias" nedir ve neden tehlikelidir?</summary>
<br>
Cevap: <strong>Takma Ad.</strong> Aynı bellek adresine erişen iki farklı isim (örn: pointerlar, C++ referansları).
Tehlikesi: <code>x</code>'i değiştirirsiniz ama yan etki olarak <code>y</code> de değişir. Programcı bunu fark etmezse bug oluşur.
</details>
