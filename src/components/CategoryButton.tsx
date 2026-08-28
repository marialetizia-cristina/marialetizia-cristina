import '../style/CategoryButton.css';
import { Link, useLocation } from 'react-router-dom';

type categoryProps = {
  name: string;
  path: string;
}

const CategoryButton = ({ name, path }: categoryProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <div className='category-button'>
        <Link to={path} aria-current={isActive ? 'page' : undefined}>
          {name}
        </Link>
    </div>
  )
}

export default CategoryButton;
