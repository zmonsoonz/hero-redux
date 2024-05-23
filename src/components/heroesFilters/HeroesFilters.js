import { heroesFilter, selector } from "./filtersSlice";
import { useDispatch, useSelector} from "react-redux";
import { fetchFilters } from "./filtersSlice";
import { useRef, useEffect } from "react";
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {

    useEffect(() => {
        dispatch(fetchFilters());
            // eslint-disable-next-line  
    }, []);

    const dispatch = useDispatch();
    const filters = useSelector(selector.selectAll);
    const itemsRef = useRef([]);
    const {filtersLoadingStatus} = useSelector(state => state.filters);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const changeActive = (id) => {
        itemsRef.current.forEach(item => item.classList.remove("active"));
        itemsRef.current[id].classList.add("active");
    }

    function formFilters(data) {
        if (data.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }
        const elems = data.map(({id, element, text, className}, i) => {
            return (
                <button key={id} 
                        onClick={(e) => {dispatch(heroesFilter(element)); changeActive(i)}} 
                        className = {element === "all" ? `${className} active` : className}
                        ref={el => itemsRef.current[i] = el}>{text}
                </button>
            )
        })
        return (
            <>
            {elems}
            </>
        )
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {formFilters(filters)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;