import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { useTournamentStore } from '../store/tournamentStore'
import { POTS, CONFEDERATIONS } from '../utils/drawAlgorithm'
import { Trophy, AlertCircle, CheckCircle, ChevronRight, RotateCcw } from 'lucide-react'

const confederationColors = {
  [CONFEDERATIONS.UEFA]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [CONFEDERATIONS.CONMEBOL]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [CONFEDERATIONS.CONCACAF]: 'bg-red-500/20 text-red-300 border-red-500/30',
  [CONFEDERATIONS.CAF]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [CONFEDERATIONS.AFC]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [CONFEDERATIONS.OFC]: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
}

function DraggableTeam({ team, isPlaced }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: team.name,
    data: team,
    disabled: isPlaced,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-2 rounded-lg border ${
        confederationColors[team.confederation]
      } ${
        isPlaced
          ? 'opacity-30 cursor-not-allowed'
          : 'cursor-grab active:cursor-grabbing hover:scale-105'
      } ${isDragging ? 'opacity-50' : ''} transition-all text-sm`}
    >
      <div className="font-semibold">{team.name}</div>
      <div className="text-xs opacity-70">{team.confederation}</div>
      {team.host && (
        <div className="text-xs bg-fifa-gold-500/30 text-fifa-gold-300 px-1 rounded mt-1">
          HOST
        </div>
      )}
    </div>
  )
}

function GroupSlot({ groupName, position, team, onDrop, validationError }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${groupName}-${position}`,
    data: { groupName, position },
  })

  return (
    <div
      ref={setNodeRef}
      className={`p-3 rounded-lg border-2 border-dashed min-h-[80px] transition-all ${
        isOver
          ? validationError
            ? 'border-red-500 bg-red-500/10'
            : 'border-fifa-gold-500 bg-fifa-gold-500/10'
          : team
          ? 'border-white/30 bg-white/5'
          : 'border-white/20 bg-white/5'
      }`}
    >
      {team ? (
        <div className={`p-2 rounded-lg border ${confederationColors[team.confederation]}`}>
          <div className="font-semibold text-sm">{team.name}</div>
          <div className="text-xs opacity-70">{team.confederation}</div>
          {team.host && (
            <div className="text-xs bg-fifa-gold-500/30 text-fifa-gold-300 px-1 rounded mt-1">
              HOST
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-white/30 text-xs">
          Position {position + 1}
          <br />
          Drop team here
        </div>
      )}
      {validationError && isOver && (
        <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {validationError}
        </div>
      )}
    </div>
  )
}

function ManualDraw() {
  const navigate = useNavigate()
  const { setGroups: setTournamentGroups } = useTournamentStore()
  
  // Initialize groups with hosts pre-placed
  const [groups, setGroups] = useState(() => {
    const initialGroups = {}
    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    
    groupNames.forEach((name) => {
      initialGroups[name] = [null, null, null, null]
    })
    
    // Pre-place hosts according to FIFA rules
    const mexico = POTS.pot1.find((t) => t.name === 'Mexico')
    const usa = POTS.pot1.find((t) => t.name === 'USA')
    const canada = POTS.pot1.find((t) => t.name === 'Canada')
    
    initialGroups['A'][0] = mexico
    initialGroups['B'][0] = usa
    initialGroups['D'][0] = canada
    
    return initialGroups
  })

  const [activeTeam, setActiveTeam] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [currentPot, setCurrentPot] = useState('pot1') // Current pot being placed

  // Get teams for current pot that haven't been placed yet
  const getCurrentPotTeams = () => {
    const placedTeams = new Set()
    Object.values(groups).forEach((group) => {
      group.forEach((team) => {
        if (team) placedTeams.add(team.name)
      })
    })

    return POTS[currentPot].filter((team) => !placedTeams.has(team.name))
  }

  // Check if current pot is complete
  const isCurrentPotComplete = () => {
    return getCurrentPotTeams().length === 0
  }

  // Move to next pot
  const moveToNextPot = () => {
    const potOrder = ['pot1', 'pot2', 'pot3', 'pot4']
    const currentIndex = potOrder.indexOf(currentPot)
    if (currentIndex < potOrder.length - 1) {
      setCurrentPot(potOrder[currentIndex + 1])
    }
  }

  // Get pot progress
  const getPotProgress = () => {
    const potOrder = ['pot1', 'pot2', 'pot3', 'pot4']
    return {
      current: potOrder.indexOf(currentPot) + 1,
      total: potOrder.length,
      potName: currentPot.replace('pot', 'Pot '),
    }
  }

  // Get pot name for a team
  const getTeamPot = (team) => {
    for (const [potName, teams] of Object.entries(POTS)) {
      if (teams.some((t) => t.name === team.name)) {
        return potName
      }
    }
    return null
  }

  // Validate if a team can be placed in a group
  const canPlaceTeam = (team, groupName) => {
    const group = groups[groupName]
    
    // Check if group is full
    if (group.every((slot) => slot !== null)) {
      return { valid: false, error: 'Group is full' }
    }

    // Check if team from same pot already exists in group
    const teamPot = getTeamPot(team)
    const hasSamePotTeam = group.some((t) => {
      if (!t) return false
      const tPot = getTeamPot(t)
      return tPot === teamPot
    })
    
    if (hasSamePotTeam) {
      return { valid: false, error: `Already has a team from ${teamPot}` }
    }

    // Count confederation teams in group
    const confederationCount = group.filter(
      (t) => t && t.confederation === team.confederation
    ).length

    // UEFA rule: max 2 teams per group
    if (team.confederation === CONFEDERATIONS.UEFA) {
      if (confederationCount >= 2) {
        return { valid: false, error: 'Max 2 UEFA teams per group' }
      }
    } else {
      // Other confederations: max 1 team per group
      if (confederationCount >= 1) {
        return { valid: false, error: `Already has ${team.confederation} team` }
      }
    }

    return { valid: true, error: null }
  }

  const handleDragStart = (event) => {
    setActiveTeam(event.active.data.current)
  }

  const handleDragOver = (event) => {
    if (!event.over || !activeTeam) {
      setValidationError(null)
      return
    }

    const { groupName, position } = event.over.data.current
    
    // Check if team pot matches position
    const teamPot = getTeamPot(activeTeam)
    const expectedPosition = teamPot === 'pot1' ? 0 : teamPot === 'pot2' ? 1 : teamPot === 'pot3' ? 2 : 3
    
    if (position !== expectedPosition) {
      const potNumber = teamPot.replace('pot', '')
      setValidationError(`${teamPot.replace('pot', 'Pot ')} teams must go in position ${expectedPosition + 1}`)
      return
    }
    
    const validation = canPlaceTeam(activeTeam, groupName)
    setValidationError(validation.valid ? null : validation.error)
  }

  const handleDragEnd = (event) => {
    const { over } = event
    setValidationError(null)

    if (!over || !activeTeam) {
      setActiveTeam(null)
      return
    }

    const { groupName, position } = over.data.current
    
    // Check if team pot matches position (Pot 1 → Position 0, Pot 2 → Position 1, etc.)
    const teamPot = getTeamPot(activeTeam)
    const expectedPosition = teamPot === 'pot1' ? 0 : teamPot === 'pot2' ? 1 : teamPot === 'pot3' ? 2 : 3
    
    if (position !== expectedPosition) {
      // Wrong position for this pot
      setActiveTeam(null)
      return
    }
    
    const validation = canPlaceTeam(activeTeam, groupName)

    if (validation.valid) {
      setGroups((prev) => {
        const newGroups = { ...prev }
        newGroups[groupName] = [...newGroups[groupName]]
        newGroups[groupName][position] = activeTeam
        return newGroups
      })
    }

    setActiveTeam(null)
  }

  const handleReset = () => {
    if (window.confirm('Reset the draw? This will clear all placed teams except hosts.')) {
      const initialGroups = {}
      const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
      
      groupNames.forEach((name) => {
        initialGroups[name] = [null, null, null, null]
      })
      
      const mexico = POTS.pot1.find((t) => t.name === 'Mexico')
      const usa = POTS.pot1.find((t) => t.name === 'USA')
      const canada = POTS.pot1.find((t) => t.name === 'Canada')
      
      initialGroups['A'][0] = mexico
      initialGroups['B'][0] = usa
      initialGroups['D'][0] = canada
      
      setGroups(initialGroups)
    }
  }

  const handleContinue = () => {
    // Check if all groups are complete
    const allComplete = Object.values(groups).every((group) =>
      group.every((slot) => slot !== null)
    )

    if (!allComplete) {
      alert('Please complete all groups before continuing!')
      return
    }

    // Convert to tournament format
    const tournamentGroups = Object.entries(groups).map(([name, teams]) => ({
      name,
      teams,
    }))

    setTournamentGroups(tournamentGroups)
    navigate('/group-stage')
  }

  // Remove this line as we now use currentPotTeams
  const totalPlaced = Object.values(groups).flat().filter((t) => t !== null).length
  const totalTeams = 48
  const isComplete = totalPlaced === totalTeams
  const currentPotTeams = getCurrentPotTeams()
  const potProgress = getPotProgress()

  // Auto-advance to next pot when current is complete
  if (isCurrentPotComplete() && currentPot !== 'pot4' && !isComplete) {
    setTimeout(() => moveToNextPot(), 500) // Small delay for better UX
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-fifa-blue-400 to-fifa-gold-400 bg-clip-text text-transparent">
            Manual Draw - Create Your Own Groups
          </h1>
          <p className="text-white/70">Drag and drop teams into groups (FIFA rules apply)</p>
        </div>

        {/* Progress */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Draw Progress - {potProgress.potName}</h3>
              <p className="text-sm text-white/70">
                Step {potProgress.current} of {potProgress.total} • {totalPlaced} / {totalTeams} teams placed
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              {isComplete && (
                <button
                  onClick={handleContinue}
                  className="px-6 py-2 bg-gradient-to-r from-fifa-blue-600 to-fifa-gold-600 hover:from-fifa-blue-700 hover:to-fifa-gold-700 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg"
                >
                  Continue to Group Stage
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Pot Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {['pot1', 'pot2', 'pot3', 'pot4'].map((pot, index) => {
              const potNum = index + 1
              const isActive = currentPot === pot
              const potOrder = ['pot1', 'pot2', 'pot3', 'pot4']
              const isCompleted = potOrder.indexOf(currentPot) > index || (currentPot === pot && isCurrentPotComplete())
              
              return (
                <div key={pot} className="flex items-center">
                  <div className={`flex items-center gap-2 ${
                    isActive ? 'text-fifa-gold-400' : 
                    isCompleted ? 'text-fifa-blue-400' : 'text-white/50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isActive ? 'bg-fifa-gold-500' : 
                      isCompleted ? 'bg-fifa-blue-500' : 'bg-white/20'
                    }`}>
                      {potNum}
                    </div>
                    <span className="font-medium">Pot {potNum}</span>
                  </div>
                  {index < 3 && <ChevronRight className="w-5 h-5 text-white/30 mx-2" />}
                </div>
              )
            })}
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fifa-blue-500 to-fifa-gold-500 transition-all duration-500"
              style={{ width: `${(totalPlaced / totalTeams) * 100}%` }}
            />
          </div>
        </div>

        {/* FIFA Rules */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-fifa-gold-400" />
            FIFA Draw Rules
          </h3>
          <ul className="text-sm text-white/70 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Hosts (Mexico, USA, Canada) are pre-placed in Groups A, B, D</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Pot 1 teams → Position 1, Pot 2 teams → Position 2, Pot 3 teams → Position 3, Pot 4 teams → Position 4</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Maximum 2 UEFA teams per group</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Maximum 1 team from other confederations per group</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Each group must have exactly 4 teams (positions 1-4)</span>
            </li>
          </ul>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Current Pot Teams - Vertical Sidebar */}
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-fifa-gold-400" />
                {potProgress.potName} Teams
              </h3>
              
              {currentPotTeams.length === 0 ? (
                <div className="text-center text-green-400 py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-bold">{potProgress.potName} Complete!</p>
                  {currentPot !== 'pot4' && !isComplete && (
                    <p className="text-sm text-white/70 mt-2">Moving to next pot...</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-fifa-gold-400 mb-3">
                    {currentPotTeams.length} teams remaining
                  </p>
                  <div className="space-y-2">
                    {currentPotTeams.map((team) => (
                      <DraggableTeam key={team.name} team={team} isPlaced={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(groups).map(([groupName, groupTeams]) => (
            <div key={groupName} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fifa-blue-500 to-fifa-gold-500 flex items-center justify-center font-bold">
                  {groupName}
                </div>
                <h3 className="text-lg font-bold">Group {groupName}</h3>
              </div>

              <div className="space-y-2">
                {groupTeams.map((team, index) => (
                  <GroupSlot
                    key={index}
                    groupName={groupName}
                    position={index}
                    team={team}
                    validationError={validationError}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTeam ? (
            <div className={`p-2 rounded-lg border ${confederationColors[activeTeam.confederation]} opacity-80`}>
              <div className="font-semibold text-sm">{activeTeam.name}</div>
              <div className="text-xs opacity-70">{activeTeam.confederation}</div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default ManualDraw
