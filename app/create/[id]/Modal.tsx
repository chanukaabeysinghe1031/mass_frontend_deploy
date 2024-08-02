import { ReactNode } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4 ">
                <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl h-full max-h-[80vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white p-6 z-10">
                        <h2 className="text-xl font-bold mb-4">Select an Image</h2>
                        <button
                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full focus:outline-none"
                            onClick={onClose}
                        >
                            &#x2715;
                        </button>
                    </div>
                    <div className="p-6 ">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
