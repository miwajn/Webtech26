export interface User {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;      // Für Login relevant
    password?: string;   // Für Login relevant
}
