import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    player,
    keys,
    mousePos,
    camera,
    gameRunning,
    money,
    wantedLevel,
    health,
    vehicles,
    buildings,
    npcs,
    bullets,
    missionMarkers,
    currentMission,
    aiVehicles,
    setGameState,
    initWorld,
    checkMissionStart
} from './game.js';

import {
    updatePlayer,
    toggleVehicle,
    shoot
} from './player.js';

import {
    updateAI
} from './ai.js';

import {
    updateMissions,
    updateMissionDisplay,
    showNotification
} from './mission.js';

import {
    drawWorld,
    drawMinimap
} from './render.js';

import {
    updateUI
} from './ui.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minimap = document.getElementById('minimap');
const minimapCtx = minimap.getContext('2d');
const startButton = document.getElementById('startButton');

// Game Loop
function gameLoop() {
    if (!gameRunning) return;

    updatePlayer();
    updateBullets();
    updateAI();
    updateMissions();

    drawWorld(ctx, canvas, camera, buildings, missionMarkers, currentMission, vehicles, npcs, bullets, player);
    drawMinimap(minimapCtx, minimap, WORLD_WIDTH, WORLD_HEIGHT, buildings, missionMarkers, player);
    updateUI(money, health, wantedLevel);

    requestAnimationFrame(gameLoop);
}

// Input handling
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyE' && gameRunning) toggleVehicle();
    if (e.code === 'KeyR' && gameRunning) checkMissionStart();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
    if (gameRunning && !player.inVehicle) shoot();
});

// Start button event listener
startButton.addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    setGameState({ gameRunning: true });
    initWorld();
    gameLoop();
});

// Update bullet positions
function updateBullets() {
    setGameState({
        bullets: bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            return bullet.life > 0;
        })
    });
}