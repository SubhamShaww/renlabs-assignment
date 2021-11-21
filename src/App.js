import AppPrice from './components/AppPrice';
import AppMenu from './components/AppMenu';
import AppActions from './components/AppActions';
import AppChart from './components/AppChart';
import './App.css';

function App() {
  return (
    <div className="app">
      <AppPrice />

      <AppMenu />

      <AppActions />

      <AppChart />
    </div>
  );
}

export default App;
