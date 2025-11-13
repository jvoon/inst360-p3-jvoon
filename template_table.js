
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Show data in a table format
  // - Include all important fields
  // - Make it easy to scan and compare
  // - Consider adding sorting functionality
  /*html*/ 
  const tableHTML = data
    .map(
        (amiibo) => `
            <tr>
                <td><img src="${amiibo.image}" alt="${amiibo.name}" class="amiibo-thumb" /></td>
                <td>${amiibo.name}</td>
                <td>${amiibo.character}</td>
                <td>${amiibo.amiiboSeries}</td>
                <td>${amiibo.gameSeries}</td>
                <td>${amiibo.type}</td>
            </tr>
        `
    )
    .join("");

  return `
                <h2 class="view-title">📊 Table View</h2>
                <p class="view-description">Click the Headers to sort Amiibos! Click the same Header again to change alphabetical order :D</p>
                <table id="amiibo-table" class="amiibo-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th data-field="name">Name</th>
                            <th data-field="character">Character</th>
                            <th data-field="amiiboSeries">Series</th>
                            <th data-field="gameSeries">Game Series</th>
                            <th data-field="type">Type</th>
                             </tr>
                    </thead>
                <tbody>${tableHTML}</tbody>
            </table>
        `;
}

// enableTableSorting attaches click listeners to headers after table is rendered
function enableTableSorting(data) {
  const table = document.getElementById("amiibo-table");
  if (!table) return;

  const headers = table.querySelectorAll("th[data-field]");
  const tbody = table.querySelector("tbody");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const field = header.getAttribute("data-field");
      const ascending = header.dataset.sort === "asc" ? false : true;

      // Sort the data
      const sorted = [...data].sort((a, b) => {
        const valA = (a[field] || "").toString().toLowerCase();
        const valB = (b[field] || "").toString().toLowerCase();
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });

      headers.forEach((h) => delete h.dataset.sort);
      header.dataset.sort = ascending ? "asc" : "desc";

      tbody.innerHTML = sorted
        .map(
          (amiibo) => `
            <tr>
              <td><img src="${amiibo.image}" alt="${amiibo.name}" class="amiibo-thumb" /></td>
              <td>${amiibo.name || "N/A"}</td>
              <td>${amiibo.character || "N/A"}</td>
              <td>${amiibo.amiiboSeries || "N/A"}</td>
              <td>${amiibo.gameSeries || "N/A"}</td>
              <td>${amiibo.type || "N/A"}</td>
            </tr>
          `
        )
        .join("");
    });
  });
}

export default showTable;
export { enableTableSorting };