import React from 'react'

const PriceInput = () => {
  return (
    <div>
        <p>Price per day</p>
        <input
            onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                }
            }}
        />
    </div>
  )
}

export default PriceInput