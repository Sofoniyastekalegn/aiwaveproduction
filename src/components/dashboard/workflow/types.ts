// ── Shared types for the workflow builder ─────────────────────────────────────

export type NodeType = 'trigger' | 'action' | 'condition' | 'output';

export interface CredentialField {
    key: string;
    label: string;
    type: 'text' | 'password' | 'url' | 'select' | 'textarea';
    placeholder?: string;
    required?: boolean;
    options?: string[]; // for select
    hint?: string;
}

export interface IntegrationDef {
    id: string;
    name: string;
    description: string;
    category: string;
    color: string;
    iconName: string; // lucide icon name string
    badge?: string;
    defaultNodeType: NodeType;
    credentialFields: CredentialField[];
    operations?: string[]; // e.g. ['Send Message', 'Get Channel']
}

export interface NodeCredentials {
    [key: string]: string;
}

export interface WorkflowNode {
    id: string;
    integrationId: string;
    label: string;
    type: NodeType;
    x: number;
    y: number;
    credentials: NodeCredentials;
    operation?: string;
    configured: boolean; // true once user has filled credentials
}

export interface WorkflowEdge {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
}

export interface Workflow {
    id: string;
    user_id?: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    active: boolean;
    runs: number;
    last_run?: string;
    created_at: string;
    updated_at: string;
}

export type WorkflowStatus = 'idle' | 'saving' | 'saved' | 'error' | 'running' | 'success';
