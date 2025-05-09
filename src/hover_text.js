import { list } from "../index.js";
// ---------------------------------- HOVER TEXT
const container = document.getElementById('tiers');
const sideBarContainer = document.getElementById('search-side-bar');
const hoverText = document.getElementById('hover-text');

let hoverTimer = null;            // Holds the timeout
let currentHoverItem = null;      // Tracks the item being hovered
let lastMouseEvent = null;        // Tracks the latest mousemove event

/**
 * 
 * @param {HTMLElement} item 
 */
function showHoverText(item) {
    hoverTimer = setTimeout(() => {
        if (currentHoverItem === item) {
            const tierData = list.tiers.get(item.textContent);
            
            if (tierData) {
                hoverText.innerHTML = `
                    <div style="
                        font-family: MinecraftTen;
                        font-size: 18px;
                        color: rgb(14, 0, 204);
                        line-height: 1.4;
                        padding: 8px;
                        background: rgb(90, 90, 90);
                        border-radius: 4px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        border-left: 3px solid #666;
                    ">
                        <div style="
                            font-weight: bold;
                            text-shadow: 2px 2px 4px #000000;
                            font-size: 32px;
                            margin-bottom: 6px;
                            color: rgb(153, 0, 0);
                        ">
                            ${item.textContent}
                        </div>
                        <hr style="border: 0; height: 1px; background: #ddd; margin: 5px 0;">
                        <div>
                            <span style="
                                color: rgb(199, 73, 0);
                                text-shadow: 2px 2px 4px #000000;
                                font-weight: bold;
                                font-family: MinecraftTen;
                                font-size: 25px;
                                display: inline;
                            ">Tier:</span> <div style="font-size: 24px; display: inline;">${tierData.tier}</div><br>
                            <span style="
                                color: rgb(199, 73, 0);
                                text-shadow: 2px 2px 4px #000000;
                                font-weight: bold;
                                font-family: MinecraftTen;
                                font-size: 25px;
                                display: inline;
                            ">Region:</span> ${list.regionToEmojiDiv.get(tierData.region.toLowerCase())}<br>
                            <span style="
                                color: rgb(199, 73, 0);
                                text-shadow: 2px 2px 4px #000000;
                                font-weight: bold;
                                font-family: MinecraftTen;
                                font-size: 25px;
                                display: inline;
                            ">Device:</span> ${list.deviceToEmojiDiv.get(tierData.device.toLowerCase())}<br>
                            ${tierData.retired ? `<span style="
                                color: rgb(116, 0, 187);
                                text-shadow: 2px 2px 4px #000000;
                                font-weight: bold;
                                font-family: MinecraftTen;
                                font-size: 29px;
                                display: inline;
                            ">Retired</span>` : ''}
                        </div>
                    </div>
                `;

                hoverText.style.display = 'block';

                if (lastMouseEvent) {
                    positionHoverText(lastMouseEvent); // Use the latest mouse position
                }
            } else {
                hoverText.style.display = 'none'; // Hide if no data found
            }
        }
    }, 500); // 0.5 second hover delay
}

// Handle mouseover
container.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.tier-text');
    if (item) {
        clearTimeout(hoverTimer);
        currentHoverItem = item;

        showHoverText(item);
    }
});

// Handle mousemove to update the tooltip position
container.addEventListener('mousemove', (e) => {
    lastMouseEvent = e; // Save the last event
    if (hoverText.style.display === 'block') {
        positionHoverText(e);
    }
});

// Handle mouseout to hide tooltip
container.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.tier-text');
    const relatedTargetIsOutside = !item || !item.contains(e.relatedTarget);

    if (item && relatedTargetIsOutside) {
        clearTimeout(hoverTimer);
        hoverText.style.display = 'none';
        currentHoverItem = null;
    } else if (!e.target.closest('.tier-text') && !e.relatedTarget?.closest('.tier-text')) {
        clearTimeout(hoverTimer);
        hoverText.style.display = 'none';
        currentHoverItem = null;
    }
});



// Handle mouseover
sideBarContainer.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.search-result-text');
    if (item) {
        clearTimeout(hoverTimer);
        currentHoverItem = item;

        showHoverText(item);
    }
});

// Handle mousemove to update the tooltip position
sideBarContainer.addEventListener('mousemove', (e) => {
    lastMouseEvent = e; // Save the last event
    if (hoverText.style.display === 'block') {
        positionHoverText(e);
    }
});

// Handle mouseout to hide tooltip
sideBarContainer.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.search-result-text');
    const relatedTargetIsOutside = !item || !item.contains(e.relatedTarget);

    if (item && relatedTargetIsOutside) {
        clearTimeout(hoverTimer);
        hoverText.style.display = 'none';
        currentHoverItem = null;
    } else if (!e.target.closest('.search-result-text') && !e.relatedTarget?.closest('.search-result-text')) {
        clearTimeout(hoverTimer);
        hoverText.style.display = 'none';
        currentHoverItem = null;
    }
});



function positionHoverText(e) {
    const tooltip = hoverText;
    const offset = 10; // space between cursor and tooltip
    const padding = 10; // minimum space from edge of screen

    // Temporarily set visibility so we can measure it
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'block';

    const tooltipRect = tooltip.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    let top = e.clientY + offset;
    let left = e.clientX + offset;

    // Adjust if tooltip goes off the right edge
    if (left + tooltipRect.width + padding + offset > screenWidth) {
        left = screenWidth - tooltipRect.width - padding - offset;
    }

    tooltip.style.left = `${left + window.scrollX}px`;
    tooltip.style.top = `${top + window.scrollY}px`;

    tooltip.style.visibility = 'visible';
}

// ----------------------------------
