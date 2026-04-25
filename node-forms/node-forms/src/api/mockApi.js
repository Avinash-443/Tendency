// Mock API — GET /automations as specified in the case study PDF

const AUTOMATIONS = [
  { id: 'send_email',   label: 'Send Email',        params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getAutomations() {
  await delay(500);
  return AUTOMATIONS;
}
