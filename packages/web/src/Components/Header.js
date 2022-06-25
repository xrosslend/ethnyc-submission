import React from 'react'
import About from './Header/About.js'
import Logo from './Header/Logo.js'
import Rent from './Header/Rent.js'
import Lend from './Header/Lend.js'
import WalletConnect from './Header/WalletConnect.js'
import './Header.css'




const Header = () => {
  return (
    <div>
        <Logo/>
        <About/>
        <Rent/>
        <Lend/>
        <WalletConnect/>
    </div>
  )
}

export default Header

