import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import { UseSessionProvider } from 'react-session-hook';
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
// Pages
const AdminLogin = React.lazy(() => import('./views/Pages/Login/AdminLogin'));
const AdminForgotPassword = React.lazy(() => import('./views/Pages/ForgotPassword/AdminForgotPassword'));
const AdminResetPassword = React.lazy(() => import('./views/Pages/AdminResetPassword/AdminResetPassword'));




const App = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={loading()}>
        <Switch>
          <UseSessionProvider>
            <Route path="/login" name="AdminLogin Page" render={props => <AdminLogin {...props} />} />
            <Route path="/forgot-password" name="Admin Forgot Password Page" render={props => <AdminForgotPassword {...props} />} />
            <Route path="/reset-password/:id" name="Admin Forgot Password Page" render={props => <AdminResetPassword {...props} />} />
            <Route path="/" name="admin" render={props => <DefaultLayout {...props} />} />
          </UseSessionProvider>
        </Switch>
      </React.Suspense>
    </BrowserRouter>    
  )
}

export default App;
