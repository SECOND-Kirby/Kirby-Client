export interface SignupFormData {
    name: string;
    email: string;
    phoneNumber: string;
    username: string;
    password: string;
    passwordConfirm: string;
}

export interface FieldErrors {
    [key: string]: string;
}