import {
    wantedLevel,
    setGameState
} from './game.js';

export function updateUI(money, health) {
    document.getElementById('money').textContent = money;
    document.getElementById('healthBar').style.width = health + '%';
    document.getElementById('healthPercent').textContent = Math.floor(health) + '%';
    document.getElementById('wantedLevel').textContent = Math.floor(wantedLevel);

    // Decrease wanted level over time
    if (wantedLevel > 0) {
        setGameState({
            wantedLevel: Math.max(0, wantedLevel - 0.01)
        });
    }
}