// utils/formatters.ts
export const formatPhoneNumber = (text: string): string => {
    const numbers = text.replace(/[^\d]/g, '');

    if (numbers.length > 11) {
        return text.slice(0, -1);
    }

    if (numbers.length <= 3) {
        return numbers;
    } else if (numbers.length <= 7) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
};