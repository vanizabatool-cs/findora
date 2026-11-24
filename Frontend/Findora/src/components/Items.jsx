import axios from "axios";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserProvider";
import { Link } from "react-router-dom";
import { API_URL, getImageUrl } from "../utils/api";

function Items({ type, mine = false, filters, onResultsChange, showMatches = false }) {
    const [items, setItems] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [claimingId, setClaimingId] = useState("");
    const { user } = useContext(UserContext);

    const getMatches = useCallback(async () => {
        if (!showMatches) return;
        try {
            const response = await axios.get(`${API_URL}/item/matches/mine`, {
                withCredentials: true
            });
            setMatches(response.data.matches || []);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    }, [showMatches]);

    const getItems = useCallback(async () => {
        try {
            const response = mine
                ? await axios.get(`${API_URL}/item/mine`, { withCredentials: true })
                : await axios.get(`${API_URL}/item`, {
                    params: type ? { type } : {},
                    withCredentials: true
                });
            setError("");
            setItems(response.data.Items || []);
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
        await getMatches();
    }, [getMatches, mine, type]);

    useEffect(() => {
        getItems();
        window.addEventListener("findora:reports-changed", getItems);
        return () => window.removeEventListener("findora:reports-changed", getItems);
    }, [getItems]);

    const visibleItems = useMemo(() => {
        const search = filters?.search?.trim().toLowerCase() || "";
        return items.filter((item) => {
            const matchesSearch = !search || [
                item.name,
                item.description,
                item.category,
                item.color,
                item.location
            ].some((value) => String(value || "").toLowerCase().includes(search));
            const matchesType = !filters?.type || filters.type === "All" ||
                item.type?.toLowerCase() === filters.type.toLowerCase();
            const matchesCategory = !filters?.category || filters.category === "All" ||
                item.category === filters.category;
            const matchesColor = !filters?.color || filters.color === "All" ||
                item.color?.toLowerCase() === filters.color.toLowerCase();
            const matchesLocation = !filters?.location || filters.location === "All" ||
                item.location?.toLowerCase() === filters.location.toLowerCase();

            return matchesSearch && matchesType && matchesCategory && matchesColor && matchesLocation;
        });
    }, [filters, items]);

    useEffect(() => {
        onResultsChange?.(visibleItems.length);
    }, [onResultsChange, visibleItems.length]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            const response = await axios.delete(`${API_URL}/item/delete/${id}`, {
                withCredentials: true
            });
            toast.success(response.data.message || "Item deleted");
            setItems((previous) => previous.filter((item) => item._id !== id));
            window.dispatchEvent(new Event("findora:reports-changed"));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const handleResolve = async (item) => {
        try {
            const response = await axios.put(`${API_URL}/item/update/${item._id}`, {
                status: "resolved"
            }, { withCredentials: true });
            toast.success(response.data.message || "Report marked as resolved");
            setItems((previous) => previous.map((entry) =>
                entry._id === item._id ? { ...entry, status: "resolved" } : entry
            ));
            window.dispatchEvent(new Event("findora:reports-changed"));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const handleEdit = async (item) => {
        const reportDate = item.date && !Number.isNaN(new Date(item.date).getTime())
            ? new Date(item.date).toISOString().slice(0, 10)
            : "";
        const fields = {
            name: ["Item name", item.name],
            description: ["Description", item.description || ""],
            category: ["Category", item.category],
            color: ["Colour", item.color || ""],
            location: ["Location", item.location || ""],
            date: ["Date (YYYY-MM-DD)", reportDate],
            type: ["Type (Lost or Found)", item.type]
        };
        const updatedData = {};
        for (const [field, [label, currentValue]] of Object.entries(fields)) {
            const value = window.prompt(label, currentValue);
            if (value === null) return;
            updatedData[field] = value;
        }

        try {
            const response = await axios.put(
                `${API_URL}/item/update/${item._id}`,
                updatedData,
                { withCredentials: true }
            );
            toast.success(response.data.message || "Report updated");
            setItems((previous) => previous.map((entry) =>
                entry._id === item._id
                    ? { ...entry, ...response.data.item, postedBy: entry.postedBy }
                    : entry
            ));
            window.dispatchEvent(new Event("findora:reports-changed"));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const handleClaim = async (matchId) => {
        setClaimingId(matchId);
        try {
            const response = await axios.post(
                `${API_URL}/item/matches/${matchId}/claim`,
                {},
                { withCredentials: true }
            );
            toast.success(response.data.message || "Claim submitted");
            await getMatches();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setClaimingId("");
        }
    };

    if (loading) {
        return <div className="items-box"><p className="items-empty">Loading reports...</p></div>;
    }

    if (error) {
        return <div className="items-box"><p className="items-empty" role="alert">{error}</p></div>;
    }

    if (items.length === 0) {
        const message = mine
            ? "You haven't posted any reports yet."
            : type === "found"
                ? "No found items have been reported yet."
                : "No reports posted yet.";
        return <div className="items-box"><p className="items-empty">{message}</p></div>;
    }

    return (
        <div className="items-box">
            {visibleItems.length === 0 ? (
                <p className="items-empty">No reports match your search.</p>
            ) : (
                <div className="items-grid">
                    {visibleItems.map((item) => {
                        const isOwner = user && item.postedBy?._id === user._id;
                        const itemMatches = matches.filter((match) =>
                            mine
                                ? match.lostItem?._id === item._id || match.foundItem?._id === item._id
                                : match.foundItem?._id === item._id
                        );
                        const typeClass = item.type?.toLowerCase();

                        return (
                            <div className={`item-card ${typeClass}`} key={item._id}>
                                <div className="item-card-header">
                                    <span className={`item-status ${typeClass}`}>{item.type}</span>
                                    <span className="item-category">{item.category}</span>
                                </div>

                                {item.imageUrl && (
                                    <img className="item-photo" src={getImageUrl(item.imageUrl)} alt={`Photo of ${item.name}`} loading="lazy" />
                                )}

                                <div className="item-card-body">
                                    <h3>{item.name}</h3>
                                    <p className="item-description">{item.description || "No description provided."}</p>

                                    <div className="item-meta">
                                        <p><strong>Location:</strong> {item.location}</p>
                                        <p><strong>Colour:</strong> {item.color || "Not specified"}</p>
                                        <p><strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : "Not specified"}</p>
                                        <p><strong>Posted by:</strong> {item.postedBy?.username || "Findora user"}</p>
                                        <p><strong>Status:</strong> {item.status}</p>
                                    </div>

                                    {itemMatches.map((match) => {
                                        const lostOwner = match.lostItem?.postedBy?._id === user?._id;
                                        return (
                                            <div key={match._id}>
                                                <p>
                                                    <strong>Possible match:</strong>{" "}
                                                    {match.lostItem?.name} / {match.foundItem?.name} ({match.similarity}%)
                                                </p>
                                                <p><strong>Match status:</strong> {match.status}</p>
                                                {lostOwner && match.status === "open" && (
                                                    <button
                                                        type="button"
                                                        className="view-btn"
                                                        disabled={claimingId === match._id}
                                                        onClick={() => handleClaim(match._id)}
                                                    >
                                                        {claimingId === match._id ? "Submitting..." : "Claim"}
                                                    </button>
                                                )}
                                                {match.claimant && (
                                                    <p>
                                                        <strong>Claim request from:</strong>{" "}
                                                        {match.claimant.username} ({match.claimant.email})
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="item-card-footer">
                                    <Link to={`/items/${item._id}`} className="view-btn">
                                        View Details
                                    </Link>
                                    {isOwner && mine && item.status === "active" && (
                                        <button
                                            className="view-btn"
                                            type="button"
                                            onClick={() => handleResolve(item)}
                                        >
                                            Resolve
                                        </button>
                                    )}
                                    {isOwner && mine && (
                                        <button
                                            className="view-btn"
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {isOwner && (
                                        <button
                                            className="delete-btn"
                                            type="button"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Items;
