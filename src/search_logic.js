import { list } from "../index.js";

const searchBarElement = document.getElementById("search-bar-text-area");
const searchBarSide = document.getElementById("search-side-bar");
const tiers = document.getElementById("tiers");

searchBarSide.addEventListener('wheel', function (e) {
    const atTop = sidebar.scrollTop === 0;
    const atBottom = sidebar.scrollHeight - sidebar.clientHeight === sidebar.scrollTop;
  
    if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault(); // stop scroll from bubbling up
    }
}, { passive: false });


searchBarElement.addEventListener('input', (ev) => {
    const typedText = ev.target.value.toLowerCase();
    console.log(typedText)

    if (typedText == '') {
        searchBarSide.style.display = 'none';
        tiers.style.width = 'calc(100% - 100px)';
        tiers.style.left = '50%'
    }

    else {
        searchBarSide.style.display = 'inline';
        tiers.style.width = 'calc(100% - 300px)';
        tiers.style.left = 'calc(50% - 100px)';

        // Search algorithm
        const results = [];

        for (let [name, data] of list.tiers.entries()) {
            const formattedName = name.toLowerCase();
            const typed = typedText.toLowerCase();

            if (formattedName === typed) {
                // Perfect match
                results.push([name, -100, data]); // strong negative priority
            } else if (formattedName.startsWith(typed)) {
                // Prefix match: prioritize shorter names
                results.push([name, 0 + (formattedName.length - typed.length), data]);
            } else {
                const index = formattedName.indexOf(typed);
                if (index !== -1) {
                    // Substring match: prioritize earlier appearance and shorter names
                    results.push([name, 100 + index + (formattedName.length - typed.length), data]);
                }
            }
        }

        // Final sort by priority, then alphabetical if needed
        results.sort((a, b) => {
            if (a[1] !== b[1]) return a[1] - b[1];
            return a[0].localeCompare(b[0]); // fallback to alphabetical
        });


        console.log(JSON.stringify(results));

        const searchHeaderText = document.createElement('div');
        searchHeaderText.className = 'search-result-text';
        searchHeaderText.style.fontSize = '30px';
        searchHeaderText.style.height = '40px'

        if (results.length == 0) searchHeaderText.textContent = 'No Results';
        else searchHeaderText.textContent = 'Results';

        // Resets children
        searchBarSide.innerHTML = '';
        searchBarSide.appendChild(searchHeaderText);

        for (let [name, priority, data] of results) {
            const tierDiv = document.createElement('div');
            tierDiv.className = 'search-result-text';
            tierDiv.textContent = name;

            console.log(JSON.stringify(data));
            const tierLevel = data.tier[0];

            if (data.retired) {

                // High-tier colour
                if (tierLevel.toLowerCase() == 'h') {
                    tierDiv.style.color = 'rgb(101, 0, 148)';
                }
                
                // Low-tier colour
                else {
                    tierDiv.style.color = 'rgb(176, 0, 126)';
                }
            } else {

                // High-tier colour
                if (tierLevel.toLowerCase() == 'h') {
                    tierDiv.style.color = 'rgb(202, 112, 60)';
                }
                
                // Low-tier colour
                else {
                    tierDiv.style.color = 'rgb(100, 140, 185)';
                }
            }

            searchBarSide.appendChild(tierDiv);
        }
    }
})