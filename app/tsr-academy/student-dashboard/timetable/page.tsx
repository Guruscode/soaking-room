const timetable = [
  {
    day: "Monday",
    slots: [
      "6:00pm - 6:15pm  Opening Prayer & Spiritual Awareness",
      "6:15pm - 7:15pm  Teaching Session (Core Module)",
      "7:15pm - 7:45pm  Practical / Worship Activation",
      "7:45pm - 8:00pm  Reflection & Assignment",
    ],
  },
  {
    day: "Wednesday",
    slots: [
      "6:00pm - 6:20pm  Prayer & Scripture Meditation",
      "6:20pm - 7:20pm  Voice / Worship Practice",
      "7:20pm - 8:00pm  Group Discussion & Feedback",
    ],
  },
  {
    day: "Friday",
    slots: [
      "6:00pm - 6:30pm  Prophetic Worship Session",
      "6:30pm - 7:30pm  Spiritual Formation / Prayer Training",
      "7:30pm - 8:00pm  Journaling & Personal Ministry",
    ],
  },
  {
    day: "Saturday (Optional)",
    slots: ["10:00am - 12:00pm  Extended Worship / Retreat / Masterclass"],
  },
]

export default function StudentTimetablePage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Weekly Timetable (Hybrid Model)</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {timetable.map((entry) => (
          <div key={entry.day} className="rounded-xl bg-slate-700/60 p-4">
            <h3 className="font-semibold">{entry.day}</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-200">
              {entry.slots.map((slot) => (
                <li key={slot}>{slot}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
