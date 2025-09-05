### **Essential Vim Commands for Work 🚀**  


## **🔹 Basic Navigation**
| Command            | Description |
|-------------------|------------|
| `h` / `l`        | Move **left** / **right** |
| `j` / `k`        | Move **down** / **up** |
| `0` / `^` / `$`  | Move to **beginning** / **first non-whitespace** / **end** of the line |
| `gg` / `G`       | Jump to the **beginning** / **end** of the file |
| `5G`             | Jump to **line 5** (change `5` to any number) |
| `Ctrl + d` / `Ctrl + u` | Move **half-page down** / **up** |
| `Ctrl + f` / `Ctrl + b` | Move **full-page down** / **up** |

---

## **🔹 Insert Mode (Editing)**
| Command  | Description |
|----------|------------|
| `i`      | Insert **before cursor** |
| `I`      | Insert **at the beginning of the line** |
| `a`      | Append **after cursor** |
| `A`      | Append **at the end of the line** |
| `o` / `O` | Open **new line below** / **above** cursor |
| `Esc`    | Exit insert mode |

---

## **🔹 Save & Exit**
| Command  | Description |
|----------|------------|
| `:w`     | Save file |
| `:q`     | Quit (only if no unsaved changes) |
| `:wq` / `ZZ` | Save & quit |
| `:q!`    | Quit **without saving** |
| `:w filename` | Save **as a new file** |

---

## **🔹 Copy, Paste & Delete**
| Command      | Description |
|-------------|------------|
| `yy`        | Copy (yank) **current line** |
| `5yy`       | Copy **5 lines** |
| `p` / `P`   | Paste **after** / **before** cursor |
| `dd`        | Delete (cut) **current line** |
| `5dd`       | Delete **5 lines** |
| `d$` / `d0` | Delete from **cursor to end** / **start** of line |
| `x`         | Delete **single character** |
| `X`         | Delete **character before cursor** |

---

## **🔹 Undo & Redo**
| Command  | Description |
|----------|------------|
| `u`      | Undo last change |
| `Ctrl + r` | Redo undone change |

---

## **🔹 Searching & Replacing**
| Command                 | Description |
|-------------------------|------------|
| `/word` / `?word`       | Search **forward** / **backward** for `word` |
| `n` / `N`              | Repeat **next** / **previous** search result |
| `:%s/old/new/g`        | Replace **all** occurrences of `old` with `new` |
| `:5,10s/old/new/g`     | Replace between **lines 5-10** |
| `:%s/old/new/gc`       | Ask for confirmation before replacing |

---

## **🔹 Indentation**
| Command  | Description |
|----------|------------|
| `>>`     | Indent **current line** right |
| `<<`     | Indent **current line** left |
| `5>>`    | Indent **5 lines** right |

---

## **🔹 Splitting & Switching Windows**
| Command   | Description |
|-----------|------------|
| `:sp file` | Open file in **horizontal split** |
| `:vsp file` | Open file in **vertical split** |
| `Ctrl + w + h/j/k/l` | Move between splits |
| `Ctrl + w + q` | Close current split |

---

## **🔹 Working with Multiple Files**
| Command   | Description |
|-----------|------------|
| `:e file` | Open another file |
| `:bn` / `:bp` | Switch to **next** / **previous** file |
| `:bd`     | Close current buffer |

---

### **💡 Pro Tips**
✅ Always **switch to Normal mode (`Esc`) before using commands**.  
✅ Use `:help command` to get more info about a Vim command.  
✅ Practice using Vim in your **configuration files (like `.bashrc`, `.vimrc`, `nginx.conf`)** to get comfortable.  