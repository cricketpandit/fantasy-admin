import React, { useState } from 'react';
import Loader from '../CommanPage/Loader';
const Header = React.lazy(() => import('./layout/header'));
const Footer = React.lazy(() => import('./layout/footer'));
const MainPage = React.lazy(() => import('./index'));

const Home = () => {
    const [visible] = useState(false);
    return (
        <div className={"full_container"}>
            <Loader className={"overlay-loader"} visible={visible} />
            <Header />
            <MainPage />
            <Footer />
        </div>
    );
}
export default Home;
