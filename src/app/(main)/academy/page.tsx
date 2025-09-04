'use client';
import Image from 'next/image';
import Link from 'next/link';
import './AcademyPage.css';
import base from '../helldivers-2/HelldiversBase.module.css';

const AcademyPage = () => {
  return (
    <div className={`${base.pageContainer} academy-page`}>
      <header className="academy-header">
        <h1 className="academy-title">GPT Fleet Academy</h1>
        <p className="academy-subtitle">Advanced training for the elite Helldivers of the Galactic Phantom Division.</p>
      </header>

      <section className="academy-section">
        <h2 className="section-title">Core Curriculum</h2>
        <div className="curriculum-grid">
          <div className="curriculum-card">
            <Image src="/images/academy/tactical-positioning.jpg" alt="Tactical Positioning" width={500} height={300} className="card-image" />
            <div className="card-content">
              <h3 className="card-title">Advanced Tactical Positioning</h3>
              <p className="card-description">Master the art of battlefield awareness, cover utilization, and flanking maneuvers to outsmart and outmaneuver any threat.</p>
            </div>
          </div>
          <div className="curriculum-card">
            <Image src="/images/academy/stratagem-synergy.jpg" alt="Stratagem Synergy" width={500} height={300} className="card-image" />
            <div className="card-content">
              <h3 className="card-title">Stratagem Synergy</h3>
              <p className="card-description">Learn to combine Stratagems with your squad for devastating effects, turning the tide of battle with synchronized strikes.</p>
            </div>
          </div>
          <div className="curriculum-card">
            <Image src="/images/academy/enemy-anatomy.jpg" alt="Enemy Anatomy" width={500} height={300} className="card-image" />
            <div className="card-content">
              <h3 className="card-title">Xenobiology & Anatomy</h3>
              <p className="card-description">Gain in-depth knowledge of enemy weak points, behaviors, and resistances. Precision kills save ammo and lives.</p>
            </div>
          </div>
          <div className="curriculum-card">
            <Image src="/images/academy/mission-mastery.jpg" alt="Mission Mastery" width={500} height={300} className="card-image" />
            <div className="card-content">
              <h3 className="card-title">Objective Prioritization</h3>
              <p className="card-description">Excel in complex mission scenarios by learning to prioritize objectives and adapt to dynamically changing battlefield conditions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="academy-section">
        <h2 className="section-title">Enrollment</h2>
        <div className="enrollment-content">
          <p className="enrollment-description">
            Enrollment is open to all Helldivers who have demonstrated exceptional skill and a commitment to the values of the Galactic Phantom Division. 
            Prove your worth on the battlefield and you may be invited to join the ranks of the most elite soldiers in the galaxy.
          </p>
          <Link href="/join" className="enroll-button">
            Join the Fight
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AcademyPage;
