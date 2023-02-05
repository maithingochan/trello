import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM  } from 'utilities/constant'
import HTMLReactParser from 'html-react-parser'


function ConfirmModal(props) {
  const { title, content, show, onAction } = props


  return (
    <Modal
      show={show}
      onHide={() => onAction('close')}
      backdrop='static'
      keyboard={false}
    //   animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className='h5'>{HTMLReactParser(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{HTMLReactParser(content)}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onAction(MODAL_ACTION_CLOSE)}>
            Close
        </Button>
        <Button variant="primary" onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
            Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal