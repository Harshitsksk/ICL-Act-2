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

        // **FIXED: create active nav highlighting**
        ScrollTrigger.create({
          trigger: section,
          start: "top 20%",
          end: "bottom 20%",
          onToggle: (self) => {
            if (self.isActive) {
              setActive(section.id);
            }
          }
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
  }, []); // Dependency array is correct: [] for run-once-on-mount

  return (
    // REMOVED ml-20 FROM ROOT
    <div ref={root} className="relative bg-black text-white min-h-screen font-sans overflow-x-hidden scroll-smooth">
      {/* Grid background */}
      <div
        aria-hidden
        className="grid-bg absolute inset-0 opacity-12 bg-[linear-gradient(#0ff3_1px,transparent_1px),linear-gradient(90deg,#0ff3_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"
      ></div>

      {/* Sidebar TOC (visible ONLY on lg and up) */}
      {/* HIDDEN on small screens */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-56 z-40 
        bg-gray-950 bg-opacity-60 backdrop-blur-md border-r border-gray-800 p-6">
        <nav className="space-y-4 text-sm">
          <a href="#intro" className={`block ${active === "intro" ? "text-white font-semibold" : "text-gray-400"}`}>Digital Risks</a>
          <a href="#advantage" className={`block ${active === "advantage" ? "text-white font-semibold" : "text-gray-400"}`}>Advantage</a>
          <a href="#framework" className={`block ${active === "framework" ? "text-white font-semibold" : "text-gray-400"}`}>Framework</a>
          <a href="#services" className={`block ${active === "services" ? "text-white font-semibold" : "text-gray-400"}`}>Services</a>

          {/* NEW LINKS FOR EXTENDED SECTIONS */}
          <a href="#cred" className={`block ${active === "cred" ? "text-white font-semibold" : "text-gray-400"}`}>Credibility</a>
          <a href="#policy" className={`block ${active === "policy" ? "text-white font-semibold" : "text-gray-400"}`}>Policy & Compliance</a>
          <a href="#playbooks" className={`block ${active === "playbooks" ? "text-white font-semibold" : "text-gray-400"}`}>Incident Playbooks</a>
          <a href="#ip" className={`block ${active === "ip" ? "text-white font-semibold" : "text-gray-400"}`}>Digital IP</a>
          <a href="#policy-experts" className={`block ${active === "policy-experts" ? "text-white font-semibold" : "text-gray-400"}`}>Govt Advisory</a>

        </nav>
      </aside>


      <header className="pt-20 pb-10 text-center relative z-10 px-6 lg:ml-40">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Cyber Law Practice in India</h1>
        <p className="text-gray-300 mt-4 max-w-3xl mx-auto text-lg">Practical techno-legal counsel that reduces regulatory risk, responds rapidly to incidents, and keeps your business running.</p>
      </header>

      {/* lg:ml-56 ensures space for the sidebar on large screens, while being full width otherwise */}
      <main className="relative z-10 lg:ml-56 pt-10"> 
        {/* INTRO */}
        <section id="intro" ref={addToRefs} className="px-6 md:px-30 py-12 lg:ml-20">
          {/* text-left is better for content sections */}
          <h2 className="text-3xl font-bold text-white mb-7 reveal-item text-center md:text-left">The Digital Risk Landscape</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* REMOVED ml-20 and fixed to normal spacing */}
            <div className="reveal-item text-gray-400 leading-relaxed">
              <p>India's digital economy is scaling fast. While platforms like UPI drive inclusion at scale, that same scale attracts malicious actors—ransomware, API abuse, AI-driven attacks and social engineering are now business problems, not just IT problems.</p>
              <p className="mt-4">Breaches trigger regulatory obligations, costly investigations, customer churn and reputational damage. We turn regulatory risk into governance and operational controls you can demonstrate to auditors and regulators.</p>
            </div>

            {/* REMOVED ml-10 */}
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
        <section id="advantage" ref={addToRefs} className="px-6 md:px-20 py-12 md:py-16 bg-gray-950">
          {/* text-center for alignment */}
          <h2 className="text-3xl font-bold text-white mb-6 reveal-item text-center">Our Techno-Legal Advantage</h2>
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
          {/* text-center for alignment, replaced mb-15 with mb-8 */}
          <h2 className="text-3xl font-bold text-white reveal-item text-center mb-8">Cyber Legal Framework (Quick Guide)</h2>
          <div className="mt-4 space-y-6 reveal-item text-gray-300 max-w-4xl mx-auto">
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
        <section id="services" ref={addToRefs} className="px-6 md:px-20 py-12 md:py-16 bg-gray-950">
          <h2 className="text-3xl font-bold text-white mb-6 reveal-item text-center">Services</h2>
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
          <h2 className="text-3xl font-bold text-white mb-6 reveal-item text-center">Credibility & Track Record</h2>
          <div className="grid md:grid-cols-3 gap-6 reveal-item text-gray-300 max-w-4xl mx-auto">
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

        {/* NEW SECTION: POLICY & COMPLIANCE */}
        <section id="policy" ref={addToRefs} className="px-6 md:px-20 py-20 bg-gray-900">
          <h2 className="text-center text-3xl font-bold text-white mb-10 reveal-item">
            Policy & Compliance Deep Dive
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="card p-6 rounded-2xl bg-gray-900/60 border border-gray-800 reveal-item">
              <svg className="w-10 h-10 text-cyan-300" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" />
              </svg>
              <h3 className="text-lg font-semibold text-cyan-200 mt-4">DPDP Governance Framework</h3>
              <p className="text-gray-300 mt-2 leading-relaxed">
                Multilingual consent design, DPIAs, vendor audits, and lifecycle governance aligned
                with India’s modern data protection mandate.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card p-6 rounded-2xl bg-gray-900/60 border border-gray-800 reveal-item">
              <svg className="w-10 h-10 text-cyan-300" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1" />
              </svg>
              <h3 className="text-lg font-semibold text-cyan-200 mt-4">Global Security Standards</h3>
              <p className="text-gray-300 mt-2 leading-relaxed">
                Enterprise readiness for ISO 27001, SOC 2, HIPAA, ITGC audits and cyber strategy
                frameworks for global marketplaces.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card p-6 rounded-2xl bg-gray-900/60 border border-gray-800 reveal-item">
              <svg className="w-10 h-10 text-cyan-300" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18" stroke="currentColor" strokeWidth="1" />
              </svg>
              <h3 className="text-lg font-semibold text-cyan-200 mt-4">Cross-Border Data Transfers</h3>
              <p className="text-gray-300 mt-2 leading-relaxed">
                Legal pathways for compliant data movement across regions under DPDP, GDPR,
                CCPA, and sector-specific norms.
              </p>
            </div>
          </div>
        </section>


        {/* NEW SECTION: INCIDENT RESPONSE PLAYBOOKS */}
        <section id="playbooks" ref={addToRefs} className="px-6 md:px-20 py-20 bg-gray-950">
          <h2 className="text-center text-3xl font-bold text-white mb-10 reveal-item">
            Incident Response Playbooks
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            {/* Left block */}
            <div className="space-y-6 reveal-item">
              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
                <h3 className="text-xl font-semibold text-cyan-200">CERT-In & DPB Reporting</h3>
                <p className="text-gray-300 mt-2">
                  Structured reporting aligned with CERT-In 2022 Directions and DPDP mandatory
                  breach notification obligations.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
                <h3 className="text-xl font-semibold text-cyan-200">Forensic Ready Architecture</h3>
                <p className="text-gray-300 mt-2">
                  Chain-of-custody models, SIEM log baselines, and pre-negotiated forensic SOWs for
                  rapid response.
                </p>
              </div>
            </div>

            {/* Right visual block */}
            <div className="reveal-item">
              <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-lg p-6 bg-gradient-to-br from-gray-900/30 to-gray-800/10">
                {/* SVG illustration: shield + document + magnifier */}
                <div className="flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-48 h-48" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden>
                    <defs>
                      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0" stopColor="#0891b2"/>
                        <stop offset="1" stopColor="#06b6d4"/>
                      </linearGradient>
                    </defs>

                    {/* shield */}
                    <path d="M60 8c0 0 28 10 28 30v16c0 22-14 36-28 44-14-8-28-22-28-44V38C32 18 60 8 60 8z"
                      fill="url(#g)" opacity="0.95"/>

                    {/* document */}
                    <rect x="68" y="48" width="28" height="36" rx="2" fill="#0f172a" stroke="#1f2937" strokeWidth="1.2"/>
                    <rect x="72" y="52" width="20" height="4" rx="1" fill="#9ca3af"/>
                    <rect x="72" y="58" width="14" height="3" rx="1" fill="#9ca3af"/>

                    {/* magnifier */}
                    <circle cx="40" cy="70" r="10" fill="none" stroke="#94a3b8" strokeWidth="2"/>
                    <line x1="47" y1="77" x2="60" y2="90" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                <div className="mt-6 text-center">
                  <h4 className="text-lg font-semibold text-cyan-200">Investigation & Evidence</h4>
                  <p className="text-gray-300 mt-2">Forensic-first visuals — communicates trust and methodical investigation rather than flashy consumer tech.</p>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* NEW SECTION: DIGITAL IP */}
        <section id="ip" ref={addToRefs} className="px-6 md:px-20 py-20 bg-black">
          <h2 className="text-center text-3xl font-bold text-white mb-10 reveal-item">
            Digital IP & Domain Protection
          </h2>

          <div className="grid md:grid-cols-2 gap-10 reveal-item max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-xl font-semibold text-cyan-200">Trademark & Copyright Strategy</h3>
              <p className="text-gray-300 mt-3">
                Digital-first IP protection covering trademarks, copyright registration, infringement
                takedowns, and anti-counterfeit intelligence.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
              <h3 className="text-xl font-semibold text-cyan-200">WIPO Domain Dispute Resolution</h3>
              <p className="text-gray-300 mt-3">
                Expert representation for high-value UDRP/WIPO disputes, cybersquatting
                takedowns, and international digital brand enforcement.
              </p>
            </div>
          </div>
        </section>


        {/* NEW SECTION: GOVERNMENT ADVISORY */}
        <section id="policy-experts" ref={addToRefs} className="px-6 md:px-20 py-20 bg-gray-950">
          <h2 className="text-3xl text-center font-bold text-white mb-10 reveal-item">
            Government Advisory & Public Policy Leadership
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card p-6 rounded-2xl bg-gray-900/50 border border-gray-800 reveal-item">
              <h3 className="text-xl font-semibold text-cyan-200">Ministry-Level Expertise</h3>
              <p className="text-gray-300 mt-2">
                Advisory work with MeitY, Defence, and NIXI on cybersecurity, digital identity,
                procedural reforms, and national cyber law strategy.
              </p>
            </div>

            <div className="card p-6 rounded-2xl bg-gray-900/50 border border-gray-800 reveal-item">
              <h3 className="text-xl font-semibold text-cyan-200">International Bodies</h3>
              <p className="text-gray-300 mt-2">
                Consultations with UNICEF and the World Bank on online child protection, women's
                digital rights, and cyber safety policy.
              </p>
            </div>

            <div className="card p-6 rounded-2xl bg-gray-900/50 border border-gray-800 reveal-item">
              <h3 className="text-xl font-semibold text-cyan-200">High Court & Supreme Court</h3>
              <p className="text-gray-300 mt-2">
                Litigation experience shaping the interpretation of cyber jurisprudence, privacy,
                and constitutional freedoms.
              </p>
            </div>
          </div>
        </section>


        {/* NEW SECTION: ETHICS */}
        <section id="ethics" ref={addToRefs} className=" px-6 md:px-20 py-20 bg-black">
          <h2 className="text-center text-3xl font-bold text-white mb-6 reveal-item">
            Ethics & Professional Responsibility
          </h2>

          <p className="text-gray-400 reveal-item max-w-3xl mx-auto text-center leading-relaxed">
            All material provided on this website is strictly informational. It is not legal advice,
            nor does it constitute solicitation or advertising. Visitors must seek independent legal
            counsel before taking action. The firm shall not be responsible for outcomes based on
            reliance on this content.
          </p>
        </section>


        {/* CTA */}
        <section id="cta" ref={addToRefs} className="px-6 md:px-20 py-12 md:py-16 bg-gray-950">
          <div className="max-w-3xl mx-auto text-center reveal-item">
            <h2 className="text-2xl font-bold text-cyan-100">Mitigate Your ₹250 Cr Risk — Start with a Gap Analysis</h2>
            <p className="text-gray-300 mt-3">Actionable assessments and pragmatic controls. We keep the legal team out of firefighting and into preparedness.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <a className="px-4 cursor-pointer py-2 rounded-md bg-cyan-400 text-black font-semibold">Email Us</a>
              <a href="#services" className="px-4 py-2 rounded-md border border-gray-700 text-gray-200">Explore Services</a>
            </div>
          </div>
        </section>
      </main>

      {/* REMOVED ml-50 and centered the footer text */}
      <footer className="text-center py-5 text-gray-500 text-sm border-t border-gray-800">
        © Cyber Law Firm — All Rights Reserved
      </footer>
    </div>
  );
}