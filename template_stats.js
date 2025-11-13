function showStats(data) {
  const total = data.length;
  const calcPercent = (value) => ((value / total) * 100).toFixed(1);

  // ----- Summaries -----
  const typeSummary = data.reduce((acc, item) => {
    const type = item.type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const seriesSummary = data.reduce((acc, item) => {
    const series = item.amiiboSeries || "Unknown";
    acc[series] = (acc[series] || 0) + 1;
    return acc;
  }, {});
  const gameSummary = data.reduce((acc, item) => {
    const game = item.gameSeries || "Unknown";
    acc[game] = (acc[game] || 0) + 1;
    return acc;
  }, {});
  const regions = ["na", "jp", "eu", "au"];
  const regionSummary = regions.reduce((acc, r) => {
    acc[r.toUpperCase()] = data.filter(item => item.release?.[r]).length;
    return acc;
  }, {});

  const summaries = {
    type: { title: "Amiibo Distribution by Type", data: typeSummary, chartType: "pie" },
    series: { title: "Amiibo by Series", data: seriesSummary, chartType: "bar" },
    game: { title: "Amiibo by Game Series", data: gameSummary, chartType: "bar" },
    region: { title: "Amiibo Distribution by Region", data: regionSummary, chartType: "pie" },
  };

  // ----- HTML OUTPUT -----
  const html = `
    <h1 style="text-align:center;">Total Amiibos: ${total}</h1>
    <div class="chart-container" style="width:70%;margin:2em auto;">
      <canvas id="amiibo-chart"></canvas>
      <p style="text-align:center; font-style:italic; color:'#e0e0e0';">Click any category below to see their stats!</p>
    </div>

    <div class="stats-container">
      <div class="stat-box" data-chart="type">
        <h3>By Type</h3>
        ${Object.entries(typeSummary).map(([type, count]) =>
          `<li>${type}: ${count} (${calcPercent(count)}%)</li>`
        ).join("")}
      </div>

      <div class="stat-box" data-chart="series">
        <h3>By Amiibo Series</h3>
        ${Object.entries(seriesSummary).map(([series, count]) =>
          `<li>${series}: ${count} (${calcPercent(count)}%)</li>`
        ).join("")}
      </div>

      <div class="stat-box" data-chart="game">
        <h3>By Game Series</h3>
        ${Object.entries(gameSummary).map(([game, count]) =>
          `<li>${game}: ${count} (${calcPercent(count)}%)</li>`
        ).join("")}
      </div>

      <div class="stat-box" data-chart="region">
        <h3>By Region</h3>
        ${Object.entries(regionSummary).map(([region, count]) =>
          `<li>${region}: ${count} (${calcPercent(count)}%)</li>`
        ).join("")}
      </div>
    </div>
  `;

  // ----- Chart Setup -----
  setTimeout(() => {
    let currentChart = null;

    const ctx = document.getElementById("amiibo-chart");
    if (!ctx || typeof Chart === "undefined") {
      console.warn("Chart.js not loaded or canvas not found");
      return;
    }


    // Utility: Render a chart from one of the summary objects
    const renderChart = (summaryKey) => {
  const { title, data, chartType } = summaries[summaryKey];
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (currentChart) currentChart.destroy();

  // Set max height only for pie charts
  if (chartType === 'pie') {
    ctx.style.maxHeight = '350px'; // limit pie chart height
  } else {
    ctx.style.maxHeight = ''; // remove limit for bar charts
  }

  currentChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: [
          "#4e79a7","#f28e2b","#e15759","#76b7b2",
          "#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"
        ],
      }],
    },
    options: {
      responsive: true,
      animation: { duration: 600 },
      plugins: {
        title: { display: true, text: title },
        legend: { display: chartType === "pie", position: "bottom" },
      },
      scales: chartType === "bar" ? {
        x: { ticks: { display: false } },
        y: { beginAtZero: true }
      } : {}
    },
  });
};


    // Default chart (start with type)
    renderChart("type");

    // Click listeners (instead of hover)
    document.querySelectorAll(".stat-box").forEach((box) => {
      const chartKey = box.dataset.chart;
      box.addEventListener("click", () => {
        renderChart(chartKey);
        // Optional: add a little visual cue for active section
        document.querySelectorAll(".stat-box").forEach(b => b.classList.remove("active"));
        box.classList.add("active");
      });
    });
  }, 0);

  return html;
}

if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#e0e0e0'; // light gray text
}


export default showStats;
