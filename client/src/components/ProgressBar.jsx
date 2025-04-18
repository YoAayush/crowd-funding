import React from 'react'

const ProgressBar = ({ progressPercentage }) => {
    return (
        <div className='h-1 w-full bg-gray-300'>
            <div
                style={{ width: `${progressPercentage}%`}}
                className={'h-full bg-green-600'}>
            </div>
        </div>
    );
};

export default ProgressBar
