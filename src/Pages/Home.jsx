import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const root = useRef(null);
  const sectionsRef = useRef([]);
  const [active, setActive] = useState("");

  // helper to collect refs
  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    // ensure root exists
    if (!root.current) return;

    // gsap context for scoped selectors & clean revert
    let ctx = gsap.context(() => {
      // Subtle grid drift continuously
      gsap.to(".grid-bg", {
        backgroundPosition: "-800px -800px",
        duration: 40,
        ease: "none",
        repeat: -1
      });

      // Hero entrance
      gsap.from("header h1", {
        opacity: 0,
        y: -30,
        duration: 1.0,
        ease: "power3.out"
      });
      gsap.from("header p", {
        opacity: 0,
        y: 6,
        duration: 1.0,
        delay: 0.12,
        ease: "power3.out"
      });

      // Animate each section's children (reveal-item)
      sectionsRef.current.forEach((section) => {
        // guard: skip if missing
        if (!section) return;

        // reveal all child items with stagger
        gsap.from(section.querySelectorAll(".reveal-item"), {
          opacity: 0,
          y: 28,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none reverse"
          }
        });

        // create active nav highlighting
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(section.id),
          onEnterBack: () => setActive(section.id)
        });
      });

      // interactive card tilt (JS-based)
      document.querySelectorAll(".card").forEach((card) => {
        const bounds = () => card.getBoundingClientRect();
        function handleMove(e) {
          const r = bounds();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotationY: x * 6, rotationX: -y * 6, scale: 1.02, duration: 0.35, ease: "power3.out" });
        }
        function handleLeave() {
          gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, duration: 0.6, ease: "power3.out" });
        }
        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="ml-20 relative bg-black text-white min-h-screen font-sans overflow-hidden scroll-smooth">
      {/* Grid background */}
      <div
        aria-hidden
        className="grid-bg absolute inset-0 opacity-12 bg-[linear-gradient(#0ff3_1px,transparent_1px),linear-gradient(90deg,#0ff3_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"
      ></div>

      {/* Sidebar TOC (visible on lg) */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-56 z-40 
        bg-gray-950 bg-opacity-60 backdrop-blur-md border-r border-gray-800 p-6">
        <nav className="space-y-4 text-sm">
          <a href="#intro" className={`block ${active === "intro" ? "text-white font-semibold" : "text-gray-400"}`}>Digital Risks</a>
          <a href="#advantage" className={`block ${active === "advantage" ? "text-white font-semibold" : "text-gray-400"}`}>Advantage</a>
          <a href="#framework" className={`block ${active === "framework" ? "text-white font-semibold" : "text-gray-400"}`}>Framework</a>
          <a href="#services" className={`block ${active === "services" ? "text-white font-semibold" : "text-gray-400"}`}>Services</a>
          <a href="#cred" className={`block ${active === "cred" ? "text-white font-semibold" : "text-gray-400"}`}>Credibility</a>
          <a href="#cta" className={`block ${active === "cta" ? "text-white font-semibold" : "text-gray-400"}`}>Contact</a>
        </nav>
      </aside>


      <header className="pt-20 pb-5 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Cyber Law Practice in India</h1>
        <p className="text-gray-300 mt-4 max-w-3xl mx-auto text-lg">Practical techno-legal counsel that reduces regulatory risk, responds rapidly to incidents, and keeps your business running.</p>
      </header>

      <main className="relative z-10 lg:ml-56 pt-20">
        {/* INTRO */}
        <section id="intro" ref={addToRefs} className="px-6 md:px-20 py-12">
          <h2 className="text-2xl font-bold text-white mb-4 reveal-item">The Digital Risk Landscape</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="reveal-item text-gray-400 leading-relaxed">
              <p>India's digital economy is scaling fast. While platforms like UPI drive inclusion at scale, that same scale attracts malicious actors—ransomware, API abuse, AI-driven attacks and social engineering are now business problems, not just IT problems.</p>
              <p className="mt-4">Breaches trigger regulatory obligations, costly investigations, customer churn and reputational damage. We turn regulatory risk into governance and operational controls you can demonstrate to auditors and regulators.</p>
            </div>

            <div className="reveal-item">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3"><span>Ransomware & double-extortion</span></li>
                <li className="flex items-start gap-3"><span>API / Shadow-API abuse</span></li>
                <li className="flex items-start gap-3"><span>Phishing & social engineering</span></li>
                <li className="flex items-start gap-3"><span>Supply-chain & third-party exposures</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ADVANTAGE */}
        <section id="advantage" ref={addToRefs} className="-ml-20 px-6 md:px-20 py-12 md:py-16 bg-gray-950">
          <h2 className="text-2xl font-bold text-white mb-6 reveal-item">Our Techno-Legal Advantage</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 6 .5-4.5 3 1.2 6L12 16 6.3 17.5 7.5 11 3 8 9 7 12 2z" stroke="currentColor" strokeWidth="0.6"/></svg>
                <h3 className="font-semibold text-cyan-200">Integrated Tech + Law</h3>
              </div>
              <p className="text-gray-300 mt-3">Lawyers with practical knowledge of forensics, logs and incident workflows — advice you can action.</p>
            </article>

            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="0.9"/></svg>
                <h3 className="font-semibold text-cyan-200">Proactive Risk Mitigation</h3>
              </div>
              <p className="text-gray-300 mt-3">Policy drafting, DPIAs, vendor contracts and compliance programs mapped to regulators' expectations.</p>
            </article>

            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor" strokeWidth="1.2"/></svg>
                <h3 className="font-semibold text-cyan-200">Rapid Incident Counsel</h3>
              </div>
              <p className="text-gray-300 mt-3">Standby forensic partners and pre-negotiated playbooks for regulatory reports and litigation readiness.</p>
            </article>
          </div>
        </section>

        {/* FRAMEWORK */}
        <section id="framework" ref={addToRefs} className="px-6 md:px-20 py-12 md:py-16">
          <h2 className="text-2xl font-bold text-white mb-4 reveal-item">Cyber Legal Framework (Quick Guide)</h2>
          <div className="mt-4 space-y-6 reveal-item text-gray-300">
            <div>
              <h4 className="font-semibold">Information Technology Act, 2000</h4>
              <p className="mt-1">Foundation for e-commerce and cybercrime penalties. Requires reasonable security practices and addresses hacking, unlawful disclosure and fraud.</p>
            </div>
            <div>
              <h4 className="font-semibold">Digital Personal Data Protection Act, 2023</h4>
              <p className="mt-1">Modern data protection law: strict consent rules, breach notification duties, and large penalties for security failures (up to ₹250 Crore).</p>
            </div>
            <div>
              <h4 className="font-semibold">Operational Takeaway</h4>
              <p className="mt-1">Both laws overlap: compliance needs both technical controls and legal process. We design auditable programs to show reasonableness.</p>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" ref={addToRefs} className="-ml-20 px-6 md:px-20 py-12 md:py-16 bg-gray-950">
          <h2 className="text-2xl font-bold text-white mb-6 reveal-item">Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/** Repeat cards - same structure as above **/}
            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <h3 className="font-semibold text-cyan-200">DPDP Readiness & DPIAs</h3>
              <p className="text-gray-300 mt-2">Gap analysis, consent frameworks, multilingual privacy notices and vendor due diligence.</p>
            </article>

            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <h3 className="font-semibold text-cyan-200">Incident Response & Forensics</h3>
              <p className="text-gray-300 mt-2">Forensic triage, evidence preservation, reporting and litigation support.</p>
            </article>

            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <h3 className="font-semibold text-cyan-200">Regulatory Defense & Litigation</h3>
              <p className="text-gray-300 mt-2">Representation before adjudicating officers, DPB and courts for cyber disputes.</p>
            </article>

            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <h3 className="font-semibold text-cyan-200">Digital IP & Domain Disputes</h3>
              <p className="text-gray-300 mt-2">IP strategy for digital assets and cross-border enforcement.</p>
            </article>

            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <h3 className="font-semibold text-cyan-200">Cyber Financial Crime Recovery</h3>
              <p className="text-gray-300 mt-2">Recovery strategy for fraud, payment disputes and regulator liaison.</p>
            </article>

            <article className="card p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/20 border border-gray-800 reveal-item">
              <h3 className="font-semibold text-cyan-200">Training & Audits</h3>
              <p className="text-gray-300 mt-2">Employee awareness, tabletop exercises and compliance audits.</p>
            </article>
          </div>
        </section>

        {/* CREDIBILITY */}
        <section id="cred" ref={addToRefs} className="px-6 md:px-20 py-12 md:py-16">
          <h2 className="text-2xl font-bold text-white mb-4 reveal-item">Credibility & Track Record</h2>
          <div className="grid md:grid-cols-3 gap-6 reveal-item text-gray-300">
            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-3xl font-bold text-cyan-200">20+</h3>
              <p className="mt-2">Years experience across cyber law, forensics and policy.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-3xl font-bold text-cyan-200">100k+</h3>
              <p className="mt-2">Hours advising enterprise clients on digital risk.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-3xl font-bold text-cyan-200">Government & Industry</h3>
              <p className="mt-2">Advisory roles with ministries and regulatory bodies.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" ref={addToRefs} className="-ml-20 px-6 md:px-20 py-12 md:py-16 bg-gray-950">
          <div className="max-w-3xl mx-auto text-center reveal-item">
            <h2 className="text-2xl font-bold text-cyan-100">Mitigate Your ₹250 Cr Risk — Start with a Gap Analysis</h2>
            <p className="text-gray-300 mt-3">Actionable assessments and pragmatic controls. We keep the legal team out of firefighting and into preparedness.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <a href="mailto:contact@cyberlawfirm.com" className="px-4 py-2 rounded-md bg-cyan-400 text-black font-semibold">Email Us</a>
              <a href="#services" className="px-4 py-2 rounded-md border border-gray-700 text-gray-200">Explore Services</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center ml-50 py-5 text-gray-500 text-sm border-t border-gray-800">
        © Cyber Law Firm — All Rights Reserved
      </footer>
    </div>
  );
}
