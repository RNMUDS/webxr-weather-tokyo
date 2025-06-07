class CityBuilder {
  constructor() {
    this.buildingsContainer = document.querySelector("#city-buildings");
    this.buildingConfigs = this.generateBuildingConfigurations();
  }

  generateBuildingConfigurations() {
    const configs = [];

    // Define road network to avoid
    this.roadNetwork = [
      { x: 0, z: 0, width: 200, height: 8 }, // Main horizontal road
      { x: 0, z: 0, width: 8, height: 200 }, // Main vertical road
      { x: 40, z: 0, width: 8, height: 200 }, // Right vertical road
      { x: -40, z: 0, width: 8, height: 200 }, // Left vertical road
      { x: 0, z: 40, width: 200, height: 8 }, // Top horizontal road
      { x: 0, z: -40, width: 200, height: 8 }, // Bottom horizontal road
    ];

    // Generate buildings in city blocks
    const blockCenters = [
      // Main city blocks
      { x: -20, z: -20 },
      { x: 20, z: -20 },
      { x: -20, z: 20 },
      { x: 20, z: 20 },
      // Secondary blocks
      { x: -60, z: -20 },
      { x: 60, z: -20 },
      { x: -60, z: 20 },
      { x: 60, z: 20 },
      { x: -20, z: -60 },
      { x: 20, z: -60 },
      { x: -20, z: 60 },
      { x: 20, z: 60 },
      // Corner blocks
      { x: -60, z: -60 },
      { x: 60, z: -60 },
      { x: -60, z: 60 },
      { x: 60, z: 60 },
    ];

    blockCenters.forEach((blockCenter) => {
      const buildingsInBlock = Math.floor(Math.random() * 6) + 3; // 3-8 buildings per block

      for (let i = 0; i < buildingsInBlock; i++) {
        let attempts = 0;
        let validPosition = false;
        let position, scale;

        while (!validPosition && attempts < 20) {
          // More realistic Shinjuku building properties
          let height, width, depth, buildingType;
          
          // Determine building type and size based on location
          const distanceFromCenter = Math.sqrt(blockCenter.x * blockCenter.x + blockCenter.z * blockCenter.z);
          
          if (distanceFromCenter < 50) {
            // Central area - taller buildings
            const rand = Math.random();
            if (rand < 0.3) {
              // Skyscraper
              height = Math.random() * 80 + 40; // 40-120 units tall
              width = Math.random() * 8 + 6;    // 6-14 units wide
              depth = Math.random() * 8 + 6;
              buildingType = 'skyscraper';
            } else if (rand < 0.6) {
              // High-rise
              height = Math.random() * 40 + 25; // 25-65 units tall
              width = Math.random() * 6 + 4;    // 4-10 units wide
              depth = Math.random() * 6 + 4;
              buildingType = 'high-rise';
            } else {
              // Mid-rise
              height = Math.random() * 25 + 15; // 15-40 units tall
              width = Math.random() * 5 + 3;    // 3-8 units wide
              depth = Math.random() * 5 + 3;
              buildingType = 'mid-rise';
            }
          } else {
            // Outer area - mixed heights but generally shorter
            const rand = Math.random();
            if (rand < 0.1) {
              // Occasional tall building
              height = Math.random() * 60 + 30;
              width = Math.random() * 7 + 5;
              depth = Math.random() * 7 + 5;
              buildingType = 'tall';
            } else {
              // Normal buildings
              height = Math.random() * 30 + 10;
              width = Math.random() * 4 + 3;
              depth = Math.random() * 4 + 3;
              buildingType = 'normal';
            }
          }

          // Position within block bounds
          position = {
            x: blockCenter.x + (Math.random() - 0.5) * 30,
            y: height / 2,
            z: blockCenter.z + (Math.random() - 0.5) * 30,
          };

          scale = { x: width, y: height, z: depth };

          // Check if building intersects with roads or other buildings
          if (this.isPositionValidForBuilding(position, scale) && 
              this.isPositionValidForBuildingCollision(position, scale, configs)) {
            validPosition = true;
          }
          attempts++;
        }

        if (validPosition) {
          configs.push({
            position: position,
            scale: scale,
            color: this.generateBuildingColor(),
            type: buildingType,
          });
        }
      }
    });

    // Add iconic Shinjuku-style super tall buildings
    const landmarks = [
      // Main cluster inspired by Shinjuku skyscrapers
      { x: -25, z: -25, width: 12, height: 150, depth: 12, name: 'tower1' },
      { x: -35, z: -15, width: 10, height: 140, depth: 10, name: 'tower2' },
      { x: -15, z: -35, width: 8, height: 130, depth: 8, name: 'tower3' },
      
      // Secondary cluster
      { x: 25, z: 25, width: 14, height: 160, depth: 14, name: 'tower4' },
      { x: 35, z: 15, width: 11, height: 145, depth: 11, name: 'tower5' },
      { x: 15, z: 35, width: 9, height: 135, depth: 9, name: 'tower6' },
      
      // Outlying tall buildings
      { x: -60, z: 30, width: 8, height: 90, depth: 8, name: 'outlier1' },
      { x: 60, z: -30, width: 10, height: 85, depth: 10, name: 'outlier2' },
      { x: -30, z: 60, width: 9, height: 95, depth: 9, name: 'outlier3' },
      { x: 30, z: -60, width: 7, height: 80, depth: 7, name: 'outlier4' },
      
      // Mixed-use buildings
      { x: 0, z: -80, width: 16, height: 120, depth: 16, name: 'complex1' },
      { x: 0, z: 80, width: 18, height: 110, depth: 18, name: 'complex2' },
    ];

    landmarks.forEach((landmark) => {
      const position = { x: landmark.x, y: landmark.height / 2, z: landmark.z };
      const scale = {
        x: landmark.width,
        y: landmark.height,
        z: landmark.depth,
      };

      if (this.isPositionValidForBuilding(position, scale) &&
          this.isPositionValidForBuildingCollision(position, scale, configs)) {
        configs.push({
          position: position,
          scale: scale,
          color: this.generateBuildingColor(),
          type: "mega-skyscraper",
          name: landmark.name,
        });
      }
    });

    return configs;
  }

  isPositionValidForBuilding(position, scale) {
    // Check intersection with roads
    for (const road of this.roadNetwork) {
      const buildingLeft = position.x - scale.x / 2;
      const buildingRight = position.x + scale.x / 2;
      const buildingTop = position.z + scale.z / 2;
      const buildingBottom = position.z - scale.z / 2;

      const roadLeft = road.x - road.width / 2;
      const roadRight = road.x + road.width / 2;
      const roadTop = road.z + road.height / 2;
      const roadBottom = road.z - road.height / 2;

      // Check for intersection
      if (
        buildingLeft < roadRight &&
        buildingRight > roadLeft &&
        buildingBottom < roadTop &&
        buildingTop > roadBottom
      ) {
        return false; // Building intersects with road
      }
    }

    return true; // Position is valid
  }

  isPositionValidForBuildingCollision(position, scale, existingBuildings) {
    // Check collision with other buildings
    for (const building of existingBuildings) {
      const dx = Math.abs(position.x - building.position.x);
      const dz = Math.abs(position.z - building.position.z);
      
      const minDistanceX = (scale.x + building.scale.x) / 2 + 2; // 2 unit buffer
      const minDistanceZ = (scale.z + building.scale.z) / 2 + 2;
      
      if (dx < minDistanceX && dz < minDistanceZ) {
        return false; // Buildings would overlap
      }
    }
    return true;
  }

  generateBuildingColor() {
    // Realistic modern building colors - mainly whites, grays, glass blues
    const colors = [
      "#f8f9fa", // Light gray/white
      "#e9ecef", // Light gray
      "#dee2e6", // Medium light gray
      "#ced4da", // Medium gray
      "#adb5bd", // Darker gray
      "#6c757d", // Dark gray
      "#495057", // Very dark gray
      "#343a40", // Charcoal
      "#212529", // Near black
      "#2c5aa0", // Blue glass
      "#1e3a5f", // Dark blue glass
      "#87ceeb", // Sky blue glass
      "#4682b4", // Steel blue
      "#708090", // Slate gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  generateBuildingMaterial(color, type) {
    const isGlass = Math.random() > 0.6; // 40% chance of glass buildings

    if (isGlass) {
      return {
        color: color,
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.8,
        transparent: true,
      };
    } else {
      return {
        color: color,
        metalness: 0.0,
        roughness: 0.8,
      };
    }
  }

  buildCity() {
    // Clear existing buildings
    while (this.buildingsContainer.firstChild) {
      this.buildingsContainer.removeChild(this.buildingsContainer.firstChild);
    }

    // First, create expanded ground and roads
    this.createGroundAndRoads();

    // Create buildings with windows
    this.buildingConfigs.forEach((config, index) => {
      this.createBuildingWithWindows(config, index);
    });

    // Add street trees
    this.addStreetTrees();

    // Add street lights
    this.addStreetLights();
  }

  createGroundAndRoads() {
    // Create expanded ground plane
    const ground = document.querySelector("#ground");
    ground.setAttribute("width", "200");
    ground.setAttribute("height", "200");
    ground.setAttribute("color", "#4a4a4a");

    // Create main roads
    const roadWidth = 8;
    const roadPositions = [
      { x: 0, z: 0, width: 200, height: roadWidth, rotation: "0" }, // Main horizontal road
      { x: 0, z: 0, width: roadWidth, height: 200, rotation: "90" }, // Main vertical road
      { x: 40, z: 0, width: roadWidth, height: 200, rotation: "90" }, // Right vertical road
      { x: -40, z: 0, width: roadWidth, height: 200, rotation: "90" }, // Left vertical road
      { x: 0, z: 40, width: 200, height: roadWidth, rotation: "0" }, // Top horizontal road
      { x: 0, z: -40, width: 200, height: roadWidth, rotation: "0" }, // Bottom horizontal road
    ];

    roadPositions.forEach((road) => {
      const roadElement = document.createElement("a-plane");
      roadElement.setAttribute("position", `${road.x} 0.05 ${road.z}`);
      roadElement.setAttribute("rotation", `-90 ${road.rotation} 0`);
      roadElement.setAttribute("width", road.width);
      roadElement.setAttribute("height", road.height);
      roadElement.setAttribute("color", "#2c2c2c");
      roadElement.setAttribute("material", "roughness: 0.8");
      this.buildingsContainer.appendChild(roadElement);
    });
  }

  createBuildingWithWindows(config, index) {
    // Create main building
    const building = document.createElement("a-box");
    building.setAttribute(
      "position",
      `${config.position.x} ${config.position.y} ${config.position.z}`
    );
    building.setAttribute(
      "scale",
      `${config.scale.x} ${config.scale.y} ${config.scale.z}`
    );

    const material = this.generateBuildingMaterial(config.color, config.type);
    let materialString = `color: ${material.color}; roughness: ${material.roughness}; metalness: ${material.metalness}`;
    if (material.transparent) {
      materialString += `; opacity: ${material.opacity}; transparent: true`;
    }

    // Enhanced materials for different building types
    if (config.type === 'mega-skyscraper') {
      materialString += '; emissive: #FFE4B5; emissiveIntensity: 0.2';
    } else if (config.type === 'skyscraper' || config.type === 'high-rise') {
      materialString += '; emissive: #FFE4B5; emissiveIntensity: 0.1';
    }

    building.setAttribute("material", materialString);
    building.setAttribute("shadow", "cast: true; receive: true");
    this.buildingsContainer.appendChild(building);

    // Add windows
    this.addWindowsToBuilding(config);

    // Add rooftop details for some buildings
    if (Math.random() > 0.7 && 
        config.type !== "skyscraper" && 
        config.type !== "mega-skyscraper" && 
        config.type !== "high-rise") {
      this.addRooftopDetails(config);
    }
  }

  addWindowsToBuilding(config) {
    const windowSize = 0.8;
    const windowSpacing = 2;
    const floorsCount = Math.floor(config.scale.y / 3); // One floor every 3 units

    // Calculate window grid
    const windowsPerFloor = Math.max(
      1,
      Math.floor(config.scale.x / windowSpacing)
    );

    for (let floor = 1; floor < floorsCount; floor++) {
      const y = config.position.y - config.scale.y / 2 + floor * 3 + 1;

      // Front and back faces
      for (let i = 0; i < windowsPerFloor; i++) {
        const x =
          config.position.x - config.scale.x / 2 + (i + 0.5) * windowSpacing;

        if (Math.random() > 0.3) {
          // 70% chance of window
          // Front windows - moved further out to avoid z-fighting
          this.createWindow(
            x,
            y,
            config.position.z + config.scale.z / 2 + 0.1,
            "0"
          );
          // Back windows
          this.createWindow(
            x,
            y,
            config.position.z - config.scale.z / 2 - 0.1,
            "180"
          );
        }
      }

      // Left and right faces
      const windowsPerSide = Math.max(
        1,
        Math.floor(config.scale.z / windowSpacing)
      );
      for (let i = 0; i < windowsPerSide; i++) {
        const z =
          config.position.z - config.scale.z / 2 + (i + 0.5) * windowSpacing;

        if (Math.random() > 0.3) {
          // 70% chance of window
          // Left windows - moved further out to avoid z-fighting
          this.createWindow(
            config.position.x - config.scale.x / 2 - 0.1,
            y,
            z,
            "90"
          );
          // Right windows
          this.createWindow(
            config.position.x + config.scale.x / 2 + 0.1,
            y,
            z,
            "-90"
          );
        }
      }
    }
  }

  createWindow(x, y, z, rotation) {
    const window = document.createElement("a-plane");
    window.setAttribute("position", `${x} ${y} ${z}`);
    window.setAttribute("rotation", `0 ${rotation} 0`);
    window.setAttribute("width", "1.5");
    window.setAttribute("height", "2");

    // Random window state
    const isLit = Math.random() > 0.6;
    const windowColor = isLit ? "#ffeb9c" : "#87ceeb";
    const emissiveIntensity = isLit ? 0.3 : 0.0;

    window.setAttribute(
      "material",
      `color: ${windowColor}; emissive: ${windowColor}; emissiveIntensity: ${emissiveIntensity}; opacity: 0.8; transparent: true`
    );
    this.buildingsContainer.appendChild(window);
  }

  addRooftopDetails(config) {
    const rooftop = document.createElement("a-box");
    rooftop.setAttribute(
      "position",
      `${config.position.x} ${config.position.y + config.scale.y / 2 + 1} ${
        config.position.z
      }`
    );
    rooftop.setAttribute(
      "scale",
      `${config.scale.x * 0.8} 2 ${config.scale.z * 0.8}`
    );
    rooftop.setAttribute("color", "#555555");
    this.buildingsContainer.appendChild(rooftop);
  }

  addStreetTrees() {
    // Trees along main roads
    const treePositions = [];

    // Trees along horizontal roads
    for (let x = -80; x <= 80; x += 15) {
      if (Math.abs(x) > 10) {
        // Avoid center intersection
        treePositions.push({ x: x, z: 6 }); // North side
        treePositions.push({ x: x, z: -6 }); // South side
        treePositions.push({ x: x, z: 46 }); // Far north
        treePositions.push({ x: x, z: -46 }); // Far south
      }
    }

    // Trees along vertical roads
    for (let z = -80; z <= 80; z += 15) {
      if (Math.abs(z) > 10) {
        // Avoid center intersection
        treePositions.push({ x: 6, z: z }); // East side
        treePositions.push({ x: -6, z: z }); // West side
        treePositions.push({ x: 46, z: z }); // Far east
        treePositions.push({ x: -46, z: z }); // Far west
      }
    }

    // Random trees in empty spaces
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;

      // Check if position is clear of roads and buildings
      if (this.isPositionClearForTree(x, z)) {
        treePositions.push({ x, z });
      }
    }

    treePositions.forEach((pos) => {
      this.createTree(pos.x, pos.z);
    });
  }

  isPositionClearForTree(x, z) {
    // Check if position intersects with roads using the same logic as buildings
    const treeSize = 2; // Approximate tree radius
    const position = { x: x, y: 0, z: z };
    const scale = { x: treeSize, y: 1, z: treeSize };

    if (!this.isPositionValidForBuilding(position, scale)) {
      return false; // Tree would intersect with road
    }

    // Check distance from buildings - increased buffer distance
    return !this.buildingConfigs.some((building) => {
      const dx = Math.abs(x - building.position.x);
      const dz = Math.abs(z - building.position.z);
      return dx < building.scale.x / 2 + 8 && dz < building.scale.z / 2 + 8;
    });
  }

  createTree(x, z) {
    // Tree trunk
    const trunk = document.createElement("a-cylinder");
    trunk.setAttribute("position", `${x} 2 ${z}`);
    trunk.setAttribute("radius", "0.3");
    trunk.setAttribute("height", "4");
    trunk.setAttribute("color", "#8B4513");
    this.buildingsContainer.appendChild(trunk);

    // Tree foliage - multiple spheres for natural look
    const foliageColors = ["#228B22", "#32CD32", "#006400"];
    for (let i = 0; i < 3; i++) {
      const foliage = document.createElement("a-sphere");
      const offsetX = (Math.random() - 0.5) * 2;
      const offsetZ = (Math.random() - 0.5) * 2;
      const offsetY = Math.random() * 1 + 4;

      foliage.setAttribute(
        "position",
        `${x + offsetX} ${offsetY} ${z + offsetZ}`
      );
      foliage.setAttribute("radius", Math.random() * 1.5 + 2);
      foliage.setAttribute(
        "color",
        foliageColors[Math.floor(Math.random() * foliageColors.length)]
      );
      this.buildingsContainer.appendChild(foliage);
    }
  }

  addStreetLights() {
    const lightPositions = [
      { x: -15, z: 0 },
      { x: 15, z: 0 },
      { x: 0, z: -15 },
      { x: 0, z: 15 },
      { x: -30, z: -30 },
      { x: 30, z: 30 },
      { x: -30, z: 30 },
      { x: 30, z: -30 },
    ];

    lightPositions.forEach((pos) => {
      // Light pole
      const pole = document.createElement("a-cylinder");
      pole.setAttribute("position", `${pos.x} 2.5 ${pos.z}`);
      pole.setAttribute("radius", "0.2");
      pole.setAttribute("height", "5");
      pole.setAttribute("color", "#333333");
      this.buildingsContainer.appendChild(pole);

      // Light bulb
      const light = document.createElement("a-sphere");
      light.setAttribute("position", `${pos.x} 5 ${pos.z}`);
      light.setAttribute("radius", "0.5");
      light.setAttribute("color", "#FFFACD");
      light.setAttribute(
        "material",
        "emissive: #FFFACD; emissiveIntensity: 0.5"
      );
      this.buildingsContainer.appendChild(light);

      // Add point light
      const pointLight = document.createElement("a-light");
      pointLight.setAttribute("type", "point");
      pointLight.setAttribute("position", `${pos.x} 5 ${pos.z}`);
      pointLight.setAttribute("color", "#FFFACD");
      pointLight.setAttribute("intensity", "0.3");
      pointLight.setAttribute("distance", "15");
      this.buildingsContainer.appendChild(pointLight);
    });
  }

  updateLighting(weatherCondition) {
    const sky = document.querySelector("#sky");
    const sun = document.querySelector("#sun");
    const ambientLight = document.querySelector('a-light[type="ambient"]');

    switch (weatherCondition) {
      case "clear":
        sky.setAttribute("color", "#87CEEB");
        sun.setAttribute("intensity", "0.7");
        ambientLight.setAttribute("intensity", "0.3");
        break;
      case "partly_cloudy":
        sky.setAttribute("color", "#B0C4DE");
        sun.setAttribute("intensity", "0.5");
        ambientLight.setAttribute("intensity", "0.4");
        break;
      case "cloudy":
      case "fog":
        sky.setAttribute("color", "#696969");
        sun.setAttribute("intensity", "0.2");
        ambientLight.setAttribute("intensity", "0.5");
        break;
      case "rain":
      case "thunderstorm":
        sky.setAttribute("color", "#4B4B4B");
        sun.setAttribute("intensity", "0.1");
        ambientLight.setAttribute("intensity", "0.6");
        break;
      case "snow":
        sky.setAttribute("color", "#D3D3D3");
        sun.setAttribute("intensity", "0.3");
        ambientLight.setAttribute("intensity", "0.5");
        break;
    }
  }
}

// Create global instance
window.cityBuilder = new CityBuilder();
