import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import LineupBuilder from './pages/LineupBuilder'
import DrawSimulator from './pages/DrawSimulator'
import ManualDraw from './pages/ManualDraw'
import GroupStage from './pages/GroupStage'
import KnockoutStage from './pages/KnockoutStage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
{/* <Route path="/lineup" element={<LineupBuilder />} /> */}
          <Route path="/draw" element={<DrawSimulator />} />
          <Route path="/manual-draw" element={<ManualDraw />} />
          <Route path="/group-stage" element={<GroupStage />} />
          <Route path="/knockout" element={<KnockoutStage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
