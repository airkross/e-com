// Фильтр для определения нужной приставки к кол-ву звезд

export default function countStars(count) {
    if (count == 1) {
        return count + ' звезда';
    } else if (count > 1 && count < 5) {
        return count + ' звезды';
    } else {
        return count + ' звезд';
    }
}