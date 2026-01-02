
import React from "react";

export default function OfferBanner({ isAuthed }) {
    if (isAuthed) return null;

    return (
        <div className="offer-strip text-center" role="alert">
            <div className="container-max d-flex justify-content-center align-items-center gap-2">
                <span>Login required to view pricing.</span>
            </div>
        </div>
    );
}
