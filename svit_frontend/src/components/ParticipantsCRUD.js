import React, { useState, useEffect } from "react";
import axios from "axios";

const ParticipantsCRUD = () => {
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    date_joined: "",
    employed: false,
    income: 0,
    tax_contributions: 0,
    reoffended: false,
    sobriety_status: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = () => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://127.0.0.1:8000/api/participants/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setParticipants(response.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching participants:", error);
        setError("Failed to fetch participants. Please try again.");
      });
  };

  const handleCreateOrUpdate = () => {
    const token = localStorage.getItem("authToken");

    if (isEditing) {
      axios
        .put(`http://127.0.0.1:8000/api/participants/${formData.id}/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          fetchParticipants();
          resetForm();
          setError("");
        })
        .catch((error) => {
          console.error("Error updating participant:", error);
          setError("Failed to update participant. Please try again.");
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/participants/", formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          fetchParticipants();
          resetForm();
          setError("");
        })
        .catch((error) => {
          console.error("Error creating participant:", error);
          setError("Failed to create participant. Please check your inputs.");
        });
    }
  };

  const handleEdit = (participant) => {
    setFormData(participant);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("authToken");

    axios
      .delete(`http://127.0.0.1:8000/api/participants/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        fetchParticipants();
        setError("");
      })
      .catch((error) => {
        console.error("Error deleting participant:", error);
        setError("Failed to delete participant. Please try again.");
      });
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      date_joined: "",
      employed: false,
      income: 0,
      tax_contributions: 0,
      reoffended: false,
      sobriety_status: true,
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#4caf50", marginBottom: "20px" }}>
        Manage Participants
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="date"
          value={formData.date_joined}
          onChange={(e) =>
            setFormData({ ...formData, date_joined: e.target.value })
          }
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="number"
          placeholder="Income"
          value={formData.income}
          onChange={(e) =>
            setFormData({ ...formData, income: parseFloat(e.target.value) })
          }
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="number"
          placeholder="Tax Contributions"
          value={formData.tax_contributions}
          onChange={(e) =>
            setFormData({
              ...formData,
              tax_contributions: parseFloat(e.target.value),
            })
          }
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <label style={{ marginRight: "10px" }}>
          Employed:
          <input
            type="checkbox"
            checked={formData.employed}
            onChange={(e) =>
              setFormData({ ...formData, employed: e.target.checked })
            }
          />
        </label>
        <label style={{ marginRight: "10px" }}>
          Reoffended:
          <input
            type="checkbox"
            checked={formData.reoffended}
            onChange={(e) =>
              setFormData({ ...formData, reoffended: e.target.checked })
            }
          />
        </label>
        <label style={{ marginRight: "10px" }}>
          Sobriety Status:
          <input
            type="checkbox"
            checked={formData.sobriety_status}
            onChange={(e) =>
              setFormData({ ...formData, sobriety_status: e.target.checked })
            }
          />
        </label>
        <button
          onClick={handleCreateOrUpdate}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          {isEditing ? "Update Participant" : "Add Participant"}
        </button>
        {isEditing && (
          <button
            onClick={resetForm}
            style={{
              marginLeft: "10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4caf50", color: "white" }}>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Date Joined
            </th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Employed
            </th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Income</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Tax Contributions
            </th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Reoffended
            </th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Sobriety Status
            </th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {participant.name}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {participant.date_joined}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {participant.employed ? "Yes" : "No"}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                ${participant.income.toFixed(2)}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                ${participant.tax_contributions.toFixed(2)}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {participant.reoffended ? "Yes" : "No"}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {participant.sobriety_status ? "Yes" : "No"}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                <button
                  onClick={() => handleEdit(participant)}
                  style={{
                    backgroundColor: "#2196f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    marginRight: "5px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(participant.id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsCRUD;
