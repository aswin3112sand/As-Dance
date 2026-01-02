import React from 'react';
import { Gift, Zap } from 'lucide-react';

const PromoSection = () => {
    return (
        <section className="py-5 bg-dark position-relative">
            <div className="container-max">
                <div className="glass-panel p-0 overflow-hidden rounded-5">
                    <div className="row g-0">
                        {/* Image Side */}
                        <div className="col-lg-6 position-relative" style={{ minHeight: '400px' }}>
                            <div className="w-100 h-100" style={{
                                backgroundImage: 'url("https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=2070&auto=format&fit=crop")',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}></div>
                            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(10, 1, 24, 0.4)' }}></div>

                            {/* Floating Badge */}
                            <div className="position-absolute top-0 end-0 m-4">
                                <span className="badge bg-white text-dark rounded-pill px-3 py-2 fs-5 fw-bold shadow-lg transform rotate-6">
                                    <span className="text-neon-purple">-50%</span> OFF
                                </span>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="col-lg-6 p-4 p-md-5 d-flex align-items-center">
                            <div>
                                <div className="d-inline-flex align-items-center mb-3">
                                    <Gift className="text-neon-pink me-2" size={24} />
                                    <h4 className="fw-bold text-white m-0">SPECIAL OFFER</h4>
                                </div>

                                <h2 className="display-6 fw-bold text-white mb-4">
                                    SIGN UP FOR A <span className="text-gradient">TRIAL LESSON</span> WITH A DISCOUNT
                                </h2>

                                <p className="text-muted mb-4 lead">
                                    Our classes help relieve stress, feel confident in your body and reveal your natural femininity. Choose a convenient format - individual lessons, mini-groups or general classes.
                                </p>

                                <div className="d-flex gap-3 flex-wrap">
                                    <button className="btn-neon-primary px-4 py-3">
                                        Sign Up for Trial
                                    </button>
                                    <button className="btn-neon-outline px-4 py-3">
                                        Buy Certificate
                                    </button>
                                </div>

                                <div className="mt-4 pt-4 border-top border-secondary">
                                    <p className="text-white small mb-0 d-flex align-items-center">
                                        <Zap size={16} className="text-warning me-2" />
                                        Limited time offer! Only 5 spots left for this week.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoSection;
