// import React from 'react'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br /> Our App</p>
      <div className="app-download-platforms">
        <a href="https://play.google.com" target='_blank' aria-label='Play Store'><img src={assets.play_store} alt="play-store" /></a>
        <a href="https://apps.apple.com" target='_blank' aria-label='App Store'><img src={assets.app_store} alt="app-store" /></a>
      </div>
    </div>
  )
}

export default AppDownload
