import { BrowserRouter } from "react-router-dom"

import { Homepage } from "./components"

const App=() =>{
  return (
<BrowserRouter>
<div className="relative z-0 bg-primary overflow-x-hidden ">
  <div className="bg- bg-cover">
    <Homepage/>
  </div>
</div>
</BrowserRouter>
  )
}

export default App
