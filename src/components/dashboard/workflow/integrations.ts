import type { IntegrationDef } from './types';

export const INTEGRATIONS: IntegrationDef[] = [
    {
        id: 'webhook', name: 'Webhook', description: 'Receive HTTP requests to start a workflow',
        category: 'Core', color: '#f59e0b', iconName: 'Webhook', badge: 'Popular',
        defaultNodeType: 'trigger',
        operations: ['Listen for Events'],
        credentialFields: [
            { key: 'path', label: 'Webhook Path', type: 'text', placeholder: '/my-webhook', required: true, hint: 'Unique path for this webhook endpoint' },
            { key: 'method', label: 'HTTP Method', type: 'select', options: ['POST', 'GET', 'PUT', 'PATCH'], required: true },
            { key: 'auth_header', label: 'Auth Header (optional)', type: 'password', placeholder: 'Bearer token to validate incoming requests' },
        ],
    },
    {
        id: 'http', name: 'HTTP Request', description: 'Make any HTTP/REST API call',
        category: 'Core', color: '#64748b', iconName: 'Globe', badge: 'Popular',
        defaultNodeType: 'action',
        operations: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentialFields: [
            { key: 'url', label: 'URL', type: 'url', placeholder: 'https://api.example.com/endpoint', required: true },
            { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], required: true },
            { key: 'auth_type', label: 'Auth Type', type: 'select', options: ['None', 'Bearer Token', 'Basic Auth', 'API Key'] },
            { key: 'auth_value', label: 'Auth Value', type: 'password', placeholder: 'Token or credentials' },
            { key: 'body', label: 'Request Body (JSON)', type: 'textarea', placeholder: '{"key": "value"}' },
        ],
    },
    {
        id: 'openai', name: 'OpenAI', description: 'GPT-4, DALL·E, Whisper & Embeddings',
        category: 'AI', color: '#10a37f', iconName: 'Bot', badge: 'Popular',
        defaultNodeType: 'action',
        operations: ['Chat Completion', 'Text Completion', 'Generate Image', 'Transcribe Audio', 'Create Embedding'],
        credentialFields: [
            { key: 'api_key', label: 'OpenAI API Key', type: 'password', placeholder: 'sk-...', required: true, hint: 'Get from platform.openai.com/api-keys' },
            { key: 'model', label: 'Model', type: 'select', options: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'dall-e-3', 'whisper-1'], required: true },
            { key: 'system_prompt', label: 'System Prompt', type: 'textarea', placeholder: 'You are a helpful assistant...' },
            { key: 'temperature', label: 'Temperature (0–2)', type: 'text', placeholder: '0.7' },
        ],
    },
    {
        id: 'gemini', name: 'Google Gemini', description: 'Gemini 2.0 Flash & Pro models',
        category: 'AI', color: '#4285f4', iconName: 'Bot',
        defaultNodeType: 'action',
        operations: ['Generate Content', 'Chat', 'Analyze Image'],
        credentialFields: [
            { key: 'api_key', label: 'Gemini API Key', type: 'password', placeholder: 'AIza...', required: true, hint: 'Get from aistudio.google.com' },
            { key: 'model', label: 'Model', type: 'select', options: ['gemini-2.0-flash-001', 'gemini-1.5-pro', 'gemini-1.5-flash'], required: true },
            { key: 'system_prompt', label: 'System Prompt', type: 'textarea', placeholder: 'You are...' },
        ],
    },
    {
        id: 'anthropic', name: 'Anthropic', description: 'Claude 3.5 Sonnet & Haiku',
        category: 'AI', color: '#d97706', iconName: 'Bot',
        defaultNodeType: 'action',
        operations: ['Message', 'Complete'],
        credentialFields: [
            { key: 'api_key', label: 'Anthropic API Key', type: 'password', placeholder: 'sk-ant-...', required: true },
            { key: 'model', label: 'Model', type: 'select', options: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'] },
            { key: 'max_tokens', label: 'Max Tokens', type: 'text', placeholder: '1024' },
        ],
    },
    {
        id: 'elevenlabs', name: 'ElevenLabs', description: 'AI voice synthesis & cloning',
        category: 'AI', color: '#06b6d4', iconName: 'Mic',
        defaultNodeType: 'action',
        operations: ['Text to Speech', 'Clone Voice', 'List Voices'],
        credentialFields: [
            { key: 'api_key', label: 'ElevenLabs API Key', type: 'password', placeholder: 'xi-api-key...', required: true, hint: 'Get from elevenlabs.io/app/settings' },
            { key: 'voice_id', label: 'Voice ID', type: 'text', placeholder: '21m00Tcm4TlvDq8ikWAM', required: true },
            { key: 'model_id', label: 'Model', type: 'select', options: ['eleven_multilingual_v2', 'eleven_turbo_v2', 'eleven_monolingual_v1'] },
        ],
    },
    {
        id: 'supabase', name: 'Supabase', description: 'Read/write your Supabase database',
        category: 'Database', color: '#3ecf8e', iconName: 'Database',
        defaultNodeType: 'action',
        operations: ['Insert Row', 'Select Rows', 'Update Row', 'Delete Row', 'RPC Call'],
        credentialFields: [
            { key: 'url', label: 'Supabase URL', type: 'url', placeholder: 'https://xxx.supabase.co', required: true },
            { key: 'service_key', label: 'Service Role Key', type: 'password', placeholder: 'eyJ...', required: true, hint: 'Use service_role key for server-side operations' },
            { key: 'table', label: 'Table Name', type: 'text', placeholder: 'contacts', required: true },
        ],
    },
    {
        id: 'postgres', name: 'PostgreSQL', description: 'Execute SQL on any Postgres DB',
        category: 'Database', color: '#336791', iconName: 'Database',
        defaultNodeType: 'action',
        operations: ['Execute Query', 'Insert', 'Update', 'Delete'],
        credentialFields: [
            { key: 'host', label: 'Host', type: 'text', placeholder: 'db.example.com', required: true },
            { key: 'port', label: 'Port', type: 'text', placeholder: '5432' },
            { key: 'database', label: 'Database', type: 'text', placeholder: 'mydb', required: true },
            { key: 'user', label: 'Username', type: 'text', placeholder: 'postgres', required: true },
            { key: 'password', label: 'Password', type: 'password', required: true },
            { key: 'query', label: 'SQL Query', type: 'textarea', placeholder: 'SELECT * FROM users WHERE id = $1' },
        ],
    },
    {
        id: 'gmail', name: 'Gmail', description: 'Send & receive emails via Gmail API',
        category: 'Email', color: '#ea4335', iconName: 'Mail', badge: 'Popular',
        defaultNodeType: 'action',
        operations: ['Send Email', 'Get Emails', 'Reply to Email', 'Add Label'],
        credentialFields: [
            { key: 'client_id', label: 'OAuth Client ID', type: 'text', placeholder: 'xxx.apps.googleusercontent.com', required: true, hint: 'Create at console.cloud.google.com' },
            { key: 'client_secret', label: 'OAuth Client Secret', type: 'password', required: true },
            { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
            { key: 'from', label: 'From Email', type: 'text', placeholder: 'you@gmail.com' },
        ],
    },
    {
        id: 'sendgrid', name: 'SendGrid', description: 'Transactional & marketing email',
        category: 'Email', color: '#1a82e2', iconName: 'Mail',
        defaultNodeType: 'action',
        operations: ['Send Email', 'Send Template', 'Add Contact'],
        credentialFields: [
            { key: 'api_key', label: 'SendGrid API Key', type: 'password', placeholder: 'SG.xxx', required: true, hint: 'Get from app.sendgrid.com/settings/api_keys' },
            { key: 'from_email', label: 'From Email', type: 'text', placeholder: 'noreply@yourdomain.com', required: true },
            { key: 'from_name', label: 'From Name', type: 'text', placeholder: 'AIWave Agency' },
        ],
    },
    {
        id: 'slack', name: 'Slack', description: 'Send messages & manage channels',
        category: 'Communication', color: '#4a154b', iconName: 'MessageSquare', badge: 'Popular',
        defaultNodeType: 'action',
        operations: ['Send Message', 'Send DM', 'Create Channel', 'Get Channel History'],
        credentialFields: [
            { key: 'bot_token', label: 'Bot Token', type: 'password', placeholder: 'xoxb-...', required: true, hint: 'Get from api.slack.com/apps → OAuth & Permissions' },
            { key: 'channel', label: 'Default Channel', type: 'text', placeholder: '#general or channel ID' },
        ],
    },
    {
        id: 'telegram', name: 'Telegram', description: 'Send messages via Telegram Bot API',
        category: 'Communication', color: '#0088cc', iconName: 'MessageSquare', badge: 'Popular',
        defaultNodeType: 'action',
        operations: ['Send Message', 'Send Photo', 'Send Document', 'Answer Callback'],
        credentialFields: [
            { key: 'bot_token', label: 'Bot Token', type: 'password', placeholder: '123456:ABC-DEF...', required: true, hint: 'Get from @BotFather on Telegram' },
            { key: 'chat_id', label: 'Default Chat ID', type: 'text', placeholder: '-100123456789 or @username' },
        ],
    },
    {
        id: 'twilio', name: 'Twilio', description: 'SMS, voice calls & WhatsApp',
        category: 'Communication', color: '#f22f46', iconName: 'Phone',
        defaultNodeType: 'action',
        operations: ['Send SMS', 'Make Call', 'Send WhatsApp', 'Get Call Logs'],
        credentialFields: [
            { key: 'account_sid', label: 'Account SID', type: 'text', placeholder: 'ACxxxxxxxx', required: true, hint: 'Get from console.twilio.com' },
            { key: 'auth_token', label: 'Auth Token', type: 'password', required: true },
            { key: 'from_number', label: 'From Phone Number', type: 'text', placeholder: '+15551234567', required: true },
        ],
    },
    {
        id: 'google-sheets', name: 'Google Sheets', description: 'Read & write spreadsheet data',
        category: 'Productivity', color: '#34a853', iconName: 'FileSpreadsheet', badge: 'Popular',
        defaultNodeType: 'action',
        operations: ['Append Row', 'Read Rows', 'Update Row', 'Clear Sheet', 'Create Sheet'],
        credentialFields: [
            { key: 'service_account_json', label: 'Service Account JSON', type: 'textarea', placeholder: '{"type":"service_account",...}', required: true, hint: 'Download from Google Cloud Console → IAM → Service Accounts' },
            { key: 'spreadsheet_id', label: 'Spreadsheet ID', type: 'text', placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', required: true },
            { key: 'sheet_name', label: 'Sheet Name', type: 'text', placeholder: 'Sheet1' },
        ],
    },
    {
        id: 'notion', name: 'Notion', description: 'Create & update Notion pages and DBs',
        category: 'Productivity', color: '#ffffff', iconName: 'LayoutGrid',
        defaultNodeType: 'action',
        operations: ['Create Page', 'Update Page', 'Query Database', 'Get Page'],
        credentialFields: [
            { key: 'api_key', label: 'Integration Token', type: 'password', placeholder: 'secret_...', required: true, hint: 'Create at notion.so/my-integrations' },
            { key: 'database_id', label: 'Database ID', type: 'text', placeholder: '32-char UUID from Notion URL' },
        ],
    },
    {
        id: 'airtable', name: 'Airtable', description: 'Read/write Airtable bases',
        category: 'Productivity', color: '#fcb400', iconName: 'LayoutGrid',
        defaultNodeType: 'action',
        operations: ['List Records', 'Create Record', 'Update Record', 'Delete Record'],
        credentialFields: [
            { key: 'api_key', label: 'Personal Access Token', type: 'password', placeholder: 'pat...', required: true, hint: 'Get from airtable.com/create/tokens' },
            { key: 'base_id', label: 'Base ID', type: 'text', placeholder: 'appXXXXXXXXXXXXXX', required: true },
            { key: 'table_name', label: 'Table Name', type: 'text', placeholder: 'Contacts', required: true },
        ],
    },
    {
        id: 'google-calendar', name: 'Google Calendar', description: 'Create & manage calendar events',
        category: 'Productivity', color: '#4285f4', iconName: 'Calendar',
        defaultNodeType: 'action',
        operations: ['Create Event', 'Get Events', 'Update Event', 'Delete Event'],
        credentialFields: [
            { key: 'client_id', label: 'OAuth Client ID', type: 'text', required: true },
            { key: 'client_secret', label: 'OAuth Client Secret', type: 'password', required: true },
            { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
            { key: 'calendar_id', label: 'Calendar ID', type: 'text', placeholder: 'primary or calendar@group.calendar.google.com' },
        ],
    },
    {
        id: 'cal-com', name: 'Cal.com', description: 'Booking & scheduling automation',
        category: 'Productivity', color: '#292929', iconName: 'Calendar',
        defaultNodeType: 'trigger',
        operations: ['Booking Created', 'Booking Cancelled', 'Booking Rescheduled'],
        credentialFields: [
            { key: 'api_key', label: 'Cal.com API Key', type: 'password', placeholder: 'cal_live_...', required: true, hint: 'Get from cal.com/settings/developer/api-keys' },
            { key: 'event_type_id', label: 'Event Type ID', type: 'text', placeholder: '123456' },
        ],
    },
    {
        id: 'discord', name: 'Discord', description: 'Send messages to Discord channels',
        category: 'Communication', color: '#5865f2', iconName: 'MessageSquare',
        defaultNodeType: 'action',
        operations: ['Send Message', 'Send Embed', 'Create Channel'],
        credentialFields: [
            { key: 'bot_token', label: 'Bot Token', type: 'password', placeholder: 'MTxxxxxxxx.xxx', required: true, hint: 'Get from discord.com/developers/applications' },
            { key: 'channel_id', label: 'Channel ID', type: 'text', placeholder: '1234567890', required: true },
        ],
    },
    {
        id: 'github', name: 'GitHub', description: 'Automate repos, issues & PRs',
        category: 'Dev', color: '#e2e8f0', iconName: 'GitBranch',
        defaultNodeType: 'action',
        operations: ['Create Issue', 'Create PR', 'Get Repo', 'Trigger Workflow'],
        credentialFields: [
            { key: 'access_token', label: 'Personal Access Token', type: 'password', placeholder: 'ghp_...', required: true, hint: 'Get from github.com/settings/tokens' },
            { key: 'owner', label: 'Repo Owner', type: 'text', placeholder: 'your-username', required: true },
            { key: 'repo', label: 'Repository', type: 'text', placeholder: 'my-repo', required: true },
        ],
    },
    {
        id: 'aws-s3', name: 'AWS S3', description: 'Upload, download & manage S3 objects',
        category: 'Cloud', color: '#ff9900', iconName: 'Database',
        defaultNodeType: 'action',
        operations: ['Upload File', 'Download File', 'List Objects', 'Delete Object'],
        credentialFields: [
            { key: 'access_key_id', label: 'Access Key ID', type: 'text', placeholder: 'AKIAIOSFODNN7EXAMPLE', required: true },
            { key: 'secret_access_key', label: 'Secret Access Key', type: 'password', required: true },
            { key: 'region', label: 'Region', type: 'text', placeholder: 'us-east-1', required: true },
            { key: 'bucket', label: 'Bucket Name', type: 'text', placeholder: 'my-bucket', required: true },
        ],
    },
    {
        id: 'mongodb', name: 'MongoDB', description: 'Query & write MongoDB collections',
        category: 'Database', color: '#47a248', iconName: 'Database',
        defaultNodeType: 'action',
        operations: ['Find Documents', 'Insert Document', 'Update Document', 'Delete Document'],
        credentialFields: [
            { key: 'connection_string', label: 'Connection String', type: 'password', placeholder: 'mongodb+srv://user:pass@cluster.mongodb.net', required: true },
            { key: 'database', label: 'Database Name', type: 'text', placeholder: 'mydb', required: true },
            { key: 'collection', label: 'Collection', type: 'text', placeholder: 'users', required: true },
        ],
    },
    {
        id: 'redis', name: 'Redis', description: 'Get/set keys in Redis',
        category: 'Database', color: '#dc382d', iconName: 'Database',
        defaultNodeType: 'action',
        operations: ['Get', 'Set', 'Delete', 'Publish', 'Subscribe'],
        credentialFields: [
            { key: 'host', label: 'Host', type: 'text', placeholder: 'redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com', required: true },
            { key: 'port', label: 'Port', type: 'text', placeholder: '6379' },
            { key: 'password', label: 'Password', type: 'password' },
            { key: 'tls', label: 'Use TLS', type: 'select', options: ['Yes', 'No'] },
        ],
    },
    {
        id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp Business Cloud API',
        category: 'Communication', color: '#25d366', iconName: 'MessageSquare',
        defaultNodeType: 'action',
        operations: ['Send Text', 'Send Template', 'Send Media'],
        credentialFields: [
            { key: 'access_token', label: 'Permanent Access Token', type: 'password', placeholder: 'EAAxxxxx', required: true, hint: 'Get from Meta Business Suite → WhatsApp → API Setup' },
            { key: 'phone_number_id', label: 'Phone Number ID', type: 'text', placeholder: '123456789012345', required: true },
            { key: 'business_account_id', label: 'Business Account ID', type: 'text', placeholder: '987654321' },
        ],
    },
    {
        id: 'n8n-ai-agent', name: 'AI Agent', description: 'Autonomous AI agent with tools',
        category: 'AI', color: '#a855f7', iconName: 'Bot', badge: 'Popular',
        defaultNodeType: 'action',
        operations: ['Run Agent', 'Chat with Agent'],
        credentialFields: [
            { key: 'llm_provider', label: 'LLM Provider', type: 'select', options: ['OpenAI', 'Anthropic', 'Google Gemini'], required: true },
            { key: 'api_key', label: 'LLM API Key', type: 'password', required: true },
            { key: 'system_prompt', label: 'Agent System Prompt', type: 'textarea', placeholder: 'You are a helpful agent that...', required: true },
            { key: 'tools', label: 'Enabled Tools (comma-separated)', type: 'text', placeholder: 'web_search, calculator, code_interpreter' },
        ],
    },
    {
        id: 'jira', name: 'Jira', description: 'Create & manage Jira issues',
        category: 'Dev', color: '#0052cc', iconName: 'GitBranch',
        defaultNodeType: 'action',
        operations: ['Create Issue', 'Update Issue', 'Get Issue', 'Add Comment'],
        credentialFields: [
            { key: 'domain', label: 'Jira Domain', type: 'url', placeholder: 'https://yourcompany.atlassian.net', required: true },
            { key: 'email', label: 'Account Email', type: 'text', placeholder: 'you@company.com', required: true },
            { key: 'api_token', label: 'API Token', type: 'password', required: true, hint: 'Get from id.atlassian.com/manage-profile/security/api-tokens' },
            { key: 'project_key', label: 'Project Key', type: 'text', placeholder: 'PROJ' },
        ],
    },
    {
        id: 'google-drive', name: 'Google Drive', description: 'Upload, download & manage Drive files',
        category: 'Cloud', color: '#4285f4', iconName: 'Database',
        defaultNodeType: 'action',
        operations: ['Upload File', 'Download File', 'List Files', 'Create Folder'],
        credentialFields: [
            { key: 'service_account_json', label: 'Service Account JSON', type: 'textarea', placeholder: '{"type":"service_account",...}', required: true },
            { key: 'folder_id', label: 'Default Folder ID', type: 'text', placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
        ],
    },
];

export const CATEGORIES = [
    'All', 'AI', 'Core', 'Database', 'Email',
    'Productivity', 'Communication', 'Dev', 'Cloud',
];

export function getIntegration(id: string): IntegrationDef | undefined {
    return INTEGRATIONS.find((i) => i.id === id);
}
