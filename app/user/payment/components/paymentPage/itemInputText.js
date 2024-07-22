'use client';
export default function ItemInputText({
    forPropertyLabel,
    labelValue,
    idInputValue,
    widthInputValue,
    placeholderInputValue,
    inputValue = '',
    readOnly = false,
    required = false,
    onChange = () => {},
}) {
    const defaultStyle = 'border border-gray-300 rounded px-3 py-2 text-sm';
    const style = defaultStyle + ' ' + widthInputValue;
    return (
        <div className="flex flex-col space-y-1 items-start w-full sm:items-start">
            <label className="text-base text-gray-500">
                {labelValue}
                {required && (
                    <span className="text-sm text-red-500"> required</span>
                )}
            </label>
            <input
                className={style}
                type="text"
                id={idInputValue}
                style={{ width: widthInputValue }}
                placeholder={placeholderInputValue}
                {...(inputValue !== '' ? { value: inputValue } : {})}
                readOnly={readOnly}
                onChange={onChange}
            />
        </div>
    );
}
