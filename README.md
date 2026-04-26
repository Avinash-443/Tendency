HR Workflow Designer
Case Study Submission  ·  Tredence Studio Full Stack Engineering Internship 2025
Architecture
A single React (Vite) application covering all 5 functional requirements from the case study PDF. Built with clean separation of concerns across 6 folders.

Folder Structure
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

Layer Separation
•	api/ — all API logic isolated. Swap with real fetch() without touching components
•	hooks/ — all state logic. Components are pure UI, they just call handlers
•	nodes/ — canvas rendering only, no form or API knowledge
•	forms/ — form logic only, no canvas knowledge
•	types.js — add a new node type here; no other file needs structural change

How to Run
npm install
npm run dev

Open http://localhost:5173

•	Drag any node type from the left sidebar onto the canvas
•	Click a node on the canvas to open its edit form on the right panel
•	Connect nodes by dragging from the bottom handle of one node to the top handle of another
•	Press the Delete key (with a node selected) or use the Delete Node button in the form panel
•	Click Test Workflow to open the sandbox modal, then click Run Simulation

Design Decisions
selectedId pattern instead of selectedNode state
Only the node ID is stored in state. The actual node object is derived from the nodes array on every render. This means when a form updates node data, the form panel immediately shows the latest value without any extra sync.

types.js as single source of truth
NODE_COLORS, NODE_LABELS, NODE_DEFAULTS are all defined once. The sidebar, canvas nodes, and form panel all import from this file. Adding a new node type means touching types.js, adding one form file, and adding one line to FORM_MAP in NodeFormPanel.jsx.

FORM_MAP for extensibility
NodeFormPanel.jsx has a FORM_MAP object that maps node type strings to form components. This is the only structural change needed to support a new node type. The routing logic itself never changes.

Controlled forms throughout
Every input uses value + onChange. Node data lives in React Flow state and flows down as props. The canvas and form panel always show the same data.

BFS + DFS in simulate
POST /simulate uses DFS (white/gray/black) for cycle detection and BFS from the Start node for execution order. These are the correct algorithms for directed graphs and are the same logic a real workflow engine would use.

Custom hooks for async state
useSimulate owns loading/result/error state for the simulate API call. This keeps async logic entirely out of SimulatePanel.jsx, which just renders whatever the hook provides.

Completed vs. What I Would Add
Completed
•	React Flow canvas with all 5 custom node types
•	Drag nodes from sidebar onto canvas
•	Connect nodes with edges, delete nodes/edges
•	Click node to open edit form — form panel derives live from state
•	All 5 node forms with required fields (Start, Task, Approval, Automated, End)
•	Automated Step form fetches GET /automations and renders dynamic param fields
•	KV editor shared by Start (metadata) and Task (custom fields)
•	POST /simulate with DFS cycle detection + BFS execution order
•	Sandbox panel serializes graph, sends to API, shows execution log
•	Validation before simulate (missing Start/End warning in top bar)
•	MiniMap, Controls from React Flow

Would Add With More Time
•	Export / Import workflow as JSON file
•	Visual validation errors shown directly on nodes (red border if misconfigured)
•	Undo / Redo with useReducer or a history stack
•	Cycle detection warning shown before simulation, not just inside it
•	TypeScript interfaces for node data shapes
•	Unit tests for BFS/DFS logic and KVEditor component
Tredence Studio · AI Agents Engineering Internship 2025
