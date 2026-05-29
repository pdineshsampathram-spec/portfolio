import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uTime;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mv.z);
    gl_PointSize = clamp(gl_PointSize, 0.4, 4.0);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  uniform float uTime;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = 1.0 - smoothstep(0.25, 0.5, d);
    if (a < 0.001) discard;
    float twinkle = 0.85 + 0.15 * sin(uTime * 2.5 + gl_FragCoord.x * 0.3);
    gl_FragColor = vec4(vColor, a * 0.90 * twinkle);
  }
`

export function StarField({ paused = false }: { paused?: boolean }) {
  const meshRef = useRef<THREE.Points>(null)
  const COUNT = 4000

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)

    const white  = new THREE.Color('#F0F4FF')
    const blue   = new THREE.Color('#64C8FF')
    const violet = new THREE.Color('#B478FF')

    for (let i = 0; i < COUNT; i++) {
      const x = THREE.MathUtils.randFloatSpread(32)
      const y = THREE.MathUtils.randFloatSpread(32)
      const z = THREE.MathUtils.randFloatSpread(32)
      positions[i*3]   = x
      positions[i*3+1] = y
      positions[i*3+2] = z

      const d = Math.sqrt(x*x + y*y + z*z)
      const c = d < 4 ? white : d < 9 ? blue : violet
      colors[i*3]   = c.r
      colors[i*3+1] = c.g
      colors[i*3+2] = c.b

      sizes[i] = Math.random() * 2.2 + 0.6
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20)

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
      depthTest:   false,
      transparent: true,
    })

    return { geometry: geo, material: mat }
  }, [])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((_, delta) => {
    if (paused) return
    if (!meshRef.current || !material) return
    meshRef.current.frustumCulled = true
    const d = Math.min(delta, 0.05)  // cap delta — prevents spike frames
    meshRef.current.rotation.y += d * 0.012
    material.uniforms.uTime.value += d
  })

  return <points ref={meshRef} geometry={geometry} material={material} frustumCulled />
}
