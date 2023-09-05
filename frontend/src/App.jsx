import Note from './components/Note'
import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import noteServices from './services/notes'

const Notification = ({ message }) => (
  message?
    <div className='error'>
      {message}
    </div>
    :''
  )

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('Add a new note')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(()=>{
    noteServices.getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  },[])
  
  const addNote = (event) =>{
    event.preventDefault()
    const newObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    noteServices.create(newObject)
    .then(returnedNote=>{
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }
  
  const handleNoteChange = (event)=>{
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id)=>{
    const note = notes.find(n=>n.id===id)
    const changedNote = {...note, important: !note.important}

    noteServices.update(id, changedNote)
    .then(returnedNote=>{
      setNotes(notes.map(n=>n.id===id?returnedNote:n))
    }).catch(error=>{
      setErrorMessage(`Note '${note.content}' was already removed from server`)
      setTimeout(()=>setErrorMessage(''),5000)
      setNotes(notes.filter(n=>n.id!==id))
    }
    )
  }


  

  const notesToShow = showAll? notes : notes.filter(note => note.important)
  return (
    
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll?'important':'all'}
      </button>
      <ul>
        {notesToShow.map(note => (
          <Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input type="text"  value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>Save</button>
      </form>

      <Footer />

    </div>
  )
}

export default App