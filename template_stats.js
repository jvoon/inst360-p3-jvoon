//cleaning up some of the tutorial comments stuff to put my reflection at the very top!

// Refection: 
//   I chose to use the Charts.js enhancement because it felt like a reasonable 'upgrade' given my previous
// adaption of adding orange bars to the stats. This gets it done so much faster (and more aesthetically) and shows 
// my roommate that Animal Crossing is interestingly Nintendo's current favorite child (not that I would blame them).

//   In terms of addressing user problems, having a visual graph along with percentages helps to outline the degree of
// differences in metrics between elements (for example, I noticed there were a lot of AC amiibos, but I didn't realize 
// how many MORE AC amiibos there are in relative comparison to others, i thought there would be a lot more Mario or LoZ)
// I opted for different views depending on the density of how many elments are being compared within a single category.

//   A challenge I encountered among the many was actually limiting the rescale of the pie chart while not affectng the bar.
// Because I set it so that the chart was determined long before the orientation, I for some reason had difficulty 
// incorporating restrictions on different tpyes since I was used to more universal settings. But eventually I slapped in
// an if-else statement to manage the style.

//   This enhacement would hopefully give a more well-informed overview on what data is presernt in this API. Noting the
// most popular types of collectables, the most popular genres of collectables, and more. Also, it mgiht be a bit fun to 
// click between the different graphs! 

//   If I had more time, I would definitely reexplore the if-else I mentioned earlier and figure out how to properly 
// incorproate it into the CSS...

function showStats(data) {
  const total = data.length;
  const calcPercent = (value) => ((value / total) * 100).toFixed(1);

  //the summaries
  //by type
  const typeSummary = data.reduce((acc, item) => {
    const type = item.type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  //by amiibo series
  const seriesSummary = data.reduce((acc, item) => {
    const series = item.amiiboSeries || "Unknown";
    acc[series] = (acc[series] || 0) + 1;
    return acc;
  }, {});
  //by game series
  const gameSummary = data.reduce((acc, item) => {
    const game = item.gameSeries || "Unknown";
    acc[game] = (acc[game] || 0) + 1;
    return acc;
  }, {});
  //by region
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

  //html output
  //since i'm using charts.js, i don't really need the orange bars anymore (goodbye orange bars~!)
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

  //chart setup 
  setTimeout(() => {
    let currentChart = null;

    const ctx = document.getElementById("amiibo-chart");
    if (!ctx || typeof Chart === "undefined") {
      console.warn("Chart.js not loaded or canvas not found");
      return;
    }


    //render a chart from a determined summary object
    const renderChart = (summaryKey) => {
  const { title, data, chartType } = summaries[summaryKey];
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (currentChart) currentChart.destroy();

  //set max height only for pie charts
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
    //set a little legend for pie charts (too many options for bar)
    //set xy axis for bar
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


    //default chart (start with type)
    renderChart("type");

    //click listeners (i tried hover. then i cried)
    document.querySelectorAll(".stat-box").forEach((box) => {
      const chartKey = box.dataset.chart;
      box.addEventListener("click", () => {
        renderChart(chartKey);
        //add a little visual cue for active section
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
