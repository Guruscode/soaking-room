import Image from "next/image"
import { Award, BookOpen, Brain, Globe, Mail, MapPin, Music, Phone, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "About Moses Akoh",
  description:
    "Meet Moses Oche Akoh, Nigerian recording artist, pastor, songwriter, producer, and founder of The Soaking Room worship ministry.",
  path: "/about",
  image: "/image-1.JPG",
})
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/site/page-hero"

const certifications = [
  {
    title: "Certificate of Recognition (ILOVEOPM Competition) - 2016",
    text: "For representing Nigeria and placing 5th runner-up in the national ABS-CBN television singing competition.",
  },
  {
    title: "Certificate of Recognition (Best Group Thesis & Feasibility Studies) - 2016",
    text: "For excellence in research and practical business solutions.",
  },
  {
    title: "Certificate of Appearance (Special Olympics Philippines) - 2015",
    text: "For supporting sports programs for children with disabilities.",
  },
  {
    title: "Certificate of Appreciation (Music Trainer)",
    text: "From Convergence International Christian Fellowship for mentoring musicians.",
  },
  {
    title: "Labor Law and Legislation Seminar (Post-Employment Focus)",
    text: "Covered termination, separation pay, and compliance.",
  },
  {
    title: "Labor Relations and Negotiation Seminar (Strikes, Lockouts and Picketing)",
    text: "Focused on collective bargaining and dispute resolution.",
  },
  {
    title: "College of Business Administration Research Seminar",
    text: "Enhanced research and analytical skills.",
  },
]

const skills = [
  {
    title: "Music & Creative Skills",
    text: "Experienced vocalist with a warm, expressive tone. Skilled in acoustic and lead guitar. Background in worship leading to guide teams and shape atmospheres. Creates and arranges music for compositions, studio projects, and live performances.",
  },
  {
    title: "Languages",
    text: "Multilingual: English, Filipino, Hausa, Idoma. Helps connect with diverse backgrounds.",
  },
  {
    title: "Technical Skills",
    text: "Proficient in Microsoft Office for administrative work. Working knowledge of Adobe Photoshop for basic graphics and presentations.",
  },
  {
    title: "Interpersonal Skills",
    text: "Approachable, builds trust quickly. Handles conflict with maturity. High emotional quotient for empathy. Works well in teams, provides steady leadership.",
  },
]

const discography = [
  { year: "2016", title: "\"The Sound\"", text: "Debut album introducing his unique worship expression." },
  { year: "2021", title: "\"Satisfied\"", text: "Themes of intimacy, surrender, and spiritual hunger." },
  { year: "2023", title: "\"Volume of the Book\"", text: "Deeply scriptural album inspired by prophetic writings." },
  { year: "2023", title: "\"Spirit of Moses (Kings and Priests)\" EP", text: "Reflects maturity, depth, and renewed calling." },
  { year: "2025", title: "\"Baruch Hashem Adonai\"", text: "Blending prophetic worship with biblical imagery." },
]

function Block({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="reveal grid gap-6 border-t border-slate-200 py-14 md:grid-cols-[18rem_1fr] md:gap-12 md:py-20">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
          <Icon className="size-5" />
        </span>
        <h2 className="pt-1.5 text-3xl font-light tracking-tight text-ink md:text-4xl">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          eyebrow="Music Director | Pastor | Producer | Worship Leader"
          title={
            <>
              Moses Oche <span className="font-bold text-brand">Akoh</span>
            </>
          }
        />

        <div className="container-page">
          <div className="grid gap-14 py-16 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            {/* Portrait + contacts */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="reveal-scale relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_50px_100px_-40px_rgb(15_23_42/0.55)]">
                <Image
                  src="/image-1.JPG"
                  alt="Moses Akoh"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover grayscale transition-[filter] duration-1000 hover:grayscale-0"
                />
              </div>
              <div className="reveal mt-6 rounded-[1.75rem] border border-slate-200 bg-surface-soft p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                  <Globe className="size-5 text-brand" />
                  Contacts
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <MapPin className="size-4 shrink-0 text-slate-400" /> Atlantic Mall, Utako, FCT Abuja
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-slate-400" /> Phone: 09057027326
                  </li>
                  <li className="flex items-center gap-3 break-all">
                    <Mail className="size-4 shrink-0 text-slate-400" /> Email: soakingroomworship@gmail.com
                  </li>
                </ul>
              </div>
            </div>

            {/* Biography */}
            <div className="reveal">
              <h2 className="flex items-center gap-3 text-3xl font-light tracking-tight text-ink md:text-4xl">
                <Users className="size-7 text-brand" />
                Biography
              </h2>
              <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-slate-600 first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-ink">
                <p>
                  Moses Oche Akoh is a recording artist, music producer, singer, songwriter and ordained pastor with a unique blend of creative depth and ministry passion. He has built a career that bridges music, worship leadership and missions, using sound and storytelling to inspire people across cultures. Moses is known for his warm stage presence, strong vocal abilities and skill in directing and coaching worship teams. As a guitarist and producer, he shapes music that carries both spiritual weight and artistic excellence.
                </p>
              </div>
              <div className="mt-5 space-y-5 text-[1.05rem] leading-relaxed text-slate-600">
                <p>
                  Born with a passion for people, Moses approaches ministry with empathy and high emotional intelligence. His professional background extends beyond music. In 2016, he worked as a Recruitment Assistant with Concentrix in Quezon City, Philippines, where he supported the hiring process, screened applicants, handled official calls and helped orient new employees. That experience sharpened his communication skills, strengthened his attention to detail and exposed him to a wide range of personalities and work cultures.
                </p>
                <p>
                  Moses holds a Bachelor of Science degree in Business Administration from Trinity University of Asia, with a major in Human Resource Development Management. During his studies, he excelled academically and creatively. He earned recognition for Best Group Thesis and Best Feasibility Studies, and also represented Nigeria in the national ABS-CBN television singing competition ILOVEOPM, where he finished as 5th runner-up.
                </p>
                <p>
                  His commitment to service has taken him into volunteer work, including the Special Olympics Philippines, where he supported athletic programs for children with disabilities. This contribution earned him a Certificate of Appearance from the United States Peace Corps, the Department of Education and Special Olympics Philippines. He has also trained and mentored young musicians through workshops, receiving recognition from Convergence International Christian Fellowship for his contribution as a professional music trainer.
                </p>
                <p>
                  Across music, ministry and community work, Moses continues to build platforms where creativity and purpose meet. He brings strong people skills, critical thinking, cultural adaptability and fluency in English, Filipino, Hausa and Idoma. Along with technical abilities in Microsoft Office and Adobe Photoshop, he is equipped to function effectively in diverse environments.
                </p>
                <p className="text-lg font-medium text-ink">
                  Whether in worship spaces, creative studios or community initiatives, Moses stands out as a grounded leader with a message, a mission and the discipline to deliver excellence.
                </p>
              </div>
            </div>
          </div>

          <Block icon={BookOpen} title="Education">
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-slate-200 bg-surface-soft p-6">
                <p className="text-lg font-semibold text-ink">Trinity University of Asia, Manila, Philippines</p>
                <p className="mt-1 text-slate-600">Bachelor of Science in Business Administration</p>
                <p className="text-slate-600">Major: Human Resource Development Management</p>
                <p className="eyebrow mt-3 text-brand-strong">Year Completed: 2016</p>
              </div>
              <p className="leading-relaxed text-slate-600">
                Moses completed his degree with a strong focus on how people and organizations function. His coursework covered areas like labor relations, organizational behavior, business management and HR development strategy. These subjects gave him a solid understanding of workplace dynamics, employee coordination, conflict resolution and the principles behind developing and managing talent. Alongside academics, he was active in group research work, contributed to award-winning feasibility studies and represented the university in national competitions, reflecting both his leadership potential and creative strength.
              </p>
            </div>
          </Block>

          <Block icon={Award} title="Certifications & Trainings">
            <ul className="reveal-stagger grid gap-3 sm:grid-cols-2">
              {certifications.map((item) => (
                <li key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-white p-5 lift">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={Brain} title="Skills">
            <div className="reveal-stagger grid gap-4 md:grid-cols-2">
              {skills.map((skill) => (
                <div key={skill.title} className="rounded-[1.25rem] bg-surface-soft p-6">
                  <h3 className="text-lg font-semibold text-ink">{skill.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{skill.text}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block icon={Music} title="Discography">
            <p className="leading-relaxed text-slate-600">
              His body of work reflects his heart for worship and his commitment to creating sounds that draw people closer to God. Over the years, he has released several projects that have shaped his ministry journey.
            </p>
            <ol className="reveal-stagger relative mt-8 space-y-6 border-l border-slate-200 pl-8">
              {discography.map((album) => (
                <li key={album.title} className="relative">
                  <span className="absolute top-1.5 -left-[2.32rem] size-3 rounded-full border-2 border-white bg-brand ring-4 ring-brand-soft" />
                  <p className="eyebrow text-brand-strong">{album.year}</p>
                  <p className="mt-1 text-lg font-semibold text-ink">{album.title}</p>
                  <p className="text-sm text-slate-600">{album.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 rounded-[1.25rem] bg-ink p-6 text-slate-300">
              Popular songs include &quot;Mighty God,&quot; &quot;Dobale,&quot; &quot;Come and See,&quot; &quot;Volume of the Book,&quot; and &quot;Baruch Hashem Adonai.&quot; These continue to bless congregations and inspire worship teams.
            </p>
          </Block>
        </div>
      </main>
      <Footer />
    </>
  )
}
