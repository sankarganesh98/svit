import React, { useState, useEffect } from "react";
import axios from "axios";

const CrimeDataCRUD = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [formData, setFormData] = useState({
    id: null, // Added ID field for editing
    region: "",
    crime_rate: 0,
    crime_cost: 0,
  });
  const [isEditing, setIsEditing] = useState(false); // Track if editing a crime data entry
  const [error, setError] = useState(""); // State to track errors

  useEffect(() => {
    fetchCrimeData();
  }, []);

  const fetchCrimeData = () => {
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

    axios
      .get("http://127.0.0.1:8000/api/crime-data/", {
        headers: {
          Authorization: `Token ${token}`, // Include the token in headers
        },
      })
      .then((response) => {
        setCrimeData(response.data);
        setError(""); // Clear any existing errors
      })
      .catch((error) => {
        console.error("Error fetching crime data:", error);
        setError("Failed to fetch crime data. Please try again.");
      });
  };

  const handleCreateOrUpdate = () => {
    const token = localStorage.getItem("authToken");

    if (isEditing) {
      // Update Crime Data (PUT request)
      axios
        .put(
          `http://127.0.0.1:8000/api/crime-data/${formData.id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          fetchCrimeData();
          resetForm();
          setError(""); // Clear any existing errors
        })
        .catch((error) => {
          console.error("Error updating crime data:", error);
          setError("Failed to update crime data. Please try again.");
        });
    } else {
      // Create Crime Data (POST request)
      axios
        .post("http://127.0.0.1:8000/api/crime-data/", formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          fetchCrimeData();
          resetForm();
          setError(""); // Clear any existing errors
        })
        .catch((error) => {
          console.error("Error creating crime data:", error);
          setError("Failed to create crime data. Please check your inputs.");
        });
    }
  };

  const handleEdit = (data) => {
    setFormData(data); // Populate form with crime data
    setIsEditing(true); // Set editing state
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("authToken");

    axios
      .delete(`http://127.0.0.1:8000/api/crime-data/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        fetchCrimeData();
        setError(""); // Clear any existing errors
      })
      .catch((error) => {
        console.error("Error deleting crime data:", error);
        setError("Failed to delete crime data. Please try again.");
      });
  };

  const resetForm = () => {
    setFormData({
      id: null,
      region: "",
      crime_rate: 0,
      crime_cost: 0,
    });
    setIsEditing(false); // Reset editing state
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#4caf50" }}>Manage Crime Data</h2>

      {/* Display Error Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Input Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Region"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px" }}
        />
        <input
          type="number"
          placeholder="Crime Rate"
          value={formData.crime_rate}
          onChange={(e) =>
            setFormData({ ...formData, crime_rate: parseFloat(e.target.value) })
          }
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px" }}
        />
        <input
          type="number"
          placeholder="Crime Cost"
          value={formData.crime_cost}
          onChange={(e) =>
            setFormData({ ...formData, crime_cost: parseFloat(e.target.value) })
          }
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px" }}
        />
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
          {isEditing ? "Update Crime Data" : "Add Crime Data"}
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

      {/* Crime Data Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "20px 0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4caf50", color: "white" }}>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Region</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Crime Rate</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Crime Cost</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {crimeData.map((data) => (
            <tr key={data.id}>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>{data.region}</td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>{data.crime_rate}</td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                ${data.crime_cost.toLocaleString()}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                <button
                  onClick={() => handleEdit(data)}
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
                  onClick={() => handleDelete(data.id)}
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

export default CrimeDataCRUD;
