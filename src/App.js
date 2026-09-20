import { Switch, Route, Redirect } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  useEffect(() => {
    const checkToken = async () => {
     
      if (!authCtx.token) return;

      try {
        const res = await fetch(
          'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAXhOcSSSkvtZgGp-L0Fg_6nN5JP4iyM-k',
          {
            method: 'POST',
            body: JSON.stringify({
              idToken: authCtx.token,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

       
        if (!res.ok) {
          authCtx.logout();
        }
      } catch (error) {
       
        authCtx.logout();
      }
    };

    checkToken();
  }, [authCtx]);

  return (
    <Layout>
      <Switch>
        
        <Route path="/" exact>
          <HomePage />
        </Route>

      
        {!isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}

     
        <Route path="/profile">
          {isLoggedIn && <UserProfile />}

          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;