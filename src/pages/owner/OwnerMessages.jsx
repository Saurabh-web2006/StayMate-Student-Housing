import { useEffect, useMemo, useState } from "react";
import { getMessagingContacts, getStudentMessages, sendStudentMessage } from "../utils/studentAuth";
import "../components/Messages.css";

export default function OwnerMessages({ accountId, ownerName }) {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!accountId) return undefined;
    let current = true;
    const refresh = async () => {
      try {
        const [nextMessages, nextContacts] = await Promise.all([getStudentMessages(accountId), getMessagingContacts()]);
        if (!current) return;
        setMessages(nextMessages);
        setContacts(nextContacts.filter((person) => person.id !== accountId));
        setError("");
      } catch (loadError) {
        if (current) setError(loadError.message || "Could not load messages.");
      }
    };
    void refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => { current = false; window.clearInterval(timer); };
  }, [accountId]);

  const conversationIds = useMemo(() => [...new Set(messages.map((item) => item.senderId === accountId ? item.recipientId : item.senderId))], [messages, accountId]);
  const people = conversationIds.map((id) => contacts.find((contact) => contact.id === id) || { id, name: "Student" });
  const availableStudents = contacts.filter((person) => person.role === "student" && !conversationIds.includes(person.id));
  const activePerson = people.find((person) => person.id === activeId) || null;
  const activeMessages = activeId ? messages.filter((item) => (item.senderId === accountId && item.recipientId === activeId) || (item.senderId === activeId && item.recipientId === accountId)) : [];

  const send = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !activeId || sending) return;
    setSending(true);
    setError("");
    try {
      const sent = await sendStudentMessage(accountId, activeId, draft);
      setMessages((current) => [...current, sent]);
      setDraft("");
    } catch (sendError) { setError(sendError.message || "Could not send your message."); }
    finally { setSending(false); }
  };

  return (
    <section className="owner-panel">
      <div className="owner-panel-heading"><div><p className="owner-eyebrow">STUDENT CONVERSATIONS</p><h2>Messages</h2><p className="owner-muted">Reply to students who contact you about your property.</p></div></div>
      {error && <p className="messages-error" role="alert">{error}</p>}
      {!accountId ? <div className="owner-empty"><h3>Messages are unavailable</h3><p>Sign out and back in to refresh your owner account.</p></div> : (
        <div className="chat-layout owner-chat-layout">
          <aside className="conversation-list">
            <div className="conversation-heading"><h2>Conversations</h2><span>{people.length}</span></div>
            {people.length ? people.map((person) => (
              <button className={`conversation-item ${activeId === person.id ? "active" : ""}`} key={person.id} onClick={() => setActiveId(person.id)} type="button">
                <div className="conversation-avatar"><span>{(person.name || "S").slice(0, 1).toUpperCase()}</span></div>
                <div className="conversation-info"><strong>{person.name}</strong><span>{messages.filter((item) => item.senderId === person.id || item.recipientId === person.id).at(-1)?.text || "Start a conversation"}</span></div>
              </button>
            )) : <div className="no-conversations"><div>💬</div><h3>No messages yet</h3><p>Customer messages about your PGs will appear here.</p></div>}
            {availableStudents.length > 0 && <>
              <div className="conversation-heading"><h2>Students</h2><span>{availableStudents.length}</span></div>
              {availableStudents.map((person) => <button className={`conversation-item ${activeId === person.id ? "active" : ""}`} key={person.id} onClick={() => setActiveId(person.id)} type="button"><div className="conversation-avatar"><span>{(person.name || "S").slice(0, 1).toUpperCase()}</span></div><div className="conversation-info"><strong>{person.name}</strong><span>Start a conversation</span></div></button>)}
            </>}
          </aside>
          <section className="chat-area">
            {activePerson ? <>
              <header className="chat-header"><div className="chat-person"><div className="chat-person-avatar"><span>{(activePerson.name || "S").slice(0, 1).toUpperCase()}</span></div><div><h2>{activePerson.name}</h2><p>Customer conversation · {ownerName || "Property owner"}</p></div></div></header>
              <div className="chat-messages">{activeMessages.map((item) => <div className={`message-row ${item.senderId === accountId ? "my-message" : "their-message"}`} key={item.id}><div className="message-bubble"><p>{item.text}</p><span>{new Date(item.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div></div>)}</div>
              <form className="message-input-area" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${activePerson.name}...`} maxLength={2000} disabled={sending} /><button type="submit" disabled={!draft.trim() || sending}>{sending ? "Sending…" : "Send →"}</button></form>
            </> : <div className="select-chat"><div>💬</div><h2>Select a conversation</h2><p>Choose a customer conversation to read and reply.</p></div>}
          </section>
        </div>
      )}
    </section>
  );
}
