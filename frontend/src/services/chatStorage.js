/**
 * Anonymous Chat Storage Layer.
 * Fintrix AI is a public demo fintech intelligence platform without user accounts.
 * Provides anonymous browser-level session IDs, persistent chat history via LocalStorage,
 * new chat creation, conversation switching, and deletion.
 */

const ANON_SESSION_KEY = 'fintrix_anon_session_id';
const LOCAL_CONVERSATIONS_KEY = 'fintrix_conversations_v1';

/**
 * Retrieves or generates an anonymous cryptographic browser session ID.
 * Never stores or uses PII, Aadhaar, PAN, name, or credentials.
 */
export function getAnonymousSessionId() {
  let sessionId = localStorage.getItem(ANON_SESSION_KEY);
  if (!sessionId || !sessionId.trim()) {
    const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    sessionId = `fintrix_anon_${randomPart}`;
    localStorage.setItem(ANON_SESSION_KEY, sessionId);
  }
  return sessionId;
}

// ----------------------------------------------------------------------
// LocalStorage Helpers
// ----------------------------------------------------------------------
function getLocalConversations() {
  try {
    const raw = localStorage.getItem(LOCAL_CONVERSATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse local conversations:', e);
    return [];
  }
}

function saveLocalConversations(list) {
  try {
    localStorage.setItem(LOCAL_CONVERSATIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save local conversations:', e);
  }
}

// ----------------------------------------------------------------------
// Public Storage API
// ----------------------------------------------------------------------

/**
 * Fetch all conversations for the current anonymous browser session.
 */
export async function listConversations() {
  const sessionId = getAnonymousSessionId();
  const localList = getLocalConversations().filter((c) => c.sessionId === sessionId);
  return localList.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
}

/**
 * Create a new conversation and persist it.
 */
export async function createConversation(initialTitle = 'New Analysis') {
  const sessionId = getAnonymousSessionId();
  const convId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  const convData = {
    id: convId,
    conversationId: convId,
    sessionId: sessionId,
    title: initialTitle,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };

  const localList = getLocalConversations();
  localList.unshift(convData);
  saveLocalConversations(localList);

  return convData;
}

/**
 * Save a message into a conversation.
 */
export async function saveMessageToConversation(conversationId, message) {
  if (!conversationId) return;

  const now = new Date().toISOString();
  const msgObj = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    role: message.role || 'user',
    content: message.content || '',
    timestamp: message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    responseType: message.responseType || 'text',
    toolsUsed: message.toolsUsed || [],
    llmMode: message.llmMode || 'mock',
    data: message.data || null,
    isError: Boolean(message.isError),
    processingTimeMs: message.processingTimeMs || null,
    createdAt: now,
  };

  const localList = getLocalConversations();
  const idx = localList.findIndex((c) => c.id === conversationId || c.conversationId === conversationId);
  if (idx !== -1) {
    if (!localList[idx].messages) localList[idx].messages = [];
    localList[idx].messages.push(msgObj);
    localList[idx].updatedAt = now;

    // Auto-update title if it's currently default and user sent first message
    if (localList[idx].title === 'New Analysis' && message.role === 'user') {
      const summary = message.content.slice(0, 36) + (message.content.length > 36 ? '...' : '');
      localList[idx].title = summary;
    }
    saveLocalConversations(localList);
  }

  return msgObj;
}

/**
 * Load all messages belonging to a conversation.
 */
export async function loadConversationMessages(conversationId) {
  if (!conversationId) return [];

  const localList = getLocalConversations();
  const conv = localList.find((c) => c.id === conversationId || c.conversationId === conversationId);
  return conv && conv.messages ? conv.messages : [];
}

/**
 * Delete a conversation.
 */
export async function deleteConversation(conversationId) {
  if (!conversationId) return;

  const localList = getLocalConversations().filter(
    (c) => c.id !== conversationId && c.conversationId !== conversationId
  );
  saveLocalConversations(localList);
}
