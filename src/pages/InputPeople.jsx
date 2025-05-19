import { useState } from 'react'

function InputPeople() {

  const [name, setName] = useState('')
  const [people, setPeople] = useState([])

  const handleClick = () => {
    if (!name.trim() )
    {
      return
    }
    setPeople((prev) => [...prev, {
      uuid: `${Math.random()}`,
      name: name
    }])
    setName('')

  }
  //console.log(name)
  //console.log(people)


  return (
    <>
      <input placeholder='Enter your name.'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleClick}
      >
        Submit
      </button> <br></br>
      {people.map((person) => (
        <li key={person.uuid}>{person.name}</li>
      ))}
    </>
  )
}

export default InputPeople