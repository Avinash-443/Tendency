export default function Field({ label, required, children }) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
      {children}
    </div>
  );
}
