import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ArtigoProvider } from './contexts/ArtigoContext';
import routes from './routes';

function App() {
  return (
    <AuthProvider>
      <ArtigoProvider>
        <Router>
          <div className="App">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </div>
        </Router>
      </ArtigoProvider>
    </AuthProvider>
  );
}

export default App;