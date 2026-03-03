import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import styles from './contact.module.css';

export default function ContactPage() {
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}><ArrowLeft size={20} /> Retour</Link>
                <h1>Contactez-nous</h1>
                <p>Une question ? Une commande spéciale ? Notre équipe est là pour vous.</p>
            </header>

            <main className={styles.content}>
                <div className={styles.contactGrid}>
                    <div className={styles.contactCard}>
                        <div className={styles.iconBox}><Phone size={24} /></div>
                        <h3>Appelez-nous</h3>
                        <p>+225 00 00 00 00</p>
                    </div>
                    <div className={styles.contactCard}>
                        <div className={styles.iconBox}><MessageCircle size={24} /></div>
                        <h3>WhatsApp</h3>
                        <p>Disponible 7j/7 pour vos commandes</p>
                        <a href="https://wa.me/22500000000" className={styles.whatsappBtn}>Lancer une discussion</a>
                    </div>
                    <div className={styles.contactCard}>
                        <div className={styles.iconBox}><Mail size={24} /></div>
                        <h3>Email</h3>
                        <p>contact@powerproduction.ci</p>
                    </div>
                    <div className={styles.contactCard}>
                        <div className={styles.iconBox}><MapPin size={24} /></div>
                        <h3>Siège Social</h3>
                        <p>Abidjan, Côte-d'Ivoire</p>
                    </div>
                </div>

                <section className={styles.productionSite}>
                    <h2>Notre production à Molonoublé</h2>
                    <p>
                        Toutes nos unités de production sont situées à Molonoublé, dans le Gbêkê.
                        C'est là que notre attiéké est confectionné par les meilleures artisanes.
                    </p>
                </section>
            </main>
        </div>
    );
}
