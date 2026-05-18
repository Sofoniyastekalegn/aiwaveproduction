/**
 * n8nService handles communication with n8n workflow webhooks.
 * This allows the AI Agency to trigger complex automations (GHL, Slack, CRM)
 * directly from the agent interactions.
 */

export interface n8nPayload {
  agentId: string;
  eventType: 'call_ended' | 'lead_captured' | 'booking_confirmed';
  data: any;
}

export async function triggerN8nWorkflow(payload: n8nPayload) {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('n8n Webhook URL not configured. Skipping workflow trigger.');
    return { success: false, reason: 'unconfigured' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to trigger n8n workflow:', error);
    return { success: false, error };
  }
}
