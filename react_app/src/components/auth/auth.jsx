import {useRef, useEffect, useState} from 'react';
import { BASE } from '../../../links';
// import image from "../auth/qr"


const codes = [
    "Hk5eea",
    ""
]


export default function Auth({setAuthirized}) {
    const inputRef = useRef();
    const [inputValue, setInputValue] = useState("false")


    function showGrid() {
        const gridElement = document.getElementById("cells");
        
        if (gridElement) {
          gridElement.style.visability = 'inert';
        } else {
          console.warn('Элемент с классом .grid не найден');
        }
    }

    async function chechCode(code) {
        if (code == "") {
            return
        }
// HUH
        try {
            const response = await fetch(`${BASE}/get_code/${code}`, {
              method: 'GET',
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const result = await response.json();
            showGrid()

            setAuthirized(result.users[0])
            
            
                        localStorage.setItem("my_code", code)
                        localStorage.setItem("user_id", result.users[0])
        } catch (error) {
            console.error('Ошибка при обновлении задачи:', error);
        }
        
    }


    const mainRef = useRef();
    useEffect(() => {
        
        if (localStorage.getItem("my_code") != null) {
            chechCode(localStorage.getItem("my_code"))
        }
        
    }, []);


    const handleClick = () => {
        chechCode(inputRef.current.value)
    };

    return (
        <div id='auth_block' style={{display:"flex", width:"100%", height:"100%", flexDirection:"row", justifyContent:"center", zIndex:999}}>
            <div style={{position:"absolute", top:"30%"}}>
                            <h1>Авторизируйся</h1>

                <form>
                    <input
                        type="text"
                        name="code"
                        placeholder="ваш код"
                        // aria-label="Password"
                        ref={inputRef}
                        autoComplete="current-password"
                        area-invalid={inputValue}
                        required
                        // onInput={(e) => setCode(e.target.value)}
                    />
                    <button type="submit" onClick={handleClick}>
                    Вход
                    </button>


                </form>
                    <img style={{width:"350px"}} src={"https://i.ibb.co/x11N0Zq/IMG-20241124-133930-945.jpg"} alt="qr code" />
                </div>

            </div>
    )
}
