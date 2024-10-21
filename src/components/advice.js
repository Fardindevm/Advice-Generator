import { useEffect, useState } from 'react'
import './advice.css'
import dice from '../images/icon-dice.svg'
import divide from '../images/pattern-divider-desktop.svg'
import LoadingScreen from './loadingComp.js'
import Error from './error.js'

export default function Advice () {

  const [adviceId, setAdvicerId] = useState()
  const [advice, setAdvice] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  // add texts from 4 directions and make a array for classNames and use Math.random to choose from one and apply it on text classNames
  const [animationIndex, setAnimationIndex] = useState(0)
  const animationCLasses = ["animationUp", "animationDown", "animationRight", "animationLeft"]
  
  // setting animation when user come to our page again. don't forget to add key.
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden) {
        setTriggerAnimation(prev => !prev);
        setAnimationIndex(Math.floor(Math.random() * 4))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const getAdvice = async() => {
    let newRandomIndex;
    do {
      newRandomIndex = Math.floor(Math.random() * 4);
    } while (newRandomIndex === animationIndex);

    setAnimationIndex(newRandomIndex)
    setIsLoading(true);
    
    try {
    let response = await fetch("https://api.adviceslip.com/advice", { cache: "no-cache" }) // cache: "no-cache" for firefox bug
    let data = await response.json();
    setAdvicerId(data.slip.id)
    setAdvice(data.slip.advice)
    setError(false)

    } catch {
      setError(true)
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    getAdvice()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    {isLoading ? (
      <LoadingScreen /> 
    ) : error ? (
      <Error setError={setError} getAdvice={getAdvice}/>
    ) : (
    <div className='wrapper'>
      <div className='advice-wrapper'>
        <p id='advice-id' className={`advice-id 
          ${!isLoading? animationCLasses[animationIndex]: ""}`}
          key={`id-${triggerAnimation}`}>
            ADVICE <span style={{fontStyle: "italic", fontSize: "13.6px"}}>#</span>{adviceId}</p>
        <p className={`advice 
          ${!isLoading? animationCLasses[animationIndex]: ""}`}
          key={`advice-${triggerAnimation}`}>
            “{advice}”</p>
      </div>
      <img src={divide} alt='divice' className='divide'/>
      <button className='dice-button' onClick={() => getAdvice()}>
        <img src={dice} alt='dice'/>
      </button>
    </div>
    )}
    </>
  )
}