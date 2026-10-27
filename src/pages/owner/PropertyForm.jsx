export default function PropertyForm({ values, setValues, onSubmit, saving, submitLabel }) {
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  return (
    <form className="owner-panel owner-property-form" onSubmit={onSubmit}>
      <div className="owner-form-grid">
        <label>Property name *<input name="name" value={values.name} onChange={update} required placeholder="e.g. Green View PG" /></label>
        <label>Property type *<select name="type" value={values.type} onChange={update}><option>PG</option><option>Flat</option><option>Hostel</option><option>Studio apartment</option></select></label>
        <label className="owner-field-full">Location *<input name="location" value={values.location} onChange={update} required placeholder="City / area" /></label>
        <label>Monthly rent (₹) *<input type="number" min="0" name="price" value={values.price} onChange={update} required /></label>
        <label>Rating<input type="number" min="0" max="5" step="0.1" name="rating" value={values.rating} onChange={update} /></label>
        <label>Reviews<input type="number" min="0" name="reviews" value={values.reviews} onChange={update} /></label>
        <label>Availability<select name="status" value={values.status} onChange={update}><option>Available</option><option>Unavailable</option></select></label>
        <label className="owner-field-full">Image URL<input type="url" name="image" value={values.image} onChange={update} placeholder="https://…" /></label>
        <label className="owner-field-full">Amenities<input name="amenities" value={values.amenities} onChange={update} placeholder="Wi-Fi, AC, laundry (comma-separated)" /></label>
        <label className="owner-field-full">Description<textarea name="description" value={values.description} onChange={update} rows="4" /></label>
      </div>
      <div className="owner-form-footer"><span className="owner-muted">Fields marked * are required.</span><div className="owner-row-actions"><button type="button" className="owner-btn owner-btn-light" onClick={() => window.history.back()}>Cancel</button><button className="owner-btn owner-btn-primary" disabled={saving}>{saving ? "Saving…" : submitLabel}</button></div></div>
    </form>
  );
}
