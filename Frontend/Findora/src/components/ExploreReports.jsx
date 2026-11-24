import { useCallback, useState } from "react";
import Items from "./Items";

function ExploreReports(){
    const [filters, setFilters] = useState({
      search: "",
      type: "All",
      category: "All",
      color: "All",
      location: "All"
    });
    const [resultsCount, setResultsCount] = useState(0);
    const updateFilter = (event) => {
      const { id, value } = event.target;
      const key = {
        "search-input": "search",
        "filter-type": "type",
        "filter-category": "category",
        "filter-color": "color",
        "filter-location": "location"
      }[id];
      if (key) setFilters((previous) => ({ ...previous, [key]: value }));
    };
    const resetFilters = () => setFilters({
      search: "",
      type: "All",
      category: "All",
      color: "All",
      location: "All"
    });
    const updateResultsCount = useCallback((count) => setResultsCount(count), []);
    const hasFilters = Object.entries(filters).some(([key, value]) =>
      key === "search" ? Boolean(value.trim()) : value !== "All"
    );

    return(
        <>
  {/* DISCOVER REPORTS */}
  <section className="discover-section" id="discover-section">
    <div className="section-intro">
      <div>
        <span className="eyebrow">CAMPUS COMMUNITY</span>
        <h2>Explore reports</h2>
        <p>Maybe someone has already reported what you're looking for.</p>
      </div>
      <span className="section-number">02 / DISCOVER</span>
    </div>
    {/* SEARCH BAR */}
    <div className="search-panel">
      <div className="search-title">
        <div>
          <h3>Find an item</h3>
          <p>Search by item name, colour, category or location.</p>
        </div>
        <span className="search-decoration">⌕</span>
      </div>
      <div className="search-input-wrap">
        <span className="search-icon">⌕</span>
        <input
          type="search"
          id="search-input"
          placeholder="Try “black backpack” or “library”..."
          aria-label="Search reports"
          value={filters.search}
          onChange={updateFilter}
        />
        <button type="button" id="clear-search" className="clear-search" onClick={() => setFilters((previous) => ({ ...previous, search: "" }))}>
          Clear
        </button>
      </div>
      {/* FILTERS */}
      <div className="filters-grid">
        <div className="filter-field">
          <label htmlFor="filter-type">Report type</label>
          <select id="filter-type" value={filters.type} onChange={updateFilter}>
            <option value="All">All reports</option>
            <option value="Lost">Lost items</option>
            <option value="Found">Found items</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-category">Category</label>
          <select id="filter-category" value={filters.category} onChange={updateFilter}>
            <option value="All">All categories</option>
            <option>Bags &amp; Accessories</option>
            <option>Electronics</option>
            <option>Personal Items</option>
            <option>Books &amp; Stationery</option>
            <option>Clothing</option>
            <option>Keys &amp; Cards</option>
            <option>Documents</option>
            <option>Other</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-color">Colour</label>
          <select id="filter-color" value={filters.color} onChange={updateFilter}>
            <option value="All">All colours</option>
            <option>Black</option>
            <option>White</option>
            <option>Blue</option>
            <option>Red</option>
            <option>Green</option>
            <option>Pink</option>
            <option>Brown</option>
            <option>Other</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-location">Location</label>
          <select id="filter-location" value={filters.location} onChange={updateFilter}>
            <option value="All">All locations</option>
            <option>Academic Block</option>
            <option>Library</option>
            <option>Computer Lab</option>
            <option>Cafeteria</option>
            <option>Auditorium</option>
            <option>Sports Area</option>
            <option>Parking Area</option>
            <option>Hostel</option>
            <option>Other / Not sure</option>
          </select>
        </div>
      </div>
      <div className="filter-bottom">
        <span id="results-count" aria-live="polite">
          {hasFilters ? `Showing ${resultsCount} matching reports` : `Showing ${resultsCount} reports`}
        </span>
        <button type="button" id="reset-filters" className="reset-button" onClick={resetFilters}>
          ↺ Reset filters
        </button>
      </div>
    </div>
  </section>

  <section className="items-section">
    <Items filters={filters} onResultsChange={updateResultsCount}/>
</section>

</>

    )
}

export default ExploreReports;