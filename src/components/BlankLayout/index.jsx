import {
    Outlet
} from 'react-router-dom'
const BlankLayout = () => {
    return (
        <>
            <h1>Blank LayOut</h1>
            <Outlet />
        </>
    )
}

export default BlankLayout;