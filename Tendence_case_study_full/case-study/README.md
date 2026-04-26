# 🧩 HR Workflow Designer

### Case Study Submission · Tredence Studio Full Stack Engineering Internship 2025

---

## 🏗️ Architecture

A single **React (Vite)** application covering all 5 functional requirements from the case study PDF.
Built with clean separation of concerns across 6 folders.

---

## 📁 Folder Structure

```
src/
  types.js          ← single source of truth for all node definitions
  api/
    mockApi.js       ← GET /automations + POST /simulate
  hooks/
    useWorkflow.js   ← all workflow state (nodes, edges, selected)
    useSimulate.js   ← simulate API call state
  nodes/
    customNodes.jsx  ← 5 custom React Flow node components
  forms/
    NodeFormPanel.jsx← routes to correct form + all 5 node forms
  components/
    Field.jsx        ← reusable label wrapper
    KVEditor.jsx     ← reusable key-value editor
    SimulatePanel.jsx← sandbox modal
  App.jsx            ← main orchestration layer
```

---

## 🧱 Layer Separation

* **api/** — all API logic isolated. Swap with real `fetch()` without touching components
* **hooks/** — all state logic. Components are pure UI
* **nodes/** — canvas rendering only, no form or API knowledge
* **forms/** — form logic only, no canvas knowledge
* **types.js** — add a new node type here; no structural change elsewhere

---

## ⚙️ How to Run

```bash
npm install
npm run dev
```

Open: http://localhost:5173

---

## 🧪 Usage

* Drag nodes from the left sidebar onto the canvas
* Click a node to open its edit form
* Connect nodes using handles
* Press **Delete** key or use Delete button
* Click **Test Workflow → Run Simulation**

---

## 🧠 Design Decisions

### 🔹 selectedId pattern

Stores only node ID instead of full object → avoids duplication and ensures instant updates.

### 🔹 types.js as single source

Defines `NODE_COLORS`, `NODE_LABELS`, `NODE_DEFAULTS`.
Adding a new node requires minimal changes.

### 🔹 FORM_MAP extensibility

Maps node types → form components.
No change needed in routing logic.

### 🔹 Controlled forms

All inputs use `value + onChange` → consistent UI state.

### 🔹 BFS + DFS in simulate

* **DFS** → cycle detection
* **BFS** → execution order
  Matches real workflow engine logic.

### 🔹 Custom hooks

* `useWorkflow` → manages nodes & edges
* `useSimulate` → handles async state

---

## ✅ Completed Features

* React Flow canvas with 5 node types
* Drag, connect, delete nodes
* Dynamic node form panel
* KV editor (shared components)
* Automation step with dynamic API fields
* BFS + DFS simulation engine
* Validation before simulation
* Simulation sandbox panel
* MiniMap & Controls

---

## 🔮 Future Improvements

* Export / Import workflow (JSON)
* Node-level validation UI (red borders)
* Undo / Redo functionality
* Pre-simulation cycle warnings
* TypeScript migration
* Unit tests (BFS/DFS + KVEditor)

---

## 🛠️ Tech Stack

* React (Vite)
* React Flow
* JavaScript (ES6+)
* Custom Hooks
* Mock API

---

## 📌 Note

This project demonstrates:

* Scalable frontend architecture
* Clean separation of concerns
* Graph-based problem solving
* Real-world workflow engine design
