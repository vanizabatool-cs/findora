import Items from "../components/Items";

function MyReports() {
    return (
        <>
            <section className="discover-section" id="my-reports-section">
                <div className="section-intro">
                    <div>
                        <span className="eyebrow">YOUR ACCOUNT</span>
                        <h2>My reports</h2>
                        <p>Manage your lost and found reports and review possible matches.</p>
                    </div>
                    <span className="section-number">MY / REPORTS</span>
                </div>
            </section>
            <section className="items-section">
                <Items mine showMatches />
            </section>
        </>
    );
}

export default MyReports;
