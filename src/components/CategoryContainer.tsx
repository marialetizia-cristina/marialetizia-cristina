import '../style/CategoryContainer.css';
import CategoryButton from './CategoryButton';



function CategoryContainer() {
    return (
        <div className="category-container-wrapper">
            <div className="category-container">
                <CategoryButton name='ALL' />
                <CategoryButton name='GRAPHIC DESIGN' />
                <CategoryButton name='ILLUSTRATIONS' />
            </div>
            <hr />
        </div>
    );
}


export default CategoryContainer;