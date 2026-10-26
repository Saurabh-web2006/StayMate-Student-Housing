// import { useState } from "react";
// import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import ForgotPassword from "./components/ForgotPassword";
// import Legal from "./components/Legal";
// import Home from "./components/Home";
// import FindPGs from "./components/FindPGs";
// import Roommates from "./components/Roommates";
// import Saved from "./components/Saved";
// import Messages from "./components/Messages";
// import ComingSoon from "./components/ComingSoon";
// import RoleSelection from "./components/RoleSelection";
// import OwnerDashboard from "./pages/OwnerDashboard";
// import { PropertyProvider, useProperties } from "./context/PropertyContext";
// import "./App.css";

// function RouteLoading({ message = "Loading StayMate…" }) {
//   return <div className="route-state"><span className="route-spinner" /><p>{message}</p></div>;
// }

// function StudentHomeRoute({ savedPGs, toggleSaved, navCallbacks }) {
//   const { properties, loading, error, refreshProperties } = useProperties();
//   if (loading) return <RouteLoading message="Finding stays around your campus…" />;
//   if (error) return <div className="route-state"><h2>Couldn't load stays</h2><p>{error}</p><button onClick={refreshProperties}>Try again</button></div>;
//   return <Home userName="Sanyam" {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSaved} listings={properties} />;
// }

// function FindPGsRoute({ savedPGs, toggleSaved, navCallbacks, initialSearch }) {
//   const { properties, loading, error, refreshProperties } = useProperties();
//   if (loading) return <RouteLoading message="Loading available properties…" />;
//   if (error) return <div className="route-state"><h2>Couldn't load properties</h2><p>{error}</p><button onClick={refreshProperties}>Try again</button></div>;
//   return <FindPGs userName="Sanyam" {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSaved} initialSearch={initialSearch} listings={properties} />;
// }

// function AppRoutes() {
//   const navigate = useNavigate();
//   const [selectedChatPerson, setSelectedChatPerson] = useState(null);
//   const [savedPGs, setSavedPGs] = useState([]);
//   const [locationFilter, setLocationFilter] = useState("");

//   const toggleSavedPG = (pg) => setSavedPGs((current) => (
//     current.some((saved) => String(saved.id) === String(pg.id))
//       ? current.filter((saved) => String(saved.id) !== String(pg.id))
//       : [...current, pg]
//   ));

//   const navCallbacks = {
//     onHome: () => navigate("/student"),
//     onFindPGs: (query) => {
//       setLocationFilter(typeof query === "string" ? query : "");
//       navigate("/student/pgs");
//     },
//     onRoommates: () => navigate("/student/roommates"),
//     onSaved: () => navigate("/student/saved"),
//     onBookings: () => navigate("/student/bookings"),
//     onMessages: () => navigate("/student/messages"),
//     onNotifications: () => navigate("/student/notifications"),
//     onProfile: () => navigate("/student/profile"),
//     onSettings: () => navigate("/student/settings"),
//     onLogout: () => navigate("/login"),
//   };

//   return (
//     <div className="app">
//       <Routes>
//         <Route path="/" element={<RoleSelection onProceedToLogin={() => navigate("/login")} onProceedToOwner={() => navigate("/owner")} />} />
//         <Route path="/login" element={<Login onBack={() => navigate("/")} onGetStarted={() => navigate("/signup")} onForgotPassword={() => navigate("/forgot-password")} onLegal={() => navigate("/legal")} onLogin={() => navigate("/student")} />} />
//         <Route path="/signup" element={<Signup onLogin={() => navigate("/login")} onLegal={() => navigate("/legal")} />} />
//         <Route path="/forgot-password" element={<ForgotPassword onBackToLogin={() => navigate("/login")} />} />
//         <Route path="/legal" element={<Legal onBack={() => navigate("/login")} />} />

//         <Route path="/student" element={<StudentHomeRoute savedPGs={savedPGs} toggleSaved={toggleSavedPG} navCallbacks={navCallbacks} />} />
//         <Route path="/student/pgs" element={<FindPGsRoute savedPGs={savedPGs} toggleSaved={toggleSavedPG} navCallbacks={navCallbacks} initialSearch={locationFilter} />} />
//         <Route path="/student/roommates" element={<Roommates userName="Sanyam" {...navCallbacks} onConnect={(person) => { setSelectedChatPerson(person); navigate("/student/messages"); }} />} />
//         <Route path="/student/saved" element={<Saved userName="Sanyam" {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSavedPG} />} />
//         <Route path="/student/messages" element={<Messages userName="Sanyam" {...navCallbacks} selectedPerson={selectedChatPerson} />} />
//         <Route path="/student/bookings" element={<ComingSoon pageKey="bookings" userName="Sanyam" {...navCallbacks} />} />
//         <Route path="/student/notifications" element={<ComingSoon pageKey="notifications" userName="Sanyam" {...navCallbacks} />} />
//         <Route path="/student/profile" element={<ComingSoon pageKey="profile" userName="Sanyam" {...navCallbacks} />} />
//         <Route path="/student/settings" element={<ComingSoon pageKey="settings" userName="Sanyam" {...navCallbacks} />} />

//         <Route path="/owner/*" element={<OwnerDashboard />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <PropertyProvider>
//         <AppRoutes />
//       </PropertyProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

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
import RoleSelection from "./components/RoleSelection";

// Owner Components
import OwnerLogin from "./components/OwnerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";

import { PropertyProvider, useProperties } from "./context/PropertyContext";
import "./App.css";

function RouteLoading({ message = "Loading StayMate…" }) {
  return (
    <div className="route-state">
      <span className="route-spinner" />
      <p>{message}</p>
    </div>
  );
}

function StudentHomeRoute({ savedPGs, toggleSaved, navCallbacks }) {
  const { properties, loading, error, refreshProperties } = useProperties();
  if (loading) return <RouteLoading message="Finding stays around your campus…" />;
  if (error) return (
    <div className="route-state">
      <h2>Couldn't load stays</h2>
      <p>{error}</p>
      <button onClick={refreshProperties}>Try again</button>
    </div>
  );
  return <Home userName="Sanyam" {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSaved} listings={properties} />;
}

function FindPGsRoute({ savedPGs, toggleSaved, navCallbacks, initialSearch }) {
  const { properties, loading, error, refreshProperties } = useProperties();
  if (loading) return <RouteLoading message="Loading available properties…" />;
  if (error) return (
    <div className="route-state">
      <h2>Couldn't load properties</h2>
      <p>{error}</p>
      <button onClick={refreshProperties}>Try again</button>
    </div>
  );
  return <FindPGs userName="Sanyam" {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSaved} initialSearch={initialSearch} listings={properties} />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [selectedChatPerson, setSelectedChatPerson] = useState(null);
  const [savedPGs, setSavedPGs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");

  const toggleSavedPG = (pg) => setSavedPGs((current) => (
    current.some((saved) => String(saved.id) === String(pg.id))
      ? current.filter((saved) => String(saved.id) !== String(pg.id))
      : [...current, pg]
  ));

  const navCallbacks = {
    onHome: () => navigate("/student"),
    onFindPGs: (query) => {
      setLocationFilter(typeof query === "string" ? query : "");
      navigate("/student/pgs");
    },
    onRoommates: () => navigate("/student/roommates"),
    onSaved: () => navigate("/student/saved"),
    onBookings: () => navigate("/student/bookings"),
    onMessages: () => navigate("/student/messages"),
    onNotifications: () => navigate("/student/notifications"),
    onProfile: () => navigate("/student/profile"),
    onSettings: () => navigate("/student/settings"),
    onLogout: () => navigate("/login"),
  };

  return (
    <div className="app">
      <Routes>
        {/* Role Selection & General Auth */}
        <Route path="/" element={<RoleSelection onProceedToLogin={() => navigate("/login")} onProceedToOwner={() => navigate("/owner/login")} />} />
        <Route path="/login" element={<Login onBack={() => navigate("/")} onGetStarted={() => navigate("/signup")} onForgotPassword={() => navigate("/forgot-password")} onLegal={() => navigate("/legal")} onLogin={() => navigate("/student")} />} />
        <Route path="/signup" element={<Signup onLogin={() => navigate("/login")} onLegal={() => navigate("/legal")} />} />
        <Route path="/forgot-password" element={<ForgotPassword onBackToLogin={() => navigate("/login")} />} />
        <Route path="/legal" element={<Legal onBack={() => navigate("/login")} />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentHomeRoute savedPGs={savedPGs} toggleSaved={toggleSavedPG} navCallbacks={navCallbacks} />} />
        <Route path="/student/pgs" element={<FindPGsRoute savedPGs={savedPGs} toggleSaved={toggleSavedPG} navCallbacks={navCallbacks} initialSearch={locationFilter} />} />
        <Route path="/student/roommates" element={<Roommates userName="Sanyam" {...navCallbacks} onConnect={(person) => { setSelectedChatPerson(person); navigate("/student/messages"); }} />} />
        <Route path="/student/saved" element={<Saved userName="Sanyam" {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSavedPG} />} />
        <Route path="/student/messages" element={<Messages userName="Sanyam" {...navCallbacks} selectedPerson={selectedChatPerson} />} />
        <Route path="/student/bookings" element={<ComingSoon pageKey="bookings" userName="Sanyam" {...navCallbacks} />} />
        <Route path="/student/notifications" element={<ComingSoon pageKey="notifications" userName="Sanyam" {...navCallbacks} />} />
        <Route path="/student/profile" element={<ComingSoon pageKey="profile" userName="Sanyam" {...navCallbacks} />} />
        <Route path="/student/settings" element={<ComingSoon pageKey="settings" userName="Sanyam" {...navCallbacks} />} />

        {/* Owner Portal Routes */}
        <Route 
          path="/owner/login" 
          element={
            <OwnerLogin 
              onBack={() => navigate("/")} 
              onGetStarted={() => navigate("/signup")} 
              onForgotPassword={() => navigate("/forgot-password")} 
              onLegal={() => navigate("/legal")} 
              onOwnerLogin={(formData) => {
                console.log("Owner logged in:", formData);
                navigate("/owner");
              }} 
            />
          } 
        />
        <Route path="/owner/*" element={<OwnerDashboard onLogout={() => navigate("/owner/login")} />} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PropertyProvider>
        <AppRoutes />
      </PropertyProvider>
    </BrowserRouter>
  );
}

export default App;