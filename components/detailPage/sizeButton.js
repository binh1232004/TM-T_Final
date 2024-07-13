'use client';
export default function SizeButton({ size, chosenSize, setChosenSize }) {
    const isActive = chosenSize === size;
    const buttonClassNotActive =
        'text-black border-2 font-bold border-black rounded w-1/5  py-3 m-5';
    const buttonClassActive =
        'text-white border-2 bg-black font-bold border-black rounded w-1/5  py-3 m-5';
    return (
        <button
            className={isActive ? buttonClassActive : buttonClassNotActive}
            onClick={() => {
                setChosenSize(size);
            }}
        >
            {size}
        </button>
    );
}
