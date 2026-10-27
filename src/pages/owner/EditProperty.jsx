import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProperties } from "../../context/PropertyContext";
import PropertyForm from "./PropertyForm";
import "./OwnerPages.css";
export default function EditProperty() {
  const { id } = useParams(); const { properties, loading, error: loadError, updateProperty } = useProperties();
  const [values, setValues] = useState(null); const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const navigate = useNavigate();
  useEffect(() => { const p = properties.find(item => String(item.id) === String(id)); if (p) setValues({ name: p.name || "", type: p.type || "PG", location: p.location || "", price: p.price ?? "", rating: p.rating ?? 0, reviews: p.reviews ?? 0, status: p.status || "Available", amenities: Array.isArray(p.amenities) ? p.amenities.join(", ") : p.amenities || "", description: p.description || "", image: p.image || "" }); }, [properties, id]);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(""); try { await updateProperty(id, { ...values, price: Number(values.price), rating: Number(values.rating || 0), reviews: Number(values.reviews || 0), amenities: values.amenities.split(",").map(x => x.trim()).filter(Boolean) }); navigate("/owner"); } catch (err) { setError(err.message || "Unable to update property."); } finally { setSaving(false); } };
  return <main className="owner-shell"><header className="owner-topbar"><Link to="/owner" className="owner-brand">Stay<span>Mate</span></Link><Link to="/owner" className="owner-back-link">← Back to dashboard</Link></header><section className="owner-content owner-form-content"><p className="owner-eyebrow">PROPERTY MANAGEMENT</p><h1>Edit property</h1><p className="owner-muted">Update the listing details and save your changes.</p>{(loadError || error) && <div className="owner-alert owner-alert-error">{error || loadError}</div>}{loading ? <div className="owner-panel owner-empty">Loading property…</div> : values ? <PropertyForm values={values} setValues={setValues} onSubmit={submit} saving={saving} submitLabel="Save changes" /> : <div className="owner-panel owner-empty"><h3>Property not found</h3><Link className="owner-btn owner-btn-primary" to="/owner">Return to dashboard</Link></div>}</section></main>;
}
