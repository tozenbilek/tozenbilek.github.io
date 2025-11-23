---
layout: default
title: ECF Exceptions & Processes
nav_order: 7
parent: System Programming
---

# Exceptional Control Flow (ECF): Exceptions and Processes

## 1. Exceptions (Hardware Level)

Transfer of control to OS kernel in response to an event.

| Type | Sync/Async | Return Behavior | Example |
|:---|:---:|:---|:---|
| **Interrupt** | Async | Returns to *next* instruction. | I/O (Network packet, Key press). |
| **Trap** | Sync | Returns to *next* instruction. | System Call (`syscall`). |
| **Fault** | Sync | Retries *current* instruction. | Page Fault (recoverable). |
| **Abort** | Sync | Does NOT return. | Hardware error (parity check). |

## 2. Processes

A process is an instance of a running program.
*   **Context:** State needed to restart (Registers, PC, Open files, Env vars).
*   **Illusion:** Each process feels like it has exclusive use of CPU and Memory.

### Mode Switching
*   **User Mode:** Restricted access. Cannot modify OS structures or access hardware directly.
*   **Kernel Mode:** Full access. Entered via Exception (Interrupt/Trap/Fault).

### Context Switch
Mechanism to switch execution from one process to another.
1.  Save context of current process.
2.  Restore context of some other process.
3.  Transfer control to new process.

## 3. Process Control (System Calls)

### `fork()`
Creates a new child process (exact duplicate of parent).
*   **Returns Twice:**
    *   Returns `0` to the **Child**.
    *   Returns `PID` of child to the **Parent**.
*   **CoW (Copy-on-Write):** Memory is shared read-only until one writes, then copied. Efficient.

### `execve()`
Replaces the current process code/data with a new program.
*   Does **NOT** return (unless error). PID stays the same.

### `waitpid()`
Parent waits for child to terminate.
*   **Zombie Process:** A child that finished but hasn't been "reaped" (waited for) by parent. Takes up system table space.

### `exit()`
Terminates the process.

## 4. Shells
Simple REPL (Read-Eval-Print-Loop) that runs programs.
1.  Read command line.
2.  If builtin (cd, exit), execute directly.
3.  Else, `fork()` $\to$ `execve()` to run program.
4.  Parent `waitpid()` (unless background `&`).

