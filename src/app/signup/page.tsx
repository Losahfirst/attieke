import Link from 'next/link';
import '../auth.css';

export default function Signup() {
    return (
        <div className="authContainer">
            <div className="authCard">
                <h2>Créer un compte</h2>
                <form>
                    <div className="formGroup">
                        <label>Nom complet</label>
                        <input type="text" placeholder="Ex: Jean Dupont" required />
                    </div>
                    <div className="formGroup">
                        <label>Téléphone</label>
                        <input type="tel" placeholder="Ex: 07 00 00 00 00" required />
                    </div>
                    <div className="formGroup">
                        <label>Email</label>
                        <input type="email" placeholder="votre@email.com" required />
                    </div>
                    <div className="formGroup">
                        <label>Adresse de livraison par défaut</label>
                        <input type="text" placeholder="Commune, Quartier, Rue" required />
                    </div>
                    <div className="formGroup">
                        <label>Mot de passe</label>
                        <input type="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="premium-btn authBtn">S'inscrire</button>
                </form>
                <p className="authFooter">
                    Déjà un compte ? <Link href="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}
