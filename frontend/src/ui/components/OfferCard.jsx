import React from 'react';
import { CheckCircle, ShieldCheck, Clock, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth.jsx";

const OfferCard = () => {
    const nav = useNavigate();
    const { user } = useAuth();

    const handleCheckout = () => {
        const target = "/checkout?pay=1";
        if (!user) {
            nav("/login", { state: { from: target } });
            return;
        }
        nav(target);
    };

    return (
        <section className="py-5 position-relative text-center">
            <div className="container-max">
                <div className="position-absolute top-50 start-50 translate-middle w-75 h-75" style={{ background: '#b026ff', filter: 'blur(120px)', opacity: 0.25, zIndex: -1 }}></div>

                <div className="card-3d p-5 d-inline-block position-relative animate-float hover-glow-premium" style={{ minWidth: '320px', maxWidth: '100%' }}>
                    {/* Glass Layer Depth */}
                    <div className="glass-card-layer position-absolute top-0 start-0 w-100 h-100 z-0"></div>

                    <div className="position-relative z-1">
                        <div className="position-absolute top-0 start-50 translate-middle" style={{ marginTop: '-2.5rem' }}>
                            <span className="badge bg-neon-pink text-white px-4 py-2 rounded-pill fs-6 shadow-lg text-uppercase tracking-wider border border-white border-opacity-25">Premium Bundle</span>
                        </div>

                        <h2 className="display-2 fw-bold text-white mb-2 neon-text-purple" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            ₹499 <span className="fs-4 text-muted fw-normal">Only</span>
                        </h2>
                        <p className="text-white-50 mb-4 pb-2 border-bottom border-secondary d-inline-block" style={{ minWidth: '280px' }}>One-Time Payment • Lifetime Access</p>

                        <div className="mb-4">
                            <h4 className="text-white fw-bold mb-3">Instant Unlock After Payment</h4>
                        </div>

                        <div className="d-flex justify-content-center gap-4 text-white-50 small mb-0 flex-wrap">
                            <div className="d-flex align-items-center gap-2">
                                <ShieldCheck size={18} className="text-neon-green" /> Secure Payment
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Clock size={18} className="text-neon-blue" /> Lifetime Access
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <MessageCircle size={18} className="text-warning" /> 24/7 Support
                            </div>
                        </div>

                        <div className="mt-4 pt-2">
                            <button
                                type="button"
                            className="btn btn-neon btn-lg w-100 btn-shimmer"
                            style={{ maxWidth: '300px' }}
                            onClick={handleCheckout}
                        >
                            UNLOCK NOW
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OfferCard;
