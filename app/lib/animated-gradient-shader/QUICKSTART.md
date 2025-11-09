# Quick Start Guide

Get the animated gradient shader running in under 5 minutes!

## Option 1: View the Demo (Easiest - 30 seconds)

1. Open `demo.html` in any modern browser
2. That's it! No installation needed.

The demo includes interactive controls to adjust:
- Wave amount
- Animation speed  
- Noise frequency
- Color randomization
- Wireframe mode

## Option 2: Add to Your Three.js Project (5 minutes)

### Step 1: Copy the shader file
Copy `animated-gradient-shader.js` to your project.

### Step 2: Import and use
```javascript
import * as THREE from 'three';
import { AnimatedGradient } from './animated-gradient-shader.js';

// Your existing Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(/*...*/);
const renderer = new THREE.WebGLRenderer();

// Add the gradient!
const gradient = new AnimatedGradient(scene, {
    colors: ['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500']
});

// In your animation loop
function animate() {
    const elapsedTime = clock.getElapsedTime();
    gradient.update(elapsedTime);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
```

### Step 3: Customize (optional)
```javascript
const gradient = new AnimatedGradient(scene, {
    // Your 5 gradient colors
    colors: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff'],
    
    // Mesh size
    width: 2.0,
    height: 2.0,
    
    // Quality (50-200, higher = smoother)
    widthSegments: 100,
    heightSegments: 100,
    
    // Animation
    amount: 0.3,    // Wave height (0-0.6)
    speed: 0.05,    // Speed (0-0.3)
    
    // Pattern scale
    frequencyX: 4,
    frequencyY: 8
});
```

## Option 3: Use Just the Shaders (Advanced)

If you want maximum control, use the raw shaders:

```javascript
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './animated-gradient-shader.js';

const material = new THREE.ShaderMaterial({
    uniforms: {
        uFrequency: { value: new THREE.Vector2(3, 6) },
        uTime: { value: 0 },
        uColor: { value: [
            new THREE.Color('#8ecae6'),
            new THREE.Color('#219ebc'),
            new THREE.Color('#023047'),
            new THREE.Color('#ffb703'),
            new THREE.Color('#fb8500')
        ]},
        uAmount: { value: 0.2 },
        uSpeed: { value: 0.02 }
    },
    vertexShader,
    fragmentShader
});

const geometry = new THREE.PlaneGeometry(1.5, 1.5, 200, 200);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Update in your loop
material.uniforms.uTime.value = elapsedTime;
```

## Common Tweaks

### Make it faster
```javascript
speed: 0.1  // Default is 0.02
```

### Make waves bigger
```javascript
amount: 0.5  // Default is 0.2, max 0.6
```

### Smoother gradient (but slower)
```javascript
widthSegments: 300,
heightSegments: 300
```

### Faster performance (but less smooth)
```javascript
widthSegments: 50,
heightSegments: 50
```

### Change pattern scale
```javascript
frequencyX: 5,  // Higher = more detail on X axis
frequencyY: 10  // Higher = more detail on Y axis
```

### Use different colors
```javascript
colors: [
    '#ff006e',  // Bright pink
    '#8338ec',  // Purple  
    '#3a86ff',  // Blue
    '#ffbe0b',  // Yellow
    '#fb5607'   // Orange
]
```

## Troubleshooting

### "Nothing appears"
- Check that you're calling `gradient.update()` in your animation loop
- Verify camera position can see the mesh
- Try setting `mesh.rotation.x = 0` if you don't want it rotated

### "It's not animating"
- Make sure `speed` isn't set to 0
- Verify you're passing elapsed time (not delta) to `update()`
- Check that your animation loop is running

### "Performance is bad"
- Reduce `widthSegments` and `heightSegments` (try 50x50)
- Lower device pixel ratio: `renderer.setPixelRatio(1)`
- Check you're not creating multiple gradients accidentally

### "Colors look wrong"
- Ensure colors are hex strings with '#'
- You must provide exactly 5 colors
- Colors should be an array: `['#color1', '#color2', ...]`

## Next Steps

- Read `README.md` for full documentation
- Check `usage-example.js` for more complete example
- See `EXTRACTION_SUMMARY.md` to understand how it works

## Tips & Tricks

1. **Start simple**: Use default settings first, then customize
2. **Performance first**: Start with low segments, increase if needed
3. **Test on mobile**: Always check performance on slower devices
4. **Color harmony**: Use colors that work well together
5. **Experiment**: The best way to learn is to play with the values!

## Need Help?

- Parameter not working? Check the README
- Performance issues? See the performance section in README
- Want to understand the algorithm? Read EXTRACTION_SUMMARY.md

Happy coding! 🎨✨
