---
layout: default
title: Linking
nav_order: 6
parent: System Programming
---

# Linking

## 1. What Linkers Do

Linkers combine multiple object files (`.o`) into a single executable.
1.  **Symbol Resolution:** Associates references (calls to function names) with definitions.
2.  **Relocation:** Combines code/data sections and updates addresses.

## 2. Symbols

*   **Global Symbols:** Defined in module, usable by others (non-static functions, global vars).
*   **External Symbols:** Defined elsewhere, used here (`extern`).
*   **Local Symbols:** Defined in module, ONLY visible here (`static` functions/vars).
    *   **Note:** Local non-static variables (inside functions) are managed by stack, NOT linker.

### Strong vs. Weak Symbols
*   **Strong:** Procedures and initialized globals. (`int x = 5;`)
*   **Weak:** Uninitialized globals. (`int x;`)

### Rules (Linker Resolution)
1.  Cannot have multiple strong symbols with same name (**Linker Error**).
2.  Given one strong and multiple weak, choose the **strong**.
3.  Given multiple weak, pick an **arbitrary** one (Dangerous! Use `-fno-common` or `static` to avoid bugs).

## 3. Relocation (Address Calculation)

Linker merges sections (`.text`, `.data`) from different `.o` files into one executable.
*   **Relocation Entries:** Compiler doesn't know final address, so it leaves a "note" (relocation entry) for the linker.
*   **PC-Relative Addressing:**
    *   Used for `call` and `jmp`.
    *   `Target Addr = PC + Displacement`.
    *   Linker calculates displacement so execution jumps to correct function.

## 4. Static vs. Dynamic Linking

### Static Linking (`.a` Archive)
*   Copy code from library into executable at compile time.
*   **Pros:** Fast execution, no dependency issues later.
*   **Cons:** Large file size, difficult to update libraries (must recompile).

### Dynamic Linking (`.so` Shared Object / DLL)
*   Code is loaded at **run time**.
*   **Pros:** Saves disk/memory (shared among processes), easy updates.
*   **Cons:** Small startup overhead, "DLL Hell" (version mismatch).
*   **Mechanism:** Position Independent Code (PIC).

#### PIC & Lazy Binding (PLT / GOT)
How does code call a function in a shared library if the address isn't known until runtime?

1.  **GOT (Global Offset Table):**
    *   Located in Data segment.
    *   Stores absolute addresses of global variables/functions.
    *   Updated by Dynamic Linker at load time.

2.  **PLT (Procedure Linkage Table):**
    *   Located in Code segment.
    *   Small stubs of code that jump to addresses in GOT.

**Lazy Binding Flow (First Call):**
1.  Program calls `func@PLT`.
2.  PLT jumps to GOT address.
3.  First time: GOT points *back* to next instruction in PLT (address not resolved yet).
4.  PLT pushes ID and calls the **Dynamic Linker Resolver**.
5.  Resolver finds `func` address, writes it into GOT, and jumps to function.

**Second Call:**
1.  Program calls `func@PLT`.
2.  PLT jumps to GOT.
3.  GOT now has the real address $\to$ Jumps directly to code! (Fast).

## 5. Executable and Linkable Format (ELF)

Standard binary format for Linux.

*   **.text:** Machine code.
*   **.rodata:** Read-only data (format strings, switch tables).
*   **.data:** Initialized global variables.
*   **.bss:** Uninitialized global variables (Better Save Space - takes 0 space on disk).
*   **.symtab:** Symbol table (Global/Static variables and functions).
