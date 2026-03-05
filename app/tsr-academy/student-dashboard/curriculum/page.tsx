const modules = [
  "Week 1 - Identity & Sonship",
  "Week 2 - Spiritual Impact of Your Voice",
  "Week 3 - Anatomy of Your Ministry Voice",
  "Week 4 - Prophetic Worship & Hearing God",
  "Week 5 - Prayer, Spiritual Awareness & Lordship",
]

export default function StudentCurriculumPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Curriculum & Module Rotation</h2>
      <p className="mt-2 text-sm text-slate-300">Current module rotation for your academy cycle:</p>
      <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {modules.map((module) => (
          <li key={module} className="rounded-xl bg-slate-700/60 px-3 py-2">
            {module}
          </li>
        ))}
      </ul>
    </div>
  )
}
