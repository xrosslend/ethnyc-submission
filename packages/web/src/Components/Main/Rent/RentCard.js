import React from 'react'
import ConfirmRenting from './ConfirmRenting'
import RentDuration from './RentDuration'
import TotalSum from './TotalSum'

const RentCard = () => {
  return (
    <div>
        <h2>Rent 'n Enjoy</h2>
        <RentDuration/>
        <TotalSum/>
        <ConfirmRenting/>
    </div>
  )
}

export default RentCard