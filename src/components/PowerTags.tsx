import './index.css'

import { useState } from 'react'

import { CreateTag } from './CreateTag'

const PowerTags = () => {
  const [tags, setTags] = useState([])

  const closeModal = () => {
    logseq.hideMainUI()
  }

  return (
    <div id="powertags-container">
      <div id="powertags-header">
        <h1>PowerTags Menu</h1>
        <button onClick={closeModal}>X</button>
      </div>
      <CreateTag />
      <h2>Manage</h2>
    </div>
  )
}

export default PowerTags
