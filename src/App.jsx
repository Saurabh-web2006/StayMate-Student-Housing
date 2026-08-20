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
          onLogout={() => setPage("login")}
          onFindPGs={() => setPage("findPGs")}
          onRoommates={() => setPage("roommates")}
          onSaved={() => setPage("saved")}
          onMessages={() => setPage("messages")}
          savedPGs={savedPGs}
          onToggleSaved={toggleSavedPG}
        />
      )}

      {page === "findPGs" && (
        <FindPGs
          userName="Sanyam"

          onHome={() => setPage("home")}

          onRoommates={() => setPage("roommates")}

          onSaved={() => setPage("saved")}

          onLogout={() => setPage("login")}

          onMessages={() => setPage("messages")}

          savedPGs={savedPGs}

          onToggleSaved={toggleSavedPG}
        />
      )}

      {page === "roommates" && (
        <Roommates
          userName="Sanyam"
          onHome={() => setPage("home")}
          onFindPGs={() => setPage("findPGs")}
          onLogout={() => setPage("login")}
          onSaved={() => setPage("saved")}
          onMessages={() => setPage("messages")}
          onLogout={() => setPage("login")}
          onConnect={(person) => {
            setSelectedChatPerson(person);
            setPage("messages");
          }}
        />
      )}

      {page === "saved" && (
        <Saved
          userName="Sanyam"

          onHome={() => setPage("home")}

          onFindPGs={() => setPage("findPGs")}

          onRoommates={() => setPage("roommates")}

          onLogout={() => setPage("login")}

          onMessages={() => setPage("messages")}

          savedPGs={savedPGs}

          onToggleSaved={toggleSavedPG}
        />
      )}

      {page === "messages" && (
        <Messages
          userName="Sanyam"
          onHome={() => setPage("home")}
          onFindPGs={() => setPage("findPGs")}
          onRoommates={() => setPage("roommates")}
          onSaved={() => setPage("saved")}
          onLogout={() => setPage("login")}
          selectedPerson={selectedChatPerson}
        />
      )}

    </div>
  );
}

export default App;
