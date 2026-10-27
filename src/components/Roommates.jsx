import "./Roommates.css";
import { useEffect, useState } from "react";

import RoommateProfile from "./RoommateProfile";
import Sidebar from "./Sidebar";
import { usePersistentState } from "../utils/usePersistentState";
import { getStudentRoommateProfiles } from "../utils/studentAuth";

import roommate1 from "../assets/roommate1.jpg";
import roommate2 from "../assets/roommate2.jpg";
import roommate3 from "../assets/roommate3.jpg";
import roommate4 from "../assets/roommate4.jpg";
import roommate5 from "../assets/roommate5.jpg";
import roommate6 from "../assets/roommate6.jpg";


function Roommates({
  userName = "Sanyam",
  onHome,
  onFindPGs,
  onLogout,
  onProfile,
  onSaved,
  onMessages,
  onBookings,
  onNotifications,
  onSettings,
  onConnect,
  currentAccountId,
  initialSearch = "",
  persistenceKey = "staymate:guest"
}) {

  const [studentProfiles, setStudentProfiles] = useState([]);
  const [directoryError, setDirectoryError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    const refreshDirectory = async () => {
      try {
        const profiles = await getStudentRoommateProfiles();
        if (isCurrent) {
          setStudentProfiles(profiles);
          setDirectoryError("");
        }
      } catch (error) {
        console.error("Could not load student roommate profiles.", error);
        if (isCurrent) setDirectoryError("Student profiles could not load. Refresh the page or try again shortly.");
      }
    };
    const refreshOnFocus = () => { void refreshDirectory(); };
    void refreshDirectory();
    window.addEventListener("focus", refreshOnFocus);
    const refreshTimer = window.setInterval(refreshDirectory, 30000);
    return () => {
      isCurrent = false;
      window.removeEventListener("focus", refreshOnFocus);
      window.clearInterval(refreshTimer);
    };
  }, []);

  const [search, setSearch] = usePersistentState(`${persistenceKey}:roommates:search`, initialSearch);
  const [gender, setGender] = usePersistentState(`${persistenceKey}:roommates:gender`, "All");
  const [budget, setBudget] = usePersistentState(`${persistenceKey}:roommates:budget`, "Any Budget");
  const [lifestyle, setLifestyle] = usePersistentState(`${persistenceKey}:roommates:lifestyle`, "All");

  const [selectedRoommate, setSelectedRoommate] = usePersistentState(`${persistenceKey}:roommates:selected`, null);



  const sampleRoommates = [

    {
      id: 1,
      name: "Aarav Sharma",
      age: 20,
      college: "Chitkara University",
      course: "B.Tech CSE",
      location: "Rajpura",
      budget: 8000,
      gender: "Male",
      lifestyle: "Early Bird",
      cleanliness: "Very Clean",
      food: "Vegetarian",
      compatibility: 94,
      avatar: roommate1
    },

    {
      id: 2,
      name: "Rohan Mehta",
      age: 19,
      college: "Chitkara University",
      course: "B.Tech AIML",
      location: "Rajpura",
      budget: 9000,
      gender: "Male",
      lifestyle: "Night Owl",
      cleanliness: "Clean",
      food: "Vegetarian",
      compatibility: 89,
      avatar: roommate2
    },

    {
      id: 3,
      name: "Ananya Gupta",
      age: 20,
      college: "Chitkara University",
      course: "BBA",
      location: "Rajpura",
      budget: 10000,
      gender: "Female",
      lifestyle: "Early Bird",
      cleanliness: "Very Clean",
      food: "Vegetarian",
      compatibility: 87,
      avatar: roommate3
    },

    {
      id: 4,
      name: "Kabir Singh",
      age: 21,
      college: "Chitkara University",
      course: "B.Tech CSE",
      location: "Rajpura",
      budget: 7500,
      gender: "Male",
      lifestyle: "Night Owl",
      cleanliness: "Clean",
      food: "Non-Vegetarian",
      compatibility: 82,
      avatar: roommate4
    },

    {
      id: 5,
      name: "Mehak Arora",
      age: 19,
      college: "Chitkara University",
      course: "BCA",
      location: "Rajpura",
      budget: 8500,
      gender: "Female",
      lifestyle: "Early Bird",
      cleanliness: "Clean",
      food: "Vegetarian",
      compatibility: 80,
      avatar: roommate5
    },

    {
      id: 6,
      name: "Arjun Verma",
      age: 20,
      college: "Chitkara University",
      course: "B.Tech ECE",
      location: "Rajpura",
      budget: 7000,
      gender: "Male",
      lifestyle: "Flexible",
      cleanliness: "Clean",
      food: "Non-Vegetarian",
      compatibility: 76,
      avatar: roommate6
    }

  ];

  const avatars = [roommate1, roommate2, roommate3, roommate4, roommate5, roommate6];
  const registeredRoommates = studentProfiles
    .filter((profile) => profile.id !== currentAccountId)
    .map((profile, index) => ({
    ...profile,
    compatibility: 80,
    avatar: avatars[index % avatars.length],
    budget: Number(profile.budget) || 0,
  }));
  const roommates = [...sampleRoommates, ...registeredRoommates];



  const filteredRoommates = roommates.filter((person) => {

    const matchesSearch =
      person.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      person.course
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesGender =
      gender === "All" ||
      person.gender === gender;


    const matchesBudget =
      budget === "Any Budget" ||

      (budget === "Under ₹8,000" &&
        person.budget < 8000) ||

      (budget === "₹8,000 - ₹10,000" &&
        person.budget >= 8000 &&
        person.budget <= 10000) ||

      (budget === "Above ₹10,000" &&
        person.budget > 10000);


    const matchesLifestyle =
      lifestyle === "All" ||
      person.lifestyle === lifestyle;


    return (
      matchesSearch &&
      matchesGender &&
      matchesBudget &&
      matchesLifestyle
    );

  });



  const clearFilters = () => {

    setSearch("");
    setGender("All");
    setBudget("Any Budget");
    setLifestyle("All");

  };




  if (selectedRoommate) {

    return (
      <RoommateProfile
        person={selectedRoommate}
        onBack={() =>
          setSelectedRoommate(null)
        }
        onConnect={(person) => {
          onConnect(person);
        }}
      />
    );

  }




  return (

    <div className="roommates-page">


     

      <Sidebar

        activePage="roommates"

        onHome={onHome}

        onFindPGs={onFindPGs}

        onRoommates={() => {}}

        onSaved={onSaved}

        onBookings={onBookings}

        onMessages={onMessages}

        onNotifications={onNotifications}

        onProfile={onProfile}

        onSettings={onSettings}

        onLogout={onLogout}

      />




      <main className="roommates-main">




        <header className="roommates-topbar">

          <button className="roommates-user" onClick={onProfile} type="button" title="View Profile" aria-label={`Open profile for ${userName}`}>

            <span className="roommates-avatar">
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

        {directoryError && <p className="roommates-directory-error" role="status">{directoryError}</p>}




        <section className="roommates-hero">

          <div>

            <p className="roommates-small-heading">
              ROOMMATE MATCHING
            </p>

            <h1>
              Find someone you'll actually
              <span> enjoy living with.</span>
            </h1>

            <p className="roommates-description">
              Discover students who match your lifestyle,
              budget and living preferences.
            </p>

          </div>


          <div className="match-summary">

            <div className="match-summary-icon">
              🤝
            </div>

            <div>

              <strong>
                Smart Matching
              </strong>

              <p>
                Compatibility based on your preferences
              </p>

            </div>

          </div>

        </section>



        <section className="roommate-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by name or course..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </section>



        <section className="roommate-filters">


          <div className="roommate-filter">

            <label>
              Gender
            </label>

            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value)
              }
            >

              <option>
                All
              </option>

              <option>
                Male
              </option>

              <option>
                Female
              </option>

            </select>

          </div>


          <div className="roommate-filter">

            <label>
              Monthly Budget
            </label>

            <select
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
            >

              <option>
                Any Budget
              </option>

              <option>
                Under ₹8,000
              </option>

              <option>
                ₹8,000 - ₹10,000
              </option>

              <option>
                Above ₹10,000
              </option>

            </select>

          </div>


          <div className="roommate-filter">

            <label>
              Lifestyle
            </label>

            <select
              value={lifestyle}
              onChange={(e) =>
                setLifestyle(e.target.value)
              }
            >

              <option>
                All
              </option>

              <option>
                Early Bird
              </option>

              <option>
                Night Owl
              </option>

              <option>
                Flexible
              </option>

            </select>

          </div>


          <button
            className="roommate-clear"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </section>




        <section className="roommate-results">


          <div className="roommate-results-heading">

            <div>

              <h2>
                Your Best Matches
              </h2>

              <p>
                {filteredRoommates.length} potential roommates found
              </p>

            </div>


            <select className="roommate-sort">

              <option>
                Best Match
              </option>

              <option>
                Budget: Low to High
              </option>

              <option>
                Budget: High to Low
              </option>

            </select>

          </div>




          {filteredRoommates.length > 0 ? (

            <div className="roommate-grid">

              {filteredRoommates.map((person) => (

                <div
                  className="roommate-card"
                  key={person.id}
                >


                 

                  <div className="roommate-card-top">

                    <div className="roommate-avatar">

                      <img
                        src={person.avatar}
                        alt={person.name}
                      />

                    </div>


                    <div className="compatibility-score">

                      <strong>
                        {person.compatibility}%
                      </strong>

                      <span>
                        Match
                      </span>

                    </div>

                  </div>


               

                  <h3>
                    {person.name}
                  </h3>


                  <p className="roommate-course">
                    {person.age} years • {person.course}
                  </p>


                  <p className="roommate-college">
                    🎓 {person.college}
                  </p>


                 

                  <div className="roommate-info-grid">


                    <div>

                      <span>
                        🌙 Lifestyle
                      </span>

                      <strong>
                        {person.lifestyle}
                      </strong>

                    </div>


                    <div>

                      <span>
                        ✨ Cleanliness
                      </span>

                      <strong>
                        {person.cleanliness}
                      </strong>

                    </div>


                    <div>

                      <span>
                        🍴 Food
                      </span>

                      <strong>
                        {person.food}
                      </strong>

                    </div>


                    <div>

                      <span>
                        💰 Budget
                      </span>

                      <strong>
                        ₹{person.budget.toLocaleString()}
                      </strong>

                    </div>

                  </div>


                

                  <div className="roommate-location">
                    📍 Looking for a room in {person.location}
                  </div>


                 

                  <div className="roommate-actions">

                    <button className="save-roommate">
                      ♡
                    </button>


                    <button
                      className="view-roommate"

                      onClick={() =>
                        setSelectedRoommate(person)
                      }
                    >
                      View Profile →
                    </button>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="roommate-no-results">

              <div>
                🔍
              </div>

              <h3>
                No roommates found
              </h3>

              <p>
                Try changing your filters to find more matches.
              </p>

              <button onClick={clearFilters}>
                Clear Filters
              </button>

            </div>

          )}

        </section>


      </main>

    </div>
  );
}


export default Roommates;
