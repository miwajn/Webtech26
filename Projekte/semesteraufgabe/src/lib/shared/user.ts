export interface User {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;      // Für Login relevant
    ipaddress: string;
    password?: string;   // Für Login relevant
}
