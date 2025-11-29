import { useState } from 'react'
import { useTournamentStore } from '../store/tournamentStore'
import { useNavigate } from 'react-router-dom'
import { Trophy, Medal, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react'
import { CONFEDERATIONS } from '../utils/drawAlgorithm'

const confederationColors = {
  [CONFEDERATIONS.UEFA]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [CONFEDERATIONS.CONMEBOL]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [CONFEDERATIONS.CONCACAF]: 'bg-red-500/20 text-red-300 border-red-500/30',
  [CONFEDERATIONS.CAF]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [CONFEDERATIONS.AFC]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  [CONFEDERATIONS.OFC]: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
}

function GroupStage() {
  const { groups, setGroupStandings } = useTournamentStore()
  const navigate = useNavigate()
  const [standings, setStandings] = useState(() => {
    // Initialize with teams in original order
    const initial = {}
    groups?.forEach((group) => {
      initial[group.name] = [...group.teams]
    })
    return initial
  })

  const moveTeamUp = (groupName, index) => {
    if (index === 0) return
    setStandings((prev) => {
      const newStandings = { ...prev }
      const group = [...newStandings[groupName]]
      ;[group[index], group[index - 1]] = [group[index - 1], group[index]]
      newStandings[groupName] = group
      return newStandings
    })
  }

  const moveTeamDown = (groupName, index) => {
    if (index === standings[groupName].length - 1) return
    setStandings((prev) => {
      const newStandings = { ...prev }
      const group = [...newStandings[groupName]]
      ;[group[index], group[index + 1]] = [group[index + 1], group[index]]
      newStandings[groupName] = group
      return newStandings
    })
  }

  const handleContinue = () => {
    // Save standings and navigate to knockout stage
    setGroupStandings(standings)
    navigate('/knockout')
  }

  if (!groups) {
    navigate('/draw')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-fifa-blue-400 to-fifa-gold-400 bg-clip-text text-transparent">
          Group Stage Results
        </h1>
        <p className="text-white/70">Arrange teams by final standings (1st to 4th place)</p>
      </div>

      {/* Instructions */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-fifa-gold-400" />
          Instructions
        </h3>
        <ul className="text-white/70 space-y-2">
          <li>• Use ↑ ↓ buttons to arrange teams by their final group standings</li>
          <li>• <strong className="text-fifa-gold-400">1st place</strong> teams advance as group winners</li>
          <li>• <strong className="text-fifa-blue-400">2nd place</strong> teams advance as runners-up</li>
          <li>• 3rd and 4th place teams are eliminated</li>
          <li>• Click "Continue to Knockout Stage" when ready</li>
        </ul>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {groups.map((group) => (
          <div key={group.name} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fifa-blue-500 to-fifa-gold-500 flex items-center justify-center font-bold text-lg">
                {group.name}
              </div>
              <h3 className="text-xl font-bold">Group {group.name}</h3>
            </div>

            <div className="space-y-2">
              {standings[group.name]?.map((team, index) => (
                <div
                  key={team.name}
                  className={`relative p-3 rounded-lg border ${
                    index === 0
                      ? 'border-fifa-gold-500 bg-fifa-gold-500/10'
                      : index === 1
                      ? 'border-fifa-blue-500 bg-fifa-blue-500/10'
                      : 'border-white/10 bg-white/5 opacity-60'
                  }`}
                >
                  {/* Position Badge */}
                  <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>

                  {/* Qualification Badge */}
                  {index < 2 && (
                    <div className="absolute -right-2 -top-2">
                      {index === 0 ? (
                        <Trophy className="w-5 h-5 text-fifa-gold-400" />
                      ) : (
                        <Medal className="w-5 h-5 text-fifa-blue-400" />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{team.name}</div>
                      <div className={`text-xs ${confederationColors[team.confederation]?.split(' ')[1] || 'text-white/50'}`}>
                        {team.confederation}
                      </div>
                    </div>

                    {/* Move Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveTeamUp(group.name, index)}
                        disabled={index === 0}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveTeamDown(group.name, index)}
                        disabled={index === standings[group.name].length - 1}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status Label */}
                  {index < 2 && (
                    <div className={`text-xs font-semibold ${
                      index === 0 ? 'text-fifa-gold-400' : 'text-fifa-blue-400'
                    }`}>
                      {index === 0 ? '✓ Qualified (Winner)' : '✓ Qualified (Runner-up)'}
                    </div>
                  )}
                  {index >= 2 && (
                    <div className="text-xs font-semibold text-red-400">
                      ✗ Eliminated
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Qualified Teams Summary</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-fifa-gold-400 font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Group Winners (16 teams)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(standings).map(([groupName, teams]) => (
                <div key={groupName} className="text-sm p-2 bg-fifa-gold-500/10 rounded border border-fifa-gold-500/30">
                  <span className="text-fifa-gold-400 font-bold">Group {groupName}:</span> {teams[0]?.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-fifa-blue-400 font-semibold mb-3 flex items-center gap-2">
              <Medal className="w-5 h-5" />
              Runners-up (16 teams)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(standings).map(([groupName, teams]) => (
                <div key={groupName} className="text-sm p-2 bg-fifa-blue-500/10 rounded border border-fifa-blue-500/30">
                  <span className="text-fifa-blue-400 font-bold">Group {groupName}:</span> {teams[1]?.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="px-12 py-4 bg-gradient-to-r from-fifa-blue-600 to-fifa-gold-600 hover:from-fifa-blue-700 hover:to-fifa-gold-700 rounded-lg font-bold text-lg flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
        >
          Continue to Knockout Stage
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default GroupStage
