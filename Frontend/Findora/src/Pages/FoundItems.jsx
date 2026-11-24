import Items from "../components/Items";

function FoundItems() {
    return (
        <>
            <section className="discover-section" id="found-items-section">
                <div className="section-intro">
                    <div>
                        <span className="eyebrow">CAMPUS COMMUNITY</span>
                        <h2>Found items</h2>
                        <p>Browse active items reported by people in your community.</p>
                    </div>
                    <span className="section-number">FOUND / ITEMS</span>
                </div>
            </section>
            <section className="items-section">
                <Items type="found" showMatches />
            </section>
        </>
    );
}

export default FoundItems;
