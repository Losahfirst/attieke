import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, CheckCircle, Truck, ShieldCheck,
  Star, MapPin, Clock, ArrowRight, ChevronRight, Package, User
} from 'lucide-react';
import styles from './page.module.css';

const IMGS = {
  hero: '/images/attieke-plate-top.jpg',
  type1: 'https://i.pinimg.com/736x/a0/45/17/a045175691adf431e4d42d35ada16c24.jpg',
  type2: 'https://waki-ci.com/media/activity/524728648_122217432488142312_6248604647129416652_n_2.jpg',
  type3: 'https://i.pinimg.com/736x/1c/c4/a2/1cc4a260d7bbaa94754177b9fd380000.jpg',
  process: 'https://abidjanplanet.ci/wp-content/uploads/2024/12/prepa-attieke.jpg',
  banner: 'https://i.pinimg.com/1200x/64/07/0e/64070e18d32b9f43e9c81fb766d87102.jpg',
};

const TYPES = [
  { name: 'Abodjaman', desc: 'Attiéké sec, idéal à emporter', price: 'Dès 500 F', img: IMGS.type1 },
  { name: 'Garba', desc: 'Avec thon frit, plat traditionnel', price: 'Dès 1 000 F', img: IMGS.type2 },
  { name: 'Simple', desc: 'Nature, base de tous les plats', price: 'Dès 200 F', img: IMGS.type3 },
];

export default function Home() {
  return (
    <>
      {/* ════════════════════════════════════════
          MOBILE LAYOUT  (hidden on desktop)
      ════════════════════════════════════════ */}
      <div className={styles.mobileApp}>

        {/* ── Top header ── */}
        <div className={styles.mobileHeader}>
          {/* Location + Avatar row */}
          <div className={styles.mobileTopRow}>
            <div className={styles.mobileLocationPill}>
              <MapPin size={13} strokeWidth={2.5} />
              <span>Molonoublé, Bouaké</span>
            </div>
            <Link href="/discover" className={styles.mobileAvatarBtn}>
              <User size={18} strokeWidth={2} />
            </Link>
          </div>
          <h1 className={styles.mobileHeroTitle}>
            L&apos;Attiéké<br />
            <span className={styles.mobileHeroAccent}>Authentique</span>
          </h1>
          <p className={styles.mobileHeroSub}>De Bouaké jusqu&apos;à votre porte</p>
        </div>

        {/* ── Hero image card ── */}
        <div className={styles.mobileHeroCard}>
          <Image
            src={IMGS.hero}
            alt="Attiéké de Molonoublé"
            fill
            className={styles.mobileHeroImg}
            priority
          />
          <div className={styles.mobileHeroOverlay} />
          <div className={styles.mobileHeroCardContent}>
            <div className={styles.mobileRatingPill}>
              <Star size={12} color="#D4AF37" fill="#D4AF37" />
              <span>4.9 · Livraison gratuite Bouaké</span>
            </div>
          </div>
        </div>

        {/* ── CTA sous l’image ── */}
        <div className={styles.mobileCta}>
          <Link href="/order" className={styles.mobileCtaBtn}>
            <ShoppingCart size={20} strokeWidth={2.5} />
            Commander maintenant
          </Link>
        </div>

        {/* ── Quick stats ── */}
        <div className={styles.mobileStats}>
          <div className={styles.mobileStat}>
            <div className={styles.mobileStatIcon}><Star size={16} color="#D4AF37" fill="#D4AF37" /></div>
            <span className={styles.mobileStatVal}>4.9/5</span>
            <span className={styles.mobileStatLbl}>Note</span>
          </div>
          <div className={styles.mobileStatDiv} />
          <div className={styles.mobileStat}>
            <div className={styles.mobileStatIcon}><Clock size={16} color="#27AE60" /></div>
            <span className={styles.mobileStatVal}>30 min</span>
            <span className={styles.mobileStatLbl}>Livraison</span>
          </div>
          <div className={styles.mobileStatDiv} />
          <div className={styles.mobileStat}>
            <div className={styles.mobileStatIcon}><Package size={16} color="#3498db" /></div>
            <span className={styles.mobileStatVal}>Gratuit</span>
            <span className={styles.mobileStatLbl}>Bouaké</span>
          </div>
        </div>


        {/* Bottom spacer for BottomNav */}
        <div style={{ height: '90px' }} />
      </div>

      {/* ════════════════════════════════════════
          DESKTOP LAYOUT  (hidden on mobile)
      ════════════════════════════════════════ */}
      <div className={styles.desktopOnly}>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.heroContainer}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                L&apos;Attiéké <br />
                <span className={styles.heroAccent}>Authentique</span><br />
                de Côte d&apos;Ivoire
              </h1>
              <p className={styles.heroDesc}>
                Abodjaman, Garba, Simple — directement du village de Molonoublé
                jusqu&apos;à votre porte, partout dans le monde.
              </p>
              <div className={styles.heroCtas}>
                <Link href="/order" className={styles.ctaPrimary}>
                  <ShoppingCart size={18} strokeWidth={2.5} />
                  Commander maintenant
                  <ArrowRight size={16} strokeWidth={2.5} className={styles.ctaArrow} />
                </Link>
                <Link href="/admin" className={styles.ctaSecondary}>
                  <ShieldCheck size={18} />
                  Espace vendeur
                </Link>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <div className={styles.heroStatIcon} style={{ background: 'rgba(212,175,55,0.12)' }}>
                    <Star size={16} color="#D4AF37" fill="#D4AF37" />
                  </div>
                  <div><strong>4.9/5</strong><span>Satisfaction</span></div>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <div className={styles.heroStatIcon} style={{ background: 'rgba(39,174,96,0.12)' }}>
                    <Clock size={16} color="#27AE60" />
                  </div>
                  <div><strong>30 min</strong><span>Livraison Bouaké</span></div>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <div className={styles.heroStatIcon} style={{ background: 'rgba(52,152,219,0.12)' }}>
                    <MapPin size={16} color="#3498db" />
                  </div>
                  <div><strong>Gratuit</strong><span>Livraison Bouaké</span></div>
                </div>
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.heroImageWrap}>
                <div className={styles.heroImageGlow} />
                <Image src={IMGS.hero} alt="Attiéké authentique" width={560} height={560} className={styles.heroImg} priority />
              </div>
            </div>
          </div>
        </section>

        {/* ── BANNIÈRE ── */}
        <section className={styles.banner}>
          <Image src={IMGS.banner} alt="Attiéké frais" fill className={styles.bannerImg} />
          <div className={styles.bannerOverlay} />
          <div className={styles.bannerContent}>
            <p className={styles.bannerLabel}>Directement du village</p>
            <h2 className={styles.bannerTitle}>Un goût qui voyage<br />jusqu&apos;à vous</h2>
            <Link href="/order" className={styles.ctaPrimary}>
              <ShoppingCart size={18} />Commander maintenant
            </Link>
          </div>
        </section>

        {/* ── TYPES ── */}
        <section className={styles.types}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Nos produits</span>
              <h2 className={styles.sectionTitle}>Choisissez votre attiéké</h2>
            </div>
            <div className={styles.typesGrid}>
              {TYPES.map((type) => (
                <Link href="/order" key={type.name} className={styles.typeCard}>
                  <div className={styles.typeImgWrap}>
                    <Image src={type.img} alt={type.name} width={60} height={60} className={styles.typeImg} />
                  </div>
                  <div className={styles.typeBody}>
                    <h3>{type.name}</h3>
                    <p>{type.desc}</p>
                    <span className={styles.typePrice}>{type.price}</span>
                  </div>
                  <ArrowRight size={18} color="var(--primary)" className={styles.typeArrow} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── STEPS ── */}
        <section className={styles.steps}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Simple & rapide</span>
              <h2 className={styles.sectionTitle}>Comment ça marche ?</h2>
            </div>
            <div className={styles.stepsGrid}>
              {[
                { Icon: ShoppingCart, label: 'Je commande', desc: 'Choisissez votre attiéké et remplissez le formulaire en 2 minutes.', num: '1' },
                { Icon: CheckCircle, label: 'Validation', desc: 'Notre équipe confirme et prépare votre commande avec soin.', num: '2' },
                { Icon: Truck, label: 'Livraison', desc: 'Reçu chez vous rapidement. Livraison gratuite sur tout Bouaké.', num: '3' },
              ].map((step) => (
                <div key={step.label} className={styles.stepCard}>
                  <div className={styles.stepNumBadge}>{step.num}</div>
                  <div className={styles.stepIconRing}><step.Icon size={26} color="var(--primary)" strokeWidth={1.8} /></div>
                  <h3>{step.label}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className={styles.process}>
          <div className="container">
            <div className={styles.processContent}>
              <div className={styles.processText}>
                <span className={styles.sectionLabel}>Notre savoir-faire</span>
                <h2>Préparation artisanale<br />à Molonoublé</h2>
                <p>Chaque grain d&apos;attiéké est préparé selon des méthodes ancestrales transmises de génération en génération.</p>
                <div className={styles.processSteps}>
                  {[
                    { label: 'Séchage & Criblage', desc: 'Tamisage manuel pour des grains fins et réguliers.' },
                    { label: 'Cuisson Vapeur', desc: "Cuisson maîtrisée préservant toute la légèreté de l'attiéké." },
                  ].map((s) => (
                    <div className={styles.processStep} key={s.label}>
                      <div className={styles.processDot} />
                      <div><h4>{s.label}</h4><p>{s.desc}</p></div>
                    </div>
                  ))}
                </div>
                <Link href="/order" className={styles.ctaPrimary} style={{ marginTop: '2rem', display: 'inline-flex' }}>
                  <ShoppingCart size={18} /> Commander maintenant
                </Link>
              </div>
              <div className={styles.processImages}>
                <div className={styles.processImgSingle}>
                  <Image src={IMGS.process} alt="Préparation artisanale" width={480} height={560} className={styles.roundedImage} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
