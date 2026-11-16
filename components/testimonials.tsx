import { Quote } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const testimonials = [
  {
    name: "Community Member",
    role: "Ministry Supporter",
    text: "The music ministry has touched my heart deeply. Every performance brings me closer to my faith.",
  },
  {
    name: "Worship Attendee",
    role: "Regular Participant",
    text: "Moses's dedication to spreading the gospel through music is truly inspiring and transformative.",
  },
  {
    name: "Ministry Partner",
    role: "Long-time Supporter",
    text: "Supporting this ministry has been one of the most fulfilling decisions I've made.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-[#f7f5f0] py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title={
            <>
              Voices from the community
            </>
          }
          description="Hear from those whose lives have been touched by this ministry"
        />

        <div className="mt-10 grid border-y border-[#ded8ce] md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="flex flex-col border-b border-[#ded8ce] p-6 md:border-r md:p-8 lg:p-10">
              <Quote className="size-5 text-[#9a7946]" strokeWidth={1.5} />
              <blockquote className="mt-5 flex-1 font-serif text-xl leading-8 text-[#302d27]">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              <figcaption className="mt-7 border-t border-[#ded8ce] pt-4">
                <span className="block text-sm text-[#201e1a]">{testimonial.name}</span>
                <span className="mt-1 block text-xs text-[#777166]">{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
