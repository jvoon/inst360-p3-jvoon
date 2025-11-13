import showCards from './editable_js/template_cards.js';
import showCategories from './editable_js/template_category.js';
import showStats from './editable_js/template_stats.js';
import showTable, {enableTableSorting} from './editable_js/template_table.js'; //attach sorting!!!!!

import loadData from './editable_js/load_data.js';

// ============================================
// DISPLAY MANAGEMENT - PROVIDED
// ============================================

/**
 * Update the display with new content
 */
function updateDisplay(content) {
  document.getElementById("data-display").innerHTML = content;
}

/**
 * Update button states
 */
function updateButtonStates(activeView) {
  document.querySelectorAll(".view-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.getElementById(`btn-${activeView}`).classList.add("active");
}

/**
 * Show loading state
 */
function showLoading() {
  updateDisplay('<div class="loading">Loading data from API...</div>');
}

/**
 * Show error state
 */
 /*html*/ 
function showError(message) {
  updateDisplay(`
                <div class="error">
                    <h3>Error Loading Data</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `);
}


// ============================================
// APPLICATION INITIALIZATION - PROVIDED
// ============================================

/**
 * Main application function - handles data loading and button setup
 * This pattern always works - no timing issues!
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Starting application...");

  try {
    // Load data once
    showLoading();
    const data = await loadData();
    console.log(`Loaded ${data.length} items from API`);

    // Set up button event handlers - this pattern always works!
    document.getElementById("btn-cards").onclick = () => {
      updateDisplay(showCards(data));
      updateButtonStates("cards");
    };

    document.getElementById("btn-table").onclick = () => {
      updateDisplay(showTable(data));
      enableTableSorting(data); //attach sorting!
      updateButtonStates("table");
    };

    document.getElementById("btn-categories").onclick = () => {
      updateDisplay(showCategories(data));
      updateButtonStates("categories");
    };

    document.getElementById("btn-stats").onclick = () => {
      updateDisplay(showStats(data));
      updateButtonStates("stats");
    };

    // Show initial view
    updateDisplay(showCards(data));
    updateButtonStates("cards");

    console.log("Application ready!");
  } catch (error) {
    console.error("Application failed to start:", error);
    showError(error.message);
  }

});


// loading library for charts.js (stolen from tut 8)

// export function checkAllLibraryStatus() {
//     console.log('=== Library Status Check ===');
    
//     const libraries = [
//         { name: 'Chart.js', check: () => typeof Chart !== 'undefined', selector: '#chart-status' },
//     ];
    
//     const loadedCount = libraries.reduce((count, lib) => {
//         const element = document.querySelector(lib.selector);
//         const isLoaded = lib.check();
        
//         element.textContent = isLoaded ? 'Loaded' : 'Failed';
//         element.className = isLoaded ? 'status-loaded' : 'status-failed';
//         console.log(`${lib.name}: ${isLoaded ? 'Available' : 'Not available'}`);
        
//         return count + (isLoaded ? 1 : 0);
//     }, 0);
    
//     console.log('============================');

//     // Hide examples section if no libraries loaded
//     const examplesSection = document.querySelector('#examples-section');
//     if (loadedCount === 0 && examplesSection) {
//         examplesSection.style.display = 'none';
//         console.log('No libraries loaded - hiding examples section');
//     }

//     return loadedCount;
// }

// ============================================
// CHART.JS SUPPORT FUNCTIONS
// ============================================

export function handleChartError(error) {
    console.error('Chart creation failed:', error);
    
    // Show error in canvas
    const canvas = document.querySelector('#amiibo-chart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f8d7da';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#721c24';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Chart creation failed', canvas.width/2, canvas.height/2 - 10);
        ctx.fillText('Check console for details', canvas.width/2, canvas.height/2 + 15);
    }
}

// ============================================
// DEBUGGING UTILITIES
// ============================================

// whaah

// export function resetTutorial() {
//     console.log('Resetting tutorial state...');
    
//     // Clear chart
//     if (window.myChart) {
//         window.myChart.destroy();
//         window.myChart = null;
//     }
    
//     console.log('Tutorial reset complete');
// }

// ============================================
// ASYNC FUNCTIONS
// ============================================

// export async function clickToLoad(targetButton) {
//     // Get DOM elements when function runs, not when module loads
//     const statusDisplay = document.querySelector('#loading-status');
//     const statusMessage = statusDisplay.querySelector('.status-message');
    
//     if (!statusDisplay || !statusMessage) {
//         console.error('Could not find status display elements');
//         return;
//     }
    
//     // Show loading state
//     statusDisplay.classList.remove('success', 'error');
//     statusDisplay.classList.add('loading');
//     statusMessage.textContent = 'Loading restaurant data...';
//     targetButton.disabled = true;
    
//     console.log('Loading restaurant data from restaurants.json...');
    
//     try {
//         const response = await fetch('restaurants.json');
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         // Update the global variable
//         setRestaurants(data);
        
//         console.log(`Successfully loaded ${data.length} restaurants`);
        
//         // Show success state
//         statusDisplay.classList.remove('loading');
//         statusDisplay.classList.add('success');
//         statusMessage.textContent = `Successfully loaded ${data.length} restaurants!`;
        
//         // Checking library status
//         checkAllLibraryStatus();
        
//         showTutorialInterface();
        
//         targetButton.textContent = 'Reload Data';
//         targetButton.disabled = false;
        
//     } catch (error) {
//         console.error('Failed to load restaurant data:', error);
        
//         statusDisplay.classList.remove('loading');
//         statusDisplay.classList.add('error');
//         statusMessage.textContent = 'Failed to load data. Check console for details.';
        
//         targetButton.disabled = false;
//         targetButton.textContent = 'Try Again';
//     }
// }