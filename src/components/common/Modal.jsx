import { useEffect, useState } from "react";
import classNames from "classnames";

const Modal = ({ isOpen, onClose, children }) => {
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        // Start closed, then enter on the next frame so the transition runs
        setEntered(false);
        const id = requestAnimationFrame(() => setEntered(true));

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener("keydown", onKeyDown);
            setEntered(false);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={classNames(
                // The page is already near-black, so a plain dark scrim can't
                // separate the panel from what's behind it — the blur does that work
                "fixed inset-0 z-50 flex items-center justify-center bg-carbon-950/85 backdrop-blur-sm",
                "transition-opacity duration-200",
                entered ? "opacity-100" : "opacity-0"
            )}
            onMouseDown={onClose}
        >
            <div
                className={classNames(
                    "overflow-y-auto max-h-[85vh] relative w-full max-w-lg bg-carbon-850 shadow-modal rounded-lg",
                    "transition-all duration-200",
                    entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex items-center justify-between">
                    <button
                        type="button"
                        className="text-paper hover:text-carbon-950 bg-carbon-600 hover:bg-neon transition-colors rounded-full w-9 h-9 p-0 ml-auto"
                        aria-label="Close modal"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
};

export default Modal;
