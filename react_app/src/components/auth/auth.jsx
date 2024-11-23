import {useRef, useEffect, useState} from 'react';
import { BASE } from '../../../links';


export default function Auth({setAuthirized}) {
    const inputRef = useRef(null);
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
            const response = await axios.get(`${BASE}/get_code/${code}`, {});
// TODO: обращение к апи
            console.log(response)
            alert()
            setAuthirized()
            // removeAuthBlock()
            localStorage.setItem("my_code", code)
            setInputValue("true")
                
            
            
            
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
                        type="text"
                        name="password"
                        placeholder="ваш код"
                        // aria-label="Password"
                        ref={inputRef}
                        autoComplete="current-password"
                        area-invalid={inputValue}
                        required
                        // onInput={(e) => setCode(e.target.value)}
                    />
                    <button type="submit" onClick={chechCode(inputRef.current)}>
                    Вход
                    </button>
                </form>
            {/* // </main> */}
            </div>
    )
}
