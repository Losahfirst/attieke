import { Star, MapPin, Zap, ShoppingCart } from 'lucide-react';
import './order.css';

export default function Order() {
    return (
        <div className="order-page-container">
            <div className="container">
                <div className="order-content">
                    <div className="order-form-card">
                        <h2>Passer une commande</h2>
                        <p className="subtitle">Remplissez le formulaire ci-dessous pour recevoir votre attiéké.</p>

                        <form className="order-form">
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Montant (F CFA)</label>
                                    <input type="number" min="500" step="100" defaultValue="500" required />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Type d'attiéké</label>
                                    <select required>
                                        <option value="simple">Attiéké Simple</option>
                                        <option value="abodjaman">Abodjaman</option>
                                        <option value="garba">Garba</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Adresse de livraison complète</label>
                                <input type="text" placeholder="Ville, Quartier, Rue, Maison..." required />
                            </div>

                            <div className="form-group">
                                <label>Date souhaitée</label>
                                <input type="date" required />
                            </div>

                            <div className="form-group">
                                <label>Commentaire (Optionnel)</label>
                                <textarea placeholder="Précisions sur la livraison, adresse exacte, etc." rows={4}></textarea>
                            </div>

                            <div className="order-summary glass">
                                <div className="summary-item">
                                    <span>Montant commande</span>
                                    <span>Variable (min 500 F)</span>
                                </div>
                                <div className="summary-total">
                                    <span>Livraison estimée</span>
                                    <span className="total-amount">À partir de 1 000 F</span>
                                </div>
                            </div>

                            <button type="submit" className="premium-btn full-width">Valider la commande</button>
                        </form>
                    </div>

                    <div className="order-info">
                        <div className="info-card glass">
                            <h3>Pourquoi choisir Attiéké Express ?</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <Star size={18} color="var(--primary)" /> <span><strong>Qualité Premium:</strong> Grain fin et texture parfaite.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <MapPin size={18} color="var(--primary)" /> <span><strong>Origine Garantie:</strong> Fabriqué localement avec soin.</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                    <Zap size={18} color="var(--primary)" /> <span><strong>Rapide:</strong> Livraison en moins de 24h.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="order-preview-image">
                            <img src="/images/attieke-bag.jpg" alt="Attiéké frais" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
