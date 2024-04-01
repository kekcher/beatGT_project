import '../global_styles/app.scss';

import AppSvg from '../svg/AppSvg';

export function Loader() {
    return (
        <div className='loader-container'>
            <div className='loader-container_loader-box'>
                <AppSvg className='loader-container_loader-box__icon loader-icon-1' type='gpu' />
                <AppSvg className='loader-container_loader-box__icon loader-icon-2' type='cpu' />
                <AppSvg className='loader-container_loader-box__icon loader-icon-3' type='cooler' />
                <AppSvg className='loader-container_loader-box__icon loader-icon-4' type='ram' />
            </div>
            <p className='loader-container__note'>Идёт загрузка...</p>
        </div>
    )
}

export function PageLoader() {
    return (
        <div className='page-loader-container'>
            <div className='page-loader-container_loader-box'>
                <AppSvg className='page-loader-container_loader-box__icon loader-icon-1' type='gpu' />
                <AppSvg className='page-loader-container_loader-box__icon loader-icon-2' type='cpu' />
                <AppSvg className='page-loader-container_loader-box__icon loader-icon-3' type='cooler' />
                <AppSvg className='page-loader-container_loader-box__icon loader-icon-4' type='ram' />
            </div>
            <p className='page-loader-container__note'>Идёт загрузка...</p>
        </div>
    )
}