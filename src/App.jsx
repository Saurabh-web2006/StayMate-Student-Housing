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


import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

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
import StudentBookings from "./components/StudentBookings";
import StudentNotifications from "./components/StudentNotifications";
import StudentProfile from "./components/StudentProfile";
import RoleSelection from "./components/RoleSelection";

// Owner Components
import OwnerLogin from "./components/OwnerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";

import { PropertyProvider, useProperties } from "./context/PropertyContext";
import { BookingProvider, useBookings } from "./context/BookingContext";
import {
  getAccountId,
  authenticateOwner,
  authenticateStudent,
  registerOwner,
  registerStudent,
  updateStudentAccountProfile,
  getOwnerContactProfile,
} from "./utils/studentAuth";
import { readPersistentValue, savePersistentValue, usePersistentState } from "./utils/usePersistentState";
import "./App.css";

function readUserProfile() {
  try {
    const storedProfile = localStorage.getItem("staymateUserProfile");
    if (!storedProfile) return {};
    const profile = JSON.parse(storedProfile);
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      throw new Error("Saved student profile must be an object.");
    }
    const sanitizedProfile = { ...profile };
    ["name", "email", "phone", "gender", "college", "course", "location", "food", "lifestyle", "cleanliness"].forEach((field) => {
      if (typeof sanitizedProfile[field] !== "string") sanitizedProfile[field] = "";
    });
    ["age", "budget"].forEach((field) => {
      if (typeof sanitizedProfile[field] !== "string" && typeof sanitizedProfile[field] !== "number") {
        sanitizedProfile[field] = "";
      }
    });
    return sanitizedProfile;
  } catch (error) {
    console.error("Could not read the saved user profile.", error);
    return {};
  }
}

function readOwnerProfile() {
  try {
    const storedProfile = localStorage.getItem("staymateOwnerProfile");
    if (!storedProfile) return {};
    const profile = JSON.parse(storedProfile);
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      throw new Error("Saved owner profile must be an object.");
    }
    const sanitizedProfile = { ...profile };
    ["name", "businessName", "email", "phone", "ownerId"].forEach((field) => {
      if (typeof sanitizedProfile[field] !== "string") sanitizedProfile[field] = "";
    });
    return sanitizedProfile;
  } catch (error) {
    console.error("Could not read the saved owner profile.", error);
    return {};
  }
}

function getMissingStudentProfileFields(profile) {
  const requiredFields = [
    ["name", "full name"],
    ["age", "age"],
    ["gender", "gender"],
    ["college", "college / university"],
    ["course", "course"],
    ["location", "preferred area / city"],
    ["food", "food preference"],
    ["lifestyle", "lifestyle"],
    ["cleanliness", "cleanliness preference"],
    ["budget", "monthly budget"],
  ];
  const missing = requiredFields
    .filter(([field]) => !String(profile[field] ?? "").trim())
    .map(([, label]) => label);
  if (!String(profile.email || profile.phone || "").trim()) missing.push("email or phone number");
  return missing;
}

function RouteLoading({ message = "Loading StayMate…" }) {
  return (
    <div className="route-state">
      <span className="route-spinner" />
      <p>{message}</p>
    </div>
  );
}

function StudentHomeRoute({ userName, savedPGs, toggleSaved, navCallbacks, persistenceKey, onBook, onContactOwner }) {
  const { properties, loading, error, refreshProperties } = useProperties();
  if (loading) return <RouteLoading message="Finding stays around your campus…" />;
  if (error) return (
    <div className="route-state">
      <h2>Couldn't load stays</h2>
      <p>{error}</p>
      <button onClick={refreshProperties}>Try again</button>
    </div>
  );
  return <Home userName={userName} {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSaved} onBook={onBook} onContactOwner={onContactOwner} listings={properties} persistenceKey={persistenceKey} />;
}

function FindPGsRoute({ userName, savedPGs, toggleSaved, navCallbacks, initialSearch, persistenceKey, onSearchChange, onBook, onContactOwner }) {
  const { properties, loading, error, refreshProperties } = useProperties();
  if (loading) return <RouteLoading message="Loading available properties…" />;
  if (error) return (
    <div className="route-state">
      <h2>Couldn't load properties</h2>
      <p>{error}</p>
      <button onClick={refreshProperties}>Try again</button>
    </div>
  );
  return <FindPGs userName={userName} {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSaved} onBook={onBook} onContactOwner={onContactOwner} initialSearch={initialSearch} onSearchChange={onSearchChange} listings={properties} persistenceKey={persistenceKey} />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getStudentBookings, createBooking, error: bookingStoreError } = useBookings();
  const [userProfile, setUserProfile] = useState(readUserProfile);
  const [ownerProfile, setOwnerProfile] = useState(readOwnerProfile);
  const [bookingError, setBookingError] = useState("");
  const accountKey = userProfile.email || userProfile.phone || "guest";
  const persistenceKey = `staymate:${encodeURIComponent(accountKey)}`;
  const [selectedChatPerson, setSelectedChatPerson] = usePersistentState(`${persistenceKey}:selectedChatPerson`, null);
  const [savedPGs, setSavedPGs] = usePersistentState(`${persistenceKey}:savedPGs`, []);
  const [locationFilter, setLocationFilter] = usePersistentState(`${persistenceKey}:locationFilter`, "");
  const bookings = getStudentBookings(accountKey);
  const userName = userProfile.name || "Student";
  const lastStudentPath = readPersistentValue(`${persistenceKey}:lastStudentPath`, "/student");

  useEffect(() => {
    if (location.pathname.startsWith("/student")) {
      savePersistentValue(`${persistenceKey}:lastStudentPath`, location.pathname);
    }
  }, [location.pathname, persistenceKey]);

  useEffect(() => {
    const identifier = userProfile.email || userProfile.phone;
    if (!identifier || userProfile.accountId) return undefined;
    let isCurrent = true;
    getAccountId("student", identifier)
      .then((accountId) => {
        if (!isCurrent) return;
        setUserProfile((current) => {
          const updated = { ...current, accountId };
          localStorage.setItem("staymateUserProfile", JSON.stringify(updated));
          return updated;
        });
      })
      .catch((error) => console.error("Could not identify the signed-in student for messages.", error));
    return () => { isCurrent = false; };
  }, [userProfile.accountId, userProfile.email, userProfile.phone]);

  useEffect(() => {
    const identifier = ownerProfile.ownerId || ownerProfile.email || ownerProfile.phone;
    if (!identifier || ownerProfile.accountId) return undefined;
    let isCurrent = true;
    getAccountId("owner", identifier).then((accountId) => {
      if (!isCurrent) return;
      setOwnerProfile((current) => {
        const updated = { ...current, accountId };
        localStorage.setItem("staymateOwnerProfile", JSON.stringify(updated));
        return updated;
      });
    }).catch((error) => console.error("Could not identify the signed-in owner for messages.", error));
    return () => { isCurrent = false; };
  }, [ownerProfile.accountId, ownerProfile.ownerId, ownerProfile.email, ownerProfile.phone]);

  useEffect(() => {
    if (location.pathname === "/" && userProfile.name && lastStudentPath.startsWith("/student")) {
      navigate(lastStudentPath, { replace: true });
    }
  }, [lastStudentPath, location.pathname, navigate, userProfile.name]);

  const restorePreferences = (profile) => {
    const nextKey = `staymate:${encodeURIComponent(profile.email || profile.phone || "guest")}`;
    setSelectedChatPerson(readPersistentValue(`${nextKey}:selectedChatPerson`, null));
    setSavedPGs(readPersistentValue(`${nextKey}:savedPGs`, []));
    setLocationFilter(readPersistentValue(`${nextKey}:locationFilter`, ""));
  };

  const saveUserProfile = async (updates) => {
    const updatedProfile = { ...userProfile, ...updates };
    const savedProfile = await updateStudentAccountProfile(updatedProfile.email || updatedProfile.phone, updatedProfile);
    localStorage.setItem("staymateUserProfile", JSON.stringify(savedProfile));
    setUserProfile(savedProfile);
  };

  const signIn = async (formData) => {
    const profile = await authenticateStudent(formData.identifier, formData.password);
    localStorage.setItem("staymateUserProfile", JSON.stringify(profile));
    restorePreferences(profile);
    setUserProfile(profile);
    navigate("/student");
  };

  const signUp = async (formData) => {
    const profile = await registerStudent(formData);
    localStorage.setItem("staymateUserProfile", JSON.stringify(profile));
    restorePreferences(profile);
    setUserProfile(profile);
    navigate("/student");
  };

  const ownerSignIn = async (formData) => {
    const profile = await authenticateOwner(formData.identifier, formData.password);
    localStorage.setItem("staymateOwnerProfile", JSON.stringify(profile));
    setOwnerProfile(profile);
    navigate("/owner");
  };

  const ownerSignUp = async (formData) => {
    const profile = await registerOwner(formData);
    localStorage.setItem("staymateOwnerProfile", JSON.stringify(profile));
    setOwnerProfile(profile);
    navigate("/owner");
  };

  const toggleSavedPG = (pg) => setSavedPGs((current) => (
    current.some((saved) => String(saved.id) === String(pg.id))
      ? current.filter((saved) => String(saved.id) !== String(pg.id))
      : [...current, pg]
  ));

  const requestBooking = (pg) => {
    setBookingError("");
    const missingFields = getMissingStudentProfileFields(userProfile);
    if (missingFields.length > 0) {
      setBookingError(`Complete your profile before booking. Add: ${missingFields.join(", ")}.`);
      navigate("/student/profile", { state: { bookingRequired: true } });
      return;
    }
    try {
      createBooking(accountKey, userProfile, pg);
    } catch (error) {
      console.error("Could not create booking request.", error);
      setBookingError(error.message || "Could not save this booking request.");
    }
    navigate("/student/bookings");
  };

  const contactOwner = async (pg) => {
    if (!userProfile.accountId) throw new Error("Sign in to your student account to contact this owner.");
    const owner = await getOwnerContactProfile(pg.ownerId);
    setSelectedChatPerson({ ...owner, role: "owner", location: "" });
    navigate("/student/messages");
  };

  const navCallbacks = {
    onHome: () => navigate("/student"),
    onFindPGs: (query) => {
      setLocationFilter(typeof query === "string" ? query : "");
      navigate("/student/pgs");
    },
    onRoommates: (query) => {
      if (typeof query === "string") {
        savePersistentValue(`${persistenceKey}:roommates:search`, query);
      }
      navigate("/student/roommates");
    },
    onSaved: () => navigate("/student/saved"),
    onBookings: () => navigate("/student/bookings"),
    onMessages: () => navigate("/student/messages"),
    onNotifications: () => navigate("/student/notifications"),
    onProfile: () => navigate("/student/profile"),
    onSettings: () => navigate("/student/settings"),
    onLogout: () => {
      localStorage.removeItem("staymateUserProfile");
      setUserProfile({});
      navigate("/login");
    },
  };

  return (
    <div className="app">
      <Routes>
        {/* Role Selection & General Auth */}
        <Route path="/" element={<RoleSelection onProceedToLogin={() => navigate("/login")} onProceedToOwner={() => navigate("/owner/login")} />} />
        <Route path="/login" element={<Login onBack={() => navigate("/")} onGetStarted={() => navigate("/signup")} onForgotPassword={() => navigate("/forgot-password")} onLegal={() => navigate("/legal")} onLogin={signIn} />} />
        <Route path="/signup" element={<Signup onLogin={() => navigate("/login")} onLegal={() => navigate("/legal")} onAccountCreated={signUp} />} />
        <Route path="/forgot-password" element={<ForgotPassword onBackToLogin={() => navigate("/login")} />} />
        <Route path="/legal" element={<Legal onBack={() => navigate("/login")} />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentHomeRoute userName={userName} savedPGs={savedPGs} toggleSaved={toggleSavedPG} navCallbacks={navCallbacks} persistenceKey={persistenceKey} onBook={requestBooking} onContactOwner={contactOwner} />} />
        <Route path="/student/pgs" element={<FindPGsRoute userName={userName} savedPGs={savedPGs} toggleSaved={toggleSavedPG} navCallbacks={navCallbacks} initialSearch={locationFilter} onSearchChange={setLocationFilter} persistenceKey={persistenceKey} onBook={requestBooking} onContactOwner={contactOwner} />} />
        <Route path="/student/roommates" element={<Roommates userName={userName} currentAccountId={userProfile.accountId} {...navCallbacks} persistenceKey={persistenceKey} onConnect={(person) => { setSelectedChatPerson(person); navigate("/student/messages"); }} />} />
        <Route path="/student/saved" element={<Saved userName={userName} {...navCallbacks} savedPGs={savedPGs} onToggleSaved={toggleSavedPG} onBook={requestBooking} onContactOwner={contactOwner} persistenceKey={persistenceKey} />} />
        <Route path="/student/messages" element={<Messages userName={userName} accountId={userProfile.accountId} {...navCallbacks} selectedPerson={selectedChatPerson} onChatOpened={() => setSelectedChatPerson(null)} persistenceKey={persistenceKey} />} />
        <Route path="/student/bookings" element={<StudentBookings userName={userName} bookings={bookings} error={bookingError || bookingStoreError} {...navCallbacks} />} />
        <Route path="/student/notifications" element={<StudentNotifications userName={userName} accountId={userProfile.accountId} userKey={accountKey} bookings={bookings} {...navCallbacks} />} />
        <Route path="/student/profile" element={<StudentProfile userProfile={userProfile} onSaveProfile={saveUserProfile} userName={userName} bookingNotice={location.state?.bookingRequired && getMissingStudentProfileFields(userProfile).length > 0 ? bookingError : ""} persistenceKey={persistenceKey} {...navCallbacks} />} />
        <Route path="/student/settings" element={<ComingSoon pageKey="settings" userName={userName} {...navCallbacks} />} />

        {/* Owner Portal Routes */}
        <Route 
          path="/owner/login" 
          element={
            <OwnerLogin 
              onBack={() => navigate("/")} 
              onForgotPassword={() => navigate("/forgot-password")} 
              onLegal={() => navigate("/legal")} 
              onOwnerLogin={ownerSignIn}
              onOwnerRegister={ownerSignUp}
            />
          } 
        />
        <Route
          path="/owner/*"
          element={
            ownerProfile.ownerId ? (
              <OwnerDashboard
                ownerProfile={ownerProfile}
                accountId={ownerProfile.accountId}
                onLogout={() => {
                  localStorage.removeItem("staymateOwnerProfile");
                  setOwnerProfile({});
                  navigate("/owner/login");
                }}
              />
            ) : <Navigate to="/owner/login" replace />
          }
        />

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
        <BookingProvider>
          <AppRoutes />
        </BookingProvider>
      </PropertyProvider>
    </BrowserRouter>
  );
}

export default App;
