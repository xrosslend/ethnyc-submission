import React from 'react'

const ChainList = () => {
  return (
    <div>
        <p>Which chain would you like to accept?</p>
        <label for="boba">
             <input type="checkbox" name="boba" value=""/>  boba 
        </label>
        <label for="Polygon">
             <input type="checkbox" name="Polygon" value=""/>  Polygon 
        </label>
        <label for="Optimism">
             <input type="checkbox" name="Optimism" value=""/>  Optimism 
        </label>
        <label for="Gnosis Chain">
             <input type="checkbox" name="Gnosis Chain" value=""/>  Gnosis Chain 
        </label>
    </div>
  )
}

export default ChainList