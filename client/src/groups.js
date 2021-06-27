
export function mapGroup(group) {
  return {
    'chest': 'petto',
    'back': 'schiena',
    'legs': 'gambe',
    'arms': 'braccia',
    'delts': 'spalle'
  }[group.toLowerCase()]
}

export function mapGroupInv(group) {
  return {
    'petto': 'chest',
    'schiena': 'back',
    'gambe': 'legs',
    'braccia': 'arms',
    'spalle': 'delts'
  }[group.toLowerCase()]
}
