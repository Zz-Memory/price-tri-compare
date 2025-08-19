import useTitle from "@/hooks/useTitle"

const Home = () => {
    useTitle("首页")
    return (
        <div>
            <h2>Home Page</h2>
        </div>
    )
}

export default Home