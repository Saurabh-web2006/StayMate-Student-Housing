import { useState } from "react";
import "./Roommates.css";

import RoommateProfile from "./RoommateProfile";
import Sidebar from "./Sidebar";

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
  onConnect
}) {

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [budget, setBudget] = useState("Any Budget");
  const [lifestyle, setLifestyle] = useState("All");

  const [selectedRoommate, setSelectedRoommate] = useState(null);


  /* =========================
     ROOMMATE DATA
  ========================= */

  const roommates = [

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


  /* =========================
     FILTER LOGIC
  ========================= */

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


  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {

    setSearch("");
    setGender("All");
    setBudget("Any Budget");
    setLifestyle("All");

  };


  /* =========================
     ROOMMATE PROFILE
  ========================= */

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


  /* =========================
     PAGE
  ========================= */

  return (

    <div className="roommates-page">


      {/* =========================
          SHARED SIDEBAR
      ========================= */}

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


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="roommates-main">


        {/* =========================
            TOP BAR
        ========================= */}

        <header className="roommates-topbar">

          <div className="roommates-user">

            <div className="roommates-avatar">
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
            HERO
        ========================= */}

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


        {/* =========================
            SEARCH
        ========================= */}

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


        {/* =========================
            FILTERS
        ========================= */}

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


        {/* =========================
            RESULTS
        ========================= */}

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


          {/* =========================
              CARDS
          ========================= */}

          {filteredRoommates.length > 0 ? (

            <div className="roommate-grid">

              {filteredRoommates.map((person) => (

                <div
                  className="roommate-card"
                  key={person.id}
                >


                  {/* TOP */}

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


                  {/* NAME */}

                  <h3>
                    {person.name}
                  </h3>


                  <p className="roommate-course">
                    {person.age} years • {person.course}
                  </p>


                  <p className="roommate-college">
                    🎓 {person.college}
                  </p>


                  {/* INFORMATION */}

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


                  {/* LOCATION */}

                  <div className="roommate-location">
                    📍 Looking for a room in {person.location}
                  </div>


                  {/* ACTIONS */}

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