// src/app/(main)/helldiver-2/academy/page.tsx

// Assuming you might have a shared layout or styling that defines colors like
// text-primary-foreground, text-secondary-foreground, text-accent, text-muted-foreground, bg-muted, bg-card, border-border
// If not, replace these with standard Tailwind color classes (e.g., text-white, text-blue-500, text-gray-400, bg-gray-800, border-gray-700)

export default function AcademyPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary-foreground border-b border-border pb-3">GPT Fleet Academy</h1>

      {/* Enrollment Section */}
      <section className="mb-10 p-6 bg-card border border-border rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-secondary-foreground mb-3">Enrollment Window</h2>
        <p className="text-lg font-medium text-accent">
          Enrollment closes at the end of the current month.
        </p>
         <p className="text-muted-foreground mt-2">
            Begin your journey to leadership within the GPT Fleet. This cycle repeats monthly.
        </p>
      </section>

      {/* Cadet Training Phases Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-secondary-foreground mb-6 border-b border-border pb-2">Cadet Training Program</h2>

        {/* Phase 1 */}
        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold text-primary-foreground mb-3">Phase 1: Cadet Orientation (7 Days)</h3>
          <p className="mb-3 text-muted-foreground">
            Achieve <strong className="text-secondary-foreground">Class A Citizen</strong> status by meeting initial standards.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-3">
            <li>Complete 1 Operation OR 3 recorded missions with a <code className="font-mono text-accent px-1 rounded bg-muted">@DEMOCRACY OFFICERS</code> or <code className="font-mono text-accent px-1 rounded bg-muted">@FLEET COMMANDER</code>.</li>
          </ul>
          <p className="text-muted-foreground italic">
            We aim to get you a place on the leaderboard!
          </p>
        </div>

        {/* Phase 2 */}
        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold text-primary-foreground mb-3">Phase 2: Mission Readiness (14 Days)</h3>
          <p className="mb-3 text-muted-foreground">
            Complete <strong className="text-secondary-foreground">10 missions</strong> or <strong className="text-secondary-foreground">3 operations</strong> under guidance of assigned <code className="font-mono text-accent px-1 rounded bg-muted">@DEMOCRACY OFFICERS</code> or <code className="font-mono text-accent px-1 rounded bg-muted">@FLEET COMMANDER</code>.
          </p>
           <p className="text-muted-foreground">
            Missions can be completed as duos to practice assessing and recruiting randoms.
           </p>
        </div>

        {/* Phase 3 */}
        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold text-primary-foreground mb-3">Phase 3: Officer Review & Promotion (End of Cadet Training)</h3>
          <p className="mb-3 text-muted-foreground">
            Cadets completing Phase 2 schedule a 1-hour VC Officer Interview/Onboarding.
          </p>
          <p className="mb-3 text-muted-foreground">
            Interview Panel: Cadet, assigned DO/FC, <strong className="text-secondary-foreground">PrizedRichard</strong>, and a third party.
          </p>
          <p className="text-muted-foreground">
            Cadets coordinate scheduling with their DO/FC and <strong className="text-secondary-foreground">PrizedRichard</strong> (Timezone: GMT).
          </p>
        </div>
      </section>

      {/* Fleet Commander Development Section */}
       <section className="mb-10 p-6 bg-card border border-border rounded-lg">
           <h2 className="text-2xl font-semibold text-secondary-foreground mb-4">Fleet Commander Promotion & Development</h2>
           <p className="mb-4 text-muted-foreground">
               Congratulations upon completion of Cadet training and promotion to <code className="font-mono text-accent px-1 rounded bg-muted">@FLEET COMMANDER</code>! Your development towards Democracy Officer begins now.
           </p>
           <p className="mb-4 text-muted-foreground">
               You will be assessed during a <strong className="text-secondary-foreground">28-day mentorship period</strong> starting from your promotion date.
           </p>
           <h3 className="text-lg font-semibold text-primary-foreground mb-3">Duties & Focus Areas:</h3>
           <ul className="list-disc list-inside space-y-2 text-muted-foreground">
               <li>Assist with the development of newer members, helping them get involved and gain Class A citizenship.</li>
               <li>Assist with the next intake/class of Cadets in their training phases.</li>
               <li>Support Alliance relations, engaging with current Alliance members and potentially assisting with outreach to new ones.</li>
           </ul>
       </section>

       {/* Phase 4 DO Promotion Review */}
        <section className="mb-10 p-6 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-semibold text-secondary-foreground mb-4">Phase 4: Democracy Officer Promotion Review</h2>
          <p className="mb-3 text-muted-foreground">
             <code className="font-mono text-accent px-1 rounded bg-muted">@FLEET COMMANDER</code> who demonstrate readiness and are nominated by their <code className="font-mono text-accent px-1 rounded bg-muted">@DEMOCRACY OFFICERS</code> will schedule a Moderation Review.
          </p>
          <p className="text-muted-foreground">
            A promotion board consisting of three <code className="font-mono text-accent px-1 rounded bg-muted">@LOYALTY OFFICER</code> members will evaluate the candidate for potential promotion to <strong className="text-secondary-foreground">DEMOCRACY OFFICER</strong>.
          </p>
        </section>


      {/* Field Promotions Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-secondary-foreground mb-6 border-b border-border pb-2">Earning Field Promotions</h2>
        <p className="mb-6 text-muted-foreground">
          Field promotions within GPT are a mark of excellence, dedication, and leadership beyond the standard training path. Here’s how they work:
        </p>

        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold text-primary-foreground mb-3">Step 1: Excel & Earn the John Helldiver Award</h3>
          <p className="mb-3 text-muted-foreground">
            Mastering the Solo Tier List challenges within the Training Academy and earning the prestigious <strong className="text-secondary-foreground">John Helldiver Award</strong> is the first step to standing out.
          </p>
          <p className="text-muted-foreground italic">
             This achievement highlights your skills and commitment. We notice members who excel, demonstrating skill and thriving in our collaborative environment.
          </p>
        </div>

        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold text-primary-foreground mb-3">Step 2: Recommendations for Promotion</h3>
          <p className="mb-4 text-muted-foreground">
            Promotions often arise from recommendations by officers based on contributions and potential:
          </p>
          <div className="space-y-4">
              <div>
                  <h4 className="font-semibold text-secondary-foreground">Fleet Commander to Democracy Officer:</h4>
                  <p className="text-muted-foreground text-sm ml-4"><code className="font-mono text-accent px-1 rounded bg-muted">@LOYALTY OFFICER</code> members play a critical role, putting forward recommendations to the 10-Star General for discussion.</p>
              </div>
              <div>
                  <h4 className="font-semibold text-secondary-foreground">Class A Citizen to Fleet Commander:</h4>
                  <p className="text-muted-foreground text-sm ml-4">A <code className="font-mono text-accent px-1 rounded bg-muted">@DEMOCRACY OFFICERS</code> can recommend a Citizen, subject to approval by the 10-Star General commanding the fleet.</p>
              </div>
              <div>
                   <h4 className="font-semibold text-secondary-foreground">Loyalty Officer Promotions:</h4>
                   <p className="text-muted-foreground text-sm ml-4">This distinct honor is reserved for those consistently demonstrating outstanding loyalty and contributions. Promotions are made at the discretion of the 10-Star General to recognize individuals who go above and beyond.</p>
              </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
           <h3 className="text-xl font-semibold text-primary-foreground mb-3">Final Thoughts on Field Promotions</h3>
           <p className="text-muted-foreground">
               Field promotions aren’t just about rank—they’re about earning the respect and trust of the community. Every step rewards dedication, skill, and the spirit of teamwork. Strive for excellence; the GPT Fleet takes notice.
           </p>
        </div>
      </section>

      {/* Other Options / Info Section */}
      <section className="mb-10 grid md:grid-cols-2 gap-6">
         {/* Resignation Option (Updated) */}
        <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-semibold text-primary-foreground mb-3">Resignation Option</h3>
            <p className="text-muted-foreground">
                Members may choose to resign at any stage of training while retaining their <strong className="text-secondary-foreground">Class A Citizen</strong> status or <strong className="text-secondary-foreground">Fleet Commander</strong> position, title, and duties within our community.
            </p>
        </div>

        {/* Monthly Cycle */}
        <div className="p-6 bg-card border border-border rounded-lg">
             <h3 className="text-xl font-semibold text-primary-foreground mb-3">Monthly Progression Cycle</h3>
            <ul className="list-none space-y-1 text-muted-foreground">
                {/* Kept original cycle list */}
                <li><strong className="text-secondary-foreground">Enrollment:</strong> 30-day sign-up period</li>
                <li><strong className="text-secondary-foreground">Training (Cadet):</strong> 30-day completion window (Phases 1-3)</li>
                <li><strong className="text-secondary-foreground">Graduate (Fleet Commander):</strong> 28-day mentorship</li>
                <li><strong className="text-secondary-foreground">Democracy Officer:</strong> Post-review service</li>
                <li><strong className="text-secondary-foreground">Phantom (Retired Officer):</strong> Post-active duty</li>
                <li><strong className="text-secondary-foreground">Admin:</strong> 90-day term</li>
                <li><strong className="text-secondary-foreground">Staff:</strong> Application-based</li>
            </ul>
        </div>
      </section>


      {/* Closing Statement (Updated) */}
      <p className="text-center italic text-muted-foreground mt-10">
        Thank you for your dedication and passion. Together, we ensure the future strength and leadership of the GPT Fleet and uphold the ideals of our alliance.
      </p>
    </main>
  );
}