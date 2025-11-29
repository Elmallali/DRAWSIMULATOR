import { useState, useEffect } from 'react'
import { useTournamentStore } from '../store/tournamentStore'
import { useNavigate } from 'react-router-dom'
import { Trophy, Medal, Award, ChevronRight, Sparkles, Star } from 'lucide-react'

function MatchCard({ match, onSelectWinner, roundName, disabled = false }) {
  if (!match || !match.team1 || !match.team2) return null

  const handleTeam1Click = () => {
    if (!disabled) {
      // For final and third place, pass winner directly (no match id)
      if (match.id) {
        onSelectWinner(match.id, match.team1)
      } else {
        onSelectWinner(match.team1)
      }
    }
  }

  const handleTeam2Click = () => {
    if (!disabled) {
      // For final and third place, pass winner directly (no match id)
      if (match.id) {
        onSelectWinner(match.id, match.team2)
      } else {
        onSelectWinner(match.team2)
      }
    }
  }

  return (
    <div className="glass-card p-4 min-w-[280px]">
      <div className="text-xs text-white/50 mb-2 text-center font-semibold">
        {roundName}{match.id ? ` - Match ${match.id}` : ''}
      </div>
      
      <div className="space-y-2">
        <button
          onClick={handleTeam1Click}
          disabled={disabled}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            match.winner?.name === match.team1.name
              ? 'border-fifa-gold-500 bg-fifa-gold-500/20 font-bold'
              : 'border-white/20 hover:border-fifa-blue-400 hover:bg-white/5'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <div className="flex items-center justify-between">
            <span>{match.team1.name}</span>
            {match.winner?.name === match.team1.name && (
              <Trophy className="w-4 h-4 text-fifa-gold-400" />
            )}
          </div>
          <div className="text-xs text-white/50">{match.team1.confederation}</div>
        </button>

        <button
          onClick={handleTeam2Click}
          disabled={disabled}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            match.winner?.name === match.team2.name
              ? 'border-fifa-gold-500 bg-fifa-gold-500/20 font-bold'
              : 'border-white/20 hover:border-fifa-blue-400 hover:bg-white/5'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <div className="flex items-center justify-between">
            <span>{match.team2.name}</span>
            {match.winner?.name === match.team2.name && (
              <Trophy className="w-4 h-4 text-fifa-gold-400" />
            )}
          </div>
          <div className="text-xs text-white/50">{match.team2.confederation}</div>
        </button>
      </div>
    </div>
  )
}

function Confetti() {
  const [confettiPieces] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: ['#F59E0B', '#3B82F6', '#EF4444', '#22C55E', '#A855F7'][Math.floor(Math.random() * 5)],
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function KnockoutStage() {
  const {
    phase,
    knockoutMatches,
    champion,
    runnerUp,
    thirdPlace,
    setRoundOf32Winner,
    setRoundOf16Winner,
    setQuarterFinalWinner,
    setSemiFinalWinner,
    setFinalWinner,
    setThirdPlaceWinner,
  } = useTournamentStore()
  
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (phase === 'champion') {
      setShowConfetti(true)
      // Stop confetti after 10 seconds
      const timer = setTimeout(() => setShowConfetti(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const getPhaseTitle = () => {
    switch (phase) {
      case 'round_of_32':
        return 'Round of 32'
      case 'round_of_16':
        return 'Round of 16'
      case 'quarter_finals':
        return 'Quarter Finals'
      case 'semi_finals':
        return 'Semi Finals'
      case 'final':
        return 'Final & Third Place'
      case 'champion':
        return '🏆 Tournament Complete!'
      default:
        return 'Knockout Stage'
    }
  }

  const getPhaseDescription = () => {
    switch (phase) {
      case 'round_of_32':
        return 'Select the winner of each match to advance to Round of 16'
      case 'round_of_16':
        return 'Select the winner of each match to advance to Quarter Finals'
      case 'quarter_finals':
        return 'Select the winner of each match to advance to Semi Finals'
      case 'semi_finals':
        return 'Select the winner of each match to advance to the Final'
      case 'final':
        return 'Select the World Cup Champion and Third Place winner'
      case 'champion':
        return 'Congratulations! The tournament is complete.'
      default:
        return ''
    }
  }

  if (phase === 'champion') {
    return (
      <>
        {/* Confetti Effect */}
        {showConfetti && <Confetti />}
        
        <div className="max-w-5xl mx-auto px-4 py-8 relative">
          {/* Animated Background Stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <Star
                key={i}
                className="absolute text-fifa-gold-400/20 animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${20 + Math.random() * 30}px`,
                  height: `${20 + Math.random() * 30}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Header with Trophy */}
          <div className="text-center mb-12 relative z-10">
            <div className="relative inline-block">
              <Trophy className="w-40 h-40 mx-auto mb-6 text-fifa-gold-400 animate-bounce drop-shadow-2xl" />
              <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-fifa-gold-300 animate-spin" style={{ animationDuration: '3s' }} />
              <Sparkles className="absolute -bottom-4 -left-4 w-12 h-12 text-fifa-gold-300 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            </div>
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-fifa-gold-300 via-fifa-gold-400 to-fifa-gold-500 bg-clip-text text-transparent animate-pulse">
              FIFA WORLD CUP 2026™
            </h1>
            <p className="text-2xl font-bold text-white/90 tracking-wider">CHAMPION CROWNED</p>
          </div>

          {/* Champion Card - Enhanced */}
          <div className="glass-card p-12 mb-8 text-center border-4 border-fifa-gold-500 relative overflow-hidden animate-scale-in shadow-2xl">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-fifa-gold-500/20 via-transparent to-fifa-gold-500/20 animate-gradient" />
            
            <div className="relative z-10">
              <div className="flex justify-center items-center gap-4 mb-6">
                <Trophy className="w-20 h-20 text-fifa-gold-400 animate-bounce" />
                <Trophy className="w-24 h-24 text-fifa-gold-400" />
                <Trophy className="w-20 h-20 text-fifa-gold-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              
              <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>🏆</div>
                <h2 className="text-6xl font-black mb-4 text-fifa-gold-400 drop-shadow-lg tracking-tight">
                  {champion?.name}
                </h2>
                <p className="text-2xl text-fifa-gold-300/80 font-semibold mb-4">{champion?.confederation}</p>
              </div>
              
              <div className="inline-block px-8 py-4 bg-gradient-to-r from-fifa-gold-500 to-fifa-gold-600 rounded-full shadow-xl">
                <p className="text-3xl font-black text-white tracking-wider">WORLD CHAMPION</p>
              </div>
              
              <div className="mt-6 flex justify-center gap-2">
                <Star className="w-8 h-8 text-fifa-gold-400 fill-fifa-gold-400 animate-pulse" />
                <Star className="w-8 h-8 text-fifa-gold-400 fill-fifa-gold-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <Star className="w-8 h-8 text-fifa-gold-400 fill-fifa-gold-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>

          {/* Podium Layout */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Runner-up */}
            <div className="glass-card p-8 text-center border-3 border-fifa-blue-500 relative overflow-hidden hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-fifa-blue-500/10 to-transparent" />
              <div className="relative z-10">
                <Medal className="w-16 h-16 mx-auto mb-4 text-fifa-blue-400 animate-pulse" />
                <div className="text-4xl mb-3">🥈</div>
                <h3 className="text-3xl font-bold mb-2 text-fifa-blue-400">{runnerUp?.name}</h3>
                <p className="text-white/70 text-lg mb-3">{runnerUp?.confederation}</p>
                <div className="inline-block px-4 py-2 bg-fifa-blue-500/30 rounded-full">
                  <p className="text-xl font-bold text-fifa-blue-300">Runner-up</p>
                </div>
              </div>
            </div>

            {/* Third Place */}
            {thirdPlace && (
              <div className="glass-card p-8 text-center border-3 border-orange-500 relative overflow-hidden hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                <div className="relative z-10">
                  <Award className="w-16 h-16 mx-auto mb-4 text-orange-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                  <div className="text-4xl mb-3">🥉</div>
                  <h3 className="text-3xl font-bold mb-2 text-orange-400">{thirdPlace?.name}</h3>
                  <p className="text-white/70 text-lg mb-3">{thirdPlace?.confederation}</p>
                  <div className="inline-block px-4 py-2 bg-orange-500/30 rounded-full">
                    <p className="text-xl font-bold text-orange-300">Third Place</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button
              onClick={() => navigate('/draw')}
              className="px-10 py-4 bg-gradient-to-r from-fifa-blue-600 to-fifa-blue-700 hover:from-fifa-blue-700 hover:to-fifa-blue-800 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Start New Tournament
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <ChevronRight className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-fifa-blue-400 to-fifa-gold-400 bg-clip-text text-transparent">
          {getPhaseTitle()}
        </h1>
        <p className="text-white/70">{getPhaseDescription()}</p>
      </div>

      {/* Progress Indicator */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {['round_of_32', 'round_of_16', 'quarter_finals', 'semi_finals', 'final', 'champion'].map((p, index) => (
            <div key={p} className="flex items-center">
              <div
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  phase === p
                    ? 'bg-fifa-gold-500 text-white'
                    : ['round_of_32', 'round_of_16', 'quarter_finals', 'semi_finals', 'final', 'champion'].indexOf(phase) >
                      index
                    ? 'bg-fifa-blue-500/30 text-fifa-blue-300'
                    : 'bg-white/10 text-white/50'
                }`}
              >
                {p.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
              {index < 5 && <ChevronRight className="w-5 h-5 text-white/30 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Round of 32 */}
      {phase === 'round_of_32' && knockoutMatches.round_of_32.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-4">Select Match Winners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {knockoutMatches.round_of_32.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectWinner={setRoundOf32Winner}
                roundName="R32"
              />
            ))}
          </div>
        </div>
      )}

      {/* Round of 16 */}
      {phase === 'round_of_16' && knockoutMatches.round_of_16.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-4">Select Match Winners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {knockoutMatches.round_of_16.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectWinner={setRoundOf16Winner}
                roundName="R16"
              />
            ))}
          </div>
        </div>
      )}

      {/* Quarter Finals */}
      {phase === 'quarter_finals' && knockoutMatches.quarter_finals.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-4">Select Match Winners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {knockoutMatches.quarter_finals.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectWinner={setQuarterFinalWinner}
                roundName="QF"
              />
            ))}
          </div>
        </div>
      )}

      {/* Semi Finals */}
      {phase === 'semi_finals' && knockoutMatches.semi_finals.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-4">Select Match Winners</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {knockoutMatches.semi_finals.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectWinner={setSemiFinalWinner}
                roundName="Semi Final"
              />
            ))}
          </div>
        </div>
      )}

      {/* Final & Third Place */}
      {phase === 'final' && knockoutMatches.final && (
        <div className="space-y-8">
          {/* Final */}
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-fifa-gold-400 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8" />
              THE FINAL
            </h2>
            <MatchCard
              match={knockoutMatches.final}
              onSelectWinner={setFinalWinner}
              roundName="FINAL"
            />
          </div>

          {/* Third Place */}
          {knockoutMatches.third_place && (
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 text-orange-400 flex items-center justify-center gap-2">
                <Award className="w-6 h-6" />
                Third Place Match
              </h2>
              <MatchCard
                match={knockoutMatches.third_place}
                onSelectWinner={setThirdPlaceWinner}
                roundName="3rd Place"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default KnockoutStage
