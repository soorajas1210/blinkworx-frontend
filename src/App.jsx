import { Routes, Route } from 'react-router-dom'
import OrderManagement from './pages/OrderManagement'
import NewOrder from './pages/NewOrder'
import Layout from './components/layout/Layout'
import { Toaster } from "react-hot-toast"
import EditOrder from './pages/EditOrder'

function App() {

  return (
    <div>
      <Routes >
        <Route element={<Layout />}>
          <Route path='/' element={<OrderManagement />} />
          <Route path='/new-order' element={<NewOrder />} />
          <Route path='/edit-order/:id' element={<EditOrder />} />

        </Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
