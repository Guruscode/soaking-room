import { cn } from "@/lib/utils"

const RAY_COUNT = 36

// Radiant line motif taken from the light rays in The Soaking Room dove logo.
export function Rays({ className, count = RAY_COUNT }: { className?: string; count?: number }) {
  const rays = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const inner = i % 2 === 0 ? 18 : 30
    return {
      x1: 50 + Math.cos(angle) * inner,
      y1: 50 + Math.sin(angle) * inner,
      x2: 50 + Math.cos(angle) * 50,
      y2: 50 + Math.sin(angle) * 50,
    }
  })

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("block", className)} fill="none">
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1.toFixed(2)}
          y1={ray.y1.toFixed(2)}
          x2={ray.x2.toFixed(2)}
          y2={ray.y2.toFixed(2)}
          stroke="currentColor"
          strokeWidth={0.45}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}
