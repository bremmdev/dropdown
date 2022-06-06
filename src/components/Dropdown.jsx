import React, { useState, useEffect, useRef, useMemo} from "react";
import styles from "./Dropdown.module.css";
import ArrowIcon from "./UI/ArrowIcon.js";
import ClearIcon from "./UI/ClearIcon.js";

const formatText = (x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`;

const Dropdown = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  //ref for autoFocus
  const buttonRef = useRef(null)

  const { value, placeholder, onChange, id, autoFocus } = props;

  //format and sort options and memoize the result
  const options = useMemo(() => props.options.map((v) => v.trim().toLowerCase()).sort(), [props.options])
  
  //optional id for list of options, used for ARIA
  const listId = id || null;

 //**********FUNCTIONS***********

  const toggleOptionsOpen = () => {
    setIsOptionsOpen((prevState) => !prevState);
  };

  const changeSelectedOption = (idx, shouldCollapse = true) => {
    setSelectedOption(idx);

    // collapse
    if(shouldCollapse){
      setIsOptionsOpen(false);
    }

    //expose selected value on onChange prop
    onChange(options[idx]);
  };

  const clearSelectedOption = (e) => {
    //stop propagation to prevent triggering toggleOptionsOpen
    e.stopPropagation();
    setSelectedOption(null);
    setIsOptionsOpen(false);
  };
 
  //using arrow keys to select options, press escape to collapse
  const handleListKeyDown = (e) => {
    let newSelectedOption;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOptionsOpen(false);
        break;
      case "ArrowUp":
        e.preventDefault();
        //check for beginning of list
        newSelectedOption = selectedOption - 1 >= 0 ? selectedOption - 1 : options.length - 1;
        changeSelectedOption(newSelectedOption, false);
        break;
      case "ArrowDown":
        e.preventDefault();
        //check for end of list
        newSelectedOption = selectedOption === options.length - 1 || selectedOption === null ? 0 : selectedOption + 1;
        changeSelectedOption(newSelectedOption, false);
        break;
      default:
        break;
    }
  };

  //selecting an option with SPACE or ENTER when tabbing trough the list
  const handleOptionKeyDown = (e, idx) => {
    switch (e.key) {
      case "Enter":
      case " ":
      case "SpaceBar":
        e.preventDefault();
        changeSelectedOption(idx, true);
        break;
      default:
        break;
    }
  };

  //**********EFFECTS***********

  //check for value prop and initialize dropdown
  useEffect(() => {
    console.log('x')
    if (value) {
      const existingIdx = options.findIndex(
        (option) => option === value.trim().toLowerCase()
      );
      if (existingIdx !== -1) {
        setSelectedOption(existingIdx);
      }
      else{
        setSelectedOption(null)
      }
    }
  }, [value, options]);

  //focus on button if autoFocus prop is set
  useEffect(() => {
    if(autoFocus){
        buttonRef.current.focus()
    }
  }, [autoFocus])

  //Check if we need to set a placeholder text
  const selectedText =
    selectedOption !== null
      ? formatText(options[selectedOption])
      : formatText(placeholder);

  //Dynamic classes
  const btnClasses = selectedOption !== null ? "" : styles.placeholder;
  const arrowIconClasses = isOptionsOpen
    ? `${styles["arrow-icon"]} ${styles.inverted}`
    : styles["arrow-icon"];

  //List of options
  const optionsList = (
    <ul
      id={listId}
      role="listbox"
      aria-activedescendant={options[selectedOption]}
      onKeyDown={handleListKeyDown}
      tabIndex={-1}
    >
      {options.map((option, idx) => {
        return (
          <li
            key={option}
            tabIndex={0}
            role="option"
            aria-selected={selectedOption === idx}
            onClick={() => changeSelectedOption(idx)}
            onKeyDown={(e) => handleOptionKeyDown(e, idx)}
          >
            {formatText(option)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={styles.dropdown}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOptionsOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        className={btnClasses}
        onClick={toggleOptionsOpen}
        onKeyDown={handleListKeyDown}
      >
        {selectedText}
        {selectedOption !== null && (
          <span
            className={styles["clear-icon-wrapper"]}
            onClick={clearSelectedOption}
          >
            <ClearIcon className={styles["clear-icon"]} />
          </span>
        )}
        <ArrowIcon className={arrowIconClasses} />
      </button>
      {isOptionsOpen && optionsList}
    </div>
  );
};

export default Dropdown;
