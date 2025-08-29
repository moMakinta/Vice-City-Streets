import {
    npcs,
    player,
    wantedLevel,
    aiVehicles,
    buildings,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    setGameState
} from './game.js';

export function updateAI() {
    // Update NPC AI
    npcs.forEach(npc => {
        const distToPlayer = Math.sqrt(
            Math.pow(npc.x - player.x, 2) + Math.pow(npc.y - player.y, 2)
        );

        if (distToPlayer < 100 && wantedLevel > 2) {
            // Flee from player if wanted
            npc.ai.behavior = 'flee';
            npc.angle = Math.atan2(npc.y - player.y, npc.x - player.x);
        } else if (distToPlayer > 200) {
            npc.ai.behavior = 'wander';
        }

        // Execute behavior
        switch (npc.ai.behavior) {
            case 'wander':
                if (Math.random() < 0.02) {
                    npc.angle += (Math.random() - 0.5) * 0.5;
                }
                break;
            case 'flee':
                npc.speed = 2;
                break;
        }

        npc.x += Math.cos(npc.angle) * npc.speed;
        npc.y += Math.sin(npc.angle) * npc.speed;

        // Keep in bounds
        if (npc.x < 0 || npc.x > WORLD_WIDTH) npc.angle = Math.PI - npc.angle;
        if (npc.y < 0 || npc.y > WORLD_HEIGHT) npc.angle = -npc.angle;
    });

    // Update AI vehicles
    aiVehicles.forEach(vehicle => {
        if (vehicle.occupied) return;

        const now = Date.now();
        if (now - vehicle.ai.lastDirectionChange > 3000) {
            vehicle.ai.lastDirectionChange = now;

            // Simple pathfinding - avoid buildings
            const ahead = {
                x: vehicle.x + Math.cos(vehicle.angle) * 60,
                y: vehicle.y + Math.sin(vehicle.angle) * 60
            };

            const collision = buildings.some(building =>
                ahead.x > building.x && ahead.x < building.x + building.width &&
                ahead.y > building.y && ahead.y < building.y + building.height
            );

            if (collision) {
                vehicle.angle += Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 4;
            }
        }

        vehicle.x += Math.cos(vehicle.angle) * vehicle.speed;
        vehicle.y += Math.sin(vehicle.angle) * vehicle.speed;

        // Keep in bounds
        if (vehicle.x < 0 || vehicle.x > WORLD_WIDTH) vehicle.angle = Math.PI - vehicle.angle;
        if (vehicle.y < 0 || vehicle.y > WORLD_HEIGHT) vehicle.angle = -vehicle.angle;
    });
}