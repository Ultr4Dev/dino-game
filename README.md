# Dino game Skin Code Generator (The Isle)

A lightweight, browser-based tool designed to generate custom skin codes for the game *The Isle*. This tool allows players to easily select their dinosaur species, patterns, and specific color regions, and instantly compiles them into a ready-to-paste game code.

[Latest Version is available here](https://ultr4dev.github.io/dino-game/)
---

## 🦖 Features

* **Real-Time Generation:** The skin code updates instantly as you tweak parameters or colors.
* **Built-in Color Pickers:** Uses native HTML5 color pickers for visual ease when selecting skin tones.
* **One-Click Copy:** Easily copy the compiled string directly to your clipboard to paste into the game.
* **Zero Dependencies:** Runs entirely locally in your browser using pure HTML, CSS, and JavaScript.

---

## 🛠️ How to Use

1. **Download or Clone** this repository to your local machine.
2. Open the `index.html` file in any modern web browser.
3. **Enter your specifications:**
* **Species:** Type the name of the dinosaur (e.g., *Herrerasaurus*).
* **Pattern / Variation / Theme:** Input the numerical values (0-9) for your desired patterns.


4. **Select Colors:** Click on the color blocks to open the color picker and choose the specific colors for:
* Male Display
* Markings
* Flank
* Body
* Underbelly


5. Click the **"Copy Code to Clipboard"** button at the bottom of the page.
6. Paste the code directly into *The Isle*!

---

## 🧬 Code Structure

The output string is concatenated in the exact reverse-color order required by the game engine:
`[Species][Pattern][Variation][Theme][Claws][Mouth][Teeth][Underbelly][Body][Flank][Markings][Male Display]`

*Example Output:*
* `Omniraptor0108F3838FFEB4747FFBAB5B5FF5C5757FF704242FF711919FF0400FFFFFF0000FF`
* `Dryosaurus0105C5757FF704242FF711919FF0400FFFFFF0000FF`
---

## 📄 License

This project is licensed under the **GNU General Public License v2.0 (GPL-2.0)**.

You are free to use, modify, and distribute this software, provided that any derivative works are also open-source and licensed under GPL-2.0. See the `LICENSE` file for more details.
