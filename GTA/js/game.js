// Game state and constants
export let gameRunning = false;
export let money = 0;
export let wantedLevel = 0;
export let health = 100;
export let keys = {};
export let mousePos = {
    x: 0,
    y: 0
};
export let camera = {
    x: 0,
    y: 0
};

// World configuration
export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1600;
export const BLOCK_SIZE = 120;
export const ROAD_WIDTH = 24;

// Player
export let player = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    width: 16,
    height: 16,
    speed: 3.5,
    angle: 0,
    inVehicle: false,
    vehicle: null
};

// Game objects
export let vehicles = [];
export let buildings = [];
export let npcs = [];
export let bullets = [];
export let missionMarkers = [];
export let currentMission = null;
export let aiVehicles = [];

// Mission types
export const missionTypes = [{
    type: 'delivery',
    name: 'Package Delivery',
    description: 'Deliver packages to marked locations',
    reward: 500,
    difficulty: 1
}, {
    type: 'chase',
    name: 'High Speed Pursuit',
    description: 'Chase down the target vehicle',
    reward: 800,
    difficulty: 2
}, {
    type: 'collect',
    name: 'Data Recovery',
    description: 'Collect scattered data chips',
    reward: 600,
    difficulty: 1
}, {
    type: 'escort',
    name: 'VIP Protection',
    description: 'Escort VIP safely to destination',
    reward: 1000,
    difficulty: 3
}];

// A function to update game state variables from other modules
export function setGameState(newState) {
    Object.assign(
        {
            gameRunning,
            money,
            wantedLevel,
            health,
            keys,
            mousePos,
            camera,
            player,
            vehicles,
            buildings,
            npcs,
            bullets,
            missionMarkers,
            currentMission,
            aiVehicles
        }, newState
    );
}

// World generation with proper city layout
export function generateCity() {
    buildings = [];
    // Create city blocks with proper spacing
    for (let x = 0; x < WORLD_WIDTH; x += BLOCK_SIZE + ROAD_WIDTH) {
        for (let y = 0; y < WORLD_HEIGHT; y += BLOCK_SIZE + ROAD_WIDTH) {
            // Skip some blocks for variety
            if (Math.random() > 0.85) continue;
            // Create multiple buildings per block
            const buildingsPerBlock = Math.floor(Math.random() * 4) + 2;
            for (let i = 0; i < buildingsPerBlock; i++) {
                const buildingWidth = 30 + Math.random() * 40;
                const buildingHeight = 30 + Math.random() * 50;
                const buildingX = x + Math.random() * (BLOCK_SIZE - buildingWidth);
                const buildingY = y + Math.random() * (BLOCK_SIZE - buildingHeight);
                buildings.push({
                    x: buildingX,
                    y: buildingY,
                    width: buildingWidth,
                    height: buildingHeight,
                    color: `hsl(${220 + Math.random() * 40}, 20%, ${15 + Math.random() * 15}%)`,
                    windows: generateWindows(buildingWidth, buildingHeight)
                });
            }
        }
    }
}

function generateWindows(width, height) {
    const windows = [];
    const windowSize = 4;
    const spacing = 8;
    for (let x = spacing; x < width - windowSize; x += spacing) {
        for (let y = spacing; y < height - windowSize; y += spacing) {
            if (Math.random() > 0.3) {
                windows.push({
                    x: x,
                    y: y,
                    lit: Math.random() > 0.6
                });
            }
        }
    }
    return windows;
}

// World initialization
export function initWorld() {
    generateCity();

    // Create vehicles with AI
    setGameState({
        vehicles: [],
        aiVehicles: []
    });
    for (let i = 0; i < 15; i++) {
        const vehicle = {
            x: Math.random() * WORLD_WIDTH,
            y: Math.random() * WORLD_HEIGHT,
            width: 32,
            height: 16,
            speed: 2 + Math.random() * 2,
            angle: Math.random() * Math.PI * 2,
            color: `hsl(${Math.random() * 360}, 60%, 50%)`,
            occupied: false,
            health: 100,
            ai: {
                target: null,
                behavior: 'patrol', // patrol, chase, flee
                pathfinding: [],
                lastDirectionChange: 0
            }
        };
        vehicles.push(vehicle);
        if (Math.random() > 0.7) aiVehicles.push(vehicle);
    }

    // Create smart NPCs
    setGameState({
        npcs: []
    });
    for (let i = 0; i < 25; i++) {
        npcs.push({
            x: Math.random() * WORLD_WIDTH,
            y: Math.random() * WORLD_HEIGHT,
            width: 12,
            height: 12,
            speed: 1 + Math.random(),
            angle: Math.random() * Math.PI * 2,
            color: `hsl(${Math.random() * 360}, 40%, 60%)`,
            health: 50,
            ai: {
                behavior: 'wander',
                target: null,
                alertLevel: 0,
                lastSeen: null
            }
        });
    }

    // Create mission markers
    generateMissionMarkers();
}

export function generateMissionMarkers() {
    setGameState({
        missionMarkers: []
    });
    for (let i = 0; i < 5; i++) {
        missionMarkers.push({
            x: Math.random() * WORLD_WIDTH,
            y: Math.random() * WORLD_HEIGHT,
            active: true,
            missionType: missionTypes[Math.floor(Math.random() * missionTypes.length)],
            pulse: 0
        });
    }
}