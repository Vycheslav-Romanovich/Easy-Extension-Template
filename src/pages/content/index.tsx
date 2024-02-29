
import './index.css';
// @ts-ignore
import { createUIStore } from 'redux-webext'
import React from 'react'
// @ts-ignore
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import AllPagesController from './controllers/allPagesController'

async function initApp() {
  const store = await createUIStore()
  const root = document.createElement("div");
  root.id = "elang_template_extension";

  document.body.insertBefore(root, document.body.childNodes[0]);

  const rootIntoShadow = document.createElement("div");
  rootIntoShadow.id = "shadow-root";

  const shadowRoot = root.attachShadow({ mode: "open" });
  shadowRoot.appendChild(rootIntoShadow);


  createRoot(rootIntoShadow).render(
    <Provider store={store}>     
        <AllPagesController />      
    </Provider>
  )
}

initApp()

console.log('Content script')
