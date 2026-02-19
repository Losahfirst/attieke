import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, CheckCircle, Truck, User, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroWrapper}>
            <div className={styles.heroContent}>
              <h1>L'Attiéké de Qualité, <span className="highlight">Livré chez Vous.</span></h1>
              <p>
                Commandez votre attiéké préféré (Abodjaman, Garba, Simple) en quelques clics.
                Qualité certifiée et livraison rapide pour tous vos besoins.
              </p>
              <div className={styles.heroActions}>
                <Link href="/order" className="premium-btn">
                  <ShoppingCart size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Commander
                </Link>
                <Link href="/admin" className="outline-btn">
                  <ShieldCheck size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Vendeur
                </Link>
              </div>
            </div>
            <div className={styles.heroImageContainer}>
              <Image
                src="/images/attieke-plate-top.jpg"
                alt="Assiette d'attiéké d'or"
                width={600}
                height={500}
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className="container">
          <div className={styles.processContent}>
            <div className={styles.processText}>
              <span className="highlight" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem' }}>Notre Savoir-Faire</span>
              <h2>Un processus artisanal pour un goût authentique</h2>
              <p>Chaque grain d'attiéké est préparé selon des méthodes ancestrales, garantissant une fraîcheur et une texture inégalées.</p>

              <div className={styles.processSteps}>
                <div className={styles.processStep}>
                  <div className={styles.processDot}></div>
                  <div>
                    <h4>Séchage & Criblage</h4>
                    <p>Le secret réside dans le tamisage manuel pour obtenir ces grains fins si appréciés.</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processDot}></div>
                  <div>
                    <h4>Cuisson Vapeur</h4>
                    <p>Une cuisson maîtrisée qui préserve toute la légèreté de l'attiéké.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.processImages}>
              <div className={styles.imageGrid}>
                <div className={styles.imageWrapper}>
                  <Image src="/images/sifting.jpg" alt="Criblage de l'attiéké" width={300} height={400} className={styles.roundedImage} />
                </div>
                <div className={styles.imageWrapper} style={{ marginTop: '3rem' }}>
                  <Image src="/images/processing.jpg" alt="Préparation de l'attiéké" width={300} height={400} className={styles.roundedImage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.steps}>
        <div className="container">
          <h2>Comment ça marche ?</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.iconWrapper}>
                <ShoppingCart size={40} color="var(--primary)" />
              </div>
              <h3>Je commande</h3>
              <p>Choisissez votre type d'attiéké et le montant souhaité (à partir de 500F).</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.iconWrapper}>
                <CheckCircle size={40} color="var(--primary)" />
              </div>
              <h3>Validation</h3>
              <p>Nous préparons votre commande avec le plus grand soin.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.iconWrapper}>
                <Truck size={40} color="var(--primary)" />
              </div>
              <h3>Livraison</h3>
              <p>Recevez votre commande à l'adresse indiquée, rapidement.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
