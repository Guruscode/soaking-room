"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, Briefcase, Award, Globe, Music, Users, Brain } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
export default function About() {
  return (
    <>
     <Header />
    <section className="min-h-screen bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero-like Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-4">
            Moses Oche <span className="text-cyan-600">Akoh</span>
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Music Director | Vocal Coach | Producer | Worship Leader
          </p>
        </motion.div>

        {/* Grid Layout for Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Image + Contacts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-3xl">
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 to-transparent rounded-3xl blur-xl -z-10"
              />
              <Image
                src="/image-1.JPG"  // Assuming this is Moses' photo from Hero
                alt="Moses Akoh"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>

            {/* Contacts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 space-y-4 text-gray-700"
            >
              <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                <Globe className="w-6 h-6 text-cyan-600" />
                Contacts
              </h2>
              <p>26, NE Eduok Road, NAF Valley Estate, Asokoro, Abuja, Nigeria</p>
              <p className="flex items-center gap-2">
                Phone: 08061157979
              </p>
              <p className="flex items-center gap-2">
                Email: soakingroomworship@gmail.com
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Bio */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-2">
                <Users className="w-7 h-7 text-cyan-600" />
                Biography
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Moses Oche Akoh is a recording artist, music producer, singer, songwriter and ordained pastor with a unique blend of creative depth and ministry passion. He has built a career that bridges music, worship leadership and missions, using sound and storytelling to inspire people across cultures. Moses is known for his warm stage presence, strong vocal abilities and skill in directing and coaching worship teams. As a guitarist and producer, he shapes music that carries both spiritual weight and artistic excellence.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Born with a passion for people, Moses approaches ministry with empathy and high emotional intelligence. His professional background extends beyond music. In 2016, he worked as a Recruitment Assistant with Concentrix in Quezon City, Philippines, where he supported the hiring process, screened applicants, handled official calls and helped orient new employees. That experience sharpened his communication skills, strengthened his attention to detail and exposed him to a wide range of personalities and work cultures.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Moses holds a Bachelor of Science degree in Business Administration from Trinity University of Asia, with a major in Human Resource Development Management. During his studies, he excelled academically and creatively. He earned recognition for Best Group Thesis and Best Feasibility Studies, and also represented Nigeria in the national ABS-CBN television singing competition ILOVEOPM, where he finished as 5th runner-up.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                His commitment to service has taken him into volunteer work, including the Special Olympics Philippines, where he supported athletic programs for children with disabilities. This contribution earned him a Certificate of Appearance from the United States Peace Corps, the Department of Education and Special Olympics Philippines. He has also trained and mentored young musicians through workshops, receiving recognition from Convergence International Christian Fellowship for his contribution as a professional music trainer.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Across music, ministry and community work, Moses continues to build platforms where creativity and purpose meet. He brings strong people skills, critical thinking, cultural adaptability and fluency in English, Filipino, Hausa and Idoma. Along with technical abilities in Microsoft Office and Adobe Photoshop, he is equipped to function effectively in diverse environments.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Whether in worship spaces, creative studios or community initiatives, Moses stands out as a grounded leader with a message, a mission and the discipline to deliver excellence.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Additional Sections */}
        <div className="mt-24 space-y-24">
          {/* Education */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-black flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-cyan-600" />
              Education
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Trinity University of Asia, Manila, Philippines<br />
              Bachelor of Science in Business Administration<br />
              Major: Human Resource Development Management<br />
              Year Completed: 2016
            </p>
            <p className="text-gray-600 leading-relaxed">
              Moses completed his degree with a strong focus on how people and organizations function. His coursework covered areas like labor relations, organizational behavior, business management and HR development strategy. These subjects gave him a solid understanding of workplace dynamics, employee coordination, conflict resolution and the principles behind developing and managing talent. Alongside academics, he was active in group research work, contributed to award-winning feasibility studies and represented the university in national competitions, reflecting both his leadership potential and creative strength.
            </p>
          </motion.section>

          {/* Certifications & Trainings */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-black flex items-center gap-2">
              <Award className="w-8 h-8 text-cyan-600" />
              Certifications & Trainings
            </h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex flex-col">
                <span className="font-semibold">Certificate of Recognition (ILOVEOPM Competition) - 2016</span>
                For representing Nigeria and placing 5th runner-up in the national ABS-CBN television singing competition.
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Certificate of Recognition (Best Group Thesis & Feasibility Studies) - 2016</span>
                For excellence in research and practical business solutions.
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Certificate of Appearance (Special Olympics Philippines) - 2015</span>
                For supporting sports programs for children with disabilities.
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Certificate of Appreciation (Music Trainer) </span>
                From Convergence International Christian Fellowship for mentoring musicians.
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Labor Law and Legislation Seminar (Post-Employment Focus)</span>
                Covered termination, separation pay, and compliance.
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Labor Relations and Negotiation Seminar (Strikes, Lockouts and Picketing)</span>
                Focused on collective bargaining and dispute resolution.
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">College of Business Administration Research Seminar</span>
                Enhanced research and analytical skills.
              </li>
            </ul>
          </motion.section>

          {/* Work Experience */}
          {/* <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-black flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-cyan-600" />
              Work Experience
            </h2>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-black">Recruitment Assistant - Concentrix, Quezon City, Philippines</h3>
              <p className="text-gray-500">July 8, 2016 - October 13, 2016</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Received, reviewed and verified incoming job applications.</li>
                <li>Managed the company's main phone lines, responding to inquiries.</li>
                <li>Assisted the HR team during onboarding by preparing materials.</li>
                <li>Observed and interacted with candidates from different backgrounds.</li>
              </ul>
              <p className="font-semibold mt-4">Key Achievements:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Streamlined the application review process.</li>
                <li>Contributed to a smoother onboarding flow.</li>
                <li>Demonstrated reliability and professionalism.</li>
              </ul>
            </div>
            <div className="space-y-4 mt-8">
              <h3 className="text-2xl font-semibold text-black">Current Ministry</h3>
              <p className="text-gray-600">
                In 2021, led by the Holy Spirit, Moses returned to Nigeria and founded The Soaking Room Ministry, a once monthly worship gathering dedicated to encountering God's presence. The Soaking Room also has a worship academy where Music is taught to Music Ministers and Musicians.
              </p>
            </div>
          </motion.section> */}

          {/* Skills */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-black flex items-center gap-2">
              <Brain className="w-8 h-8 text-cyan-600" />
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Music & Creative Skills</h3>
                <p className="text-gray-600">
                  Experienced vocalist with a warm, expressive tone. Skilled in acoustic and lead guitar. Background in worship leading to guide teams and shape atmospheres. Creates and arranges music for compositions, studio projects, and live performances.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Languages</h3>
                <p className="text-gray-600">
                  Multilingual: English, Filipino, Hausa, Idoma. Helps connect with diverse backgrounds.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Technical Skills</h3>
                <p className="text-gray-600">
                  Proficient in Microsoft Office for administrative work. Working knowledge of Adobe Photoshop for basic graphics and presentations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Interpersonal Skills</h3>
                <p className="text-gray-600">
                  Approachable, builds trust quickly. Handles conflict with maturity. High emotional quotient for empathy. Works well in teams, provides steady leadership.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Discography */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-black flex items-center gap-2">
              <Music className="w-8 h-8 text-cyan-600" />
              Discography
            </h2>
            <p className="text-gray-600 leading-relaxed">
              His body of work reflects his heart for worship and his commitment to creating sounds that draw people closer to God. Over the years, he has released several projects that have shaped his ministry journey.
            </p>
            <ul className="space-y-4 text-gray-600">
              <li>
                <span className="font-semibold">"The Sound" (2016)</span> - Debut album introducing his unique worship expression.
              </li>
              <li>
                <span className="font-semibold">"Satisfied" (2021)</span> - Themes of intimacy, surrender, and spiritual hunger.
              </li>
              <li>
                <span className="font-semibold">"Volume of the Book" (2023)</span> - Deeply scriptural album inspired by prophetic writings.
              </li>
              <li>
                <span className="font-semibold">"Spirit of Moses (Kings and Priests)" EP (2023)</span> - Reflects maturity, depth, and renewed calling.
              </li>
              <li>
                <span className="font-semibold">"Baruch Hashem Adonai" (2025)</span> - Blending prophetic worship with biblical imagery.
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              Popular songs include "Mighty God," "Dobale," "Come and See," "Volume of the Book," and "Baruch Hashem Adonai." These continue to bless congregations and inspire worship teams.
            </p>
          </motion.section>
        </div>
      </div>
    </section>
       <Footer />
    </>
  )
}