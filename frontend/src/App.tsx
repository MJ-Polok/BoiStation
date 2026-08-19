import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';
import AdminOrders from './features/admin/AdminOrders';
import BookDetails from './features/book-details/BookDetails';
import BuySell from './features/buy-sell/BuySell';
import Donate from './features/donate/Donate';
import Exchange from './features/exchange/Exchange';
import Login from './features/auth/Login';
import Messages from './features/messages/Messages';
import Home from './features/home/Home';
import Orders from './features/orders/Orders';
import PostBook from './features/post/PostBook';
import Profile from './features/profile/Profile';
import SavedBooks from './features/saved/SavedBooks';
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/buy-sell" element={<BuySell />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/donate" element={<Donate />} />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostBook />
              </ProtectedRoute>
            }
          />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedBooks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
