import {
    player,
    keys,
    mousePos,
    camera,
    canvas,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    vehicles,
    setGameState
} from './game.js';

export function toggleVehicle() {
    if (player.inVehicle) {
        setGameState({
            player: {
                ...player,
                inVehicle: false,
                x: player.vehicle.x + 40,
                y: player.vehicle.y,
                vehicle: null,
                speed: 3.5
            }
        });
        player.vehicle.occupied = false;
    } else {
        const nearbyVehicle = vehicles.find(v =>
            !v.occupied &&
            Math.abs(v.x - player.x) < 40 &&
            Math.abs(v.y - player.y) < 40
        );

        if (nearbyVehicle) {
            setGameState({
                player: {
                    ...player,
                    inVehicle: true,
                    vehicle: nearbyVehicle,
                    speed: 5
                }
            });
            nearbyVehicle.occupied = true;
        }
    }
}

export function shoot() {
    const angle = Math.atan2(
        mousePos.y - 300, // canvas.height / 2
        mousePos.x - 400 // canvas.width / 2
    );

    setGameState({
        bullets: [...bullets, {
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * 8,
            vy: Math.sin(angle) * 8,
            life: 80,
            fromPlayer: true
        }]
    });

    setGameState({
        wantedLevel: Math.min(5, wantedLevel + 0.2)
    });
}

export function updatePlayer() {
    if (player.inVehicle && player.vehicle) {
        if (keys['KeyW'] || keys['ArrowUp']) {
            player.vehicle.x += Math.cos(player.vehicle.angle) * player.vehicle.speed;
            player.vehicle.y += Math.sin(player.vehicle.angle) * player.vehicle.speed;
        }
        if (keys['KeyS'] || keys['ArrowDown']) {
            player.vehicle.x -= Math.cos(player.vehicle.angle) * player.vehicle.speed * 0.5;
            player.vehicle.y -= Math.sin(player.vehicle.angle) * player.vehicle.speed * 0.5;
        }
        if (keys['KeyA'] || keys['ArrowLeft']) {
            player.vehicle.angle -= 0.08;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            player.vehicle.angle += 0.08;
        }

        player.x = player.vehicle.x;
        player.y = player.vehicle.y;
        player.angle = player.vehicle.angle;
    } else {
        if (keys['KeyW'] || keys['ArrowUp']) player.y -= player.speed;
        if (keys['KeyS'] || keys['ArrowDown']) player.y += player.speed;
        if (keys['KeyA'] || keys['ArrowLeft']) player.x -= player.speed;
        if (keys['KeyD'] || keys['ArrowRight']) player.x += player.speed;
    }

    player.x = Math.max(0, Math.min(WORLD_WIDTH, player.x));
    player.y = Math.max(0, Math.min(WORLD_HEIGHT, player.y));

    // Smooth camera follow
    const targetCameraX = player.x - 400; // canvas.width / 2
    const targetCameraY = player.y - 300; // canvas.height / 2
    camera.x += (targetCameraX - camera.x) * 0.1;
    camera.y += (targetCameraY - camera.y) * 0.1;

    camera.x = Math.max(0, Math.min(WORLD_WIDTH - 800, camera.x));
    camera.y = Math.max(0, Math.min(WORLD_HEIGHT - 600, camera.y));
}