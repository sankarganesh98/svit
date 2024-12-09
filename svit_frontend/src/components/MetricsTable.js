import React from "react";
import Image1 from "../assets/images/1.png";
import Image2 from "../assets/images/2.png";
import Image3 from "../assets/images/3.png";
import Image4 from "../assets/images/4.png";

const MetricsTable = ({ metrics }) => {
  // Helper function to capitalize metric names
  const capitalize = (text) => {
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div
      style={{
        margin: "20px auto",
        maxWidth: "1200px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Project Overview Section */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#ffffff",
        }}
      >
        <h2
          style={{
            color: "#4caf50",
            textAlign: "center",
            fontSize: "28px",
            marginBottom: "20px",
          }}
        >
          Project Overview
        </h2>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            padding: "10px",
            scrollbarWidth: "thin",
          }}
        >
          {[Image1, Image2, Image3, Image4].map((image, index) => (
            <div
              key={index}
              style={{
                flex: "0 0 auto",
                width: "300px",
                height: "200px",
                borderRadius: "12px",
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            ></div>
          ))}
        </div>
        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#555",
            textAlign: "justify",
          }}
        >
          This project represents a transformative initiative focused on
          reducing reoffending rates, improving employment opportunities for
          participants, and strengthening community bonds through the power of
          metrics-driven insights. By leveraging advanced data analytics, the
          project offers actionable, region-specific insights that address the
          root causes of criminal behavior and demonstrate the program's
          effectiveness in reducing crime and generating societal value.
        </p>
        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#555",
            textAlign: "justify",
          }}
        >
          Beyond individual participants, the project creates a ripple effect
          that benefits families and communities. Families, often the silent
          victims of crime, experience relief and stability when loved ones
          reintegrate into society successfully.
        </p>
      </div>

      {/* Metrics Table */}
      <div
        style={{
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#4caf50",
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          Metrics Table
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "20px 0",
            fontSize: "16px",
            textAlign: "left",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #ddd",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Metric
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #ddd",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(metrics).map(([key, value]) => {
              if (key === "region_crime_data" && typeof value === "object") {
                return (
                  <tr key={key}>
                    <td
                      style={{
                        padding: "16px",
                        border: "1px solid #ddd",
                        fontWeight: "bold",
                        backgroundColor: "#f3f3f3",
                      }}
                    >
                      {capitalize(key)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          margin: "10px 0",
                          fontSize: "14px",
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: "#e0e0e0",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            <th
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              Region
                            </th>
                            <th
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              Total Crime Cost
                            </th>
                            <th
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              Average Crime Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(value).map(([region, data]) => (
                            <tr key={region}>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {region}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                ${data.total_crime_cost.toLocaleString()}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {data.average_crime_rate.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              } else {
                let dataKey = null;

                if (typeof value === "number") {
                  if (value > 80) dataKey = "high";
                  else if (value < 20) dataKey = "low";
                }

                return (
                  <tr
                    key={key}
                    style={{
                      backgroundColor:
                        dataKey === "high"
                          ? "#d4edda"
                          : dataKey === "low"
                          ? "#f8d7da"
                          : "#ffffff",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        border: "1px solid #ddd",
                        fontWeight: "bold",
                      }}
                    >
                      {capitalize(key)}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        border: "1px solid #ddd",
                        color:
                          dataKey === "high"
                            ? "#155724"
                            : dataKey === "low"
                            ? "#721c24"
                            : "#333",
                      }}
                    >
                      {typeof value === "number"
                        ? value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        : value}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;
