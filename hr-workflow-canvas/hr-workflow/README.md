# HR Workflow Designer – Canvas Module

Case Study submission for Tredence Studio Full Stack Engineering Internship 2025.

---

## How to Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

No backend needed — the mock API is all in-browser.

---

## Architecture

```
src/
├── api/
│   └── mockApi.js         # GET /automations + POST /simulate (local mocks)
├── nodes/
│   └── nodeTypes.jsx      # 5 custom React Flow node components
├── components/
│   ├── Sidebar.jsx        # Left panel — drag node types onto canvas
│   ├── NodeFormPanel.jsx  # Right panel — edit selected node's fields
│   └── SimulatePanel.jsx  # Modal — serialize graph, run simulation, show log
├── App.jsx                # Main layout, canvas state, drop/connect handlers
└── main.jsx
```

**Three separate layers:**
- `api/` — all mock API logic lives here, isolated from UI
- `nodes/` — node rendering only, no business logic
- `components/` — UI panels that consume state from App

---

## Design Decisions

**Single file per concern** — each file has one job. Adding a new node type means touching `nodeTypes.jsx`, `NodeFormPanel.jsx`, and `mockApi.js` only — no other files change.

**BFS for simulation order** — the workflow is a directed graph. BFS from the Start node gives the correct execution order and naturally skips disconnected nodes.

**Controlled forms** — every node form uses controlled inputs (`value` + `onChange`). Node data lives in React Flow's node state so the canvas and the form panel always stay in sync.

**Validation before simulate** — checking for Start/End nodes in the UI (before the API call) avoids an unnecessary round-trip and gives faster feedback.

**Initial example nodes** — the canvas starts with a simple 3-node onboarding flow so reviewers can see the product working immediately without building anything.

---

## What I Completed

- [x] Drag-and-drop canvas (5 node types)
- [x] Connect nodes with edges
- [x] Click node to open edit form on the right
- [x] Delete node via form panel button or `Delete` key
- [x] All 5 node forms with required fields (Start, Task, Approval, Automated, End)
- [x] Automated Step form fetches actions from mock `GET /automations` and renders dynamic param fields
- [x] Simulate panel — serializes graph, calls mock `POST /simulate`, shows step-by-step log
- [x] Basic validation — warns if Start or End node is missing before simulation
- [x] MiniMap for canvas navigation

## What I'd Add With More Time

- Cycle detection in the BFS (currently silently skips revisited nodes — should return an error)
- Visual validation errors shown on nodes directly (red border if misconfigured)
- Export / Import workflow as JSON
- Undo / Redo
- Auto-layout button to tidy up node positions
- TypeScript types for node data (currently plain JS objects)
- Unit tests for the mockApi and BFS logic
