import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { heroesDelete, fetchHeroes,} from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import './heroesList.scss';
import { filterHeroesSelector } from './heroesSlice';

const HeroesList = () => {

    const filterHeroes = useSelector(filterHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes())
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(dispatch(heroesDelete(id)))
            .catch(e => console.log(e));
        // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <CSSTransition
                    timeout={0}
                    classNames="hero">
                        <h5 className="text-center mt-5">Героев пока нет</h5>
                    </CSSTransition>
        }
        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition key={id} timeout={500} classNames="hero">
                    <HeroesListItem key={id} id = {id} onDelete={() => onDelete(id)} {...props}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filterHeroes);

    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;