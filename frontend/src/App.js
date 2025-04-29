import './App.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Banner from './components/Banner';
import ProjectList from './components/ProjectList';
import CourseSection from './components/CourseSection';

function App() {
  return (
    <div className="App">
      <Header />
      <NavBar />
      <Banner />
      <ProjectList />
      <div className="divider"></div>
      <CourseSection />
    </div>
  );
}

export default App;