export const saveContentAfterPressEnter = (e) => {
  if (e.key === 'Enter') {
    e.target.preventDefault()
    e.target.blur()
  }
}

export const selectAllInlineText = e => {
  e.target.focus()
  e.target.select()
  //document.execCommand('selectAll', false, null)
}