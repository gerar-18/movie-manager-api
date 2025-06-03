import { registerDecorator, ValidationOptions } from "class-validator";

export function IsDateFormat(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "isDateFormat",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (typeof value !== "string") return false;

                    const regex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!regex.test(value)) return false;

                    const [year, month, day] = value.split("-").map(Number);

                    const date = new Date(year, month - 1, day);

                    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
                },
                defaultMessage(): string {
                    return "Date must be in the format YYYY-MM-DD and be a valid date";
                },
            },
        });
    };
}
