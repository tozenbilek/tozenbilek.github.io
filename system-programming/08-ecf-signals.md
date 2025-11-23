---
layout: default
title: ECF Signals & Nonlocal Jumps
nav_order: 8
parent: System Programming
---

# Exceptional Control Flow (ECF): Signals and Nonlocal Jumps

## 1. Signals (Software Interrupts)

A message to a process notifying it of an event.

| Signal | Name | Default Action | Event |
|:---|:---|:---|:---|
| 2 | `SIGINT` | Terminate | Ctrl+C (Interrupt) |
| 9 | `SIGKILL` | Terminate | Kill immediately (Cannot catch/ignore) |
| 11 | `SIGSEGV` | Dump Core | Segmentation Fault (Bad memory access) |
| 14 | `SIGALRM` | Terminate | Timer expired |
| 17 | `SIGCHLD` | Ignore | Child process stopped/terminated |

## 2. Sending Signals

*   **Kernel:** Sends signals on events (Div by zero, Ctrl+C).
*   **Kill Command:** `/bin/kill -9 1234` (Sends SIGKILL to PID 1234).
*   **System Call:** `kill(pid, sig)` function in C.

## 3. Receiving Signals

A destination process receives a signal when the kernel forces it to react.
Possible reactions:
1.  **Ignore:** Do nothing.
2.  **Terminate:** (With or without core dump).
3.  **Catch:** Execute a user-level function called a **Signal Handler**.

```c
void handler(int sig) {
    printf("Received SIGINT\n");
    // Danger: Do not use printf in real handlers (not async-signal-safe)!
}
// Registering
signal(SIGINT, handler);
```

### Critical Issues in Handlers
*   **Async-Signal-Safety:** Handlers can interrupt main program at ANY time. Only call safe functions (e.g., `write`, `_exit`). Do NOT call `printf`, `malloc`, `exit`.
*   **Concurrency:** Save/restore global `errno`.
*   **Volatile:** Declare global flags shared with main as `volatile sig_atomic_t`.

## 4. Blocking Signals
To prevent race conditions, signals can be blocked (postponed) temporarily.
*   **Implicit Blocking:** Kernel blocks signal `k` while handler for `k` is running.
*   **Explicit Blocking:** Use `sigprocmask()` to block specific signals during critical sections.

## 5. Nonlocal Jumps

A way to jump from one function to another (breaking normal call/return stack rules). Like a "Try-Catch" in C.

### `setjmp(jmp_buf env)`
*   Saves current stack context/regs into `env`.
*   Returns `0` when called directly.
*   Returns `nonzero` when returning from `longjmp`.

### `longjmp(jmp_buf env, int val)`
*   Restores context from `env`.
*   Jumps back to the `setjmp` call location.
*   `setjmp` returns `val`.

**Use Case:** Error recovery (jump back to main loop on deep error) without checking return codes up the entire stack.

