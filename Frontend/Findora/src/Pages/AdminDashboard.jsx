import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserProvider";
import { getImageUrl } from "../utils/api";
import {
    deleteAdminItem,
    deleteAdminUser,
    fetchAdminData,
    updateAdminItemStatus,
    updateAdminMatch
} from "../utils/adminApi";
import "./AdminDashboard.css";

const pageTitles = {
    overview: "Dashboard",
    users: "Users",
    reports: "Reports",
    matches: "Possible matches"
};

const formatDate = (date) => {
    if (!date) return "Not specified";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
        ? "Not specified"
        : parsedDate.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
};

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || "The request could not be completed.";

function AdminDashboard() {
    const { user, loading: userLoading } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [matches, setMatches] = useState([]);
    const [page, setPage] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [actionKey, setActionKey] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [reportSearch, setReportSearch] = useState("");
    const [reportType, setReportType] = useState("all");
    const [reportStatus, setReportStatus] = useState("all");
    const [matchStatus, setMatchStatus] = useState("all");

    const loadData = useCallback(() => fetchAdminData(), []);

    const applyData = useCallback((data) => {
        setUsers(data.users);
        setItems(data.items);
        setMatches(data.matches);
        setLoadError("");
    }, []);

    const handleLoadError = useCallback((error) => {
        const message = getErrorMessage(error);
        setLoadError(message);
        toast.error(message);
    }, []);

    const refreshData = () => {
        setLoading(true);
        setLoadError("");
        return loadData()
            .then(applyData)
            .catch(handleLoadError)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (user?.role !== "admin") return;
        loadData()
            .then(applyData)
            .catch(handleLoadError)
            .finally(() => setLoading(false));
    }, [user, loadData, applyData, handleLoadError]);

    const filteredUsers = useMemo(() => {
        const query = userSearch.trim().toLowerCase();
        if (!query) return users;
        return users.filter((target) =>
            `${target.username} ${target.email}`.toLowerCase().includes(query)
        );
    }, [users, userSearch]);

    const filteredItems = useMemo(() => {
        const query = reportSearch.trim().toLowerCase();
        return items.filter((item) => {
            const matchesQuery = !query ||
                `${item.name} ${item.category} ${item.location} ${item.postedBy?.username || ""} ${item.postedBy?.email || ""}`
                    .toLowerCase()
                    .includes(query);
            return matchesQuery &&
                (reportType === "all" || item.type === reportType) &&
                (reportStatus === "all" || item.status === reportStatus);
        });
    }, [items, reportSearch, reportStatus, reportType]);

    const filteredMatches = useMemo(
        () => matches.filter((match) => matchStatus === "all" || match.status === matchStatus),
        [matches, matchStatus]
    );

    if (userLoading) return <p className="admin-message">Loading account...</p>;
    if (user?.role !== "admin") return <Navigate to="/home" replace />;

    const performAction = async (key, action, successMessage) => {
        setActionKey(key);
        try {
            const response = await action();
            toast.success(response.data.message || successMessage);
            await refreshData();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setActionKey("");
        }
    };

    const handleDeleteUser = (target) => {
        if (!window.confirm(
            `Delete ${target.username} and their account? Their reports and related matches will also be deleted. This cannot be undone.`
        )) return;
        performAction(`user-${target._id}`, () => deleteAdminUser(target._id), "User deleted.");
    };

    const handleDeleteItem = (item) => {
        if (!window.confirm(
            `Delete the ${item.type} report for "${item.name}"? Related matches will also be deleted. This cannot be undone.`
        )) return;
        performAction(`item-${item._id}`, () => deleteAdminItem(item._id), "Report deleted.");
    };

    const handleStatusChange = (item) => {
        const nextStatus = item.status === "active" ? "resolved" : "active";
        const actionLabel = nextStatus === "resolved" ? "mark as resolved" : "reopen";
        if (!window.confirm(`Are you sure you want to ${actionLabel} "${item.name}"?`)) return;
        performAction(
            `status-${item._id}`,
            () => updateAdminItemStatus(item._id, nextStatus),
            "Report status updated."
        );
    };

    const handleMatchAction = (match, action) => {
        const isResolve = action === "resolve";
        const description = isResolve
            ? "Resolve this claim and mark both reports resolved?"
            : "Dismiss this possible match?";
        if (!window.confirm(description)) return;
        performAction(
            `match-${match._id}`,
            () => updateAdminMatch(match._id, action),
            isResolve ? "Claim resolved." : "Match dismissed."
        );
    };

    const exportData = () => {
        const file = new Blob(
            [JSON.stringify({ exportedAt: new Date().toISOString(), users, items, matches }, null, 2)],
            { type: "application/json" }
        );
        const downloadUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `findora-admin-export-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    };

    const activeLost = items.filter((item) => item.type === "lost" && item.status === "active").length;
    const activeFound = items.filter((item) => item.type === "found" && item.status === "active").length;
    const resolvedReports = items.filter((item) => item.status === "resolved").length;
    const pendingMatches = matches.filter((match) => ["open", "claimed"].includes(match.status)).length;
    const recentItems = [...items]
        .sort((first, second) => new Date(second.date) - new Date(first.date))
        .slice(0, 5);

    return (
        <main className="admin-dashboard">
            <div className="admin-shell">
                <aside className="admin-sidebar" aria-label="Admin navigation">
                    <div className="admin-brand">
                        <span className="admin-brand-mark" aria-hidden="true">F</span>
                        <span>findora<span className="admin-brand-dot">.</span></span>
                    </div>
                    <p className="admin-campus">Campus administration</p>
                    <span className="admin-nav-label">Workspace</span>
                    {Object.entries(pageTitles).map(([key, title]) => (
                        <button
                            key={key}
                            type="button"
                            className={`admin-nav-link${page === key ? " is-active" : ""}`}
                            aria-current={page === key ? "page" : undefined}
                            onClick={() => setPage(key)}
                        >
                            <span className="admin-nav-icon" aria-hidden="true">
                                {key === "overview" ? "▦" : key === "users" ? "♙" : key === "reports" ? "▤" : "⇄"}
                            </span>
                            <span>{title}</span>
                            {key === "users" && <span className="admin-nav-count">{users.length}</span>}
                            {key === "reports" && <span className="admin-nav-count">{items.length}</span>}
                            {key === "matches" && <span className="admin-nav-count">{pendingMatches}</span>}
                        </button>
                    ))}
                    <div className="admin-sidebar-foot">
                        <span className="admin-avatar" aria-hidden="true">
                            {(user.username || "A").slice(0, 1).toUpperCase()}
                        </span>
                        <span className="admin-account">
                            <strong>{user.username}</strong>
                            <small>Administrator</small>
                        </span>
                    </div>
                </aside>

                <section className="admin-main">
                    <header className="admin-topbar">
                        <div>
                            <span className="admin-breadcrumb">Findora <span>/</span> {pageTitles[page]}</span>
                            <h1>{pageTitles[page]}</h1>
                        </div>
                        <div className="admin-top-actions">
                            {page === "overview" && (
                                <button className="admin-button admin-button-secondary" type="button" onClick={exportData} disabled={loading || !items.length && !users.length}>
                                    Export data
                                </button>
                            )}
                            <button className="admin-button admin-button-primary" type="button" onClick={refreshData} disabled={loading}>
                                <span aria-hidden="true">↻</span> {loading ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>
                    </header>

                    <div className="admin-content">
                        {loadError && (
                            <div className="admin-error" role="alert">
                                <div><strong>Couldn’t load admin data</strong><span>{loadError}</span></div>
                                <button className="admin-button admin-button-secondary" type="button" onClick={refreshData} disabled={loading}>
                                    Try again
                                </button>
                            </div>
                        )}

                        {page === "overview" && (
                            <>
                                <div className="admin-welcome">
                                    <div>
                                        <span className="admin-eyebrow">Campus overview</span>
                                        <h2>Welcome back, {user.username}</h2>
                                        <p>Here’s what’s happening across your lost and found community.</p>
                                    </div>
                                    <span className="admin-welcome-art" aria-hidden="true">✦</span>
                                </div>

                                <div className="admin-stats">
                                    <article className="admin-stat admin-stat-purple">
                                        <span className="admin-stat-icon" aria-hidden="true">♙</span>
                                        <span className="admin-stat-label">Students</span>
                                        <strong>{users.length}</strong>
                                        <small>Registered accounts</small>
                                    </article>
                                    <article className="admin-stat admin-stat-peach">
                                        <span className="admin-stat-icon" aria-hidden="true">⌕</span>
                                        <span className="admin-stat-label">Lost items</span>
                                        <strong>{activeLost}</strong>
                                        <small>Active reports</small>
                                    </article>
                                    <article className="admin-stat admin-stat-mint">
                                        <span className="admin-stat-icon" aria-hidden="true">♡</span>
                                        <span className="admin-stat-label">Found items</span>
                                        <strong>{activeFound}</strong>
                                        <small>Waiting for owners</small>
                                    </article>
                                    <article className="admin-stat admin-stat-sun">
                                        <span className="admin-stat-icon" aria-hidden="true">✓</span>
                                        <span className="admin-stat-label">Resolved</span>
                                        <strong>{resolvedReports}</strong>
                                        <small>Completed reports</small>
                                    </article>
                                    <article className="admin-stat admin-stat-rose">
                                        <span className="admin-stat-icon" aria-hidden="true">⇄</span>
                                        <span className="admin-stat-label">Matches</span>
                                        <strong>{pendingMatches}</strong>
                                        <small>Open or claimed</small>
                                    </article>
                                </div>

                                <section className="admin-card">
                                    <div className="admin-section-heading">
                                        <div><h2>Recent reports</h2><p>Latest activity from your campus community</p></div>
                                        <button className="admin-text-button" type="button" onClick={() => setPage("reports")}>View all reports <span aria-hidden="true">→</span></button>
                                    </div>
                                    {loading && !items.length ? (
                                        <p className="admin-message">Loading reports...</p>
                                    ) : recentItems.length ? (
                                        <div className="admin-recent-list">
                                            {recentItems.map((item) => (
                                                <article className="admin-recent-item" key={item._id}>
                                                    <span className={`admin-type-dot ${item.type}`} aria-hidden="true" />
                                                    <div className="admin-recent-name">
                                                        <strong>{item.name}</strong>
                                                        <span>{item.location} · {item.postedBy?.username || "Unknown reporter"}</span>
                                                    </div>
                                                    <span className={`admin-pill ${item.status === "resolved" ? "is-success" : "is-neutral"}`}>
                                                        {item.status}
                                                    </span>
                                                    <time>{formatDate(item.date)}</time>
                                                </article>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="admin-empty"><strong>No reports yet</strong><span>Reports will appear here when students add them.</span></div>
                                    )}
                                </section>
                            </>
                        )}

                        {page === "users" && (
                            <section className="admin-card">
                                <div className="admin-section-heading">
                                    <div><h2>Student accounts</h2><p>Review registered users and remove accounts when necessary.</p></div>
                                    <span className="admin-total">{users.length} total</span>
                                </div>
                                <div className="admin-toolbar">
                                    <label className="admin-search">
                                        <span aria-hidden="true">⌕</span>
                                        <input
                                            type="search"
                                            value={userSearch}
                                            onChange={(event) => setUserSearch(event.target.value)}
                                            placeholder="Search name or email"
                                            aria-label="Search users"
                                        />
                                    </label>
                                </div>
                                {loading && !users.length ? (
                                    <p className="admin-message">Loading users...</p>
                                ) : filteredUsers.length ? (
                                    <div className="admin-table-wrap">
                                        <table className="admin-table">
                                            <thead><tr><th>Student</th><th>Email</th><th>Role</th><th className="admin-align-right">Action</th></tr></thead>
                                            <tbody>
                                                {filteredUsers.map((target) => (
                                                    <tr key={target._id}>
                                                        <td><div className="admin-person"><span className="admin-avatar">{(target.username || "?").slice(0, 1).toUpperCase()}</span><strong>{target.username}</strong></div></td>
                                                        <td>{target.email}</td>
                                                        <td><span className="admin-pill is-purple">{target.role || "user"}</span></td>
                                                        <td className="admin-align-right">
                                                            <button className="admin-button admin-button-danger admin-button-small" type="button" onClick={() => handleDeleteUser(target)} disabled={Boolean(actionKey)}>
                                                                {actionKey === `user-${target._id}` ? "Deleting..." : "Delete account"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="admin-empty"><strong>No students found</strong><span>Try changing your search.</span></div>
                                )}
                            </section>
                        )}

                        {page === "reports" && (
                            <section className="admin-card">
                                <div className="admin-section-heading">
                                    <div><h2>Lost &amp; found reports</h2><p>Review, resolve, reopen, or remove campus reports.</p></div>
                                    <span className="admin-total">{items.length} total</span>
                                </div>
                                <div className="admin-toolbar">
                                    <label className="admin-search">
                                        <span aria-hidden="true">⌕</span>
                                        <input
                                            type="search"
                                            value={reportSearch}
                                            onChange={(event) => setReportSearch(event.target.value)}
                                            placeholder="Search item, location or reporter"
                                            aria-label="Search reports"
                                        />
                                    </label>
                                    <label className="admin-filter">
                                        <span className="admin-sr-only">Report type</span>
                                        <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
                                            <option value="all">All types</option>
                                            <option value="lost">Lost items</option>
                                            <option value="found">Found items</option>
                                        </select>
                                    </label>
                                    <label className="admin-filter">
                                        <span className="admin-sr-only">Report status</span>
                                        <select value={reportStatus} onChange={(event) => setReportStatus(event.target.value)}>
                                            <option value="all">All statuses</option>
                                            <option value="active">Active</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </label>
                                </div>
                                {loading && !items.length ? (
                                    <p className="admin-message">Loading reports...</p>
                                ) : filteredItems.length ? (
                                    <div className="admin-table-wrap">
                                        <table className="admin-table admin-report-table">
                                            <thead><tr><th>Item</th><th>Type</th><th>Location</th><th>Reported by</th><th>Date</th><th>Status</th><th className="admin-align-right">Actions</th></tr></thead>
                                            <tbody>
                                                {filteredItems.map((item) => (
                                                    <tr key={item._id}>
                                                        <td>
                                                            <div className="admin-item-cell">
                                                                {item.imageUrl ? <img src={getImageUrl(item.imageUrl)} alt="" /> : <span className="admin-item-placeholder" aria-hidden="true">◇</span>}
                                                                <div><strong>{item.name}</strong><small>{item.category}</small></div>
                                                            </div>
                                                        </td>
                                                        <td><span className={`admin-pill ${item.type === "lost" ? "is-peach" : "is-success"}`}>{item.type}</span></td>
                                                        <td>{item.location}</td>
                                                        <td><span className="admin-reporter">{item.postedBy?.username || "Unknown"}<small>{item.postedBy?.email || ""}</small></span></td>
                                                        <td>{formatDate(item.date)}</td>
                                                        <td><span className={`admin-pill ${item.status === "resolved" ? "is-success" : "is-neutral"}`}>{item.status}</span></td>
                                                        <td className="admin-align-right">
                                                            <div className="admin-row-actions">
                                                                <button className={`admin-button admin-button-small ${item.status === "active" ? "admin-button-success" : "admin-button-secondary"}`} type="button" onClick={() => handleStatusChange(item)} disabled={Boolean(actionKey)}>
                                                                    {actionKey === `status-${item._id}` ? "Saving..." : item.status === "active" ? "Resolve" : "Reopen"}
                                                                </button>
                                                                <button className="admin-button admin-button-danger admin-button-small" type="button" onClick={() => handleDeleteItem(item)} disabled={Boolean(actionKey)}>
                                                                    {actionKey === `item-${item._id}` ? "Deleting..." : "Delete"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="admin-empty"><strong>No matching reports</strong><span>Try another search or filter.</span></div>
                                )}
                            </section>
                        )}

                        {page === "matches" && (
                            <section className="admin-card">
                                <div className="admin-section-heading">
                                    <div><h2>Possible matches</h2><p>Review suggested matches and follow up on claims.</p></div>
                                    <label className="admin-filter">
                                        <span className="admin-sr-only">Match status</span>
                                        <select value={matchStatus} onChange={(event) => setMatchStatus(event.target.value)}>
                                            <option value="all">All statuses</option>
                                            <option value="open">Open</option>
                                            <option value="claimed">Claimed</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </label>
                                </div>
                                {loading && !matches.length ? (
                                    <p className="admin-message">Loading possible matches...</p>
                                ) : filteredMatches.length ? (
                                    <div className="admin-match-list">
                                        {filteredMatches.map((match) => (
                                            <article className="admin-match" key={match._id}>
                                                <div className="admin-match-pair">
                                                    <div className="admin-match-item is-lost">
                                                        <span>LOST</span>
                                                        <strong>{match.lostItem.name}</strong>
                                                        <small>{match.lostItem.location} · {match.lostItem.postedBy?.username || "Unknown"}</small>
                                                    </div>
                                                    <span className="admin-match-score">{match.similarity}%</span>
                                                    <div className="admin-match-item is-found">
                                                        <span>FOUND</span>
                                                        <strong>{match.foundItem.name}</strong>
                                                        <small>{match.foundItem.location} · {match.foundItem.postedBy?.username || "Unknown"}</small>
                                                    </div>
                                                </div>
                                                <div className="admin-match-footer">
                                                    <span className={`admin-pill ${match.status === "claimed" ? "is-peach" : match.status === "closed" ? "is-neutral" : "is-purple"}`}>{match.status}</span>
                                                    {match.claimedBy && <span className="admin-claimant">Claimed by {match.claimedBy.username} · {match.claimedBy.email}</span>}
                                                    <span className="admin-match-date">{formatDate(match.createdAt)}</span>
                                                    {match.status === "claimed" && (
                                                        <button className="admin-button admin-button-success admin-button-small" type="button" onClick={() => handleMatchAction(match, "resolve")} disabled={Boolean(actionKey)}>
                                                            {actionKey === `match-${match._id}` ? "Resolving..." : "Resolve claim"}
                                                        </button>
                                                    )}
                                                    {match.status === "open" && (
                                                        <button className="admin-button admin-button-danger admin-button-small" type="button" onClick={() => handleMatchAction(match, "dismiss")} disabled={Boolean(actionKey)}>
                                                            {actionKey === `match-${match._id}` ? "Dismissing..." : "Dismiss"}
                                                        </button>
                                                    )}
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="admin-empty"><strong>No matches to show</strong><span>New suggestions and claims will appear here.</span></div>
                                )}
                            </section>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AdminDashboard;
