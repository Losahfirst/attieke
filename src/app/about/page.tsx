import Link from 'next/link';
import { ArrowLeft, History, Users, Target } from 'lucide-react';
import styles from './about.module.css';

export default function AboutPage() {
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}><ArrowLeft size={20} /> Retour</Link>
                <h1>Notre Histoire</h1>
                <p>L'excellence de l'attiéké, du terroir de Molonoublé à votre table.</p>
            </header>

            <main className={styles.content}>
                <section className={styles.section}>
                    <div className={styles.iconBox}><History size={32} /></div>
                    <h2>Nos Origines</h2>
                    <p>
                        Tout a commencé à <strong>Molonoublé</strong>, un village au cœur de la région du Gbêkê,
                        réputé pour la qualité exceptionnelle de son manioc et le savoir-faire ancestral
                        de ses femmes productrices d'attiéké. Power Production est né de la volonté
                        de valoriser ce patrimoine et de le rendre accessible à tous, tout en garantissant
                        une rémunération juste pour les productrices.
                    </p>
                </section>

                <section className={styles.section}>
                    <div className={styles.iconBox}><Users size={32} /></div>
                    <h2>Notre Impact</h2>
                    <p>
                        Nous travaillons aujourd'hui avec plus de 50 productrices locales à Molonoublé.
                        En supprimant les intermédiaires inutiles, nous assurons une fraîcheur absolue
                        à nos clients et un impact économique direct sur les familles du village.
                        Chaque grain d'attiéké que vous consommez soutient une économie locale et durable.
                    </p>
                </section>

                <section className={styles.section}>
                    <div className={styles.iconBox}><Target size={32} /></div>
                    <h2>Notre Mission</h2>
                    <p>
                        Notre mission est simple : devenir le pont entre l'authenticité rurale et
                        les besoins de la vie moderne. Grâce à notre technologie de suivi et notre
                        logistique express, nous livrons le meilleur de la Côte d'Ivoire en moins de 24h.
                    </p>
                </section>
            </main>

            <footer className={styles.footer}>
                <Link href="/order" className={styles.ctaBtn}>Commander notre Attiéké</Link>
            </footer>
        </div>
    );
}
