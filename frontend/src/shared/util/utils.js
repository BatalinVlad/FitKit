
export const getStars = starsCounter => {
    let stars = '';
    for (let i = 0; i < starsCounter; i++) {
        stars = stars + '⭐';
    }
    for (let i = stars.length; i < 5; i++) {
        stars = stars + '☆';
    }
    return (stars);
};
