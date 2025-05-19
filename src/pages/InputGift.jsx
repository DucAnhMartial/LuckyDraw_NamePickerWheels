import { useState } from 'react'

function InputGift() {

  const [gift, setGift] = useState('')
  const [gifts, setGifts] = useState([])

  const handleClick = () => {
    if (!gift.trim() )
    {
      return
    }
    setGifts((prev) => [...prev, {
      uuid: `${Math.random()}`,
      name: gift
    }])
    setGift('')
  }
  // console.log(gift)
  // console.log(gifts)


  return (
    <>
      <input placeholder='Enter your gift.'
        value={gift}
        onChange={(e) => setGift(e.target.value)}
      />
      <button
        onClick={handleClick}
      >
        Submit
      </button> <br></br>
      {gifts.map((gift) => (
        <li key={gift.uuid}>{gift.name}</li>
      ))}
    </>
  )
}

export default InputGift