import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import { usePersistentState } from "../utils/usePersistentState";
import { getMessagingContacts, getStudentMessages } from "../utils/studentAuth";
import "./StudentNotifications.css";

function StudentNotifications({
  userName,
  accountId,
  userKey,
  bookings,
  onHome,
  onFindPGs,
  onRoommates,
  onSaved,
  onBookings,
  onMessages,
  onProfile,
  onSettings,
  onLogout,
}) {
  const [messages, setMessages] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [readIds, setReadIds] = usePersistentState(
    `staymate:notifications:${userKey || "guest"}:read`,
    [],
  );

  useEffect(() => {
    if (!accountId) return undefined;
    let isCurrent = true;
    const refreshMessages = async () => {
      try {
        const [nextMessages, nextProfiles] = await Promise.all([
          getStudentMessages(accountId),
          getMessagingContacts(),
        ]);
        if (!isCurrent) return;
        setMessages(nextMessages);
        setProfiles(nextProfiles);
        setMessageError("");
      } catch (error) {
        if (isCurrent) setMessageError(error.message || "Could not load message notifications.");
      }
    };
    void refreshMessages();
    const timer = window.setInterval(refreshMessages, 5000);
    return () => {
      isCurrent = false;
      window.clearInterval(timer);
    };
  }, [accountId]);

  const notifications = useMemo(() => {
    const bookingNotifications = bookings
      .filter((booking) => ["accepted", "declined"].includes(booking.status))
      .map((booking) => ({
        id: `booking:${booking.id}:${booking.status}`,
        type: "booking",
        title: booking.status === "accepted" ? "Booking confirmed" : "Booking request declined",
        detail: `${booking.name || "Your property request"} · ${booking.status === "accepted" ? "The owner confirmed your booking." : "The owner declined your booking request."}`,
        createdAt: booking.statusUpdatedAt || booking.requestedAt,
        action: onBookings,
        actionLabel: "View booking",
      }));
    const messageNotifications = messages
      .filter((message) => message.recipientId === accountId)
      .map((message) => {
        const sender = profiles.find((profile) => profile.id === message.senderId);
        return {
          id: `message:${message.id}`,
          type: "message",
          title: `New message from ${sender?.name || (sender?.role === "owner" ? "a property owner" : "a student")}`,
          detail: message.text,
          createdAt: message.sentAt,
          action: onMessages,
          actionLabel: "Open messages",
        };
      });
    return [...bookingNotifications, ...messageNotifications].sort((first, second) => (
      (Date.parse(second.createdAt || "") || 0) - (Date.parse(first.createdAt || "") || 0)
    ));
  }, [accountId, bookings, messages, onBookings, onMessages, profiles]);

  const unreadCount = notifications.filter((notification) => !readIds.includes(notification.id)).length;
  const markAllRead = () => setReadIds(notifications.map((notification) => notification.id));

  return (
    <div className="student-notifications-page">
      <Sidebar
        activePage="notifications"
        onHome={onHome}
        onFindPGs={onFindPGs}
        onRoommates={onRoommates}
        onSaved={onSaved}
        onBookings={onBookings}
        onMessages={onMessages}
        onNotifications={() => {}}
        onProfile={onProfile}
        onSettings={onSettings}
        onLogout={onLogout}
      />
      <main className="student-notifications-main">
        <header className="student-notifications-topbar">
          <div>
            <span>NOTIFICATIONS</span>
            <h1>Updates for you</h1>
          </div>
          <button className="student-notifications-user" onClick={onProfile} type="button">
            <span>{userName.charAt(0).toUpperCase()}</span>{userName}
          </button>
        </header>

        <section className="student-notifications-content">
          <div className="student-notifications-heading">
            <div>
              <p>Stay up to date</p>
              <h2>Your notifications <span>{unreadCount} unread</span></h2>
            </div>
            {unreadCount > 0 && <button type="button" onClick={markAllRead}>Mark all as read</button>}
          </div>

          {messageError && <p className="student-notifications-error" role="status">Message updates are temporarily unavailable: {messageError}</p>}

          {notifications.length ? (
            <div className="student-notifications-list">
              {notifications.map((notification) => {
                const isUnread = !readIds.includes(notification.id);
                return (
                  <article className={`student-notification-card ${isUnread ? "unread" : ""}`} key={notification.id}>
                    <span className={`student-notification-icon ${notification.type}`} aria-hidden="true">
                      {notification.type === "booking" ? "⌂" : "✉"}
                    </span>
                    <div className="student-notification-body">
                      <div className="student-notification-title-row">
                        <h3>{notification.title}</h3>
                        {isUnread && <span className="student-notification-unread-dot" aria-label="Unread" />}
                      </div>
                      <p>{notification.detail}</p>
                      <small>{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Recently"}</small>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (isUnread) setReadIds((current) => [...new Set([...current, notification.id])]);
                        notification.action?.();
                      }}
                    >
                      {notification.actionLabel} →
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="student-notifications-empty">
              <span>🔔</span>
              <h3>You’re all caught up</h3>
              <p>Booking updates and messages from property owners or other students will appear here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentNotifications;
