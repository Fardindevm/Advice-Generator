import './error.css'

export default function Error ({setError, getAdvice}) {

  const handleButton =() => {
    setError(false)
    getAdvice()
  }
  return (
    <div className='error-screen'>
      <div className='error-div'>
        <p>An error occurred while fetching advice. Please check your internet connection.</p>
        <button type="button"className='try-again-button' onClick={() => handleButton()}>Try again</button>
      </div>
    </div>
  )
} 