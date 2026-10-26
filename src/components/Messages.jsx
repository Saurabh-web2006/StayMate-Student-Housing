import { useEffect } from "react";
import "./Messages.css";

import Sidebar from "./Sidebar";
import { usePersistentState } from "../utils/usePersistentState";

function Messages({
  userName = "Sanyam",
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
  persistenceKey = "staymate:guest"
}) {

  const [activeChat, setActiveChat] = usePersistentState(`${persistenceKey}:messages:activeChat`, selectedPerson || null);
  const [message, setMessage] = usePersistentState(`${persistenceKey}:messages:draft`, "");
  const [conversations, setConversations] = usePersistentState(`${persistenceKey}:messages:conversations`, () => {
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

  useEffect(() => {
    if (!selectedPerson) return;
    setActiveChat(selectedPerson);
    setConversations((current) => {
      if (current.some((chat) => chat.id === selectedPerson.id)) return current;
      return [
        ...current,
        {
          id: selectedPerson.id,
          person: selectedPerson,
          messages: [{
            id: 1,
            sender: "them",
            text: `Hi ${userName}! Nice to connect with you 👋`,
            time: "10:30 AM",
          }],
        },
      ];
    });
    onChatOpened?.();
  }, [selectedPerson, setActiveChat, setConversations, userName, onChatOpened]);



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



  const currentConversation = conversations.find(
    (chat) =>
      activeChat &&
      chat.id === activeChat.id
  );


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

            <p className="messages-label">
              MESSAGES
            </p>

            <h1>
              Your conversations
            </h1>

          </div>


          <button className="messages-user" onClick={onProfile} type="button" title="View Profile" aria-label={`Open profile for ${userName}`}>

            <span className="messages-avatar">
              {userName.charAt(0)}
            </span>

            <span>
              {userName}
            </span>

            <span>
              ▾
            </span>

          </button>

        </header>


       
        <div className="chat-layout">


        
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
                    <img
                      src={chat.person.avatar}
                      alt={chat.person.name}
                    />
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


    

          <section className="chat-area">


            {activeChat ? (

              <>

             

                <header className="chat-header">

                  <div className="chat-person">

                    <div className="chat-person-avatar">
                      <img
                        src={activeChat.avatar}
                        alt={activeChat.name}
                      />
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