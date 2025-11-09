# Animated Mesh Gradient Shader

A beautiful, smooth animated gradient shader extracted from a compiled Three.js application. Creates organic color transitions using Simplex noise with customizable colors and animation parameters.

## Features

- ✨ Smooth, organic color blending using Simplex noise
- 🎨 5 customizable gradient colors
- 🌊 Animated wave distortion on mesh surface
- ⚡ Highly configurable parameters
- 📦 Clean, standalone implementation
- 🎯 Easy to integrate into any Three.js project

## How It Works

### Color Blending
The shader uses a clever layered approach to blend 5 colors:
1. Starts with the 5th color as the base
2. Layers the first 4 colors using noise-based masking
3. Each layer has unique noise parameters (flow, speed, seed)
4. Uses `smoothstep` for smooth transitions between colors

### Wave Animation
- Simplex noise displaces the Y-position of each vertex
- Creates organic, flowing wave patterns
- Fully controllable through uniforms

### Shader Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uFrequency` | vec2 | Noise frequency on X and Y axes |
| `uTime` | float | Elapsed time for animation |
| `uAmount` | float | Wave displacement amount (height) |
| `uSpeed` | float | Animation speed multiplier |
| `uColor` | vec3[5] | Array of 5 gradient colors |

## Installation

### Option 1: ES Module (Recommended)
```javascript
import { AnimatedGradient } from './animated-gradient-shader.js';
```

### Option 2: Copy Shaders Only
If you just want the shaders, copy the `vertexShader` and `fragmentShader` strings and create your own Three.js ShaderMaterial.

## Usage

### Basic Setup

```javascript
import * as THREE from 'three';
import { AnimatedGradient } from './animated-gradient-shader.js';

// Create scene
const scene = new THREE.Scene();

// Create gradient
const gradient = new AnimatedGradient(scene, {
    colors: ['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500']
});

// In your animation loop
function animate() {
    const elapsedTime = clock.getElapsedTime();
    gradient.update(elapsedTime);
    renderer.render(scene, camera);
}
```

### Configuration Options

```javascript
const gradient = new AnimatedGradient(scene, {
    // 5 gradient colors (hex strings)
    colors: ['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500'],
    
    // Mesh dimensions
    width: 1.5,
    height: 1.5,
    
    // Mesh resolution (higher = smoother but slower)
    widthSegments: 200,
    heightSegments: 200,
    
    // Noise frequency (controls pattern scale)
    frequencyX: 3,
    frequencyY: 6,
    
    // Wave height
    amount: 0.2,
    
    // Animation speed
    speed: 0.02
});
```

### API Methods

#### `update(elapsedTime)`
Updates the animation. Call this in your render loop.
```javascript
gradient.update(clock.getElapsedTime());
```

#### `setColors(colorsArray)`
Change colors dynamically.
```javascript
gradient.setColors(['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b', '#fb5607']);
```

#### `toggleWireframe()`
Toggle wireframe mode for debugging.
```javascript
gradient.toggleWireframe();
```

#### `dispose()`
Clean up resources when done.
```javascript
gradient.dispose();
```

## Color Palette Recommendations

The gradient works best with 5 colors that have some visual relationship. Here are some curated palettes:

### Ocean Vibes (Default)
```javascript
['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500']
```

### Sunset
```javascript
['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff']
```

### Forest
```javascript
['#d8f3dc', '#95d5b2', '#52b788', '#2d6a4f', '#1b4332']
```

### Neon Night
```javascript
['#7209b7', '#560bad', '#3a0ca3', '#4361ee', '#4cc9f0']
```

### Warm Earth
```javascript
['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875']
```

## Performance Tips

1. **Reduce Segments**: Lower `widthSegments` and `heightSegments` for better performance
   - 50x50 = Very fast, less smooth
   - 100x100 = Good balance
   - 200x200 = Very smooth, slower

2. **Adjust Pixel Ratio**: Limit `devicePixelRatio` for mobile devices
   ```javascript
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   ```

3. **Optimize for Static Cameras**: If camera doesn't move, you might cache some calculations

## Technical Details

### Simplex Noise Algorithm
The shader uses 3D Simplex noise (created by Ken Perlin) for smooth, continuous noise generation:
- Avoids grid artifacts of classic Perlin noise
- Better performance characteristics
- More organic, natural-looking results

### Color Mixing Strategy
Each of the 4 foreground colors uses unique noise parameters:
- `noiseFlow`: Controls horizontal drift (0.0002 + i * 0.05)
- `noiseSpeed`: Controls temporal animation (0.0001 + i * 0.03)
- `noiseSeed`: Offsets noise pattern (1.0 + i * 10.0)
- `noiseFreq`: Spatial frequency (0.3, 0.6)
- `noiseFloor/Ceiling`: Smoothstep range (0.1 to 0.6+i*0.08)

This creates distinct, layered patterns for each color.

## Browser Compatibility

- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ WebGL 1.0 and 2.0
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ Older browsers may need WebGL polyfills

## Dependencies

- Three.js (r163 or later recommended)
- WebGL-capable browser

## Customization Ideas

1. **Add Mouse Interaction**: Modify uniforms based on mouse position
2. **Audio Reactivity**: Link `uSpeed` or `uAmount` to audio data
3. **Multiple Gradients**: Create layered effects with transparency
4. **Color Cycling**: Animate through color palette changes
5. **Custom Geometry**: Apply shader to sphere, torus, or custom shapes

## Troubleshooting

### Colors look wrong
- Ensure colors are in hex format with `#`
- Check that you're providing exactly 5 colors
- Colors are converted to linear space automatically

### Performance issues
- Reduce `widthSegments` and `heightSegments`
- Lower `devicePixelRatio`
- Consider using a simpler geometry

### No animation
- Make sure you're calling `gradient.update()` in your animation loop
- Check that `uSpeed` isn't set to 0

## License

Extracted from open-source project. Free to use and modify.

## Credits

- Original compiled from: mesh-gradient.js
- Simplex noise algorithm by Ken Perlin
- Three.js library by mrdoob and contributors
