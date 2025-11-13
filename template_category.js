/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories - good for understanding relationships and patterns
 */
function showCategories(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Group data by a meaningful category (cuisine, neighborhood, price, etc.)
  // - Show items within each group
  // - Make relationships between groups clear
  // - Consider showing group statistics
  /*html*/

  //amiibo categories/groups
  const categoryFields = ["type", "amiiboSeries", "gameSeries"];

    //helper to convert camelCase to words with capitalization
  const formatHeader = (str) => str
    .replace(/([A-Z])/g, " $1")   //Add space before capital letters
    .replace(/^./, (c) => c.toUpperCase()); //capitalize first letter

  //build HTML for each group
  const categoryHTML = categoryFields
    .map((field) => {
      const summary = summarizeCategory(data, field);

      const itemsHTML = Object.entries(summary)
        .map(([name, count]) => `<li>${name}: ${count}</li>`)
        .join("");

      return `
        <div class="category-box">
          <h3>${formatHeader(field)}</h3>
          <ul>${itemsHTML}</ul>
        </div>
      `;
    })
    .join("");

    // Build HTML for release years for all regions
    const regionFlags = { na: "🗽", eu: "🏰", jp: "🗻", au: "🐨" };
    const releaseHTML = Object.keys(regionFlags)
      .map((region) => {
        const summary = summarizeReleaseYears(data, region);
        const itemsHTML = Object.entries(summary)
          .map(([year, count]) => `<li>${year}: ${count}</li>`)
          .join("");
        return `
          <div class="category-box">
            <h3>${regionFlags[region]} ${region.toUpperCase()} Release Years</h3>
            <ul>${itemsHTML}</ul>
          </div>
        `;
      })
    .join("");

  return `
    <h2 class="view-title">📂 Category View</h2>
    <p class="view-description">Group Amiibos and see counts for each category</p>
    <div class="category-container">
      ${releaseHTML}
      ${categoryHTML}
    </div>
  `;
}

function summarizeCategory(data, key) {
  return data.reduce((summary, item) => {
    const value = item[key] || "Unknown";
    summary[value] = (summary[value] || 0) + 1;
    return summary;
  }, {});
}

function summarizeReleaseYears(data, region = "na") {
  const summary = {};

  data.forEach((item) => {
    const releaseDate = item.release?.[region];
    if (releaseDate) {
      const year = new Date(releaseDate).getFullYear();
      summary[year] = (summary[year] || 0) + 1;
    } else {
      summary["Unknown"] = (summary["Unknown"] || 0) + 1;
    }
  });

  return summary;
}


export default showCategories;