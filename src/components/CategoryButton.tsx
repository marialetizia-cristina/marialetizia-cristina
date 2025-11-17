import '../style/CategoryButton.css';
import { Link } from 'react-router-dom';

type categoryProps = {
  name: string;
  path: string;
}


const CategoryButton = ({ name, path }: categoryProps) => {
  return (
    <div className='category-button'>
        <Link to={path}>
          {name}
        </Link>
    </div>
  )
}

export default CategoryButton;