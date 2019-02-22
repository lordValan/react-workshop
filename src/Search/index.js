// Core
import React, { useState, useEffect } from 'react';

// Hooks

import { useDebounce } from './useDebounce';

// Instruments
import './styles.css';
import { api } from '../API';
import { delay } from '../instruments';
import Tilt from 'react-tilt'

export const Search = () => {

    const [ filter, setFilter ] = useState('');
    const [ countries, setCountries ] = useState([]);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ chosenCountry, setChosenCountry ] = useState(null);
    
    const getCountries = async () => {
        setIsFetching(true);
        const filteredCountries = await api.getCountries(filter.trim(), 5, true);
        await delay(200);
        setCountries(filteredCountries);
        setIsFetching(false);
    }

    const debouncedFilter = useDebounce(filter, 200);
    
    useEffect(() => {
        getCountries();
    }, [ debouncedFilter ]);

    // debounce

    const regexp = new RegExp(filter, 'gi');

    const pickFilter = (str, startIndex, endIndex, className = 'highlight') => {
        return `${str.slice(0, startIndex)}<span class='${className}'>${str.slice(startIndex, endIndex)}</span>${str.slice(endIndex)}`;
    }

    const countriesJSX = countries.map((country, index) => {
        let name = country.name,
                countryMatch = regexp.exec(name),
                continent = country.continent,
                continentMatch = regexp.exec(continent);

        if(countryMatch) {        
            name = pickFilter(name, countryMatch.index, countryMatch.index + filter.length);
        }

        if(continentMatch) {
            continent = pickFilter(continent, continentMatch.index, continentMatch.index + filter.length);
        }

        const onClickHandler = () => {
            setChosenCountry(country);
            setFilter(country.name);
            setIsModalOpen(true);
        }

        return (
            <li key = { country.emoji } onClick = {onClickHandler}>
                <span className='country' 
                    dangerouslySetInnerHTML = {{
                        __html: `${name}, ${continent}`
                    }}
                />
                <span className='flag'>{ country.emoji }</span>
            </li>
        );
    });

    const onModalCloseHandler = () => {
        setChosenCountry(null);
        setFilter('');
        setCountries([]);
        setIsModalOpen(false);
    }

    const drawModal = () => {
        const langs = chosenCountry.languages.map((lang) => {
            return lang.native;
        });

        return (
            <div className = 'modal'>
                <Tilt className = 'tilt' options={{ max : 15, scale: 1, speed: 500 }}>
                    <div className = 'content'>
                        <h1>{`${chosenCountry.name} ${chosenCountry.emoji}`}</h1>
                        <ul>
                            <li>
                                <span>Столица:</span>
                                <span>{`${chosenCountry.capital}`}</span>
                            </li>
                            <li>
                                <span>Континент:</span>
                                <span>{`${chosenCountry.continent}`}</span>
                            </li>
                            <li>
                                <span>Народное имя страны:</span>
                                <span>{`${chosenCountry.native}`}</span>
                            </li>
                            <li>
                                <span>Языки:</span>
                                <span>{`${langs.join(', ')}`}</span>
                            </li>
                            <li>
                                <span>Валюты:</span>
                                <span>{`${chosenCountry.currencies.join(', ')}`}</span>
                            </li>
                        </ul>
                    </div>
                    <div className = 'close' onClick = {onModalCloseHandler} />
                </Tilt>
            </div>
        )
    }

    return (
        <section className = 'strange-search'>
            <span className = 'strange'>Странный</span>
            <input 
                type = 'text' 
                placeholder = 'Страна или континент'
                style = {{
                    '--inputBorderStyle': isFetching ? 'dashed' : 'solid'
                }}
                value = { filter }
                onChange = { (event) => setFilter(event.target.value.replace(/#|_|\(|\)/g,'')) }
            />
            <span className = 'search'>поиск</span>
            <ul>{ countriesJSX }</ul>
            <b />
            {isModalOpen ? drawModal() : null}
        </section>
    );
};
