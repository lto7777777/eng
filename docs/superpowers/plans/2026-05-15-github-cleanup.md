# Blebleble GitHub Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete scratch files, remove the Numbers study mode, add `.gitignore` and `README.md`, and make the repo GitHub Pages–ready.

**Architecture:** Pure static site — `index.html` at root loads `.js` data files and `style.css`. No build step, no server. GitHub Pages serves it as-is.

**Tech Stack:** Vanilla HTML/CSS/JS. No dependencies, no package manager.

---

## File Map

| Action | File |
|--------|------|
| Delete | `_inline_check.js`, `_script_1.js`, `_script_2.js`, `_script_3.js`, `_script_4.js`, `_script3.js` |
| Delete | `fill-all-vietnamese.js`, `word-transformer.js` |
| Delete | `The_Oxford_5000_by_CEFR_level.pdf`, `The_Oxford_5000_by_CEFR_level.txt` |
| Modify | `index.html` — remove Numbers study mode card, container, JS handlers, and functions |
| Create | `.gitignore` |
| Create | `README.md` |

---

## Task 1: Delete scratch and tool files

**Files:**
- Delete: `_inline_check.js`, `_script_1.js`, `_script_2.js`, `_script_3.js`, `_script_4.js`, `_script3.js`
- Delete: `fill-all-vietnamese.js`, `word-transformer.js`
- Delete: `The_Oxford_5000_by_CEFR_level.pdf`, `The_Oxford_5000_by_CEFR_level.txt`

- [ ] **Step 1: Confirm scratch files are not referenced in index.html**

Run:
```powershell
Select-String -Path "C:\Users\minh\Downloads\vscode\eng\index.html" -Pattern "_script|_inline_check|fill-all|word-transformer"
```
Expected: no output (no matches).

- [ ] **Step 2: Delete the scratch and tool files**

Run:
```powershell
Remove-Item "C:\Users\minh\Downloads\vscode\eng\_inline_check.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\_script_1.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\_script_2.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\_script_3.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\_script_4.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\_script3.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\fill-all-vietnamese.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\word-transformer.js"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\The_Oxford_5000_by_CEFR_level.pdf"
Remove-Item "C:\Users\minh\Downloads\vscode\eng\The_Oxford_5000_by_CEFR_level.txt"
```
Expected: no errors.

- [ ] **Step 3: Verify remaining files**

Run:
```powershell
Get-ChildItem "C:\Users\minh\Downloads\vscode\eng" -File | Select-Object Name
```
Expected: only `index.html`, `style.css`, `english-words.js`, `quiz-types.js`, `sentence-quiz.js`, `AGENT.md` (plus the `docs/` folder).

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\minh\Downloads\vscode\eng"
git add -A
git commit -m "chore: remove scratch files and unused source data"
```

---

## Task 2: Remove Numbers study mode from index.html

The Numbers mode has four parts to remove:
1. The study card button (`id="numbers-option"`) — around line 1072
2. The full `.numbers-container` div — around lines 1208–1310
3. All `document.querySelector('.numbers-container').style.display = 'none'` lines scattered in JS — lines 1642, 1656, 1670, 1682, 2364, 2390, 2408, 2417
4. The Numbers click handler and back-button handler — lines 2406–2418
5. The `initializeNumbersSection()` call and its comment — lines 2355–2356
6. The `initializeNumbersSection` and `initializeNumberPractice` functions — lines 3160–end of `initializeNumberPractice`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Remove the Numbers study card**

In `index.html`, find and delete this block (around line 1072):
```html
          <div class="study-card" id="numbers-option">
            <h3>Numbers</h3>
            <p>Learn and practice Korean number systems</p>
          </div>
```

- [ ] **Step 2: Remove the numbers-container div**

In `index.html`, find and delete the entire block starting with:
```html
        <div class="numbers-container" style="display: none;">
```
and ending with its closing `</div>` (around line 1310). This block contains the Korean numbers tables and practice cards.

- [ ] **Step 3: Remove the numbers-option click handler**

In `index.html`, find and delete this block (around line 2405):
```javascript
      // Set up numbers practice
      document.getElementById('numbers-option').addEventListener('click', () => {
        document.querySelector('.study-options').style.display = 'none';
        document.querySelector('.numbers-container').style.display = 'block';
        document.querySelector('.flashcard-container').style.display = 'none';
        document.querySelector('.quiz-container').style.display = 'none';
        document.querySelector('.writing-container').style.display = 'none';
      });
      
      // Set up back button for numbers
      document.getElementById('back-from-numbers').addEventListener('click', () => {
        document.querySelector('.study-options').style.display = 'flex';
        document.querySelector('.numbers-container').style.display = 'none';
      });
```

- [ ] **Step 4: Remove initializeNumbersSection() call**

In `index.html`, find and delete these two lines (around line 2355):
```javascript
      // Initialize numbers section
      initializeNumbersSection();
```

- [ ] **Step 5: Remove all remaining .numbers-container display references**

Search for all remaining occurrences of `.numbers-container` in index.html and delete each line. These lines appear in the flashcards, quiz, and new-words-quiz click handlers — each has one line like:
```javascript
          document.querySelector('.numbers-container').style.display = 'none';
```
Delete only those lines (not the surrounding handler code).

- [ ] **Step 6: Remove initializeNumbersSection and initializeNumberPractice functions**

In `index.html`, find and delete the entire `initializeNumbersSection` function (starting around line 3160) and the entire `initializeNumberPractice` function that follows it. Both end before the next top-level `function` keyword.

- [ ] **Step 7: Open index.html in a browser and verify**

Open `C:\Users\minh\Downloads\vscode\eng\index.html` in a browser.
- Click **Study** in the sidebar
- Confirm you see exactly 4 cards: Flashcards, Quiz, New Words Quiz, Grammar & Sentences
- Confirm "Numbers" card is gone
- Click each of the 4 cards and confirm they open without errors
- Open browser DevTools console — confirm no JS errors

- [ ] **Step 8: Commit**

```bash
cd "C:\Users\minh\Downloads\vscode\eng"
git add index.html
git commit -m "feat: remove Numbers (Korean) study mode from Study tab"
```

---

## Task 3: Add .gitignore

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create .gitignore**

Create `C:\Users\minh\Downloads\vscode\eng\.gitignore` with this content:
```
# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/

# Node
node_modules/
*.log

# Generated by translation script
vi-translation-cache.json
```

- [ ] **Step 2: Commit**

```bash
cd "C:\Users\minh\Downloads\vscode\eng"
git add .gitignore
git commit -m "chore: add .gitignore"
```

---

## Task 4: Add README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README.md**

Create `C:\Users\minh\Downloads\vscode\eng\README.md` with this content:

```markdown
# Blebleble

A Vietnamese–English vocabulary learning web app. Browse the Oxford 5000 dictionary, study with flashcards, practice with quizzes, and build sentences with grammar exercises.

**Live demo:** https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/

---

## Features

- **Dictionary** — browse 2000+ English words with Vietnamese translations, pronunciation, and category filters
- **Flashcards** — flip-card vocabulary practice (Vietnamese → English)
- **Quiz** — multiple-choice questions on word meanings
- **New Words Quiz** — focused review of recently studied words
- **Grammar & Sentences** — sentence construction exercises with word-by-word explanations

## How to use

**Option 1 — Local:** Download or clone the repo, then open `index.html` in any browser. No server or install needed.

**Option 2 — Online:** Visit the live demo link above.

## Tech stack

- Vanilla HTML, CSS, JavaScript
- No frameworks, no build tools, no dependencies
- Works offline after first load
```

- [ ] **Step 2: Update the live demo URL**

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` in `README.md` with your actual GitHub username and repository name.

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\minh\Downloads\vscode\eng"
git add README.md
git commit -m "docs: add README"
```

---

## Task 5: Push and enable GitHub Pages

- [ ] **Step 1: Push to GitHub**

```bash
cd "C:\Users\minh\Downloads\vscode\eng"
git push origin main
```

- [ ] **Step 2: Enable GitHub Pages**

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Set branch to `main`, folder to `/ (root)`
5. Click **Save**

- [ ] **Step 3: Wait ~1 minute, then visit the Pages URL**

GitHub will show the URL at the top of the Pages settings page (format: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`). Open it and verify the app loads correctly.

- [ ] **Step 4: Update README with real URL**

Update the `Live demo:` line in `README.md` with the actual GitHub Pages URL, then commit and push:

```bash
cd "C:\Users\minh\Downloads\vscode\eng"
git add README.md
git commit -m "docs: add live demo URL"
git push origin main
```
