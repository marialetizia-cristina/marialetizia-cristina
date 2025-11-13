import { useState, useEffect } from 'react';
import '../style/CategoryButton.css';
import type { Work } from '../api/api';

type categoryProps = {
    name: string;
    work?: Work;
}


const CategoryButton = ({name, /* work */}: categoryProps) => {

  // gestione dello stato del bottone selezionato in base alla categoria
  const [isSelected, setIsSelected] = useState(false);

  // funzione per gestire il click sul bottone
  const handleClick = () => {
    setIsSelected(!isSelected);
      if(!isSelected){
        console.log(`Categoria selezionata: ${name}`);
      } else {
        console.log(`Categoria deselezionata: ${name}`);
      }
    // qui puoi aggiungere ulteriori logiche per filtrare i lavori in base alla categoria
  };
  

  useEffect(() => {
    document.title = `Hai cliccato su ${name}`;
    handleClick();
  }), [isSelected];

  

  return (
    <div className='category-button'>
        <button>
            {name}
        </button>
    </div>
  )
}

export default CategoryButton;