import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CampaignForm.css";

const CampaignForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        recipients: [],
        scheduled_time: "",
        status: "Scheduled",
    });

    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
      axios
          .get("http://localhost:8000/api/users/")
          .then((response) => setUsers(response.data))
          .catch((error) => console.error("Error fetching users:", error));
  }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRecipientsChange = (e) => {
        const selectedRecipients = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setFormData((prevData) => ({ ...prevData, recipients: selectedRecipients }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post("http://localhost:8000/api/campaigns/", formData) // Backend API endpoint
            .then((response) => {
                setMessage("Campaign created successfully!");
                setFormData({
                    name: "",
                    content: "",
                    recipients: [],
                    scheduled_time: "",
                    status: "Scheduled",
                });
            })
            .catch((error) => {
                console.error("Error creating campaign:", error);
                setMessage("Failed to create campaign.");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="campaign-form-container">
            <h2 className="form-title">Create a New Campaign</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} className="campaign-form">
                <div className="form-group">
                    <label htmlFor="name">Campaign Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter campaign name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Enter campaign content"
                        rows="4"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="recipients">Recipients</label>
                    <select
                        id="recipients"
                        name="recipients"
                        value={formData.recipients}
                        onChange={handleRecipientsChange}
                        multiple
                        required
                    >
                        {users.map((user) => (
                           <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="scheduled_time">Scheduled Time</label>
                    <input
                        type="datetime-local"
                        id="scheduled_time"
                        name="scheduled_time"
                        value={formData.scheduled_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Creating..." : "Create Campaign"}
                </button>
            </form>
        </div>
    );
};

export default CampaignForm;
