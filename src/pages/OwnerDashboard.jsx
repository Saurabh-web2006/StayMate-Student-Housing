import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
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

function Field({ label, error, children }) {
  return (
    <label className="owner-field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

function PropertyForm({ editing, property, onSave, onCancel, saving, error }) {
  const [values, setValues] = useState(() => property ? {
    ...blankForm,
    ...property,
    amenities: Array.isArray(property.amenities) ? property.amenities.join(", ") : property.amenities || "",
    availableRooms: String(property.availableRooms ?? 3),
  } : blankForm);
  const [errors, setErrors] = useState({});

  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter a property name.";
    if (!values.location.trim()) nextErrors.location = "Enter the property location.";
    if (!values.price || Number(values.price) <= 0) nextErrors.price = "Price must be greater than ₹0.";
    if (!values.availableRooms || Number(values.availableRooms) < 0) nextErrors.availableRooms = "Enter 0 or more available rooms.";
    if (!values.image.trim()) nextErrors.image = "Add an image path or URL.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onSave({
      ...values,
      price: Number(values.price),
      availableRooms: Number(values.availableRooms),
      amenities: values.amenities.split(",").map((item) => item.trim()).filter(Boolean),
      ownerId: property?.ownerId || "owner-1",
      rating: property?.rating ?? 0,
      reviews: property?.reviews ?? 0,
      verified: property?.verified ?? false,
    });
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
      <form className="owner-form" onSubmit={submit} noValidate>
        <Field label="Property name *" error={errors.name}>
          <input name="name" value={values.name} onChange={change} placeholder="e.g. Campus Comfort" />
        </Field>
        <Field label="Location *" error={errors.location}>
          <input name="location" value={values.location} onChange={change} placeholder="Rajpura, Punjab" />
        </Field>
        <Field label="Distance from college">
          <input name="distance" value={values.distance || ""} onChange={change} placeholder="e.g. 800 m from campus" />
        </Field>
        <Field label="Monthly rent (₹) *" error={errors.price}>
          <input name="price" type="number" min="1" value={values.price} onChange={change} placeholder="8500" />
        </Field>
        <Field label="Property type">
          <select name="type" value={values.type} onChange={change}>
            <option>Boys PG</option><option>Girls PG</option><option>Co-living</option><option>Flat</option>
          </select>
        </Field>
        <Field label="Room type">
          <select name="room" value={values.room} onChange={change}>
            <option>Single</option><option>Double</option><option>Triple</option><option>Single Room</option><option>Double Sharing</option>
          </select>
        </Field>
        <Field label="Available rooms *" error={errors.availableRooms}>
          <input name="availableRooms" type="number" min="0" value={values.availableRooms} onChange={change} />
        </Field>
        <Field label="Image path or URL *" error={errors.image}>
          <input name="image" value={values.image || ""} onChange={change} placeholder="/src/assets/pg1.jpg" />
        </Field>
        <Field label="Amenities (comma separated)">
          <input name="amenities" value={values.amenities || ""} onChange={change} placeholder="WiFi, Food, AC, Laundry" />
        </Field>
        <Field label="Description">
          <textarea name="description" value={values.description || ""} onChange={change} rows="4" placeholder="Tell students about the rooms, rules and facilities." />
        </Field>
        <div className="owner-form-actions">
          <button className="owner-btn owner-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Publish listing"}</button>
          <button className="owner-btn owner-btn-ghost" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  );
}

function OwnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const editMatch = location.pathname.match(/\/owner\/properties\/([^/]+)\/edit$/);
  const id = editMatch?.[1];
  const { properties, loading, error, addProperty, updateProperty, deleteProperty, refreshProperties } = useProperties();
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const ownerProperties = useMemo(
    () => properties.filter((property) => !property.ownerId || property.ownerId === "owner-1"),
    [properties]
  );
  const activeCount = ownerProperties.filter((property) => property.status !== "Unavailable").length;
  const monthlyPotential = ownerProperties.reduce((total, property) => total + Number(property.price || 0) * Number(property.availableRooms || 0), 0);
  const isForm = location.pathname.endsWith("/new") || Boolean(editMatch);
  const editing = /\/edit$/.test(location.pathname);
  const editingProperty = editing ? ownerProperties.find((property) => String(property.id) === String(id)) : null;

  const save = async (values) => {
    setSaving(true);
    setActionError("");
    try {
      if (editing && editingProperty) await updateProperty(editingProperty.id, values);
      else await addProperty(values);
      navigate("/owner/properties");
    } catch {
      setActionError("Could not save this listing. Check that JSON Server is running and try again.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (property) => {
    if (!window.confirm(`Delete "${property.name}"? This cannot be undone.`)) return;
    setActionError("");
    try { await deleteProperty(property.id); }
    catch { setActionError("Could not delete the listing. Please try again."); }
  };

  const nav = (path) => navigate(path);
  const activeTab = location.pathname.includes("/properties") ? "properties" : "overview";

  return (
    <div className="owner-app">
      <aside className="owner-sidebar">
        <button className="owner-brand" onClick={() => nav("/owner")} aria-label="StayMate owner dashboard">
          <span className="owner-brand-mark">S</span><span>Stay<strong>Mate</strong><small>HOST SPACE</small></span>
        </button>
        <div className="owner-profile">
          <div className="owner-avatar">SM</div>
          <div><strong>Property Owner</strong><small>Host account</small></div>
        </div>
        <p className="owner-nav-label">WORKSPACE</p>
        <button className={`owner-nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => nav("/owner")}>▦ <span>Overview</span></button>
        <button className={`owner-nav-item ${activeTab === "properties" ? "active" : ""}`} onClick={() => nav("/owner/properties")}>⌂ <span>My properties</span><b>{ownerProperties.length}</b></button>
        <button className="owner-nav-item" onClick={() => nav("/owner/properties/new")}>＋ <span>Add a listing</span></button>
        <div className="owner-sidebar-bottom">
          <div className="owner-help-card"><span>✦</span><strong>Hosting tip</strong><p>Clear photos and accurate room availability help students choose confidently.</p></div>
          <button className="owner-nav-item" onClick={() => nav("/")}>↩ <span>Switch role</span></button>
          <button className="owner-nav-item" onClick={() => nav("/")}>⇥ <span>Log out</span></button>
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
          <PropertyForm editing={editing} property={editingProperty} onSave={save} onCancel={() => nav("/owner/properties")} saving={saving} error={actionError} />
        ) : activeTab === "properties" ? (
          <section className="owner-panel">
            <div className="owner-panel-heading"><div><p className="owner-eyebrow">YOUR PORTFOLIO</p><h2>Property listings <span className="owner-count">{ownerProperties.length}</span></h2><p className="owner-muted">Create, update or remove the stays you manage.</p></div><button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties/new")}>＋ New listing</button></div>
            {actionError && <div className="owner-alert owner-alert-error">{actionError}</div>}
            {ownerProperties.length === 0 ? <div className="owner-empty"><span>⌂</span><h3>No properties yet</h3><p>Add your first listing to get started.</p><button className="owner-btn owner-btn-primary" onClick={() => nav("/owner/properties/new")}>Add property</button></div> : (
              <div className="owner-table-wrap"><table className="owner-table"><thead><tr><th>PROPERTY</th><th>MONTHLY RENT</th><th>ROOMS AVAILABLE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>
                {ownerProperties.map((property) => <tr key={property.id}>
                  <td><div className="owner-property-cell"><img src={property.image} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /><div><strong>{property.name}</strong><small>{property.location}</small></div></div></td>
                  <td>₹{Number(property.price).toLocaleString("en-IN")}<small className="table-subtext">/ month</small></td>
                  <td>{property.availableRooms ?? "—"}</td>
                  <td><span className={`owner-pill ${property.status === "Unavailable" ? "muted" : "good"}`}>{property.status || "Active"}</span></td>
                  <td><div className="owner-row-actions"><button onClick={() => nav(`/owner/properties/${property.id}/edit`)}>Edit</button><button className="danger" onClick={() => remove(property)}>Delete</button></div></td>
                </tr>)}
              </tbody></table></div>
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
          </>
        )}
        <footer className="owner-footer">StayMate · Find a place that feels like home <span>Phase 2 prototype</span></footer>
      </main>
    </div>
  );
}

export default OwnerDashboard;
