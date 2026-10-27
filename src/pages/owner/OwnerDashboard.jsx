import { useNavigate } from "react-router-dom";
import { useProperties } from "../../context/PropertyContext";
import "./OwnerPages.css";

export default function OwnerDashboard({ onLogout }) {
  const { properties, loading, error, deleteProperty, refreshProperties } = useProperties();
  const navigate = useNavigate();
  const remove = async (property) => {
    if (!window.confirm(`Delete “${property.name || "this property"}”?`)) return;
    try { await deleteProperty(property.id); }
    catch (err) { window.alert(err.message || "Could not delete property."); }
  };
  return <main className="owner-shell">
    <header className="owner-topbar"><a href="/owner" className="owner-brand">Stay<span>Mate</span></a><button className="owner-back-link owner-logout" onClick={onLogout}>Log out</button></header>
    <section className="owner-content">
      <div className="owner-heading-row"><div><p className="owner-eyebrow">PROPERTY MANAGEMENT</p><h1>Owner Dashboard</h1><p className="owner-muted">Manage your listings, update details, and keep availability current.</p></div><button className="owner-btn owner-btn-primary" onClick={() => navigate("/owner/add-property")}>＋ Add Property</button></div>
      <div className="owner-stat-grid">
        <article className="owner-stat-card"><span>Total properties</span><strong>{properties.length}</strong><small>Your current listings</small></article>
        <article className="owner-stat-card"><span>Available listings</span><strong>{properties.filter(p => (p.status || "Available") === "Available").length}</strong><small>Open for students</small></article>
        <article className="owner-stat-card"><span>Average monthly rent</span><strong>₹{properties.length ? Math.round(properties.reduce((sum, p) => sum + Number(p.price || 0), 0) / properties.length).toLocaleString("en-IN") : 0}</strong><small>Per listing</small></article>
      </div>
      <section className="owner-panel"><div className="owner-panel-heading"><div><h2>Your properties</h2><p className="owner-muted">Add, edit, or remove a listing.</p></div><button className="owner-btn owner-btn-light" onClick={() => navigate("/owner/add-property")}>Add new listing</button></div>
        {error && <div className="owner-alert owner-alert-error">{error} <button className="owner-btn owner-btn-light" onClick={refreshProperties}>Try again</button></div>}
        {loading ? <p className="owner-empty">Loading properties…</p> : properties.length === 0 ? <div className="owner-empty"><div className="owner-empty-icon">⌂</div><h3>No properties listed yet</h3><p>Add your first PG or flat.</p><button className="owner-btn owner-btn-primary" onClick={() => navigate("/owner/add-property")}>＋ Add your first property</button></div> :
          <div className="owner-table-wrap"><table className="owner-table"><thead><tr><th>Property</th><th>Location</th><th>Monthly rent</th><th>Status</th><th>Actions</th></tr></thead><tbody>{properties.map(p => <tr key={p.id}><td><div className="owner-property-name">{p.name || "Untitled property"}</div><div className="owner-property-type">{p.type || "PG / Flat"}</div></td><td>{p.location || "—"}</td><td>₹{Number(p.price || 0).toLocaleString("en-IN")}</td><td><span className={`owner-status ${(p.status || "Available") === "Available" ? "is-available" : "is-unavailable"}`}>{p.status || "Available"}</span></td><td><div className="owner-row-actions"><button className="owner-btn owner-btn-small owner-btn-light" onClick={() => navigate(`/owner/edit-property/${p.id}`)}>Edit</button><button className="owner-btn owner-btn-small owner-btn-danger" onClick={() => remove(p)}>Delete</button></div></td></tr>)}</tbody></table></div>}
      </section>
    </section>
  </main>;
}
