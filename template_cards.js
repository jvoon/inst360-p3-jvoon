
/**
 * CARD VIEW - PROVIDED AS EXAMPLE
 * Display data as browsable cards - good for comparing individual items
 */
function showCards(data) {
  const cardHTML = data
    .map(
       /*html*/ 
      (amiibo) => `
                <div class="amiibo-card">
                    <img src="${amiibo.image}" alt="${amiibo.name}" class="amiibo-image" />
                    <h3>${amiibo.name}</h3>
                    <p><strong>Series:</strong> ${amiibo.amiiboSeries}</p?>
                    <p><strong>Game Series:</strong> ${amiibo.gameSeries}</p>
                    <p><strong>Type:</strong> ${amiibo.type}</p>
                </div>
            `
    )
    .join("");
     /*html*/ 
  return `
                <h2 class="view-title">🃏 Card View</h2>
                <p class="view-description">Browse amiibos as collectable cards/figurines - perfect for completion entheusiasts!</p>
                <div class="card-grid">
                    ${cardHTML}
                </div>
            `;
}

export default showCards;