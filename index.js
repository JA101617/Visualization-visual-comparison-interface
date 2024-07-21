import React from 'react';
import BarChart from './BarChart';
import data from './data.json';

function App() {
  return (
    <div className="App">
      <BarChart data={data} />
    </div>
  );
}

export default App;