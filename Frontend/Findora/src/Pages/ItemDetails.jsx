import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL, getImageUrl } from "../utils/api";

function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        axios.get(`${API_URL}/item/${id}`, { withCredentials: true })
            .then((response) => {
                if (active) setItem(response.data.item);
            })
            .catch((err) => {
                const message = err.response?.data?.message || err.message;
                if (active) {
                    setError(message);
                    toast.error(message);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [id]);

    return (
        <section className="items-section">
            <div className="items-box">
                {loading ? (
                    <p className="items-empty">Loading item...</p>
                ) : error ? (
                    <p className="items-empty" role="alert">{error}</p>
                ) : !item ? (
                    <p className="items-empty">Item not found.</p>
                ) : (
                    <article className={`item-card ${item.type}`}>
                        <div className="item-card-header">
                            <span className={`item-status ${item.type}`}>{item.type}</span>
                            <span className="item-category">{item.category}</span>
                        </div>
                        {item.imageUrl && (
                            <img className="item-photo" src={getImageUrl(item.imageUrl)} alt={`Photo of ${item.name}`} />
                        )}
                        <div className="item-card-body">
                            <h3>{item.name}</h3>
                            <p>{item.description || "No description provided."}</p>
                            <div className="item-meta">
                                <p><strong>Location:</strong> {item.location}</p>
                                <p><strong>Colour:</strong> {item.color || "Not specified"}</p>
                                <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                                <p><strong>Posted by:</strong> {item.postedBy?.username || "Findora user"}</p>
                                <p><strong>Status:</strong> {item.status}</p>
                            </div>
                        </div>
                        <div className="item-card-footer">
                            <Link to="/explore-reports" className="view-btn">Back to reports</Link>
                        </div>
                    </article>
                )}
            </div>
        </section>
    );
}

export default ItemDetails;
