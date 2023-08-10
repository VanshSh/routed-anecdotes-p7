import { useState } from 'react'
import { Link, Routes, Route, useMatch, useNavigate } from 'react-router-dom'
import { useField } from './hooks/index'

const Menu = () => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <div>
      <Link to='/' style={padding}>
        anecdotes
      </Link>
      <Link to='create' style={padding}>
        create new
      </Link>
      <Link to='about' style={padding}>
        about
      </Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

const SingleAnecdoteContent = ({ anecdote }) => (
  <div>
    {anecdote?.content}
    <br />
    has: {anecdote?.votes}
  </div>
)
const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    See{' '}
    <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{' '}
    for the source code.
  </div>
)

const CreateNew = (props) => {
  const contenetInput = useField('text')
  const authorInput = useField('text')
  const urlInput = useField('url')

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: contenetInput.value,
      author: authorInput.value,
      info: urlInput.value,
      votes: 0,
    })
  }

  const clearInputValues = (e) => {
    e.preventDefault()
    contenetInput.clear()
    authorInput.clear()
    urlInput.clear()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            type={contenetInput.type}
            name='content'
            value={contenetInput.value}
            onChange={contenetInput.onChange}
          />
        </div>
        <div>
          author
          <input
            name='author'
            value={authorInput.value}
            type={authorInput.type}
            onChange={authorInput.onChange}
          />
        </div>
        <div>
          url for more info
          <input
            name='url'
            value={urlInput.value}
            type={urlInput.type}
            onChange={urlInput.onChange}
          />
        </div>
        <button>create</button>
        <button onClick={clearInputValues}>reset</button>
      </form>
    </div>
  )
}

const App = () => { 
  const navigate = useNavigate()

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    navigate('/')
    toShowNotifications(`a new anecdote ${anecdote.content} created`)
  }

  function toShowNotifications(message) {
    setNotification(message)
    setTimeout(() => {
      setNotification('')
    }, 1500)
  }

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)))
  }
  const anecdoteById = (id) => anecdotes.find((a) => a.id === id)
  const match = useMatch('/anecdotes/:id')
  const anecdote =
    match &&
    anecdotes.find((anecdotById) => anecdotById.id === Number(match?.params.id))

  return (
    <div>
      <h1>Software anecdotes</h1>
      {notification && <p>{notification}</p>}
      <Menu />
      <Routes>
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path='about' element={<About />} />
        <Route path='create' element={<CreateNew addNew={addNew} />} />
        <Route
          path='/anecdotes/:id'
          element={<SingleAnecdoteContent anecdote={anecdote} />}
        />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
