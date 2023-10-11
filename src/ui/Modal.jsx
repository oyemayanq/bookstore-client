import { createPortal } from "react-dom";

import styles from "./Modal.module.css";
import Button from "./Button";
import IconButton from "./IconButton";
import { CloseIcon } from "./Icons";

function Overlay({ onClose }) {
  return <div onClick={onClose} className={styles.backdrop}></div>;
}

function ModalDialog({ onConfirm, onClose }) {
  return (
    <div className={styles.modal}>
      <div className={styles["modal-content"]}>
        <p className={styles["modal-message"]}>
          Are you sure you want to delete?
        </p>
        <IconButton onClick={onClose}>
          <CloseIcon size={26} />
        </IconButton>
      </div>
      <div className={styles["modal-action"]}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} type="danger">
          Delete
        </Button>
      </div>
    </div>
  );
}

export function Modal({ onClose, onConfirm }) {
  return (
    <>
      {createPortal(
        <Overlay onClose={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <ModalDialog onClose={onClose} onConfirm={onConfirm} />,
        document.getElementById("modal")
      )}
    </>
  );
}

export function SideModal({ children, content, onClose }) {
  return (
    <>
      {createPortal(
        <Overlay onClose={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(children, document.getElementById("modal"))}
    </>
  );
}
