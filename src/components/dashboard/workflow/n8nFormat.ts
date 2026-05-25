import type { Workflow, WorkflowNode, WorkflowEdge } from './types';
import { getIntegration } from './integrations';

/** Maps AIWave integration ids → n8n node type strings (for export/import). */
const N8N_TYPE_MAP: Record<string, string> = {
  webhook: 'n8n-nodes-base.webhook',
  gmail: 'n8n-nodes-base.gmail',
  slack: 'n8n-nodes-base.slack',
  supabase: 'n8n-nodes-base.supabase',
  openai: 'n8n-nodes-base.openAi',
  'n8n-ai-agent': 'n8n-nodes-base.httpRequest',
  twilio: 'n8n-nodes-base.twilio',
  calcom: 'n8n-nodes-base.calTrigger',
};

const REVERSE_N8N_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(N8N_TYPE_MAP).map(([k, v]) => [v, k])
);

export interface N8nWorkflowJson {
  name: string;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
    parameters: Record<string, unknown>;
  }>;
  connections: Record<
    string,
    { main: Array<Array<{ node: string; type: string; index: number }>> }
  >;
  meta?: { source: string; exportedAt: string; workflowId?: string };
  settings?: { executionOrder: string };
}

export function exportToN8n(workflow: Workflow): N8nWorkflowJson {
  const nodeNameById = Object.fromEntries(workflow.nodes.map((n) => [n.id, n.label]));

  const n8nNodes = workflow.nodes.map((n) => ({
    id: n.id,
    name: n.label,
    type: N8N_TYPE_MAP[n.integrationId] ?? 'n8n-nodes-base.httpRequest',
    typeVersion: 1,
    position: [n.x, n.y] as [number, number],
    parameters: {
      operation: n.operation,
      integrationId: n.integrationId,
      credentials: n.credentials,
      nodeType: n.type,
    },
  }));

  const connections: N8nWorkflowJson['connections'] = {};
  for (const edge of workflow.edges) {
    const sourceName = nodeNameById[edge.sourceNodeId];
    const targetName = nodeNameById[edge.targetNodeId];
    if (!sourceName || !targetName) continue;
    if (!connections[sourceName]) {
      connections[sourceName] = { main: [[]] };
    }
    connections[sourceName].main[0].push({ node: targetName, type: 'main', index: 0 });
  }

  return {
    name: workflow.name,
    nodes: n8nNodes,
    connections,
    meta: {
      source: 'AIWave Dashboard',
      exportedAt: new Date().toISOString(),
      workflowId: workflow.id,
    },
    settings: { executionOrder: 'v1' },
  };
}

export function importFromN8n(json: unknown, existingId?: string): Workflow | null {
  const data = json as N8nWorkflowJson;
  if (!data?.nodes || !Array.isArray(data.nodes)) return null;

  const now = new Date().toISOString();
  const nameByNodeName = Object.fromEntries(data.nodes.map((n) => [n.name, n.id]));

  const nodes: WorkflowNode[] = data.nodes.map((n, i) => {
    const integrationId =
      (n.parameters?.integrationId as string) ||
      REVERSE_N8N_MAP[n.type] ||
      'webhook';
    const integration = getIntegration(integrationId);
    return {
      id: n.id || `imported-${i}`,
      integrationId,
      label: n.name,
      type:
        (n.parameters?.nodeType as WorkflowNode['type']) ||
        (i === 0 ? 'trigger' : integration?.defaultNodeType ?? 'action'),
      x: n.position?.[0] ?? 80 + i * 220,
      y: n.position?.[1] ?? 200,
      credentials: (n.parameters?.credentials as WorkflowNode['credentials']) ?? {},
      operation: (n.parameters?.operation as string) || integration?.operations?.[0],
      configured: Object.keys((n.parameters?.credentials as object) ?? {}).length > 0,
    };
  });

  const edges: WorkflowEdge[] = [];
  let edgeIdx = 0;
  if (data.connections) {
    for (const [sourceName, conn] of Object.entries(data.connections)) {
      const sourceId = data.nodes.find((n) => n.name === sourceName)?.id;
      if (!sourceId) continue;
      for (const targets of conn.main ?? []) {
        for (const t of targets) {
          const targetId = nameByNodeName[t.node]
            ? data.nodes.find((n) => n.name === t.node)?.id
            : undefined;
          if (targetId) {
            edges.push({
              id: `e-import-${edgeIdx++}`,
              sourceNodeId: sourceId,
              targetNodeId: targetId,
            });
          }
        }
      }
    }
  }

  return {
    id: existingId ?? `local-${Date.now()}`,
    name: data.name || 'Imported Workflow',
    nodes,
    edges,
    active: false,
    runs: 0,
    created_at: now,
    updated_at: now,
  };
}

/** Sample n8n-compatible workflow for Medical Spa (download / import). */
export const SAMPLE_MEDICAL_SPA_N8N: N8nWorkflowJson = {
  name: 'Medical Spa Appointment Flow',
  nodes: [
    {
      id: 'n1',
      name: 'Incoming Call Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: [80, 200],
      parameters: { integrationId: 'webhook', nodeType: 'trigger', operation: 'Listen for Events' },
    },
    {
      id: 'n2',
      name: 'AI Voice Agent',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 1,
      position: [320, 200],
      parameters: { integrationId: 'n8n-ai-agent', nodeType: 'action', operation: 'Run Agent' },
    },
    {
      id: 'n3',
      name: 'Save to Supabase',
      type: 'n8n-nodes-base.supabase',
      typeVersion: 1,
      position: [560, 120],
      parameters: { integrationId: 'supabase', nodeType: 'action', operation: 'Insert Row' },
    },
    {
      id: 'n4',
      name: 'Send Confirmation Email',
      type: 'n8n-nodes-base.gmail',
      typeVersion: 1,
      position: [560, 280],
      parameters: { integrationId: 'gmail', nodeType: 'action', operation: 'Send Email' },
    },
  ],
  connections: {
    'Incoming Call Webhook': {
      main: [[{ node: 'AI Voice Agent', type: 'main', index: 0 }]],
    },
    'AI Voice Agent': {
      main: [
        [
          { node: 'Save to Supabase', type: 'main', index: 0 },
          { node: 'Send Confirmation Email', type: 'main', index: 0 },
        ],
      ],
    },
  },
  meta: { source: 'AIWave Sample', exportedAt: new Date().toISOString() },
  settings: { executionOrder: 'v1' },
};
