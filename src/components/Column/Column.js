import React, { useCallback, useEffect, useRef, useState } from 'react'
import Card from 'components/Card/Card'
import { Container, Draggable } from 'react-smooth-dnd'
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from 'utilities/constant'
import { Button, Dropdown, Form } from 'react-bootstrap'
import { cloneDeep, closeDeep } from 'lodash'

import './Column.scss'
import { mapOrder } from 'utilities/sort'
import ConfirmModal from 'components/Common/ConfirmModal'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/ContentEditable'

export default function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowConfirmAction = () => setShowConfirmModal(!showConfirmModal)


  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])

  // an hien them column
  const [opentnewcardform, setOpentNewCardForm] = useState(false)
  const toggerOpenNewColumForm = () => {
    setOpentNewCardForm(!opentnewcardform)
  }

  const newCardTextareaRef = useRef(null)
  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewCardTitleChange = e => setNewCardTitle(e.target.value)

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  // focus va boi den  o input
  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus()
      newCardTextareaRef.current.select()

    }
  }, [opentnewcardform])

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumn)
    }
    toggleShowConfirmAction()
  }

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColumn)
  }

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus()
      return
    }

    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5), // random charator,
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null
    }

    let newColumn = cloneDeep(column)
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)

    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toggerOpenNewColumForm()

  }

  return (
    <div>
      <div className='column'>
        <header className='column-drag-handle'>
          <div className='column-title'>
            <Form.Control
              size='sm'
              type='text'
              className='trello-content-editable'
              value={columnTitle}
              spellCheck='false'
              onClick={selectAllInlineText}
              onChange={handleColumnTitleChange}
              onBlur={handleColumnTitleBlur}
              onKeyDown={saveContentAfterPressEnter}
              onMouseDown={e => e.preventDefault()}
            />
          </div>
          <div className='column-dropdown-actions'>
            <Dropdown>
              <Dropdown.Toggle variant='success' id='dropdown-basic' size='sm' className='dropdown-btn' />
              <Dropdown.Menu>
                <Dropdown.Item href='#'>Add card...</Dropdown.Item>
                <Dropdown.Item href='#' onClick={toggleShowConfirmAction}>Remove List</Dropdown.Item>
                <Dropdown.Item href='#'>Move all cards in this column </Dropdown.Item>
                <Dropdown.Item href='#'>Archive all cards in this column </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>
        <div className='card-list'>
          <Container
            groupName="col"
            // onDragStart={e => console.log('drag started', e)}
            // onDragEnd={e => console.log('drag end', e)}
            // onDragEnter={() => {
            //   console.log('drag enter:', column.id)
            // }}
            // onDragLeave={() => {
            //   console.log('drag leave:', column.id)
            // }}
            orientation='vertical'
            onDrop={dropResult => onCardDrop(column.id, dropResult )}
            getChildPayload={index =>
              cards[index]
            }
            dragClass="card-ghost"
            dropClass="card-ghost-drop"
            onDropReady={p => console.log('Drop ready: ', p)}
            dropPlaceholder={{
              animationDuration: 150,
              showOnTop: true,
              className: 'card-drop-preview'
            }}
            dropPlaceholderAnimationDuration={200}
          >
            {
              cards.map((card, index) => (
                <Draggable key={index} >
                  <Card card={card} />
                </Draggable>
              ))}
          </Container>
          {opentnewcardform &&
          <div className='add-new-card-area'>
            <Form.Control
              size='sm'
              as='textarea'
              rows='3'
              placeholder='Enter a title for this card...'
              className='textarea-enter-new-card'
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
              onKeyDown={e => (e.key === 'Enter') && addNewCard() }
            />

          </div>
          }
        </div>
        <footer>
          {!opentnewcardform &&
          <div className='footer-actions' onClick={toggerOpenNewColumForm}>
            <i className="fa fa-plus icon"/>Add anther card
          </div>
          }
          {opentnewcardform &&
          <div className='add-new-card-actions'>
            <Button variant='success' size='sm' onClick={addNewCard}>Add card</Button>
            <span className='cancel-new-column' onClick={toggerOpenNewColumForm}>
              <i className="fa fa-plus icon"/>
            </span>
          </div>
          }
        </footer>
        <ConfirmModal
          show={showConfirmModal}
          onAction={onConfirmModalAction}
          title='Remove Column'
          content={`Are you sure you want to remove <strong> ${column.title}!</strong> </br> All related cards alse be removed!`} />
      </div>
    </div>
  )
}