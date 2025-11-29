import { useState, useEffect } from 'react'
import { X, User, Hash } from 'lucide-react'

function PlayerEditorModal({ player, onClose, onSave }) {
  const [name, setName] = useState(player.name || '')
  const [number, setNumber] = useState(player.number || '')

  useEffect(() => {
    setName(player.name || '')
    setNumber(player.number || '')
  }, [player])

  const handleSave = () => {
    onSave({
      name: name.trim(),
      number: number.trim(),
    })
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="glass-card p-6 max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Player</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Position Badge */}
        <div className="mb-6 text-center">
          <span className="inline-block px-4 py-2 bg-pitch-green-600 rounded-full text-sm font-bold">
            {player.position}
          </span>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <User className="w-4 h-4" />
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Messi"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-pitch-green-400 transition-colors text-white placeholder:text-white/40"
              maxLength={20}
            />
          </div>

          {/* Number Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Hash className="w-4 h-4" />
              Jersey Number
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || (/^\d+$/.test(val) && parseInt(val) <= 99)) {
                  setNumber(val)
                }
              }}
              placeholder="e.g., 10"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-pitch-green-400 transition-colors text-white placeholder:text-white/40"
              maxLength={2}
            />
          </div>

        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-fifa-blue-500/10 border border-fifa-blue-500/30 rounded-lg">
          <p className="text-xs text-white/70">
            💡 <strong>Tip:</strong> Change team kit color in the sidebar to update all players at once.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-pitch-green-600 hover:bg-pitch-green-700 rounded-lg font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerEditorModal
