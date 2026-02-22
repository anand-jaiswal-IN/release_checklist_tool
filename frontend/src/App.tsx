import './App.css'
import { Routes, Route } from 'react-router-dom'
import {Home, NewReleaseForm} from './components'
import ViewRelease from './components/release/ViewRelease'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/releases/new" element={<NewReleaseForm />} />
      <Route path="/releases/:id" element={<ViewRelease />} />
    </Routes>
  )
}

export default App
