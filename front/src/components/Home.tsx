import { Fragment } from "react"


const HomeComponent = () => {
    return (
        <Fragment>
            <h1> Welcome to your personal calendar</h1>
            <h2> Here you can assign new categories and the initial ones: Holidays, Work </h2>
            <h3> Click on Categories tab to manage your categories.</h3>
            <h3> Click on Calendar tab to manage your days into your personal calendar.</h3>
        </Fragment>
    );
}

export default HomeComponent;
