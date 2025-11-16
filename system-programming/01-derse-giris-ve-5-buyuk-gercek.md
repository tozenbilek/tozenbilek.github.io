---
layout: default
title: Derse Giriş ve 5 Büyük Gerçek
nav_order: 1
parent: System Programming
---

# Derse Giriş ve 5 Büyük Gerçek

This section begins by examining the main theme of the course and the five fundamental principles ("5 Big Realities") that you should always keep in mind as a system programmer.

---

## Dersin Teması: Soyutlama İyidir Ama Gerçekliği Unutma

Computer science education is largely based on **abstraction (soyutlama)**. Abstract data types, concepts like asymptotic analysis, help us break down complex systems into more manageable parts. However, these abstractions also have their limitations.

As a programmer, understanding the "reality" beneath your code - the hardware, the compiler, and the operating system - will make you much more effective. This course aims to introduce you to this reality.

**Benefits of This Approach:**
*   **Become a More Effective Programmer:** You will understand exactly what your code is doing.
*   **Debugging (Hataları Ayıklamak):** Especially difficult, "mysterious" errors can be traced back to their origins.
*   **Optimize Performance:** By understanding why your code is slow and eliminating bottlenecks, you can improve its performance.
*   **Preparation for Advanced System Design Courses:** It provides a solid foundation for topics like operating systems, compilers, and computer architecture.

![Soyutlama Katmanları](https://via.placeholder.com/600x300.png?text=Yazılım+(Soyutlama)+<-->+Donanım+(Gerçeklik))
*Görsel: İlişki yazılım soyutlamaları ile donanım gerçekliği arasında.*

---

## Büyük Gerçek #1: `int` Tamsayı Değildir, `float` Reel Sayı Değildir

In mathematics, integers are infinite, but data types like `int` in computers are represented with a limited number of bits, which can lead to unexpected results like **overflow (taşma)**.

For example, a 32-bit `int` can hold a maximum value of `2,147,483,647`. If you increment this value, it will not become `2,147,483,648`, but a negative number (`-2,147,483,648`).

Similarly, `float` and `double` types attempt to represent real numbers, but they do so with limited precision. This can lead to small **rounding errors (yuvarlama hataları)** that accumulate and cause significant problems in financial or scientific calculations.

**Example:**
The result of `(3.14 + 1e20) - 1e20` might be `0.0`, while the result of `3.14 + (1e20 - 1e20)` will be `3.14`. This demonstrates that `float` operations are not associative.

---

## Büyük Gerçek #2: Assembly Bilmek Zorundasınız

While high-level languages (C, Java, Python) make programming easier, it is crucial to understand how the compiler translates these languages into machine code. Assembly is the human-readable form of machine code.

**Why Understanding Assembly is Important?**
*   **Understanding Compiler Optimizations:** You can see how the compiler optimized your code (or how it didn't).
*   **Debugging Mysterious Errors:** It helps you understand low-level errors (e.g., memory corruption) that cause your program to crash unexpectedly.
*   **Performance Analysis:** It is a critical tool for identifying performance bottlenecks in your code.
*   **Deeper System Understanding:** The only way to truly understand how complex systems like operating systems and compilers work is to understand their low-level operation.
*   **Security:** Assembly knowledge is essential for analyzing malicious software (malware) and understanding security vulnerabilities in systems.

---

## Büyük Gerçek #3: Bellek Önemlidir (Memory Matters)

Memory is not an infinite, error-free resource. Languages like C and C++ give programmers full control over memory, but this is a great responsibility.

**Basic Realities Regarding Memory:**
*   **Memory Errors Are Dangerous:** Writing outside the bounds of an array (`buffer overflow`) or accessing a freed memory area (`dangling pointer`) can cause your program to crash, exhibit unpredictable behavior, and introduce security vulnerabilities.
*   **The Effect of an Error Can Be Far-Reaching (Action at a Distance):** An incorrect memory access can corrupt a completely different data structure, making it difficult to locate the source of the error.
*   **Performance Depends on Memory Hierarchy:** In modern computers, memory access is much slower than CPU speed. This is why **caches (önbellekler)** are used. How you access data (e.g., traversing rows or columns of a matrix) can dramatically affect your program's total execution time and, consequently, its performance.

![Bellek Hiyerarşisi](https://via.placeholder.com/500x350.png?text=CPU+<->+L1/L2/L3+Cache+<->+RAM+<->+Disk)
*Görsel: Sıralanmış bellek hiyerarşisi hız ve kapasiteye göre.*

---

## Büyük Gerçek #4: Performans Asimptotik Karmaşıklıktan İbaret Değildir

In algorithm lessons, we analyze algorithms using notations like `O(N)` or `O(N log N)`. This is excellent for understanding how an algorithm scales for large data. However, in practice, **constant factors (sabit çarpanlar)** are just as important.

Two code snippets with the same asymptotic complexity can differ by 10 times, or even 100 times, in terms of execution speed.

**Factors Affecting Performance:**
*   **CPU Architecture:** How commands are executed, pipeline (boru hattı) structure.
*   **Compiler Optimizations:** How your code is translated into machine code.
*   **Memory Access Patterns:** Writing cache-friendly (önbellek dostu) code.
*   **Loop Structures:** Even changing the order of a simple loop can dramatically improve performance.

---

## Büyük Gerçek #5: Bilgisayarlar Program Çalıştırmaktan Fazlasını Yapar

The programs we write do not run in isolation. They run on an operating system and constantly interact with the outside world.

**Other Tasks of the System:**
*   **I/O (Girdi/Çıktı):** Reading from files, writing to disk, sending and receiving data over the network, significantly affect program performance.
*   **Networking (Ağ):** Programs communicate with other machines over unreliable networks.
*   **Concurrency (Eşzamanlılık):** Modern systems run multiple tasks simultaneously (or as if they were) on a single CPU. This introduces new and complex error types.

Understanding these interactions is fundamental to building robust and efficient systems.

---

### Summary and Evaluation

In this section, we discussed the fundamental philosophy of the course and the "5 Big Realities" of system programming. These principles provide a framework for understanding the topics we will encounter throughout the course. Remember, abstractions are powerful tools, but once you understand the reality beneath them, you will become a true master.

---

### Test Questions

<div class="quiz-question">
  <p><b>Soru 1:</b> 32-bit işaretli bir tamsayı (`int`) değişkeninde `2,147,483,647` değeri varken, bu değişkene 1 eklenirse ne olur?</p>
  <div class="quiz-option">A) Değer `2,147,483,648` olur.</div>
  <div class="quiz-option">B) Program bir hata vererek çöker.</div>
  <div class="quiz-option" data-correct="true">C) Değer, `integer overflow` nedeniyle negatif bir sayıya döner.</div>
  <div class="quiz-option">D) Değer değişmez, aynı kalır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Sınırlı bit sayısı nedeniyle, "overflow" (taşma) olur ve sayı doğrusunun en negatif ucuna döner. Bu, "Int'ler Tamsayı Değildir" gerçeğinin klasik bir örneğidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir programcı, yazdığı C kodunun belirli bir bölümünün neden çok yavaş çalıştığını anlamak istiyor. Hangi araca veya bilgiye başvurması en aydınlatıcı olur?</p>
  <div class="quiz-option">A) Kodun asimptotik karmaşıklığını (`Big-O`) hesaplamak.</div>
  <div class="quiz-option" data-correct="true">B) Derleyicinin ürettiği Assembly kodunu incelemek.</div>
  <div class="quiz-option">C) Daha yüksek seviyeli bir dil olan Python'da aynı kodu yazmak.</div>
  <div class="quiz-option">D) Programın kullandığı kütüphanelerin dokümantasyonunu okumak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Assembly kodunu incelemek, derleyicinin kodu nasıl optimize ettiğini, bellek erişimlerinin nasıl yapıldığını ve işlemcinin komutları nasıl yürüttüğünü en net şekilde gösterir. Bu, "Assembly Bilmek Zorundasınız" ve "Performans Asimptotik Karmaşıklıktan İbaret Değildir" gerçekleriyle doğrudan ilgilidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir matris üzerinde işlem yapan iki farklı döngü yazılıyor. İkisi de aynı sayıda ve türde matematiksel işlem yapmasına rağmen, birisi diğerinden 10 kat daha hızlı çalışıyor. Bu durumun en olası açıklaması nedir?</p>
  <div class="quiz-option">A) Hızlı olan döngü daha az değişken kullanıyordur.</div>
  <div class="quiz-option">B) Yavaş olan döngüde bir `integer overflow` meydana geliyordur.</div>
  <div class="quiz-option">C) İşletim sistemi, hızlı olan döngüye daha fazla öncelik tanımıştır.</div>
  <div class="quiz-option" data-correct="true">D) Hızlı olan döngü, bellek erişimlerini cache (önbellek) ile daha uyumlu yapıyordur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Modern sistemlerde işlemci hızı ile bellek hızı arasında büyük bir fark vardır. Belleğe sıralı ve öngörülebilir şekilde erişen kod, verileri cache'te (önbellek) tutarak işlemciyi daha az bekletir ve çok daha hızlı çalışır. Bu, "Bellek Önemlidir" gerçeğinin en somut örneklerinden biridir.</p>
  </div>
</div>
