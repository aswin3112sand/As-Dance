import React from 'react';
import { Calendar } from 'lucide-react';

const ScheduleStrip = () => {
    return (
        <section className="py-5">
            <div className="container-max">
                <div className="rounded-4 p-4 position-relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(90deg, #6441a5 0%, #2a0845 100%)',
                        boxShadow: '0 10px 30px rgba(100, 65, 165, 0.4)'
                    }}>

                    {/* Abstract Shapes */}
                    <div className="position-absolute top-0 end-0 p-5" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(30%, -30%)', width: '300px', height: '300px' }}></div>

                    <div className="row align-items-center position-relative z-1">
                        <div className="col-md-1 d-none d-md-block text-center">
                            <div className="p-3 rounded-circle d-inline-block" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                <Calendar size={32} className="text-white" />
                            </div>
                        </div>

                        <div className="col-md-7 mb-3 mb-md-0">
                            <h3 className="fw-bold text-white mb-1">TRAINING SCHEDULE</h3>
                            <p className="text-white-50 mb-0">All training schedules in one place. Find your perfect time.</p>
                        </div>

                        <div className="col-md-4 text-md-end">
                            <button className="btn bg-white text-dark fw-bold rounded-pill px-4 py-3 hover-lift shadow-lg">
                                VIEW SCHEDULE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScheduleStrip;
