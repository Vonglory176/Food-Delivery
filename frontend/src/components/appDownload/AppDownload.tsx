import React from 'react'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>For Better Experience Download <br /> Our App</p>
        <div className="app-download-platforms">
            <img src={assets.play_store} alt="play-store" />
            <img src={assets.app_store} alt="app-store" />
        </div>
    </div>
  )
}

export default AppDownload
