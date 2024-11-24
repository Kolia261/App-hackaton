import React from "react";
import { useModal } from "../../context/ModalContext";

export default function Modal({taskId, text, progress, title, setConfirmed}) {
  const { modalIsOpen, handleClose } = useModal();
  const handleClickOverlay = (event) => {
    if (event.target === event.currentTarget) {
      handleClose(event);
    }
  };


  function handleClick() {
    setConfirmed() //тут почему то ошибка
    handleClose()
  }

  return (
    <dialog onClick={handleClickOverlay} open={modalIsOpen} >
      <article>
        <header>
          <button aria-label="Close" rel="prev" onClick={handleClose}></button>
          <h3 >{title}</h3> 
        </header>
        <p style={{textAlign:"left"}}>
          {text}
        </p>
        <footer>
          <button className="secondary" onClick={handleClose}>
            ок
          </button>
          <button style={{marginLeft: 0}} onClick={handleClick}>выполнил!</button>
        </footer>
      </article>
    </dialog>
  );
}
