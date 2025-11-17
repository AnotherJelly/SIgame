import { createPortal } from 'react-dom';
import style from "./Modal.module.css";

export default function Modal ({ closeModal, isModalOpen, title, children }) {
    if (!isModalOpen) return createPortal(
        <div className={style.modalOverlay}>
            <div className={style.modalBackground} onClick={closeModal}></div>
            <div className={style.modalContent}></div>
        </div>,
        document.body
    );

    return createPortal(
        <div className={`${style.modalOverlay} ${style.open}`}>
            <div className={style.modalBackground} onClick={closeModal}></div>
            <div className={style.modalContent}>
                <div className={style.modalContent_title}>
                    <span>{title}</span>
                    <button onClick={closeModal}>
                        ✖
                    </button>
                </div>
                {children}                
            </div>
        </div>,
        document.body
    );
}