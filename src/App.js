import Dropdown from "./components/Dropdown.jsx";

//unformatted dummy options
const DUMMY_OPTIONS = ['baboon', 'CaT', 'badger', 'doG', 'bat  ', '  bear', 'BEAVER']

function App() {

  //consume onChange prop
  const changeHandler = (selectedOption) => {
    console.log(selectedOption)
  }

  return (
    <div className="flex-center">
      <Dropdown options={DUMMY_OPTIONS} value="bat" autoFocus id="animals_list" onChange={changeHandler} placeholder="choose an animal" />
    </div>
  );
}

export default App;
