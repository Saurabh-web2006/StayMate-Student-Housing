import { useState } from "react";
import "./Messages.css";

import Sidebar from "./Sidebar";

function Messages({
  userName = "Sanyam",
  onHome,
  onFindPGs,
  onRoommates,
  onSaved,
  onLogout,
  selectedPerson
}) {

  const [activeChat, setActiveChat] = useState(selectedPerson || null);

  const [message, setMessage] = useState("");

  const [conversations, setConversations] = useState(() => {

    if (!selectedPerson) {
      return [];
    }

    return [
      {
        id: selectedPerson.id,
        person: selectedPerson,
        messages: [
          {
            id: 1,
            sender: "them",
            text: `Hi ${userName}! Nice to connect with you 👋`,
            time: "10:30 AM"
          }
        ]
      }
    ];

  });


  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSendMessage = (e) => {

    e.preventDefault();

    if (!message.trim() || !activeChat) {
      return;
    }


    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };


    setConversations((current) => {

      const conversationExists = current.some(
        (chat) => chat.id === activeChat.id
      );


      if (conversationExists) {

        return current.map((chat) => {

          if (chat.id === activeChat.id) {

            return {
              ...chat,
              messages: [
                ...chat.messages,
                newMessage
              ]
            };

          }

          return chat;

        });

      }


      return [
        ...current,
        {
          id: activeChat.id,
          person: activeChat,
          messages: [newMessage]
        }
      ];

    });


    setMessage("");

  };


  /* =========================
     CURRENT CONVERSATION
  ========================= */

  const currentConversation = conversations.find(
    (chat) =>
      activeChat &&
      chat.id === activeChat.id
  );


  return (

    <div className="messages-page">


      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar

        activePage="messages"

        onHome={onHome}

        onFindPGs={onFindPGs}

        onRoommates={onRoommates}

        onSaved={onSaved}

        onBookings={() => {
          alert("My Bookings page coming soon!");
        }}

        onMessages={() => {}}

        onNotifications={() => {
          alert("Notifications page coming soon!");
        }}

        onProfile={() => {
          alert("Profile page coming soon!");
        }}

        onSettings={() => {
          alert("Settings page coming soon!");
        }}

        onLogout={onLogout}

      />


      {/* =========================
          MAIN
      ========================= */}

      <main className="messages-main">


        {/* TOPBAR */}

        <header className="messages-topbar">

          <div>

            <p className="messages-label">
              MESSAGES
            </p>

            <h1>
              Your conversations
            </h1>

          </div>


          <div className="messages-user">

            <div className="messages-avatar">
              {userName.charAt(0)}
            </div>

            <span>
              {userName}
            </span>

            <span>
              ▾
            </span>

          </div>

        </header>


        {/* =========================
            CHAT LAYOUT
        ========================= */}

        <div className="chat-layout">


          {/* =========================
              CONVERSATION LIST
          ========================= */}

          <aside className="conversation-list">

            <div className="conversation-heading">

              <h2>
                Messages
              </h2>

              <span>
                {conversations.length}
              </span>

            </div>


            {conversations.length > 0 ? (

              conversations.map((chat) => (

                <button
                  className={`conversation-item ${
                    activeChat?.id === chat.id
                      ? "active"
                      : ""
                  }`}
                  key={chat.id}
                  onClick={() =>
                    setActiveChat(chat.person)
                  }
                >

                  <div className="conversation-avatar">

                    {chat.person.avatar}

                  </div>


                  <div className="conversation-info">

                    <strong>
                      {chat.person.name}
                    </strong>

                    <span>

                      {chat.messages[
                        chat.messages.length - 1
                      ]?.text}

                    </span>

                  </div>

                </button>

              ))

            ) : (

              <div className="no-conversations">

                <div>
                  💬
                </div>

                <h3>
                  No messages yet
                </h3>

                <p>
                  Connect with a roommate to start chatting.
                </p>

              </div>

            )}

          </aside>


          {/* =========================
              CHAT AREA
          ========================= */}

          <section className="chat-area">


            {activeChat ? (

              <>

                {/* CHAT HEADER */}

                <header className="chat-header">

                  <div className="chat-person">

                    <div className="chat-person-avatar">
                      {activeChat.avatar}
                    </div>

                    <div>

                      <h2>
                        {activeChat.name}
                      </h2>

                      <p>
                        Looking for a room in {activeChat.location}
                      </p>

                    </div>

                  </div>


                  <button
                    className="chat-profile-button"
                    onClick={onRoommates}
                  >
                    View Roommates
                  </button>

                </header>


                {/* MESSAGES */}

                <div className="chat-messages">

                  {currentConversation?.messages.map(
                    (chatMessage) => (

                      <div
                        key={chatMessage.id}
                        className={`message-row ${
                          chatMessage.sender === "me"
                            ? "my-message"
                            : "their-message"
                        }`}
                      >

                        <div className="message-bubble">

                          <p>
                            {chatMessage.text}
                          </p>

                          <span>
                            {chatMessage.time}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>


                {/* MESSAGE INPUT */}

                <form
                  className="message-input-area"
                  onSubmit={handleSendMessage}
                >

                  <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    placeholder={`Message ${activeChat.name.split(" ")[0]}...`}
                  />

                  <button type="submit">
                    Send →
                  </button>

                </form>

              </>

            ) : (

              <div className="select-chat">

                <div>
                  💬
                </div>

                <h2>
                  Select a conversation
                </h2>

                <p>
                  Choose someone from your messages or
                  connect with a roommate to start chatting.
                </p>

                <button
                  onClick={onRoommates}
                >
                  Find Roommates →
                </button>

              </div>

            )}

          </section>

        </div>


        {/* FOOTER */}

        <footer className="messages-footer">

          <span>
            © 2026 StayMate
          </span>

          <span>
            Find your place. Find your people.
          </span>

        </footer>

      </main>

    </div>

  );

}

export default Messages;