import {
    player,
    missionMarkers,
    currentMission,
    money,
    missionTypes,
    setGameState,
    vehicles,
    generateMissionMarkers
} from './game.js';

export function checkMissionStart() {
    const nearbyMarker = missionMarkers.find(m =>
        m.active &&
        Math.abs(m.x - player.x) < 50 &&
        Math.abs(m.y - player.y) < 50
    );

    if (nearbyMarker && !currentMission) {
        startMission(nearbyMarker.missionType);
        nearbyMarker.active = false;
    }
}

function startMission(missionType) {
    setGameState({
        currentMission: {
            ...missionType,
            progress: 0,
            target: 3 + Math.floor(Math.random() * 3),
            timeLeft: 90000,
            startTime: Date.now(),
            objectives: []
        }
    });

    // Generate mission objectives based on type
    generateMissionObjectives(currentMission);

    document.getElementById('missionPanel').style.display = 'block';
    document.getElementById('missionText').textContent = missionType.description;
    document.getElementById('missionProgress').style.display = 'block';
    updateMissionDisplay();
}

function generateMissionObjectives(mission) {
    mission.objectives = [];
    switch (mission.type) {
        case 'delivery':
            for (let i = 0; i < mission.target; i++) {
                mission.objectives.push({
                    x: Math.random() * 2400, // WORLD_WIDTH
                    y: Math.random() * 1600, // WORLD_HEIGHT
                    completed: false,
                    type: 'delivery'
                });
            }
            break;

        case 'chase':
            // Create target vehicle
            const targetVehicle = {
                x: Math.random() * 2400,
                y: Math.random() * 1600,
                width: 32,
                height: 16,
                speed: 4,
                angle: Math.random() * Math.PI * 2,
                color: '#ff4444',
                ai: {
                    behavior: 'flee',
                    target: player
                }
            };
            vehicles.push(targetVehicle);
            mission.targetVehicle = targetVehicle;
            break;

        case 'collect':
            for (let i = 0; i < mission.target; i++) {
                mission.objectives.push({
                    x: Math.random() * 2400,
                    y: Math.random() * 1600,
                    completed: false,
                    type: 'collect'
                });
            }
            break;
    }
}

export function updateMissions() {
    if (!currentMission) return;

    // Check mission objectives
    if (currentMission.objectives) {
        currentMission.objectives.forEach((obj, index) => {
            if (!obj.completed) {
                const dist = Math.sqrt(
                    Math.pow(obj.x - player.x, 2) + Math.pow(obj.y - player.y, 2)
                );

                if (dist < 30) {
                    obj.completed = true;
                    currentMission.progress++;
                    showNotification('+$100 Objective Complete');
                    setGameState({
                        money: money + 100
                    });
                }
            }
        });
    }

    // Check mission completion
    if (currentMission.progress >= currentMission.target) {
        completeMission();
    }

    updateMissionDisplay();
}

function completeMission() {
    setGameState({
        money: money + currentMission.reward,
        currentMission: null
    });

    showNotification(`Mission Complete! +$${currentMission.reward}`);

    document.getElementById('missionPanel').style.display = 'none';

    // Generate new mission markers
    setTimeout(() => {
        generateMissionMarkers();
    }, 5000);
}

export function updateMissionDisplay() {
    if (!currentMission) return;

    document.getElementById('objective').textContent = currentMission.name;
    document.getElementById('progressText').textContent =
        `${currentMission.progress}/${currentMission.target}`;

    const progressPercent = (currentMission.progress / currentMission.target) * 100;
    document.getElementById('progressBar').style.width = progressPercent + '%';
}

function showNotification(text) {
    const notification = document.getElementById('notification');
    document.getElementById('notificationText').textContent = text;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}