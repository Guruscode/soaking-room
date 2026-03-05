const guideData = {
  purpose:
    "To raise spiritually grounded worshippers who minister from intimacy, obedience, and identity in Christ.",
  responsibilities: [
    "Teach from personal devotion, not notes alone",
    "Model prayer lifestyle",
    "Maintain atmosphere of reverence",
    "Encourage participation and spiritual sensitivity",
    "Guide students gently into prophetic flow",
    "Emphasize obedience over performance",
    "Always point students back to Jesus",
  ],
  classFlow: [
    "Open with prayer and silence (5-10 mins)",
    "Short scripture meditation",
    "Core teaching",
    "Practical activation (worship / prayer)",
    "Reflection and journaling",
    "Assignment explanation",
  ],
  principles: [
    "Teach slowly and spiritually",
    "Allow Holy Spirit interruptions",
    "Encourage questions",
    "Create safe prophetic space",
    "Correct in love",
    "Build sonship mentality",
    "Avoid comparison among students",
  ],
  assessment: [
    "Journaling consistency",
    "Participation",
    "Worship recordings",
    "Spiritual growth (not talent)",
    "Obedience to assignments",
  ],
  conduct: [
    "Live prayerfully",
    "Walk in humility",
    "Submit to leadership",
    "Maintain personal altar",
    "Avoid favoritism",
    "Protect student confidentiality",
  ],
  graduation: [
    "Completion of all modules",
    "Submission of worship recordings",
    "Evidence of prayer lifestyle",
    "Final reflection journal",
  ],
}

export default function AdminTeachersGuidePage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Teachers Guide</h2>
      <p className="mt-2 text-slate-700">Purpose: {guideData.purpose}</p>

      <GuideCard title="Teacher Responsibilities" items={guideData.responsibilities} />
      <GuideCard title="Class Flow" items={guideData.classFlow} />
      <GuideCard title="Teaching Principles" items={guideData.principles} />
      <GuideCard title="Assessment" items={guideData.assessment} />
      <GuideCard title="Teacher Conduct" items={guideData.conduct} />
      <GuideCard title="Graduation Requirement" items={guideData.graduation} />

      <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        End Goal: Students emerge as Spirit-led worshippers carrying Heaven's sound with authority.
      </p>
    </div>
  )
}

function GuideCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
