import { useState } from "react";
import Sidebar from "./Sidebar";
import "./StudentProfile.css";
import { usePersistentState } from "../utils/usePersistentState";
import { validateProfileField, validateStudentProfile } from "./utils/validation";

const PROFILE_GROUPS = [
  {
    title: "About you",
    description: "A few basics help people get to know you.",
    fields: [
      { name: "age", label: "Age", type: "number", min: "16", max: "100", icon: "🎂" },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Non-binary", "Prefer not to say"], icon: "👤" },
    ],
  },
  {
    title: "Education",
    description: "Share where and what you study.",
    fields: [
      { name: "college", label: "College / University", type: "text", icon: "🎓" },
      { name: "course", label: "Course", type: "text", icon: "📚" },
    ],
  },
  {
    title: "Living preferences",
    description: "Help us suggest roommates with a similar routine.",
    fields: [
      { name: "food", label: "Food preference", type: "select", options: ["Vegetarian", "Non-Vegetarian"], icon: "🥗" },
      { name: "lifestyle", label: "Lifestyle", type: "select", options: ["Early Bird", "Night Owl", "Flexible"], icon: "🌙" },
      { name: "cleanliness", label: "Cleanliness preference", type: "select", options: ["Very Clean", "Clean", "Moderate"], icon: "✨" },
      { name: "location", label: "Preferred area / city", type: "text", icon: "📍" },
      { name: "budget", label: "Monthly budget (₹)", type: "number", min: "0", icon: "₹" },
    ],
  },
];

function maskContact(value) {
  if (!value) return "Not provided";
  const visibleCharacters = Math.min(2, value.length);
  return `${value.slice(0, visibleCharacters)}${"*".repeat(Math.max(6, value.length - visibleCharacters))}`;
}

function getCompletion(profile) {
  const fields = ["name", "age", "gender", "college", "course", "location", "food", "lifestyle", "cleanliness", "budget"];
  let completedFields = fields.filter((field) => String(profile[field] ?? "").trim() !== "").length;
  // Accounts use either email or phone as their login identifier, so count contact once.
  if (String(profile.email || profile.phone || "").trim()) completedFields += 1;
  const totalFields = fields.length + 1;
  return Math.round((completedFields / totalFields) * 100);
}

function StudentProfile({
  userProfile,
  userName,
  bookingNotice = "",
  onSaveProfile,
  onHome,
  onFindPGs,
  onRoommates,
  onSaved,
  onBookings,
  onMessages,
  onNotifications,
  onProfile,
  onSettings,
  onLogout,
  persistenceKey = "staymate:guest",
}) {
  const [isEditing, setIsEditing] = usePersistentState(`${persistenceKey}:profile:isEditing`, false);
  const [draft, setDraft] = usePersistentState(`${persistenceKey}:profile:draft`, { ...userProfile });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const name = userProfile.name || userName;
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const completion = getCompletion(userProfile);

  const startEditing = () => {
    setDraft({ ...userProfile });
    setSaveError("");
    setSavedMessage("");
    setFieldErrors({});
    setIsEditing(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setSaveError("");
    setSavedMessage("");
    const nextErrors = validateStudentProfile(draft);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaveError("Please fix the highlighted fields before saving.");
      return;
    }
    setIsSaving(true);
    try {
      await onSaveProfile({
        ...draft,
        name: (draft.name || "").trim(),
        age: draft.age ? Number(draft.age) : "",
        budget: draft.budget ? Number(draft.budget) : "",
      });
      setIsEditing(false);
      setSavedMessage("Your profile has been updated.");
    } catch (error) {
      setSaveError(error.message || "We couldn't save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name: fieldName, value } = event.target;
    setDraft((current) => ({ ...current, [fieldName]: value }));
    setSaveError("");
    setFieldErrors((current) => (
      current[fieldName]
        ? { ...current, [fieldName]: validateProfileField(fieldName, value) }
        : current
    ));
  };

  const handleBlur = (event) => {
    const { name: fieldName, value } = event.target;
    const error = validateProfileField(fieldName, value);
    setFieldErrors((current) => {
      if (error) return { ...current, [fieldName]: error };
      const nextErrors = { ...current };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  };

  const handleCancel = () => {
    setDraft({ ...userProfile });
    setSaveError("");
    setFieldErrors({});
    setIsEditing(false);
  };

  return (
    <div className="student-profile-page">
      <Sidebar
        activePage="profile"
        onHome={onHome}
        onFindPGs={onFindPGs}
        onRoommates={onRoommates}
        onSaved={onSaved}
        onBookings={onBookings}
        onMessages={onMessages}
        onNotifications={onNotifications}
        onProfile={onProfile}
        onSettings={onSettings}
        onLogout={onLogout}
      />

      <main className="student-profile-main">
        <header className="student-profile-topbar">
          <div>
            <span className="student-profile-page-title">My profile</span>
            <span className="student-profile-topbar-caption">Your StayMate account</span>
          </div>
          <button className="student-profile-user" onClick={onProfile} type="button" title="View Profile" aria-label={`Open profile for ${name}`}>
            <span className="student-profile-avatar">{initials.charAt(0)}</span>
            <span>{name}</span>
          </button>
        </header>

        <div className="student-profile-content">
          <div className="student-profile-page-intro">
            <div>
              <p className="student-profile-eyebrow">ACCOUNT</p>
              <h1>Your profile</h1>
              <p>Keep your details up to date to make finding your next stay easier.</p>
            </div>
            <span className="student-profile-private-badge"><span /> Only you can see your contact details</span>
          </div>

          {savedMessage && <p className="student-profile-notice" role="status">{savedMessage}</p>}
          {bookingNotice && <p className="student-profile-booking-notice" role="alert">{bookingNotice} Use “Edit profile” to fill in the missing details, then try booking again.</p>}

          <div className="student-profile-layout">
            <div className="student-profile-primary">
              <section className="student-profile-card">
                <div className="student-profile-heading">
                  <div className="student-profile-initial">{initials}</div>
                  <div className="student-profile-identity">
                    <p className="student-profile-eyebrow">STUDENT MEMBER</p>
                    <h2>{name}</h2>
                    <p className="student-profile-subtitle">{userProfile.college || "Add your college to complete your profile"}</p>
                  </div>
                  {!isEditing && (
                    <button className="student-profile-edit-button" type="button" onClick={startEditing}>
                      <span aria-hidden="true">✎</span> Edit profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form className="student-profile-form" onSubmit={handleSubmit} noValidate>
                    <div className="student-profile-form-heading">
                      <div>
                        <h2>Edit your details</h2>
                        <p>Fields can be left blank and updated whenever you like.</p>
                      </div>
                      <span className="student-profile-edit-indicator">Editing</span>
                    </div>

                    <div className="student-profile-form-group">
                      <div className="student-profile-group-heading">
                        <span>👋</span>
                        <div><h3>About you</h3><p>Your name is how other students see you.</p></div>
                      </div>
                      <div className="student-profile-fields">
                        <label className="student-profile-field student-profile-field-wide">
                          <span>Full name</span>
                          <input
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={draft.name || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={80}
                            aria-invalid={Boolean(fieldErrors.name)}
                            aria-describedby={fieldErrors.name ? "profile-name-error" : undefined}
                          />
                          {fieldErrors.name && <span className="student-profile-field-error" id="profile-name-error">{fieldErrors.name}</span>}
                        </label>
                        {PROFILE_GROUPS[0].fields.map((field) => (
                          <ProfileField key={field.name} field={field} value={draft[field.name]} error={fieldErrors[field.name]} onChange={handleChange} onBlur={handleBlur} />
                        ))}
                      </div>
                    </div>

                    {PROFILE_GROUPS.slice(1).map((group) => (
                      <div className="student-profile-form-group" key={group.title}>
                        <div className="student-profile-group-heading">
                          <span>{group.title === "Education" ? "🎓" : "🏡"}</span>
                          <div><h3>{group.title}</h3><p>{group.description}</p></div>
                        </div>
                        <div className="student-profile-fields">
                          {group.fields.map((field) => (
                            <ProfileField key={field.name} field={field} value={draft[field.name]} error={fieldErrors[field.name]} onChange={handleChange} onBlur={handleBlur} />
                          ))}
                        </div>
                      </div>
                    ))}

                    {saveError && <p className="student-profile-error" role="alert">{saveError}</p>}
                    <div className="student-profile-form-actions">
                      <button type="button" className="student-profile-cancel-button" onClick={handleCancel} disabled={isSaving}>Cancel</button>
                      <button type="submit" className="student-profile-save-button" disabled={isSaving}>{isSaving ? "Saving…" : "Save changes"}</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <section className="student-profile-section">
                      <div className="student-profile-section-heading">
                        <div><h3>Contact information</h3><p>Your contact details are private and masked here.</p></div>
                        <span aria-hidden="true">🔒</span>
                      </div>
                      <div className="student-profile-details">
                        <ProfileDetail icon="✉" label="Email address" value={maskContact(userProfile.email)} />
                        <ProfileDetail icon="☎" label="Phone number" value={maskContact(userProfile.phone)} />
                      </div>
                    </section>

                    {PROFILE_GROUPS.map((group) => (
                      <section className="student-profile-section" key={group.title}>
                        <div className="student-profile-section-heading">
                          <div><h3>{group.title}</h3><p>{group.description}</p></div>
                        </div>
                        <div className="student-profile-details">
                          {group.fields.map((field) => (
                            <ProfileDetail
                              key={field.name}
                              icon={field.icon}
                              label={field.label}
                              value={formatProfileValue(field, userProfile[field.name])}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </>
                )}
              </section>
            </div>

            <aside className="student-profile-aside">
              <section className="student-profile-progress-card">
                <div className="student-profile-aside-title">
                  <span className="student-profile-aside-icon">✦</span>
                  <div><h3>Profile strength</h3><p>A complete profile helps you find a better match.</p></div>
                </div>
                <div className="student-profile-progress-value">
                  <strong>{completion}%</strong>
                  <span>{completion === 100 ? "All set!" : completion >= 60 ? "Looking good" : "Keep going"}</span>
                </div>
                <div className="student-profile-progress-track" role="progressbar" aria-label="Profile completeness" aria-valuenow={completion} aria-valuemin="0" aria-valuemax="100">
                  <span style={{ width: `${completion}%` }} />
                </div>
                <p className="student-profile-progress-hint">
                  {completion === 100 ? "Your profile has all the details." : "Add your study and lifestyle details to complete your profile."}
                </p>
                {!isEditing && completion < 100 && (
                  <button type="button" className="student-profile-complete-link" onClick={startEditing}>Complete your profile <span>→</span></button>
                )}
              </section>

              <section className="student-profile-privacy-card">
                <span className="student-profile-privacy-icon">🛡️</span>
                <h3>Your privacy matters</h3>
                <p>Your email and phone number are hidden on this page. Only a masked version is shown for your privacy.</p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileField({ field, value, error, onChange, onBlur }) {
  const errorId = `profile-${field.name}-error`;
  return (
    <label className="student-profile-field">
      <span>{field.label}</span>
      {field.type === "select" ? (
        <select
          name={field.name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="">Choose an option</option>
          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          name={field.name}
          type={field.type}
          min={field.min}
          max={field.max}
          autoComplete={field.name === "college" ? "organization" : "off"}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      {error && <span className="student-profile-field-error" id={errorId}>{error}</span>}
    </label>
  );
}

function ProfileDetail({ icon, label, value }) {
  return (
    <div className="student-profile-detail">
      <span className="student-profile-detail-icon" aria-hidden="true">{icon}</span>
      <div><span>{label}</span><strong>{value || "Not added yet"}</strong></div>
    </div>
  );
}

function formatProfileValue(field, value) {
  if (!value) return "";
  if (field.name === "budget") return `₹${Number(value).toLocaleString("en-IN")} / month`;
  if (field.name === "age") return `${value} years old`;
  return value;
}

export default StudentProfile;
