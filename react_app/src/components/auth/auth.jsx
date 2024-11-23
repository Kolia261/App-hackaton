import {useRef, useEffect, useState} from 'react';
// import {mainStyles} from "./main.scss";

export default function Auth({setAuthirized}) {
    const [code, setCode] = useState('')
    const [inputValue, setInputValue] = useState("false")

    const removeAuthBlock = () => {
        const authBlock = document.getElementById('auth_block');
        
        if (authBlock) {
          authBlock.remove();
          console.log('Блок auth_block был успешно удален');
        } else {
          console.log('Элемент с id auth_block не найден');
        }
    };

    const chechCode = async (code) => {
        if (code == "") {
            return
        }
        try {
            // const response = await axios.get('https://your-api-endpoint.com/data', {});
// TODO: обращение к апи
            if (code === "1111") {

                setAuthirized()
                removeAuthBlock()
                localStorage.setItem("my_code", code)
                setInputValue("true")
                
            }
            
            
          } catch (err) {
            setInputValue("false")
          }
    }


    const mainRef = useRef();
    useEffect(() => {
        // const setMinHeight = () => {
        // if (!mainRef.current) return;
        // mainRef.current.style.minHeight = `${window.innerHeight}px`;
        // };
        // setMinHeight();
        // window.addEventListener("resize", setMinHeight);
        // return () => {
        // window.removeEventListener("resize", setMinHeight);
        
        if (localStorage.getItem("my_code") != null) {
            chechCode(localStorage.getItem("my_code"))
        }
        
    // };
    }, []);

    return (
        <div id='auth_block'>
            {/* // <main ref={mainRef}> */}
                <h1>Авторизируйся</h1>

                <form>
                    <input
                        type="password"
                        name="password"
                        placeholder="ваш код"
                        aria-label="Password"
                        autoComplete="current-password"
                        area-invalid={inputValue}
                        required
                    />
                    <button type="submit" onClick={chechCode}>
                    Вход
                    </button>
                </form>
            {/* // </main> */}
            </div>
    )
}
