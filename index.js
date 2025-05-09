import './src/hover_text.js';
import './src/search_logic.js';


class TierList {
    constructor() {
        this.tierPillars = [
            1,
            2,
            3,
            4,
            5
        ].map((v) => document.getElementById(`tier_${v}`));

        this.tiers = new Map();

        this.tierPillarsTextHolder = [
            1,
            2,
            3,
            4,
            5
        ].map((v) => document.getElementById(`tier_container_${v}`));

        this.deviceToEmojiDiv = new Map([
            ['kbm', '<div style="display: inline; font-size: 24px;"> Keyboard</div>'],
            ['con', '<div style="display: inline; font-size: 24px;"> Controller</div>'],
            ['mob', '<div style="display: inline; font-size: 24px;"> Mobile</div>']
        ]);

        this.regionToEmojiDiv = new Map([
            ['eu', '<div style="display: inline; font-size: 24px;"> EU</div>'],
            ['na', '<div style="display: inline; font-size: 24px;"> NA</div>'],
            ['as', '<div style="display: inline; font-size: 24px;"> AS</div>'],
            ['au', '<div style="display: inline; font-size: 24px;"> AU</div>'],
            ['as/au', '<div style="display: inline; font-size: 24px;"> AS/AU</div>'],
        ]);

        setInterval(() => {
            this.resizeFont()
        }, 10);
    }

    resizeFont() {

        for (let pillar of this.tierPillarsTextHolder) {
            const width = pillar.getBoundingClientRect().width;
            pillar.style.fontSize = `${width / 4}px`;
        }

        // Resize each .tier-text inside this.tierPillars
        for (let pillar of this.tierPillars) {
            const width = pillar.getBoundingClientRect().width;
            const tierTextChildren = pillar.querySelectorAll('.tier-text');
            for (let textElement of tierTextChildren) {
                const newFontSize = `${width / 10}px`; // or tweak the divisor for your needs
                textElement.style.fontSize = newFontSize;
                textElement.style.height = newFontSize;
            }
        }
    }

    appendPlayer(tier, name, region, device, retired=false) {
        tier = tier.toLowerCase();
        if (this.tiers.has(name)) return false;

        else this.tiers.set(name, { tier: tier, region: region, device: device, retired: retired });

        const tierNum = parseInt(tier[2]);

        /** @type {string} */
        const tierLevel = tier[0];
        const pillar = this.tierPillars[tierNum - 1];

        const tierDiv = document.createElement('div');
        tierDiv.style.height = '25px'
        tierDiv.style.position = 'relative'

        if (retired) {
            console.log(tier)

            if (tierLevel == 'h') {
                tierDiv.style.color = 'rgb(101, 0, 148)';
            }
    
            else {
                tierDiv.style.color = 'rgb(176, 0, 126)';
            }

        } else {

            if (tierLevel == 'h') {
                tierDiv.style.color = 'rgb(202, 112, 60)';
            }
    
            else {
                tierDiv.style.color = 'rgb(100, 140, 185)';
            }
            
        }

        tierDiv.textContent = name;
        tierDiv.className = 'tier-text';
        
        pillar.appendChild(tierDiv);
    }
}

export const list = new TierList();


async function loadPlayers() {
    const response = await fetch('https://mcbetierlist.duckdns.org/all_players');
    const data = await response.json();

    console.log(`Info: ${JSON.stringify(data, null, 2)}`)

    for (let i = 1;i <= 5;i ++ ) {
        const tierData = data[`tier_${i}`][0];

        for (const [lowerCaseName, playerData] of Object.entries(tierData['high_tier'] ?? {})) {
            list.appendPlayer(`ht${i}`, playerData['playerName'], playerData['region'], playerData['device'], false);
        }
        
        for (const [lowerCaseName, playerData] of Object.entries(tierData['low_tier'] ?? {})) {
            list.appendPlayer(`lt${i}`, playerData['playerName'], playerData['region'], playerData['device'], false);
        }
        
        for (const [lowerCaseName, playerData] of Object.entries(tierData['high_tier_retired'] ?? {})) {
            list.appendPlayer(`ht${i}`, playerData['playerName'], playerData['region'], playerData['device'], true);
        }
        
        for (const [lowerCaseName, playerData] of Object.entries(tierData['low_tier_retired'] ?? {})) {
            list.appendPlayer(`lt${i}`, playerData['playerName'], playerData['region'], playerData['device'], true);
        }
        
    }
}

loadPlayers();

