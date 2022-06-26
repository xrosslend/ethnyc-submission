import React from 'react'
import ConfirmLending from './ConfirmLending'
import PriceInput from './PriceInput'
import ChainList from './ChainList'

const LendCard = () => {
  return (
    <div>
        <PriceInput/>
        <ChainList/>
        <ConfirmLending/>
    </div>
  )
}

export default LendCard