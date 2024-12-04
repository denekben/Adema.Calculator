interface Props {
    payload: string
};

const Header = (props : Props) => {
    return (
        <h1 className="text-5xl font-bold text-left mb-2 mt-2">
            {props.payload}
        </h1>
    );
};

export default Header;