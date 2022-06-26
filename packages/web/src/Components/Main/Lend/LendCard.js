import React from 'react'
import ConfirmLending from './ConfirmLending'
import PriceInput from './PriceInput'
import ChainList from './ChainList'

const LendCard = () => {
  return (
    <div>
        <h2>Lend 'n Earn</h2>
        <PriceInput/>
        <ChainList/>
        <ConfirmLending/>
    </div>
  )
}

export default LendCard