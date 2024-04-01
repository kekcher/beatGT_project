import { useEffect, useState } from "react"
import { getStatsCount } from "../service/route"
import "../global_styles/footer.scss";

export default function Footer() {

    const [userCount, setUserCount] = useState(0);
    const [assembCount, setAssembCount] = useState(0);

    useEffect(() => {
        getStatsCount().then(d => {
            setUserCount(d.user_count);
            setAssembCount(d.assembly_count);
        });
    }, [])


    return (
        <footer className="footer-box">
            <p className="footer-box__note">Copyright @2024 <strong>BeatGT.</strong> All Rights Reserved</p>
            <div>
                <div className="footer-box_stats-box">
                    <p className="footer-box_stats-box__stats-note">Пользователей зарегестрировано: </p>
                    <p className="footer-box_stats-box__stats-count">{userCount}</p>
                </div>
                <div className="footer-box_stats-box">
                    <p className="footer-box_stats-box__stats-note">Всего сборок создано:</p>
                    <p className="footer-box_stats-box__stats-count">{assembCount}</p>
                </div>
            </div>
        </footer>
    )
}