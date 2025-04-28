   import { Routes, Route } from 'react-router-dom'
   import { QueryClient, QueryClientProvider } from 'react-query'
   import LandingPage from './pages/LandingPage'
   import Dashboard from './pages/Dashboard'
   import Profile from './pages/Profile'
   import PrivateRoute from './components/PrivateRoute'

   const queryClient = new QueryClient()

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         <Routes>
           <Route path="/" element={<LandingPage />} />
           <Route
             path="/dashboard"
             element={
               <PrivateRoute>
                 <Dashboard />
               </PrivateRoute>
             }
           />
           <Route
             path="/profile"
             element={
               <PrivateRoute>
                 <Profile />
               </PrivateRoute>
             }
           />
         </Routes>
       </QueryClientProvider>
     )
   }

   export default App
