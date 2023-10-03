interface ValidationResult {
    valid: boolean;
    message?: string;
}
export class Validation {
    validateData(data: {
        surname: string,
        name: string,
        reasone: string,
        birthDate: string,
        icn: string,
        residence: string,
        city: string,
        cityPart: string,
        street: string,
        arrivalDate: string,
        departureDate: string
    }): ValidationResult {
        // Check for required fields
        if (!data.surname || !data.name || !data.reasone || !data.birthDate || !data.icn || !data.residence || !data.city || !data.cityPart || !data.street || !data.arrivalDate || !data.departureDate) {
            return { valid: false, message: 'Missing required fields.' };
        }
        if (data.surname.trim() === '' || data.name.trim() === '' || data.reasone.trim() === '' || data.birthDate.trim() === '' || data.icn.trim() === '' || data.residence.trim() === '' || data.city.trim() === '' || data.cityPart.trim() === '' || data.street.trim() === '' || data.arrivalDate.trim() === '' || data.departureDate.trim() === '') {
            return { valid: false, message: 'Missing required fields.' };
        }
        return { valid: true };
    }
}