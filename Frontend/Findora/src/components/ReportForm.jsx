import { useState } from "react";
import "./ReportForm.css"
import {toast} from "react-toastify"
import axios from "axios"
import { API_URL } from "../utils/api";

function ReportForm() {
    const initialFormData = {
        type: "Lost",
        name: "",
        category: "",
        color: "",
        location: "",
        date: "",
        time: "",
        description: ""
    };
    const [formData, setFormData] = useState(initialFormData);

    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Handle all text, select, date and time inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle photo upload
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG and WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            alert("Image must be less than 3 MB.");
            e.target.value = "";
            return;
        }

        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    // Remove selected photo
    const removePhoto = () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhoto(null);
        setPhotoPreview(null);

        const input = document.getElementById("item-photo");

        if (input) input.value = "";
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        if (photo) {
            data.append("photo", photo);
        }
        try {
            const response = await axios.post(
                `${API_URL}/item`,
                data,
                { withCredentials: true }
            );
            toast.success(response.data.message);
            if (photoPreview) URL.revokeObjectURL(photoPreview);
            setFormData(initialFormData);
            setPhoto(null);
            setPhotoPreview(null);
            const photoInput = document.getElementById("item-photo");
            if (photoInput) photoInput.value = "";
            window.dispatchEvent(new Event("findora:reports-changed"));
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <form id="report-form" onSubmit={handleSubmit} >

            <input
                type="hidden"
                name="type"
                value={formData.type}
                readOnly
            />

            <div className="form-grid">

            {/* Report Type */}
        <div className="field">
        <label htmlFor="report-type">
        What happened? <span>*</span>
        </label>

        <select
        id="report-type"
        name="type"
        required
        value={formData.type}
        onChange={handleChange}
        >
        <option value="Lost">I lost an item</option>
        <option value="Found">I found an item</option>
        </select>
        </div>



                {/* Item Name */}
                <div className="field">
                    <label htmlFor="item-name">
                        Item name <span>*</span>
                    </label>

                    <input
                        id="item-name"
                        name="name"
                        type="text"
                        placeholder="e.g. Black backpack"
                        maxLength={80}
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* Category */}
                <div className="field">
                    <label htmlFor="category">
                        Category <span>*</span>
                    </label>

                    <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Choose a category</option>
                        <option value="Bags & Accessories">Bags & Accessories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Personal Items">Personal Items</option>
                        <option value="Books & Stationery">Books & Stationery</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Keys & Cards">Keys & Cards</option>
                        <option value="Documents">Documents</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Colour */}
                <div className="field">
                    <label htmlFor="item-color">Colour</label>

                    <input
                        id="item-color"
                        name="color"
                        type="text"
                        placeholder="e.g. Black, navy blue"
                        maxLength={40}
                        value={formData.color}
                        onChange={handleChange}
                    />
                </div>

                {/* Campus Location */}
                <div className="field">
                    <label htmlFor="item-location">
                        Campus location <span>*</span>
                    </label>

                    <select
                        id="item-location"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                    >
                        <option value="">Select a location</option>
                        <option value="Academic Block">Academic Block</option>
                        <option value="Library">Library</option>
                        <option value="Computer Lab">Computer Lab</option>
                        <option value="Cafeteria">Cafeteria</option>
                        <option value="Auditorium">Auditorium</option>
                        <option value="Sports Area">Sports Area</option>
                        <option value="Parking Area">Parking Area</option>
                        <option value="Other / Not sure">Other / Not sure</option>
                    </select>
                </div>

                {/* Date */}
                <div className="field">
                    <label htmlFor="item-date">
                        Date lost or found <span>*</span>
                    </label>

                    <input
                        id="item-date"
                        name="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                {/* Time */}
                <div className="field">
                    <label htmlFor="item-time">Approximate time</label>

                    <input
                        id="item-time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                    />
                </div>

                {/* Description */}
                <div className="field full-width">
                    <label htmlFor="item-description">
                        Item description
                    </label>

                    <textarea
                        id="item-description"
                        name="description"
                        rows={4}
                        maxLength={500}
                        placeholder="Describe the item, its brand, appearance, or anything that could help identify it."
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <small className="field-hint">
                        Maximum 500 characters.
                    </small>
                </div>

                {/* Photo Upload */}
                <div className="field full-width">

                    <label>
                        Item photograph
                        <span className="optional-label">OPTIONAL</span>
                    </label>

                    <label
                        htmlFor="item-photo"
                        className="upload-box"
                        id="upload-box"
                    >
                        <strong>Click to upload an item photo</strong>
                        <small>JPG, PNG or WEBP · Maximum 3 MB</small>
                        <span className="upload-browse">
                            Choose image
                        </span>
                    </label>

                    <input
                        id="item-photo"
                        name="photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="visually-hidden"
                        onChange={handlePhotoChange}
                    />

                    {photoPreview && (
                        <div className="photo-preview">

                            <img
                                src={photoPreview}
                                alt="Selected item preview"
                            />

                            <div className="preview-details">
                                <strong>{photo?.name}</strong>
                                <small>Ready to attach</small>

                                <button
                                    type="button"
                                    id="remove-photo"
                                    className="remove-photo"
                                    onClick={removePhoto}
                                >
                                    Remove photo
                                </button>
                            </div>

                        </div>
                    )}

                </div>

            </div>

            <button type="submit">
                Submit Report
            </button>

        </form>
    );
}

export default ReportForm;
