import Link from 'next/link';
import '../auth.css';

export default function Login() {
    return (
        <div className="authContainer">
            <div className="authWrapper glass">
                <div className="authImage">
                    <img src="/images/attieke-bag.jpg" alt="Attiéké Express" />
                    <div className="imageOverlay">
                        <h3>Bienvenue chez Attiéké Express</h3>
                        <p>Le meilleur de la Côte d'Ivoire, livré chez vous.</p>
                    </div>
                </div>
                <div className="authCard">
                    <h2>Connexion</h2>
                    <form>
                        <div className="formGroup">
                            <label>Email / Téléphone</label>
                            <input type="text" placeholder="votre@email.com" required />
                        </div>
                        <div className="formGroup">
                            <label>Mot de passe</label>
                            <input type="password" placeholder="••••••••" required />
                        </div>
                        <button type="submit" className="premium-btn authBtn">Se connecter</button>
                    </form>
                    <p className="authFooter">
                        Pas encore de compte ? <Link href="/signup">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
