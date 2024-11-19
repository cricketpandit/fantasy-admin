import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import BoosterList from './BoosterList';
const BoosterShop = () => {
  const [visible] = useState(false);
  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <div className='booster_shop'>        
        <BoosterList/>
      </div>
    </div>
  )
}

export default BoosterShop