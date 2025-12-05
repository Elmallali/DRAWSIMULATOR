import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Trophy } from 'lucide-react'

function Navbar() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="glass-card mx-4 mt-4 mb-8 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <Trophy className="w-8 h-8 text-fifa-gold-400" />
          <span className="bg-gradient-to-r from-fifa-gold-400 to-fifa-gold-600 bg-clip-text text-transparent">
            WC 2026 HQ
          </span>
        </Link>
        
        <div className="flex gap-4">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive('/')
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          
{/* <Link
            to="/lineup"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive('/lineup')
                ? 'bg-pitch-green-600 text-white'
                : 'text-white/70 hover:text-white hover:bg-pitch-green-600/50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Tactical Board</span>
          </Link> */}
          
          <Link
            to="/draw"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive('/draw')
                ? 'bg-fifa-blue-600 text-white'
                : 'text-white/70 hover:text-white hover:bg-fifa-blue-600/50'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Official Draw</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
