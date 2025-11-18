import '../style/CategoryContainer.css';
import CategoryButton from './CategoryButton';

const CategoryContainer = () => {
    return (
        <div className="category-container-wrapper">
            <div className="category-container">
                <CategoryButton name='ALL' path='/category/all'/>
                <CategoryButton name='GRAPHIC DESIGN' path='/category/graphic-design'/>
                <CategoryButton name='ILLUSTRATIONS' path='/category/illustrations'/>
            </div>
            <hr />
        </div>
    );
}


export default CategoryContainer;