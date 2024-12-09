import React, { useState, useEffect } from "react";
import axios from "axios";

const ProgramCostCRUD = () => {
  const [programCosts, setProgramCosts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    year: "",
    cost: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgramCosts();
  }, []);

  const fetchProgramCosts = () => {
    const token = localStorage.getItem("authToken");

    axios
      .get("http://127.0.0.1:8000/api/program-costs/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setProgramCosts(response.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching program costs:", error);
        setError("Failed to fetch program costs. Please try again.");
      });
  };

  const handleCreateOrUpdate = () => {
    const token = localStorage.getItem("authToken");

    if (isEditing) {
      axios
        .put(
          `http://127.0.0.1:8000/api/program-costs/${formData.id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          fetchProgramCosts();
          resetForm();
          setError("");
        })
        .catch((error) => {
          console.error("Error updating program cost:", error);
          setError("Failed to update program cost. Please try again.");
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/program-costs/", formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          fetchProgramCosts();
          resetForm();
          setError("");
        })
        .catch((error) => {
          console.error("Error creating program cost:", error);
          setError("Failed to create program cost. Please check your inputs.");
        });
    }
  };

  const handleEdit = (programCost) => {
    setFormData(programCost);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("authToken");

    axios
      .delete(`http://127.0.0.1:8000/api/program-costs/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        fetchProgramCosts();
        setError("");
      })
      .catch((error) => {
        console.error("Error deleting program cost:", error);
        setError("Failed to delete program cost. Please try again.");
      });
  };

  const resetForm = () => {
    setFormData({
      id: null,
      year: "",
      cost: 0,
    });
    setIsEditing(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#4caf50", marginBottom: "20px" }}>
        Manage Program Costs
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <input
          type="number"
          placeholder="Cost"
          value={formData.cost}
          onChange={(e) =>
            setFormData({ ...formData, cost: parseFloat(e.target.value) })
          }
          style={{
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
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
          {isEditing ? "Update Program Cost" : "Add Program Cost"}
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
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Year</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Cost</th>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {programCosts.map((cost) => (
            <tr key={cost.id}>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                {cost.year}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                ${cost.cost.toLocaleString()}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                <button
                  onClick={() => handleEdit(cost)}
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
                  onClick={() => handleDelete(cost.id)}
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

export default ProgramCostCRUD;
