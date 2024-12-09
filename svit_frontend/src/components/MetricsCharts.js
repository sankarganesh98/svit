import React, { useEffect } from "react";
import { Bar, Pie, Line, Radar } from "react-chartjs-2";
import * as d3 from "d3";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const MetricsCharts = ({ metrics }) => {
  // D3.js Horizontal Bar Chart
  useEffect(() => {
    if (!metrics || !metrics.region_crime_data) return; // Ensure metrics are loaded before rendering the chart

    const svg = d3.select("#d3-chart");
    svg.selectAll("*").remove(); // Clear previous chart

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const data = [
      { metric: "Dependents Helped", value: metrics.dependents_helped },
      { metric: "Crime Rate Reduction", value: metrics.crime_rate_reduction },
      { metric: "ROI", value: metrics.roi },
    ];

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.metric))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5));

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", xScale(0))
      .attr("y", (d) => yScale(d.metric))
      .attr("width", (d) => xScale(d.value) - xScale(0))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#3f51b5");

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
  }, [metrics]);

  if (!metrics || !metrics.region_crime_data) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading charts...</div>;
  }

  // Chart.js Bar Chart Data for Regional Crime Data
  const regionalCrimeBarChartData = {
    labels: Object.keys(metrics.region_crime_data),
    datasets: [
      {
        label: "Total Crime Cost ($)",
        data: Object.values(metrics.region_crime_data).map(
          (region) => region.total_crime_cost
        ),
        backgroundColor: ["#f44336", "#ff9800", "#4caf50", "#2196f3"],
      },
    ],
  };

  // Chart.js Bar Chart Data
  const barChartData = {
    labels: ["Employment Rate", "Reoffending Rate", "Sobriety Rate"],
    datasets: [
      {
        label: "Percentage",
        data: [
          metrics.employment_rate,
          metrics.reoffending_rate,
          metrics.sobriety_rate,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
      },
    ],
  };

  // Chart.js Pie Chart Data
  const pieChartData = {
    labels: ["Crime Cost Reduction", "Program Costs", "Tax Contributions"],
    datasets: [
      {
        data: [
          metrics.cost_of_crime_reduction,
          metrics.total_program_costs,
          metrics.total_tax_contributions,
        ],
        backgroundColor: ["#ff5722", "#3f51b5", "#009688"],
      },
    ],
  };

  // Chart.js Line Chart Data
  const lineChartData = {
    labels: ["2021", "2022", "2023"],
    datasets: [
      {
        label: "Employment Rate",
        data: [60, 70, metrics.employment_rate],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Reoffending Rate",
        data: [40, 30, metrics.reoffending_rate],
        borderColor: "#f44336",
        backgroundColor: "rgba(244, 67, 54, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Sobriety Rate",
        data: [50, 65, metrics.sobriety_rate],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart.js Radar Chart Data
  const radarChartData = {
    labels: ["Employment", "Reoffending", "Sobriety", "Crime Cost Reduction"],
    datasets: [
      {
        label: "Key Metrics",
        data: [
          metrics.employment_rate,
          metrics.reoffending_rate,
          metrics.sobriety_rate,
          metrics.cost_of_crime_reduction / 1000, // Normalize data
        ],
        backgroundColor: "rgba(255, 193, 7, 0.5)",
        borderColor: "#ffc107",
        borderWidth: 2,
        pointBackgroundColor: "#ffc107",
      },
    ],
  };

  return (
    <div className="metrics-dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card green">
          Total Participants
          <div className="summary-value">{metrics.total_participants}</div>
        </div>
        <div className="summary-card blue">
          Employment Rate
          <div className="summary-value">{metrics.employment_rate}%</div>
        </div>
        <div className="summary-card red">
          Reoffending Rate
          <div className="summary-value">{metrics.reoffending_rate}%</div>
        </div>
        <div className="summary-card orange">
          Crime Cost Reduction
          <div className="summary-value">${metrics.cost_of_crime_reduction}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3 className="chart-title">Bar Chart</h3>
          <Bar data={barChartData} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Pie Chart</h3>
          <Pie data={pieChartData} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Line Chart</h3>
          <Line data={lineChartData} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Radar Chart</h3>
          <Radar data={radarChartData} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">D3.js Horizontal Bar Chart</h3>
          <svg id="d3-chart" width="400" height="300"></svg>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Regional Crime Data</h3>
          <Bar data={regionalCrimeBarChartData} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCharts;
