import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import { useBookings } from "../context/BookingContext";
import { usePersistentState } from "../utils/usePersistentState";
import "./OwnerDashboard.css";

const blankForm = {
  name: "",
  location: "",
  distance: "",
  price: "",
  type: "Boys PG",
  room: "Single",
  amenities: "WiFi, Food",
  image: "/src/assets/pg1.jpg",
  availableRooms: "3",
  description: "",
};

const propertyTypes = ["Boys PG", "Girls PG", "Co-living", "Flat"];
const roomTypes = ["Single", "Double", "Triple", "Single Room", "Double Sharing"];
const draftFields = Object.keys(blankForm);

function readPropertyDraft(key, property) {
  const initialValues = property ? {
    ...blankForm,
    ...property,
    name: typeof property.name === "string" ? property.name : "",
    location: typeof property.location === "string" ? property.location : "",
    distance: typeof property.distance === "string" ? property.distance : "",
    price: String(property.price ?? ""),
    type: typeof property.type === "string" ? property.type : blankForm.type,
    room: typeof property.room === "string" ? property.room : blankForm.room,
    amenities: Array.isArray(property.amenities)
      ? property.amenities.join(", ")
      : typeof property.amenities === "string" ? property.amenities : "",
    image: typeof property.image === "string" ? property.image : "",
    availableRooms: String(property.availableRooms ?? 3),
    description: typeof property.description === "string" ? property.description : "",
  } : blankForm;

  try {
    const savedDraft = localStorage.getItem(key);
    if (!savedDraft) return initialValues;
    const parsedDraft = JSON.parse(savedDraft);
    if (!parsedDraft || typeof parsedDraft !== "object" || Array.isArray(parsedDraft)) {
      throw new Error("Saved listing draft must be an object.");
    }
    return draftFields.reduce((values, field) => ({
      ...values,
      [field]: typeof parsedDraft[field] === "string" ? parsedDraft[field] : initialValues[field],
    }), { ...initialValues });
  } catch (error) {
    console.error("Could not read the saved property form draft.", error);
    return initialValues;
  }
}

function validateProperty(values) {
  const errors = {};
  const name = values.name.trim();
  const location = values.location.trim();
  const distance = values.distance.trim();
  const price = Number(values.price);
  const rooms = Number(values.availableRooms);
  const image = values.image.trim();
  const amenities = values.amenities.split(",").map((item) => item.trim()).filter(Boolean);

  if (!name) errors.name = "Enter a property name.";
  else if (name.length > 100) errors.name = "Property name must be 100 characters or fewer.";
  if (!location) errors.location = "Enter the property location.";
  else if (location.length > 120) errors.location = "Location must be 120 characters or fewer.";
  if (distance.length > 80) errors.distance = "Distance must be 80 characters or fewer.";
  if (!Number.isInteger(price) || price <= 0 || price > 10000000) {
    errors.price = "Enter a whole-number monthly rent greater than ₹0 and no more than ₹1,00,00,000.";
  }
  if (!values.availableRooms.trim() || !Number.isInteger(rooms) || rooms < 0 || rooms > 10000) {
    errors.availableRooms = "Enter a whole number of available rooms from 0 to 10,000.";
  }
  if (!image) {
    errors.image = "Add an image path or URL.";
  } else if (!image.startsWith("/") || image.startsWith("//")) {
    try {
      const imageUrl = new URL(image);
      if (!["http:", "https:"].includes(imageUrl.protocol)) throw new Error("Unsupported image URL protocol.");
    } catch {
      errors.image = "Use a local path or a valid http(s) image URL.";
    }
  }
  if (!propertyTypes.includes(values.type)) errors.type = "Choose a valid property type.";
  if (!roomTypes.includes(values.room)) errors.room = "Choose a valid room type.";
  if (amenities.some((amenity) => amenity.length > 40) || amenities.length > 20) {
    errors.amenities = "Add up to 20 amenities, each 40 characters or fewer.";
  }
  if (values.description.length > 1500) errors.description = "Description must be 1,500 characters or fewer.";

  return errors;
}

function Field({ label, error, children }) {
  return (
    <label className="owner-field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error" role="alert">{error}</small>}
    </label>
  );
}

function PropertyForm({ editing, property, ownerId, onSave, onCancel, onViewListings, saving, error, draftKey }) {
  const [values, setValues] = useState(() => readPropertyDraft(draftKey, property));
  const [errors, setErrors] = useState({});
  const [draftError, setDraftError] = useState("");

  const change = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setDraftError("");
    try {
      localStorage.setItem(draftKey, JSON.stringify(nextValues));
    } catch (storageError) {
      console.error("Could not save the property form draft.", storageError);
      setDraftError("Your changes are not being saved as a draft. Check available browser storage.");
    }
    if (errors[name]) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateProperty(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      const saved = await onSave({
        ...values,
        name: values.name.trim(),
        location: values.location.trim(),
        distance: values.distance.trim(),
        image: values.image.trim(),
        price: Number(values.price),
        availableRooms: Number(values.availableRooms),
        amenities: values.amenities.split(",").map((item) => item.trim()).filter(Boolean),
        ownerId: property?.ownerId || ownerId || "owner-1",
        rating: property?.rating ?? 0,
        reviews: property?.reviews ?? 0,
        verified: property?.verified ?? false,
      });
      if (saved === false) return;
      localStorage.removeItem(draftKey);
    } catch (saveError) {
      console.error("Could not clear the saved property form draft.", saveError);
      setDraftError("Listing saved, but its local draft could not be cleared.");
    }
  };

  return (
    <section className="owner-panel owner-form-panel">
      <div className="owner-panel-heading">
        <div>
          <p className="owner-eyebrow">{editing ? "UPDATE LISTING" : "NEW LISTING"}</p>
          <h2>{editing ? "Edit your property" : "Add a property"}</h2>
          <p className="owner-muted">Share accurate details so students know what to expect.</p>
        </div>
      </div>
      {error && <div className="owner-alert owner-alert-error">{error}</div>}
      {draftError && <div className="owner-alert owner-alert-error" role="alert">{draftError}</div>}
      <form className="owner-form" onSubmit={submit} noValidate>
        <Field label="Property name *" error={errors.name}>
          <input name="name" value={values.name} onChange={change} placeholder="e.g. Campus Comfort" maxLength="100" aria-invalid={Boolean(errors.name)} />
        </Field>
        <Field label="Location *" error={errors.location}>
          <input name="location" value={values.location} onChange={change} placeholder="Rajpura, Punjab" maxLength="120" aria-invalid={Boolean(errors.location)} />
        </Field>
        <Field label="Distance from college">
          <input name="distance" value={values.distance || ""} onChange={change} placeholder="e.g. 800 m from campus" maxLength="80" aria-invalid={Boolean(errors.distance)} />
        </Field>
        <Field label="Monthly rent (₹) *" error={errors.price}>
          <input name="price" type="number" min="1" max="10000000" step="1" value={values.price} onChange={change} placeholder="8500" aria-invalid={Boolean(errors.price)} />
        </Field>
        <Field label="Property type" error={errors.type}>
          <select name="type" value={values.type} onChange={change}>
            {propertyTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
        <Field label="Room type" error={errors.room}>
          <select name="room" value={values.room} onChange={change}>
            {roomTypes.map((room) => <option key={room}>{room}</option>)}
          </select>
        </Field>
        <Field label="Available rooms *" error={errors.availableRooms}>
          <input name="availableRooms" type="number" min="0" max="10000" step="1" value={values.availableRooms} onChange={change} aria-invalid={Boolean(errors.availableRooms)} />
        </Field>
        <Field label="Image path or URL *" error={errors.image}>
          <input name="image" value={values.image || ""} onChange={change} placeholder="/src/assets/pg1.jpg" aria-invalid={Boolean(errors.image)} />
        </Field>
        <Field label="Amenities (comma separated)" error={errors.amenities}>
          <input name="amenities" value={values.amenities || ""} onChange={change} placeholder="WiFi, Food, AC, Laundry" aria-invalid={Boolean(errors.amenities)} />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea name="description" value={values.description || ""} onChange={change} rows="4" maxLength="1500" placeholder="Tell students about the rooms, rules and facilities." aria-invalid={Boolean(errors.description)} />
        </Field>
        <div className="owner-form-actions">
          <button className="owner-btn owner-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Publish listing"}</button>
          <button className="owner-btn owner-btn-ghost" type="button" onClick={onCancel}>Cancel</button>
          {!editing && <button className="owner-btn owner-btn-ghost" type="button" onClick={onViewListings}>Check your listings</button>}
        </div>
      </form>
    </section>
  );
}

function OwnerDashboard({ ownerProfile = {}, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editMatch = location.pathname.match(/\/owner\/properties\/([^/]+)\/edit$/);
  const id = editMatch?.[1];
  const ownerId = ownerProfile.ownerId;
  const { properties, loading, error, addProperty, updateProperty, deleteProperty, refreshProperties } = useProperties();
  const { getPropertyBookings, updateBookingStatus, error: bookingReadWarning } = useBookings();
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedVisibleListingCount, setVisibleListingCount] = usePersistentState(
    `staymate:owner:${encodeURIComponent(ownerId || "owner-1")}:visibleListingCount`,
    4
  );
  const visibleListingCount = Number.isInteger(Number(savedVisibleListingCount))
    ? Math.max(4, Number(savedVisibleListingCount))
    : 4;
  const ownerProperties = useMemo(
    () => properties.filter((property) => !property.ownerId || property.ownerId === "owner-1" || property.ownerId === ownerId),
    [ownerId, properties]
  );
  const activeCount = ownerProperties.filter((property) => property.status !== "Unavailable").length;
  const monthlyPotential = ownerProperties.reduce((total, property) => total + Number(property.price || 0) * Number(property.availableRooms || 0), 0);
  const isForm = location.pathname.endsWith("/new") || Boolean(editMatch);
  const editing = /\/edit$/.test(location.pathname);
  const editingProperty = editing ? ownerProperties.find((property) => String(property.id) === String(id)) : null;
  const ownerBookings = getPropertyBookings(ownerProperties);
  const pendingBookingCount = ownerBookings.filter((booking) => booking.status === "pending").length;
  const recentBookings = ownerBookings.slice(0, 3);
  const draftKey = `staymate:owner:${encodeURIComponent(ownerId || "owner-1")}:property-draft:${editing ? id : "new"}`;
  const refreshOwnerBookings = () => window.dispatchEvent(new Event("staymate-bookings-updated"));
  const changeBookingStatus = (bookingId, status) => {
    setActionError("");
    try {
      updateBookingStatus(bookingId, status);
    } catch (bookingError) {
      console.error("Could not update booking request status.", bookingError);
      setActionError(bookingError.message || "Could not update this booking request.");
    }
  };

  const save = async (values) => {
    setSaving(true);
    setActionError("");
    try {
      if (editing && editingProperty) await updateProperty(editingProperty.id, values);
      else await addProperty(values);
      navigate("/owner/properties");
      return true;
    } catch (error) {
      console.error("Could not save owner property.", error);
      setActionError(`Could not save this listing${error.message ? `: ${error.message}` : ""}. Check that JSON Server is running and try again.`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (property) => {
    if (!window.confirm(`Delete "${property.name}"? This cannot be undone.`)) return;
    setActionError("");
    try { await deleteProperty(property.id); }
    catch (error) {
      console.error("Could not delete owner property.", error);
      setActionError(`Could not delete the listing${error.message ? `: ${error.message}` : ""}. Please try again.`);
    }
  };

  const nav = (path) => navigate(path);
  const activeTab = location.pathname.includes("/bookings")
    ? "bookings"
    : location.pathname.includes("/properties") ? "properties" : "overview";

  return (
    <div className="owner-app">
      <aside className="owner-sidebar">
        <button className="owner-brand" onClick={() => nav("/owner")} aria-label="StayMate owner dashboard">
          <span className="owner-brand-mark">S</span><span>Stay<strong>Mate</strong><small>HOST SPACE</small></span>
        </button>
        <div className="owner-profile">
          <div className="owner-avatar">{(ownerProfile.name || "Owner").slice(0, 1).toUpperCase()}</div>
          <div><strong>{ownerProfile.name || "Property Owner"}</strong><small>{ownerProfile.businessName || ownerProfile.email || ownerProfile.phone || "Host account"}</small></div>
        </div>
        <p className="owner-nav-label">WORKSPACE</p>
        <button className={`owner-nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => nav("/owner")}>▦ <span>Overview</span></button>
        <button className={`owner-nav-item ${activeTab === "properties" ? "active" : ""}`} onClick={() => nav("/owner/properties")}>⌂ <span>My properties</span><b>{ownerProperties.length}</b></button>
        <button className="owner-nav-item" onClick={() => nav("/owner/properties/new")}>＋ <span>Add a listing</span></button>
        <button className={`owner-nav-item ${activeTab === "bookings" ? "active" : ""}`} onClick={() => nav("/owner/bookings")}>▤ <span>My bookings</span><b>{ownerBookings.length}</b></button>
        <div className="owner-sidebar-bottom">
          <div className="owner-help-card"><span>✦</span><strong>Hosting tip</strong><p>Clear photos and accurate room availability help students choose confidently.</p></div>
          <button className="owner-nav-item" onClick={() => nav("/")}>↩ <span>Switch role</span></button>
          <button className="owner-nav-item" onClick={() => onLogout ? onLogout() : nav("/owner/login")}>⇥ <span>Log out</span></button>
        </div>
      </aside>

      <main className="owner-main">
        <header className="owner-topbar">
          <div><span className="owner-topbar-kicker">STAYMATE / OWNER</span><h1>{isForm ? (editing ? "Edit listing" : "Add a listing") : activeTab === "properties" ? "My properties" : "Owner overview"}</h1></div>
          <div className="owner-topbar-actions"><span className="owner-status"><i /> Workspace active</span><button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties/new")}>＋ Add property</button></div>
        </header>

        {loading ? <div className="owner-panel owner-state"><div className="owner-spinner" /><h2>Loading your workspace…</h2><p>Fetching property listings from the API.</p></div> : error ? (
          <div className="owner-panel owner-state"><span className="owner-state-icon">⌁</span><h2>We couldn't connect to the property API</h2><p>{error}</p><button className="owner-btn owner-btn-primary" onClick={refreshProperties}>Try again</button></div>
        ) : isForm ? (
          editing && !editingProperty ? <div className="owner-panel owner-state"><h2>Listing not found</h2><button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties")}>Back to properties</button></div> :
          <PropertyForm key={draftKey} draftKey={draftKey} editing={editing} property={editingProperty} ownerId={ownerId} onSave={save} onCancel={() => nav("/owner/properties")} onViewListings={() => nav("/owner/properties")} saving={saving} error={actionError} />
        ) : activeTab === "bookings" ? (
          <section className="owner-panel owner-bookings-panel">
            <div className="owner-panel-heading">
              <div>
                <p className="owner-eyebrow">STUDENT REQUESTS</p>
                <h2>My bookings <span className="owner-count">{ownerBookings.length}</span></h2>
                <p className="owner-muted">Requests for your listed properties, saved on this device.</p>
              </div>
              <button className="owner-btn owner-btn-ghost" onClick={refreshOwnerBookings}>↻ Refresh</button>
            </div>
            <div className="owner-bookings-note">
              Booking requests appear here when students submit them from this browser/device. Requests from other devices are not synced.
            </div>
            {actionError && <div className="owner-alert owner-alert-error" role="alert">{actionError}</div>}
            {bookingReadWarning && <div className="owner-alert owner-alert-error" role="alert">{bookingReadWarning}</div>}
            {ownerBookings.length === 0 ? (
              <div className="owner-empty owner-bookings-empty">
                <span>▤</span>
                <h3>No booking requests yet</h3>
                <p>When a student requests one of your properties on this device, the request will appear here.</p>
                <button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties")}>View my listings</button>
              </div>
            ) : (
              <div className="owner-booking-list">
                {ownerBookings.map((booking) => (
                  <article className="owner-booking-card" key={`${booking.propertyId}-${booking.id}`}>
                    <img
                      src={booking.image}
                      alt={booking.name || "Property"}
                      onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                    />
                    <div className="owner-booking-info">
                      <span className="owner-listing-type">{booking.type || "Property booking"}</span>
                      <h3>{booking.name || "Property"}</h3>
                      <p>{booking.location || "Location not provided"}</p>
                      <span className="owner-booking-student">Requested by {booking.studentName || "Student"}</span>
                    </div>
                    <div className="owner-booking-summary">
                      <strong>₹{Number(booking.price || 0).toLocaleString("en-IN")}<span>/month</span></strong>
                      <span className={`owner-pill ${booking.status === "pending" ? "pending" : booking.status === "declined" ? "muted" : "good"}`}>
                        {(booking.status || "pending").replace(/^./, (letter) => letter.toUpperCase())}
                      </span>
                      <small>{booking.requestedAt && Number.isFinite(Date.parse(booking.requestedAt))
                        ? new Date(booking.requestedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
                        : "Date not available"}</small>
                      {booking.status === "pending" && (
                        <div className="owner-booking-actions">
                          <button className="owner-btn owner-btn-ghost" type="button" onClick={() => changeBookingStatus(booking.id, "accepted")}>Accept</button>
                          <button className="owner-btn owner-btn-ghost" type="button" onClick={() => changeBookingStatus(booking.id, "declined")}>Decline</button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : activeTab === "properties" ? (
          <section className="owner-panel">
            <div className="owner-panel-heading"><div><p className="owner-eyebrow">YOUR PORTFOLIO</p><h2>Property listings <span className="owner-count">{ownerProperties.length}</span></h2><p className="owner-muted">Create, update or remove the stays you manage.</p><p className="owner-sync-note">Published changes appear in student search automatically.</p></div><button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties/new")}>＋ New listing</button></div>
            {actionError && <div className="owner-alert owner-alert-error">{actionError}</div>}
            {ownerProperties.length === 0 ? <div className="owner-empty"><span>⌂</span><h3>No properties yet</h3><p>Add your first listing to get started.</p><button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties/new")}>Add property</button></div> : (
              <>
                <div className="owner-listing-grid">
                  {ownerProperties.slice(0, visibleListingCount).map((property) => (
                    <article className="owner-listing-card" key={property.id}>
                      <div className="owner-listing-image-wrap">
                        <img
                          src={property.image}
                          alt={property.name}
                          onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                        />
                        <span className={`owner-pill ${property.status === "Unavailable" ? "muted" : "good"}`}>
                          {property.status || "Active"}
                        </span>
                      </div>
                      <div className="owner-listing-body">
                        <div className="owner-listing-heading">
                          <div>
                            <span className="owner-listing-type">{property.type || "Student accommodation"}</span>
                            <h3>{property.name}</h3>
                            <p className="owner-listing-location">⌖ {property.location}</p>
                          </div>
                          <div className="owner-listing-price">
                            <strong>₹{Number(property.price || 0).toLocaleString("en-IN")}</strong>
                            <span>/ month</span>
                          </div>
                        </div>
                        <div className="owner-listing-meta">
                          <span>⌂ {property.room || "Room type not set"}</span>
                          <span>{property.availableRooms ?? 0} rooms available</span>
                        </div>
                        {property.amenities?.length > 0 && (
                          <div className="owner-listing-amenities">
                            {(Array.isArray(property.amenities)
                              ? property.amenities
                              : String(property.amenities).split(",").map((amenity) => amenity.trim()).filter(Boolean)
                            ).slice(0, 3).map((amenity) => (
                              <span key={amenity}>{amenity}</span>
                            ))}
                          </div>
                        )}
                        <div className="owner-listing-actions">
                          <button className="owner-btn owner-btn-ghost" onClick={() => nav(`/owner/properties/${property.id}/edit`)}>Edit listing</button>
                          <button className="owner-btn owner-btn-danger" onClick={() => remove(property)}>Delete</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {visibleListingCount < ownerProperties.length && (
                  <div className="owner-load-more-wrap">
                    <button className="owner-btn owner-btn-ghost" onClick={() => setVisibleListingCount((count) => Number(count) + 4)}>
                      Load more listings <span>↓</span>
                    </button>
                    <span>Showing {Math.min(visibleListingCount, ownerProperties.length)} of {ownerProperties.length} listings</span>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <>
            <section className="owner-welcome"><div><span className="owner-welcome-badge">YOUR HOST SPACE</span><h2>Good to have you here 👋</h2><p>Keep your property details fresh and make it easier for students to find a place that feels like home.</p><button className="owner-btn owner-btn-light" onClick={() => nav("/owner/properties/new")}>Create a listing <span>→</span></button></div><div className="owner-welcome-art"><div className="owner-art-window"><span /><span /><span /><span /></div><div className="owner-art-plant">♧</div><div className="owner-art-sun" /></div></section>
            <section className="owner-stat-grid">
              <article className="owner-stat-card"><span className="owner-stat-icon olive">⌂</span><p>Total properties</p><strong>{ownerProperties.length}</strong><small>Listings in your workspace</small></article>
              <article className="owner-stat-card"><span className="owner-stat-icon peach">✓</span><p>Active listings</p><strong>{activeCount}</strong><small>Currently marked available</small></article>
              <article className="owner-stat-card"><span className="owner-stat-icon yellow">▤</span><p>Rooms available</p><strong>{ownerProperties.reduce((total, property) => total + Number(property.availableRooms || 0), 0)}</strong><small>Across your properties</small></article>
              <article className="owner-stat-card"><span className="owner-stat-icon green">₹</span><p>Monthly potential</p><strong>₹{monthlyPotential.toLocaleString("en-IN")}</strong><small>Rent × available rooms</small></article>
            </section>
            <section className="owner-panel owner-recent-panel"><div className="owner-panel-heading"><div><p className="owner-eyebrow">KEEP THINGS UPDATED</p><h2>Recent properties</h2></div><button className="owner-text-btn" onClick={() => nav("/owner/properties")}>View all →</button></div>
              {ownerProperties.length === 0 ? <div className="owner-empty compact"><h3>Your first listing starts here</h3><p>Add a property to see its status and rent details in this space.</p><button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties/new")}>Add property</button></div> :
              <div className="owner-recent-list">{ownerProperties.slice(0, 4).map((property) => <div className="owner-recent-row" key={property.id}><img src={property.image} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /><div className="owner-recent-name"><strong>{property.name}</strong><small>{property.location}</small></div><div className="owner-recent-rent"><strong>₹{Number(property.price).toLocaleString("en-IN")}</strong><small>per month</small></div><button aria-label={`Edit ${property.name}`} onClick={() => nav(`/owner/properties/${property.id}/edit`)}>↗</button></div>)}</div>}
            </section>
            <section className="owner-overview-grid" aria-label="Workspace snapshot">
              <div className="owner-panel owner-overview-bookings">
                <div className="owner-panel-heading">
                  <div>
                    <p className="owner-eyebrow">LATEST ACTIVITY</p>
                    <h2>Recent booking requests <span className="owner-count">{ownerBookings.length}</span></h2>
                    <p className="owner-muted">{pendingBookingCount} request{pendingBookingCount === 1 ? "" : "s"} waiting for your response.</p>
                  </div>
                  <button className="owner-text-btn" onClick={() => nav("/owner/bookings")}>View bookings →</button>
                </div>
                {recentBookings.length ? (
                  <div className="owner-overview-booking-list">
                    {recentBookings.map((booking) => (
                      <article className="owner-overview-booking" key={booking.id}>
                        <div>
                          <strong>{booking.studentName || "Student"}</strong>
                          <span>{booking.name || "Property"} · {booking.requestedAt && Number.isFinite(Date.parse(booking.requestedAt))
                            ? new Date(booking.requestedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            : "Date unavailable"}</span>
                        </div>
                        <span className={`owner-pill ${booking.status === "pending" ? "pending" : booking.status === "declined" ? "muted" : "good"}`}>
                          {(booking.status || "pending").replace(/^./, (letter) => letter.toUpperCase())}
                        </span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="owner-overview-empty">
                    <span>▤</span>
                    <p>Booking requests for your listings will appear here.</p>
                    <button className="owner-btn owner-btn-ghost" onClick={() => nav("/owner/bookings")}>Open bookings</button>
                  </div>
                )}
              </div>
              <div className="owner-panel owner-overview-actions">
                <p className="owner-eyebrow">WORKSPACE SHORTCUTS</p>
                <h2>Manage your host space</h2>
                <p className="owner-muted">Quick access to the tools you use to keep your listings up to date.</p>
                <button className="owner-overview-link" onClick={() => nav("/owner/properties")}>
                  <span className="owner-overview-link-icon">⌂</span>
                  <span><strong>My properties</strong><small>{ownerProperties.length} listing{ownerProperties.length === 1 ? "" : "s"} in your workspace</small></span>
                  <b>→</b>
                </button>
                <button className="owner-overview-link" onClick={() => nav("/owner/bookings")}>
                  <span className="owner-overview-link-icon">▤</span>
                  <span><strong>Booking requests</strong><small>{pendingBookingCount ? `${pendingBookingCount} need a response` : "All caught up"}</small></span>
                  <b>→</b>
                </button>
                <button className="owner-btn owner-btn-primary owner-overview-add" onClick={() => nav("/owner/properties/new")}>＋ Add a property</button>
              </div>
            </section>
          </>
        )}
        <footer className="owner-footer">StayMate · Find a place that feels like home <span>Phase 2 prototype</span></footer>
      </main>
    </div>
  );
}

export default OwnerDashboard;
