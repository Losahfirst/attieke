"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, ArrowRight, User, Package, ShieldCheck, Heart, Award,
  Smartphone, Apple, PlayCircle, Globe, Mail, Phone, ExternalLink, Instagram, Twitter, Facebook,
  MessageCircle, Utensils, ShoppingBag, Truck
} from 'lucide-react';
import { ProgressiveImage } from '@/components/ProgressiveImage';
import styles from './page.module.css';

const HERO_IMAGES = [
  'https://www.mangeonsbien.com/wp-content/uploads/2024/02/pic-cv.jpg',
  'https://media-files.abidjan.net/photo/l-unesco-inscrit-l-attieke-plat-emblematique-de-la-cote-d-ivoire-au-patrimo_hd3h1cn8y5.jpg'
];

export default function Home() {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* MOBILE APP VIEW - Keep it as is for small screens */}
      <div className={styles.mobileApp}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileTopRow}>
            <img src="/logo.png" alt="Logo" className={styles.mobileMinifiedLogo} />
            <div className={styles.mobileLocationPill}>
              <MapPin size={14} /> <span>Bouaké, CI</span>
            </div>
          </div>

          <div className={styles.mobileSearchBox}>
            <div className={styles.searchInner}>
              <Smartphone size={18} className={styles.searchIcon} />
              <input type="text" placeholder="De quoi avez-vous besoin aujourd'hui ?" disabled />
            </div>
          </div>

          <div className={styles.mobileHeroCard}>
            <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentImg * 100}%)` }}>
              {HERO_IMAGES.map((img, idx) => (
                <div key={idx} className={styles.carouselSlide}>
                  <ProgressiveImage src={img} alt="Hero" fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.mobileCta}>
          <Link href="/order" className={styles.mobileCtaBtn}>Commander <ArrowRight size={20} /></Link>
        </div>

        <div className={styles.mobileCategories}>
          <div className={styles.mobileSectionHeader}>
            <h2>Nos catégories</h2>
            <Link href="/order" className={styles.seeMore}>Voir plus <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryItem}>
              <div className={`${styles.categoryIcon} ${styles.bgOrange}`}>
                <Globe size={20} />
              </div>
              <span>Burkina Faso</span>
            </div>
            <div className={styles.categoryItem}>
              <div className={`${styles.categoryIcon} ${styles.bgYellow}`}>
                <Truck size={20} />
              </div>
              <span>Livraison Europe</span>
            </div>
            <div className={styles.categoryItem}>
              <div className={`${styles.categoryIcon} ${styles.bgGreen}`}>
                <Award size={20} />
              </div>
              <span>Nouveautés</span>
            </div>
          </div>
        </div>

        {/* NEW SECTION: Nouveautés Horizontal Scroll */}
        <div className={styles.mobileFeatured}>
          <div className={styles.mobileSectionHeader}>
            <h2>Nouveautés !</h2>
            <Link href="/order" className={styles.seeMore}>Voir plus <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.horizontalScroll}>
            <div className={styles.productCardSmall}>
              <div className={styles.productThumb}>
                <img src="/product-attieke.png" alt="Garba" />
              </div>
              <span className={styles.productName}>Garba Express</span>
              <span className={styles.productPrice}>1,500 FCFA</span>
            </div>
            <div className={styles.productCardSmall}>
              <div className={styles.productThumb}>
                <img src="/product-attieke.png" alt="Abodjaman" />
              </div>
              <span className={styles.productName}>Abodjaman</span>
              <span className={styles.productPrice}>2,000 FCFA</span>
            </div>
            <div className={styles.productCardSmall}>
              <div className={styles.productThumb}>
                <img src="/product-attieke.png" alt="Attiéké Normal" />
              </div>
              <span className={styles.productName}>Attiéké Normal</span>
              <span className={styles.productPrice}>1,000 FCFA</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW - DJOLI STYLE REPLICA */}
      <div className={styles.desktopOnly}>

        {/* HERO SECTION */}
        <section className={styles.heroSection} id="home">
          <div className={styles.heroBg}>
            <img src="https://gdb.voanews.com/987b9ad6-6794-4f8a-beca-4c473d0f3d7a_cx0_cy9_cw0_w1080_h608_s.jpg" alt="Attieke Background" />
          </div>
          <div className={styles.heroContent}>
            <h1>L'Attiéké de Molonoublé,<br />en 24h chez vous.</h1>
            <p>
              Commandez le meilleur attiéké de Côte d'Ivoire directement depuis notre application.
              Frais, authentique et livré rapidement.
            </p>
            <div className={styles.heroActions}>
              <a href="https://wa.me/22500000000" className={styles.whatsappBtn}>
                <MessageCircle size={22} fill="currentColor" />
                Commander sur WhatsApp
              </a>
              <a href="#" className={styles.playStoreBtn}>
                <img src="https://i0.wp.com/www.emissionsreductionnow.com/wp-content/uploads/2022/10/google-play-icon-FR.png?fit=1024%2C397&ssl=1" alt="Get it on Google Play" />
              </a>
            </div>
          </div>
          <div className={styles.heroMockupContainer}>
            <img src="/mockups/mol-hero.png" alt="App Mockup" className={styles.heroMockup} />
          </div>
        </section>

        {/* SECTION QUALITY (White) */}
        <section className={`${styles.splitSection} ${styles.whiteSection}`}>
          <div className={styles.sectionMockup}>
            <img src="/mockups/mol-order.png" alt="Products Mockup" className={styles.mockupImg} />
          </div>
          <div className={styles.splitContent} id="production">
            <h2>Qualité Garantie</h2>
            <p>
              Nous travaillons sans intermédiaire avec les productrices de <strong>Molonoublé</strong>.
              Un contrôle strict pour un goût unique et une fraîcheur exemplaire.
            </p>
          </div>
        </section>

        {/* SECTION DELIVERY (Green) */}
        <section className={`${styles.splitSection} ${styles.greenSection}`}>
          <div className={styles.splitContent}>
            <h2>Livraison Express</h2>
            <p>
              De Molonoublé à votre table en un clic. Nous assurons une logistique rapide
              pour que vous n'ayez jamais de rupture de stock.
            </p>
          </div>
          <div className={styles.sectionMockup}>
            <img src="/mockups/mol-map.png" alt="Delivery Mockup" className={styles.mockupImg} />
          </div>
        </section>

        {/* FLOATING ACTION */}
        <div className={styles.floatingAction}>
          <div className={styles.subscribePill}>
            <User size={20} />
            Subscribe
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerInfo}>
              <img src="/logo.png" alt="Power Production Logo" style={{ height: '70px', marginBottom: '1.5rem' }} />
              <p>L'excellence de l'attiéké de Molonoublé au service de votre table.</p>
            </div>
            <div className={styles.footerLinks}>
              <h4>Produit</h4>
              <ul>
                <li><Link href="/order">Commander</Link></li>
                <li><Link href="#app">Application</Link></li>
              </ul>
            </div>
            <div className={styles.footerLinks}>
              <h4>Entreprise</h4>
              <ul>
                <li><Link href="/about">Notre Histoire</Link></li>
                <li><Link href="#production">Provenance</Link></li>
              </ul>
            </div>
            <div className={styles.footerLinks}>
              <h4>Aide</h4>
              <ul>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom} style={{ justifyContent: 'flex-end' }}>
            <div className={styles.socials}>
              <div className={styles.socialIcon}><Instagram size={18} /></div>
              <div className={styles.socialIcon}><Facebook size={18} /></div>
              <div className={styles.socialIcon}><Twitter size={18} /></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
