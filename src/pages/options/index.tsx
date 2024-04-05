import React from 'react'
import ReactDOM from 'react-dom'
import { environment } from "../../utils/environment"

async function initApp() {
  window.location.replace(`${environment.website}/account/settings`)

  ReactDOM.render(
    <></>,
    document.getElementById('root'),
  )
}

initApp()
