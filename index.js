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
            ['kbm', '<img src="img/keyboard.png" style="width: 43px; top: 4px; position: relative;"></img>'],
            ['con', '<img src="img/controller.png" style="width: 35px; top: 6px; position: relative;"></img>'],
            ['mob', '<img src="img/mobile.png" style="width: 40px; top: 5px; position: relative;"></img>']
        ]);

        this.regionToEmojiDiv = new Map([
            ['eu', '<img src="img/EU.png" style="width: 37px; top: 6px; border-radius: 7px; position: relative; "></img>'],
            ['na', '<img src="img/NA.png" style="width: 39px; top: 5px; border-radius: 7px; position: relative; "></img>'],
            ['as', '<img src="img/AS.png" style="width: 39px; top: 5px; border-radius: 7px; position: relative; "></img>'],
            ['au', '<img src="img/AU.png" style="width: 41px; top: 5px; border-radius: 7px; position: relative; "></img>'],
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
                const newFontSize = `${width / 8}px`; // or tweak the divisor for your needs
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

