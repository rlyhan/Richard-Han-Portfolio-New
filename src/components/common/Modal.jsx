import { useEffect, useState } from "react";
import classNames from "classnames";

const Modal = ({ isOpen, onClose, modalTitle, children }) => {
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
                "fixed inset-0 z-50 flex items-center justify-center bg-black/70",
                "transition-opacity duration-200",
                entered ? "opacity-100" : "opacity-0"
            )}
            onMouseDown={onClose}
        >
            <div
                className={classNames(
                    "relative w-full max-w-lg bg-[#1a1a1a] border border-solid border-white/10 rounded-lg shadow-xl",
                    "transition-all duration-200",
                    entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex items-center justify-between">
                    <h2 id="modal-title" className="text-white font-semibold">
                        {modalTitle}
                    </h2>

                    <button
                        type="button"
                        className="text-black/60 hover:text-black rounded-full bg-white w-9 h-9 p-0"
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
