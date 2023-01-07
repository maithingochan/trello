import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sort'

import { initialData } from 'actions/initialData'

export default function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const boardFromData = initialData.boards.find(board => board.id === 'board-1')
    if (boardFromData) {
      setBoard(boardFromData)

      // sort column
      // boardFromData.columns.sort(function(a, b) {
      //   return boardFromData.columnOrder.indexOf(a.id) - boardFromData.columnOrder.indexOf(b.id)
      // })
      setColumns(mapOrder(boardFromData.columns, boardFromData.columnOrder, 'id'))
    }
  }, [])

  if (isEmpty(board)) {
    return <div className='not-found' style={{ 'padding': '10px', 'color': 'white' }}>Board not found!</div>
  }

  return (
    <div className='board-columns'>
      {
        columns.map((column, index) => <Column key={index} column={column} />)
      }
    </div>
  )
}

