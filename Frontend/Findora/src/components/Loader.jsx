import "./Loader.css";

function Loader() {
  const letters = "findora".split("");

  return (
    <div className="fl-wrap" role="status" aria-live="polite" aria-label="Loading Findora">
      <div className="fl-word" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="fl-letter" style={{ "--i": i }}>
            {ch}
          </span>
        ))}
        <span className="fl-dot">.</span>
      </div>
    </div>
  );
}

export default Loader;