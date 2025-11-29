import { useState, useRef } from 'react'
import { DndContext, useDraggable, DragOverlay } from '@dnd-kit/core'
import { useLineupStore } from '../store/lineupStore'
import { FORMATIONS, KIT_COLORS } from '../utils/formations'
import PlayerEditorModal from '../components/PlayerEditorModal'
import { RotateCcw, Save, Download, Palette } from 'lucide-react'
import html2canvas from 'html2canvas'

function DraggablePlayer({ player, isDragging, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: player.id,
    data: player,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onClick(player)
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${player.left}%`,
        top: `${player.top}%`,
        transform: 'translate(-50%, -50%)',
        ...style,
      }}
      className={`${isDragging ? 'opacity-50' : ''} transition-all duration-300`}
    >
      <div className="flex flex-col items-center">
        <div 
          {...listeners}
          {...attributes}
          className="w-14 h-14 rounded-full border-3 border-white shadow-xl flex flex-col items-center justify-center text-white font-bold hover:scale-110 transition-transform cursor-grab active:cursor-grabbing"
          style={{ backgroundColor: player.color }}
          onDoubleClick={handleClick}
        >
          <span className="text-lg leading-none pointer-events-none">
            {player.number || '?'}
          </span>
        </div>
        <span 
          onClick={handleClick}
          className="mt-1 text-xs font-semibold text-white bg-black/70 px-2 py-0.5 rounded whitespace-nowrap cursor-pointer hover:bg-black/90 transition-colors"
        >
          {player.name || 'Click to edit'}
        </span>
      </div>
    </div>
  )
}

function LineupBuilder() {
  const { teamName, formation, players, setTeamName, setFormation, updatePlayerPosition, updatePlayerData, resetLineup } = useLineupStore()
  const [activeId, setActiveId] = useState(null)
  const [saved, setSaved] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [teamKitColor, setTeamKitColor] = useState(players[0]?.color || KIT_COLORS[1].value)
  const pitchRef = useRef(null)

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, delta } = event
    
    if (delta.x !== 0 || delta.y !== 0) {
      const player = players.find(p => p.id === active.id)
      if (player && pitchRef.current) {
        const pitchRect = pitchRef.current.getBoundingClientRect()
        const deltaLeftPercent = (delta.x / pitchRect.width) * 100
        const deltaTopPercent = (delta.y / pitchRect.height) * 100
        
        let newLeft = player.left + deltaLeftPercent
        let newTop = player.top + deltaTopPercent
        
        // Constrain to pitch boundaries
        newLeft = Math.max(5, Math.min(95, newLeft))
        newTop = Math.max(5, Math.min(95, newTop))
        
        updatePlayerPosition(active.id, newTop, newLeft)
      }
    }
    
    setActiveId(null)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePlayerClick = (player) => {
    setEditingPlayer(player)
  }

  const handleSavePlayer = (data) => {
    if (editingPlayer) {
      updatePlayerData(editingPlayer.id, data)
    }
  }

  const handleDownloadImage = async () => {
    if (!pitchRef.current) return
    
    setIsDownloading(true)
    
    try {
      const canvas = await html2canvas(pitchRef.current, {
        backgroundColor: '#166534',
        scale: 2,
        logging: false,
      })
      
      const link = document.createElement('a')
      link.download = `${teamName.replace(/\s+/g, '-')}-${formation}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Failed to download image:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleTeamColorChange = (color) => {
    setTeamKitColor(color)
    // Update all players with the new color
    players.forEach(player => {
      updatePlayerData(player.id, { color })
    })
  }

  const activePlayer = activeId ? players.find(p => p.id === activeId) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-pitch-green-400">Team Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-pitch-green-400 transition-colors"
                  placeholder="Enter team name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Formation</label>
                <select
                  value={formation}
                  onChange={(e) => setFormation(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-pitch-green-400 transition-colors cursor-pointer"
                >
                  {Object.keys(FORMATIONS).map((key) => (
                    <option key={key} value={key} className="bg-slate-800">
                      {FORMATIONS[key].name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Palette className="w-4 h-4" />
                  Team Kit Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {KIT_COLORS.map((kitColor) => (
                    <button
                      key={kitColor.value}
                      onClick={() => handleTeamColorChange(kitColor.value)}
                      className={`relative h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                        teamKitColor === kitColor.value
                          ? 'border-pitch-green-400 shadow-lg shadow-pitch-green-400/50'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: kitColor.value }}
                      title={kitColor.name}
                    >
                      {teamKitColor === kitColor.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Applies to all players
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleSave}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-pitch-green-600 hover:bg-pitch-green-700 text-white'
                }`}
              >
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Lineup'}
              </button>
              
              <button
                onClick={resetLineup}
                className="w-full px-4 py-2 bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/30 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Positions
              </button>
              
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isDownloading
                    ? 'bg-fifa-blue-500/50 cursor-not-allowed'
                    : 'bg-fifa-blue-600 hover:bg-fifa-blue-700'
                }`}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download Image'}
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-2">Instructions</h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li>• Click name label to edit player</li>
              <li>• Drag token to reposition player</li>
              <li>• Double-click token to edit player</li>
              <li>• Your lineup auto-saves</li>
            </ul>
          </div>
        </div>

        {/* Pitch */}
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            <span className="text-pitch-green-400">{teamName}</span> - {formation}
          </h1>
          
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div
              ref={pitchRef}
              className="relative mx-auto bg-gradient-to-br from-pitch-green-700 to-pitch-green-800 rounded-lg shadow-2xl overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '800px',
                aspectRatio: '4/3',
              }}
            >
              {/* Pitch Markings */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
                {/* Outer lines */}
                <rect x="20" y="20" width="760" height="560" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
                
                {/* Center line */}
                <line x1="20" y1="300" x2="780" y2="300" stroke="white" strokeWidth="2" opacity="0.6" />
                
                {/* Center circle */}
                <circle cx="400" cy="300" r="60" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                <circle cx="400" cy="300" r="3" fill="white" opacity="0.6" />
                
                {/* Penalty areas */}
                <rect x="280" y="20" width="240" height="100" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                <rect x="280" y="480" width="240" height="100" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                
                {/* Goal areas */}
                <rect x="340" y="20" width="120" height="40" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                <rect x="340" y="540" width="120" height="40" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
                
                {/* Penalty spots */}
                <circle cx="400" cy="80" r="3" fill="white" opacity="0.6" />
                <circle cx="400" cy="520" r="3" fill="white" opacity="0.6" />
              </svg>
              
              {/* Players */}
              {players.map((player) => (
                <DraggablePlayer
                  key={player.id}
                  player={player}
                  isDragging={activeId === player.id}
                  onClick={handlePlayerClick}
                />
              ))}
              
              <DragOverlay>
                {activePlayer ? (
                  <div className="flex flex-col items-center opacity-80">
                    <div 
                      className="w-14 h-14 rounded-full border-3 border-white shadow-xl flex flex-col items-center justify-center text-white font-bold"
                      style={{ backgroundColor: activePlayer.color }}
                    >
                      <span className="text-lg">
                        {activePlayer.number || '?'}
                      </span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </div>
          </DndContext>
        </div>
      </div>
      
      {/* Player Editor Modal */}
      {editingPlayer && (
        <PlayerEditorModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={handleSavePlayer}
        />
      )}
    </div>
  )
}

export default LineupBuilder
