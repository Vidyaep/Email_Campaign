import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CampaignList.css";

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    axios
        .get("http://localhost:8000/api/campaign/")
        .then((response) => setCampaigns(response.data))
        .catch((error) => console.error("Error fetching campaigns:", error));
}, []);

  const cancelCampaign = (id) => {
    axios.put(`/api/campaign/${id}/cancel/`).then(() => {
      setCampaigns((campaigns) =>
        campaigns.map((c) =>
          c.id === id ? { ...c, status: "Cancelled" } : c
        )
      );
    });
  };

  return (
    <div className="campaign-list-container">
      <h2 className="campaign-list-title">Campaign List</h2>
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Scheduled Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.name}</td>
              <td>{new Date(campaign.scheduled_time).toLocaleString()}</td>
              <td>{campaign.status}</td>
              <td>
                {campaign.status !== "Cancelled" && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelCampaign(campaign.id)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignList;
