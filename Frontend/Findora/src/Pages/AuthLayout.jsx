import "./auth.css";
import { PinIcon, SparkIcon, CapIcon } from "./Icons";
import HeroArt from "./HeroArt";
 
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth__hero">
        <div className="brand">
          <span className="brand__icon"><PinIcon /></span> findora
        </div>
        <div className="eyebrow">A LITTLE LOST. A LOT CONNECTED.</div>
        <h2 className="hero__title">
          Lost something?<br />Find your <span>way back.</span>
        </h2>
        <p className="hero__sub">
          Your campus community, bringing lost belongings back to their owners.
        </p>
        <div className="hero__art">
          <HeroArt />
        </div>
        <div className="hero__foot"><CapIcon /> Made for the SIBAU Khairpur Campus community.</div>
      </aside>
 
      <main className="auth__main">
        <section className="card">
          <div className="card__badge"><SparkIcon /></div>
          <h1 className="card__title">{title}</h1>
          <p className="card__sub">{subtitle}</p>
          {children}
          <p className="card__foot">{footer}</p>
        </section>
      </main>
    </div>
  );
}
 