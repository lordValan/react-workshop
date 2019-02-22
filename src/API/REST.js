// Instruments
import { Config } from './config';

export const api = new class Api extends Config {
    async getCountries(filter = '', size = '50', caseSensitive = false) {
        const response = await fetch(
            `${this.MAIN_URI}/geo/api/countries?filter=${filter}&size=${size}&case-insensitive=${caseSensitive}`,
            { method: 'GET' },
        );

        const { data: countries } = await response.json();

        return countries;
    }

    async getMovies(filter = 'upcoming') {
        const response = await fetch(`${this.BASE_URI}/afisha/api/${filter}`, {
            method: 'GET',
        });
        const result = await response.json();

        return result;
    }
}();
