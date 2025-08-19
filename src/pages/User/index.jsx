import useTitle from "@/hooks/useTitle";

const User = () => {
    // 设置页面标题
    useTitle("我的");
    return (
        <>
            <h2>User Page</h2>
        </>
    )
}

export default User;