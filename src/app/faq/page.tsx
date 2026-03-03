import Link from 'next/link';
import { ArrowLeft, HelpCircle, ShoppingBag, Truck, CreditCard, Star } from 'lucide-react';
import styles from './faq.module.css';

export default function FAQPage() {
    const faqs = [
        {
            icon: <Truck size={24} />,
            question: "La livraison est-elle assurée en 24h ?",
            answer: "Oui, toute commande passée avant 14h est traitée et livrée dès le lendemain matin dans le district d'Abidjan."
        },
        {
            icon: <ShoppingBag size={24} />,
            question: "D'où provient votre attiéké ?",
            answer: "Notre attiéké est produit exclusivement à Molonoublé, dans le Gbêkê. Nous travaillons sans intermédiaire avec les artisanes locales."
        },
        {
            icon: <Star size={24} />,
            question: "L'attiéké est-il frais ?",
            answer: "Absolument. Il est produit, emballé sous vide et expédié de Molonoublé pour conserver son goût unique."
        },
        {
            icon: <CreditCard size={24} />,
            question: "Comment payer ma commande ?",
            answer: "Nous acceptons les paiements en espèces à la livraison, par Orange Money, MTN MoMo, et Wave."
        },
        {
            icon: <HelpCircle size={24} />,
            question: "Peut-on commander en gros ?",
            answer: "Oui, nous avons des tarifs spéciaux 'restaurateurs' pour les commandes dépassant les 10kg."
        }
    ];

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}><ArrowLeft size={20} /> Retour</Link>
                <h1>Foire Aux Questions</h1>
                <p>Toutes les réponses à vos questions sur notre service.</p>
            </header>

            <main className={styles.content}>
                <div className={styles.faqList}>
                    {faqs.map((faq, idx) => (
                        <div key={idx} className={styles.faqItem}>
                            <div className={styles.faqIcon}>{faq.icon}</div>
                            <div className={styles.faqText}>
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className={styles.footer}>
                <Link href="/contact" className={styles.ctaBtn}>Encore une question ? Contactez-nous</Link>
            </footer>
        </div>
    );
}
