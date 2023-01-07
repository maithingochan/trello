import React from 'react'
import Card from 'components/Card/Card'
import './Column.scss'
import { mapOrder } from 'utilities/sort'

export default function Column(props) {
  const { column } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  return (
    <div>
      <div className='column'>
        <header>{column.title}</header>
        <ul className='card-list'>
          {
            cards.map((card, index) => <Card key={index} card={card} />)
          }
        </ul>
        <footer>Add anther card</footer>
      </div>
    </div>
  )
}

