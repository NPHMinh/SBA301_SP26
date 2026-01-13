import React, { useState } from 'react';

function TestCount(){
    const [count, setCount] = useState(0);
    const handleIncrease = () => {
        setCount(count + 1);
    }

    const handleDecrease = () => {
        setCount(count - 1);
    }

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={handleIncrease}>
                Increase
            </button>
            <button onClick={handleDecrease}>
                Decrease
            </button>
        </div>
    );
}
export default TestCount;
