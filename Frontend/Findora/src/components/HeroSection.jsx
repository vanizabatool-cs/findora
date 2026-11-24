import "./HomePage.css"
import Navbar from "./Navbar";

function HeroSection(){
    return(
        <>
    <main className="page-container">
    {/* INTRO HERO */}
    <section className="page-hero">
      <div className="hero-copy">
        <span className="eyebrow">SIBAU · KHAIRPUR CAMPUS</span>
        <h1>
          Lost something?
          <br />
          <span>Let's find its way home.</span>
        </h1>
        <p>
          Report a lost or found item, explore campus reports, and help your
          university community reconnect with the things that matter.
        </p>
        <div className="hero-actions">
          <a href="#report-form-section" className="primary-button">
            ＋ Create a report
          </a>
          <a href="#discover-section" className="secondary-button">
            Explore reports ↓
          </a>
        </div>
      </div>
      <div className="hero-illustration" aria-hidden="true">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-object object-bag">🎒</div>
        <div className="hero-object object-key">🔑</div>
        <div className="hero-object object-book">📚</div>
        <span className="hero-star star-one">✦</span>
        <span className="hero-star star-two">✧</span>
      </div>
    </section>
  </main>
</>
    )
}

export default HeroSection;