import React, { useState } from 'react';
import './cell.css'
import Modal from '../modal/modal';
import ModalButton from '../modal/modelButton';
import { ModalProvider } from '../../context/ModalContext';


// TODO: сделать так, чтобы здесь можно было отправить запрос на сервер, что задача детенком выполнена 

export default function Cell({taskId, title, isFinished, text, finishTask, completed}) {
    const [color, setColor] = useState(completed ? "green" : "red")

    function setIsFinished() {
        setColor("green")
    }

    let modal = <></>
    function onCellClick() {
        modal = <Modal text={text} taskId={taskId} progress={isFinished}></Modal>
    }

    // let color = isFinished ? "green" : "red"
    return (
        <div className='cell' onClick={onCellClick} >
            {/* <h1  className='Cell'> {title} </h1> */}
            <ModalProvider>
                <ModalButton style={{backgroundColor:color}}>
                <p style={{}}>{title}</p>
                <Modal text={"с шампунем"} title={"помой голову"} id={5} progress={isFinished} setConfirmed={() => {finishTask(); setIsFinished()}}/>

                </ModalButton>
            </ModalProvider>

        </div>
    )
}
