HR Workflow Designer – Mock API
Case Study Submission
Tredence Studio Internship - 2025


1. Architecture
The project is a single self-contained HTML file with no build step or dependencies. It is split into three clear layers:

Mock API Layer  (JavaScript)
•	Two functions mirror the two endpoints specified in the case study:
◦	fetchAutomations() — simulates GET /automations
◦	simulate() — simulates POST /simulate
•	A mockDelay() helper uses setTimeout to fake a realistic network round-trip (~600-800 ms).
•	Input is validated before any response is returned — missing Start or End nodes return a 400-style error object.
•	BFS (Breadth-First Search) traversal walks the node graph from the Start node to determine execution order.

UI / Presentation Layer  (HTML + CSS)
•	Two card sections, one per endpoint.
•	A pre-filled textarea holds the sample workflow JSON so the reviewer can click Send immediately.
•	The raw JSON response appears in a dark code block below each button.
•	POST /simulate additionally renders a human-readable step-by-step execution log beneath the JSON.

Folder / File Structure
mock-api.html   ← entire project (HTML + CSS + JS in one file)
README.docx     ← this file

2. How to Run
No installation, no npm, no server needed.

•	Download index.html
•	Double-click the file to open it in any modern browser (Chrome, Firefox, Edge)
•	Click Send Request under GET /automations to see the automation list
•	Click Send Request under POST /simulate to run the sample onboarding workflow
•	Edit the JSON textarea to test different node configurations or error cases

To test the error case (400 validation), delete the start node from the JSON and click Send:
Remove the { "id": "start-1", "type": "start", ... } object from the nodes array.

3. Design Decisions
Single HTML file
The case study says no backend persistence or authentication is required. A single file is the simplest thing that works — easy to zip, open, and review without any setup.

BFS for execution order
The workflow is a directed graph. BFS from the Start node naturally produces the correct left-to-right / top-to-bottom execution order and also implicitly skips disconnected nodes, which is the right behaviour for a broken graph.

Validation before simulation
The PDF specifies that the sandbox panel should validate structure. Checking for a missing Start or End node before running covers the most common user mistakes and mirrors how a real API would respond with a 400 Bad Request.

Mock delay
A small setTimeout (600-800 ms) is added so the button disables and a loading indicator appears. Without it the response feels instant and the integration does not demonstrate async patterns, which is one of the evaluation criteria.

Kept the automation list minimal
The PDF shows exactly two automations in its example (send_email and generate_doc). The mock returns those two exactly, matching the spec rather than padding with extras.

4. Completed vs. What I Would Add
Completed
•	GET /automations — returns mock action list with id, label, params
•	POST /simulate — accepts workflow JSON, validates, runs BFS, returns execution log
•	400 error response for missing Start node
•	400 error response for missing End node
•	Step-by-step visual execution log below the JSON response
•	Simulated network delay with loading state
•	Pre-filled sample onboarding workflow so reviewer can test immediately

Would Add With More Time
•	Cycle detection — currently BFS silently skips revisited nodes; a real validator should return a 400 with message CYCLE_DETECTED
•	Disconnected node warning — nodes with no incoming or outgoing edge should be flagged
•	Random step failures (~10% chance) to simulate partial execution and test the partial status response
•	MSW (Mock Service Worker) integration — intercept actual fetch() calls so the React app does not need to change its API calls at all
•	JSON schema validation on the request body — reject malformed nodes (e.g., missing id or type fields) with a descriptive error
•	Export simulation result as JSON — useful for debugging complex workflows

Submitted for Tredence Studio – AI Agents Engineering Internship 2025  -  Full Stack Engineering (Frontend Track)
