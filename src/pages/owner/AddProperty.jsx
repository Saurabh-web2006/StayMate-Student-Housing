import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProperties } from "../../context/PropertyContext";
import PropertyForm from "./PropertyForm";
import "./OwnerPages.css";
const blank = { name: "", type: "PG", location: "", price: "", rating: "0", reviews: "0", status: "Available", amenities: "", description: "", image: "" };
export default function AddProperty() {
  const [values, setValues] = useState(blank); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const { addProperty } = useProperties(); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(""); try { await addProperty({ ...values, price: Number(values.price), rating: Number(values.rating || 0), reviews: Number(values.reviews || 0), amenities: values.amenities.split(",").map(x => x.trim()).filter(Boolean) }); navigate("/owner"); } catch (err) { setError(err.message || "Unable to save property. Check the API."); } finally { setSaving(false); } };
  return <main className="owner-shell"><header className="owner-topbar"><Link to="/owner" className="owner-brand">Stay<span>Mate</span></Link><Link to="/owner" className="owner-back-link">← Back to dashboard</Link></header><section className="owner-content owner-form-content"><p className="owner-eyebrow">PROPERTY MANAGEMENT</p><h1>Add a property</h1><p className="owner-muted">Enter the details students need to find their next place.</p>{error && <div className="owner-alert owner-alert-error">{error}</div>}<PropertyForm values={values} setValues={setValues} onSubmit={submit} saving={saving} submitLabel="Add property" /></section></main>;
}
