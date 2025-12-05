import { useNavigate } from 'react-router-dom'
import { Users, Trophy, RotateCcw } from 'lucide-react'

function Home() {
  const navigate = useNavigate()

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all saved data?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-fifa-gold-400 via-white to-fifa-blue-400 bg-clip-text text-transparent">
          World Cup 2026 Command Center
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Your ultimate toolkit for tactical planning and tournament simulation
        </p>
      </div>

      {/* Selection Cards */}
      <div className="flex justify-center mb-16">
        <div className="max-w-md w-full">
{/* Tactical Board Card */}
        {/* <div
          onClick={() => navigate('/lineup')}
          className="glass-card glass-card-hover p-8 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pitch-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pitch-green-500/20 flex items-center justify-center group-hover:bg-pitch-green-500/30 transition-colors duration-300">
              <Users className="w-10 h-10 text-pitch-green-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-center group-hover:text-pitch-green-400 transition-colors duration-300">
              Tactical Board
            </h2>
            
            <p className="text-white/70 text-center mb-6">
              Build your dream lineup with drag-and-drop functionality. Choose formations, position players, and save your tactical masterpiece.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-pitch-green-500/20 rounded-full text-sm text-pitch-green-300">
                Drag & Drop
              </span>
              <span className="px-3 py-1 bg-pitch-green-500/20 rounded-full text-sm text-pitch-green-300">
                Formations
              </span>
              <span className="px-3 py-1 bg-pitch-green-500/20 rounded-full text-sm text-pitch-green-300">
                Auto-Save
              </span>
            </div>
          </div>
        </div> */}

        {/* Official Draw Card */}
        <div
          onClick={() => navigate('/draw')}
          className="glass-card glass-card-hover p-8 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fifa-blue-500/20 via-fifa-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-fifa-blue-500/20 to-fifa-gold-500/20 flex items-center justify-center group-hover:from-fifa-blue-500/30 group-hover:to-fifa-gold-500/30 transition-colors duration-300">
              <Trophy className="w-10 h-10 text-fifa-gold-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-center group-hover:text-fifa-gold-400 transition-colors duration-300">
              The Official Draw
            </h2>
            
            <p className="text-white/70 text-center mb-6">
              Simulate the World Cup 2026 draw with authentic rules. 48 teams, 12 groups, confederation constraints, and realistic pot distribution.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-fifa-blue-500/20 rounded-full text-sm text-fifa-blue-300">
                48 Teams
              </span>
              <span className="px-3 py-1 bg-fifa-gold-500/20 rounded-full text-sm text-fifa-gold-300">
                12 Groups
              </span>
              <span className="px-3 py-1 bg-fifa-blue-500/20 rounded-full text-sm text-fifa-blue-300">
                Real Rules
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Reset Data Section */}
      <div className="text-center">
        <button
          onClick={handleResetData}
          className="glass-card px-6 py-3 inline-flex items-center gap-2 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Data</span>
        </button>
      </div>
    </div>
  )
}

export default Home
