import { useState, useEffect } from "react";
import { Header } from "../components/Header/Header";
import { MoviesContainer } from "../components/MoviesContainer";
import { api } from "../utils/api";
import { MoviesResponse } from "../utils/MoviesResponse";
import { useLocation } from "react-router-dom";

export function SearchMovies(){
    const [movies, setMovies] = useState<MoviesResponse[]>();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const params = Object.fromEntries(query.entries());
    const queryToSearch = params.q.replace(" ", "+");

    const getMovies = async () => {

        const {data: moviesFromApi} = await api.get<MoviesResponse[]>(`/movies/search?q=${queryToSearch}`);


        setMovies(moviesFromApi);
    }

    useEffect(() => {
        getMovies();        
    }, [location]);

    return (
        <>
            <Header color="black"/>
            <div className="w-full h-full p-10">
                <h1 className="text-white text-2xl font-bold">Results for search: "<span className="text-2xl text-gray-50">{params.q}</span>"</h1>
            </div>
            <MoviesContainer dropdown={false} category="Todos os filmes" optionsToSelect={[{name: "Avaliados", url: "/movies/rated"}]} movies={movies}/>
        </>
    )
}