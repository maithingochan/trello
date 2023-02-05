import React, { useCallback, useEffect, useRef, useState } from 'react'
import { isEmpty } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'
import { Button, Col, Container as BootstrapContainer, Form, Row } from 'react-bootstrap'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sort'
import { applyDrag } from 'utilities/dragDrop'

import { initialData } from 'actions/initialData'

export default function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [opentnewcolumnform, setOpentNewColumnForm] = useState(false)
   // an hien them column
   const toggerOpenNewColumForm = () => {
    setOpentNewColumnForm(!opentnewcolumnform)
  }

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = e => setNewColumnTitle(e.target.value)

  const onNewColumnChange = useCallback((e) => {
    setNewColumnTitle(e.target.value)
  }, [])

  const newColumnInputRef = useRef(null)


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
  // focus va boi den  o input
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()

    }
  }, [opentnewcolumnform])

  if (isEmpty(board)) {
    return <div className='not-found' style={{ 'padding': '10px', 'color': 'white' }}>Board not found!</div>
  }

  // drag and drop
  const onColumnDrop = (dropResult) => {
    //console.log(dropResult)
    let newColumns = [...columns ]
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if ( dropResult.removedIndex !== null || dropResult.addedIndex !== null ) {
      let newColumns = [...columns ]

      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

      setColumns(newColumns)
      console.log(currentColumn)
      console.log(dropResult)
    }
  }

 
  // them column moi
  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5), // random charator,
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
    setNewColumnTitle('')
    toggerOpenNewColumForm()
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)
    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
    console.log(newBoard)
  }

 

  return (
    <div className='board-columns'>
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index =>
          columns[index]
        }
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {
          columns.map((column, index) => (
            <Draggable key={index}>
              <Column column={column} onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn} />
            </Draggable>
          ))}
      </Container>
      <BootstrapContainer className='trello-container'>
        {
          !opentnewcolumnform &&
        <Row>
          <Col className='add-new-column' onClick={toggerOpenNewColumForm}>
            <i className="fa fa-plus icon"/> Add another column
          </Col>
        </Row>
        }
        {
          opentnewcolumnform &&
        <Row>
          <Col className='enter-new-column'>
            <Form.Control
              size='sm'
              type='text'
              placeholder='Title new column...'
              className='input-enter-new-column'
              ref={newColumnInputRef}
              value={newColumnTitle}
              onChange={onNewColumnChange}
              onKeyDown={e => (e.key === 'Enter') && addNewColumn() }
            />
            <Button variant='success' size='sm' onClick={addNewColumn}>Add column</Button>
            <span className='cancel-new-column' onClick={toggerOpenNewColumForm}><i className='fa fa-trash icon'/></span>
          </Col>
        </Row>
        }
      </BootstrapContainer>
    </div>
  )
}

