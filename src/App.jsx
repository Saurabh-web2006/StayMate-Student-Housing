import { useState } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Legal from "./components/Legal";

import Home from "./components/Home";
import FindPGs from "./components/FindPGs";
import Roommates from "./components/Roommates";
import Saved from "./components/Saved";
import Messages from "./components/Messages";
import ComingSoon from "./components/ComingSoon";

import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  const [selectedChatPerson, setSelectedChatPerson] = useState(null);

  const [savedPGs, setSavedPGs] = useState([]);

  const toggleSavedPG = (pg) => {

    setSavedPGs((currentSaved) => {

      const alreadySaved = currentSaved.some(
        (saved) => saved.id === pg.id
      );

      if (alreadySaved) {

        return currentSaved.filter(
          (saved) => saved.id !== pg.id
        );

      }

      return [...currentSaved, pg];

    });

  };


  /* ============================
     SHARED NAV CALLBACKS
  ============================ */

  const navCallbacks = {
    onHome: () => setPage("home"),
    onFindPGs: () => setPage("findPGs"),
    onRoommates: () => setPage("roommates"),
    onSaved: () => setPage("saved"),
    onBookings: () => setPage("bookings"),
    onMessages: () => setPage("messages"),
    onNotifications: () => setPage("notifications"),
    onProfile: () => setPage("profile"),
    onSettings: () => setPage("settings"),
    onLogout: () => setPage("login")
  };


  return (
    <div className="app">

      {page === "login" && (
        <Login
          onGetStarted={() => setPage("signup")}
          onForgotPassword={() => setPage("forgot")}
          onLegal={() => setPage("legal")}
          onLogin={() => setPage("home")}
        />
      )}

      {page === "signup" && (
        <Signup
          onLogin={() => setPage("login")}
          onLegal={() => setPage("legal")}
        />
      )}

      {page === "forgot" && (
        <ForgotPassword
          onBackToLogin={() => setPage("login")}
        />
      )}

      {page === "legal" && (
        <Legal
          onBack={() => setPage("login")}
        />
      )}

      {page === "home" && (
        <Home
          userName="Sanyam"
          onLogout={navCallbacks.onLogout}
          onFindPGs={navCallbacks.onFindPGs}
          onRoommates={navCallbacks.onRoommates}
          onSaved={navCallbacks.onSaved}
          onBookings={navCallbacks.onBookings}
          onMessages={navCallbacks.onMessages}
          onNotifications={navCallbacks.onNotifications}
          onProfile={navCallbacks.onProfile}
          onSettings={navCallbacks.onSettings}
          savedPGs={savedPGs}
          onToggleSaved={toggleSavedPG}
        />
      )}

      {page === "findPGs" && (
        <FindPGs
          userName="Sanyam"
          {...navCallbacks}
          savedPGs={savedPGs}
          onToggleSaved={toggleSavedPG}
        />
      )}

      {page === "roommates" && (
        <Roommates
          userName="Sanyam"
          {...navCallbacks}
          onConnect={(person) => {
            setSelectedChatPerson(person);
            setPage("messages");
          }}
        />
      )}

      {page === "saved" && (
        <Saved
          userName="Sanyam"
          {...navCallbacks}
          savedPGs={savedPGs}
          onToggleSaved={toggleSavedPG}
        />
      )}

      {page === "messages" && (
        <Messages
          userName="Sanyam"
          {...navCallbacks}
          selectedPerson={selectedChatPerson}
        />
      )}

      {page === "bookings" && (
        <ComingSoon
          pageKey="bookings"
          userName="Sanyam"
          {...navCallbacks}
        />
      )}

      {page === "notifications" && (
        <ComingSoon
          pageKey="notifications"
          userName="Sanyam"
          {...navCallbacks}
        />
      )}

      {page === "profile" && (
        <ComingSoon
          pageKey="profile"
          userName="Sanyam"
          {...navCallbacks}
        />
      )}

      {page === "settings" && (
        <ComingSoon
          pageKey="settings"
          userName="Sanyam"
          {...navCallbacks}
        />
      )}

    </div>
  );
}

export default App;

