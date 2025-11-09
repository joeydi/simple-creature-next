/**
 * Example Usage of Animated Gradient Shader
 * 
 * This demonstrates how to use the extracted shader
 * in a basic Three.js scene.
 */

import * as THREE from 'three';
import { AnimatedGradient } from './animated-gradient-shader.js';

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Position camera
camera.position.set(0, 0.5, 0.4);
camera.lookAt(0, 0, 0);

// Create animated gradient
const gradient = new AnimatedGradient(scene, {
    colors: [
        '#8ecae6',  // Light blue
        '#219ebc',  // Ocean blue
        '#023047',  // Dark blue
        '#ffb703',  // Orange
        '#fb8500'   // Dark orange
    ],
    width: 1.5,
    height: 1.5,
    widthSegments: 200,  // Higher = smoother (more expensive)
    heightSegments: 200,
    frequencyX: 3,       // Noise frequency on X axis
    frequencyY: 6,       // Noise frequency on Y axis
    amount: 0.2,         // Height displacement amount
    speed: 0.02          // Animation speed
});

// Optional: Add lighting (though not needed for this shader)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Update gradient animation
    gradient.update(elapsedTime);
    
    // Render
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Example: Change colors dynamically
setTimeout(() => {
    gradient.setColors([
        '#ff006e',  // Pink
        '#8338ec',  // Purple
        '#3a86ff',  // Blue
        '#ffbe0b',  // Yellow
        '#fb5607'   // Orange
    ]);
}, 5000); // Change colors after 5 seconds

// Example: Toggle wireframe with spacebar
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        gradient.toggleWireframe();
    }
});
