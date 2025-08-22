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
import MainLayout from '@/components/MainLayOut'
import BlankLayout from '@/components/BlankLayout'
import Loading from '@/components/Loading'

// 懒加载
const Home = lazy(() => import('@/pages/Home'))
const SavingTips = lazy(() => import('@/pages/SavingTips'))
const AiAssistant = lazy(() => import('@/pages/AiAssistant'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const User = lazy(() => import('@/pages/User'))
const SearchBox = lazy(() => import('@/components/SearchBox'))
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))

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
            <Route path="/assistant" element={<AiAssistant />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/user" element={<User />} />
          </Route>

        {/* 不带TabBar的布局 */}
          <Route element={<BlankLayout />}>
            <Route path="/search" element={<SearchBox />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
