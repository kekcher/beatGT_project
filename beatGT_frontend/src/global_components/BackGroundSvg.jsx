import AppSvg from "../svg/AppSvg";
import '../global_styles/app.scss';

export default function BackGroundSvg() {
    return (
        <>
            <AppSvg className="background-svg background-svg_1" type='cpu' />
            <AppSvg className="background-svg background-svg_2" type='gpu' />
            <AppSvg className="background-svg background-svg_3" type='ram' />
            <AppSvg className="background-svg background-svg_4" type='cooler'/>
            <AppSvg className="background-svg background-svg_5" type='hull'/>
            <AppSvg className="background-svg background-svg_6" type='hard_disk'/>
        </>
    )
}