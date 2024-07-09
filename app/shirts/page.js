const Shirt = () => {
    return Array(100).fill(0).map((_, i) => {
        return <p key={i}>Shirt page</p>;
    });
};

export default Shirt;
