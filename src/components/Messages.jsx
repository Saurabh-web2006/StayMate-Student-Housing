import { useEffect, useMemo, useState } from "react";
import "./Messages.css";

import Sidebar from "./Sidebar";
import { usePersistentState } from "../utils/usePersistentState";
import { getMessagingContacts, getStudentMessages, sendStudentMessage } from "../utils/studentAuth";
import defaultAvatar from "../assets/roommate1.jpg";

function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Messages({
  userName = "Student",
  onHome,
  onFindPGs,
  onRoommates,
  onSaved,
  onBookings,
  onNotifications,
  onProfile,
  onSettings,
  onLogout,
  selectedPerson,
  onChatOpened,
  accountId,
  persistenceKey = "staymate:guest",
}) {
  const [activeChat, setActiveChat] = usePersistentState(
    `${persistenceKey}:messages:activeChat`,
    selectedPerson || null,
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!selectedPerson) return;
    setActiveChat(selectedPerson);
    onChatOpened?.();
  }, [selectedPerson, setActiveChat, onChatOpened]);

  useEffect(() => {
    if (!accountId) {
      setLoadError("Please sign in again to use messages.");
      return undefined;
    }
    let isCurrent = true;
    const refresh = async () => {
      try {
        const [nextMessages, profiles] = await Promise.all([
          getStudentMessages(accountId),
          getMessagingContacts(),
        ]);
        if (!isCurrent) return;
        setMessages(nextMessages);
        setDirectory(profiles);
        setLoadError("");
      } catch (error) {
        if (isCurrent) setLoadError(error.message || "Could not load conversations.");
      }
    };
    void refresh();
    const intervalId = window.setInterval(refresh, 5000);
    return () => {
      isCurrent = false;
      window.clearInterval(intervalId);
    };
  }, [accountId]);

  const conversationIds = useMemo(() => [...new Set(messages.map((item) => (
    item.senderId === accountId ? item.recipientId : item.senderId
  )))], [accountId, messages]);

  const conversations = conversationIds.map((id) => {
    const person = directory.find((profile) => profile.id === id)
      || (activeChat?.id === id ? activeChat : { id, name: "Student", location: "" });
    const chatMessages = messages.filter((item) => (
      (item.senderId === accountId && item.recipientId === id)
      || (item.senderId === id && item.recipientId === accountId)
    ));
    return { id, person, messages: chatMessages };
  });

  const currentConversation = activeChat
    ? messages.filter((item) => (
      (item.senderId === accountId && item.recipientId === activeChat.id)
      || (item.senderId === activeChat.id && item.recipientId === accountId)
    ))
    : [];
  const canMessageActiveChat = typeof activeChat?.id === "string" && /^[\da-f]{32}$/i.test(activeChat.id);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim() || !activeChat || !accountId || !canMessageActiveChat || isSending) return;
    setSendError("");
    setIsSending(true);
    try {
      const sentMessage = await sendStudentMessage(accountId, activeChat.id, message);
      setMessages((current) => [...current, sentMessage]);
      setMessage("");
    } catch (error) {
      setSendError(error.message || "Could not send this message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="messages-page">
      <Sidebar
        activePage="messages"
        onHome={onHome}
        onFindPGs={onFindPGs}
        onRoommates={onRoommates}
        onSaved={onSaved}
        onBookings={onBookings}
        onMessages={() => {}}
        onNotifications={onNotifications}
        onProfile={onProfile}
        onSettings={onSettings}
        onLogout={onLogout}
      />

      <main className="messages-main">
        <header className="messages-topbar">
          <div>
            <p className="messages-label">MESSAGES</p>
            <h1>Your conversations</h1>
          </div>
          <button className="messages-user" onClick={onProfile} type="button" title="View Profile" aria-label={`Open profile for ${userName}`}>
            <span className="messages-avatar">{userName.charAt(0).toUpperCase()}</span>
            <span>{userName}</span>
            <span>▾</span>
          </button>
        </header>

        {loadError && <p className="messages-error" role="alert">{loadError}</p>}

        <div className="chat-layout">
          <aside className="conversation-list">
            <div className="conversation-heading">
              <h2>Messages</h2>
              <span>{conversations.length}</span>
            </div>

            {conversations.length ? conversations.map((chat) => (
              <button
                className={`conversation-item ${activeChat?.id === chat.id ? "active" : ""}`}
                key={chat.id}
                onClick={() => setActiveChat(chat.person)}
                type="button"
              >
                <div className="conversation-avatar">
                  <img src={chat.person.avatar || defaultAvatar} alt="" />
                </div>
                <div className="conversation-info">
                  <strong>{chat.person.name}</strong>
                  <span>{chat.messages.at(-1)?.text || "Start a conversation"}</span>
                </div>
              </button>
            )) : (
              <div className="no-conversations">
                <div>💬</div>
                <h3>No messages yet</h3>
                <p>Contact a property owner from a PG listing or connect with a roommate to start chatting.</p>
              </div>
            )}
          </aside>

          <section className="chat-area">
            {activeChat ? (
              <>
                <header className="chat-header">
                  <div className="chat-person">
                    <div className="chat-person-avatar">
                      <img src={activeChat.avatar || defaultAvatar} alt="" />
                    </div>
                    <div>
                      <h2>{activeChat.name}</h2>
                      <p>Looking for a room in {activeChat.location || "their preferred area"}</p>
                    </div>
                  </div>
                <button className="chat-profile-button" onClick={activeChat.role === "owner" ? undefined : onRoommates} type="button" disabled={activeChat.role === "owner"}>
                    {activeChat.role === "owner" ? "Property owner" : "View Roommates"}
                  </button>
                </header>

                <div className="chat-messages">
                  {currentConversation.map((chatMessage) => (
                    <div
                      key={chatMessage.id}
                      className={`message-row ${chatMessage.senderId === accountId ? "my-message" : "their-message"}`}
                    >
                      <div className="message-bubble">
                        <p>{chatMessage.text}</p>
                        <span>{formatTime(chatMessage.sentAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {sendError && <p className="messages-error" role="alert">{sendError}</p>}
                {!canMessageActiveChat && <p className="messages-error" role="status">This profile is not linked to a registered account, so messages cannot be sent.</p>}
                <form className="message-input-area" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={`Message ${activeChat.name.split(" ")[0]}...`}
                    maxLength={2000}
                    disabled={!canMessageActiveChat || isSending}
                  />
                  <button type="submit" disabled={!canMessageActiveChat || isSending || !message.trim()}>
                    {isSending ? "Sending…" : "Send →"}
                  </button>
                </form>
              </>
            ) : (
              <div className="select-chat">
                <div>💬</div>
                <h2>Select a conversation</h2>
                <p>Choose someone from your messages or connect with a roommate to start chatting.</p>
                <button onClick={onRoommates} type="button">Find Roommates →</button>
              </div>
            )}
          </section>
        </div>

        <footer className="messages-footer">
          <span>© 2026 StayMate</span>
          <span>Find your place. Find your people.</span>
        </footer>
      </main>
    </div>
  );
}

export default Messages;
