import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    X, Eye, EyeOff, CheckCircle2, AlertCircle,
    ChevronDown, ExternalLink, Key, ArrowRight,
    ArrowLeft, Zap, Settings2, Link2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { WorkflowNode, CredentialField } from './types';
import { getIntegration } from './integrations';

// ── Icon map (same as WorkflowsPage) ─────────────────────────────────────────
import {
    Bot, Database, Mail, Phone, MessageSquare, Globe,
    Calendar, FileSpreadsheet, Webhook, GitBranch, LayoutGrid, Mic,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
    Bot: <Bot size={20} />, Database: <Database size={20} />, Mail: <Mail size={20} />,
    Phone: <Phone size={20} />, MessageSquare: <MessageSquare size={20} />, Globe: <Globe size={20} />,
    Calendar: <Calendar size={20} />, FileSpreadsheet: <FileSpreadsheet size={20} />,
    Webhook: <Webhook size={20} />, GitBranch: <GitBranch size={20} />, Zap: <Zap size={20} />,
    LayoutGrid: <LayoutGrid size={20} />, Mic: <Mic size={20} />,
};
function getIcon(name: string) { return ICON_MAP[name] ?? <Zap size={20} />; }

// ── Docs links per integration ────────────────────────────────────────────────
const DOCS_LINKS: Record<string, string> = {
    openai: 'https://platform.openai.com/api-keys',
    gemini: 'https://aistudio.google.com/app/apikey',
    anthropic: 'https://console.anthropic.com/settings/keys',
    elevenlabs: 'https://elevenlabs.io/app/settings',
    supabase: 'https://supabase.com/dashboard/project/_/settings/api',
    slack: 'https://api.slack.com/apps',
    telegram: 'https://t.me/BotFather',
    twilio: 'https://console.twilio.com',
    sendgrid: 'https://app.sendgrid.com/settings/api_keys',
    gmail: 'https://console.cloud.google.com/apis/credentials',
    'google-sheets': 'https://console.cloud.google.com/iam-admin/serviceaccounts',
    'google-calendar': 'https://console.cloud.google.com/apis/credentials',
    'google-drive': 'https://console.cloud.google.com/iam-admin/serviceaccounts',
    notion: 'https://www.notion.so/my-integrations',
    airtable: 'https://airtable.com/create/tokens',
    'cal-com': 'https://app.cal.com/settings/developer/api-keys',
    discord: 'https://discord.com/developers/applications',
    github: 'https://github.com/settings/tokens',
    jira: 'https://id.atlassian.com/manage-profile/security/api-tokens',
    'aws-s3': 'https://console.aws.amazon.com/iam/home#/security_credentials',
    mongodb: 'https://cloud.mongodb.com',
    whatsapp: 'https://developers.facebook.com/apps',
};

// ── Step definitions ──────────────────────────────────────────────────────────
// Step 0 = choose operation
// Step 1 = fill credentials (grouped into pages of 3 fields each)
type Step = 'operation' | 'credentials' | 'done';

interface NodeConfigPanelProps {
    node: WorkflowNode;
    onSave: (node: WorkflowNode) => void;
    onClose: () => void;
}

export default function NodeConfigPanel({ node, onSave, onClose }: NodeConfigPanelProps) {
    const integration = getIntegration(node.integrationId);

    const [step, setStep] = useState<Step>(
        integration?.operations && integration.operations.length > 1 ? 'operation' : 'credentials'
    );
    const [operation, setOperation] = useState(node.operation || integration?.operations?.[0] || '');
    const [creds, setCreds] = useState<Record<string, string>>({ ...node.credentials });
    const [showFields, setShowFields] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);

    if (!integration) return null;

    const fields = integration.credentialFields;
    const docsUrl = DOCS_LINKS[node.integrationId];
    const requiredFields = fields.filter((f) => f.required);
    const optionalFields = fields.filter((f) => !f.required);
    const allConfigured = requiredFields.every((f) => creds[f.key]?.trim());

    const validate = () => {
        const errs: Record<string, string> = {};
        requiredFields.forEach((f) => {
            if (!creds[f.key]?.trim()) errs[f.key] = 'Required';
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const updated: WorkflowNode = { ...node, credentials: creds, operation, configured: true };
        onSave(updated);
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 900);
    };

    const progressPct = step === 'operation' ? 33 : step === 'credentials' ? 66 : 100;

    return (
        <motion.div
            key="node-config-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-screen w-[420px] bg-[#0a0e1f] border-l border-white/[0.07] flex flex-col z-[60] shadow-2xl"
        >
            {/* Progress bar */}
            <div className="h-0.5 w-full bg-white/[0.05]">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            {/* Header */}
            <div
                className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]"
                style={{ background: `linear-gradient(135deg, ${integration.color}10, transparent 60%)` }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${integration.color}20`, border: `1px solid ${integration.color}35` }}
                    >
                        <span style={{ color: integration.color }}>{getIcon(integration.iconName)}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-100">{integration.name}</h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5 capitalize">{integration.category} · {node.type}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {docsUrl && (
                        <a
                            href={docsUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
                        >
                            <ExternalLink size={11} /> Docs
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-0 px-5 py-3 border-b border-white/[0.04]">
                {[
                    { id: 'operation', label: 'Operation', icon: <Settings2 size={11} /> },
                    { id: 'credentials', label: 'Credentials', icon: <Key size={11} /> },
                    { id: 'done', label: 'Connected', icon: <Link2 size={11} /> },
                ].map((s, i) => {
                    const isActive = step === s.id;
                    const isDone =
                        (s.id === 'operation' && (step === 'credentials' || step === 'done')) ||
                        (s.id === 'credentials' && step === 'done');
                    return (
                        <React.Fragment key={s.id}>
                            <div className="flex items-center gap-1.5">
                                <div className={cn(
                                    'w-5 h-5 rounded-full flex items-center justify-center transition-all',
                                    isDone ? 'bg-emerald-500/20 text-emerald-400' :
                                        isActive ? 'bg-cyan-500/20 text-cyan-400' :
                                            'bg-white/[0.04] text-zinc-600'
                                )}>
                                    {isDone ? <CheckCircle2 size={11} /> : s.icon}
                                </div>
                                <span className={cn(
                                    'text-[10px] font-semibold uppercase tracking-wider transition-colors',
                                    isActive ? 'text-zinc-200' : isDone ? 'text-emerald-400' : 'text-zinc-600'
                                )}>
                                    {s.label}
                                </span>
                            </div>
                            {i < 2 && <div className="flex-1 h-px bg-white/[0.05] mx-2" />}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">

                {/* ── STEP: Operation ── */}
                {step === 'operation' && integration.operations && (
                    <div className="px-5 py-5 space-y-3">
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-zinc-100 mb-1">What should this node do?</h4>
                            <p className="text-[11px] text-zinc-500">Choose the operation for this {integration.name} node.</p>
                        </div>
                        {integration.operations.map((op) => (
                            <button
                                key={op}
                                onClick={() => setOperation(op)}
                                className={cn(
                                    'w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all',
                                    operation === op
                                        ? 'border-cyan-500/40 bg-cyan-500/10 text-zinc-100'
                                        : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] text-zinc-400'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'w-2 h-2 rounded-full transition-colors',
                                        operation === op ? 'bg-cyan-400' : 'bg-zinc-700'
                                    )} />
                                    <span className="text-sm font-medium">{op}</span>
                                </div>
                                {operation === op && <CheckCircle2 size={14} className="text-cyan-400" />}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── STEP: Credentials ── */}
                {step === 'credentials' && (
                    <div className="px-5 py-5 space-y-5">
                        <div className="mb-2">
                            <h4 className="text-sm font-bold text-zinc-100 mb-1">Connect {integration.name}</h4>
                            <p className="text-[11px] text-zinc-500">
                                Fill in your credentials. Required fields are marked with <span className="text-red-400">*</span>
                            </p>
                        </div>

                        {/* Required fields section */}
                        {requiredFields.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-white/[0.05]" />
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-600">Required</span>
                                    <div className="h-px flex-1 bg-white/[0.05]" />
                                </div>
                                {requiredFields.map((field) => (
                                    <React.Fragment key={field.key}>
                                        <FieldInput
                                            field={field}
                                            value={creds[field.key] || ''}
                                            error={errors[field.key]}
                                            showValue={showFields[field.key] || false}
                                            onToggleShow={() => setShowFields((p: Record<string, boolean>) => ({ ...p, [field.key]: !p[field.key] }))}
                                            onChange={(val: string) => {
                                                setCreds((p: Record<string, string>) => ({ ...p, [field.key]: val }));
                                                if (errors[field.key]) setErrors((p: Record<string, string>) => ({ ...p, [field.key]: '' }));
                                            }}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* Optional fields section */}
                        {optionalFields.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-white/[0.05]" />
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-600">Optional</span>
                                    <div className="h-px flex-1 bg-white/[0.05]" />
                                </div>
                                {optionalFields.map((field) => (
                                    <React.Fragment key={field.key}>
                                        <FieldInput
                                            field={field}
                                            value={creds[field.key] || ''}
                                            error={errors[field.key]}
                                            showValue={showFields[field.key] || false}
                                            onToggleShow={() => setShowFields((p: Record<string, boolean>) => ({ ...p, [field.key]: !p[field.key] }))}
                                            onChange={(val: string) => setCreds((p: Record<string, string>) => ({ ...p, [field.key]: val }))}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* Error summary */}
                        {Object.keys(errors).length > 0 && (
                            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px]">
                                <AlertCircle size={13} />
                                Fill in all required fields to continue
                            </div>
                        )}

                        {/* Docs link */}
                        {docsUrl && (
                            <a
                                href={docsUrl} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-cyan-400 transition-colors"
                            >
                                <ExternalLink size={12} />
                                Where do I find my {integration.name} credentials?
                            </a>
                        )}
                    </div>
                )}

                {/* ── STEP: Done ── */}
                {step === 'done' && (
                    <div className="flex flex-col items-center justify-center h-full py-16 px-5 text-center gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: `${integration.color}20`, border: `1px solid ${integration.color}40` }}
                        >
                            <CheckCircle2 size={32} style={{ color: integration.color }} />
                        </motion.div>
                        <div>
                            <h4 className="text-base font-bold text-zinc-100">{integration.name} connected</h4>
                            <p className="text-[12px] text-zinc-500 mt-1">
                                This node is configured and ready to run.
                            </p>
                        </div>
                        <div className="w-full mt-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-left space-y-2">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-2">Summary</p>
                            {operation && (
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-zinc-500">Operation</span>
                                    <span className="text-zinc-200 font-semibold">{operation}</span>
                                </div>
                            )}
                            {requiredFields.map((f) => creds[f.key] && (
                                <div key={f.key} className="flex items-center justify-between text-[11px]">
                                    <span className="text-zinc-500">{f.label}</span>
                                    <span className="text-emerald-400 font-mono">
                                        {f.type === 'password' ? '••••••••' : creds[f.key].slice(0, 20) + (creds[f.key].length > 20 ? '…' : '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer nav */}
            <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                {/* Back */}
                <button
                    onClick={() => {
                        if (step === 'credentials') {
                            if (integration.operations && integration.operations.length > 1) setStep('operation');
                            else onClose();
                        } else if (step === 'done') {
                            setStep('credentials');
                        } else {
                            onClose();
                        }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.08] text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={14} />
                    {step === 'operation' ? 'Cancel' : 'Back'}
                </button>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5">
                    {['operation', 'credentials', 'done'].map((s) => (
                        <div key={s} className={cn(
                            'rounded-full transition-all',
                            step === s ? 'w-4 h-1.5 bg-cyan-400' : 'w-1.5 h-1.5 bg-zinc-700'
                        )} />
                    ))}
                </div>

                {/* Next / Save */}
                {step === 'operation' && (
                    <button
                        onClick={() => setStep('credentials')}
                        disabled={!operation}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next <ArrowRight size={14} />
                    </button>
                )}

                {step === 'credentials' && (
                    <button
                        onClick={() => {
                            if (!validate()) return;
                            setStep('done');
                        }}
                        disabled={!allConfigured}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Review <ArrowRight size={14} />
                    </button>
                )}

                {step === 'done' && (
                    <button
                        onClick={handleSave}
                        className={cn(
                            'flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all',
                            saved ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        )}
                    >
                        {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Link2 size={14} /> Save & Activate</>}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// ── Field input component ─────────────────────────────────────────────────────
function FieldInput({
    field, value, error, showValue, onToggleShow, onChange,
}: {
    field: CredentialField;
    value: string;
    error?: string;
    showValue: boolean;
    onToggleShow: () => void;
    onChange: (v: string) => void;
}) {
    const isSecret = field.type === 'password';
    const inputType = isSecret ? (showValue ? 'text' : 'password') : field.type === 'url' ? 'url' : 'text';

    return (
        <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
                <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {field.hint && (
                    <span className="text-[10px] text-zinc-600 text-right leading-tight max-w-[180px]">{field.hint}</span>
                )}
            </div>

            {field.type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className={cn(
                        'w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-[12px] text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors resize-none font-mono',
                        error ? 'border-red-500/40 focus:border-red-500/60' : 'border-white/[0.08] focus:border-cyan-500/40'
                    )}
                />
            ) : field.type === 'select' ? (
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(
                            'w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors appearance-none',
                            error ? 'border-red-500/40' : 'border-white/[0.08] focus:border-cyan-500/40'
                        )}
                    >
                        <option value="" className="bg-[#0a0e1f]">Select…</option>
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0a0e1f]">{opt}</option>
                        ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
            ) : (
                <div className="relative">
                    <input
                        type={inputType}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        autoComplete="off"
                        className={cn(
                            'w-full bg-white/[0.04] border rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors',
                            isSecret ? 'pr-10 font-mono tracking-wider' : '',
                            error ? 'border-red-500/40 focus:border-red-500/60' : 'border-white/[0.08] focus:border-cyan-500/40'
                        )}
                    />
                    {isSecret && (
                        <button
                            type="button" onClick={onToggleShow}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            {showValue ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                    )}
                </div>
            )}

            {error && (
                <p className="flex items-center gap-1 text-[10px] text-red-400">
                    <AlertCircle size={10} /> {error}
                </p>
            )}
        </div>
    );
}
