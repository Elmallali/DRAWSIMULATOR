import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDrawStore } from '../store/drawStore'
import { useTournamentStore } from '../store/tournamentStore'
import { simulateDraw, POTS, CONFEDERATIONS } from '../utils/drawAlgorithm'
import { Trophy, Shuffle, RotateCcw, ChevronRight, Download, FileImage, FileJson } from 'lucide-react'
import html2canvas from 'html2canvas'

const confederationColors = {
  [CONFEDERATIONS.UEFA]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [CONFEDERATIONS.CONMEBOL]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [CONFEDERATIONS.CONCACAF]: 'bg-red-500/20 text-red-300 border-red-500/30',
  [CONFEDERATIONS.CAF]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [CONFEDERATIONS.AFC]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [CONFEDERATIONS.OFC]: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'TBD': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

function DrawSimulator() {
  const navigate = useNavigate()
  const { currentStep, groups, setStep, setGroups, resetDraw } = useDrawStore()
  const { setGroups: setTournamentGroups } = useTournamentStore()
  const [isDrawing, setIsDrawing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const groupsRef = useRef(null)

  const handleSimulateDraw = () => {
    setIsDrawing(true)
    
    // Simulate drawing animation
    setTimeout(() => {
      const result = simulateDraw()
      setGroups(result)
      // Also set in tournament store for progression
      setTournamentGroups(result)
      setIsDrawing(false)
    }, 1500)
  }

  const handleContinueToGroupStage = () => {
    navigate('/group-stage')
  }

  const handleReset = () => {
    if (window.confirm('Reset the draw and start over?')) {
      resetDraw()
    }
  }

  const handleDownloadImage = async () => {
    if (!groupsRef.current || !groups) return
    
    setIsDownloading(true)
    
    try {
      const canvas = await html2canvas(groupsRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
      })
      
      const link = document.createElement('a')
      link.download = `FIFA-World-Cup-2026-Draw-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Failed to download image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadJSON = () => {
    if (!groups) return
    
    const drawData = {
      tournament: 'FIFA World Cup 2026',
      date: new Date().toISOString(),
      groups: groups.map(group => ({
        group: group.name,
        teams: group.teams.map(team => ({
          name: team.name,
          confederation: team.confederation,
          host: team.host || false,
          placeholder: team.placeholder || false,
        }))
      }))
    }
    
    const blob = new Blob([JSON.stringify(drawData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = `FIFA-World-Cup-2026-Draw-${new Date().toISOString().split('T')[0]}.json`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleDownloadText = () => {
    if (!groups) return
    
    let textContent = '═══════════════════════════════════════════════\n'
    textContent += '     FIFA WORLD CUP 2026™ - OFFICIAL DRAW\n'
    textContent += '═══════════════════════════════════════════════\n'
    textContent += `Date: ${new Date().toLocaleDateString()}\n`
    textContent += `48 Teams • 12 Groups • 4 Teams per Group\n`
    textContent += '═══════════════════════════════════════════════\n\n'
    
    groups.forEach(group => {
      textContent += `┌─────────────────────────────────────────────┐\n`
      textContent += `│  GROUP ${group.name}                                     │\n`
      textContent += `├─────────────────────────────────────────────┤\n`
      
      group.teams.forEach((team, index) => {
        const position = index + 1
        const hostBadge = team.host ? ' [HOST]' : ''
        const placeholderBadge = team.placeholder ? ' [PLAYOFF]' : ''
        const teamLine = `${position}. ${team.name}${hostBadge}${placeholderBadge}`
        const confLine = `(${team.confederation})`
        textContent += `│  ${teamLine.padEnd(35)} ${confLine.padEnd(8)}│\n`
      })
      
      textContent += `└─────────────────────────────────────────────┘\n\n`
    })
    
    textContent += '═══════════════════════════════════════════════\n'
    textContent += 'CONFEDERATION DISTRIBUTION:\n'
    textContent += '═══════════════════════════════════════════════\n'
    
    const confStats = {}
    groups.forEach(group => {
      group.teams.forEach(team => {
        confStats[team.confederation] = (confStats[team.confederation] || 0) + 1
      })
    })
    
    Object.entries(confStats).sort((a, b) => b[1] - a[1]).forEach(([conf, count]) => {
      textContent += `${conf.padEnd(15)}: ${count} teams\n`
    })
    
    textContent += '═══════════════════════════════════════════════\n'
    
    const blob = new Blob([textContent], { type: 'text/plain' })
    const link = document.createElement('a')
    link.download = `FIFA-World-Cup-2026-Draw-${new Date().toISOString().split('T')[0]}.txt`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-fifa-blue-400 to-fifa-gold-400 bg-clip-text text-transparent">
          FIFA World Cup 2026 Official Draw
        </h1>
        <p className="text-white/70">48 Teams • 12 Groups • Authentic Rules</p>
      </div>

      {/* Stepper */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-fifa-gold-400' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 1 ? 'bg-fifa-gold-500' : 'bg-white/20'
            }`}>
              1
            </div>
            <span className="font-medium">View Pots</span>
          </div>
          
          <ChevronRight className="w-5 h-5 text-white/50" />
          
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-fifa-gold-400' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 2 ? 'bg-fifa-gold-500' : 'bg-white/20'
            }`}>
              2
            </div>
            <span className="font-medium">Simulate Draw</span>
          </div>
          
          <ChevronRight className="w-5 h-5 text-white/50" />
          
          <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-fifa-gold-400' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              currentStep >= 3 ? 'bg-fifa-gold-500' : 'bg-white/20'
            }`}>
              3
            </div>
            <span className="font-medium">View Groups</span>
          </div>
        </div>
      </div>

      {/* Step 1: View Pots */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(POTS).map(([potName, teams]) => (
              <div key={potName} className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4 text-fifa-gold-400 capitalize">
                  {potName.replace('pot', 'Pot ')}
                </h2>
                <div className="space-y-2">
                  {teams.map((team, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        confederationColors[team.confederation]
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{team.name}</span>
                        {team.host && (
                          <span className="px-2 py-0.5 bg-fifa-gold-500/30 text-fifa-gold-300 text-xs rounded-full">
                            HOST
                          </span>
                        )}
                      </div>
                      <span className="text-xs opacity-70">{team.confederation}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-fifa-blue-600 hover:bg-fifa-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              Continue to Draw
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Draw Mode */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="glass-card p-12 text-center">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-fifa-gold-400" />
            <h2 className="text-3xl font-bold mb-4">Choose Draw Mode</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Select how you want to conduct the draw. Both modes follow official FIFA rules.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Automatic Draw */}
            <div className="glass-card p-8 hover:scale-105 transition-transform cursor-pointer" onClick={handleSimulateDraw}>
              <div className="text-center">
                <Shuffle className={`w-16 h-16 mx-auto mb-4 text-fifa-blue-400 ${isDrawing ? 'animate-spin' : ''}`} />
                <h3 className="text-2xl font-bold mb-3">Automatic Draw</h3>
                <p className="text-white/70 mb-6">
                  Let the system automatically conduct the draw following FIFA rules. Quick and random.
                </p>
                <button
                  disabled={isDrawing}
                  className={`w-full px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                    isDrawing
                      ? 'bg-fifa-blue-500/50 cursor-not-allowed'
                      : 'bg-fifa-blue-600 hover:bg-fifa-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isDrawing ? 'Drawing...' : 'Start Automatic Draw'}
                </button>
              </div>
            </div>

            {/* Manual Draw */}
            <div className="glass-card p-8 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/manual-draw')}>
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-fifa-gold-400" />
                <h3 className="text-2xl font-bold mb-3">Manual Draw</h3>
                <p className="text-white/70 mb-6">
                  Create your own draw by dragging teams into groups. Full control with FIFA rule validation.
                </p>
                <button className="w-full px-8 py-3 bg-fifa-gold-600 hover:bg-fifa-gold-700 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl">
                  Start Manual Draw
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setStep(1)}
              className="text-white/70 hover:text-white transition-colors"
            >
              ← Back to Pots
            </button>
          </div>
        </div>
      )}

      {/* Step 3: View Groups */}
      {currentStep === 3 && groups && (
        <div className="space-y-6">
          {/* Download Buttons */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Draw Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="px-4 py-3 bg-fifa-blue-600 hover:bg-fifa-blue-700 disabled:bg-fifa-blue-600/50 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FileImage className="w-5 h-5" />
                {isDownloading ? 'Generating...' : 'Download as PNG'}
              </button>
              
              <button
                onClick={handleDownloadJSON}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <FileJson className="w-5 h-5" />
                Download as JSON
              </button>
              
              <button
                onClick={handleDownloadText}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download as TXT
              </button>
            </div>
          </div>

          <div ref={groupsRef} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group) => (
              <div key={group.name} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fifa-blue-500 to-fifa-gold-500 flex items-center justify-center font-bold text-lg">
                    {group.name}
                  </div>
                  <h3 className="text-xl font-bold">Group {group.name}</h3>
                </div>
                
                <div className="space-y-2">
                  {group.teams.map((team, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg border text-sm ${
                        confederationColors[team.confederation]
                      }`}
                    >
                      <div className="font-semibold">{team.name}</div>
                      <div className="text-xs opacity-70">{team.confederation}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleContinueToGroupStage}
              className="px-12 py-4 bg-gradient-to-r from-fifa-blue-600 to-fifa-gold-600 hover:from-fifa-blue-700 hover:to-fifa-gold-700 rounded-lg font-bold text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
            >
              Continue to Group Stage
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              New Draw
            </button>
          </div>

          {/* Legend */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Confederation Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(CONFEDERATIONS).map(([key, value]) => (
                <div
                  key={key}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                    confederationColors[value]
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DrawSimulator
