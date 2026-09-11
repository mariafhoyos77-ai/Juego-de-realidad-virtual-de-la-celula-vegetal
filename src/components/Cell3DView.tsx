import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ORGANELLES } from '../data/organellesData';
import { OrganelleInfo, ViewMode } from '../types/cell';
import { sound } from '../utils/audio';

interface Cell3DViewProps {
  currentCheckpointId: string;
  viewMode: ViewMode;
  explodedOffset: number; // 0 to 1
  onSelectOrganelle: (organelle: OrganelleInfo) => void;
  showLabels: boolean;
  highlightedOrganelleId: string | null;
}

export const Cell3DView: React.FC<Cell3DViewProps> = ({
  currentCheckpointId,
  viewMode,
  explodedOffset,
  onSelectOrganelle,
  showLabels,
  highlightedOrganelleId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Group references
  const upperLidGroupRef = useRef<THREE.Group | null>(null);
  const cellGroupRef = useRef<THREE.Group | null>(null);
  const organelleMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const beaconGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Points | null>(null);

  // Camera Animation Target
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 6.5));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Controls state for Orbit & Nanobot
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngles = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI * 0.25,
    phi: Math.PI * 0.35,
    radius: 7.5
  });

  // Nanobot controls (First Person)
  const nanobotPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 1.8));
  const nanobotRot = useRef<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const [hoveredOrganelle, setHoveredOrganelle] = useState<OrganelleInfo | null>(null);

  // Initialize Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d14);
    scene.fog = new THREE.FogExp2(0x070d14, 0.045);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 7.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfffaed, 2.0);
    mainSun.position.set(6, 12, 8);
    scene.add(mainSun);

    const rimLight = new THREE.DirectionalLight(0x73d2de, 1.2);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x52b788, 1.5, 12);
    bottomGlow.position.set(0, -2, 0);
    scene.add(bottomGlow);

    const vacuoleBlueLight = new THREE.PointLight(0x38bdf8, 2.2, 8);
    vacuoleBlueLight.position.set(0.1, 0, 0.2);
    scene.add(vacuoleBlueLight);

    // Root Cell Container
    const cellGroup = new THREE.Group();
    scene.add(cellGroup);
    cellGroupRef.current = cellGroup;

    // ==========================================
    // 1. PARED CELULAR (Lower Cutaway Hemisphere)
    // ==========================================
    // Outer Wall (Green shell)
    const wallGeo = new THREE.SphereGeometry(3.6, 48, 24, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x629955,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const outerWall = new THREE.Mesh(wallGeo, wallMat);
    outerWall.rotation.x = Math.PI;
    cellGroup.add(outerWall);

    // Wall Rim / Thickness band
    const rimGeo = new THREE.RingGeometry(3.3, 3.65, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x85b878,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.05;
    cellGroup.add(rim);

    // Membrana Plasmática Inner Lining
    const innerMembraneGeo = new THREE.RingGeometry(3.15, 3.3, 48);
    const innerMembraneMat = new THREE.MeshStandardMaterial({
      color: 0xe9c46a,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const innerMembrane = new THREE.Mesh(innerMembraneGeo, innerMembraneMat);
    innerMembrane.rotation.x = -Math.PI / 2;
    innerMembrane.position.y = 0.051;
    cellGroup.add(innerMembrane);

    // Cytoplasm Floor (Cross-section disc)
    const cytoFloorGeo = new THREE.CircleGeometry(3.15, 48);
    const cytoFloorMat = new THREE.MeshStandardMaterial({
      color: 0xb7e4a8,
      roughness: 0.65,
      metalness: 0.05
    });
    const cytoFloor = new THREE.Mesh(cytoFloorGeo, cytoFloorMat);
    cytoFloor.rotation.x = -Math.PI / 2;
    cytoFloor.position.y = 0.045;
    cellGroup.add(cytoFloor);

    // ==========================================
    // 2. EXPLODED UPPER CUTAWAY DISC (Like Image)
    // ==========================================
    const upperLidGroup = new THREE.Group();
    upperLidGroup.position.y = 1.8; // Default exploded height
    cellGroup.add(upperLidGroup);
    upperLidGroupRef.current = upperLidGroup;

    // Transparent Glass/Translucent Cutaway Disc
    const glassDiscGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.08, 48);
    const glassDiscMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8f3dc,
      roughness: 0.1,
      transmission: 0.82,
      thickness: 0.8,
      transparent: true,
      opacity: 0.65,
      ior: 1.45,
      reflectivity: 0.7
    });
    const glassDisc = new THREE.Mesh(glassDiscGeo, glassDiscMat);
    upperLidGroup.add(glassDisc);

    // Outer ring on glass disc
    const glassRingGeo = new THREE.TorusGeometry(3.6, 0.06, 16, 64);
    const glassRingMat = new THREE.MeshStandardMaterial({
      color: 0xa7c957,
      roughness: 0.3,
      metalness: 0.3
    });
    const glassRing = new THREE.Mesh(glassRingGeo, glassRingMat);
    glassRing.rotation.x = Math.PI / 2;
    upperLidGroup.add(glassRing);

    // Organelle structures mounted on the upper transparent disc (as in diagram)
    // Upper Chloroplast (leaf-like)
    const upperPlastidGroup = new THREE.Group();
    upperPlastidGroup.position.set(-1.4, 0.45, 0.4);
    const plastidBodyGeo = new THREE.SphereGeometry(0.55, 24, 16);
    plastidBodyGeo.scale(1.2, 0.45, 0.8);
    const plastidBodyMat = new THREE.MeshStandardMaterial({
      color: 0x40916c,
      roughness: 0.3,
      metalness: 0.1
    });
    const upperPlastid = new THREE.Mesh(plastidBodyGeo, plastidBodyMat);
    upperPlastid.rotation.z = 0.2;
    upperPlastidGroup.add(upperPlastid);
    upperLidGroup.add(upperPlastidGroup);

    // Upper secondary green textured plastid (cone/pineapple texture as in image)
    const texPlastidGeo = new THREE.ConeGeometry(0.4, 0.9, 16);
    const texPlastidMat = new THREE.MeshStandardMaterial({
      color: 0x2d6a4f,
      roughness: 0.4,
      wireframe: false
    });
    const texPlastid = new THREE.Mesh(texPlastidGeo, texPlastidMat);
    texPlastid.position.set(0.9, 0.4, -0.6);
    texPlastid.rotation.z = -0.3;
    upperLidGroup.add(texPlastid);

    // Upper REL branch tubes (orange coral branch as in diagram)
    const upperTubesGroup = new THREE.Group();
    upperTubesGroup.position.set(1.2, 0.1, 0.7);
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 0.1, -0.3),
      new THREE.Vector3(0, 0.25, 0),
      new THREE.Vector3(0.7, 0.15, 0.4),
      new THREE.Vector3(1.1, 0.3, 0.1)
    ]);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, 24, 0.08, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xf4a261,
      roughness: 0.3
    });
    upperTubesGroup.add(new THREE.Mesh(tubeGeo1, tubeMat));
    upperLidGroup.add(upperTubesGroup);

    // Upper cut sphere (hollow sphere with inner sphere)
    const upperCutSphereGeo = new THREE.SphereGeometry(0.65, 32, 24);
    const upperCutSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x90e0ef,
      roughness: 0.15,
      transmission: 0.75,
      transparent: true,
      opacity: 0.6
    });
    const upperCutSphere = new THREE.Mesh(upperCutSphereGeo, upperCutSphereMat);
    upperCutSphere.position.set(-0.1, 0.5, -0.8);
    const innerNucleolusCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0xbc6c25, roughness: 0.2, metalness: 0.4 })
    );
    upperCutSphere.add(innerNucleolusCore);
    upperLidGroup.add(upperCutSphere);

    // ==========================================
    // 3. MAIN LOWER ORGANELLES
    // ==========================================

    // --- A. VACUOLA CENTRAL (Giant Sparkling Blue Sphere) ---
    const vacuoleGroup = new THREE.Group();
    vacuoleGroup.position.set(0.1, 0.1, 0.2);
    const vacuoleGeo = new THREE.SphereGeometry(1.45, 48, 36);
    const vacuoleMat = new THREE.MeshPhysicalMaterial({
      color: 0x48cae4,
      roughness: 0.1,
      transmission: 0.88,
      thickness: 1.4,
      transparent: true,
      opacity: 0.8,
      ior: 1.33,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const vacuoleMesh = new THREE.Mesh(vacuoleGeo, vacuoleMat);
    vacuoleMesh.name = 'vacuola-central';
    vacuoleGroup.add(vacuoleMesh);

    // Inner glowing core & fluid swirls
    const innerVacuole = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 24, 18),
      new THREE.MeshBasicMaterial({
        color: 0x00b4d8,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      })
    );
    vacuoleGroup.add(innerVacuole);
    cellGroup.add(vacuoleGroup);
    organelleMeshesRef.current.set('vacuola-central', vacuoleMesh);

    // --- B. NÚCLEO Y NUCLÉOLO ---
    const nucleusGroup = new THREE.Group();
    nucleusGroup.position.set(-1.4, -0.4, -1.2);
    // Outer nucleus half/cutaway shell
    const nucleusGeo = new THREE.SphereGeometry(0.95, 32, 24, 0, Math.PI * 1.6, 0, Math.PI);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x90e0ef,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleusMesh.name = 'nucleo';
    nucleusMesh.rotation.y = -Math.PI * 0.4;
    nucleusGroup.add(nucleusMesh);

    // Golden dense Nucléolo
    const nucleoloGeo = new THREE.SphereGeometry(0.38, 24, 20);
    const nucleoloMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      emissive: 0x8a5a22,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.4
    });
    const nucleoloMesh = new THREE.Mesh(nucleoloGeo, nucleoloMat);
    nucleoloMesh.name = 'nucleolo';
    nucleoloMesh.position.set(0.1, 0.1, 0.1);
    nucleusGroup.add(nucleoloMesh);
    cellGroup.add(nucleusGroup);
    organelleMeshesRef.current.set('nucleo', nucleusMesh);
    organelleMeshesRef.current.set('nucleolo', nucleoloMesh);

    // --- C. CLOROplastos (Multiple Green Ovals with Thylakoids) ---
    const chloroplastGroup = new THREE.Group();
    chloroplastGroup.position.set(1.9, 0.7, -1.1);

    const makeChloroplast = (scale = 1) => {
      const g = new THREE.Group();
      const bodyGeo = new THREE.SphereGeometry(0.55 * scale, 32, 20);
      bodyGeo.scale(1.3, 0.55, 0.75);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x2d6a4f,
        roughness: 0.35,
        metalness: 0.1
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      g.add(body);

      // Thylakoid Stacks (Grana coins)
      for (let i = -2; i <= 2; i++) {
        const stackGeo = new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.22 * scale, 12);
        const stackMat = new THREE.MeshStandardMaterial({
          color: 0x52b788,
          roughness: 0.25
        });
        const stack = new THREE.Mesh(stackGeo, stackMat);
        stack.position.set(i * 0.16 * scale, 0, 0);
        g.add(stack);
      }
      return g;
    };

    const mainChloro = makeChloroplast(1.1);
    mainChloro.name = 'cloroplastos';
    chloroplastGroup.add(mainChloro);
    cellGroup.add(chloroplastGroup);
    organelleMeshesRef.current.set('cloroplastos', mainChloro);

    // Additional secondary chloroplasts around the cell
    const chloro2 = makeChloroplast(0.85);
    chloro2.position.set(-2.5, 0.3, 1.2);
    chloro2.rotation.set(0.2, 0.8, -0.4);
    cellGroup.add(chloro2);

    const chloro3 = makeChloroplast(0.75);
    chloro3.position.set(2.4, -0.4, 0.8);
    chloro3.rotation.set(-0.3, -0.5, 0.6);
    cellGroup.add(chloro3);

    // --- D. RETÍCULO ENDOPLASMÁTICO RUGOSO (RER) ---
    // Stacked folded green/blue ribbons around the nucleus
    const rerGroup = new THREE.Group();
    rerGroup.position.set(-0.6, -0.6, -1.8);
    for (let layer = 0; layer < 4; layer++) {
      const sheetGeo = new THREE.TorusGeometry(0.8 + layer * 0.22, 0.07, 12, 32, Math.PI * 0.8);
      const sheetMat = new THREE.MeshStandardMaterial({
        color: 0x40916c,
        roughness: 0.4
      });
      const sheet = new THREE.Mesh(sheetGeo, sheetMat);
      sheet.rotation.x = Math.PI / 2.2 + layer * 0.05;
      sheet.rotation.z = layer * 0.15;
      sheet.position.y = layer * 0.08;
      rerGroup.add(sheet);

      // Ribosomes studded on RER
      for (let r = 0; r < 8; r++) {
        const riboGeo = new THREE.SphereGeometry(0.035, 8, 8);
        const riboMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.3 });
        const ribo = new THREE.Mesh(riboGeo, riboMat);
        const angle = (Math.PI * 0.8 / 9) * r;
        const rad = 0.8 + layer * 0.22;
        ribo.position.set(Math.cos(angle) * rad, layer * 0.08 + 0.06, Math.sin(angle) * rad * 0.4);
        rerGroup.add(ribo);
      }
    }
    rerGroup.name = 'reticulo-rugoso';
    cellGroup.add(rerGroup);
    organelleMeshesRef.current.set('reticulo-rugoso', rerGroup);

    // --- E. RETÍCULO ENDOPLASMÁTICO LISO (REL) ---
    const relGroup = new THREE.Group();
    relGroup.position.set(1.2, -0.6, -1.4);
    for (let t = 0; t < 3; t++) {
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.4 + t * 0.1, 0, -0.2),
        new THREE.Vector3(-0.1 + t * 0.15, 0.3, 0.1),
        new THREE.Vector3(0.4 + t * 0.2, 0.1, 0.3)
      ]);
      const tg = new THREE.TubeGeometry(c, 16, 0.065, 10, false);
      const tm = new THREE.MeshStandardMaterial({ color: 0xf4a261, roughness: 0.35 });
      relGroup.add(new THREE.Mesh(tg, tm));
    }
    relGroup.name = 'reticulo-liso';
    cellGroup.add(relGroup);
    organelleMeshesRef.current.set('reticulo-liso', relGroup);

    // --- F. APARATO DE GOLGI (Stacked Cisternae & Vesicles) ---
    const golgiGroup = new THREE.Group();
    golgiGroup.position.set(1.6, -0.3, 0.8);
    for (let c = 0; c < 5; c++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.55, 0, -0.15),
        new THREE.Vector3(0, 0.08, 0.1),
        new THREE.Vector3(0.55, 0, -0.15)
      ]);
      const cisternaGeo = new THREE.TubeGeometry(curve, 20, 0.08 - c * 0.006, 12, false);
      const cisternaMat = new THREE.MeshStandardMaterial({
        color: 0xf39c12,
        roughness: 0.3,
        metalness: 0.15
      });
      const cisterna = new THREE.Mesh(cisternaGeo, cisternaMat);
      cisterna.position.y = c * 0.12;
      cisterna.scale.set(1 - c * 0.05, 1, 1 - c * 0.05);
      golgiGroup.add(cisterna);

      // Budding vesicles
      const vesGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const vesMat = new THREE.MeshStandardMaterial({ color: 0xfdcb6e });
      const ves = new THREE.Mesh(vesGeo, vesMat);
      ves.position.set(0.65 + Math.sin(c) * 0.1, c * 0.12 + 0.05, (Math.random() - 0.5) * 0.2);
      golgiGroup.add(ves);
    }
    golgiGroup.name = 'aparato-golgi';
    cellGroup.add(golgiGroup);
    organelleMeshesRef.current.set('aparato-golgi', golgiGroup);

    // --- G. RIBOSOMAS (Granular clusters in cytosol) ---
    const riboClusterGroup = new THREE.Group();
    riboClusterGroup.position.set(-0.2, -0.8, -0.4);
    for (let r = 0; r < 24; r++) {
      const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const dotMat = new THREE.MeshStandardMaterial({
        color: 0x9b5de5,
        roughness: 0.3,
        emissive: 0x5a189a,
        emissiveIntensity: 0.2
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.9
      );
      riboClusterGroup.add(dot);
    }
    riboClusterGroup.name = 'ribosomas';
    cellGroup.add(riboClusterGroup);
    organelleMeshesRef.current.set('ribosomas', riboClusterGroup);

    // --- H. PEROXISOMAS (Spherical with Crystal Center) ---
    const peroxiGroup = new THREE.Group();
    peroxiGroup.position.set(0.6, -0.9, 0.8);
    const peroxiOuterGeo = new THREE.SphereGeometry(0.32, 24, 20);
    const peroxiOuterMat = new THREE.MeshPhysicalMaterial({
      color: 0xfee440,
      roughness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.7
    });
    const peroxiOuter = new THREE.Mesh(peroxiOuterGeo, peroxiOuterMat);
    peroxiGroup.add(peroxiOuter);

    // Crystal lattice core inside
    const crystalGeo = new THREE.OctahedronGeometry(0.14);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      roughness: 0.2,
      metalness: 0.6
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    peroxiGroup.add(crystal);
    peroxiGroup.name = 'peroxisomas';
    cellGroup.add(peroxiGroup);
    organelleMeshesRef.current.set('peroxisomas', peroxiGroup);

    // Map Pared Celular & Membrana to meshes for click targeting
    organelleMeshesRef.current.set('pared-celular', outerWall);
    organelleMeshesRef.current.set('membrana-plasmatica', innerMembrane);
    organelleMeshesRef.current.set('citoplasma', cytoFloor);

    // ==========================================
    // 4. CHECKPOINT BEACONS & PINS
    // ==========================================
    const beaconGroup = new THREE.Group();
    cellGroup.add(beaconGroup);
    beaconGroupRef.current = beaconGroup;

    ORGANELLES.forEach((org) => {
      const bG = new THREE.Group();
      bG.position.set(org.position[0], org.position[1], org.position[2]);
      bG.name = `beacon-${org.id}`;

      // Beacon Pin Pole
      const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
      const poleMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.85 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 0.3;
      bG.add(pole);

      // Glowing Diamond Pin Head
      const headGeo = new THREE.OctahedronGeometry(0.14);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0x00f5d4,
        emissive: 0x00bbf9,
        emissiveIntensity: 0.8,
        roughness: 0.2
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.65;
      bG.add(head);

      // Pulsing Base Ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.18, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f5d4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      bG.add(ring);

      beaconGroup.add(bG);
    });

    // ==========================================
    // 5. CYTOPLASMIC STREAMING PARTICLES (Ciclosis)
    // ==========================================
    const particleCount = 200;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.8 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      pPositions[i * 3] = Math.cos(angle) * radius;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      pPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.75;

      pColors[i * 3] = 0.4 + Math.random() * 0.4;
      pColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      pColors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    cellGroup.add(particles);
    particlesGroupRef.current = particles;

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle Cell Swaying
      if (cellGroupRef.current && viewMode === 'orbit') {
        cellGroupRef.current.rotation.y = Math.sin(time * 0.15) * 0.08;
      }

      // Vacuole organic pulsation
      if (vacuoleMesh) {
        const pulse = 1 + Math.sin(time * 1.8) * 0.025;
        vacuoleMesh.scale.set(pulse, pulse, pulse);
      }

      // Animate Beacons (Hover & Glow)
      if (beaconGroupRef.current) {
        beaconGroupRef.current.children.forEach((beacon, idx) => {
          const head = beacon.children[1];
          const ring = beacon.children[2];
          if (head) {
            head.rotation.y = time * 2 + idx;
            head.position.y = 0.65 + Math.sin(time * 3 + idx) * 0.06;
          }
          if (ring) {
            const ringScale = 1 + Math.sin(time * 3 + idx) * 0.25;
            ring.scale.set(ringScale, ringScale, 1);
          }
        });
      }

      // Cytoplasmic Streaming (Ciclosis Particle Drift)
      if (particlesGroupRef.current) {
        const posAttr = particlesGroupRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          let x = array[idx];
          let z = array[idx + 2];
          const r = Math.sqrt(x * x + z * z);
          let theta = Math.atan2(z, x) + 0.35 * delta;
          array[idx] = Math.cos(theta) * r;
          array[idx + 2] = Math.sin(theta) * r;
        }
        posAttr.needsUpdate = true;
      }

      // Camera Movement Logic
      if (cameraRef.current) {
        if (viewMode === 'orbit') {
          // Orbit spherical coordinates to vector
          const x = orbitAngles.current.radius * Math.sin(orbitAngles.current.phi) * Math.cos(orbitAngles.current.theta);
          const y = orbitAngles.current.radius * Math.cos(orbitAngles.current.phi);
          const z = orbitAngles.current.radius * Math.sin(orbitAngles.current.phi) * Math.sin(orbitAngles.current.theta);
          targetCamPos.current.set(x, y, z);

          cameraRef.current.position.lerp(targetCamPos.current, 0.06);
          currentLookAt.current.lerp(targetLookAt.current, 0.06);
          cameraRef.current.lookAt(currentLookAt.current);
        } else if (viewMode === 'nanobot') {
          // First Person Drone inside Cell
          const speed = 2.5 * delta;
          const forward = new THREE.Vector3(
            -Math.sin(nanobotRot.current.yaw),
            0,
            -Math.cos(nanobotRot.current.yaw)
          );
          const right = new THREE.Vector3(
            Math.cos(nanobotRot.current.yaw),
            0,
            -Math.sin(nanobotRot.current.yaw)
          );

          if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
            nanobotPos.current.addScaledVector(forward, speed);
          }
          if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
            nanobotPos.current.addScaledVector(forward, -speed);
          }
          if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
            nanobotPos.current.addScaledVector(right, -speed);
          }
          if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
            nanobotPos.current.addScaledVector(right, speed);
          }
          if (keysPressed.current['space'] || keysPressed.current['e']) {
            nanobotPos.current.y += speed * 0.7;
          }
          if (keysPressed.current['shift'] || keysPressed.current['q']) {
            nanobotPos.current.y -= speed * 0.7;
          }

          // Bound within cell
          nanobotPos.current.clamp(
            new THREE.Vector3(-3.2, -1.8, -3.2),
            new THREE.Vector3(3.2, 2.5, 3.2)
          );

          cameraRef.current.position.copy(nanobotPos.current);
          const lookDir = new THREE.Vector3(
            -Math.sin(nanobotRot.current.yaw) * Math.cos(nanobotRot.current.pitch),
            Math.sin(nanobotRot.current.pitch),
            -Math.cos(nanobotRot.current.yaw) * Math.cos(nanobotRot.current.pitch)
          );
          cameraRef.current.lookAt(nanobotPos.current.clone().add(lookDir));
        }

        // Render Frame (Single viewport or Stereo VR Cardboard split)
        if (rendererRef.current) {
          if (viewMode === 'vr-stereo') {
            // Stereo Split Screen (Left & Right eye for Google Cardboard)
            const fullW = containerRef.current ? containerRef.current.clientWidth : width;
            const fullH = containerRef.current ? containerRef.current.clientHeight : height;
            const eyeDist = 0.08;

            rendererRef.current.setScissorTest(true);

            // Left Eye
            rendererRef.current.setScissor(0, 0, fullW / 2, fullH);
            rendererRef.current.setViewport(0, 0, fullW / 2, fullH);
            cameraRef.current.aspect = fullW / 2 / fullH;
            cameraRef.current.updateProjectionMatrix();
            const originalPos = cameraRef.current.position.clone();
            cameraRef.current.position.x -= eyeDist / 2;
            rendererRef.current.render(scene, cameraRef.current);

            // Right Eye
            rendererRef.current.setScissor(fullW / 2, 0, fullW / 2, fullH);
            rendererRef.current.setViewport(fullW / 2, 0, fullW / 2, fullH);
            cameraRef.current.position.x = originalPos.x + eyeDist / 2;
            rendererRef.current.render(scene, cameraRef.current);

            cameraRef.current.position.copy(originalPos);
            rendererRef.current.setScissorTest(false);
          } else {
            rendererRef.current.render(scene, cameraRef.current);
          }
        }
      }
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Exploded View Height smoothly
  useEffect(() => {
    if (upperLidGroupRef.current) {
      // 0 = closed (y=0.2), 1 = fully exploded (y=3.5)
      const targetY = 0.2 + explodedOffset * 3.3;
      upperLidGroupRef.current.position.y = targetY;
    }
  }, [explodedOffset]);

  // Focus Camera on Selected / Checkpoint Organelle
  useEffect(() => {
    const org = ORGANELLES.find((o) => o.id === currentCheckpointId);
    if (org && viewMode === 'orbit') {
      targetLookAt.current.set(org.cameraFocus[0], org.cameraFocus[1], org.cameraFocus[2]);
      const camPos = new THREE.Vector3(...org.cameraPosition);
      const radius = camPos.length();
      const phi = Math.acos(camPos.y / radius);
      const theta = Math.atan2(camPos.z, camPos.x);

      orbitAngles.current.radius = radius;
      orbitAngles.current.phi = phi;
      orbitAngles.current.theta = theta;
    }
  }, [currentCheckpointId, viewMode]);

  // Keyboard navigation listeners for Nanobot mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer Drag & Orbit / Look
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      if (viewMode === 'orbit') {
        orbitAngles.current.theta -= dx * 0.008;
        orbitAngles.current.phi = Math.max(0.1, Math.min(Math.PI * 0.48, orbitAngles.current.phi - dy * 0.008));
      } else if (viewMode === 'nanobot' || viewMode === 'vr-stereo') {
        nanobotRot.current.yaw -= dx * 0.005;
        nanobotRot.current.pitch = Math.max(-Math.PI * 0.4, Math.min(Math.PI * 0.4, nanobotRot.current.pitch - dy * 0.005));
      }
    } else {
      // Raycasting for organelle hover
      checkRaycast(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (viewMode === 'orbit') {
      orbitAngles.current.radius = Math.max(3.2, Math.min(14, orbitAngles.current.radius + e.deltaY * 0.005));
    }
  };

  // Raycasting on Click
  const checkRaycast = (clientX: number, clientY: number, isClick = false) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // Intersect objects in cell group
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    let hitOrganelle: OrganelleInfo | null = null;

    for (let hit of intersects) {
      let current: THREE.Object3D | null = hit.object;
      while (current) {
        // Check if beacon clicked
        if (current.name && current.name.startsWith('beacon-')) {
          const orgId = current.name.replace('beacon-', '');
          const match = ORGANELLES.find((o) => o.id === orgId);
          if (match) {
            hitOrganelle = match;
            break;
          }
        }
        // Check organelle name
        if (current.name) {
          const match = ORGANELLES.find((o) => o.id === current?.name);
          if (match) {
            hitOrganelle = match;
            break;
          }
        }
        current = current.parent;
      }
      if (hitOrganelle) break;
    }

    setHoveredOrganelle(hitOrganelle);

    if (isClick && hitOrganelle) {
      sound.playClick();
      onSelectOrganelle(hitOrganelle);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    checkRaycast(e.clientX, e.clientY, true);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none block"
      />

      {/* Floating Organelles Labels Overlay (matching image tags) */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {ORGANELLES.map((org) => {
            const isHighlighted = highlightedOrganelleId === org.id || currentCheckpointId === org.id;
            return (
              <div
                key={org.id}
                className={`absolute transition-all duration-200 pointer-events-auto cursor-pointer ${
                  isHighlighted ? 'scale-110 z-20' : 'opacity-85 hover:opacity-100 z-10'
                }`}
                style={{
                  // Position relative to organelle 3D position
                  left: `${50 + org.position[0] * 12}%`,
                  top: `${46 - org.position[1] * 18 - org.position[2] * 4}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => {
                  sound.playClick();
                  onSelectOrganelle(org);
                }}
              >
                <div
                  className={`px-2 py-1 rounded-md text-[11px] md:text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md border ${
                    isHighlighted
                      ? 'bg-emerald-500/90 text-slate-950 border-white shadow-emerald-500/50 ring-2 ring-emerald-300'
                      : 'bg-slate-900/80 text-emerald-200 border-emerald-500/30 hover:border-emerald-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isHighlighted ? 'bg-slate-950 animate-ping' : 'bg-emerald-400'
                    }`}
                  />
                  <span>{org.imageLabel.replace(/"/g, '')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Organelle Hover Tooltip */}
      {hoveredOrganelle && (
        <div
          className="absolute pointer-events-none px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-400/50 backdrop-blur-md text-emerald-100 shadow-xl transition-all duration-150 transform -translate-x-1/2 -translate-y-full font-medium text-xs md:text-sm flex items-center gap-2"
          style={{
            left: '50%',
            bottom: '120px'
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>
            {hoveredOrganelle.name} <span className="text-emerald-400/70 text-xs">({hoveredOrganelle.imageLabel})</span>
          </span>
          <span className="text-[10px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.5 rounded ml-1 font-mono">
            Clic para explorar
          </span>
        </div>
      )}

      {/* VR Stereo Divider Line (if VR cardboard mode) */}
      {viewMode === 'vr-stereo' && (
        <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/20 pointer-events-none z-10 flex flex-col justify-between py-6 items-center">
          <div className="w-3 h-3 rounded-full bg-white/40" />
          <div className="w-3 h-3 rounded-full bg-white/40" />
        </div>
      )}

      {/* Touch Joystick on-screen for mobile Nanobot mode */}
      {viewMode === 'nanobot' && (
        <div className="absolute bottom-24 left-6 pointer-events-auto md:hidden flex flex-col items-center gap-1">
          <button
            onPointerDown={() => { keysPressed.current['w'] = true; }}
            onPointerUp={() => { keysPressed.current['w'] = false; }}
            className="w-12 h-12 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-300 font-bold active:bg-emerald-600/40 flex items-center justify-center text-sm shadow-lg"
          >
            ▲
          </button>
          <div className="flex gap-1">
            <button
              onPointerDown={() => { keysPressed.current['a'] = true; }}
              onPointerUp={() => { keysPressed.current['a'] = false; }}
              className="w-12 h-12 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-300 font-bold active:bg-emerald-600/40 flex items-center justify-center text-sm shadow-lg"
            >
              ◀
            </button>
            <button
              onPointerDown={() => { keysPressed.current['s'] = true; }}
              onPointerUp={() => { keysPressed.current['s'] = false; }}
              className="w-12 h-12 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-300 font-bold active:bg-emerald-600/40 flex items-center justify-center text-sm shadow-lg"
            >
              ▼
            </button>
            <button
              onPointerDown={() => { keysPressed.current['d'] = true; }}
              onPointerUp={() => { keysPressed.current['d'] = false; }}
              className="w-12 h-12 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-300 font-bold active:bg-emerald-600/40 flex items-center justify-center text-sm shadow-lg"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
