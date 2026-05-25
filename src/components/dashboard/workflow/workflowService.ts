import { supabase } from '../../../lib/supabase';
import axios from 'axios';
import type { Workflow, WorkflowNode, WorkflowEdge } from './types';

// ── Supabase CRUD ─────────────────────────────────────────────────────────────
// SQL to run once in Supabase SQL editor:
//
// create table if not exists workflows (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid references auth.users(id) on delete cascade,
//   name text not null default 'Untitled Workflow',
//   nodes jsonb not null default '[]',
//   edges jsonb not null default '[]',
//   active boolean not null default false,
//   runs integer not null default 0,
//   last_run text,
//   created_at timestamptz default now(),
//   updated_at timestamptz default now()
// );
// alter table workflows enable row level security;
// create policy "Users manage own workflows" on workflows
//   for all using (auth.uid() = user_id);

export async function fetchWorkflows(): Promise<Workflow[]> {
    const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('updated_at', { ascending: false });
    if (error || !data) return [];
    return data as Workflow[];
}

export async function saveWorkflow(wf: Workflow): Promise<Workflow | null> {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
        ...wf,
        user_id: user?.id,
        updated_at: new Date().toISOString(),
    };

    // Strip icon (ReactNode) from nodes before saving — not serializable
    const safeNodes = wf.nodes.map(({ ...n }) => n);
    const safePayload = { ...payload, nodes: safeNodes };

    if (wf.id.startsWith('local-')) {
        // New workflow — insert
        const { id: _id, ...insertPayload } = safePayload;
        const { data, error } = await supabase
            .from('workflows')
            .insert([insertPayload])
            .select()
            .single();
        if (error || !data) return null;
        return data as Workflow;
    } else {
        // Existing — upsert
        const { data, error } = await supabase
            .from('workflows')
            .upsert([safePayload])
            .select()
            .single();
        if (error || !data) return null;
        return data as Workflow;
    }
}

export async function deleteWorkflow(id: string): Promise<boolean> {
    if (id.startsWith('local-')) return true;
    const { error } = await supabase.from('workflows').delete().eq('id', id);
    return !error;
}

// ── n8n execution via axios ───────────────────────────────────────────────────
export interface ExecuteResult {
    success: boolean;
    message: string;
    executionId?: string;
}

export async function executeWorkflow(wf: Workflow): Promise<ExecuteResult> {
    const webhookUrl =
        (typeof localStorage !== 'undefined' ? localStorage.getItem('aiwave_n8n_webhook') : null) ||
        (import.meta.env.VITE_N8N_WEBHOOK_URL as string);
    if (!webhookUrl) {
        return { success: false, message: 'n8n webhook URL not set — add VITE_N8N_WEBHOOK_URL in .env or Settings → API Keys' };
    }

    // Build a structured payload that n8n can route on
    const payload = {
        workflowId: wf.id,
        workflowName: wf.name,
        executedAt: new Date().toISOString(),
        source: 'AIWave Dashboard',
        nodes: wf.nodes.map((n) => ({
            id: n.id,
            integrationId: n.integrationId,
            label: n.label,
            type: n.type,
            operation: n.operation,
            // Only send non-secret credential keys so n8n knows what's configured
            configuredKeys: Object.keys(n.credentials).filter((k) => !!n.credentials[k]),
        })),
        edges: wf.edges,
    };

    try {
        const res = await axios.post(webhookUrl, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000,
        });
        return {
            success: true,
            message: 'Workflow executed successfully',
            executionId: res.data?.executionId || res.data?.id,
        };
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        const msg = e?.response?.data?.message || e?.message || 'Execution failed';
        return { success: false, message: msg };
    }
}
