import React from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loaders from "react-loader-spinner";
const Loader = (props) => {
    return (
        <Loaders
            type="Oval"
            color="#00BFFF"
            height={100}
            width={100}
            visible={props.visible}
            className={'overlay'}
        />
    );
}

export default Loader;
