import {
  useState,
  Suspense,
  lazy
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import './App.css'
import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'
import Loading from '@/components/Loading'
import RequireAuth from '@/routes/RequireAuth'

// 懒加载
const Home = lazy(() => import('@/pages/Home'))
const SavingTips = lazy(() => import('@/pages/SavingTips'))
const TipDetails = lazy(() => import('@/pages/tipDetails'))
const AIAssistant = lazy(() => import('@/pages/AIAssistant'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const User = lazy(() => import('@/pages/User'))
const Search = lazy(() => import('@/pages/Search'))
const SearchResult = lazy(() => import('@/pages/SearchResult'))
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))
const Login = lazy(() => import('@/pages/Login'))
const Todo = lazy(() => import('@/pages/Todo'))
const NotFound = lazy(() => import('@/pages/404'))

function App() {

  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* 分为两种布局，即为带TabBar和不带TabBar的布局*/}
        {/* 带TabBar的布局 */}
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path="/tips" element={<SavingTips />} />
            {/* 受保护路由 */}
            <Route element={<RequireAuth />}>
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/user" element={<User />} />
            </Route>
          </Route>

        {/* 不带TabBar的布局 */}
          <Route element={<BlankLayout />}>
            <Route path="/search" element={<Search />} />
            <Route path="/search/result" element={<SearchResult />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/tips/:id" element={<TipDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
