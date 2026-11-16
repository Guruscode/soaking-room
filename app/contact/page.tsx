import Image from "next/image"
import { Globe, Mail, Phone } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/site/page-hero"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata({
  title: "Contact The Soaking Room",
  description:
    "Contact Moses Akoh and The Soaking Room ministry for worship invitations, ministry enquiries, and collaborations in Abuja and around the world.",
  path: "/contact",
  image: "/image-11.jpg",
})

const contacts = [
  { icon: Globe, title: "Address", lines: ["Atlantic Mall,", "Utako, FCT Abuja"] },
  { icon: Phone, title: "Phone", lines: ["09057027326"] },
  { icon: Mail, title: "Email", lines: ["soakingroomworship@gmail.com"] },
]

export default function Contact() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          title={
            <>
              Get In <span className="font-bold text-brand">Touch</span>
            </>
          }
          description="Reach out to Moses Oche Akoh or The Soaking Room Ministry. We're here to connect, collaborate, and share in the journey of worship and presence."
          aside={
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_50px_100px_-40px_rgb(15_23_42/0.55)]">
              <Image src="/image-11.jpg" alt="Moses Akoh" fill priority sizes="(max-width: 1024px) 80vw, 30vw" className="object-cover" />
            </div>
          }
        />

        <section className="container-page py-16 md:py-24">
          <div className="reveal-stagger grid gap-5 md:grid-cols-3">
            {contacts.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-8 lift">
                <span className="grid size-14 place-items-center rounded-2xl bg-ink text-white transition-colors duration-500 group-hover:bg-brand">
                  <Icon className="size-6" />
                </span>
                <h2 className="mt-10 eyebrow text-slate-500">{title}</h2>
                <p className="mt-2 break-words text-xl font-semibold text-ink">
                  {lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <p className="reveal mx-auto mt-16 max-w-2xl text-center text-xl font-light text-slate-600">
            Feel free to reach out for collaborations, inquiries, or to join our worship gatherings.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
