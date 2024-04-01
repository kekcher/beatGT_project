import { useEffect, useState } from "react";
import Footer from "../../global_components/Footer";
import Header from "../../global_components/Header";
import "./scss/home.scss";
import { useLocation } from "react-router-dom";
import { getAssamblies } from "../../service/route";
import { PageLoader } from "../../global_components/Loader";
import AssemblyBox, { FilterBox } from "./components/components";


export default function Home() {

    const location = useLocation();

    const [assembliesInfo, setAssembliesInfo] = useState([]);
    const [load, setLoad] = useState(false);
    const nickname = JSON.parse(localStorage.getItem('user'))?.nickname;

    useEffect(() => {

        setLoad(true)

        const searchParams = new URLSearchParams(location.search);
        const type = searchParams.get('type');
        const filter = searchParams.get('filter');
        const urlGetSearch = `?type=${type || ''}&filter=${filter || ''}&nickname=${nickname || ''}`;

        getAssamblies(urlGetSearch).then(d => {
            setAssembliesInfo(d.data)
        }).catch(e => {
            setAssembliesInfo([])
        }).finally(_ => {
            setLoad(false)
        });

    }, [location.search])


    return (
        <>
            <Header/>
            <main className="home-box">
                {
                    !location.search?.includes('type') && (
                        <FilterBox />
                    )
                }
                {
                    load ?
                        (
                            <PageLoader />
                        )
                        :
                        (
                            <>
                                {
                                    assembliesInfo.length > 0 ?
                                        (
                                            <>
                                                {
                                                    assembliesInfo.map((d, idx) => {
                                                        return (
                                                            <AssemblyBox key={d.assembly_id} assemblyInfo={d} />
                                                        )
                                                    })
                                                }
                                            </>
                                        )
                                        :
                                        (
                                            <h1 className="home-box__not-found">Сборки не найдены :(</h1>
                                        )
                                }
                            </>
                        )
                }
            </main>
            <Footer />
        </>
    )
}