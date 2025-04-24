import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Manager />
      <div className="fixed left-0 bottom-0 w-full bg-slate-900 text-white text-center p-1">
        <Footer />
      </div>
    </>
  )
}

export default App
