import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    BLOCK_SIZE,
    ROAD_WIDTH
} from './game.js';

export function drawWorld(ctx, canvas, camera, buildings, missionMarkers, currentMission, vehicles, npcs, bullets, player) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw roads
    ctx.fillStyle = '#2a2a3a';
    // Horizontal roads
    for (let y = 0; y < WORLD_HEIGHT; y += BLOCK_SIZE + ROAD_WIDTH) {
        ctx.fillRect(0 - camera.x, y - camera.y, WORLD_WIDTH, ROAD_WIDTH);
        ctx.fillStyle = '#4a4a5a';
        for (let x = 0; x < WORLD_WIDTH; x += 40) {
            ctx.fillRect(x - camera.x, y + ROAD_WIDTH / 2 - 1 - camera.y, 20, 2);
        }
        ctx.fillStyle = '#2a2a3a';
    }
    // Vertical roads
    for (let x = 0; x < WORLD_WIDTH; x += BLOCK_SIZE + ROAD_WIDTH) {
        ctx.fillRect(x - camera.x, 0 - camera.y, ROAD_WIDTH, WORLD_HEIGHT);
        ctx.fillStyle = '#4a4a5a';
        for (let y = 0; y < WORLD_HEIGHT; y += 40) {
            ctx.fillRect(x + ROAD_WIDTH / 2 - 1 - camera.x, y - camera.y, 2, 20);
        }
        ctx.fillStyle = '#2a2a3a';
    }

    // Draw buildings
    buildings.forEach(building => {
        const screenX = building.x - camera.x;
        const screenY = building.y - camera.y;

        if (screenX > -building.width && screenX < canvas.width &&
            screenY > -building.height && screenY < canvas.height) {

            // Building shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(screenX + 2, screenY + 2, building.width, building.height);
            // Building
            ctx.fillStyle = building.color;
            ctx.fillRect(screenX, screenY, building.width, building.height);
            // Windows
            building.windows.forEach(window => {
                ctx.fillStyle = window.lit ? '#ffeb3b' : '#1a1a2e';
                ctx.fillRect(screenX + window.x, screenY + window.y, 4, 4);
            });
            // Building outline
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX, screenY, building.width, building.height);
        }
    });

    // Draw mission markers
    missionMarkers.forEach(marker => {
        if (!marker.active) return;
        const screenX = marker.x - camera.x;
        const screenY = marker.y - camera.y;
        if (screenX > -50 && screenX < canvas.width + 50 && screenY > -50 && screenY < canvas.height + 50) {
            marker.pulse += 0.1;
            const pulseSize = 20 + Math.sin(marker.pulse) * 5;
            ctx.fillStyle = `rgba(64, 224, 208, ${0.3 + Math.sin(marker.pulse) * 0.2})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#40e0d0';
            ctx.beginPath();
            ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Draw mission objectives
    if (currentMission && currentMission.objectives) {
        currentMission.objectives.forEach(obj => {
            if (obj.completed) return;
            const screenX = obj.x - camera.x;
            const screenY = obj.y - camera.y;
            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffc107';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    // Draw vehicles
    vehicles.forEach(vehicle => {
        const screenX = vehicle.x - camera.x;
        const screenY = vehicle.y - camera.y;
        if (screenX > -50 && screenX < canvas.width + 50 && screenY > -50 && screenY < canvas.height + 50) {
            ctx.save();
            ctx.translate(screenX + vehicle.width / 2, screenY + vehicle.height / 2);
            ctx.rotate(vehicle.angle);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(-vehicle.width / 2 + 1, -vehicle.height / 2 + 1, vehicle.width, vehicle.height);
            ctx.fillStyle = vehicle.color;
            ctx.fillRect(-vehicle.width / 2, -vehicle.height / 2, vehicle.width, vehicle.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(-vehicle.width / 2 + 4, -vehicle.height / 2 + 2, vehicle.width - 8, vehicle.height - 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(vehicle.width / 2 - 2, -vehicle.height / 2, 2, 3);
            ctx.fillRect(vehicle.width / 2 - 2, vehicle.height / 2 - 3, 2, 3);
            ctx.restore();
        }
    });

    // Draw NPCs
    npcs.forEach(npc => {
        const screenX = npc.x - camera.x;
        const screenY = npc.y - camera.y;
        if (screenX > -20 && screenX < canvas.width + 20 && screenY > -20 && screenY < canvas.height + 20) {
            ctx.fillStyle = npc.color;
            ctx.beginPath();
            ctx.arc(screenX + npc.width / 2, screenY + npc.height / 2, npc.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const dirX = screenX + npc.width / 2 + Math.cos(npc.angle) * 4;
            const dirY = screenY + npc.height / 2 + Math.sin(npc.angle) * 4;
            ctx.beginPath();
            ctx.arc(dirX, dirY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Draw bullets
    bullets.forEach(bullet => {
        const screenX = bullet.x - camera.x;
        const screenY = bullet.y - camera.y;
        ctx.fillStyle = bullet.fromPlayer ? '#40e0d0' : '#ff6b6b';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw player
    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;
    if (player.inVehicle && player.vehicle) {
        ctx.save();
        ctx.translate(screenX + player.vehicle.width / 2, screenY + player.vehicle.height / 2);
        ctx.rotate(player.angle);
        ctx.shadowColor = '#40e0d0';
        ctx.shadowBlur = 10;
        ctx.fillStyle = player.vehicle.color;
        ctx.fillRect(-player.vehicle.width / 2, -player.vehicle.height / 2, player.vehicle.width, player.vehicle.height);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(-player.vehicle.width / 2 + 4, -player.vehicle.height / 2 + 2, player.vehicle.width - 8, player.vehicle.height - 4);
        ctx.restore();
    } else {
        ctx.fillStyle = '#40e0d0';
        ctx.shadowColor = '#40e0d0';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(screenX + player.width / 2, screenY + player.height / 2, player.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        const dirX = screenX + player.width / 2 + Math.cos(player.angle) * 6;
        const dirY = screenY + player.height / 2 + Math.sin(player.angle) * 6;
        ctx.beginPath();
        ctx.arc(dirX, dirY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawMinimap(minimapCtx, minimap, WORLD_WIDTH, WORLD_HEIGHT, buildings, missionMarkers, player) {
    minimapCtx.clearRect(0, 0, minimap.width, minimap.height);
    minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    minimapCtx.fillRect(0, 0, minimap.width, minimap.height);
    const scaleX = minimap.width / WORLD_WIDTH;
    const scaleY = minimap.height / WORLD_HEIGHT;

    minimapCtx.fillStyle = '#444';
    for (let x = 0; x < WORLD_WIDTH; x += BLOCK_SIZE + ROAD_WIDTH) {
        minimapCtx.fillRect(x * scaleX, 0, ROAD_WIDTH * scaleX, minimap.height);
    }
    for (let y = 0; y < WORLD_HEIGHT; y += BLOCK_SIZE + ROAD_WIDTH) {
        minimapCtx.fillRect(0, y * scaleY, minimap.width, ROAD_WIDTH * scaleY);
    }
    minimapCtx.fillStyle = '#666';
    buildings.forEach(building => {
        minimapCtx.fillRect(
            building.x * scaleX,
            building.y * scaleY,
            building.width * scaleX,
            building.height * scaleY
        );
    });

    minimapCtx.fillStyle = '#40e0d0';
    missionMarkers.forEach(marker => {
        if (marker.active) {
            minimapCtx.beginPath();
            minimapCtx.arc(marker.x * scaleX, marker.y * scaleY, 3, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    });

    minimapCtx.fillStyle = '#40e0d0';
    minimapCtx.strokeStyle = '#ffffff';
    minimapCtx.lineWidth = 1;
    minimapCtx.beginPath();
    minimapCtx.arc(player.x * scaleX, player.y * scaleY, 4, 0, Math.PI * 2);
    minimapCtx.fill();
    minimapCtx.stroke();
}