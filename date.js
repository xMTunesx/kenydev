function getDate()  {
    let date = new Date();        //** Mounth Date */
    let options = {              //** Options for the Date Format */
        day: 'numeric',
        weekday: 'long',
        month: 'long'
    };
    const today = date.toLocaleDateString('de-DE', options); //* Format the Date
    return today;
};

function getDay()  {
    let date = new Date();        //** Mounth Date */
    let options = {              //** Options for the Date Format */
        weekday: 'long',
    };
    const today = date.toLocaleDateString('de-DE', options); //* Format the Date
    return today;
};
